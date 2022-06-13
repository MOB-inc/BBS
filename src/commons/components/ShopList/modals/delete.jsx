import React from 'react';
import PropTypes from 'prop-types';
import { CModal } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import Button from '../../Button';
import { GROUPS } from '../../../constants/url';
import './delete.scss';

function DeleteGroupModal({ show, onClose: close, group }) {
  const { t } = useTranslation(['common']);
  const {
    delete: deleteGroup,
    loading,
    response,
  } = useFetch(group ? `${GROUPS}/${group.id}` : null);
  const deleteGroupHandler = async () => {
    await deleteGroup();
    if (response.ok) close();
  };
  return (
    <CModal
      className="delete-group-modal"
      show={show}
      onClose={close}
      centered
      backdrop={false}
      closeOnBackdrop
    >
      <div className="message">
        {t('common:SHOP_LIST.DELETE.MESSAGE_1', { name: group?.name })} <br />
        {t('common:SHOP_LIST.DELETE.MESSAGE_2')}
      </div>
      <div className="actions">
        <Button onClick={deleteGroupHandler} disabled={loading}>
          {t('common:SHOP_LIST.DELETE.DELETE_BTN')}
        </Button>
        <Button type="reset" onClick={close}>
          {t('common:SHOP_LIST.DELETE.RETURN_BTN')}
        </Button>
      </div>
    </CModal>
  );
}

DeleteGroupModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  group: PropTypes.object,
};
DeleteGroupModal.defaultProps = {
  group: null,
};
export default DeleteGroupModal;
