import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import { GROUPS, LOCATION_BOOKS } from '../../../commons/constants/url';
import { ReactComponent as CircleCross } from '../../../commons/icons/circle-cross.svg';
import { ReactComponent as UploadIcon } from '../../../commons/icons/cloud-upload.svg';
import CsvUploadSelectFile from './CsvUploadSelectFile';
import CsvUploadComplete from './CsvUploadComplete';

import './csv-upload.scss';

function CsvUpload({ show, onClose: closeHandler }) {
  const { t } = useTranslation(['basic_info']);
  const [groupList, setGroupList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [locations, setLocations] = useState([]);
  const [csvUploadSelectFile, setCsvUploadSelectFile] = useState(false);
  const [csvUploadComplete, setCsvUploadComplete] = useState(false);
  const { get: getGroups } = useFetch(GROUPS);
  const { get: getLocations } = useFetch(LOCATION_BOOKS);

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
          .filter((loc) => {
            return locationList.find((location) => {
              return location.id === loc.id;
            });
          })
          .map((loc) => loc?.id),
      ),
    ]);
    setGroups(newGroups);
  };

  const handleLocationSelection = (event) => {
    const val = parseInt(event.currentTarget.value, 10);

    if (locations.indexOf(val) > -1) {
      setLocations(locations.filter((loc) => loc !== val));
    } else {
      setLocations([...locations, val]);
    }
  };

  const isLocationSelected = (val) => {
    return locations.indexOf(val) > -1;
  };
  const toggleAllLocation = () => {
    if (locations?.length >= locationList?.length) {
      setLocations([]);
      setGroups([]);
    } else {
      const newLocationIds = locationList
        ?.map((location) => location.id)
        .filter((id) => !locations.includes(id));
      setLocations([...locations, ...newLocationIds]);
      setGroups([]);
    }
  };
  const toggleCsvUploadSelectFile = () => {
    setCsvUploadSelectFile(!csvUploadSelectFile);
  };
  const toggleCsvUploadComplete = () => {
    setCsvUploadComplete(!csvUploadComplete);
  };
  const load = async () => {
    const groupData = await getGroups();
    const locationData = await getLocations();
    setGroupList(groupData?.result?.data);
    setLocationList(locationData?.result?.data);
  };
  const enableScroll = () => {
    document.documentElement.style.overflow = 'auto';
    document.body.scroll = 'yes';
    setLocations([]);
    setGroups([]);
  };
  const openHandler = () => {
    load();
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';
  };
  return (
    <CModal
      show={show}
      className="csv-upload-modal"
      onClose={closeHandler}
      onClosed={enableScroll}
      onOpened={openHandler}
      backdrop={false}
      closeOnBackdrop={false}
    >
      <CModalBody>
        <div className="header">
          <div>
            <CircleCross onClick={closeHandler} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <div className="group">
          <div className="header">
            {t('basic_info:MENU.CSV_UPLOAD.GROUP.HEADER')}
          </div>
          <div className="body">
            <div className="list">
              <div
                className={`item pointer${
                  locations?.length >= locationList?.length ? ' highlight' : ''
                }`}
                role="presentation"
                onClick={toggleAllLocation}
              >
                全店舗
              </div>
              {groupList?.map((group) => {
                return (
                  <div className="item" key={group.id}>
                    <div className="text">{group.name}</div>{' '}
                    <div className="icon">
                      <input
                        type="checkbox"
                        value={group?.id}
                        checked={groups.indexOf(group?.id) !== -1}
                        onChange={handleGroupSelection}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* location group */}
        <div
          className="group"
          style={{ marginTop: '50px', maxHeight: '405px' }}
        >
          <div className="header">
            {t('basic_info:MENU.CSV_UPLOAD.LOCATION.HEADER')} (
            {locationList?.length})
          </div>
          <div className="list">
            {locationList?.map((loc) => {
              return (
                <div className="item" key={loc.id}>
                  <div className="text">{loc.name}</div>{' '}
                  <div className="icon">
                    <input
                      type="checkbox"
                      value={loc.id}
                      checked={isLocationSelected(loc.id)}
                      onChange={handleLocationSelection}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {locations.length !== 0 && (
          <div
            className="upload-button"
            role="presentation"
            onClick={toggleCsvUploadSelectFile}
          >
            <UploadIcon />
            {t('basic_info:MENU.UPLOAD')}
          </div>
        )}
        <CsvUploadSelectFile
          closeModal={toggleCsvUploadSelectFile}
          modal={csvUploadSelectFile}
          locations={locations}
          callbackComplete={toggleCsvUploadComplete}
          disabled={locations.length === 0}
        />
        <CsvUploadComplete modal={csvUploadComplete} />
      </CModalBody>
    </CModal>
  );
}

CsvUpload.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CsvUpload;
