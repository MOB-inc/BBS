/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import {
  CCard,
  CCardBody,
  CRow,
  CForm,
  CFormGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import UploadModal from './modals/ImageUploadModal';
import DeleteModal from './modals/ImageDeleteConfirmModal';
import UploadCategoryModal from './modals/ImageCategoryModal';
import {
  PHOTO_CATEGORIES,
  GMB_PHOTOS,
  PHOTO_BY_LOCATION,
  LOCATION_BOOKS,
} from '../../commons/constants/url';
import Explanation from '../../commons/components/Explanation';
import { ReactComponent as ArrowRight } from '../../commons/icons/arrow-right.svg';
import { ReactComponent as ArrowLeft } from '../../commons/icons/arrow-left.svg';
import { ReactComponent as FilterIcon } from '../../commons/icons/filter.svg';
import { ReactComponent as DeleteIcon } from '../../commons/icons/delete_x.svg';
import Navigation from './Navigation/Navigation';
import { AppContext } from '../../commons/helpers/appContext';
import './image_tab.scss';

const MenuItem = ({ text, selected, id, clickFunc, gmbName }) => {
  return (
    <div
      className={`menu-item ${selected ? 'active' : ''}`}
      onClick={() => clickFunc(id, gmbName)}
      role="presentation"
    >
      {text}
    </div>
  );
};

const MainMenu = ({ list, newSelected, clickFunc }) =>
  list.map((el) => {
    const { id, jp_name, gmb_photo_category_name } = el;
    return (
      <MenuItem
        text={jp_name}
        key={id}
        selected={newSelected === id}
        id={id}
        clickFunc={clickFunc}
        gmbName={gmb_photo_category_name}
      />
    );
  });

function ImageTab() {
  const { t } = useTranslation(['basic_info']);
  const {
    setHasFoodMenus,
    setHasServiceItems,
    setSelectedLocationID,
    menuMode,
  } = useContext(AppContext);
  const [locationList, setlocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selected, setOnSelect] = useState(1);
  const [gmbNameState, setGMBName] = useState();
  const [isHovering, setIsHovering] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [removedCategoryList, setRemovedCategoryList] = useState([]);
  const [imageFile, setImageFile] = useState();
  const [imageList, setImageList] = useState();
  const ref = useRef();
  const [uploadImageModal, setUploadImageModal] = useState(false);
  const [uploadCategoryModal, setUploadCategoryModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [filterType, setFilterType] = useState();
  const [deleteId, setDeleteId] = useState();
  const [imageWidth, setImageWidth] = useState();
  const [imageHeight, setImageHeight] = useState();
  const [imageSize, setImageSize] = useState();
  const toggleUploadImageModal = () => {
    setUploadImageModal(!uploadImageModal);
  };
  const toggleUploadCategoryModal = () => {
    setUploadCategoryModal(!uploadCategoryModal);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };
  const toggleFilter = () => {
    setFilterDropdown(!filterDropdown);
  };
  const changeFilter = (type) => {
    setFilterType(type);
    toggleFilter();
  };
  const addingNewImageList = (newList) => {
    setImageList(newList);
  };
  const { get: getLocationList, response } = useFetch(LOCATION_BOOKS);
  const { get: getPhotoCategories, response: responseCate } =
    useFetch(PHOTO_CATEGORIES);
  useFetch(
    selectedLocation && selected && filterType
      ? `${GMB_PHOTOS}/${selectedLocation}${PHOTO_BY_LOCATION}?sorting_type=${filterType}&photo_category_name=${gmbNameState}`
      : selectedLocation && selected
      ? `${GMB_PHOTOS}/${selectedLocation}${PHOTO_BY_LOCATION}?photo_category_name=${gmbNameState}`
      : null,
    {
      onNewData: (currData, newData) => {
        const { result } = newData;
        const { data } = result;
        setImageList(data);
      },
    },
    [selectedLocation, selected, filterType],
  );
  const { delete: deleteImageById, response: responseDelete } = useFetch(
    `${GMB_PHOTOS}/${deleteId}`,
  );
  const deleteImage = async () => {
    await deleteImageById();
    if (responseDelete.ok) {
      const remainingImageList = imageList.filter(
        (image) => image.id !== deleteId,
      );
      addingNewImageList(remainingImageList);
      toggleDeleteModal();
    }
  };
  const settingDeleteId = (id) => {
    setDeleteId(id);
    toggleDeleteModal();
  };
  const loadLocationList = async () => {
    const resultResponse = await getLocationList();
    const data = resultResponse?.result?.data;
    if (response.ok) {
      const servicesFlag = data?.some((item) => item.has_service_items);
      setHasServiceItems(servicesFlag);
      const menuFlag = data?.some((item) => item.has_food_menus);
      setHasFoodMenus(menuFlag);
      setlocationList(data);
      setSelectedLocation(data && data[0] ? data[0]?.id : '');
    }
  };
  const setOnSelectLocation = (key) => {
    setSelectedLocation(key);
  };
  const loadPhotoCategories = async () => {
    const imageResponse = await getPhotoCategories();
    const imageData = imageResponse?.result;
    if (responseCate.ok) {
      if (imageData !== null) {
        setCategoryList(imageData);
        setOnSelect(imageData[0].id);
        const tempCategoryList = imageData;
        const remainingList = tempCategoryList.filter((item) => {
          return item.id !== 1;
        });
        setRemovedCategoryList(remainingList);
      }
    }
  };
  const scroll = (scrollOffset) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };
  const setSelect = (key, name) => {
    setOnSelect(key);
    setGMBName(name);
    setFilterType();
  };
  const handleMouseEnter = (index) => {
    setIsHovering((prevState) => ({ ...prevState, [index]: true }));
  };
  const getImageFile = (image, width, height, size) => {
    setImageFile(image);
    setImageWidth(width);
    setImageHeight(height);
    setImageSize(size);
  };
  const handleMouseLeave = (index) => {
    setIsHovering((prevState) => ({ ...prevState, [index]: false }));
  };
  useEffect(() => {
    loadLocationList();
    loadPhotoCategories();
  }, []);

  useEffect(() => {
    setSelectedLocationID(selectedLocation);
  }, [selectedLocation]);
  return (
    <>
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="IMAGE" />
          <Navigation />
        </>
      )}
      <div className="image-tab">
        <CRow>
          <div className="image-location-wrapper">
            <CCard className="location-card-body">
              <CCardBody className="location-list-card">
                <div className="list-location location-title">
                  {t('basic_info:MENU.LOCATION')}
                </div>
                {locationList &&
                  locationList.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`list-location ${
                          selectedLocation === item.id
                            ? ' active-location'
                            : index % 2 === 0
                            ? ' background-odd'
                            : ''
                        }`}
                        role="presentation"
                        onClick={() => setOnSelectLocation(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </CCardBody>
            </CCard>
          </div>
          <div className="full-image-card">
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <div className="horizontal-scroll-padding">
                  <div className="horizontal-scrolling-menu">
                    <CButton className="scroll-menu-arrow left-arrow-padding-none">
                      <ArrowLeft
                        height={15}
                        width={15}
                        onClick={() => scroll(-20)}
                      />
                    </CButton>
                    <div className="item-card" ref={ref}>
                      <MainMenu
                        list={categoryList}
                        newSelected={selected}
                        clickFunc={setSelect}
                      />
                    </div>
                    <CButton className="scroll-menu-arrow right-arrow-padding-none">
                      <ArrowRight
                        height={15}
                        width={15}
                        style={{ transform: [{ rotateY: '180deg' }] }}
                        onClick={() => scroll(20)}
                      />
                    </CButton>
                  </div>
                </div>
                <div className="filter-icon-wrapper">
                  <CDropdown direction="dropup">
                    <CDropdownToggle href="#">
                      <FilterIcon height={13} width={13} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem
                        href="#"
                        onClick={() => changeFilter('by_date')}
                      >
                        {t('basic_info:IMAGE_TAB.BY_DATE')}
                      </CDropdownItem>
                      <CDropdownItem
                        href="#"
                        onClick={() => changeFilter('popularity')}
                      >
                        {t('basic_info:IMAGE_TAB.POPULARITY')}
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </CFormGroup>
              <div className="photo-list-portion">
                <>
                  {selected === 1 ? (
                    <div className="photo-upload-portion">
                      <div className="photo-border-portion">
                        <button
                          type="button"
                          className="upload-button"
                          onClick={toggleUploadImageModal}
                          disabled={
                            locationList.length === 0 ||
                            categoryList.length === 0
                          }
                        >
                          {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="photo-list-items">
                    {imageList &&
                      imageList.map((image, index) => {
                        return (
                          <div
                            className="image-wrapper"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                          >
                            <img
                              className="image"
                              src={
                                image.photo_category_name === 'PROFILE'
                                  ? image.file.path
                                  : image.file.thumb_path
                              }
                              alt=""
                            />
                            {isHovering[index] ? (
                              <DeleteIcon
                                width={20}
                                height={20}
                                className="delete-icon"
                                onClick={() => settingDeleteId(image.id)}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </>
              </div>
            </CForm>
          </div>
        </CRow>
        <UploadModal
          modal={uploadImageModal}
          closeModal={toggleUploadImageModal}
          imageFileCallback={getImageFile}
          OpenCategoryModal={toggleUploadCategoryModal}
        />
        <UploadCategoryModal
          modal={uploadCategoryModal}
          closeModal={toggleUploadCategoryModal}
          categoryList={removedCategoryList}
          imageFile={imageFile}
          locationId={selectedLocation}
          imageList={imageList}
          addingImage={addingNewImageList}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          imageSize={imageSize}
        />
        <DeleteModal
          modal={deleteModal}
          closeModal={toggleDeleteModal}
          deleteImage={deleteImage}
        />
      </div>
    </>
  );
}

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  clickFunc: PropTypes.func.isRequired,
  gmbName: PropTypes.string.isRequired,
};

export default ImageTab;
