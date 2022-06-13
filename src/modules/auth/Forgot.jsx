/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CRow,
} from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import AuthLayout from '../../layouts/auth/Auth';
import { FORGOT, LOGIN, EMAIL_SUCCESS } from '../../commons/constants/url';
import { errorMessageGenerator } from '../../commons/helpers/validation';
import './forgot.scss';
import config from '../../OEMConfig';

function Forgot() {
  const { t } = useTranslation(['auth']);
  const [email, setEmail] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const { post: forgot, response, cache } = useFetch(FORGOT);
  const history = useHistory();
  const [isDisabled, setDisable] = useState(false);
  const handleSubmit = async (evt) => {
    cache.clear();
    evt.preventDefault();
    const data = await forgot({
      email,
    });
    if (response.ok) {
      const message = errorMessageGenerator(data);
      setApiMessage(message);
      setDisable(true);
      history.push(EMAIL_SUCCESS);
    } else {
      const message = errorMessageGenerator(data);
      setApiMessage(message);
    }
  };

  const handleReturn = (evt) => {
    evt.preventDefault();
    history.push(LOGIN);
  };

  return (
    <AuthLayout>
      <CCard className="forgot-card">
        <CCardBody>
          <CForm onSubmit={(evt) => handleSubmit(evt)}>
            <div className="header-logo">
              <img src={config().login_logo_image_path} alt="Logo" />
            </div>
            <CRow>
              <CCol xs="2" />
              <CCol xs="8">
                <p className="forget-message">{t('auth:FORGOT.MESSAGE_1')}</p>
              </CCol>
              <CCol xs="2" />
            </CRow>
            <CRow>
              <CCol xs="12">
                <p className="forget-message-long remove-margin">
                  {t('auth:FORGOT.MESSAGE_2')}
                </p>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12">
                <p className="forget-message-long">
                  {t('auth:FORGOT.MESSAGE_3')}
                </p>
              </CCol>
            </CRow>
            <CInputGroup>
              <CInput
                className="border-radius-none"
                type="email"
                placeholder={t('auth:FORGOT.EMAIL_PLACEHOLDER')}
                autoComplete="email"
                style={{
                  color: config().login_text_color,
                  bordercolor: config().login_text_color,
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={isDisabled}
                required
              />
            </CInputGroup>
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
              <CCol xs="3" />
              <CCol xs="6">
                <button
                  type="submit"
                  color="primary"
                  className="px-4 login-button"
                  disabled={isDisabled}
                >
                  {t('auth:FORGOT.SEND_BUTTON')}
                </button>
              </CCol>
              <CCol xs="3" />
            </CRow>
            <CRow>
              <CCol xs="3" />
              <CCol xs="6">
                <button
                  type="button"
                  color="primary"
                  className="px-4 cancel-button"
                  onClick={(evt) => handleReturn(evt)}
                >
                  {t('auth:FORGOT.RETURN_BUTTON')}
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

export default Forgot;
