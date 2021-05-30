import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { ACTION_TYPES } from "./constants";

const logger = createLogger({
  collapsed: true,
});
const defaultState = {
  originAmount: "0.00",
  destinationAmount: "0.00",
  conversionRate: 1.5,
  feeAmount: 0.0,
  totalCost: 0.0,
};

function amount(state = defaultState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_ORIGIN_AMT:
      return {
        ...state,
        originAmount: action.data,
      };
    case ACTION_TYPES.SET_DESTINATION_AMT:
      return {
        ...state,
        destinationAmount: action.data,
      };
    case ACTION_TYPES.REC_CONVERSION_SUCCESS:
      return {
        ...state,
        conversionRate: action.data.xRate,
        destinationAmount: action.data.destAmount,
      };
    case ACTION_TYPES.REC_FEES_SUCCESS:
      const newFeeAmount = action.data.feeAmount;
      const newTotalCost =
        parseFloat(state.originAmount, 10) + parseFloat(newFeeAmount, 10);
      return {
        ...state,
        feeAmount: newFeeAmount,
        totalCost: newTotalCost,
      };
    default:
      return state;
  }
}

const store = createStore(amount, applyMiddleware(thunk, logger));

export default store;
