/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense, useState, useContext, useEffect } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { CFade } from '@coreui/react';
import routes from '../../routes';
import Header from './DefaultHeader';
import Sidebar from './DefaultSidebar';
import MobileSidebar from './DefaultMobileSidebar';
import { AppContext } from '../../commons/helpers/appContext';
import { AuthAwareRoute } from '../../commons/helpers/authAwareRoute';
import { BRIDGE_ID, BRIDGE_BOOK_ID } from '../../commons/constants/key';
import './default_layout.scss';
import Menubar from './Defaultmenubar';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function DefaultLayout() {
  const { services, closeSidebar, menuMode } = useContext(AppContext);
  const { width } = useWindowDimensions();
  const nestedCondition = (condition, then, otherwise) =>
    condition ? then : otherwise;
  return (
    <div className="default-layout">
      <Header />
      <div className="main">
        {menuMode === 'sidebar' ? (
          <div
            className={`nav-bar ${closeSidebar ? 'close-sidebar-sidebar' : ''}`}
          >
            {menuMode === 'sidebar' ? (
              nestedCondition(width < 480, <MobileSidebar />, <Sidebar />)
            ) : (
              <Menubar />
            )}
          </div>
        ) : (
          <div className={`${closeSidebar ? 'menubar--closed' : 'menubar'}`}>
            <Menubar />
          </div>
        )}

        <div
          style={{ height: '100vh' }}
          className={`content ${closeSidebar ? 'close-sidebar-content' : ''}`}
        >
          <CFade>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                {routes.map(
                  ({ path, exact, name, component, isPrivate }, idx) => {
                    return (
                      component && (
                        <AuthAwareRoute
                          key={idx}
                          path={path}
                          exact={exact}
                          name={name}
                          isPrivate={isPrivate}
                          component={component}
                        />
                      )
                    );
                  },
                )}
                {services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID) ? (
                  <Redirect from="/" to="/dashboard" />
                ) : (
                  <Redirect from="/" to="/gmb" />
                )}
              </Switch>
            </Suspense>
          </CFade>
        </div>
      </div>
    </div>
  );
}
DefaultLayout.propTypes = {};

export default DefaultLayout;
