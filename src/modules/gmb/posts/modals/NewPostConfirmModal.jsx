/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import useFetch from 'use-http';
import * as dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CCol, CRow } from '@coreui/react';
import { GMB_POST } from '../../../../commons/constants/url';
import { createPostData } from '../../../../commons/helpers/util';
import Loading from '../../../../commons/components/Loading';

import './newPostConfirmModal.scss';

function NewPostConfirmModal({ show, onClose, data, locations }) {
  const { t } = useTranslation(['recognition', 'gmb_post']);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const locationNames = locations?.map((loc) => (
    <span key={loc.id}>{loc.name}</span>
  ));

  const postDateMsg = t('recognition:APPROVAL.NEWPOST_DATE_MSG').concat(
    dayjs(`${data?.post_date} ${data?.post_time}`).format('MM/DD HH:mm'),
  );

  const clear = () => {
    setSuccess(false);
    // closePrevModal();
  };

  const { post: newPost } = useFetch(`${GMB_POST}`);

  const submitPost = async () => {
    try {
      setLoading(true);
      const form = createPostData(data);
      const responsePost = await newPost(form);
      setSuccess(responsePost?.success);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <CModal
        centered
        show={show}
        onClose={onClose}
        onClosed={clear}
        className={
          success ? 'new-post-success-modal' : 'new-post-confirm-modal'
        }
      >
        <CModalBody>
          {!success && (
            <>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="location-area">
                  {locationNames}
                </CCol>
                <CCol md="1" />
              </CRow>
              <p className={success ? 'completed-msg' : 'schedule-message'}>
                {data?.is_schedule_post && data?.post_date ? (
                  <span>{postDateMsg}</span>
                ) : (
                  <></>
                )}
              </p>
            </>
          )}

          {success ? (
            <p className="completed-msg">
              {t('recognition:REMAND.COMPLETED_MODAL_MSG')}
            </p>
          ) : (
            <div className="general-msg">{t('gmb_post:NEW.PUBLISH_MSG')}</div>
          )}
          <p className="highlight">
            {t('recognition:APPROVAL.APPROVAL_LATER_MSG')}
          </p>
          {!success && (
            <div className="footer">
              <button
                type="button"
                color="primary"
                className={`px-4 success-button ${'latest-2'}`}
                onClick={submitPost}
              >
                {t('recognition:APPROVAL.RELEASE_BUTTON')}
              </button>
              <button
                type="button"
                color="primary"
                className="px-4 cancel-button"
                onClick={onClose}
              >
                {t('basic_info:MENU.COMMON_RETURN')}
              </button>
            </div>
          )}
        </CModalBody>
      </CModal>
    </>
  );
}
NewPostConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  locations: PropTypes.arrayOf(PropTypes.any).isRequired,
};

NewPostConfirmModal.defaultProps = {
  data: undefined,
};

export default NewPostConfirmModal;
