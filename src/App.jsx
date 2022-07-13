/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { useLocalStorageState, useMount } from 'ahooks';
import { Provider as HttpProvider } from 'use-http';
import { toast, ToastContainer } from 'react-toastify';
import * as dayjs from 'dayjs';
import axios from 'axios';
import i18n from './i18n';

import { AppContext } from './commons/helpers/appContext';
import {
  DEFAULT_LANG,
  USER_KEY,
  AUTH_KEY,
  LANG_KEY,
  GROUP_KEY,
  LOCATION_KEY,
  MENU_MODE_KEY,
  DEFAULT_MENU_MODE,
  SELECTED_LOCATION_ID_KEY,
  HAS_SERVICE_ITEMS_KEY,
  HAS_FOOD_MENUS_KEY,
} from './commons/constants/key';
import { BASE_URL } from './commons/constants/url';
import { errorMessageGenerator } from './commons/helpers/validation';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import config from './OEMConfig';

// days js
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
// dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
// set default timezone
dayjs.tz.setDefault(dayjs.tz.guess());

// auth pages
const Login = React.lazy(() => import('./modules/auth/Login'));
const Forgot = React.lazy(() => import('./modules/auth/Forgot'));
const Reset = React.lazy(() => import('./modules/auth/Reset'));
const Success = React.lazy(() => import('./modules/auth/Success'));
const EmailSuccess = React.lazy(() => import('./modules/auth/SuccessEmail'));

// public pages

const Privacy = React.lazy(() => import('./modules/public/privacy'));
const TOS = React.lazy(() => import('./modules/public/tos'));

// Containers
const Layout = React.lazy(() => import('./layouts/default/DefaultLayout'));
function App() {
  document.documentElement.style.setProperty(
    '--side-menu-color',
    config().side_menu_color,
  );
  document.documentElement.style.setProperty(
    '--side-menu-selected-color',
    config().side_menu_selected_color,
  );
  document.documentElement.style.setProperty(
    '--contrast-color',
    config().contrast_color,
  );
  // mob
  document.documentElement.style.setProperty(
    '--prime-color', // #cc0099
    config().prime_color,
  );
  document.documentElement.style.setProperty(
    '--second-color', // #F8CCEE
    config().second_color,
  );
  document.documentElement.style.setProperty(
    '--third-color',  // #fbebf7
    config().third_color,
  );
  document.documentElement.style.setProperty(
    '--background-color', // #f3f4f6
    config().background_color,
  );
  document.documentElement.style.setProperty(
    '--tooltip-color', // #757575
    config().tooltip_color,
  );
  document.documentElement.style.setProperty(
    '--button-active-back-color',// #e580cc
    config().button_active_back_color,
  );
  document.documentElement.style.setProperty(
    '--border-color',
    config().border_color, // #bbbbbb
  );
  document.documentElement.style.setProperty(
    '--modal-color',
    config().modal_color, // #000015
  );
  const history = useHistory();
  const [menuMode, setMenuMode] = useLocalStorageState(
    MENU_MODE_KEY,
    () => DEFAULT_MENU_MODE,
  );
  const [hasServiceItems, setHasServiceItems] = useLocalStorageState(
    HAS_SERVICE_ITEMS_KEY,
    () => false,
  );
  const [hasFoodMenus, setHasFoodMenus] = useLocalStorageState(
    HAS_FOOD_MENUS_KEY,
    () => false,
  );

  const [selectedLocationID, setSelectedLocationID] = useLocalStorageState(
    SELECTED_LOCATION_ID_KEY,
    () => null,
  );
  const [lang, setLang] = useLocalStorageState(LANG_KEY, () => DEFAULT_LANG);
  const [token, setToken] = useLocalStorageState(AUTH_KEY, () => null);
  const [user, setUser] = useLocalStorageState(USER_KEY, () => null);
  const [groups, setGroups] = useLocalStorageState(GROUP_KEY, () => []);
  const [closeSidebar, setCloseSidebar] = useState(false);
  const [recognitionCount, setRecognitionCount] = useState(0);
  const [locations, setLocations] = useLocalStorageState(
    LOCATION_KEY,
    () => [],
  );
  const isAdmin = () => user?.roles?.some((role) => role.name === 'admin');
  const services = new Set(
    user?.locations
      ?.map((location) => location?.service?.id)
      ?.filter((item, i, ar) => ar.indexOf(item) === i),
  );

  const changeLang = (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };
  useMount(() => {
    i18n.changeLanguage(lang);
  });

  useEffect(() => {
    setMenuMode(config().menu_mode || 'sidebar');
  }, []);

  const responseInterceptor = ({ response }) => {
    if (response.status >= 400) {
      const message = errorMessageGenerator(response?.data);
      toast.error(message);
    }
    if (response.status === 401) {
      setToken();
      setUser();
      history.push('/login');
    }
    return response;
  };
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.headers.common.lang = lang;
  axios.defaults.headers.common.authorization = `Bearer ${token}`;
  return (
    <AppContext.Provider
      value={{
        selectedLocationID,
        setSelectedLocationID,
        hasServiceItems,
        setHasServiceItems,
        hasFoodMenus,
        setHasFoodMenus,
        lang,
        token,
        user,
        menuMode,
        setMenuMode,
        changeLang,
        setToken,
        setUser,
        isAdmin: isAdmin(),
        services,
        groups,
        locations,
        setGroups,
        setLocations,
        setRecognitionCount,
        recognitionCount,
        closeSidebar,
        setCloseSidebar,
      }}
    >
      <HttpProvider
        url={BASE_URL}
        options={{
          headers: { lang, authorization: `Bearer ${token}` },
          cachePolicy: 'no-cache',
          interceptors: {
            response: responseInterceptor,
          },
        }}
      >
        <div className="App">
          <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route
                  exact
                  path="/login"
                  name="Login Page"
                  render={(props) => <Login {...props} />}
                />
                <Route
                  exact
                  path="/forgot-password"
                  name="Forgot Page"
                  render={(props) => <Forgot {...props} />}
                />
                <Route
                  path="/reset-password"
                  name="Reset Page"
                  render={(props) => <Reset {...props} />}
                />
                <Route
                  path="/success"
                  name="Success Page"
                  render={(props) => <Success {...props} />}
                />
                <Route
                  path="/email-success"
                  name="Email Success Page"
                  render={(props) => <EmailSuccess {...props} />}
                />
                <Route
                  path="/privacy"
                  name="Privacy Page"
                  render={(props) => <Privacy {...props} />}
                />
                <Route
                  path="/tos"
                  name="TOS Page"
                  render={(props) => <TOS {...props} />}
                />
                <Route
                  path="/"
                  name="Home"
                  render={(props) => <Layout {...props} />}
                />
              </Switch>
              <ToastContainer
                position="bottom-center"
                autoClose={7000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </React.Suspense>
          </BrowserRouter>
        </div>
      </HttpProvider>
    </AppContext.Provider>
  );
}

export default App;
