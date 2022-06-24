/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from 'use-http';
import { CModal, CTooltip } from '@coreui/react';
// import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
// import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { USERS } from '../../../../commons/constants/url';
// import Button from '../../../../commons/components/Button';
import { ReactComponent as QuestionIcon } from '../../../../commons/icons/question.svg';

import './index.scss';

function PermissionModal({
  id,
  onSuccess,
  data: prevData,
  onCloseHandler,
  onPasswordHandler,
  onApproveHandler,
}) {
  const { t } = useTranslation(['user']);
  const [data, setData] = useState({});

  const openHandler = async () => {
    setData(prevData);
  };

  const onClosedHandler = async () => {
    setData();
  };
  const isValid = () =>
    !(
      data?.is_linkage_authority !== undefined &&
      data?.is_fixed_sentence_edit_authority !== undefined
    );
  const { put: updateUser } = useFetch(
    data?.id ? `${USERS}/${data?.id}` : null,
  );
  const register = async () => {
    const { locations, approvers, ...rest } = data;
    const response = await updateUser({
      locations: [...locations],
      approvers: approvers?.map((a) => a?.id),
      ...rest,
    });
    if (response?.success) {
      onSuccess();
    }
  };
  return (
    <CModal
      centered
      show={!!id}
      onOpened={openHandler}
      onClose={onCloseHandler}
      onClosed={onClosedHandler}
      className="user-permission-modal"
    >
      <div className="header">{t('user:CREATE.PERMISSION.TITLE')}</div>
      <div className="settings">
        <div className="label">
          <div>
            {t('user:CREATE.PERMISSION.CONNECT')}
            <CTooltip
              content={t('user:CREATE.PERMISSION.CONNECT_TOOLTIP')}
              placement="left"
            >
              <QuestionIcon className="question" />
            </CTooltip>
          </div>
          <div>
            {t('user:CREATE.PERMISSION.PHRASE')}
            <CTooltip
              content={t('user:CREATE.PERMISSION.PHRASE_TOOLTIP')}
              placement="left"
            >
              <QuestionIcon className="question" />
            </CTooltip>
          </div>
        </div>
        <div className="option">
          <div>
            {t('user:CREATE.PERMISSION.YES')} &nbsp;{' '}
            <input
              type="checkbox"
              checked={data?.is_linkage_authority === 1}
              onChange={() => setData({ ...data, is_linkage_authority: 1 })}
            />
            {/* <Checkbox
              type="checkbox"
              checked={data?.is_linkage_authority === 1}
              onChange={() => setData({ ...data, is_linkage_authority: 1 })}
            /> */}
          </div>
          <div>
            {t('user:CREATE.PERMISSION.YES')} &nbsp;{' '}
            <input
              type="checkbox"
              checked={data?.is_fixed_sentence_edit_authority === 1}
              onChange={() =>
                setData({ ...data, is_fixed_sentence_edit_authority: 1 })
              }
            />
            {/* <Checkbox
              type="checkbox"
              checked={data?.is_fixed_sentence_edit_authority === 1}
              onChange={() =>
                setData({ ...data, is_fixed_sentence_edit_authority: 1 })
              }
            /> */}
          </div>
        </div>
        <div className="option">
          <div>
            {t('user:CREATE.PERMISSION.NO')} &nbsp;{' '}
            <input
              type="checkbox"
              checked={data?.is_linkage_authority === 0}
              onChange={() => setData({ ...data, is_linkage_authority: 0 })}
            />
            {/* <Checkbox
              type="checkbox"
              checked={data?.is_linkage_authority === 0}
              onChange={() => setData({ ...data, is_linkage_authority: 0 })}
            /> */}
          </div>
          <div>
            {t('user:CREATE.PERMISSION.NO')} &nbsp;{' '}
            <input
              type="checkbox"
              checked={data?.is_fixed_sentence_edit_authority === 0}
              onChange={() =>
                setData({ ...data, is_fixed_sentence_edit_authority: 0 })
              }
            />
            {/* <Checkbox
              type="checkbox"
              checked={data?.is_fixed_sentence_edit_authority === 0}
              onChange={() =>
                setData({ ...data, is_fixed_sentence_edit_authority: 0 })
              }
            /> */}
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="flex-container">
          <Button type="reset" onClick={onCloseHandler} className="btn-return">
            {t('user:CREATE.PERMISSION.RETURN')}
          </Button>
          {data?.id && (
            <Button disabled={isValid()} onClick={register}>
              {t('user:CREATE.PERMISSION.REGISTRATION')}
            </Button>
          )}
          {!data?.id && (
            <Button disabled={isValid()} onClick={() => onApproveHandler(data)}>
              {t('user:CREATE.PERMISSION.APPROVER')}
            </Button>
          )}
          {data?.id && (
            <span
              role="presentation"
              className="link"
              onClick={() => !isValid() && onApproveHandler(data)}
            >
              {t('user:CREATE.PERMISSION.APPROVER')}
            </span>
          )}
        </div>
        <span
          role="presentation"
          className="link"
          onClick={() => !isValid() && onPasswordHandler(data)}
        >
          {t('user:CREATE.PERMISSION.PASSWORD')}
        </span>
      </div>
    </CModal>
  );
}

PermissionModal.propTypes = {
  id: PropTypes.number,
  data: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  onApproveHandler: PropTypes.func.isRequired,
  onPasswordHandler: PropTypes.func.isRequired,
};

PermissionModal.defaultProps = {
  id: undefined,
  data: undefined,
};

export default PermissionModal;
