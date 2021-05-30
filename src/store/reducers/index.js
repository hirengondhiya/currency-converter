import { combineReducers } from "redux";

import { amount } from "./amount";
import { errorMessage } from "./errorMessage";

export default combineReducers({ amount, errorMessage });
