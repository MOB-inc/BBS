/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CDropdown, CDropdownToggle } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../commons/helpers/appContext';
// import { ReactComponent as CautionIcon } from '../../commons/icons/caution.svg';
import { RECOGNITION } from '../../commons/constants/url';
import {
  BRIDGE_ID,
  BOOK_ID,
  BRIDGE_BOOK_ID,
} from '../../commons/constants/key';
import './menubar.scss';

const ShopList = React.lazy(() => import('../../commons/components/ShopList'));

function Menubar() {
  const [activeMenu, setActiveMenu] = useState('');
  const { pathname } = useLocation();
  const { t } = useTranslation(['gmb', 'basic_info', 'location', 'common']);
  const urlGmb = '/gmb';
  const url = '/basic-info';
  const urllocation = '/locations';
  const urlrecognition = RECOGNITION;
  const { recognitionCount, hasFoodMenus, hasServiceItems, isAdmin, services } =
    useContext(AppContext);
  const [shopVisibility, setShopVisibility] = useState(false);

  const initActiveMenu = (path) => {
    if (path.includes(urlGmb)) {
      setActiveMenu('post_review');
    } else if (path.includes(url)) {
      setActiveMenu('basic_info');
    } else if (path.includes(urllocation)) {
      setActiveMenu('location');
    } else {
      setActiveMenu('');
    }
  };

  useEffect(() => {
    initActiveMenu(pathname);
  }, [pathname]);
  return (
    <div>
      <ul className="first-level-menu">
        <li className="dashbord menu" onClick={() => setActiveMenu('')}>
          {(services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID)) && (
            <NavLink to="/dashboard">
              <div className="text">{t('common:SIDEBAR.DASHBOARD')}</div>
            </NavLink>
          )}
        </li>
        <li className="menu" onClick={() => setActiveMenu('post_review')}>
          {(services.has(BOOK_ID) || services.has(BRIDGE_BOOK_ID)) && (
            <NavLink to="/gmb">
              <div className="text">{t('common:SIDEBAR.POST_REVIEW')}</div>
            </NavLink>
          )}
        </li>
        <li className="menu" onClick={() => setActiveMenu('basic_info')}>
          {(services.has(BOOK_ID) || services.has(BRIDGE_BOOK_ID)) && (
            <NavLink to="/basic-info">
              <div className="text">{t('common:SIDEBAR.BASIC_INFO')}</div>
            </NavLink>
          )}
        </li>
        <li className="menu" onClick={() => setActiveMenu('location')}>
          <NavLink to="/locations">
            <div className="text">{t('common:SIDEBAR.LOCATION')}</div>
          </NavLink>
        </li>
        <li className="menu" onClick={() => setActiveMenu('')}>
          {isAdmin && (
            <NavLink to="/users">
              <div className="text">{t('common:SIDEBAR.USER')}</div>
            </NavLink>
          )}
        </li>
        <li
          className="menu menu--recognition"
          onClick={() => setActiveMenu('')}
        >
          <NavLink to={`${urlrecognition}/approval`}>
            <div className="text">{t('common:HEADER.RECOGNITION')}</div>
            {recognitionCount !== 0 ? (
              <div className="total-number">({recognitionCount})</div>
            ) : (
              <></>
            )}
          </NavLink>
        </li>
        <li className="menu">
          <CDropdown onClick={() => setShopVisibility(!shopVisibility)}>
            <CDropdownToggle className="location-dropdown">
              {t('common:HEADER.LOCATIONS')}
            </CDropdownToggle>
          </CDropdown>
        </li>
      </ul>
      {activeMenu.length > 0 ? (
        <div className="second-level-menu">
          <ul className={activeMenu === 'post_review' ? 'sub-active' : 'sub'}>
            <li className="dashboard menu">
              <NavLink to={`${urlGmb}/reviews`} activeClassName="active">
                <div className="text">{t('gmb:REVIEW')}</div>
              </NavLink>
            </li>
            <li className="menu">
              <NavLink to={`${urlGmb}/posts`} activeClassName="active">
                <div className="text">{t('gmb:POST')}</div>
              </NavLink>
            </li>
          </ul>
          <ul className={activeMenu === 'basic_info' ? 'sub-active' : 'sub'}>
            <li className="dashboard menu">
              <NavLink to={`${url}/info`} activeClassName="active">
                <div className="text">
                  {t('basic_info:BASIC_INFO.BASIC_INFO_TAB')}
                </div>
              </NavLink>
            </li>
            {hasFoodMenus && (
              <li className="menu">
                <NavLink to={`${url}/menu`} activeClassName="active">
                  <div className="text">
                    {t('basic_info:BASIC_INFO.MENU_TAB')}
                  </div>
                </NavLink>
              </li>
            )}
            {hasServiceItems && (
              <li className="menu">
                <NavLink to={`${url}/services`} activeClassName="active">
                  <div className="text">
                    {t('basic_info:BASIC_INFO.SERVICES_TAB')}
                  </div>
                </NavLink>
              </li>
            )}
            {/* <li className="menu">
              <NavLink to={`${url}/products`} activeClassName="active">
                <div className="text">
                  {t('basic_info:BASIC_INFO.PRODUCTS_TAB')}
                </div>
              </NavLink>
            </li> */}
            <li className="menu">
              <NavLink to={`${url}/image`} activeClassName="active">
                <div className="text">
                  {t('basic_info:BASIC_INFO.IMAGE_TAB')}
                </div>
              </NavLink>
            </li>
            <li className="menu">
              <NavLink to={`${url}/bulk`} activeClassName="active">
                <div className="text">
                  {t('basic_info:BASIC_INFO.BULK_UPDATE_TAB')}
                </div>
              </NavLink>
            </li>
          </ul>
          <ul className={activeMenu === 'location' ? 'sub-active' : 'sub'}>
            <li className="dashboard menu">
              <NavLink to={`${urllocation}/linkage`} activeClassName="active">
                <div className="text">{t('location:COMMON.LINK_INFO')}</div>
              </NavLink>
            </li>
            <li className="menu">
              <NavLink to={`${urllocation}/info`} activeClassName="active">
                <div className="text">{t('location:COMMON.LOCATION_INFO')}</div>
              </NavLink>
            </li>
            <li className="menu">
              <NavLink to={`${urllocation}/contract`} activeClassName="active">
                <div className="text">{t('location:COMMON.CONTRACT_INFO')}</div>
              </NavLink>
            </li>
            <li className="menu">
              <NavLink
                to={`${urllocation}/fixed-phrase`}
                activeClassName="active"
              >
                <div className="text">{t('location:COMMON.PHRASE_INFO')}</div>
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
      <ShopList
        show={shopVisibility}
        onClose={() => setShopVisibility(false)}
      />
    </div>
  );
}

export default Menubar;
