/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import {
  GMB_POST,
  REVIEWS,
  REPLY_DELETE,
} from '../../../../commons/constants/url';
import './remand_delete_confirm_msg_modal.scss';

function RemandDeleteConfirmationModal({
  modal,
  closeModal,
  type,
  deleteId,
  loadRemandList,
}) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  const [success, setSuccess] = useState(false);
  const { delete: deleteRemandPost, response: deletePostResponse } = useFetch(
    `${GMB_POST}/${deleteId}`,
  );
  const { delete: deleteRemandReview, response: deleteReviewResponse } =
    useFetch(`${REVIEWS}/${deleteId}${REPLY_DELETE}`);
  const handleDeleteGMBPost = async () => {
    await deleteRemandPost({
      id: deleteId,
    });
    if (deletePostResponse.ok) {
      setSuccess(true);
      loadRemandList();
    }
  };

  const handleDeleteGMBReview = async () => {
    await deleteRemandReview({
      id: deleteId,
    });
    if (deleteReviewResponse.ok) {
      setSuccess(true);
      loadRemandList();
    }
  };
  const clear = () => {
    setSuccess(false);
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
                    : t('basic_info:MENU.DELETE_MSG')}
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
                      onClick={
                        type === 1 ? handleDeleteGMBPost : handleDeleteGMBReview
                      }
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
              </>
            )}
          </CForm>
        </CModalBody>
      </CModal>
    </>
  );
}
RemandDeleteConfirmationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  type: PropTypes.number.isRequired,
  deleteId: PropTypes.number.isRequired,
  loadRemandList: PropTypes.func.isRequired,
};

export default RemandDeleteConfirmationModal;
