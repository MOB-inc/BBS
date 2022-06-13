/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useState, useEffect } from 'react';
import useFetch from 'use-http';
import * as dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { useDropzone } from 'react-dropzone';
import { timeSelect } from '../../../../../commons/constants/lists';
import CategoryOne from '../../common/CategoryOne';
import CategoryTwo from '../../common/CategoryTwo';
import CategoryThree from '../../common/CategoryThree';
import CategoryFour from '../../common/CategoryFour';
import {
  GMB_POST,
  BUTTON_TYPES,
  CATEGORY_TYPES,
} from '../../../../../commons/constants/url';
import './approval_post_modal.scss';

const tz = dayjs.tz.guess();

const ApprovalModal = React.lazy(() => import('./ApprovalConfirmModal'));
const EditConfirmModal = React.lazy(() => import('./EditConfirmModal'));
const RemandModal = React.lazy(() => import('./RemandModal'));

function ApprovalPostModal({ modal, closeModal, currentId, reloadList, type }) {
  const [imageFile, setImageFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [categoryId, setCategoryId] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [active, setActive] = useState(false);
  const [postInfo, setPostInfo] = useState({});
  const [buttonList, setButtonList] = useState([]);
  const [contents, setContents] = useState();
  const [buttonId, setButtonId] = useState();
  const [title, setTitle] = useState();
  const [coupon, setCoupon] = useState();
  const [link, setLink] = useState();
  const [tou, setTou] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [approvalModal, setApprovalModal] = useState(false);
  const [remandModal, setRemandModal] = useState(false);
  const [editConfirmModal, setEditConfirmModal] = useState(false);
  const [editPayload, setPayload] = useState();
  const [locationIds, setLocationIds] = useState([]);
  const [schedulePost, setSchedulePost] = useState();
  const [imageZoom, setImageZoom] = useState(false);
  const [tabId, setTabId] = useState();
  const [buttonLink, setButtonLink] = useState();
  const [postTime, setPostTime] = useState();
  const [postDate, setPostDate] = useState();
  const [isFileDeleted, setIsFileDeleted] = useState(0);
  const [existingFile, setExistingFile] = useState();

  const toggleEditConfirmModal = () => {
    const data = new FormData();
    data.append('_method', 'PUT');
    data.append('gmb_post_category_id', tabId);
    locationIds.forEach((id) => {
      data.append('locations[]', id);
    });
    data.append('contents', contents);
    data.append('is_schedule_post', schedulePost);
    data.append('is_file_deleted', isFileDeleted);
    data.append('client_timezone', tz);
    if (existingFile) {
      data.append('existing_file', existingFile);
    }
    if (schedulePost === 1) {
      if (postDate && postTime) {
        const post = dayjs(`${postDate} ${postTime}`, 'YYYY-MM-DD HH:mm').utc();
        data.append('post_date', post.format('YYYY-MM-DD'));
        data.append('post_time', post.format('HH:mm'));
      }
    }
    if (tabId === 1) {
      if (buttonId) {
        data.append('gmb_post_button_type_id', buttonId);
        if (buttonLink) {
          data.append('button_link', buttonLink);
        }
      }
    } else if (tabId === 2) {
      if (startDate && startTime) {
        const start = dayjs(
          `${startDate} ${startTime}`,
          'YYYY-MM-DD HH:mm',
        ).utc();
        data.append('start_date', start.format('YYYY-MM-DD'));
        data.append('start_time', start.format('HH:mm'));
      }
      if (endDate && endTime) {
        const end = dayjs(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm').utc();
        data.append('end_date', end.format('YYYY-MM-DD'));
        data.append('end_time', end.format('HH:mm'));
      }
      data.append('title', title);
      if (coupon) {
        data.append('coupon_code', coupon);
      }
      if (link) {
        data.append('Link to Benefit', link);
      }
      if (tou) {
        data.append('terms_of_use', tou);
      }
      if (imageFile) {
        data.append('file', imageFile);
      }
    } else if (tabId === 3) {
      if (buttonId) {
        data.append('gmb_post_button_type_id', buttonId);
        if (buttonLink) {
          data.append('button_link', buttonLink);
        }
      }
      if (imageFile) {
        data.append('file', imageFile);
      }
      setPayload(data);
    } else {
      if (buttonId) {
        data.append('gmb_post_button_type_id', buttonId);
        if (buttonLink) {
          data.append('button_link', buttonLink);
        }
      }
      if (startDate && startTime) {
        const start = dayjs(
          `${startDate} ${startTime}`,
          'YYYY-MM-DD HH:mm',
        ).utc();
        data.append('start_date', start.format('YYYY-MM-DD'));
        data.append('start_time', start.format('HH:mm'));
      }
      if (endDate && endTime) {
        const end = dayjs(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm').utc();
        data.append('end_date', end.format('YYYY-MM-DD'));
        data.append('end_time', end.format('HH:mm'));
      }
      data.append('title', title);
      if (imageFile) {
        data.append('file', imageFile);
      }
    }
    setPayload(data);
    setEditConfirmModal(!editConfirmModal);
  };
  const toggleApprovalModal = () => {
    setApprovalModal(!approvalModal);
  };
  const toggleRemandModal = () => {
    setRemandModal(!remandModal);
  };
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setIsFileDeleted(0);
    });
  }, []);
  const changeImage = () => {
    setImageUrl();
    setImageFile();
    setIsFileDeleted(1);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: !active,
  });
  const onTextAreaChange = (event, areaType) => {
    event.preventDefault();
    if (areaType === 'contents') {
      setContents(event.target.value);
    } else if (areaType === 'title') {
      setTitle(event.target.value);
    } else if (areaType === 'coupon') {
      setCoupon(event.target.value);
    } else if (areaType === 'link') {
      setLink(event.target.value);
    } else if (areaType === 'tou') {
      setTou(event.target.value);
    } else if (areaType === 'buttonlink') {
      setButtonLink(event.target.value);
    }
  };
  const onButtonTypeChange = (event) => {
    setButtonId(event.value);
    setButtonLink(null);
  };
  const changeTime = (event, timeType) => {
    if (timeType === 'start') {
      setStartTime(event.value);
    } else {
      setEndTime(event.value);
    }
  };
  const changeDate = (event, datetType) => {
    if (datetType === 'start') {
      setStartDate(event);
    } else {
      setEndDate(event);
    }
  };
  const { get: getPost, response: postResponse } = useFetch(
    `${GMB_POST}/${currentId}`,
  );
  const { get: getButtonTypes, response: buttonResponse } = useFetch(
    `${GMB_POST}${BUTTON_TYPES}`,
  );
  const { get: getCategoryTypes, response: categoryResponse } = useFetch(
    `${GMB_POST}${CATEGORY_TYPES}`,
  );
  const loadPost = async () => {
    const responsePost = await getPost();
    if (postResponse.ok) {
      setPostInfo(responsePost?.result);
      setContents(responsePost?.result?.contents);
      setCategoryId(responsePost?.result?.gmb_post_category?.id);
      if (!tabId) setTabId(responsePost?.result?.gmb_post_category?.id);
      setButtonId(responsePost?.result?.gmb_post_button_type?.id);
      const tempLocations = responsePost?.result?.gmb_post_locations;
      const newList = tempLocations.map((item) => {
        return item?.location?.id;
      });
      setLocationIds(newList);
      setTitle(responsePost?.result?.title);
      setContents(responsePost?.result?.contents);
      setButtonLink(responsePost?.result?.button_link);
      setCoupon(responsePost?.result?.coupon_code);
      setLink(responsePost?.result?.link_to_benefit);
      setTou(responsePost?.result?.terms_of_use);
      const {
        start_date,
        start_time,
        end_date,
        end_time,
        post_date,
        post_time,
      } = responsePost?.result;
      if (start_date && start_time) {
        const dateTime = dayjs
          .utc(`${start_date} ${start_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        setStartDate(dateTime.format('YYYY-MM-DD'));
        setStartTime(dateTime.format('HH:mm'));
      }
      if (end_date && end_time) {
        const dateTime = dayjs
          .utc(`${end_date} ${end_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        setEndDate(dateTime.format('YYYY-MM-DD'));
        setEndTime(dateTime.format('HH:mm'));
      }
      setSchedulePost(responsePost?.result?.is_schedule_post);
      if (post_date && post_time) {
        const dateTime = dayjs
          .utc(`${post_date} ${post_time}`, 'YYYY-MM-DD HH:mm')
          .tz(tz);
        setPostDate(dateTime.format('YYYY-MM-DD'));
        setPostTime(dateTime.format('HH:mm'));
      }
      setIsFileDeleted(0);
      const path = responsePost?.result?.file?.path;
      const name = responsePost?.result?.file?.name;
      const totalUrl = path + name;
      setImageUrl(totalUrl);
      setExistingFile(name);
    }
  };
  useEffect(() => {
    if (modal && tabId === categoryId) {
      loadPost();
    } else {
      // initialize();
      setPostInfo();
      setContents();
      setButtonId();
      setTitle();
      setImageUrl();
      setStartDate();
      setEndDate();
      setStartTime();
      setEndTime();
      setCoupon();
      setLink();
      setTou();
      setButtonLink();
      setIsFileDeleted(1);
    }
  }, [tabId]);
  const loadCategories = async () => {
    const responseCategory = await getCategoryTypes();
    if (categoryResponse.ok) {
      setCategoryList(responseCategory?.result?.data);
    }
  };
  const loadButtonTypes = async () => {
    const responseButton = await getButtonTypes();
    if (buttonResponse.ok) {
      const recievedList = responseButton?.result?.data;
      const reformedData = recievedList.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setButtonList(reformedData);
    }
  };
  const openHandler = () => {
    loadPost();
    loadCategories();
    loadButtonTypes();
  };
  const clear = () => {
    setActive(false);
    setImageZoom(false);
    setTabId();
    setCategoryId();
  };
  return (
    <>
      <CModal
        onOpened={openHandler}
        centered
        show={modal}
        onClose={closeModal}
        onClosed={clear}
        className="approval-post-modal"
      >
        <CModalBody>
          <CForm action="" method="post" className="form-horizontal">
            <CRow className="remand-row">
              <CCol md="12" className="right">
                {active ? (
                  <div className="right-tab">
                    {categoryList.map((item) => {
                      return (
                        <div
                          className={`tab-items ${
                            item.id === tabId ? 'item-selected' : ''
                          }`}
                          onClick={() => setTabId(item.id)}
                          role="presentation"
                        >
                          {item.name}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="right-tab">
                    {categoryList.map((item) => {
                      if (item.id === tabId) {
                        return <div className="tab-items">{item.name}</div>;
                      }
                      return <></>;
                    })}
                  </div>
                )}
                {tabId === 1 ? (
                  <>
                    <CategoryOne
                      active={active}
                      contents={contents}
                      buttonList={buttonList}
                      buttonId={buttonId}
                      buttonName={postInfo?.gmb_post_button_type?.name}
                      onTextAreaChange={onTextAreaChange}
                      onButtonTypeChange={onButtonTypeChange}
                      toggleApprovalModal={toggleApprovalModal}
                      toggleRemandModal={toggleRemandModal}
                      toggleEditConfirmModal={toggleEditConfirmModal}
                      setActive={setActive}
                      reloadPost={loadPost}
                      buttonLink={buttonLink}
                    />
                  </>
                ) : tabId === 2 ? (
                  <>
                    <CategoryTwo
                      active={active}
                      title={title}
                      contents={contents}
                      imageUrl={imageUrl}
                      coupon={coupon}
                      link={link}
                      tou={tou}
                      imageZoom={imageZoom}
                      startDate={startDate}
                      endDate={endDate}
                      startTime={startTime}
                      endTime={endTime}
                      timeSelect={timeSelect}
                      changeDate={changeDate}
                      changeTime={changeTime}
                      changeImage={changeImage}
                      getRootProps={getRootProps}
                      getInputProps={getInputProps}
                      setImageZoom={setImageZoom}
                      onTextAreaChange={onTextAreaChange}
                      toggleApprovalModal={toggleApprovalModal}
                      toggleRemandModal={toggleRemandModal}
                      toggleEditConfirmModal={toggleEditConfirmModal}
                      setActive={setActive}
                      reloadPost={loadPost}
                    />
                  </>
                ) : tabId === 3 ? (
                  <>
                    <CategoryThree
                      active={active}
                      contents={contents}
                      buttonList={buttonList}
                      buttonId={buttonId}
                      buttonName={postInfo?.gmb_post_button_type?.name}
                      imageUrl={imageUrl}
                      imageZoom={imageZoom}
                      changeImage={changeImage}
                      getRootProps={getRootProps}
                      getInputProps={getInputProps}
                      setImageZoom={setImageZoom}
                      onTextAreaChange={onTextAreaChange}
                      onButtonTypeChange={onButtonTypeChange}
                      toggleApprovalModal={toggleApprovalModal}
                      toggleRemandModal={toggleRemandModal}
                      toggleEditConfirmModal={toggleEditConfirmModal}
                      setActive={setActive}
                      reloadPost={loadPost}
                      buttonLink={buttonLink}
                    />
                  </>
                ) : (
                  <>
                    <CategoryFour
                      active={active}
                      title={title}
                      contents={contents}
                      buttonList={buttonList}
                      buttonId={buttonId}
                      buttonName={postInfo?.gmb_post_button_type?.name}
                      imageUrl={imageUrl}
                      imageZoom={imageZoom}
                      startDate={startDate}
                      endDate={endDate}
                      startTime={startTime}
                      endTime={endTime}
                      timeSelect={timeSelect}
                      changeDate={changeDate}
                      changeTime={changeTime}
                      changeImage={changeImage}
                      getRootProps={getRootProps}
                      getInputProps={getInputProps}
                      setImageZoom={setImageZoom}
                      onTextAreaChange={onTextAreaChange}
                      onButtonTypeChange={onButtonTypeChange}
                      toggleApprovalModal={toggleApprovalModal}
                      toggleRemandModal={toggleRemandModal}
                      toggleEditConfirmModal={toggleEditConfirmModal}
                      setActive={setActive}
                      reloadPost={loadPost}
                      buttonLink={buttonLink}
                    />
                  </>
                )}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <ApprovalModal
          type={type}
          currentId={currentId}
          modal={approvalModal}
          closeModal={toggleApprovalModal}
          reloadList={reloadList}
        />
        <EditConfirmModal
          type={type}
          currentId={currentId}
          payload={editPayload}
          reloadList={reloadList}
          modal={editConfirmModal}
          closeModal={toggleEditConfirmModal}
        />
        <RemandModal
          type={type}
          currentId={currentId}
          reloadList={reloadList}
          modal={remandModal}
          closeModal={toggleRemandModal}
        />
      </CModal>
    </>
  );
}
ApprovalPostModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
  reloadList: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
};

export default ApprovalPostModal;
