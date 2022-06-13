import React from 'react';
import PropTypes from 'prop-types';
import { CModal } from '@coreui/react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { USERS } from '../../../../commons/constants/url';
import Button from '../../../../commons/components/Button';
import './index.scss';

function UserDeleteConfirmationModal(props) {
  const { show, toggle, name, id, back } = props;
  const { t } = useTranslation(['user']);
  const { delete: deleteUser } = useFetch(`${USERS}/${id}`);

  const onDeleteConfirmHandler = async () => {
    await deleteUser();
    toggle();
    back();
  };
  return (
    <CModal
      show={show}
      onClose={toggle}
      centered
      className="user-delete-confirmation-modal"
    >
      <div className="header">
        <div>{t('user:CREATE.PASSWORD.USERNAME')}</div>
        <div>：</div>
        <div>{name}</div>
      </div>
      <div className="body">
        <br />
        <div>{t('user:CREATE:DELETE:MESSAGE')}</div>
        <br /> <br />
        <Button onClick={onDeleteConfirmHandler}>
          {t('user:CREATE:DELETE:CONFIRM')}
        </Button>
        <br />
        <Button type="reset" onClick={toggle}>
          {t('user:CREATE:DELETE:RETURN')}
        </Button>
      </div>
    </CModal>
  );
}
UserDeleteConfirmationModal.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  show: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};
UserDeleteConfirmationModal.defaultProps = {
  id: 0,
  name: '',
};
export default UserDeleteConfirmationModal;
