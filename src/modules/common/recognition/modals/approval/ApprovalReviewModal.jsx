import React, { useState } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import * as dayjs from 'dayjs';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { STAR_MAP } from '../../../../gmb/reviews/constant';
import Rating from '../../../../../commons/components/Rating';
import {
  REVIEWS,
  FIXED_REVIEW_PHRASE_SELECT,
} from '../../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../../commons/icons/arrow-down.svg';

import './approval_review_modal.scss';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);
const ApprovalModal = React.lazy(() => import('./ApprovalConfirmModal'));
const EditConfirmModal = React.lazy(() => import('./EditConfirmModal'));
const RemandModal = React.lazy(() => import('./RemandModal'));

function ApprovalReviewModal({
  modal,
  closeModal,
  currentId,
  reloadList,
  type,
  locationId,
}) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  const [approvalModal, setApprovalModal] = useState(false);
  const [editConfirmModal, setEditConfirmModal] = useState(false);
  const [remandModal, setRemandModal] = useState(false);
  const [active, setActive] = useState(false);
  const [reply, setReply] = useState();
  const [review, setReview] = useState();
  const [reviewInfo, setReviewInfo] = useState({});
  const [selectList, setSelectList] = useState([]);
  const [selectValue, setSelectValue] = useState();
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  const { get: getPhrase } = useFetch(
    locationId ? FIXED_REVIEW_PHRASE_SELECT(locationId) : null,
  );
  const { get: getReviews } = useFetch(`${REVIEWS}/${currentId}`);
  const toggleApprovalModal = () => {
    setApprovalModal(!approvalModal);
  };
  const toggleEditConfirmModal = () => {
    setEditConfirmModal(!editConfirmModal);
  };
  const toggleRemandModal = () => {
    setRemandModal(!remandModal);
  };
  const onTextAreaChange = (event) => {
    event.preventDefault();
    setReply(event.target.value);
  };
  const loadReviews = async () => {
    const responseReviews = await getReviews();
    setReviewInfo(responseReviews?.result);
    setReview(responseReviews?.result?.review_comment);
    setReply(responseReviews?.result?.reply);
  };
  const openHandler = async () => {
    loadReviews();
    setSelectList([]);
    const phraseResp = await getPhrase();
    const newSelectList = [];
    phraseResp?.result?.forEach((e) => {
      newSelectList.push({ value: e.title, label: e.title, phrase: e.phrase });
    });
    setSelectList(newSelectList);
  };
  const clear = () => {
    setActive(false);
    setSelectValue(null);
  };
  const reload = () => {
    setActive(false);
    loadReviews();
  };
  return (
    <>
      <CModal
        centered
        onOpened={openHandler}
        show={modal}
        onClose={closeModal}
        onClosed={clear}
        className="approval-review-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <CRow className="remand-row">
              <CCol md="12" className="right">
                <div className="section google-user">
                  <div className="user-image">
                    {reviewInfo?.gmb_reviewer_profile_photo_url && (
                      <img
                        src={reviewInfo?.gmb_reviewer_profile_photo_url}
                        alt="Reviewer"
                        height={34}
                      />
                    )}
                  </div>
                  <div className="user_details">
                    <div className="user-name">
                      {reviewInfo?.gmb_reviewer_display_name}
                    </div>
                    <div>
                      {reviewInfo?.gmb_star_rating && (
                        <div className="line">
                          <Rating
                            value={STAR_MAP[reviewInfo?.gmb_star_rating]}
                          />{' '}
                          &nbsp; &nbsp;&nbsp;&nbsp;
                          {dayjs(reviewInfo?.post_datetime).toNow(true)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <textarea
                  className="review-user custom"
                  value={review}
                  disabled
                />
                <div className="reply-header">
                  <div className="reply-content">
                    {t('recognition:REMAND.REPLY_CONTENT_TITLE')}
                  </div>
                  {active && (
                    <Select
                      closeMenuOnSelect="false"
                      options={selectList}
                      value={selectValue}
                      onChange={(selected) => {
                        setReply(selected.phrase);
                      }}
                      placeholder={t('recognition:REMAND.SELECT_PLACEHOLDER')}
                      components={{ DropdownIndicator }}
                      className="dropdown-wrapper"
                    />
                  )}
                </div>
                {active ? (
                  <textarea
                    className="review-reply"
                    value={reply || ''}
                    onChange={(event) => onTextAreaChange(event)}
                    placeholder={t('recognition:REMAND.REPLY_PLACEHOLDER')}
                  />
                ) : (
                  <textarea
                    className="review-reply custom"
                    value={reply || ''}
                    disabled
                  />
                )}
                <div className="review-bottom-text">
                  {t('recognition:REMAND.REMAND_REVIEW_MSG')}
                </div>
                {active ? (
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
                          onClick={toggleApprovalModal}
                        >
                          {t('recognition:APPROVAL.APPROVAL_BUTTON')}
                        </button>
                      </CCol>
                      <CCol xs="3" />
                    </CRow>
                  </>
                )}
                <CRow>
                  <CCol xs="3" />
                  <CCol xs="6">
                    <button
                      type="button"
                      color="primary"
                      className={`px-4 success-button ${
                        active ? '' : 'pivot-button-margin'
                      }`}
                      onClick={
                        active ? toggleEditConfirmModal : () => setActive(true)
                      }
                    >
                      {active
                        ? t('recognition:APPROVAL.RELEASE_BUTTON')
                        : t('recognition:REMAND.EDIT_BUTTON')}
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
                      onClick={active ? reload : toggleRemandModal}
                    >
                      {active
                        ? t('basic_info:MENU.COMMON_RETURN')
                        : t('recognition:APPROVAL.REMAND_BUTTON')}
                    </button>
                  </CCol>
                  <CCol xs="3" />
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <ApprovalModal
          type={type}
          currentId={currentId}
          modal={approvalModal}
          closeModal={toggleApprovalModal}
          reloadList={reloadList}
        />
        <EditConfirmModal
          type={type}
          currentId={currentId}
          reply={reply}
          modal={editConfirmModal}
          closeModal={toggleEditConfirmModal}
        />
        <RemandModal
          type={type}
          currentId={currentId}
          reloadList={reloadList}
          modal={remandModal}
          closeModal={toggleRemandModal}
        />
      </CModal>
    </>
  );
}
ApprovalReviewModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentId: PropTypes.number.isRequired,
  reloadList: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  locationId: PropTypes.number,
};
ApprovalReviewModal.defaultProps = {
  locationId: null,
};
export default ApprovalReviewModal;
