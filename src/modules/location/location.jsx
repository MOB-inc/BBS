import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import './location.scss';

const Linkage = React.lazy(() => import('./linkage/linkage'));
const Info = React.lazy(() => import('./info/info'));
const Contract = React.lazy(() => import('./contract/contract'));
const FixedPhrase = React.lazy(() => import('./phrase/phrase'));

function LocationPage() {
  const { path, url } = useRouteMatch();
  return (
    <div className="location-page">
      <Switch>
        <Route path={`${url}/linkage`}>
          <Linkage />
        </Route>
        <Route path={`${url}/info`}>
          <Info />
        </Route>
        <Route path={`${url}/contract`}>
          <Contract />
        </Route>
        <Route path={`${url}/fixed-phrase/:id?`}>
          <FixedPhrase />
        </Route>
        <Redirect from={path} to={`${url}/linkage`} />
      </Switch>
    </div>
  );
}

export default LocationPage;
