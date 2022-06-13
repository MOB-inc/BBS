import React from 'react';
import PropTypes from 'prop-types';
import { CModal } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import './index.scss';

function UserCreationSuccessModal(props) {
  const { show, toggle, name, isEdit } = props;
  const { t } = useTranslation(['user']);
  return (
    <CModal
      show={show}
      onClose={toggle}
      centered
      className="user-creation-success-modal"
    >
      <div className="header">
        <div>{t('user:CREATE.PASSWORD.USERNAME')}</div>
        <div>：</div>
        <div>{name}</div>
      </div>
      <div className="message">
        {isEdit
          ? t('user:EDIT.SUCCESS.MESSAGE')
          : t('user:CREATE:SUCCESS:MESSAGE')}
      </div>
    </CModal>
  );
}
UserCreationSuccessModal.propTypes = {
  isEdit: PropTypes.bool,
  name: PropTypes.string,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
UserCreationSuccessModal.defaultProps = {
  name: '',
  isEdit: false,
};
export default UserCreationSuccessModal;
