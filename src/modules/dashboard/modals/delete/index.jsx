import React from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';

import './index.scss';
import { GMB_POST_DELETE } from '../../../../commons/constants/url';

function LinkDeleteModal({ postId, locationId, onClose }) {
  const { t } = useTranslation(['dashboard']);
  const { delete: deletePost, loading } = useFetch(
    !!postId && !!locationId ? GMB_POST_DELETE(postId, locationId) : null,
  );

  const handleDeleteLink = async (e) => {
    e.preventDefault();
    const response = await deletePost();
    if (response.success) {
      onClose();
    }
  };

  return (
    <CModal
      centered
      show={!!postId && !!locationId}
      onClose={onClose}
      className="link-delete-modal"
    >
      <CModalBody>
        <CForm action="" method="post" className="form-horizontal">
          <CRow>
            <CCol md="1" />
            <CCol md="10" className="padding-left-right">
              <p className="delete-msg">
                {t('dashboard:MODAL_CONFIRMATION.DELETE_MSG')}
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
                disabled={loading}
                className="px-4 success-button"
                onClick={(event) => handleDeleteLink(event)}
              >
                {t('dashboard:MODAL_CONFIRMATION.DELETE')}
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
                {t('dashboard:MODAL_CONFIRMATION.COMMON_RETURN')}
              </button>
            </CCol>
            <CCol xs="3" />
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}
LinkDeleteModal.propTypes = {
  postId: PropTypes.number,
  locationId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

LinkDeleteModal.defaultProps = {
  postId: undefined,
  locationId: undefined,
};
export default LinkDeleteModal;
