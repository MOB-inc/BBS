import React, { useState } from 'react';
import { CModal } from '@coreui/react';
import PropTypes from 'prop-types';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import Button from '../../../../commons/components/Button';
import { REVIEWS } from '../../../../commons/constants/url';
import './delete.scss';

function DeleteModal({
  id,
  onSuccess: successHandler,
  onReturn: returnHandler,
}) {
  const { t } = useTranslation(['gmb']);
  const [isDeleted, setIsDeleted] = useState(false);
  const { delete: deleteReview } = useFetch(`${REVIEWS}/${id}/reply/delete`);

  const closedHandler = () => {
    setIsDeleted(false);
  };
  const confirm = async () => {
    const response = await deleteReview();
    if (response?.success) {
      setIsDeleted(true);
    }
  };
  return (
    <CModal
      show={!!id}
      onClose={isDeleted ? successHandler : returnHandler}
      onClosed={closedHandler}
      centered
      className="delete-modal"
    >
      {!isDeleted ? (
        <>
          <div className="message">{t('gmb:REVIEWS.DELETE.MESSAGE1')}</div>
          <br />
          <br />
          <br />
          <div className="buttons">
            <Button onClick={confirm}>
              {t('gmb:REVIEWS.DELETE.CONFIRM_BTN')}
            </Button>
            <br />
            <Button type="reset" onClick={returnHandler}>
              {t('gmb:REVIEWS.DELETE.RETURN_BTN')}
            </Button>
          </div>{' '}
        </>
      ) : (
        <div className="message">{t('gmb:REVIEWS.DELETE.MESSAGE2')}</div>
      )}
    </CModal>
  );
}
DeleteModal.propTypes = {
  id: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  id: undefined,
};

export default DeleteModal;
