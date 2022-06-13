/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import {
  CCard,
  CCardBody,
  CRow,
  CForm,
  CFormGroup,
  CButton,
} from '@coreui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import axios from 'axios';
import Explanation from '../../commons/components/Explanation';
import {
  SERVICE_ITEM_BY_LOCATION,
  LOCATIONS,
  LOCATION_BOOKS,
} from '../../commons/constants/url';
import BasicInfoNavigation from './Navigation/Navigation';
import { ReactComponent as EditIcon } from '../../commons/icons/edit.svg';
import { ReactComponent as AddIcon } from '../../commons/icons/add.svg';
import { AppContext } from '../../commons/helpers/appContext';
import './services.scss';
import { YEN } from '../../commons/constants/key';
import ServiceAddEditModal from './modals/ServiceItemCreateEditModal';
import CommonDeleteModal from './modals/CommonDeleteModal';

const Services = () => {
  const {
    t,
    i18n: { language: selectedLanguage },
  } = useTranslation(['basic_info']);
  const { get: getLocationList, response } = useFetch(LOCATION_BOOKS);
  let i = 0;
  const { setHasFoodMenus, menuMode } = useContext(AppContext);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [editServiceItemModal, setEditServiceItemModal] = useState(false);
  const [createServiceModal, setCreateServiceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentItemRowData, setCurrentItemRowData] = useState({});
  const [locationList, setlocationList] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [locationService, setLoactionService] = useState([]);
  const [currentFalseService, setCurrentFalseService] = useState([]);
  const [responseEn, setResponseEn] = useState([]);
  const [responseJp, setResponseJp] = useState([]);

  const setOnSelectLocation = async (key) => {
    const resultResponse = await axios.get(
      `${LOCATIONS}/${key}${SERVICE_ITEM_BY_LOCATION}`,
    );
    setResponseEn(resultResponse.data.result.response_en);
    setResponseJp(resultResponse.data.result.response_jp);
    setSelectedLocation(key);
  };

  const toggleEditServiceModal = () => {
    setEditServiceItemModal((prev) => !prev);
  };

  const toggleCreateServiceModal = () => {
    setCreateServiceModal((prev) => !prev);
  };

  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const loadLocationList = async () => {
    setLoactionService([]);
    const resultResponse = await getLocationList();
    const data = resultResponse?.result?.data;
    if (response.ok) {
      const menuFlag = data.some((item) => item.has_food_menus);
      setHasFoodMenus(menuFlag);
      const filteredServiceLocations = data?.filter(
        (item) => item.has_service_items,
      );
      setlocationList(filteredServiceLocations);
      setSelectedLocation(
        filteredServiceLocations && filteredServiceLocations[0]
          ? filteredServiceLocations[0]?.id
          : '',
      );
      if (filteredServiceLocations && filteredServiceLocations[0]) {
        const res = await axios.get(
          `${LOCATIONS}/${filteredServiceLocations[0].id}${SERVICE_ITEM_BY_LOCATION}`,
        );
        setResponseEn(res.data.result.response_en);
        setResponseJp(res.data.result.response_jp);
      }
    }
  };

  const loadServiveList = (lang) => {
    const loadResponse = lang === 'en' ? [...responseEn] : [...responseJp];
    setLoactionService(loadResponse);
    setCurrentFalseService(
      loadResponse.filter((item) => item.current === false),
    );
  };

  const onRowClick = async (currentRowData) => {
    setCurrentItemRowData(currentRowData);
    toggleEditServiceModal();
  };

  useEffect(() => {
    loadLocationList();
  }, []);

  useEffect(() => {
    loadServiveList(selectedLanguage);
  }, [selectedLanguage, responseEn, responseJp]);
  return (
    <div className="services">
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="BASIC_INFO" isPhraseDisp="ABC" />
          <BasicInfoNavigation />
        </>
      )}
      <div className="service__container">
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
                        role="button"
                        key={index}
                        tabIndex={index}
                        className={
                          selectedLocation === item.id
                            ? ' active-location list-location'
                            : index % 2 === 0
                            ? ' background-odd list-location'
                            : ' list-location'
                        }
                        onClick={() => setOnSelectLocation(item.id)}
                        onKeyDown={() => setOnSelectLocation(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </CCardBody>
            </CCard>
          </div>
          <div className="full-services-card">
            <CForm action="" method="post" className="form-horizontal">
              <div className="item-list">
                {locationService &&
                  locationService.map((item, index) => {
                    if (item && item.current === true) {
                      i += 1;
                      return (
                        <CFormGroup
                          row
                          className={i % 2 === 1 ? ' background-odd' : ''}
                          key={index}
                        >
                          <div className="info-border-right">
                            {item && item.freeFormServiceItem && (
                              <p className="info-label item-name">
                                {item.freeFormServiceItem.label.displayName}
                              </p>
                            )}
                            {item && item.structuredServiceItem && (
                              <p className="info-label item-name">
                                {item.structuredServiceItem.displayName}
                              </p>
                            )}
                            {item && item.freeFormServiceItem && (
                              <p className="info-label description">
                                {item.freeFormServiceItem.label.description}
                              </p>
                            )}

                            {item && item.structuredServiceItem && (
                              <p className="info-label description">
                                {item.structuredServiceItem.description}
                              </p>
                            )}
                          </div>

                          {item && 'price' in item && (
                            <div className="price-portion">
                              {item && 'units' in item.price && (
                                <p className="price">
                                  {YEN}
                                  {item.price.units}
                                </p>
                              )}
                              {item && !('units' in item.price) && (
                                <p className="price">
                                  {t('basic_info:SERVICES.FREE')}
                                </p>
                              )}
                            </div>
                          )}
                          {item && !('price' in item) && (
                            <div className="price-portion">
                              <p className="price">
                                {t('basic_info:SERVICES.NO_PRICE')}
                              </p>
                            </div>
                          )}
                          <div
                            className={`icon-portion ${
                              i % 2 === 1 ? ' background-white' : ''
                            }`}
                          >
                            <CButton
                              shape="pill"
                              onClick={() => {
                                onRowClick(item);
                              }}
                            >
                              <EditIcon height={20} width={20} />
                            </CButton>
                          </div>
                          <div className="empty-wrapper" />
                        </CFormGroup>
                      );
                    }
                    return <></>;
                  })}
                <CFormGroup
                  className={
                    serviceItems.length % 2 === 0
                      ? 'background-odd'
                      : 'background-white'
                  }
                  row
                >
                  <div className="add-item-wrapper">
                    <AddIcon
                      height={15}
                      width={15}
                      className="add-menu-icon"
                      onClick={toggleCreateServiceModal}
                    />
                  </div>
                  <div className="info-border-add" />
                  <div className="background-white-empty-add" />
                </CFormGroup>
              </div>
            </CForm>
          </div>
        </CRow>
        <ServiceAddEditModal
          closeModal={toggleCreateServiceModal}
          modal={createServiceModal}
          edit={false}
          setServiceItems={setServiceItems}
          setLocationId={selectedLocation}
          setLoactionService={setLoactionService}
          setServiceOption={setCurrentFalseService}
          serviceOption={currentFalseService}
          setResponseEn={setResponseEn}
          setResponseJp={setResponseJp}
        />
        <ServiceAddEditModal
          closeModal={toggleEditServiceModal}
          modal={editServiceItemModal}
          edit
          currentRow={currentItemRowData}
          setServiceItems={setServiceItems}
          openDeleteModal={toggleDeleteModal}
          setLocationId={selectedLocation}
          setServiceOption={setCurrentFalseService}
          serviceOption={currentFalseService}
          setResponseEn={setResponseEn}
          setResponseJp={setResponseJp}
        />
        <CommonDeleteModal
          closeModal={toggleDeleteModal}
          modal={deleteModal}
          setData={setServiceItems}
          serviceDelete
          list={serviceItems}
          currentRow={currentItemRowData}
          deleteId={selectedLocation}
          setLoactionService={setLoactionService}
          setServiceOption={setCurrentFalseService}
          setResponseEn={setResponseEn}
          setResponseJp={setResponseJp}
        />
      </div>
    </div>
  );
};

export default Services;
