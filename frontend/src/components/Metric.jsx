import PropTypes from 'prop-types';

export function Metric({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-green-600 mb-1">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

Metric.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};