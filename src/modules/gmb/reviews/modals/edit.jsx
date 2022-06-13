import React, { useState } from 'react';
import { CModal } from '@coreui/react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../../../../commons/components/Button';
import { REVIEWS } from '../../../../commons/constants/url';

import './edit.scss';

function EditModal({
  ids,
  reply,
  onSuccess: successHandler,
  onReturn: returnHandler,
}) {
  const { t } = useTranslation(['gmb']);
  const [confirm, setConfirm] = useState(false);
  const { put: putReview, post: postReview } = useFetch(
    ids?.length === 1 ? `${REVIEWS}/${ids}/reply` : `${REVIEWS}/bulk/reply`,
  );
  const closedHandler = () => {
    setConfirm(false);
  };

  const update = async () => {
    const response =
      ids?.length > 1
        ? await postReview({
            reply,
            reviews: ids,
          })
        : await putReview({
            ids,
            reply,
          });
    if (response?.success) {
      setConfirm(true);
    }
  };
  return (
    <CModal
      show={ids?.length > 0}
      onClose={confirm ? successHandler : returnHandler}
      onClosed={closedHandler}
      centered
      className="edit-modal"
    >
      {!confirm ? (
        <>
          <div className="message">{t('gmb:REVIEWS.EDIT.MESSAGE1')}</div>
          <br />
          <div className="warning">{t('gmb:REVIEWS.EDIT.WARNING')}</div>
          <br />
          <br />
          <br />
          <div className="buttons">
            <Button onClick={update}>{t('gmb:REVIEWS.EDIT.OKAY_BTN')}</Button>
            <br />
            <Button type="reset" onClick={returnHandler}>
              {t('gmb:REVIEWS.EDIT.RETURN_BTN')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="message">{t('gmb:REVIEWS.EDIT.MESSAGE2')}</div>
          <br />
          <div className="warning">{t('gmb:REVIEWS.EDIT.WARNING')}</div>
        </>
      )}
    </CModal>
  );
}
EditModal.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number),
  reply: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

EditModal.defaultProps = {
  ids: [],
  reply: '',
};

export default EditModal;
