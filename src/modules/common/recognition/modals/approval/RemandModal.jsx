import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import {
  GMB_POST,
  REVIEWS,
  REMAND,
} from '../../../../../commons/constants/url';
import { NUMBERS } from '../../../../../commons/constants/numbers';
import './remand_modal.scss';

const RemandSuccess = React.lazy(() => import('./RemandSuccessModal'));

function RemandModal({ modal, closeModal, currentId, reloadList, type }) {
  const { t } = useTranslation(['recognition']);
  const [successModal, setSuccessModal] = useState(false);
  const [reasonRemand, setReasonRemand] = useState();
  const toggleSuccessModal = () => {
    setSuccessModal(!successModal);
  };
  const onTextAreaChange = (event) => {
    event.preventDefault();
    setReasonRemand(event.target.value);
  };
  const { put: putRemandReview, response: reviewResponse } = useFetch(
    `${REVIEWS}/${currentId}${REMAND}`,
  );
  const { put: putRemandPost, response: postResponse } = useFetch(
    `${GMB_POST}/${currentId}${REMAND}`,
  );
  const approvePost = async () => {
    await putRemandPost({
      id: currentId,
      status: NUMBERS.THREE,
      reason_for_remand: reasonRemand,
    });
    if (postResponse.ok) {
      closeModal();
      toggleSuccessModal();
      reloadList();
    }
  };
  const approveReview = async () => {
    await putRemandReview({
      id: currentId,
      status: NUMBERS.THREE,
      reason_for_remand: reasonRemand,
    });
    if (reviewResponse.ok) {
      closeModal();
      toggleSuccessModal();
      reloadList();
    }
  };
  const clear = () => {
    setReasonRemand('');
  };
  return (
    <>
      <CModal
        centered
        show={modal}
        onClose={closeModal}
        onClosed={clear}
        className="approval-remand-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <textarea
              value={reasonRemand || ''}
              className="reason-remand"
              onChange={(event) => onTextAreaChange(event)}
            />
            <div className="remand-msg">
              {t('recognition:APPROVAL.REMAND_MSG')}
            </div>
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
          </CForm>
        </CModalBody>
      </CModal>
      <RemandSuccess modal={successModal} closeModal={toggleSuccessModal} />
    </>
  );
}
RemandModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentId: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
};
export default RemandModal;
