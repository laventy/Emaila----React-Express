import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";

import authReducer from "./authReducer";
import surveysReducer from "./surveysReducer";

// The key name for reduxFormReducer should be "form" but can be customized
export default combineReducers({
  auth: authReducer,
  form: reduxFormReducer,
  surveys: surveysReducer
});
