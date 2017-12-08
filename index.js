const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");

// Require Middlewares
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const app = express();

// MongoDB
mongoose.connect(keys.mongoURI);
require("./models/User");
require("./models/Survey");

/*
  Middlewares
*/
app.use(bodyParser.json());

// Configure passport library
// And add multiple middleware
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport-related settings
require("./services/passport");

// Routes
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

// Express Configuration
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it does not recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
