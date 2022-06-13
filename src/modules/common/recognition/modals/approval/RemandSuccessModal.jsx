import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import '../remand_delete_confirm_msg_modal.scss';

function RemandSuccessModal({ modal, closeModal }) {
  const { t } = useTranslation(['recognition']);
  return (
    <div>
      <CModal
        centered
        show={modal}
        onClose={closeModal}
        className="remand-delete-confirm-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <CRow>
              <CCol md="1" />
              <CCol md="10" className="padding-left-right">
                <p className="completed-msg">
                  {t('recognition:REMAND.COMPLETED_MODAL_MSG')}
                </p>
              </CCol>
              <CCol md="1" />
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  );
}
RemandSuccessModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
};
export default RemandSuccessModal;
