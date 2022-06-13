import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import config from '../../OEMConfig';

import './navigation.scss';

function LocationNavigation() {
  const { t } = useTranslation(['location']);
  const url = '/locations';
  return (
    <div className="location-navigation">
      <div className="tab">
        <NavLink to={`${url}/linkage`} activeClassName="active">
          {t('location:COMMON.LINK_INFO')}
        </NavLink>
      </div>
      <div className="tab">
        <NavLink to={`${url}/info`} activeClassName="active">
          {t('location:COMMON.LOCATION_INFO')}
        </NavLink>
      </div>
      {!config().is_hide_contract && (
        <div className="tab">
          <NavLink to={`${url}/contract`} activeClassName="active">
            {t('location:COMMON.CONTRACT_INFO')}
          </NavLink>
        </div>
      )}
      <div className="tab">
        <NavLink to={`${url}/fixed-phrase`} activeClassName="active">
          {t('location:COMMON.BULK_EDIT')}
        </NavLink>
      </div>
    </div>
  );
}

export default LocationNavigation;
