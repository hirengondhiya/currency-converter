import { ACTION_TYPES as actionTypes } from "../constants";
const defaultState = {
  errorMsg: "",
};

function errorMessage(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.REC_CONVERSION_SUCCESS:
    case actionTypes.REC_FEES_SUCCESS:
      return {
        ...state,
        errorMsg: "",
      };

    case actionTypes.REC_CONVERSION_FAILURE:
    case actionTypes.REC_FEES_FAILURE:
      return {
        ...state,
        errorMsg: action.data.msg,
      };
    default:
      return state;
  }
}

export { errorMessage };
