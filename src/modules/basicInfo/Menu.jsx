/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import {
  CCard,
  CCardBody,
  CRow,
  CForm,
  CFormGroup,
  CButton,
  CImg,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import MenuModal from './modals/MenuCreateEditModal';
import MenuItemModal from './modals/MenuItemCreateEditModal';
import DeleteMenuItem from './modals/MenuItemDeleteModal';
import DeleteMenuCategory from './modals/MenuCategoryDeleteModal';
import CsvDownloadConfirm from './modals/CsvDownloadConfirm';
import CsvUpload from './modals/CsvUpload';
import { AppContext } from '../../commons/helpers/appContext';
import Explanation from '../../commons/components/Explanation';
import { ReactComponent as EditIcon } from '../../commons/icons/edit.svg';
import { ReactComponent as AddIcon } from '../../commons/icons/add.svg';
import { ReactComponent as ArrowRight } from '../../commons/icons/arrow-right.svg';
import { ReactComponent as ArrowLeft } from '../../commons/icons/arrow-left.svg';
import { ReactComponent as DownloadIcon } from '../../commons/icons/cloud-download.svg';
import { ReactComponent as UploadIcon } from '../../commons/icons/cloud-upload.svg';
import {
  LOCATIONS,
  CATEGORIES_BY_LOCATION,
  MENU_CATEGORIES,
  MENUS_BY_CATEGORY,
  LOCATION_BOOKS,
} from '../../commons/constants/url';
import { YEN } from '../../commons/constants/key';
import Navigation from './Navigation/Navigation';
import './menu.scss';

const MenuItem = ({ text, selected, id, clickFunc }) => {
  return (
    <div
      className={`menu-item ${selected ? 'active' : ''}`}
      onClick={() => clickFunc(id)}
    >
      {text}
    </div>
  );
};

const MainMenu = ({ list, newSelected, clickFunc }) =>
  list.map((el) => {
    const { id, name } = el;
    return (
      <MenuItem
        text={name}
        key={id}
        selected={newSelected === id}
        id={id}
        clickFunc={clickFunc}
      />
    );
  });

function Menu() {
  //
  const { setHasFoodMenus, setHasServiceItems, menuMode } =
    useContext(AppContext);
  const { t } = useTranslation(['basic_info']);
  const [menuCategory, setMenuCategory] = useState([]);
  const [selected, setOnSelect] = useState();
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [locationList, setlocationList] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentItemRowData, setCurrentItemRowData] = useState({});
  const [currentMenuId, setCurrentMenuId] = useState('');
  const [currentCateRowData, setCurrentCateRowData] = useState({});
  const ref = useRef();
  const setSelect = (key) => {
    setOnSelect(key);
  };
  const setOnSelectLocation = (key) => {
    setSelectedLocation(key);
  };
  const scroll = (scrollOffset) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };
  const addNewList = (newList, type) => {
    if (type === 1) {
      setMenuCategory(newList);
      if (newList.length === 1) {
        setOnSelect(newList && newList[0] ? newList[0].id : '');
      }
    } else if (type === 3) {
      setMenuCategory(newList);
      if (newList.length === 0) {
        setMenuItems([]);
      } else {
        setOnSelect(
          newList && newList[newList.length - 1]
            ? newList[newList.length - 1].id
            : '',
        );
      }
    } else {
      setMenuItems(newList);
    }
  };
  const [createMenuModal, setCreateMenuModal] = useState(false);
  const [editMenuModal, setEditMenuModal] = useState(false);
  const [createMenuItemModal, setCreateMenuItemModal] = useState(false);
  const [editMenuItemModal, setEditMenuItemModal] = useState(false);
  const [deleleMenuCategory, setDeleteMenuCategory] = useState(false);
  const [deleleMenuItem, setDeleteMenuItem] = useState(false);
  const [csvDownloadConfirm, setCsvDownloadConfirm] = useState(false);
  const [csvUploadConfirm, setCsvUploadConfirm] = useState(false);
  const toggleCreateMenuModal = () => {
    setCreateMenuModal(!createMenuModal);
  };
  const toggleEditMenuModal = () => {
    setEditMenuModal(!editMenuModal);
  };
  const toggleCreateMenuItemModal = () => {
    setCreateMenuItemModal(!createMenuItemModal);
  };
  const toggleEditMenuItemModal = () => {
    setEditMenuItemModal(!editMenuItemModal);
  };
  const toggleDeleteMenuCategory = () => {
    setDeleteMenuCategory(!deleleMenuCategory);
  };
  const toggleDeleteMenuItem = () => {
    setDeleteMenuItem(!deleleMenuItem);
  };
  const toggleCsvDownloadConfirm = () => {
    setCsvDownloadConfirm(!csvDownloadConfirm);
  };
  const toggleCsvUploadConfirm = () => {
    setCsvUploadConfirm(!csvUploadConfirm);
  };
  const onRowClick = async (currentRowData, currentRowIndex) => {
    setCurrentMenuId(currentRowIndex);
    setCurrentItemRowData(currentRowData);
    toggleEditMenuItemModal();
  };
  const onRowCategoryClick = async () => {
    const currentData = menuCategory.find((x) => x.id === selected);
    setCurrentCateRowData(currentData);
    toggleEditMenuModal();
  };
  const { get: getLocationList, response } = useFetch(LOCATION_BOOKS);
  useFetch(
    selectedLocation
      ? `${LOCATIONS}/${selectedLocation}${CATEGORIES_BY_LOCATION}`
      : null,
    {
      onNewData: (currData, newData) => {
        const { result } = newData;
        const { menu_categories } = result;
        setMenuCategory(menu_categories);
        setOnSelect(
          menu_categories && menu_categories[0] ? menu_categories[0].id : '',
        );
      },
    },
    [selectedLocation],
  );

  useFetch(
    selected ? `${MENU_CATEGORIES}/${selected}${MENUS_BY_CATEGORY}` : null,
    {
      onNewData: (currData, newData) => {
        setMenuItems([]);
        const { result } = newData;
        const { menus } = result;
        setMenuItems(menus);
      },
    },
    [selected],
  );
  const loadLocationList = async () => {
    setMenuItems([]);
    const resultResponse = await getLocationList();
    const data = resultResponse?.result?.data;
    if (response.ok) {
      const servicesFlag = data?.some((item) => item.has_service_items);
      setHasServiceItems(servicesFlag);
      const menuFlag = data?.some((item) => item.has_food_menus);
      setHasFoodMenus(menuFlag);
      const filteredMenuLocations = data?.filter((item) => item.has_food_menus);
      setlocationList(filteredMenuLocations);
      setSelectedLocation(
        filteredMenuLocations && filteredMenuLocations[0]
          ? filteredMenuLocations[0]?.id
          : '',
      );
    }
  };
  useEffect(() => {
    loadLocationList();
  }, []);
  return (
    <>
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="MENU" isConnectDisp />
          <Navigation />
        </>
      )}

      <div className="info-menu">
        <div className="download-button" onClick={toggleCsvDownloadConfirm}>
          <DownloadIcon />
          {t('basic_info:MENU.DOWNLOAD')}
        </div>
        <div className="upload-button" onClick={toggleCsvUploadConfirm}>
          <UploadIcon />
          {t('basic_info:MENU.UPLOAD')}
        </div>
        <CRow>
          <div className="location-wrapper">
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
                        className={
                          selectedLocation === item.id
                            ? ' active-location list-location'
                            : index % 2 === 0
                            ? ' background-odd list-location'
                            : ' list-location'
                        }
                        onClick={() => setOnSelectLocation(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </CCardBody>
            </CCard>
          </div>
          <div className="full-menu-card">
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <div className="horizontal-scroll-padding">
                  <div className="horizontal-scrolling-menu">
                    <CButton className="scroll-menu-arrow left-arrow-padding-none">
                      <ArrowLeft
                        height={15}
                        width={15}
                        onClick={() => scroll(-400)}
                      />
                    </CButton>
                    <div className="item-card" ref={ref}>
                      <MainMenu
                        list={menuCategory}
                        newSelected={selected}
                        clickFunc={setSelect}
                      />
                    </div>
                    <CButton className="scroll-menu-arrow right-arrow-padding-none">
                      <ArrowRight
                        height={15}
                        width={15}
                        style={{ transform: [{ rotateY: '180deg' }] }}
                        onClick={() => scroll(400)}
                      />
                    </CButton>
                  </div>
                </div>
                {menuCategory.length > 0 ? (
                  <div className="edit-icon-wrapper">
                    <CButton
                      shape="pill"
                      className="edit-icon"
                      onClick={() => {
                        onRowCategoryClick();
                      }}
                    >
                      <EditIcon height={20} width={20} />
                    </CButton>
                  </div>
                ) : (
                  <></>
                )}
                {locationList.length > 0 ? (
                  <div className="add-icon-wrapper">
                    <AddIcon
                      height={15}
                      width={15}
                      className="add-icon"
                      onClick={toggleCreateMenuModal}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </CFormGroup>
              <div className="item-list">
                {menuItems &&
                  menuItems.map((item, index) => {
                    return (
                      <CFormGroup
                        row
                        className={index % 2 === 0 ? ' background-odd' : ''}
                        key={index}
                      >
                        <div className="info-border-right">
                          <p className="info-label item-name">{item.name}</p>
                          <p className="info-label description">
                            {item.description}
                          </p>
                        </div>

                        <div className="price-portion">
                          <p className="price">
                            {item.price != null && YEN}
                            {item.price}
                          </p>
                          {item?.gmb_photo?.file && (
                            <CImg
                              className="select-photo"
                              thumbnail
                              src={
                                item?.gmb_photo?.photo_category_name ===
                                'PROFILE'
                                  ? item?.gmb_photo?.file.path
                                  : item?.gmb_photo?.file.thumb_path
                              }
                            />
                          )}
                        </div>
                        <div
                          className={`icon-portion ${
                            index % 2 === 0 ? ' background-white' : ''
                          }`}
                        >
                          <CButton
                            shape="pill"
                            onClick={() => {
                              onRowClick(item, item.id);
                            }}
                          >
                            <EditIcon height={20} width={20} />
                          </CButton>
                        </div>
                        <div className="empty-wrapper" />
                      </CFormGroup>
                    );
                  })}
                <CFormGroup
                  className={
                    menuItems.length % 2 === 0
                      ? 'background-odd'
                      : 'background-white'
                  }
                  row
                >
                  <div className="add-item-wrapper">
                    {menuCategory.length > 0 ? (
                      <AddIcon
                        height={15}
                        width={15}
                        className="add-menu-icon"
                        onClick={toggleCreateMenuItemModal}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="info-border-add" />
                  <div className="background-white-empty-add" />
                </CFormGroup>
              </div>
            </CForm>
          </div>
        </CRow>
        <MenuModal
          closeModal={toggleCreateMenuModal}
          modal={createMenuModal}
          locationId={(selectedLocation || '').toString()}
          edit={false}
          addingCategory={addNewList}
          menuCateList={menuCategory || []}
        />
        <MenuModal
          closeModal={toggleEditMenuModal}
          modal={editMenuModal}
          locationId={(selectedLocation || '').toString()}
          edit
          addingCategory={addNewList}
          menuCateList={menuCategory || []}
          currentRow={currentCateRowData || {}}
          categoryId={(selected || '').toString()}
          openDeleteModal={toggleDeleteMenuCategory}
        />
        <MenuItemModal
          closeModal={toggleCreateMenuItemModal}
          modal={createMenuItemModal}
          edit={false}
          menuItemList={menuItems || {}}
          addingItem={addNewList}
          categoryId={(selected || '').toString()}
          locationId={selectedLocation}
        />
        <MenuItemModal
          closeModal={toggleEditMenuItemModal}
          modal={editMenuItemModal}
          edit
          menuItemList={menuItems || []}
          addingItem={addNewList}
          categoryId={(selected || '').toString()}
          currentRow={currentItemRowData || {}}
          menuId={(currentMenuId || '').toString()}
          openDeleteModal={toggleDeleteMenuItem}
          locationId={selectedLocation}
        />
        <DeleteMenuItem
          closeModal={toggleDeleteMenuItem}
          modal={deleleMenuItem}
          currentRow={currentItemRowData || {}}
          menuItemList={menuItems || []}
          addingItem={addNewList}
          menuId={(currentMenuId || '').toString()}
        />
        <DeleteMenuCategory
          closeModal={toggleDeleteMenuCategory}
          modal={deleleMenuCategory}
          currentRow={currentCateRowData || {}}
          menuCateList={menuCategory || []}
          addingCategory={addNewList}
          categoryId={(selected || '').toString()}
        />
        <CsvDownloadConfirm
          closeModal={toggleCsvDownloadConfirm}
          modal={csvDownloadConfirm}
          locationId={selectedLocation}
        />
        <CsvUpload show={csvUploadConfirm} onClose={toggleCsvUploadConfirm} />
      </div>
    </>
  );
}

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  clickFunc: PropTypes.func.isRequired,
};

export default Menu;
