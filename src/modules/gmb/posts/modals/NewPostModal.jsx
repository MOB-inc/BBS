/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody } from '@coreui/react';
import * as dayjs from 'dayjs';

import {
  GMB_POST,
  BUTTON_TYPES,
  CATEGORY_TYPES,
} from '../../../../commons/constants/url';

import CategoryOne from '../common/CategoryOnePost';
import CategoryTwo from '../common/CategoryTwoPost';
import CategoryThree from '../common/CategoryThreePost';
import CategoryFour from '../common/CategoryFourPost';

const NewPostConfirmModal = React.lazy(() => import('./NewPostConfirmModal'));

const EditConfirmationModal = React.lazy(() =>
  import('./EditConfirmationModal'),
);
const DeleteConfirmationModal = React.lazy(() =>
  import('./DeleteConfirmationModal'),
);
function NewPostModal({
  isNew,
  data: parentData,
  current,
  modal,
  closeModal,
  locations,
}) {
  const [data, setData] = useState();
  const [tabId, setTabId] = useState();
  const { t } = useTranslation(['gmb']);
  const [editable, setEditable] = useState(false);
  const [category, setCategory] = useState('');
  const [buttonList, setButtonList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [remand, setRemand] = useState(false);

  const { get: getGmbPost } = useFetch(
    current?.id ? `${GMB_POST}/${current?.id}` : null,
  );
  const submitNewPost = () => {
    if (data?.id) {
      setEditModal(true);
    } else {
      setNewModal(true);
    }
  };
  const dataChangeHandler = (partialData) => {
    setData({ ...data, ...partialData });
  };
  const { get: getButtonTypes, response: buttonResponse } = useFetch(
    `${GMB_POST}${BUTTON_TYPES}`,
  );

  const { get: getCategoryTypes, response: categoryResponse } = useFetch(
    `${GMB_POST}${CATEGORY_TYPES}`,
  );

  const loadPost = async () => {
    const tz = dayjs.tz.guess();
    const response = await getGmbPost();
    if (response?.success) {
      if (response?.result?.status === 3) setRemand(true);
      const {
        file,
        gmb_post_button_type,
        gmb_post_category,
        gmb_post_locations,
        is_schedule_post,
        start_date = null,
        start_time = null,
        end_date = null,
        end_time = null,
        post_date = null,
        post_time = null,
        ...other
      } = response?.result;
      const finalData = { ...other, is_schedule_post: is_schedule_post === 1 };
      if (file?.path) finalData.image = `${file?.path}${file.name}`;
      if (file?.name) finalData.existing_file = file.name;
      if (gmb_post_button_type?.id)
        finalData.gmb_post_button_type_id = gmb_post_button_type?.id;
      if (gmb_post_category?.id)
        finalData.gmb_post_category_id = gmb_post_category?.id;
      if (gmb_post_category?.name) setCategory(gmb_post_category?.name);
      if (gmb_post_locations && gmb_post_locations.length > 0)
        finalData.locations = gmb_post_locations.map((gl) => gl.location?.id);
      if (start_date && start_time) {
        const dateTime = dayjs
          .utc(`${start_date} ${start_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        finalData.start_date = dateTime.format('YYYY-MM-DD');
        finalData.start_time = dateTime.format('HH:mm');
      }
      if (end_date && end_time) {
        const dateTime = dayjs
          .utc(`${end_date} ${end_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        finalData.end_date = dateTime.format('YYYY-MM-DD');
        finalData.end_time = dateTime.format('HH:mm');
      }
      if (post_date && post_time) {
        const dateTime = dayjs
          .utc(`${post_date} ${post_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        finalData.post_date = dateTime.format('YYYY-MM-DD');
        finalData.post_time = dateTime.format('HH:mm');
      }
      setData(finalData);
    }
  };
  const loadCategories = async () => {
    const responseCategory = await getCategoryTypes();
    if (categoryResponse.ok) {
      setCategoryList(responseCategory?.result?.data);
    }
  };
  const loadButtonTypes = async () => {
    const responseButton = await getButtonTypes();
    if (buttonResponse.ok) {
      const receivedList = responseButton?.result?.data;
      const reformedData = receivedList.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setButtonList(reformedData);
    }
  };
  const openHandler = () => {
    setEditable(isNew);
    loadCategories();
    loadButtonTypes();
    setData(parentData);
    setTabId(current?.gmb_post_category?.id || 1);
  };
  const clear = () => {
    setTabId();
    setRemand(false);
    setEditable(false);
  };

  const deleteHandler = () => {
    setDeleteModal(true);
  };

  useEffect(() => {
    if (current?.id && current?.gmb_post_category?.id === tabId) {
      loadPost();
    } else {
      setData({
        id: data?.id,
        contents: '',
        is_schedule_post: false,
        gmb_post_category_id: tabId,
        locations: data?.locations,
        groups: data?.groups,
        is_user_authorized: data?.is_user_authorized,
        is_file_deleted: isNew ? 0 : 1,
        existing_file: data?.existing_file,
      });
    }
  }, [tabId]);

  return (
    <CModal
      centered
      show={modal}
      onOpened={openHandler}
      closeOnBackdrop={!editModal}
      onClose={closeModal}
      onClosed={clear}
      className={`post-modal${remand ? ' remand' : ''}`}
    >
      <CModalBody>
        {remand && (
          <div className="part left">
            <div className="section">
              <div className="inset">
                {t('gmb:REVIEWS.DISPLAY.REMAND_REASON')}
              </div>
              <br />
              <div
                className="panel"
                style={{ height: '256px', overflow: 'auto' }}
              >
                {data?.reason_for_remand}
              </div>
            </div>
          </div>
        )}
        <div className="part right">
          <div className="remand-row">
            <div className="right">
              {editable ? (
                <div className="right-tab">
                  {categoryList.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`tab-items ${
                          item.id === tabId ? 'item-selected' : ''
                        }`}
                        onClick={() => {
                          setTabId(item.id);
                        }}
                        role="presentation"
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'left', margin: '5px 10px' }}>
                  {category}
                </div>
              )}

              {tabId === 1 && (
                <CategoryOne
                  data={data}
                  editable={editable}
                  schedule={!current?.id}
                  onReturn={closeModal}
                  onDelete={deleteHandler}
                  buttonList={buttonList}
                  onSubmit={submitNewPost}
                  onDataChange={dataChangeHandler}
                  setEditable={() => setEditable(true)}
                />
              )}
              {tabId === 2 && (
                <CategoryTwo
                  data={data}
                  editable={editable}
                  schedule={!current?.id}
                  onReturn={closeModal}
                  onDelete={deleteHandler}
                  onSubmit={submitNewPost}
                  onDataChange={dataChangeHandler}
                  setEditable={() => setEditable(true)}
                />
              )}
              {tabId === 3 && (
                <CategoryThree
                  data={data}
                  editable={editable}
                  schedule={!current?.id}
                  onReturn={closeModal}
                  onDelete={deleteHandler}
                  buttonList={buttonList}
                  onSubmit={submitNewPost}
                  onDataChange={dataChangeHandler}
                  setEditable={() => setEditable(true)}
                />
              )}
              {tabId === 4 && (
                <CategoryFour
                  data={data}
                  editable={editable}
                  schedule={!current?.id}
                  onReturn={closeModal}
                  onDelete={deleteHandler}
                  buttonList={buttonList}
                  onSubmit={submitNewPost}
                  onDataChange={dataChangeHandler}
                  setEditable={() => setEditable(true)}
                />
              )}
            </div>
          </div>
          {current?.id ? (
            <>
              <EditConfirmationModal
                data={data}
                show={editModal}
                onClose={() => setEditModal(false)}
              />
              <DeleteConfirmationModal
                data={data}
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
              />
            </>
          ) : (
            <NewPostConfirmModal
              data={data}
              show={newModal}
              locations={locations}
              onClose={() => setNewModal(false)}
            />
          )}
        </div>
      </CModalBody>
    </CModal>
  );
}
NewPostModal.propTypes = {
  isNew: PropTypes.bool,
  data: PropTypes.object,
  current: PropTypes.object,
  modal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
};

NewPostModal.defaultProps = {
  isNew: false,
  locations: [],
  data: {},
  current: undefined,
};
export default NewPostModal;
