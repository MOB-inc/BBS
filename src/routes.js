import React from 'react';
import {
  LOGOUT,
  INQUIRY,
  RECOGNITION,
  NOTIFICATION,
} from './commons/constants/url';

const Dashboard = React.lazy(() => import('./modules/dashboard/Dashboard'));
const GMB = React.lazy(() => import('./modules/gmb'));
const Locations = React.lazy(() => import('./modules/location/location'));
const BasicInfoTab = React.lazy(() =>
  import('./modules/basicInfo/Navigation/TabInfo'),
);
const Aikou = React.lazy(() => import('./modules/aikou'));
const Top = React.lazy(() => import('./modules/top/Top'));
const Components = React.lazy(() => import('./modules/components'));
const Users = React.lazy(() => import('./modules/users'));
const UserCreate = React.lazy(() => import('./modules/users/create'));
const Logout = React.lazy(() => import('./modules/common/logout/Logout'));
const Inquiry = React.lazy(() => import('./modules/common/inquiry/Inquiry'));
const Recognition = React.lazy(() =>
  import('./modules/common/recognition/Recognition'),
);
const Notification = React.lazy(() =>
  import('./modules/common/notification/Notification'),
);

const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/aikou',
    name: 'Aikou',
    component: Aikou,
    isPrivate: true,
  },
  {
    path: '/top',
    name: 'Top',
    component: Top,
    isPrivate: true,
  },
  {
    path: '/components',
    name: 'Components',
    component: Components,
    isPrivate: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    isPrivate: true,
  },
  {
    path: '/gmb',
    name: 'GMB',
    component: GMB,
    isPrivate: true,
  },
  {
    path: '/locations',
    name: 'Location',
    component: Locations,
    isPrivate: true,
  },
  {
    path: '/basic-info',
    name: 'Basic Info',
    component: BasicInfoTab,
    isPrivate: true,
  },
  {
    path: '/users/create',
    name: 'User Create',
    component: UserCreate,
    isPrivate: true,
  },
  {
    path: '/users/edit/:userId',
    name: 'User Edit',
    component: UserCreate,
    isPrivate: true,
  },
  { path: '/users', name: 'Users', component: Users, isPrivate: true },
  { path: LOGOUT, name: 'Logout', component: Logout, isPrivate: true },
  { path: INQUIRY, name: 'Inquiry', component: Inquiry, isPrivate: true },
  {
    path: RECOGNITION,
    name: 'Recognition',
    component: Recognition,
    isPrivate: true,
  },
  {
    path: NOTIFICATION,
    name: 'Notification',
    component: Notification,
    isPrivate: true,
  },
];

export default routes;
