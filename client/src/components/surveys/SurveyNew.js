import React, { Component } from "react";
import { reduxForm } from "redux-form";

import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";

// SurveyNew shows SurveyForm and SurveyFormReview
class SurveyNew extends Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

// Make sure the data in the form will be cleared
// When the user navigate out of the surveyNew component
export default reduxForm({
  form: "surveyForm"
})(SurveyNew);
