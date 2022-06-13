/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CCol, CRow } from '@coreui/react';

import { GMB_POST } from '../../../../commons/constants/url';
import { createPostData } from '../../../../commons/helpers/util';

import './edit-confirm-msg.scss';

function EditConfirmationModal({ show, onClose, data }) {
  const { t } = useTranslation(['recognition']);
  const [success, setSuccess] = useState(false);

  const { post: postUpdate } = useFetch(`${GMB_POST}/${data?.id}`);

  const editPost = async () => {
    const form = createPostData(data);
    form.append('_method', 'PUT');
    const responsePost = await postUpdate(form);
    setSuccess(responsePost.success);
  };

  const clear = () => {
    onClose();
    setSuccess(false);
  };

  return (
    <CModal
      centered
      show={show}
      onClose={onClose}
      onClosed={clear}
      className="post-edit-confirm-modal"
    >
      <CModalBody>
        <div>
          {success ? (
            <p className="completed-msg">
              {t('recognition:REMAND.COMPLETED_MODAL_MSG')}
            </p>
          ) : (
            <p className="completed-msg">
              {t('recognition:APPROVAL.PUBLISH_MSG')}
            </p>
          )}
          <p className="highlight">
            {t('recognition:APPROVAL.APPROVAL_LATER_MSG')}
          </p>
        </div>
        {!success && (
          <>
            <CRow>
              <CCol xs="3" />
              <CCol xs="6">
                <button
                  type="button"
                  color="primary"
                  className="px-4 success-button"
                  onClick={editPost}
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
                  onClick={onClose}
                >
                  {t('basic_info:MENU.COMMON_RETURN')}
                </button>
              </CCol>
              <CCol xs="3" />
            </CRow>
          </>
        )}
      </CModalBody>
    </CModal>
  );
}
EditConfirmationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EditConfirmationModal;
