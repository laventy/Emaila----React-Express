import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import _ from "lodash";

import SurveyField from "./SurveyField";
import formFields from "./formFields";
import validateEmails from "../../utils/validateEmails";

// SurveyForm shows a form for a user to add input
class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, field => {
      return (
        <Field
          key={field.name}
          component={SurveyField}
          type="text"
          {...field}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">arrow_forward</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // The order is important!
  // The NoValue validation error will overwrite this one
  errors.recipients = validateEmails(values.recipients || "");

  // NoValue validation
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
