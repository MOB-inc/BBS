import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import config from '../../OEMConfig';
import './navigation.scss';

// ---------------------------------------------------
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// ---------------------------------------------------


function LocationNavigation() {
  const { t } = useTranslation(['location']);
  const url = '/locations';
  // toggle button 
	const [alignment, setAlignment] = React.useState('first');
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <ToggleButtonGroup
      className="location-navigation"
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      
    >
      <ToggleButton value="first" aria-label="left aligned">
        <NavLink to={`${url}/linkage`} activeClassName="active">
          {t('location:COMMON.LINK_INFO')}
        </NavLink>
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <NavLink to={`${url}/info`} activeClassName="active">
          {t('location:COMMON.LOCATION_INFO')}
        </NavLink>
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <NavLink to={`${url}/contract`} activeClassName="active">
          {t('location:COMMON.CONTRACT_INFO')}
        </NavLink>
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified">
        <NavLink to={`${url}/fixed_phrases`} activeClassName="active">
          {t('location:COMMON.PHRASE_INFO')}
        </NavLink>
      </ToggleButton>
    </ToggleButtonGroup>
    // <div className="location-navigation">
      
    //   <div className="tab">
    //     <NavLink to={`${url}/linkage`} activeClassName="active">
    //       {t('location:COMMON.LINK_INFO')}
    //     </NavLink>
    //   </div>
    //   <div className="tab">
    //     <NavLink to={`${url}/info`} activeClassName="active">
    //       {t('location:COMMON.LOCATION_INFO')}
    //     </NavLink>
    //   </div>
    //   {!config().is_hide_contract && (
    //     <div className="tab">
    //       <NavLink to={`${url}/contract`} activeClassName="active">
    //         {t('location:COMMON.CONTRACT_INFO')}
    //       </NavLink>
    //     </div>
    //   )}
    //   <div className="tab">
    //     <NavLink to={`${url}/fixed-phrase`} activeClassName="active">
    //       {t('location:COMMON.BULK_EDIT')}
    //     </NavLink>
    //   </div>
    // </div>
  );
}

export default LocationNavigation;
