/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import { CModal } from '@coreui/react';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { USERS } from '../../../../commons/constants/url';
import { ReactComponent as AddIcon } from '../../../../commons/icons/add.svg';
// import Button from '../../../../commons/components/Button';
import './index.scss';

function Approver(props) {
  const { index, users, onSelect, approver } = props;

  return (
    <div className="user-approver">
      <div className="text">
        承認者<span>&nbsp;({index + 1})&nbsp;</span>
      </div>
      <select
        className="approver"
        value={approver}
        onChange={(event) => onSelect(index, parseInt(event.target.value, 10))}
      >
        <option value={0}>Select one</option>
        {users.map((user) => {
          return (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

Approver.propTypes = {
  index: PropTypes.number.isRequired,
  approver: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function ApproverModal(props) {
  const { show, onPermissionHandler, onPasswordHandler, data, onSuccess } =
    props;
  const { t } = useTranslation(['user']);
  const [users, setUsers] = useState([]);
  // 1 for step, 2 for speed
  const [approverType, setApproverType] = useState();
  const [approvers, setApprovers] = useState([0]);

  const { get: getUsers } = useFetch(USERS);
  const { put: updateUser } = useFetch(
    data?.id ? `${USERS}/${data?.id}` : null,
  );

  const availableUsers = (index) =>
    users.filter((user) => {
      const oldApprovers = approvers.slice(0, index);
      return !oldApprovers.includes(user.id);
    });
  const addApprover = () => setApprovers([...approvers, 0]);
  const onApproverSelectHandler = (index, id) => {
    const newApprovers = [...approvers];
    newApprovers[index] = id;
    setApprovers(newApprovers);
  };

  const passwordHandler = () => {
    onPasswordHandler({
      approved_type: approverType,
      approvers: approvers.filter((app) => app !== 0),
    });
    setApproverType();
    setApprovers([0]);
  };
  const register = async () => {
    const { locations, ...rest } = data;
    const response = await updateUser({
      ...rest,
      locations: [...locations],
      approved_type: approverType,
      approvers: approvers.filter((app) => app !== 0),
    });
    if (response.success) {
      onSuccess();
    }
  };

  const openHandler = async () => {
    const respData = await getUsers();
    if (respData.success)
      setUsers(respData?.result?.data?.filter((u) => u?.id !== data?.id));
  };

  const closedHandler = () => {
    setUsers([]);
	};

  useEffect(() => {
    setApproverType(data?.approved_type);
    const tempApprovers = data?.approvers?.map((approver) => {
      if (approver instanceof Object) return approver?.id;
      return approver;
    });
    setApprovers(tempApprovers || [0]);
  }, [data?.approved_type, data?.approvers]);

  return (
    <CModal
      centered
      show={show}
      onClose={() => onPermissionHandler(data?.id)}
      onOpened={openHandler}
      onClosed={closedHandler}
      className="user-approver-modal"
    >
      <div className="settings-list">
        <div className="row settings">
          {/* <div className="col-9"> */}
          <div className="approve-label">
            <div className="title">{t('user:CREATE:APPROVER:STEP:LABEL')}</div>
            {/* <div className="col-3"> */}
            {/* <div>
              <input
                type="checkbox"
                checked={approverType === 1}
                onChange={() => setApproverType(1)}
              />
            </div> */}
            <Checkbox
              type="checkbox"
              checked={approverType === 1}
              onChange={() => setApproverType(1)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
          <div className="subtitle">
            {t('user:CREATE:APPROVER:STEP:DESCRIPTION')}
          </div>
        </div>
        {/* スピード承認設定の機能がまだなのでコメントアウト */}
        {/* <div className="row settings">
          <div className="col-9">
            <div className="title">{t('user:CREATE:APPROVER:SPEED:LABEL')}</div>
            <div className="subtitle">
              {t('user:CREATE:APPROVER:SPEED:DESCRIPTION')}
            </div>
          </div>
          <div className="col-3">
            <input
              type="checkbox"
              disabled
              checked={approverType === 2}
              onChange={() => setApproverType(2)}
            />
          </div>
        </div> */}
      </div>
      <div className="recognizers">
        <div className="list">
          {approvers.map((approver, index) => {
            return (
              <Approver
                key={nanoid()}
                index={index}
                users={availableUsers(index)}
                approver={approver}
                onSelect={onApproverSelectHandler}
              />
            );
          })}

          <AddIcon className="add-icon" onClick={addApprover} />
        </div>
        {data?.id && (
          <>
            <Button onClick={register}>
              {t('user:CREATE.PERMISSION.REGISTRATION')}
            </Button>{' '}
            <br />
          </>
				)}
				<div className='flex-container'>
					<Button
						type="reset"
						onClick={() => onPermissionHandler(data?.id || -1)}
						style={{ fontSize: '12px' }}
					>
						{t('user:CREATE.APPROVER.RETURN')}
					</Button>
					<Button onClick={passwordHandler} style={{ fontSize: '12px' }}>
						{t('user:CREATE.APPROVER.SKIP')}
						{t('user:CREATE.APPROVER.PASSWORD')}
					</Button>
				</div>
        <br />
      </div>
    </CModal>
  );
}

ApproverModal.propTypes = {
  data: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onPasswordHandler: PropTypes.func.isRequired,
  onPermissionHandler: PropTypes.func.isRequired,
};
ApproverModal.defaultProps = {
  data: {},
};
export default ApproverModal;
