import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal } from '@coreui/react';
import useFetch from 'use-http';
import Input from '../../Input';
import Button from '../../Button';
import { GROUPS } from '../../../constants/url';
import './create.scss';

function CreateGroupModal({ show, onClose: close, locations }) {
  const { t } = useTranslation(['common']);
  const [name, setName] = useState('');
  const { post: postGroup, loading, response } = useFetch(GROUPS);
  const createGroupHandler = async () => {
    await postGroup({ locations, name });
    if (response.ok) close();
  };
  return (
    <CModal
      className="create-group-modal"
      show={show}
      onClose={close}
      onClosed={() => setName('')}
      centered
      backdrop={false}
      closeOnBackdrop
    >
      <div className="header">{t('common:SHOP_LIST.CREATE.HEADER')}</div>
      <div>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="actions">
        <Button
          onClick={createGroupHandler}
          disabled={loading || name.length === 0}
        >
          {t('common:SHOP_LIST.CREATE.CREATE_BTN')}
        </Button>
        <Button type="reset" onClick={close}>
          {t('common:SHOP_LIST.CREATE.RETURN_BTN')}
        </Button>
      </div>
    </CModal>
  );
}

CreateGroupModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.number).isRequired,
};
export default CreateGroupModal;
