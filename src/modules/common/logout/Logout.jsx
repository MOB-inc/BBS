import React, { useContext } from 'react';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../commons/helpers/appContext';
import Button from '../../../commons/components/Button';

import './logout.scss';

function Logout() {
  const { t } = useTranslation();
  const history = useHistory();
  const { setToken, setUser } = useContext(AppContext);
  const logout = () => {
    setToken();
    setUser();
    Sentry.configureScope((scope) => scope.setUser(null));
  };

  return (
    <div className="logout-page">
      <div className="message">{t('common:LOGOUT:MESSAGE')}</div>
      <br />
      <br />
      <br />
      <br />
      <Button onClick={logout}>{t('common:LOGOUT:LOGOUT')}</Button>
      <br />
      <Button type="reset" onClick={() => history.goBack()}>
        {t('common:LOGOUT:RETURN')}
      </Button>
    </div>
  );
}

export default Logout;
