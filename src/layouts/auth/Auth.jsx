import React, { useContext } from 'react';
import { CContainer, CRow } from '@coreui/react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppContext } from '../../commons/helpers/appContext';
import LangToggler from '../../commons/components/LangToggler';
import './auth.scss';
import config from '../../OEMConfig';

function Auth(props) {
  // 背景画像のCSS設定
  document.documentElement.style.setProperty(
    '--login-background-image',
    `url("${config().login_background_image_path}")`,
  );
  const { children } = props;
  const { token } = useContext(AppContext);
  return !token ? (
    <div className="c-app c-default-layout flex-row align-items-center login-width">
      <CContainer>
        <div className="auth-lang">
          <LangToggler />
        </div>
        <CRow className="justify-content-center">
          <div className="card-structure">{children}</div>
        </CRow>
      </CContainer>
    </div>
  ) : (
    <Redirect to="/" />
  );
}

Auth.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Auth;
