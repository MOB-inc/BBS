import React, { useContext, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { useParams, Route, useLocation } from 'react-router-dom';
import Navigation from '../navigation';
import LocationList from '../list';
import Explanation from '../../../commons/components/Explanation';
import CreateLocationModal from './modals/SelectFacebookPage';
import { ReactComponent as FbIcon } from '../../../commons/icons/fb-logo.svg';
import { ReactComponent as InstaIcon } from '../../../commons/icons/instagram-logo.svg';
import { ReactComponent as GoogleIcon } from '../../../commons/icons/google-logo.svg';
// import { ReactComponent as CheckIcon } from '../../../commons/icons/check.svg';
import {
  INSTAGRAM_SETTINGS,
  INSTAGRAM_SETTINGS_BY_LOCATION,
  GMB_SETTINGS,
  LOCATIONS,
  GMB_SETTINGS_BY_LOCATION,
  LINE_OFFICIAL_SETTINGS,
  LINE_OFFICIAL_SETTINGS_BY_LOCATION,
  SPLAN_SETTINGS,
  SPLAN_SETTINGS_BY_LOCATION,
} from '../../../commons/constants/url';
import { BOOK_ID } from '../../../commons/constants/key';
import { AppContext } from '../../../commons/helpers/appContext';
import './linkage.scss';
import config from '../../../OEMConfig';

function Dialogs() {
  const { id } = useParams();
  const { t } = useTranslation(['location']);
  const [location, setLocation] = useState();
  const [igStatus, setIgStatus] = useState(false);
  const [placeID, setPlaceID] = useState(false);
  const [igAccountName, setIgAccountName] = useState('');
  const [igDisplayName, setIgDisplayName] = useState('');
  const [facebookName, setFacebookName] = useState('');
  const [facebookPageName, setFacebookPageName] = useState('');
  const [gmbStatus, setGmbStatus] = useState(false);
  const [lineOfficialStatus, setLineOfficialStatus] = useState(false);
  const [lineOfficialToken, setLineOfficialToken] = useState('');
  const [lineOfficialDisplayName, setLineOfficialDisplayName] = useState('');
  const [splanStatus, setSplanStatus] = useState(false);
  const [splanEndpoint, setSplanEndpoint] = useState('');
  const [splanUser, setSplanUser] = useState('');
  const [splanPassword, setSplanPassword] = useState('');
  const [selectFacebookPage, setSelectFacebookPage] = useState(false);
  const { get: getLocationData } = useFetch(`${LOCATIONS}/${id}`);
  const { post: linkInstagram, response: igLinkStatus } =
    useFetch(INSTAGRAM_SETTINGS);
  const { post: linkGmb, response: gmbLinkStatus } = useFetch(GMB_SETTINGS);
  const { get: getIgStatus } = useFetch(
    id ? `${INSTAGRAM_SETTINGS_BY_LOCATION}/${id}` : null,
  );
  const { get: getGmbStatus } = useFetch(
    id ? `${GMB_SETTINGS_BY_LOCATION}/${id}` : null,
  );
  const { get: getLineOfficialStatus } = useFetch(
    id ? `${LINE_OFFICIAL_SETTINGS_BY_LOCATION}/${id}` : null,
  );
  const { get: getSplanStatus } = useFetch(
    id ? `${SPLAN_SETTINGS_BY_LOCATION}/${id}` : null,
  );
  const { post: linkLineOfficial } = useFetch(LINE_OFFICIAL_SETTINGS);
  const { post: linkSplan } = useFetch(SPLAN_SETTINGS);

  // const { delete: deleteInstagram } = useFetch(`${INSTAGRAM_SETTINGS}/${id}`);
  // const { delete: deleteGMB } = useFetch(`${GMB_SETTINGS}/${id}`);
  const currentUrl = useLocation();
  useEffect(() => {
    getLocationData().then((data) => {
      setLocation(data?.result);
      setPlaceID(data?.result?.place_id);
    });
    getIgStatus().then((data) => {
      setIgStatus(data?.result?.status);
      setIgAccountName(data?.result?.account_name);
      setIgDisplayName(data?.result?.instagram_display_name);
      setFacebookName(data?.result?.facebook_name);
      setFacebookPageName(data?.result?.facebook_page_name);
    });
    getGmbStatus().then((data) => setGmbStatus(data?.result?.status));
    getLineOfficialStatus().then((data) => {
      setLineOfficialStatus(data?.result?.status);
      setLineOfficialToken(data?.result?.long_lived_access_token);
      setLineOfficialDisplayName(data?.result?.display_name);
    });
    getSplanStatus().then((data) => {
      setSplanStatus(data?.result?.status);
      setSplanEndpoint(data?.result?.endpoint);
      setSplanUser(data?.result?.user);
      setSplanPassword(data?.result?.password);
    });
    // Insta連携リダイレクト後
    if (currentUrl.pathname.substr(-6) === 'select') {
      setSelectFacebookPage(true);
    }
  }, [id]);

  const toggleSelectFacebookPage = () => {
    setSelectFacebookPage(!selectFacebookPage);
  };

  const handleInstagramLinkage = async () => {
    const resp = await linkInstagram({ location_id: id });
    if (igLinkStatus.ok) {
      window.location = resp?.result?.redirect_url;
    }
  };

  const handleGmbLinkage = async () => {
    const resp = await linkGmb({ location_id: id });
    if (gmbLinkStatus.ok) {
      window.location = resp?.result?.redirect_url;
    }
  };

  const handleTokenUpdate = (event) => {
    setLineOfficialToken(event.target.value);
  };

  const handleSplanEndpointUpdate = (event) => {
    setSplanEndpoint(event.target.value);
  };

  const handleSplanUserUpdate = (event) => {
    setSplanUser(event.target.value);
  };

  const handleSplanPasswordUpdate = (event) => {
    setSplanPassword(event.target.value);
  };

  const handleLineOfficialLinkage = async () => {
    const data = {
      location_id: id,
      long_lived_access_token: lineOfficialToken,
    };
    await linkLineOfficial(data);
    getLineOfficialStatus().then((status) => {
      setLineOfficialStatus(status?.result?.status);
      setLineOfficialToken(status?.result?.long_lived_access_token);
      setLineOfficialDisplayName(status?.result?.display_name);
    });
  };

  const handleSplanLinkage = async () => {
    const data = {
      location_id: id,
      endpoint: splanEndpoint,
      user: splanUser,
      password: splanPassword,
    };
    await linkSplan(data);
    getSplanStatus().then((status) => {
      setSplanStatus(status?.result?.status);
      setSplanEndpoint(status?.result?.endpoint);
      setSplanUser(status?.result?.user);
      setSplanPassword(status?.result?.password);
    });
  };

  return (
    <div className="dialog-list">
      {location?.service?.id !== BOOK_ID && (
        <div className="dialog-row">
          <div className="dialog">
            <div className="header">{t('location:LINKAGE.FBIG_HEADER')}</div>
            <div className="body">
              <div className="left">{t('location:LINKAGE.FBIG_BODY')}</div>
              <div className="right">
                {/* {igStatus ? (
                  <div className="linked">
                    <div className="icon">
                      <CheckIcon width="20px" />
                    </div>
                    <div>
                      {t('location:LINKAGE.IG_AlREADY_LINKED', {
                        igAccountName,
                      })}
                    </div>
                  </div>
                    ) : ( */}
                <button
                  type="button"
                  className="button fb"
                  onClick={handleInstagramLinkage}
                >
                  <img
                    src="/icons/fb.jpeg"
                    alt="FB"
                    height="33px"
                    width="33px"
                    style={{ borderRadius: '5px' }}
                  />
                  <span>{t('location:LINKAGE.LOGIN')}</span>
                </button>
                {/* })} */}
              </div>
            </div>
          </div>
          <div className="status">
            <div>
              <div className={igStatus ? 'linked' : ''}>
                {igStatus
                  ? t('location:LINKAGE.STATUS_CONNECTED')
                  : t('location:LINKAGE.STATUS_DISCONNECTED')}
                {/* 連携解除が機能していないようなので表示しないようにする */}
                {/* {igStatus && (
                  <div
                    className="release"
                    role="presentation"
                    onClick={() => {
                      deleteInstagram();
                      window.location.reload();
                    }}
                  >
                    {t('location:LINKAGE.RELEASE')}
                  </div>
                  )}  */}
              </div>{' '}
              {igStatus && (
                <>
                  <div className="id-display">
                    <FbIcon className="icon-svg" />
                    <span className="ellipsis">
                      {facebookName} / {facebookPageName}
                    </span>
                  </div>
                  <div className="id-display">
                    <InstaIcon className="icon-svg" />
                    <span className="ellipsis">
                      {igAccountName} / {igDisplayName}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="dialog-row">
        <div className="dialog">
          <div className="header">
            {t('location:LINKAGE.GMB_HEADER')}
            {!placeID && (
              <p className="notice">{t('location:LINKAGE.GMB_NOTICE')}</p>
            )}
          </div>
          <div className="body">
            <div className="left">{t('location:LINKAGE.GMB_BODY')}</div>
            <div className="right">
              <button
                type="button"
                disabled={!placeID}
                className="button gmb"
                onClick={handleGmbLinkage}
              >
                <img
                  src="/icons/gmb.png"
                  alt="FB"
                  height="33px"
                  width="33px"
                  style={{ borderRadius: '5px' }}
                />
                <span>{t('location:LINKAGE.LOGIN')}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="status">
          <div>
            <div className={gmbStatus ? 'linked' : ''}>
              {gmbStatus
                ? t('location:LINKAGE.STATUS_CONNECTED')
                : t('location:LINKAGE.STATUS_DISCONNECTED')}
              {/* {gmbStatus && (
                <div
                  className="release"
                  role="presentation"
                  onClick={() => {
                    deleteGMB();
                    window.location.reload();
                  }}
                >
                  {t('location:LINKAGE.RELEASE')}
                </div>
                )}  */}
            </div>{' '}
            {gmbStatus && (
              <>
                <div className="id-display">
                  <GoogleIcon className="icon-svg" />
                  <span className="ellipsis">
                    {location?.gmb_location_name}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {location?.service?.id !== BOOK_ID && (
        <div className="dialog-row">
          <div className="dialog">
            <div className="header">
              {t('location:LINKAGE.LINE_OFFICIAL_HEADER')}
            </div>
            <div className="body">
              <div className="left">
                {t('location:LINKAGE.LINE_OFFICIAL_BODY')}
              </div>
              <div className="center">
                <textarea
                  className="textarea"
                  value={lineOfficialToken || ''}
                  onChange={handleTokenUpdate}
                />
              </div>
              <div className="right">
                <button
                  type="button"
                  className="button line"
                  onClick={handleLineOfficialLinkage}
                >
                  <img
                    src="/icons/lineOfficial.png"
                    alt="LINE"
                    height="33px"
                    width="33px"
                    style={{ borderRadius: '5px' }}
                  />
                  <span>{t('location:LINKAGE.SUBMIT')}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="status">
            <div>
              <div className={lineOfficialStatus ? 'linked' : ''}>
                {lineOfficialStatus
                  ? t('location:LINKAGE.STATUS_CONNECTED')
                  : t('location:LINKAGE.STATUS_DISCONNECTED')}
                {/* {gmbStatus && (
                <div
                  className="release"
                  role="presentation"
                  onClick={() => {
                    deleteGMB();
                    window.location.reload();
                  }}
                >
                  {t('location:LINKAGE.RELEASE')}
                </div>
                )} */}
              </div>
              {lineOfficialStatus && lineOfficialDisplayName && (
                <>
                  <div className="id-display">
                    <span className="ellipsis">{lineOfficialDisplayName}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {location?.service?.id !== BOOK_ID && config().is_show_splan && (
        <div className="dialog-row">
          <div className="dialog">
            <div className="header">
              {t('location:LINKAGE.CMS_HEADER')}
            </div>
            <div className="body">
              <div className="left">
                <div>
                  {t('location:LINKAGE.CMS_BODY')}
                </div>
                </div>
                <div className="center">
                  <div className="textbox">
                    <input
                      type="text"
                      value={splanEndpoint || ''}
                      placeholder="APIエンドポイント"
                      onChange={handleSplanEndpointUpdate}
                    />
                  </div>
                  <div className="textbox">
                    <input
                      type="text"
                      className="textbox"
                      value={splanUser || ''}
                      placeholder="user"
                      onChange={handleSplanUserUpdate}
                    />
                  </div>
                  <div className="textbox">
                    <input
                      type="text"
                      className="textbox"
                      value={splanPassword || ''}
                      placeholder="password"
                      onChange={handleSplanPasswordUpdate}
                    />
                  </div>
                </div>
                <div className="right">
                  <button
                    type="button"
                    className="button cms"
                    onClick={handleSplanLinkage}
                  >
                    <img
                      src="/icons/cms.png"
                      alt="CMS"
                      height="33px"
                      width="33px"
                      style={{ borderRadius: '5px' }}
                    />
                    <span>{t('location:LINKAGE.SUBMIT')}</span>
                  </button>
                </div>
            </div>
          </div>
          <div className="status">
            <div>
              <div className={splanStatus ? 'linked' : ''}>
                {splanStatus
                  ? t('location:LINKAGE.STATUS_CONNECTED')
                  : t('location:LINKAGE.STATUS_DISCONNECTED')}
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateLocationModal
        closeModal={toggleSelectFacebookPage}
        modal={selectFacebookPage}
        locationId={id}
      />
    </div>
  );
}
function LocationLinkage() {
  const { menuMode } = useContext(AppContext);
  return (
    <div className="location-linkage">
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="LINKAGE" />
          <Navigation />
        </>
      )}

      <div className="linkage-content">
        <LocationList url="/locations/linkage" />
        <Route path="/locations/linkage/:id">
          <Dialogs />
        </Route>
      </div>
    </div>
  );
}

export default LocationLinkage;
