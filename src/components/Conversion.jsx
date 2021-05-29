import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { connect } from "react-redux";

import FeesTable from "./FeesTable";
function Conversion({ originAmount, dispatch }) {
  const originAmountInputRef = useRef(null);
  // const [originAmount, setOriginAmount] = useState("0.00");
  const [destinationAmount, setDestinationAmount] = useState("0.00");
  const [originCurrency, setOriginCurrency] = useState("USD");
  const [destinationCurrency, setDestinationCurrency] = useState("EUR");
  const [conversionRate, setConversionRate] = useState(1.5);
  const [changedField, setChangedField] = useState("");
  const [feeAmount, setFeeAmount] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [errorMsg, setErrorMsg] = useState("");

  const makeConversionAjaxCall = useDebouncedCallback(
    _makeConversionAjaxCall,
    350
  );
  const makeFeeAjaxCall = useDebouncedCallback(_makeFeeAjaxCall, 350);
  // we'll handle all failures the same
  function handleAjaxFailure(resp) {
    var msg = "Error. Please try again later.";

    if (resp && resp.request && resp.request.status === 0) {
      msg = "Oh no! App appears to be offline.";
    }

    setErrorMsg(msg);
  }

  useEffect(() => {
    originAmountInputRef.current.focus();
    if (errorMsg) {
      setErrorMsg("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (changedField) {
      setChangedField("");
      const payload = {
        originAmount: originAmount,
        destAmount: destinationAmount,
        originCurrency: originCurrency,
        destCurrency: destinationCurrency,
        calcOriginAmount: changedField.includes("destinationAmount"),
      };
      makeConversionAjaxCall(
        payload,
        (resp) => {
          if (errorMsg) {
            setErrorMsg("");
          }
          const {
            originAmount: newOriginAmount,
            destAmount: newDestinationAmount,
            xRate: newConversionRate,
          } = resp || {};
          if (changedField.includes("destinationAmount")) {
            // setOriginAmount(newOriginAmount);
            dispatch({
              type: "SET_ORIGIN_AMT",
              data: newOriginAmount,
            });
          } else {
            setDestinationAmount(newDestinationAmount);
          }
          setConversionRate(newConversionRate);
        },
        handleAjaxFailure
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedField]);

  useEffect(() => {
    makeFeeAjaxCall(
      {
        originAmount: originAmount,
        originCurrency: originCurrency,
        destCurrency: destinationCurrency,
      },
      (feeResp) => {
        if (errorMsg) {
          setErrorMsg("");
        }
        setFeeAmount(feeResp.feeAmount);
      },
      handleAjaxFailure
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originAmount, originCurrency, destinationCurrency]);

  useEffect(() => {
    const newTotal = parseFloat(originAmount, 10) + parseFloat(feeAmount, 10);
    setTotalCost(parseFloat(newTotal));
  }, [originAmount, feeAmount]);

  function handleChange(e) {
    const { name, value } = e.target;
    switch (name) {
      case "originAmount":
        // setOriginAmount(value);
        dispatch({
          type: "SET_ORIGIN_AMT",
          data: value,
        });
        break;
      case "destinationAmount":
        setDestinationAmount(value);
        break;
      case "originCurrency":
        setOriginCurrency(value);
        break;
      case "destinationCurrency":
        setDestinationCurrency(value);
        break;
      default:
        console.log(`Unknown field ${name}`);
    }
    setChangedField(name);
  }

  // this is debounced in `componentDidMount()` as this.makeConversionAjaxCall()
  function _makeConversionAjaxCall(payload, successCallback, failureCallback) {
    axios
      .get("http://localhost:3005/api/conversion", {
        params: payload,
      })
      .then((resp) => {
        successCallback(resp.data);
      })
      .catch(failureCallback);
  }
  function _makeFeeAjaxCall(payload, successCallback, failureCallback) {
    axios
      .get("http://localhost:3005/api/fees", {
        params: payload,
      })
      .then((resp) => {
        successCallback(resp.data);
      })
      .catch(failureCallback);
  }

  return (
    <div>
      {errorMsg && <div className="errorMsg">{errorMsg}</div>}
      <label>Convert</label>&nbsp;
      <input
        name="originAmount"
        className="amount-field"
        ref={originAmountInputRef}
        onChange={handleChange}
        // onChange={handleOriginAmountChange}
        value={originAmount}
      />
      <select
        name="originCurrency"
        value={originCurrency}
        onChange={handleChange}
        // onChange={handleOriginCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
      </select>
      to{" "}
      <input
        name="destinationAmount"
        className="amount-field"
        onChange={handleChange}
        // onChange={handleDestAmountChange}
        value={destinationAmount}
      />
      &nbsp;
      <select
        name="destinationCurrency"
        value={destinationCurrency}
        onChange={handleChange}
        // onChange={handleDestCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
      </select>
      <br />
      <br />
      <br />
      <FeesTable
        originCurrency={originCurrency}
        destinationCurrency={destinationCurrency}
        conversionRate={conversionRate}
        fee={feeAmount}
        total={totalCost}
      />
    </div>
  );
}

export default connect((state, props) => {
  const { originAmount } = state;
  return {
    originAmount,
  };
})(Conversion);
