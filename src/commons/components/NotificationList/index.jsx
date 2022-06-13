/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './index.scss';

function NotificationList({ show, onClose: closeHandler }) {
  const { t } = useTranslation(['common']);

  return (
    <CModal
      show={show}
      className="notification-modal"
      onClose={closeHandler}
      backdrop={false}
      closeOnBackdrop
    >
      <CModalBody>
        <div className="setting">
          <NavLink to="/notification_settings" onClick={closeHandler}>
            {t('common:NOTIFICATION.NOTIFICATION_SETTING')}
          </NavLink>
        </div>
      </CModalBody>
    </CModal>
  );
}

NotificationList.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationList;
