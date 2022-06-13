import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import './error_modal.scss';

function ErrorBulkModal({ modal, closeModal }) {
  const { t } = useTranslation(['basic_info']);
  return (
    <>
      {modal ? (
        <CModal centered show onClose={closeModal} className="bulk-error-modal">
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="delete-msg">
                    {t('basic_info:BULK_EDIT.ERROR_MESSAGE')}
                  </p>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="button"
                    color="primary"
                    className="px-4 cancel-button"
                    onClick={closeModal}
                  >
                    {t('basic_info:MENU.COMMON_RETURN')}
                  </button>
                </CCol>
                <CCol xs="3" />
              </CRow>
            </CForm>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
}
ErrorBulkModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default ErrorBulkModal;
