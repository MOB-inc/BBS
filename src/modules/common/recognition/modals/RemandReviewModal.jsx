/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import Select, { components } from 'react-select';
// import { components } from 'react-select';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import * as dayjs from 'dayjs';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { ReactComponent as CloudIcon } from '../../../../commons/icons/cloud-up.svg';
// import { STAR_MAP } from '../../../gmb/reviews/constant';
// import Rating from '../../../../commons/components/Rating';
import { ReactComponent as PenIcon } from '../../../../commons/icons/pen-icon.svg';
import {
  REVIEWS,
  FIXED_REVIEW_PHRASE_SELECT,
} from '../../../../commons/constants/url';
// import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';

import './remand_review_modal.scss';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const RemandDeleteConfirmationModal = React.lazy(() =>
  import('./RemandDeleteConfirmationModal'),
);
const RemandEditConfirmationModal = React.lazy(() =>
  import('./RemandEditConfirmationModal'),
);

function RemandReviewModal({
  modal,
  closeModal,
  currentId,
  type,
  loadRemandList,
  locationId,
}) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  const [remandReason, setRemandReason] = useState();
  const [reply, setReply] = useState();
  const [review, setReview] = useState();
  // const [reviewInfo, setReviewInfo] = useState({});
  const [active, setActive] = useState(false);
  const [remandDeleteModal, setRemandDeleteModal] = useState(false);
  const [remandEditModal, setRemandEditModal] = useState(false);
  // const [selectList, setSelectList] = useState([]);
  // const [selectValue, setSelectValue] = useState();
  // const DropdownIndicator = (props) => {
  //   return (
  //     <components.DropdownIndicator {...props}>
  //       <ArrowDown />
  //     </components.DropdownIndicator>
  //   );
  // };
  const { get: getPhrase } = useFetch(
    locationId ? FIXED_REVIEW_PHRASE_SELECT(locationId) : null,
  );
  const { get: getPost } = useFetch(`${REVIEWS}/${currentId}`);
  const loadReviews = async () => {
    const responseReviews = await getPost();
    // setReviewInfo(responseReviews?.result);
    setRemandReason(responseReviews?.result?.reason_for_remand);
    setReview(responseReviews?.result?.review_comment);
    setReply(responseReviews?.result?.reply);
  };
  // const onTextAreaChange = (event) => {
  //   event.preventDefault();
  //   setReply(event.target.value);
  // };
  const toggleRemandDeleteModal = () => {
    setRemandDeleteModal(!remandDeleteModal);
  };
  const toggleRemandEditModal = () => {
    setRemandEditModal(!remandEditModal);
  };
  const openHandler = async () => {
    loadReviews();
    // setSelectList([]);
    const phraseResp = await getPhrase();
    const newSelectList = [];
    phraseResp?.result?.forEach((e) => {
      newSelectList.push({ value: e.title, label: e.title, phrase: e.phrase });
    });
    // setSelectList(newSelectList);
  };
  const clear = () => {
    setActive(false);
    // setSelectValue(null);
  };
  const reload = () => {
    setActive(false);
    loadReviews();
  };
  const handleChange = () => {

  };
  return (
    <>
      <CModal
        centered
        onOpened={openHandler}
        show={modal}
        onClose={closeModal}
        onClosed={clear}
        className="remand-review-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <CRow className="remand-row">
              <CCol md="6" className="left">
                <div className="flex-r">
                  <TextField id="outlined-basic" className="day line" label={t('recognition:REMAND.APPLICATION_DATE_TIME')} variant="outlined" InputLabelProps={{shrink: true,}}/>
                  <TextField id="outlined-basic" className="applicant line" label="申請者" variant="outlined" InputLabelProps={{shrink: true,}} />
                </div>
                <TextField id="outlined-basic" className="line w100" variant="outlined" value={review || '最新情報'}
                  disabled/>
                
                <TextField id="outlined-basic" className="w100" label="内容" variant="outlined" multiline rows={5} InputLabelProps={{shrink: true,}} value={reply || ''}/>
  
                <div className="image-area w100"><CloudIcon/>UPLOAD IMAGE</div>
                <FormControl variant="outlined" className="w100 line">
                  <Select
                    className="dropdown-wrapper"
                    native
                    onChange={handleChange}
                    inputProps={{
                      comment: '',
                    }}
                    placeholder={t('recognition:REMAND.SELECT_PLACEHOLDER')}
                    
                  >
                    <option aria-label="None" value="なし" />
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                  </Select>
                </FormControl>
                <div className="flex">
                  {/* <Button
                      onClick={toggleApprovalModal}
                      variant="contained"
                      className="submit button"
                      size="large"
                  >
                    {t('recognition:APPROVAL.APPROVAL_BUTTON')}
                  </Button> */}
                  <Button
                  //     onChange={(event) => onTextAreaChange(event)}
                  //     variant="contained"
                  //     className="edit button"
                  //     onClick={
                  //       active ? toggleEditConfirmModal : () => setActive(true)
                  //     }
                  //     size="large"
                  // >
                  //   {active
                  //     ? t('recognition:APPROVAL.RELEASE_BUTTON')
                  //     : t('recognition:REMAND.EDIT_BUTTON')}
                    
                      variant="outlined"
                      className="edit a button"
                      size="large"
                      onClick={
                        active ? toggleRemandEditModal : () => setActive(true)
                      }
                    >
                      {active
                        ? t('recognition:REMAND.APPLICATION')
                        : t('recognition:REMAND.EDIT_BUTTON')}
                  </Button>
                  <Button
                  //     onChange={(event) => onTextAreaChange(event)}
                  //     variant="contained"
                  //     className="edit button"
                  //     onClick={
                  //       active ? toggleEditConfirmModal : () => setActive(true)
                  //     }
                  //     size="large"
                  // >
                  //   {active
                  //     ? t('recognition:APPROVAL.RELEASE_BUTTON')
                  //     : t('recognition:REMAND.EDIT_BUTTON')}
                    
                      variant="contained"
                      className="back button"
                      size="large"
                      onClick={active ? reload : toggleRemandDeleteModal}
                      >
                        {active
                          ? t('basic_info:MENU.COMMON_RETURN')
                          : t('recognition:REMAND.DELETE_BUTTON')}
                  </Button>
                  {/* <Button
                      onClick={active ? reload : toggleRemandModal}
                      variant="outlined"
                      className="remand button"
                      size="large"
                  >
                    {t('recognition:APPROVAL.REMAND_BUTTON')}
                  </Button>   */}
                </div>
              
              </CCol>
              <CCol md="6" className="right">
                <div className="flex-r">
                  <TextField id="outlined-basic" className="day-r line" label="差し戻し日時" variant="outlined" InputLabelProps={{shrink: true,}}/>
                  <TextField id="outlined-basic" className="applicant-r line" label="差し戻し者" variant="outlined" InputLabelProps={{shrink: true,}} />
                </div>
                <TextField id="outlined-basic" className="w100" label="差し戻し理由" variant="outlined" value={remandReason || ''} InputLabelProps={{shrink: true,}} multiline rows={5}  >
                  <PenIcon />
                </TextField>
              
                {active ? (
                  <TextField
                    className="w100"
                    value={reply || ''}
                    label="差し戻し履歴内容"
                    // onChange={(event) => onTextAreaChange(event)}
                    // placeholder={t('recognition:REMAND.REPLY_PLACEHOLDER')}
                    multiline rows={15}
                    variant="outlined"
                    InputLabelProps={{shrink: true,}}
                  />
                ) : (
                  <TextField
                    className="w100"
                    // value={reply || ''}
                    disabled
                    label="差し戻し履歴内容"
                    multiline rows={15}
                    variant="outlined"
                    InputLabelProps={{shrink: true,}}
                  />
                )}
                <TextField id="outlined-basic" className="line num" label="差し戻し回数" variant="outlined" InputLabelProps={{shrink: true,}}/>

                {/* <div className="section google-user">
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
                <div className="left-title">
                  {t('recognition:REMAND.LEFT_TITLE')}
                </div>
                <textarea
                  className="left-content custom"
                  value={remandReason || ''}
                  disabled
                />
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
                </div> */}
                {/* <CRow>
                  <CCol xs="12">
                    <button
                      type="button"
                      color="primary"
                      className="px-4 success-button"
                      onClick={
                        active ? toggleRemandEditModal : () => setActive(true)
                      }
                    >
                      {active
                        ? t('recognition:REMAND.APPLICATION')
                        : t('recognition:REMAND.EDIT_BUTTON')}
                    </button>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <button
                      type="button"
                      color="primary"
                      className="px-4 cancel-button"
                      onClick={active ? reload : toggleRemandDeleteModal}
                    >
                      {active
                        ? t('basic_info:MENU.COMMON_RETURN')
                        : t('recognition:REMAND.DELETE_BUTTON')}
                    </button>
                  </CCol>
                </CRow> */}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <RemandDeleteConfirmationModal
          type={type}
          deleteId={currentId}
          loadRemandList={loadRemandList}
          modal={remandDeleteModal}
          closeModal={toggleRemandDeleteModal}
        />
        <RemandEditConfirmationModal
          loadRemandList={loadRemandList}
          type={type}
          currentId={currentId}
          reply={reply}
          modal={remandEditModal}
          closeModal={toggleRemandEditModal}
        />
      </CModal>
    </>
  );
}
RemandReviewModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentId: PropTypes.number.isRequired,
  type: PropTypes.array.isRequired,
  loadRemandList: PropTypes.func.isRequired,
  locationId: PropTypes.number,
};
RemandReviewModal.defaultProps = {
  locationId: null,
};
export default RemandReviewModal;
