//root reducer - will combine all reducers
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";

export default combineReducers({ alert, auth });
