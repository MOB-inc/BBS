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
import queryString from 'query-string';
import PropTypes from 'prop-types';
import AuthLayout from '../../layouts/auth/Auth';
import { RESET, SUCCESS } from '../../commons/constants/url';
import {
  passwordValidation,
  comparingPassword,
  errorMessageGenerator,
} from '../../commons/helpers/validation';
import './reset.scss';
import config from '../../OEMConfig';

function Reset(props) {
  const { t } = useTranslation(['auth']);
  const [reset, setReset] = useState('');
  const [confirm, setConfirm] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const [uiMessage, setUIMessage] = useState('');
  const { post: resetQuery, response, cache } = useFetch(RESET);
  const history = useHistory();
  const { location } = props;
  const params =
    location && location.search ? queryString.parse(location.search) : '';
  const { email, token } = params;

  const handleSubmit = async (evt) => {
    cache.clear();
    evt.preventDefault();
    const validate = passwordValidation(reset);
    if (validate) {
      const comparingVerify = comparingPassword(reset, confirm);
      if (comparingVerify) {
        const data = await resetQuery({
          email,
          password: reset,
          password_confirmation: confirm,
          token,
        });
        if (response.ok) {
          setUIMessage('');
          setApiMessage('');
          history.push(SUCCESS);
        } else {
          const message = errorMessageGenerator(data);
          setApiMessage(message);
        }
      } else {
        setUIMessage(t('auth:RESET.PASSWORD_MISMATCH_MESSAGE'));
      }
    } else {
      setUIMessage(t('auth:RESET.PASSWORD_VALIDATION_MESSAGE'));
    }
  };

  return (
    <AuthLayout>
      <CCard className="reset-card">
        <CCardBody>
          <CForm onSubmit={(evt) => handleSubmit(evt)}>
            <div className="header-logo">
              <img src={config().login_logo_image_path} alt="Logo" />
            </div>
            <CRow>
              <CCol xs="12">
                <p className="reset-message-long">
                  {t('auth:RESET.MESSAGE_LONG')}
                </p>
              </CCol>
            </CRow>
            <CInputGroup>
              <CInput
                className="border-radius-none border-bottom-none"
                type="password"
                placeholder={t('auth:RESET.PLACEHOLDER_RESET')}
                style={{
                  color: config().login_text_color,
                  bordercolor: config().login_text_color,
                }}
                onChange={(e) => {
                  setReset(e.target.value);
                }}
                required
              />
            </CInputGroup>
            <CInputGroup>
              <CInput
                className="border-radius-none"
                type="password"
                placeholder={t('auth:RESET.PLACEHOLDER_CONFIRM')}
                style={{
                  color: config().login_text_color,
                  bordercolor: config().login_text_color,
                }}
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
                required
              />
            </CInputGroup>
            <CRow>
              <CCol xs="12" className="text-right">
                <p className="reset-message-small">
                  {t('auth:RESET.MESSAGE_SHORT')}
                </p>
              </CCol>
            </CRow>
            {uiMessage ? (
              <CRow>
                <CCol xs="12">
                  <p className="error-message">{uiMessage}</p>
                </CCol>
              </CRow>
            ) : (
              <></>
            )}
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
                >
                  {t('auth:RESET.RESET_BUTTON')}
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

Reset.propTypes = {
  // eslint-disable-next-line react/require-default-props
  location: PropTypes.objectOf(PropTypes.string),
};

export default Reset;
