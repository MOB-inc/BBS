/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import 'react-datepicker/dist/react-datepicker.css';

import NewPostNavigation from '../../navigation';
import Button from '../../../../commons/components/Button';
import { GROUPS, LOCATION_BOOKS } from '../../../../commons/constants/url';

import './index.scss';

const NewPostModal = React.lazy(() => import('../modals/NewPostModal'));

function NewPost() {
  const { t } = useTranslation(['gmb_post']);
  const [groups, setGroups] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newPostModal, setNewPostModal] = useState(false);

  const { get: getGroups } = useFetch(`${GROUPS}`);
  const { get: getLocations } = useFetch(`${LOCATION_BOOKS}`);

  const loadGroups = async () => {
    const response = await getGroups();
    setGroups(response?.result?.data);
  };

  const loadLocations = async () => {
    const response = await getLocations();
    setLocations(response?.result?.data);
  };
  const toggleLocationId = (id) => {
    const currentIndex = selectedLocations.indexOf(id);
    const newChecked = [...selectedLocations];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedLocations(newChecked);
  };

  const toggleGroupId = (id) => {
    const group = groups.find((g) => g.id === id);
    const newLocations = [...selectedLocations];
    group?.locations?.forEach((l) => {
      if (newLocations.indexOf(l.id) < 0) newLocations.push(l.id);
    });
    setSelectedLocations(newLocations);
    const currentIndex = selectedGroups.indexOf(id);
    const newChecked = [...selectedGroups];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedGroups(newChecked);
  };

  // modal
  const toggleNewPostModal = () => {
    setNewPostModal(!newPostModal);
  };

  useEffect(() => {
    loadGroups();
    loadLocations();
  }, []);

  return (
    <div className="posts-new-page">
      <div className="header">
        <NewPostNavigation />
        <Button onClick={() => toggleNewPostModal()}>
          {t(`gmb_post:POSTS.TO_POST`)}
        </Button>
      </div>
      <div className="list-view">
        <div className="list-group">
          <div className="header item">{t('gmb_post:POSTS.GROUP')}</div>
          <div className="body">
            {groups.map((item) => {
              return (
                <div className="item" key={item.id}>
                  <div className="text">{item.name}</div>
                  <div className="right">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(item.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleGroupId(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="list-group">
          <div className="header item">{t(`gmb_post:POSTS.LOCATION`)}</div>
          <div className="body">
            {locations.map((item) => {
              return (
                <div className="item" key={item.id}>
                  <div className="text">{item.name}</div>
                  <div className="right">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(item?.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleLocationId(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <NewPostModal
        isNew
        locations={locations?.filter((loc) =>
          selectedLocations.includes(loc.id),
        )}
        modal={newPostModal}
        closeModal={toggleNewPostModal}
        data={{
          locations: selectedLocations,
          groups: selectedGroups,
          is_user_authorized: true,
        }}
      />
    </div>
  );
}

export default NewPost;
