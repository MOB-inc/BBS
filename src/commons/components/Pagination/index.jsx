/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { range } from '../../helpers/util';
import './index.scss';

function Pagination({ last, window, current: pointer, onPageChange }) {
  const perSide = Math.ceil((window - 1) / 2);
  const pager = [].concat(
    range(pointer - perSide < 1 ? 1 : pointer - perSide, pointer),
    range(pointer, Math.min(pointer + perSide, last) + 1),
  );

  return (
    <div className="pagination">
      {pointer > 1 && (
        <div role="presentation" onClick={() => onPageChange(pointer - 1)}>
          &#60;
        </div>
      )}
      {pager.map((page) => {
        return (
          <div
            role="presentation"
            onClick={() => onPageChange(page)}
            key={page}
            className={pointer === page ? 'active' : ''}
          >
            {page}
          </div>
        );
      })}
      {pointer < last && (
        <div role="presentation" onClick={() => onPageChange(pointer + 1)}>
          &#62;
        </div>
      )}
    </div>
  );
}

Pagination.propTypes = {
  last: PropTypes.number,
  window: PropTypes.number,
  current: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  window: 6,
  current: 1,
  last: 1,
};
export default Pagination;
