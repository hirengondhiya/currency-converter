import axios from "axios";
import { debounce } from "lodash";
import { ACTION_TYPES } from "./constants";
export function changeOriginAmount(value) {
  return {
    type: ACTION_TYPES.SET_ORIGIN_AMT,
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
        dispatch({
          type: ACTION_TYPES.SET_ORIGIN_AMT,
          data: resp.data.originAmount,
        });
        dispatch(
          fetchFees({ ...payload, originAmount: resp.data.originAmount })
        );
      } else {
        dispatch({
          type: ACTION_TYPES.SET_DESTINATION_AMT,
          data: resp.data.destAmount,
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: ACTION_TYPES.REC_CONVERSION_FAILURE,
        data: err,
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
    .catch((err) => {
      dispatch({
        type: ACTION_TYPES.REC_FEES_FAILURE,
        data: err,
      });
    });
}

const makeFeesAjaxCall = debounce(_makeFeeAjaxCall, 300);
