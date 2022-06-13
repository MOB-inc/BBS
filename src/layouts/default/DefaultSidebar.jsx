import React, { useContext } from 'react';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import { NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../commons/helpers/appContext';
import { LOGOUT } from '../../commons/constants/url';
import {
  BRIDGE_ID,
  BOOK_ID,
  BRIDGE_BOOK_ID,
} from '../../commons/constants/key';
import { ReactComponent as DashboardIcon } from '../../commons/icons/sidebar/instagram.svg';
import { ReactComponent as TopIcon } from '../../commons/icons/sidebar/top.svg';
import { ReactComponent as PostReviewIcon } from '../../commons/icons/sidebar/google.svg';
import { ReactComponent as BasicInfoIcon } from '../../commons/icons/sidebar/basic-info.svg';
import { ReactComponent as LocationIcon } from '../../commons/icons/sidebar/location-new.svg';
import { ReactComponent as UserIcon } from '../../commons/icons/sidebar/user-new.svg';
import { ReactComponent as ContactIcon } from '../../commons/icons/sidebar/contact.svg';
import './default_sidebar.scss';
import config from '../../OEMConfig';

function Sidebar() {
  const { t } = useTranslation();
  const history = useHistory();
  const logout = () => history.push(LOGOUT);
  // const inquiry = () => history.push(INQUIRY);
  const locationAdd = () => {
    const url = config().app_location_add_url;
    window.open(url, '_blank');
  };
  const releaseNote = () => {
    const url = config().app_release_note_url;
    window.open(url, '_blank');
  };
  const { isAdmin, services } = useContext(AppContext);

  return (
    <div className="default_sidebar">
      <div className="default-sidebar-first-tab-height">
      {!config().is_hide_top && (
          <NavLink to="/top" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <TopIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.TOP')}</Box>
            </Box>
          </NavLink>
        )}
        {(services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID)) && (
          <NavLink to="/dashboard" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <DashboardIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.DASHBOARD')}</Box>
            </Box>
          </NavLink>
        )}
        {(services.has(BOOK_ID) || services.has(BRIDGE_BOOK_ID)) && (
          <NavLink to="/gmb" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <PostReviewIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.POST_REVIEW')}</Box>
            </Box>
          </NavLink>
        )}

        {(services.has(BOOK_ID) || services.has(BRIDGE_BOOK_ID)) && (
          <NavLink to="/basic-info" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <BasicInfoIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.BASIC_INFO')}</Box>
            </Box>
          </NavLink>
        )}
      </div>
      <div>
        <NavLink to="/locations" activeClassName="selected" className="menu">
          <Box display="flex" alignItems="center">
            <Box>
              <LocationIcon />
            </Box>
            <Box className="text">{t('common:SIDEBAR.LOCATION')}</Box>
          </Box>
        </NavLink>
        {isAdmin && (
          <NavLink to="/users" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <UserIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.USER')}</Box>
            </Box>
          </NavLink>
        )}
        {!config().is_hide_inquery && (
          <NavLink to="/inquiries" activeClassName="selected" className="menu">
            <Box display="flex" alignItems="center">
              <Box>
                <ContactIcon />
              </Box>
              <Box className="text">{t('common:SIDEBAR.INQUIRY')}</Box>
            </Box>
          </NavLink>
          //   <div className="pills" role="presentation" onClick={inquiry}>
          //   {t('common:SIDEBAR.INQUIRY')}
          // </div>
        )}
        <div className="divider" />
        {config().app_location_add_url && (
          <div className="menu" role="presentation" onClick={locationAdd}>
            <Box className="text">{t(config().app_location_add_text)}</Box>
          </div>
        )}
        <div className="divider" />
        {config().app_release_note_url && (
          <div className="menu" role="presentation" onClick={releaseNote}>
            <Box className="text">
              {t('common:SIDEBAR.RELEASE_NOTE')}
              <div className="updateDate">
                {t('common:SIDEBAR.UPDATE_DATE')}
              </div>
            </Box>
          </div>
        )}
        <div className="menu" role="presentation" onClick={logout}>
          <Box className="text">{t('common:SIDEBAR.LOGOUT')}</Box>
        </div>
      </div>

      {/* <Box minHeight="200px" /> */}
    </div>
  );
}

export default Sidebar;
