/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { CModal } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useFetch from 'use-http';
import { USERS } from '../../../../commons/constants/url';
import {
  isValidEmail,
  passwordValidation,
  errorMessageGenerator,
} from '../../../../commons/helpers/validation';
import Input from '../../../../commons/components/Input';
import Button from '../../../../commons/components/Button';
import './index.scss';

function PasswordSettingModal({
  show,
  onPermissionHandler,
  data,
  onSuccess,
  isEdit,
}) {
  const { t } = useTranslation(['user']);
  const [email, setEmail] = useState({ dirty: false, value: '' });
  const [password, setPassword] = useState({ dirty: false, value: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    dirty: false,
    value: '',
  });
  const [apiMessage, setApiMessage] = useState('');
  const [submitCount, setSubmitCount] = useState(0);
  const { post: createUser, response: createResponse } = useFetch(USERS);
  const { put: updateUser, response: updateResponse } = useFetch(
    data?.id ? `${USERS}/${data?.id}` : null,
  );

  const validators = [
    [
      email.dirty ? !isValidEmail(email.value) : false,
      t('user:CREATE.PASSWORD.MESSAGE.EMAIL_NOT_VALID'),
    ],
    [
      password.dirty ? !passwordValidation(password.value) : false,
      t('user:CREATE.PASSWORD.MESSAGE.PASSWORD_NOT_VALID'),
    ],
    [
      confirmPassword.dirty
        ? !(password.value === confirmPassword.value)
        : false,
      t('user:CREATE.PASSWORD.MESSAGE.PASSWORD_NOT_MATCH'),
    ],
  ];

  const message = validators
    .map(([vl, msg]) => (vl === true ? msg : undefined))
    .filter((val) => !!val)
    .join(', ');

  const onCreateHandler = async () => {
    const finalData = {
      ...data,
      approvers: data?.approvers?.map((approver) => approver?.id || approver),
      locations: Array.from(data.locations),
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      is_approver: true,
    };
    if (data?.id) {
      const res = await updateUser(finalData);
      if (updateResponse.ok) {
        onSuccess();
      } else {
        setApiMessage(errorMessageGenerator(res));
      }
    } else {
      const res = await createUser(finalData);
      if (createResponse.ok) {
        onSuccess();
      } else {
        setApiMessage(errorMessageGenerator(res));
      }
    }
    setSubmitCount(submitCount + 1);
  };

  const closedHandler = () => {
    setApiMessage('');
    setSubmitCount(0);
    setEmail({ dirty: false, value: '' });
    setPassword({ dirty: false, value: '' });
    setConfirmPassword({ dirty: false, value: '' });
  };

  return (
    <CModal
      centered
      show={show}
      className="user-password-modal"
      onClosed={closedHandler}
      onClose={() => onPermissionHandler(data?.id)}
    >
      <div className="header">
        <div style={{ whiteSpace: 'nowrap' }}>
          {t('user:CREATE.PASSWORD.USERNAME')}
        </div>
        <div>：</div>
        <div>{data?.name}</div>
      </div>
      <div className="body">
        <div className="credentials">
          <Input
            height={36}
            maxLength="64"
            className="cred"
            value={email.value}
            autoComplete="off"
            placeholder={t('user:CREATE.PASSWORD.EMAIL')}
            onChange={(event) =>
              setEmail({ dirty: true, value: event.target.value })
            }
          />
          <Input
            height={36}
            className="cred"
            value={password.value}
            type="password"
            autoComplete="new-password"
            placeholder={t('user:CREATE.PASSWORD.PASSWORD')}
            onChange={(event) =>
              setPassword({ dirty: true, value: event.target.value })
            }
          />
          <Input
            height={36}
            className="cred"
            autoComplete="new-password"
            value={confirmPassword.value}
            type="password"
            placeholder={t('user:CREATE.PASSWORD.CONFIRM_PASSWORD')}
            onChange={(event) =>
              setConfirmPassword({ dirty: true, value: event.target.value })
            }
          />
        </div>
        <div className="caption">{t('user:CREATE.PASSWORD.CAPTION')}</div>
        <div className="message">{message || apiMessage}</div>
      </div>
      <div className="actions">
        <Button disabled={!!message} onClick={onCreateHandler}>
          {isEdit
            ? t('user:CREATE.PASSWORD.UPDATE')
            : t('user:CREATE.PASSWORD.CREATE')}
        </Button>
        <Button
          type="reset"
          onClick={() => onPermissionHandler(data?.id || -1)}
        >
          {t('user:CREATE.PASSWORD.RETURN')}
        </Button>
      </div>
    </CModal>
  );
}

PasswordSettingModal.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onPermissionHandler: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
PasswordSettingModal.defaultProps = {
  isEdit: false,
  data: undefined,
};
export default PasswordSettingModal;
