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
  BULK,
} from '../../../../../commons/constants/url';
import { NUMBERS } from '../../../../../commons/constants/numbers';
import '../remand_delete_confirm_msg_modal.scss';

function BulkApprovalModal({
  modal,
  closeModal,
  reviewIds,
  postIds,
  reloadList,
}) {
  const { t } = useTranslation(['recognition']);
  const [success, setSuccess] = useState(false);
  const clear = () => {
    setSuccess(false);
  };
  const { post: bulkApproveReview } = useFetch(`${REVIEWS}${BULK}${APPROVE}`);
  const { post: bulkApprovePost } = useFetch(`${GMB_POST}${BULK}${APPROVE}`);
  const approvePost = async () => {
    return bulkApprovePost({
      status: NUMBERS.TWO,
      gmb_posts: postIds,
    });
  };
  const approveReview = async () => {
    return bulkApproveReview({
      status: NUMBERS.TWO,
      reviews: reviewIds,
    });
  };
  const bulkApprove = () => {
    const postBulkApprove =
      postIds.length > 0 ? approvePost() : Promise.resolve();
    const reviewBulkApprove =
      reviewIds.length > 0 ? approveReview() : Promise.resolve();
    Promise.all([postBulkApprove, reviewBulkApprove]).then(() => {
      setSuccess(true);
      reloadList();
    });
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
                    <Button
                      type="button"
                      className="submit"
                      onClick={bulkApprove}
                    >
                      {t('recognition:REMAND.OKAY')}
                    </Button>
                  </CCol>
                  <CCol xs="3" />
                </CRow>
                <CRow>
                  <CCol xs="3" />
                  <CCol xs="6">
                    <Button
                      type="button"
                      color="primary"
                      className="back"
                      onClick={closeModal}
                    >
                      {t('basic_info:MENU.COMMON_RETURN')}
                    </Button>
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
BulkApprovalModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  reviewIds: PropTypes.arrayOf(PropTypes.number),
  postIds: PropTypes.arrayOf(PropTypes.number),
  reloadList: PropTypes.func.isRequired,
};

BulkApprovalModal.defaultProps = {
  reviewIds: [],
  postIds: [],
};
export default BulkApprovalModal;
