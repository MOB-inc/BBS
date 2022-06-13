import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const Explanation = (props) => {
  const { t } = useTranslation(['explanation']);
  const { screen, isConnectDisp, isPhraseDisp } = props;
  return (
    <div className="explanation">
      <p>{t(`explanation:${screen}`)}</p>
      <p>
        {isConnectDisp && (
          <>
            {t('explanation:NOT_CONNECT_YET')}
            <NavLink to="/locations">{t('explanation:HERE')}</NavLink>
          </>
        )}
      </p>
      <p>
        {isPhraseDisp && (
          <>
            <NavLink to="/locations/fixed-phrase">
              {t('explanation:FIXED_PHRASE')}
            </NavLink>
            {t('explanation:LINK_PHRASE_CONFIG')}
          </>
        )}
      </p>
    </div>
  );
};

Explanation.propTypes = {
  screen: PropTypes.string,
  isConnectDisp: PropTypes.bool,
  isPhraseDisp: PropTypes.bool,
};

Explanation.defaultProps = {
  screen: '',
  isConnectDisp: false,
  isPhraseDisp: false,
};
export default Explanation;
