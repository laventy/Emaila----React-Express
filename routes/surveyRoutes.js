const mongoose = require("mongoose");
const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");

const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("Survey");

module.exports = app => {
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const parser = new Path("/api/surveys/:surveyId/:choice");

    // Sanitize the events data from sendGrid
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = parser.test(new URL(url).pathname);

        if (match) {
          return { email, ...match };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        // Update the corresponding survey in the mongodb
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: {
                email,
                responded: false
              }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: {
              "recipients.$.responded": true,
              lastResponded: new Date()
            }
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      body,
      subject,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    try {
      // Greate place to send an email!
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();

      // Save survey to the database
      await survey.save();

      // Reduce one credit
      req.user.credits -= 1;
      const user = await req.user.save();

      // Send the user with updated credits back
      res.send(user);
    } catch (error) {
      // 422: Unprocessable Entity
      res.status(422).send(error);
    }
  });
};
