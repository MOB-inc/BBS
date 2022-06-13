import React from 'react';
import { CCard, CCardBody, CCol, CForm, CRow } from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../layouts/auth/Auth';
import { LOGIN } from '../../commons/constants/url';
import './success.scss';
import config from '../../OEMConfig';

function SuccessEmail() {
  const { t } = useTranslation(['auth']);
  const history = useHistory();
  const onSuccess = (evt) => {
    evt.preventDefault();
    history.push(LOGIN);
  };
  return (
    <AuthLayout>
      <CCard className="success-card">
        <CCardBody>
          <CForm>
            <div className="header-logo">
              <img src={config().login_logo_image_path} alt="Logo" />
            </div>
            <CRow>
              <CCol xs="2" />
              <CCol xs="8">
                <p className="success-message">
                  {t('auth:SUCCESS.SUCCESS_EMAIL_MESSAGE')}
                </p>
              </CCol>
              <CCol xs="2" />
            </CRow>
            <CRow>
              <CCol xs="3" />
              <CCol xs="6">
                <button
                  type="button"
                  color="primary"
                  className="px-2 success-button"
                  onClick={(evt) => onSuccess(evt)}
                >
                  {t('auth:SUCCESS.SUCCESS_BUTTON')}
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

export default SuccessEmail;
