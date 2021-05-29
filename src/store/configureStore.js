import { createStore } from "redux";

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

const store = createStore(amount);

export default store;
