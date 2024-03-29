import PropTypes from "prop-types";
function FeesTable({
  conversionRate,
  fee,
  total,
  originCurrency,
  destinationCurrency,
}) {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Conversion Rate</td>
            <td>
              1 {originCurrency} -> {conversionRate.toFixed(2)}{" "}
              {destinationCurrency}
            </td>
          </tr>
          <tr>
            <td>Fee</td>
            <td>
              {fee.toFixed(2)} {originCurrency}
            </td>
          </tr>
          <tr>
            <td className="total-label">Total Cost</td>
            <td>
              {total.toFixed(2)} {originCurrency}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

FeesTable.propTypes = {
  conversionRate: PropTypes.number.isRequired,
  originCurrency: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  destinationCurrency: PropTypes.string.isRequired,
};

export default FeesTable;
