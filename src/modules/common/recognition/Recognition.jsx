import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import './recognition.scss';

const Approval = React.lazy(() => import('./approval/Approval'));
const Remand = React.lazy(() => import('./remand/Remand'));

function Recognition() {
  const { path, url } = useRouteMatch();
  return (
    <div className="recognition">
      <Switch>
        <Route path={`${url}/approval`}>
          <Approval />
        </Route>
        <Route path={`${url}/remand`}>
          <Remand />
        </Route>
        <Redirect from={path} to={`${url}/approval`} />
      </Switch>
    </div>
  );
}

export default Recognition;
