import React, { useState } from 'react';
import { CModal } from '@coreui/react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import * as dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select';
import {
  NOT_REPLIED,
  REVIEW_DELETE,
  STAR_MAP,
  IS_NO_REPLY_REQUIRED_OFF,
} from '../constant';
import Button from '../../../../commons/components/Button';
import Rating from '../../../../commons/components/Rating';
import {
  REVIEWS,
  FIXED_REVIEW_PHRASE_SELECT,
} from '../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';

import './display.scss';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const DeleteModal = React.lazy(() => import('./delete'));
const EditModal = React.lazy(() => import('./edit'));

function DisplayModal({ id, onClose: closeHandler, locationId }) {
  const { t } = useTranslation(['common', 'gmb']);
  const [review, setReview] = useState({});
  const [reply, setReply] = useState('');
  const [editId, setEditId] = useState();
  const [deleteId, setDeleteId] = useState();
  const [editable, setEditable] = useState(false);
  const [selectList, setSelectList] = useState([]);
  const { get: getReview } = useFetch(REVIEWS);
  const { put: putReplyRequired, response: putResponse } = useFetch(
    `${REVIEWS}/${id}/update-no-reply-required`,
  );
  const [remand, setRemand] = useState(false);
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
  const STATUS_MAP = {
    1: t('common:REVIEW.STATUS.NOT_REPLIED'),
    2: t('REVIEW.STATUS.APPLIED'),
    3: t('REVIEW.STATUS.REMAND'),
    5: t('REVIEW.STATUS.PUBLISHED'),
    6: t('REVIEW.STATUS.REVIEW_DELETE'),
  };
  const openHandler = async () => {
    const resp = await getReview(`/${id}`);
    setReview(resp?.result);
    setReply(resp?.result?.reply || '');
    if (resp?.result?.status === NOT_REPLIED) setEditable(true);
    if (resp?.result?.status === 3) setRemand(true);
    const phraseResp = await getPhrase();
    const newSelectList = [];
    phraseResp?.result?.forEach((e) => {
      newSelectList.push({ value: e.title, label: e.title, phrase: e.phrase });
    });
    setSelectList(newSelectList);
  };
  const clear = () => {
    setReview({});
    setEditable(false);
    setRemand(false);
  };

  const editHandler = () => {
    if (!editable) {
      setEditable(true);
    } else {
      setEditId(id);
    }
  };

  const deleteHandler = () => {
    if (editable) {
      closeHandler();
    } else {
      setDeleteId(review?.id);
    }
  };

  const replyRequiredHandler = async () => {
    const data = {
      is_no_reply_required: review?.is_no_reply_required ? 0 : 1,
    };
    await putReplyRequired(data);

    if (putResponse?.ok) {
      closeHandler();
    }
  };
  return (
    <CModal
      show={!!id}
      centered
      onClose={closeHandler}
      onOpened={openHandler}
      onClosed={clear}
      closeOnBackdrop={!deleteId}
      className={`display-modal${remand ? ' remand' : ''}`}
    >
      {remand && (
        <div className="part left">
          <div className="section">
            <div className="inset">
              {t('gmb:REVIEWS.DISPLAY.REMAND_REASON')}
            </div>
            <div className="panel" style={{ height: '256px' }}>
              {review?.reason_for_remand}
            </div>
          </div>
        </div>
      )}
      <div className="part right">
        <div className="section">
          <div className="inset">{t('gmb:REVIEWS.DISPLAY.STATUS')}</div>
          <div
            className={`panel ${
              [1, 3].includes(review?.status) ? 'warning' : ''
            }`}
            style={{ height: '62px' }}
          >
            {STATUS_MAP[review?.status]}
          </div>
          <div className="inset text no-margin">
            {review?.reply_datetime &&
              dayjs(review?.reply_datetime).format('MMM D, YYYY')}
          </div>
        </div>
        <div className="section google-user">
          <div className="user-image">
            {review?.gmb_reviewer_profile_photo_url && (
              <img
                src={review?.gmb_reviewer_profile_photo_url}
                alt="Reviewer"
                height={34}
              />
            )}
          </div>
          <div className="user_details">
            <div>{review?.gmb_reviewer_display_name}</div>
            <div>
              {review?.gmb_star_rating && (
                <div className="line">
                  <Rating value={STAR_MAP[review?.gmb_star_rating]} /> &nbsp;
                  &nbsp;&nbsp;&nbsp;
                  {review?.post_datetime &&
                    dayjs.utc(review?.post_datetime).toNow(true)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="section">
          <div
            className="panel"
            style={{ minHeight: '136px', maxHeight: '300px', overflow: 'auto' }}
          >
            {review?.review_comment}
          </div>
        </div>
        <div className="section">
          <div className="reply-header">
            <div className="inset">{t('gmb:REVIEWS.DISPLAY.CONTENT')}</div>
            {editable && (
              <Select
                closeMenuOnSelect
                options={selectList}
                onChange={(selected) => {
                  setReply(selected.phrase);
                }}
                placeholder={t('gmb:REVIEWS.DISPLAY.SELECT_PLACEHOLDER')}
                components={{ DropdownIndicator }}
                className="dropdown-wrapper"
              />
            )}
          </div>
          <textarea
            className="panel"
            style={{ height: '200px' }}
            disabled={!editable}
            onChange={(event) => setReply(event?.target?.value)}
            value={reply}
            placeholder={t('gmb:REVIEWS.DISPLAY.REPLY_PLACEHOLDER')}
          />
          <div className="inset text no-margin">
            {t('gmb:REVIEWS.DISPLAY.MESSAGE')}
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {review?.is_user_authorized && review?.status !== REVIEW_DELETE && (
          <div className="buttons">
            <Button onClick={editHandler}>
              {editable
                ? t('gmb:REVIEWS.DISPLAY.PUBLIC_BTN')
                : t('gmb:REVIEWS.DISPLAY.EDIT_BTN')}
            </Button>
            {review?.status === NOT_REPLIED && (
              <Button
                className="default no-reply"
                onClick={replyRequiredHandler}
              >
                {review?.is_no_reply_required === IS_NO_REPLY_REQUIRED_OFF
                  ? t('gmb:REVIEWS.DISPLAY.NO_REPLY_REQUIRED')
                  : t('gmb:REVIEWS.DISPLAY.CANCEL_NO_REPLY_REQUIRED')}
              </Button>
            )}
            <Button type="reset" onClick={deleteHandler}>
              {editable
                ? t('gmb:REVIEWS.DISPLAY.RETURN_BTN')
                : t('gmb:REVIEWS.DISPLAY.DELETE_BTN')}
            </Button>
          </div>
        )}
        <DeleteModal
          id={deleteId}
          onSuccess={() => {
            setDeleteId();
            closeHandler();
          }}
          onReturn={() => setDeleteId()}
        />
        <EditModal
          ids={editId ? [editId] : []}
          reply={reply}
          onSuccess={() => {
            setEditId();
            setEditable(false);
            closeHandler();
          }}
          onReturn={() => setEditId()}
        />
      </div>
    </CModal>
  );
}

DisplayModal.propTypes = {
  id: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  locationId: PropTypes.number,
};
DisplayModal.defaultProps = {
  id: null,
  locationId: null,
};
export default DisplayModal;
