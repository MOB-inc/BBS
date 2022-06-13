/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CForm, CCol, CRow } from '@coreui/react';

import { GMB_POST } from '../../../../commons/constants/url';

import './delete_confirm_msg_modal.scss';

function GmbPostDeleteConfirmationModal({ show, onClose, data }) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  const [success, setSuccess] = useState(false);

  const { delete: deleteRemandPost, response: deletePostResponse } = useFetch(
    `${GMB_POST}/${data?.id}`,
  );

  const handleDeleteGMBPost = async () => {
    await deleteRemandPost({
      id: data?.id,
    });
    if (deletePostResponse.ok) {
      setSuccess(true);
    }
  };

  const clear = () => {
    // closePostModal();
    setSuccess(false);
  };

  return (
    <CModal
      centered
      show={show}
      onClose={onClose}
      onClosed={clear}
      className="remand-delete-confirm-modal"
    >
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
                  onClick={handleDeleteGMBPost}
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
                  onClick={onClose}
                >
                  {t('basic_info:MENU.COMMON_RETURN')}
                </button>
              </CCol>
              <CCol xs="3" />
            </CRow>
          </>
        )}
      </CForm>
    </CModal>
  );
}
GmbPostDeleteConfirmationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default GmbPostDeleteConfirmationModal;
