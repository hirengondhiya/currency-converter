import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";

import FeesTable from "./FeesTable";
import * as actions from "../store/actions";
function Conversion({
  originAmount,
  destinationAmount,
  conversionRate,
  dispatch,
  feeAmount,
  totalCost,
}) {
  const originAmountInputRef = useRef(null);
  const [originCurrency, setOriginCurrency] = useState("USD");
  const [destinationCurrency, setDestinationCurrency] = useState("EUR");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    originAmountInputRef.current.focus();
    if (errorMsg) {
      setErrorMsg("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setZeroForEmpty(value) {
    return value || "0.0";
  }
  function handleChange(e) {
    let dispatchConversion = true;
    let dispatchFees = true;
    const { name, value } = e.target;
    switch (name) {
      case "originAmount":
        dispatch({
          type: "SET_ORIGIN_AMT",
          data: setZeroForEmpty(value),
        });
        break;
      case "destinationAmount":
        dispatchFees = false;
        dispatch({
          type: "SET_DESTINATION_AMT",
          data: setZeroForEmpty(value),
        });
        break;
      case "originCurrency":
        setOriginCurrency(value);
        break;
      case "destinationCurrency":
        setDestinationCurrency(value);
        break;
      default:
        dispatchFees = false;
        dispatchConversion = false;
        console.log(`Unknown field ${name}`);
    }
    if (dispatchConversion) {
      const payload = {
        originAmount: setZeroForEmpty(value),
        destAmount: setZeroForEmpty(value),
        originCurrency: originCurrency,
        destCurrency: destinationCurrency,
        calcOriginAmount: name.includes("destinationAmount"),
      };
      dispatch(actions.fetchConversionRate(payload));
    }
    if (dispatchFees) {
      const feesPayload = {
        originAmount: setZeroForEmpty(value),
        originCurrency: originCurrency,
        destCurrency: destinationCurrency,
      };
      dispatch(actions.fetchFees(feesPayload));
    }
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
        value={originAmount}
      />
      <select
        name="originCurrency"
        value={originCurrency}
        onChange={handleChange}
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
        value={destinationAmount}
      />
      &nbsp;
      <select
        name="destinationCurrency"
        value={destinationCurrency}
        onChange={handleChange}
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
  const {
    originAmount,
    destinationAmount,
    conversionRate,
    feeAmount,
    totalCost,
  } = state;
  return {
    originAmount,
    destinationAmount,
    conversionRate,
    feeAmount,
    totalCost,
  };
})(Conversion);
