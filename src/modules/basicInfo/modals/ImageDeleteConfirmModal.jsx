import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import './image_delete_confirm_modal.scss';

function ImageDeleteConfirmModal({ modal, closeModal, deleteImage }) {
  const { t } = useTranslation(['basic_info']);
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          className="image-delete-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="delete-msg">
                    {t('basic_info:MENU.DELETE_MSG')}
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
                    className="px-4 success-button"
                    onClick={deleteImage}
                  >
                    {t('basic_info:MENU.DELETE')}
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
ImageDeleteConfirmModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  deleteImage: PropTypes.func.isRequired,
};
export default ImageDeleteConfirmModal;
