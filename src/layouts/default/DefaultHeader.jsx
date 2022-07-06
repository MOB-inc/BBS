import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from 'use-http';
import { CDropdown, CDropdownToggle } from '@coreui/react';
// import { CDropdown } from '@coreui/react';
import { useTranslation } from 'react-i18next';
// import { isMobile } from 'react-device-detect';
import { AppContext } from '../../commons/helpers/appContext';
import LangToggler from '../../commons/components/LangToggler';
import { ReactComponent as UserIcon } from '../../commons/icons/header-user-icon.svg';
import { ReactComponent as BellIcon } from '../../commons/icons/header-notification.svg';
import { ReactComponent as BurgerIcon } from '../../commons/icons/burger.svg';
import { ReactComponent as HeaderRecognzationIcon } from '../../commons/icons/header-recognzation.svg';

import {
  RECOGNITION,
  APPROVAL_REQUEST,
  // LOGOUT,
  // INQUIRY,
} from '../../commons/constants/url';
import { BOOK_ID, BRIDGE_BOOK_ID } from '../../commons/constants/key';
import './default_header.scss';
import config from '../../OEMConfig';

const ShopList = React.lazy(() => import('../../commons/components/ShopList'));
const NotificationList = React.lazy(() =>
  import('../../commons/components/NotificationList'),
);

function DefaultHeader() {
  const { t } = useTranslation();
  const {
    user,
    recognitionCount,
    setRecognitionCount,
    closeSidebar,
    setCloseSidebar,
    menuMode,
    services,
  } = useContext(AppContext);
  const [shopVisibility, setShopVisibility] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showRecognition, setShowRecognition] = useState(false);
  const history = useHistory();
  // const logout = () => history.push(LOGOUT);
  // const inquiry = () => history.push(INQUIRY);
  const recognition = () => {
    setShowRecognition(!showRecognition);
    history.push(RECOGNITION);
  };
  const { get: getSummary } = useFetch(APPROVAL_REQUEST);
  useEffect(async () => {
    const response = await getSummary();
    if (response) {
      const listCount = response?.result?.summary?.listCount || 0;
      const remandCount = response?.result?.summary?.remandCount || 0;
      setRecognitionCount(listCount + remandCount);
    }
    // if (isMobile) {
    //   setCloseSidebar(true);
    // }
  }, [history.location.pathname]);

  const togglecloseSidebar = async () => {
    setCloseSidebar(!closeSidebar);
  };
  // const locationAdd = () => {
  //   const addlocationurl = config().app_location_add_url;
  //   window.open(addlocationurl, '_blank');
  // };
  return (
    <div
      className={`default_header row ${
        menuMode === 'sidebar' ? 'default_header--sidebar' : ''
      }`}
      style={{
        backgroundColor: config().header_background_color,
				color: config().header_text_color,
      }}
    >
      <div className="left col-xs-12 col-md-6">
        <div className="burger">
          <BurgerIcon
            style={{ fill: config().header_text_color }}
            onClick={() => togglecloseSidebar()}
          />
        </div>
        <div className="logo">
          <img src={config().header_logo_image_path} alt="Logo" height="42px" />
          {/* <img src='/images/logoipsum-logo-54 1.png' alt="Logo" height="42px" /> */}
        </div>
        <div className="lang">
          <LangToggler />
        </div>
      </div>

      <div className="right col-xs-12 col-md-6 mobile-display-none">
        {menuMode === 'sidebar' ? (
          <>
            <div
              className={recognitionCount === 0 ? 'menu' : 'menu-visible'}
              onClick={recognition}
              role="presentation"
              style={{
                color: config().header_text_color,
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <div className="header-recog-box">
                <HeaderRecognzationIcon
                  className="icon-svg"
                  style={{ fill: config().header_text_color, fillOpacity: 1 }}
                />
                {recognitionCount !== 0 ? (
                  <>
                    <div className="total-number">
                      ({recognitionCount})
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="header-recog">
                {t('common:HEADER.RECOGNITION')}
              </div>
            </div>
            <CDropdown
              className={`${
                shopVisibility
                  ? 'header-location-list-visible'
                  : 'header-location-list'
              }`}
              onClick={() => setShopVisibility(!shopVisibility)}
            >
              <CDropdownToggle
                caret
                style={{ color: config().header_text_color }}
              >
                {t('common:HEADER.LOCATIONS')}
              </CDropdownToggle>
            </CDropdown>
          </>
        ) : (
          <></>
        )}
        {(services.has(BOOK_ID) || services.has(BRIDGE_BOOK_ID)) && (
          <CDropdown
            className="notification-list bell"
            onClick={() => setShowNotification(!showNotification)}
          >
            <div>
              <BellIcon
                className="icon-svg"
                style={{ fill: config().header_text_color, fillOpacity: 1 }}
              />
            </div>
            <div
              className="header-notification-text menu"
              style={{
                color: config().header_text_color,
                alignItems: 'center',
                display: 'flex',
              }}
            >
              {t('common:HEADER.NOTIFICATION')}
            </div>
          </CDropdown>
        )}
        <div
          className={`user-group-div ${
            menuMode === 'sidebar' ? 'user-group-div--sidebar' : ''
          }`}
        >
          <div className="logout-hover">
            <UserIcon
              className="icon-svg"
              style={{ fill: config().header_text_color, fillOpacity: 1 }}
            />
          </div>
          <div className="info logout-hover">
            <div className="company logout-hover">{user?.account?.name}</div>
            {/* <div className="id logout-hover">
              <div className="logout-hover">
                <div className="logout-hover">
                  {user?.name}
                  <ul className="logout-menu">
                    <li className="logout-li logout-li-border">
                      <a className="logout-a" href="#a">
                        {config().app_location_add_url && (
                          <div
                            className="location-add logout-text"
                            role="presentation"
                            onClick={locationAdd}
                          >
                            {t(config().app_location_add_text)}
                          </div>
                        )}
                      </a>
                    </li>
                    <li className="logout-li-border">
                      <a className="logout-a" href="#a">
                        <div
                          className="pills logout-text"
                          role="presentation"
                          onClick={inquiry}
                        >
                          {t('common:SIDEBAR.INQUIRY')}
                        </div>
                      </a>
                    </li>
                    <li className="logout-li-border">
                      <a className="logout-a" href="#a">
                        <div
                          className="pills logout-text"
                          role="presentation"
                          onClick={logout}
                        >
                          {t('common:SIDEBAR.LOGOUT')}
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <ShopList
        show={shopVisibility}
        onClose={() => setShopVisibility(false)}
      />
      <NotificationList
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default DefaultHeader;
