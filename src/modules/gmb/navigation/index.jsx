import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './index.scss';

function LocationNavigation() {
  const { t } = useTranslation(['gmb']);
  const url = '/gmb';
  return (
    <div className="navigation">
      <div className="tab">
        <NavLink to={`${url}/reviews`} activeClassName="active">
          {t('gmb:REVIEW')}
        </NavLink>
      </div>
      <div className="tab">
        <NavLink to={`${url}/posts`} activeClassName="active">
          {t('gmb:POST')}
        </NavLink>
      </div>
    </div>
  );
}

export default LocationNavigation;
