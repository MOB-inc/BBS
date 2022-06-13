import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Star = ({ marked, starId }) => {
  return (
    <span data-star-id={starId} className="star" role="button">
      {marked ? '\u2605' : '\u2606'}
    </span>
  );
};
Star.propTypes = {
  marked: PropTypes.bool.isRequired,
  starId: PropTypes.number.isRequired,
};

const StarRating = ({ value }) => {
  const [rating] = React.useState(Math.round(parseInt(value, 10) || 0));
  return (
    <div role="presentation">
      {Array.from({ length: 5 }, (v, i) => (
        <Star starId={i + 1} key={`star_${i + 1}`} marked={i < rating} />
      ))}
    </div>
  );
};
StarRating.propTypes = {
  value: PropTypes.number.isRequired,
};

export default StarRating;
