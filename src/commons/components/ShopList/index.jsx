import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import { useDebounce } from 'ahooks';
import Input from '../Input';
import Button from '../Button';
// import Explanation from '../Explanation';
import { AppContext } from '../../helpers/appContext';
import { GROUPS, LOCATIONS_LIST } from '../../constants/url';
// import { ReactComponent as CircleCross } from '../../icons/circle-cross.svg';
import Cross from '../ModalCross';
import { ReactComponent as SearchIcon } from '../../icons/search.svg';
import { ReactComponent as DeleteIcon } from '../../icons/delete.svg';
import { ReactComponent as AddIcon } from '../../icons/add.svg';
import './index.scss';

const CreateModal = React.lazy(() => import('./modals/create'));
const DeleteModal = React.lazy(() => import('./modals/delete'));

function ShopList({ show, onClose: closeHandler }) {
  const { t } = useTranslation(['common']);
  const [groupList, setGroupList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [markDelete, setMarkDelete] = useState();
  const [searchText, setSearchText] = useState('');
  const [creatable, setCreatable] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const debouncedSearchText = useDebounce(searchText, { wait: 250 });
  const [selectedLocation, setSelectedLocation] = useState([]);
  const { groups, locations, setGroups, setLocations } = useContext(AppContext);
  const { get: getGroups } = useFetch(GROUPS);
  const { get: getLocations } = useFetch(LOCATIONS_LIST);

  const handleGroupSelection = (event) => {
    const val = parseInt(event.currentTarget.value, 10);
    const newGroups =
      groups.indexOf(val) > -1
        ? groups.filter((grp) => grp !== val)
        : [...groups, val];
    setLocations([
      ...new Set(
        groupList
          ?.filter((grp) => newGroups.includes(grp.id))
          .map((grp) => grp?.locations)
          .flat()
          .map((loc) => loc?.id),
      ),
    ]);
    setGroups(newGroups);
  };
  const handleLocationSelection = (event) => {
    const val = parseInt(event.currentTarget.value, 10);
    if (!creatable) {
      if (locations.indexOf(val) > -1) {
        setLocations(locations.filter((loc) => loc !== val));
      } else {
        setLocations([...locations, val]);
      }
    }
    if (creatable) {
      if (selectedLocation.indexOf(val) > -1) {
        setSelectedLocation(selectedLocation.filter((loc) => loc !== val));
      } else {
        setSelectedLocation([...selectedLocation, val]);
      }
    }
  };

  const isLocationSelected = (val) => {
    return creatable
      ? selectedLocation.indexOf(val) > -1
      : locations.indexOf(val) > -1;
  };
  const toggleAllLocation = () => {
    if (locations?.length >= locationList?.length) {
      setLocations([]);
    } else {
      const newLocationIds = locationList
        ?.map((location) => location.id)
        .filter((id) => !locations.includes(id));
      setLocations([...locations, ...newLocationIds]);
    }
  };

  const load = async () => {
    setCreatable(false);
    setSelectedLocation([]);
    const groupData = await getGroups();
    const locationData = await getLocations();
    setGroupList(groupData?.result?.data);
    setLocationList(locationData?.result?.data);
  };
  const deleteGroup = (group) => {
    setMarkDelete(group);
    setDeleteModal(true);
  };

  const deleteModalCloseHandler = async () => {
    setGroups(groups.filter((grp) => grp !== markDelete?.id));
    setDeleteModal(false);
    setMarkDelete();
    const groupData = await getGroups();
    setGroupList(groupData?.result?.data);
  };
  const enableScroll = () => {
    document.documentElement.style.overflow = 'auto';
    document.body.scroll = 'yes';
  };
  const openHandler = () => {
    load();
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';
  };

  useEffect(async () => {
    const groupData = await getGroups(
      searchText ? `?searchText=${searchText}` : '',
    );
    const locationData = await getLocations(
      searchText ? `?searchText=${searchText}` : '',
    );
    setGroupList(groupData?.result?.data);
    setLocationList(locationData?.result?.data);
  }, [debouncedSearchText]);

  return (
    <CModal
      show={show}
      className="shop-list-modal"
      onClose={closeHandler}
      onClosed={enableScroll}
      onOpened={openHandler}
      backdrop={false}
      closeOnBackdrop
    >

      <CModalBody>
        <Cross onClick={closeHandler}/>
        <div className="header" style={{position:"relative"}}>
          {/* <Explanation screen="LOCATION_SELECT" /> */}
          <Cross onClick={closeHandler} />
        </div>
        <div className="header">
          <div className="desc">
            <span style={{ whiteSpace: 'pre-line' }}>
              {t('common:SHOP_LIST.HEADER.NOTE')}
            </span>
          </div>
          {/* <div className="search-box"> */}
          {/* <div className="search-input">
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event?.target?.value)}
              />
						</div> */}
          <div className="search-box">
            <div className="search-input">
              <TextField
                value={searchText}
                // autoComplete="off"
                onChange={(event) => setSearchText(event?.target?.value)}
                className="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon className="searchIcon" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                placeholder={t('common:SHOP_LIST.HEADER.PLACEHOLDER')}
              />
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="group">
          <div className="header">
            <span>{t('common:SHOP_LIST.GROUP.HEADER')}</span>
            {/* {creatable && ( */}
            <div className="create">
              <Button
                disabled={!selectedLocation?.length}
                onClick={() => setCreateModal(true)}
              >
                {t('common:SHOP_LIST.GROUP.CREATION')}
              </Button>
            </div>
            {/* )} */}
          </div>
          <div className="body">
            {creatable && (
              <div
                className="overlay"
                role="presentation"
                onClick={() => setCreatable(false)}
              />
            )}
            <div className="list">
              <div
                className={`item pointer${
                  locations?.length >= locationList?.length ? ' highlight' : ''
                }`}
                role="presentation"
                onClick={toggleAllLocation}
              >
                ?????????
              </div>
              {groupList?.map((group) => {
                return (
                  <div className="item" key={group.id}>
                    <div className="icon">
                      <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => deleteGroup(group)}
                      />{' '}
                      &nbsp;
                      <input
                        type="checkbox"
                        value={group?.id}
                        checked={groups.indexOf(group?.id) !== -1}
                        onChange={handleGroupSelection}
                      />
                    </div>
                    <div className="text">{group.name}</div>{' '}
                  </div>
                );
              })}
              <div className="item">
                <AddIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCreatable(true)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* location group */}
        <div
          className="group"
          style={{ marginTop: '50px', maxHeight: '405px' }}
        >
          <div className="header">
            {t('common:SHOP_LIST.LOCATION.HEADER')} ({locationList?.length})
          </div>
          <div className="list">
            {locationList?.map((loc) => {
              return (
                <div className="item" key={loc.id}>
                  <div className="icon">
                    <input
                      type="checkbox"
                      value={loc.id}
                      checked={isLocationSelected(loc.id)}
                      onChange={handleLocationSelection}
                    />
                  </div>
                  <div className="text">{loc.name}</div>{' '}
                </div>
              );
            })}
          </div>
        </div>
      </CModalBody>

      <CreateModal
        show={createModal}
        onClose={() => {
          load();
          setCreateModal(false);
          setSelectedLocation([]);
        }}
        locations={selectedLocation}
      />
      <DeleteModal
        show={deleteModal}
        group={markDelete}
        onClose={deleteModalCloseHandler}
      />
    </CModal>
  );
}

ShopList.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShopList;
