import { ACTION_TYPES } from "../constants";
const defaultState = {
  originAmount: "0.00",
  destinationAmount: "0.00",
  originCurrency: "USD",
  destinationCurrency: "EUR",
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
    case ACTION_TYPES.SET_ORIGIN_CURR:
      return {
        ...state,
        originCurrency: action.data,
      };
    case ACTION_TYPES.SET_DESTINATION_CURR:
      return {
        ...state,
        destinationCurrency: action.data,
      };
    case ACTION_TYPES.REC_CONVERSION_SUCCESS:
      return {
        ...state,
        conversionRate: action.data.xRate,
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

export { amount };
