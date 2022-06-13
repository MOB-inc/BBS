import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'ahooks';
import { useHistory, useParams } from 'react-router-dom';
import { LOCATIONS_LIST, USERS } from '../../../commons/constants/url';
import Input from '../../../commons/components/Input';
import Button from '../../../commons/components/Button';
import { ReactComponent as DeleteIcon } from '../../../commons/icons/delete.svg';
import { ReactComponent as SearchIcon } from '../../../commons/icons/search.svg';
import './index.scss';
import '../../../commons/components/List/table.scss';
import Explanation from '../../../commons/components/Explanation';

const PermissionModal = React.lazy(() => import('../modals/permission'));
const ApproverModal = React.lazy(() => import('../modals/approver'));
const PasswordModal = React.lazy(() => import('../modals/password'));
const SuccessModal = React.lazy(() => import('../modals/success'));
const DeleteModal = React.lazy(() => import('../modals/delete'));

function UserCreatePage() {
  const { t } = useTranslation(['user']);
  const history = useHistory();
  const { userId } = useParams();
  const [locations, setLocations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, { wait: 250 });

  // modal state
  const [permissionId, setPermissionId] = useState();
  const [approverModal, setApproverModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // creation data
  const [modalData, setModalData] = useState({
    approved_type: 1,
    name: '',
    locations: new Set(),
  });

  const { get: getLocations } = useFetch(LOCATIONS_LIST);
  const { get: getUser } = useFetch(userId ? `${USERS}/${userId}` : null);

  const permission2password = (data) => {
    setPermissionId();
    setModalData({ ...modalData, ...data });
    setPasswordModal(true);
  };
  const permission2approve = (data) => {
    setPermissionId();
    setModalData({ ...modalData, ...data });
    setApproverModal(true);
  };
  const approve2password = (data) => {
    setModalData({ ...modalData, ...data });
    setApproverModal(false);
    setPasswordModal(true);
  };
  const permissionCloseHandler = () => {
    setPermissionId();
  };

  const approve2Permission = (id) => {
    setPermissionId(id);
    setApproverModal(false);
  };

  const password2permission = (id) => {
    setPermissionId(id);
    setPasswordModal(false);
  };

  const addUserLocation = (event) => {
    const val = parseInt(event.target.value, 10);
    if (modalData?.locations?.has(val)) {
      // remove location
      modalData?.locations?.delete(val);
    } else {
      // add location
      modalData?.locations?.add(val);
    }
    const newLocations = new Set(modalData.locations);
    setModalData({ ...modalData, locations: newLocations });
  };
  const isUserLocationSelected = (val) => {
    return modalData?.locations?.has(val);
  };

  const userCreationSuccessHandler = () => {
    setPermissionId();
    setApproverModal(false);
    setPasswordModal(false);
    setSuccessModal(true);
  };
  const userCreationCompleteHandler = () => {
    setSuccessModal(!successModal);
    setModalData({ name: '', locations: new Set(), approved_type: 1 });
    history.push(USERS);
  };

  useEffect(async () => {
    const response = await getLocations();
    if (response.success) {
      setLocations(response?.result?.data);
    }
    if (userId) {
      const userResponse = await getUser();
      if (userResponse.success) {
        const { locations: locs, ...rest } = userResponse?.result;
        setModalData({
          locations: new Set(locs.map((loc) => loc?.id)),
          ...rest,
        });
      }
    }
  }, [userId]);

  useEffect(async () => {
    const locationData = await getLocations(
      searchText ? `?searchText=${searchText}` : '',
    );
    setLocations(locationData?.result?.data);
  }, [debouncedSearchText]);

  return (
    <div className="user-create-page">
      <Explanation screen="USER_CREATE" />
      <div className="header">
        <div className="dummy" />
        <div className="username">
          <div className="search">
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {t('user:CREATE.SEARCH.HEADER')}
            </span>
            <div className="input">
              <Input
                autoComplete="off"
                placeholder={t('user:CREATE.SEARCH.PLACEHOLDER')}
                onChange={(event) =>
                  setModalData({ ...modalData, name: event.target.value })
                }
                maxLength="32"
                value={modalData?.name}
              />
              <input
                type="email"
                placeholder="ID"
                autoComplete="username"
                className="dummy"
                name="dummy"
              />
              <div className="delete">
                {userId && <DeleteIcon onClick={() => setDeleteModal(true)} />}
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setPermissionId(-1)}
          disabled={
            !(modalData?.name?.length > 0 && modalData?.locations?.size)
          }
        >
          {t('user:CREATE.PERMISSION.BUTTON')}
        </Button>
      </div>
      <div className="locations">
        <div className="locations-header">
          <div className="label">{t('user:CREATE.LOCATION')}</div>
          <div className="search-box">
            <div className="search-input">
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event?.target?.value)}
              />
            </div>
            <SearchIcon height={23} width={23} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div className="table-list">
            {locations.map((item) => {
              return (
                <div key={item.id}>
                  <span className="ellipsis">{item.name}</span>
                  <span>
                    <input
                      type="checkbox"
                      value={item.id}
                      checked={isUserLocationSelected(item.id)}
                      onChange={addUserLocation}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <PermissionModal
        id={permissionId}
        data={modalData}
        onPasswordHandler={permission2password}
        onApproveHandler={permission2approve}
        onCloseHandler={permissionCloseHandler}
        onSuccess={userCreationSuccessHandler}
      />
      <ApproverModal
        show={approverModal}
        data={modalData}
        onPasswordHandler={approve2password}
        onSuccess={userCreationSuccessHandler}
        onPermissionHandler={approve2Permission}
      />
      <PasswordModal
        data={modalData}
        show={passwordModal}
        onPermissionHandler={password2permission}
        onSuccess={userCreationSuccessHandler}
      />
      <SuccessModal
        show={successModal}
        name={modalData?.name}
        toggle={userCreationCompleteHandler}
      />
      <DeleteModal
        show={deleteModal}
        id={modalData?.id}
        name={modalData?.name}
        toggle={() => setDeleteModal(!deleteModal)}
        back={() => history.replace('/users')}
      />
    </div>
  );
}

export default UserCreatePage;
