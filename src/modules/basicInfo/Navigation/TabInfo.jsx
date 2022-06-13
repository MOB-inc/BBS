import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
// import Products from '../Products';
import Services from '../Services';
import './tab_info.scss';

const Info = React.lazy(() => import('../BasicInfo'));
const Menu = React.lazy(() => import('../Menu'));
const ImageTab = React.lazy(() => import('../ImageTab'));
const BulkUpdate = React.lazy(() => import('../BulkUpdate'));

function TabInfo() {
  const { path, url } = useRouteMatch();
  return (
    <div className="info-page">
      <Switch>
        <Route path={`${url}/info`}>
          <Info />
        </Route>
        <Route path={`${url}/menu`}>
          <Menu />
        </Route>
        <Route path={`${url}/services`}>
          <Services />
        </Route>
        {/* <Route path={`${url}/products`}>
          <Products />
        </Route> */}
        <Route path={`${url}/image`}>
          <ImageTab />
        </Route>
        <Route path={`${url}/bulk`}>
          <BulkUpdate />
        </Route>
        <Redirect from={path} to={`${url}/info`} />
      </Switch>
    </div>
  );
}

export default TabInfo;
