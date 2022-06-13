import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../commons/helpers/appContext';
import './navigation_info.scss';

function BasicInfoNavigation() {
  const { t } = useTranslation(['basic_info']);
  const { hasFoodMenus } = useContext(AppContext);
  const { hasServiceItems } = useContext(AppContext);
  const url = '/basic-info';
  return (
    <div className="info-navigation">
      <div className="tab">
        <NavLink to={`${url}/info`} activeClassName="active">
          {t('basic_info:BASIC_INFO.BASIC_INFO_TAB')}
        </NavLink>
      </div>
      {hasFoodMenus && (
        <div className="tab">
          <NavLink to={`${url}/menu`} activeClassName="active">
            {t('basic_info:BASIC_INFO.MENU_TAB')}
          </NavLink>
        </div>
      )}
      {hasServiceItems && (
        <div className="tab">
          <NavLink to={`${url}/services`} activeClassName="active">
            {t('basic_info:BASIC_INFO.SERVICES_TAB')}
          </NavLink>
        </div>
      )}
      {/* <div className="tab">
        <NavLink to={`${url}/products`} activeClassName="active">
          {t('basic_info:BASIC_INFO.PRODUCTS_TAB')}
        </NavLink>
      </div> */}
      <div className="tab">
        <NavLink to={`${url}/image`} activeClassName="active">
          {t('basic_info:BASIC_INFO.IMAGE_TAB')}
        </NavLink>
      </div>
      <div className="tab">
        <NavLink to={`${url}/bulk`} activeClassName="active">
          {t('basic_info:BASIC_INFO.BULK_UPDATE_TAB')}
        </NavLink>
      </div>
    </div>
  );
}

export default BasicInfoNavigation;
