/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { GMB_POST, REVIEWS, REPLY } from '../../../../../commons/constants/url';
import '../remand_delete_confirm_msg_modal.scss';

function EditConfirmModal({
  modal,
  closeModal,
  currentId,
  reply,
  payload,
  type,
  reloadList,
}) {
  const { t } = useTranslation(['recognition']);
  const [success, setSuccess] = useState(false);
  const clear = () => {
    setSuccess(false);
  };
  const { put: putReview, response: reviewResponse } = useFetch(
    `${REVIEWS}/${currentId}${REPLY}`,
  );
  const { post: postUpdate, response: postResponse } = useFetch(
    `${GMB_POST}/${currentId}`,
  );
  const editPost = async () => {
    await postUpdate(payload);
    if (postResponse.ok) {
      setSuccess(true);
      reloadList();
    }
  };
  const editReview = async () => {
    await putReview({
      id: currentId,
      reply,
    });
    if (reviewResponse.ok) {
      setSuccess(true);
    }
  };
  return (
    <>
      <CModal
        centered
        show={modal}
        onClose={closeModal}
        onClosed={clear}
        className="remand-delete-confirm-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <CRow>
              <CCol md="1" />
              <CCol md="10" className="padding-left-right">
                <p className={success ? 'completed-msg' : 'delete-msg'}>
                  {success
                    ? t('recognition:REMAND.COMPLETED_MODAL_MSG')
                    : t('recognition:APPROVAL.PUBLISH_MSG')}
                </p>
              </CCol>
              <CCol md="1" />
            </CRow>
            {success ? (
              <></>
            ) : (
              <>
                <CRow>
                  <CCol xs="3" />
                  <CCol xs="6">
                    <button
                      type="button"
                      color="primary"
                      className="px-4 success-button"
                      onClick={type === 1 ? editPost : editReview}
                    >
                      {t('recognition:REMAND.OKAY')}
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
              </>
            )}
          </CForm>
        </CModalBody>
      </CModal>
    </>
  );
}
EditConfirmModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentId: PropTypes.number.isRequired,
  reply: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  reloadList: PropTypes.func,
};

EditConfirmModal.defaultProps = {
  reloadList: [],
};

export default EditConfirmModal;
