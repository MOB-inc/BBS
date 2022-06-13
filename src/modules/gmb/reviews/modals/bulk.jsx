import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from 'use-http';
import { CModal } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select';
import Button from '../../../../commons/components/Button';
import { FIXED_REVIEW_PHRASE_SELECT } from '../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';

import './bulk.scss';

const EditModal = React.lazy(() => import('./edit'));

function BulkEdit({ show, ids, onClose, bulkLocationIds }) {
  const { t } = useTranslation(['gmb']);
  const [reply, setReply] = useState('');
  const [editId, setEditId] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [selectValue, setSelectValue] = useState();
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  const { get: getPhrase } = useFetch(
    bulkLocationIds.length === 1
      ? FIXED_REVIEW_PHRASE_SELECT(bulkLocationIds[0])
      : FIXED_REVIEW_PHRASE_SELECT('allLocations'),
  );
  const openHandler = async () => {
    setSelectList([]);
    const phraseResp = await getPhrase();
    const newSelectList = [];
    phraseResp?.result?.forEach((e) => {
      newSelectList.push({ value: e.title, label: e.title, phrase: e.phrase });
    });
    setSelectList(newSelectList);
  };
  const clear = () => {
    setReply('');
    setEditId([]);
    setSelectValue(null);
  };
  return (
    <CModal
      show={show}
      onClose={onClose}
      onOpened={openHandler}
      onClosed={clear}
      className="bulk-modal"
    >
      <div className="section">
        <div className="inset">ステータス</div>
        <div className="panel warning" style={{ height: '62px' }}>
          {t('gmb:REVIEWS.BULK.APPLICATION')}
        </div>
      </div>
      <div className="section">
        <div className="reply-header">
          <div className="inset">{t('gmb:REVIEWS.BULK.CONTENT')}</div>
          <Select
            closeMenuOnSelect
            options={selectList}
            value={selectValue}
            onChange={(selected) => {
              setReply(selected.phrase);
            }}
            placeholder={t('gmb:REVIEWS.BULK.SELECT_PLACEHOLDER')}
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
        <textarea
          className="panel"
          style={{ height: '145px' }}
          onChange={(event) => setReply(event?.target?.value)}
          value={reply}
          placeholder={t('gmb:REVIEWS.BULK.REPLY_PLACEHOLDER')}
        />
        <div className="inset text no-margin">
          {t('gmb:REVIEWS.BULK.MESSAGE')}
        </div>
      </div>
      <div className="buttons">
        <Button onClick={() => setEditId(ids)}>
          {t('gmb:REVIEWS.BULK.PUBLIC_BTN')}
        </Button>
        <br />
        <Button type="reset" onClick={() => onClose()}>
          {t('gmb:REVIEWS.BULK.RETURN_BTN')}
        </Button>
      </div>
      <EditModal
        ids={editId}
        reply={reply}
        onSuccess={() => {
          setEditId();
          onClose();
        }}
        onReturn={() => setEditId()}
      />
    </CModal>
  );
}

BulkEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  ids: PropTypes.arrayOf(PropTypes.number),
  onClose: PropTypes.func.isRequired,
  bulkLocationIds: PropTypes.arrayOf(PropTypes.number),
};

BulkEdit.defaultProps = {
  ids: [],
  bulkLocationIds: [],
};

export default BulkEdit;
