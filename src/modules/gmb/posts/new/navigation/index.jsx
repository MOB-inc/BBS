import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../../navigation/index.scss';

function NewPostNavigation() {
  const { t } = useTranslation(['gmb_post']);
  const url = '/gmb';
  return (
    <div className="navigation">
      <div className="tab">
        <NavLink to={`${url}/reviews`} activeClassName="active">
          {t('gmb_post:POSTS.REVIEW')}
        </NavLink>
      </div>
      <div className="tab">
        <NavLink to={`${url}/newpost`} activeClassName="active">
          {t('gmb_post:POST')}
        </NavLink>
      </div>
    </div>
  );
}

export default NewPostNavigation;
