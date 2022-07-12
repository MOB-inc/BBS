import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { AppContext } from '../../../commons/helpers/appContext';
import './navigation_info.scss';

function BasicInfoNavigation() {
  const { t } = useTranslation(['basic_info']);
  const { hasFoodMenus } = useContext(AppContext);
  const { hasServiceItems } = useContext(AppContext);
  const url = '/basic-info';
  const [alignment, setAlignment] = React.useState('first');
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <ToggleButtonGroup
        className="info-navigation"
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
      <ToggleButton value="first" aria-label="left aligned" className="tab">
        <NavLink to={`${url}/info`} activeClassName="active">
          {t('basic_info:BASIC_INFO.BASIC_INFO_TAB')}
        </NavLink>
      </ToggleButton>
      {hasFoodMenus && (
        <ToggleButton value="second" aria-label="left aligned" className="tab">
          <NavLink to={`${url}/menu`} activeClassName="active">
            {t('basic_info:BASIC_INFO.MENU_TAB')}
          </NavLink>
        </ToggleButton>    
      )}
      {hasServiceItems && (
        <ToggleButton value="third" aria-label="left aligned" className="tab">
          <NavLink to={`${url}/services`} activeClassName="active">
            {t('basic_info:BASIC_INFO.SERVICES_TAB')}
          </NavLink>
        </ToggleButton>  
      )}
      {/* <div className="tab">
        <NavLink to={`${url}/products`} activeClassName="active">
          {t('basic_info:BASIC_INFO.PRODUCTS_TAB')}
        </NavLink>
      </div> */}
      <ToggleButton value="fourth" aria-label="left aligned" className="tab">
        <NavLink to={`${url}/image`} activeClassName="active">
          {t('basic_info:BASIC_INFO.IMAGE_TAB')}
        </NavLink>
      </ToggleButton>
      <ToggleButton value="fifth" aria-label="left aligned" className="tab">
        <NavLink to={`${url}/bulk`} activeClassName="active">
          {t('basic_info:BASIC_INFO.BULK_UPDATE_TAB')}
        </NavLink>
      </ToggleButton>  
    </ToggleButtonGroup>
  );
}

export default BasicInfoNavigation;
