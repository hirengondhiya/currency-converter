import axios from "axios";
import { debounce } from "lodash";
import { ACTION_TYPES } from "./constants";
export function changeOriginAmount(value) {
  return {
    type: ACTION_TYPES.SET_ORIGIN_AMT,
    data: value,
  };
}
export function changeDestinationAmount(value) {
  return {
    type: ACTION_TYPES.SET_DESTINATION_AMT,
    data: value,
  };
}
export function changeOriginCurrency(value) {
  return {
    type: ACTION_TYPES.SET_ORIGIN_CURR,
    data: value,
  };
}
export function changeDestinationCurrency(value) {
  return {
    type: ACTION_TYPES.SET_DESTINATION_CURR,
    data: value,
  };
}

export function fetchConversionRate(payload) {
  return (dispatch) => {
    makeConversionAjaxCall(dispatch, payload);
  };
}

function _makeConversionAjaxCall(dispatch, payload) {
  dispatch({
    type: ACTION_TYPES.REQ_CONVERSION,
    data: payload,
  });

  axios
    .get("http://localhost:3005/api/conversion", {
      params: payload,
    })
    .then((resp) => {
      dispatch({
        type: ACTION_TYPES.REC_CONVERSION_SUCCESS,
        data: resp.data,
      });
      if (payload.calcOriginAmount) {
        dispatch(changeOriginAmount(resp.data.originAmount));
        dispatch(
          fetchFees({ ...payload, originAmount: resp.data.originAmount })
        );
      } else {
        dispatch(changeDestinationAmount(resp.data.destAmount));
      }
    })
    .catch((resp) => {
      const msg = getErrorMsg(resp);
      dispatch({
        type: ACTION_TYPES.REC_CONVERSION_FAILURE,
        data: { msg, failedCall: "conversion" },
      });
    });
}

const makeConversionAjaxCall = debounce(_makeConversionAjaxCall, 300);

export function fetchFees(payload) {
  return (dispatch) => {
    makeFeesAjaxCall(dispatch, payload);
  };
}

function _makeFeeAjaxCall(dispatch, payload) {
  dispatch({
    type: ACTION_TYPES.REQ_FEES,
    data: payload,
  });

  axios
    .get("http://localhost:3005/api/fees", {
      params: payload,
    })
    .then((resp) => {
      dispatch({
        type: ACTION_TYPES.REC_FEES_SUCCESS,
        data: resp.data,
      });
    })
    .catch((resp) => {
      const msg = getErrorMsg(resp);

      dispatch({
        type: ACTION_TYPES.REC_FEES_FAILURE,
        data: { msg, failedCall: "fees" },
      });
    });
}

const makeFeesAjaxCall = debounce(_makeFeeAjaxCall, 300);

function getErrorMsg(resp) {
  let msg = "Error. Please try again later.";

  if (resp && resp.request && resp.request.status === 0) {
    msg = "Oh no! App appears to be offline.";
  }

  return msg;
}
