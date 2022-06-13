import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
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
import { ReactComponent as LogoutIcon } from '../../commons/icons/sidebar/logout-mobile-sidebar.svg';
// import { ReactComponent as LangIcon } from '../../commons/icons/language-mobile-icon.svg'
// import LangToggler from '../../commons/components/LangToggler';

import config from '../../OEMConfig';
import './default_mobile_sidebar.scss';

const DefaultMobileSidebar = () => {
  const { closeSidebar, setCloseSidebar } = useContext(AppContext);
  const history = useHistory();
  const { t } = useTranslation();
  const logout = () => history.push(LOGOUT);
  const locationAdd = () => {
    const url = config().app_location_add_url;
    window.open(url, '_blank');
  };
  const releaseNote = () => {
    const url = config().app_release_note_url;
    window.open(url, '_blank');
  };
  const { isAdmin, services, user } = useContext(AppContext);

  const toggleDrawer = () => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setCloseSidebar(!closeSidebar);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="default_sidebar_mobile">
        <div className="default-sidebar-first-tab-height">
          <Box
            display="flex"
            alignItems="center"
            className="user-name-mobile-sidebar"
            role="presentation"
            onClick={logout}
          >
            {user?.account?.name}
          </Box>
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
            <NavLink
              to="/dashboard"
              activeClassName="selected"
              className="menu"
            >
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
            <NavLink
              to="/basic-info"
              activeClassName="selected"
              className="menu"
            >
              <Box display="flex" alignItems="center">
                <Box>
                  <BasicInfoIcon />
                </Box>
                <Box className="text">{t('common:SIDEBAR.BASIC_INFO')}</Box>
              </Box>
            </NavLink>
          )}
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
            <NavLink
              to="/inquiries"
              activeClassName="selected"
              className="menu"
            >
              <Box display="flex" alignItems="center">
                <Box>
                  <ContactIcon />
                </Box>
                <Box className="text">{t('common:SIDEBAR.INQUIRY')}</Box>
              </Box>
            </NavLink>
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
              <Box className="text">{t('common:SIDEBAR.RELEASE_NOTE')}</Box>
            </div>
          )}
        </div>
        <div>
          <Box
            display="flex"
            alignItems="center"
            className="pills pills-new"
            role="presentation"
            onClick={logout}
          >
            <Box>
              <LogoutIcon />
            </Box>
            <Box className="logout-button-mobile-sidebar">
              {t('common:SIDEBAR.LOGOUT')}
            </Box>
          </Box>
        </div>
        {/* <div>
							<Box display="flex" alignItems="center" className="pills pills-new" role="presentation">
								<Box>
									<LangIcon />
								</Box>
								<Box className="logout-button-mobile-sidebar">
									<LangToggler />
								</Box>
							</Box>
						</div> */}
      </div>
    </Box>
  );

  return (
    <div>
      <>
        <Drawer
          anchor="right"
          open={closeSidebar}
          onClose={toggleDrawer('right', false)}
        >
          {list('right')}
        </Drawer>
      </>
    </div>
  );
};

// DefaultMobileSidebar.propTypes = {

// };

export default DefaultMobileSidebar;
