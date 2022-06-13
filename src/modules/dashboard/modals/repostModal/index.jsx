/* eslint-disable no-console */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';

import './index.scss';

function LinkDeleteModal({ modal, closeModal }) {
  const { t } = useTranslation(['dashboard']);

  const handleRepost = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
      {modal ? (
        <CModal centered show onClose={closeModal} className="repost-modal">
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="repost-msg">
                    {t('dashboard:MODAL_CONFIRMATION.REPOST_MSG')}
                  </p>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="submit"
                    color="primary"
                    className="px-4 success-button"
                    onClick={(event) => handleRepost(event)}
                  >
                    {t('dashboard:MODAL_CONFIRMATION.OKAY')}
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
                    onClick={closeModal}
                  >
                    {t('dashboard:MODAL_CONFIRMATION.COMMON_RETURN')}
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
LinkDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default LinkDeleteModal;
