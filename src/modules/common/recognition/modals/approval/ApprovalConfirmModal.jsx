import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import Button from '@material-ui/core/Button';
import {
  GMB_POST,
  REVIEWS,
  APPROVE,
} from '../../../../../commons/constants/url';
import { NUMBERS } from '../../../../../commons/constants/numbers';
import '../remand_delete_confirm_msg_modal.scss';

function ApprovalConfirmModal({
  modal,
  closeModal,
  currentId,
  reloadList,
  type,
}) {
  const { t } = useTranslation(['recognition']);
  const [success, setSuccess] = useState(false);
  const clear = () => {
    setSuccess(false);
  };
  const { post: postApproveReview, response: reviewResponse } = useFetch(
    `${REVIEWS}/${currentId}${APPROVE}`,
  );
  const { post: postApprovePost, response: postResponse } = useFetch(
    `${GMB_POST}/${currentId}${APPROVE}`,
  );
  const approvePost = async () => {
    await postApprovePost({
      id: currentId,
      status: NUMBERS.TWO,
    });
    if (postResponse.ok) {
      setSuccess(true);
      reloadList();
    }
  };
  const approveReview = async () => {
    await postApproveReview({
      id: currentId,
      status: NUMBERS.TWO,
    });
    if (reviewResponse.ok) {
      setSuccess(true);
      reloadList();
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
                    : t('recognition:APPROVAL.APPROVAL_MSG')}
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
                    <Button className="submit" variant="contained" size="large" onClick={type === 1 ? approvePost : approveReview}>{t('recognition:REMAND.OKAY')}</Button>
                    {/* <button
                      type="button"
                      color="primary"
                      className="px-4 success-button"
                      onClick={type === 1 ? approvePost : approveReview}
                    >
                      {t('recognition:REMAND.OKAY')}
                    </button> */}
                  </CCol>
                  <CCol xs="3" />
                </CRow>
                <CRow>
                  <CCol xs="3" />
                  <CCol xs="6">
                    <Button className="back" variant="contained" size="large" onClick={closeModal}>{t('basic_info:MENU.COMMON_RETURN')}</Button>
                    {/* <button
                      type="button"
                      color="primary"
                      className="px-4 cancel-button"
                      onClick={closeModal}
                    >
                      {t('basic_info:MENU.COMMON_RETURN')}
                    </button> */}
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
ApprovalConfirmModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentId: PropTypes.number.isRequired,
  reloadList: PropTypes.func.isRequired,
  type: PropTypes.func.isRequired,
};
export default ApprovalConfirmModal;
