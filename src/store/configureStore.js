import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

const defaultState = {
  originAmount: "0.00",
};

function amount(state = defaultState, action) {
  switch (action.type) {
    case "SET_ORIGIN_AMT":
      return {
        ...state,
        originAmount: action.data,
      };
    default:
      return state;
  }
}

const store = createStore(amount, applyMiddleware(thunk, logger));

export default store;
