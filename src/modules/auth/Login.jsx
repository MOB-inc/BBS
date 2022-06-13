import React, { useState, useContext } from 'react';
import * as Sentry from '@sentry/react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CRow,
  CFormGroup,
  CInputCheckbox,
  CLabel,
} from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import AuthLayout from '../../layouts/auth/Auth';
import { LOGIN, FORGOT } from '../../commons/constants/url';
import { NUMBERS } from '../../commons/constants/numbers';
import { AppContext } from '../../commons/helpers/appContext';
import { errorMessageGenerator } from '../../commons/helpers/validation';
import './login.scss';
import config from '../../OEMConfig';

function Login() {
  const { t } = useTranslation(['auth']);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [checkBoxValue, setCheckBoxValue] = useState(NUMBERS.ZERO);
  const [apiMessage, setApiMessage] = useState('');
  const history = useHistory();
  const { post: login, response: loginStatus } = useFetch(LOGIN);
  const { setToken, setUser } = useContext(AppContext);
  const { setLocations } = useContext(AppContext);
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const response = await login({
      email: id,
      password,
      remember: checkBoxValue,
    });
    if (loginStatus.ok) {
      const {
        result: { token, user },
      } = response;
      setApiMessage('');
      setToken(token);
      setUser(user);
      setLocations([]);
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: user?.id,
          email: user?.email,
          name: user?.name,
        });
      });
      history.push('/');
    } else {
      const message = errorMessageGenerator(response);
      setApiMessage(message);
    }
  };

  const redirectToForgotPage = (evt) => {
    evt.preventDefault();
    history.push(FORGOT);
  };

  const toggleState = () => {
    if (checkBoxValue === NUMBERS.ZERO) {
      setCheckBoxValue(NUMBERS.ONE);
    } else {
      setCheckBoxValue(NUMBERS.ZERO);
    }
  };

  return (
    <AuthLayout>
      <CCard className="login-card">
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <div className="header-logo">
              <img src={config().login_logo_image_path} alt="Logo" />
            </div>
            <CInputGroup>
              <CInput
                className="border-radius-none border-bottom-none"
                type="email"
                placeholder="ID"
                autoComplete="username"
                style={{
                  color: config().login_text_color,
                  bordercolor: config().login_text_color,
                }}
                onChange={(e) => {
                  setId(e.target.value);
                }}
                required
              />
            </CInputGroup>
            <CInputGroup>
              <CInput
                className="border-radius-none"
                type={isRevealPassword ? 'text' : 'password'}
                placeholder={t('auth:LOGIN.PASSWORD_PLACEHOLDER')}
                autoComplete="current-password"
                style={{
                  color: config().login_text_color,
                  bordercolor: config().login_text_color,
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <span
                onClick={togglePassword}
                role="presentation"
                className="PasswordReveal"
              >
                {isRevealPassword
                  ? t('auth:LOGIN.HIDE_PASSWORD')
                  : t('auth:LOGIN.SHOW_PASSWORD')}
              </span>
            </CInputGroup>
            <CRow>
              <CCol xs="12" className="text-right">
                <CButton
                  color="link"
                  className="px-0 forgot-link"
                  onClick={(evt) => redirectToForgotPage(evt)}
                >
                  {t('auth:LOGIN.FORGOT_LINK')}
                </CButton>
              </CCol>
            </CRow>
            {apiMessage ? (
              <CRow>
                <CCol xs="12">
                  <p className="error-message">{apiMessage}</p>
                </CCol>
              </CRow>
            ) : (
              <></>
            )}
            <CRow>
              <CCol xs="12">
                <CFormGroup
                  variant="custom-checkbox"
                  className="checkbox-margin"
                >
                  <CInputCheckbox
                    custom
                    id="inline-checkbox1"
                    name="inline-checkbox1"
                    onChange={(evt) => toggleState(evt)}
                  />
                  <CLabel
                    variant="custom-checkbox"
                    htmlFor="inline-checkbox1"
                    className="checkbox-label"
                    style={{
                      color: config().login_text_color,
                    }}
                  >
                    {t('auth:LOGIN.SAVE_CHECKBOX')}
                  </CLabel>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="3" />
              <CCol xs="6">
                <button
                  type="submit"
                  color="primary"
                  className="px-4 login-button"
                >
                  {t('auth:LOGIN.LOGIN_BUTTON')}
                </button>
              </CCol>
              <CCol xs="3" />
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </AuthLayout>
  );
}

export default Login;
