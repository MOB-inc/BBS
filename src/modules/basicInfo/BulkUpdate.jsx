/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useState, useEffect, useMemo, useContext } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { components } from 'react-select';
import moment from 'moment';
import {
  CCard,
  CCardBody,
  CRow,
  CFormGroup,
  CCol,
  CTooltip,
  // CInputCheckbox,
  // CLabel,
} from '@coreui/react';
import {
  bulkUpdateCheckList,
  timeSelect,
  specialHourOptions,
  businessDay,
  modifiedTimeSelect,
  timeSelectToModified,
} from '../../commons/constants/lists';
import BulkConfirmation from './modals/BulkEditConfirmationModal';
import ErrorModal from './modals/ErrorBulkModal';
import {
  ALL_ATTRIBUTES,
  BULK_UPDATE,
  LOCATION_BOOKS,
} from '../../commons/constants/url';
import Explanation from '../../commons/components/Explanation';
import Navigation from './Navigation/Navigation';
import Loading from '../../commons/components/Loading';
import { ReactComponent as CalendarIcon } from '../../commons/icons/calendar.svg';
import { ReactComponent as AddIcon } from '../../commons/icons/add.svg';
import { ReactComponent as ArrowDown } from '../../commons/icons/arrow-down.svg';
import { ReactComponent as DeleteIcon } from '../../commons/icons/delete_x.svg';
import { ReactComponent as ReturnIcon } from '../../commons/icons/return.svg';
import { AppContext } from '../../commons/helpers/appContext';
import './bulk_update.scss';
import { ValueTypes } from './BasicInfo';

const CustomInput = React.forwardRef((props, ref) => {
  const { t } = useTranslation(['basic_info']);
  return (
    <>
      <p className="date-choose">
        {t('basic_info:BASIC_INFO.BUSINESS_REOPENING')} {props.value}
      </p>
      <CalendarIcon
        className="calendar-icon"
        width={20}
        height={20}
        ref={ref}
        onClick={props.onClick}
      />
    </>
  );
});

const CustomSpecial = React.forwardRef((props, ref) => {
  return (
    <>
      <p className="date-choose">{props.value}</p>
      <CalendarIcon
        className="calendar-icon"
        width={20}
        height={20}
        ref={ref}
        onClick={props.onClick}
      />
    </>
  );
});

// All are mock data now, will use locale and constant while api integration
function BulkUpdate() {
  const {
    t,
    i18n: { language: selectedLanguage },
  } = useTranslation(['basic_info']);
  const { setHasFoodMenus, setHasServiceItems, menuMode } =
    useContext(AppContext);
  const [locationList, setlocationList] = useState([]);
  const [idArray, setIdArray] = useState([]);
  const { get: getLocationList, response } = useFetch(LOCATION_BOOKS);
  const { get: getAllAttributes } = useFetch(ALL_ATTRIBUTES);
  const [errorModal, setErrorModal] = useState(false);
  const [locationIdList, setLocationIdList] = useState(new Set());
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isRenderedScreen, setIsRenderScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseEn, setResponseEn] = useState([]);
  const [responseJp, setResponseJp] = useState([]);
  const [dynamicItems, setDynamicItems] = useState({});
  const [editItems, setEditItems] = useState({});
  const initRowListState = {
    phoneNumber: false,
    locationDescription: false,
    businessHour: false,
    specialBusinessHour: false,
    tempBusinessHour: false,
    url: false,
    menuLink: false,
    reservationLink: false,
    preOrderLink: false,
    serviceAttributes: false,
    yearEstablishment: false,
    paymentOptions: false,
    serviceOptions: false,
    barrierFree: false,
    plan: false,
    healthSafety: false,
    feature: false,
  };
  const [rowListState, setRowListState] = useState(initRowListState);
  // businessHour
  const [businessHour, setBusinessHour] = useState([
    {
      day: 'SUNDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'MONDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'TUESDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'WEDNESDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'THURSDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'FRIDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
    {
      day: 'SATURDAY',
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    },
  ]);

  // specialBusinessHour
  const [specialBusinessHour, setSpecialBusinessHour] = useState([]);
  const [tableData, setTableData] = useState({});

  const toggleErrorModal = () => {
    setErrorModal(!errorModal);
  };
  // const toggleConfirmationModal = () => {
  //   setConfirmationModal(!confirmationModal);
  // };
  const handleInfoInputChange = (event, id) => {
    let tempIdArray = [...idArray];
    if (event.currentTarget.checked) {
      tempIdArray.push(id);
    } else {
      tempIdArray = idArray.filter((elem) => {
        return elem !== parseInt(id, 10);
      });
    }
    setIdArray(tempIdArray);
  };
  const handleLocationCheck = (id) => {
    if (!locationIdList.has(id)) {
      locationIdList.add(id);
    } else {
      locationIdList.delete(id);
    }
    setLocationIdList(new Set(locationIdList));
  };
  const toggleBulkIds = (event) => {
    event.stopPropagation();
    if (locationIdList.size === locationList?.length) {
      setLocationIdList(new Set());
    } else {
      const ids = locationList?.map(
        (location) => location?.basic_information?.id,
      );
      setLocationIdList(new Set(ids));
    }
  };

  const resetEditing = () => {
    setConfirmationModal(false);
    setRowListState(initRowListState);
    setIsRenderScreen(false);
    setIdArray([]);
    setEditItems({});
    setTableData({});
    setConfirmationModal(false);
  };

  const handleEditItems = (data) => {
    setEditItems((prevState) => {
      return {
        ...prevState,
        ...data.reduce((acc, val) => {
          acc[val.parent] = undefined;
          return acc;
        }, {}),
      };
    });
  };

  const handleTransition = () => {
    if (idArray.length === 0 || Array.from(locationIdList).length === 0) {
      toggleErrorModal();
    } else {
      const newRowState = { ...rowListState };
      idArray.forEach((id) => {
        bulkUpdateCheckList(dynamicItems).forEach((item) => {
          if (item.id === id) {
            if (item.id > 7) {
              handleEditItems(dynamicItems[item.name]);
            }
            if (newRowState[item.value]) {
              newRowState[item.value] = true;
            }
            newRowState[`${item.value}`] = true;
          }
        });
      });
      setRowListState(newRowState);
      setIsRenderScreen(true);
    }
  };
  const handleConfirmationModal = () => {
    setConfirmationModal(true);
  };
  const { post: bulkUpdate, response: bulkResponse } = useFetch(BULK_UPDATE);
  const handleEdit = async () => {
    // adding business hour payload
    try {
      setLoading(true);
      const businessObj = {
        ...tableData,
        basic_info_id: Array.from(locationIdList),
        attributes: {
          ...editItems,
        },
      };
      if (rowListState.businessHour) {
        const statusArray = businessHour.map((item) => {
          return item.status;
        });
        const days = {};
        businessHour.forEach((item) => {
          days[item.day] = {
            from:
              item.status === 0
                ? []
                : item.periods.map((period) => period.open_at),
            to:
              item.status === 0
                ? []
                : item.periods.map((period) => period.close_at),
          };
        });
        Object.assign(businessObj, {
          sunday_from: days?.SUNDAY?.from,
          sunday_to: days?.SUNDAY?.to,
          monday_from: days?.MONDAY?.from,
          monday_to: days?.MONDAY?.to,
          tueday_from: days?.TUESDAY?.from,
          tueday_to: days?.TUESDAY?.to,
          wedday_from: days?.WEDNESDAY?.from,
          wedday_to: days?.WEDNESDAY?.to,
          thuday_from: days?.THURSDAY?.from,
          thuday_to: days.THURSDAY?.to,
          friday_from: days?.FRIDAY?.from,
          friday_to: days?.FRIDAY?.to,
          saturday_from: days?.SATURDAY?.from,
          saturday_to: days?.SATURDAY?.to,
          day: businessDay,
          day_status: statusArray,
          basic_info_id: Array.from(locationIdList),
        });
      }

      // adding special business hour payload
      if (rowListState.specialBusinessHour) {
        const dateArray = specialBusinessHour.map((item) => {
          return moment(item.special_day).format('yyyy-MM-DD');
        });
        const statusArray = specialBusinessHour.map((item) => {
          return item.status;
        });
        Object.assign(businessObj, {
          special_day: dateArray,
          special_day_status: statusArray,
          basic_info_id: Array.from(locationIdList),
        });
        specialBusinessHour.forEach((item, index) => {
          businessObj[`special_day_${index + 1}_from`] =
            item.status === 4
              ? []
              : item.status === 3
              ? ['00:00']
              : item.periods.map((period) => period.open_at);
          businessObj[`special_day_${index + 1}_to`] =
            item.status === 4
              ? []
              : item.status === 3
              ? ['00:00']
              : item.periods.map((period) => period.close_at);
        });
      }
      await bulkUpdate(businessObj);
      if (bulkResponse.ok) {
        setConfirmationModal(false);
        setRowListState(initRowListState);
        setIsRenderScreen(false);
        setIdArray([]);
        setLocationIdList(new Set());
        setEditItems({});
      }
    } finally {
      setLoading(false);
    }
  };

  // url
  // phoneNumber, locationDesc
  const defaultInputChange = (evt, key) => {
    setTableData((prevState) => ({
      ...prevState,
      [key]: evt.target.value,
      basic_info_id: Array.from(locationIdList),
    }));
  };

  // yearEstablishment
  const setCustomDate = (event, key) => {
    const customDate = moment(event).format('yyyy-MM-DD');
    setTableData((prevState) => ({
      ...prevState,
      [key]: customDate,
      basic_info_id: Array.from(locationIdList),
    }));
  };

  // tempClose
  const toggleState = (event, key) => {
    if (event.target.checked) {
      setTableData((prevState) => ({
        ...prevState,
        [key]: 1,
        basic_info_id: Array.from(locationIdList),
      }));
    } else {
      setTableData((prevState) => ({
        ...prevState,
        [key]: 0,
        basic_info_id: Array.from(locationIdList),
      }));
    }
  };

  // businessHour start
  const handleAddRow = (day) => {
    const newBusinessHour = [...businessHour];

    newBusinessHour.forEach((item) => {
      if (item.day === day) {
        const timeVal = {
          open_at: '',
          close_at: '',
        };
        item.periods.push(timeVal);
      }
    });
    setBusinessHour(newBusinessHour);
  };
  const handleTimeFrom = (event, day, index) => {
    const newBusinessHour = [...businessHour];
    if (event.value === 'HOLIDAY') {
      newBusinessHour.forEach((item) => {
        if (item.day === day) {
          item.periods[index].open_at = 'HOLIDAY';
          item.status = 0;
        }
      });
    } else if (event.value === 'DELETE') {
      newBusinessHour.forEach((item) => {
        if (item.day === day) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newBusinessHour.forEach((item) => {
        if (item.day === day) {
          item.status = 1;
          item.periods[index].open_at = event.value;
        }
      });
    }
    setBusinessHour(newBusinessHour);
  };
  const handleTimeTo = (event, day, index) => {
    const newBusinessHour = [...businessHour];

    if (event.value === 'DELETE') {
      newBusinessHour.forEach((item) => {
        if (item.day === day) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newBusinessHour.forEach((item) => {
        if (item.day === day) {
          item.periods[index].close_at = event.value;
        }
      });
    }
    setBusinessHour(newBusinessHour);
  };
  // 次の曜日にコピーがクリックされた際に実行される関数
  const handleNextCopy = (day) => {
    const newBusinessHour = [...businessHour];
    let clickIndex = 0;
    newBusinessHour.forEach((item, index) => {
      if (item.day === day) {
        clickIndex = index;
      }
    });
    // 次のインデックスの要素へオブジェクトコピー
    newBusinessHour[clickIndex + 1].status = newBusinessHour[clickIndex].status;
    newBusinessHour[clickIndex + 1].periods = newBusinessHour[
      clickIndex
    ].periods.map((obj) => ({ ...obj }));
    setBusinessHour(newBusinessHour);
  };
  // business hour end

  // specialBusinessHour start
  const handleSpecialRow = (index) => {
    const newSpecialBusinessHour = [...specialBusinessHour];

    newSpecialBusinessHour.forEach((item, idx) => {
      if (idx === index) {
        const timeVal = {
          open_at: '',
          close_at: '',
        };
        item.periods.push(timeVal);
      }
    });
    setSpecialBusinessHour(newSpecialBusinessHour);
  };
  const handleAddSpecialBusinessHourRow = () => {
    const newSpecialBusinessHour = [...specialBusinessHour];

    newSpecialBusinessHour.push({
      special_day: new Date(),
      status: 1,
      periods: [
        {
          open_at: '',
          close_at: '',
        },
      ],
    });
    setSpecialBusinessHour(newSpecialBusinessHour);
  };
  const handleDeleteSpecialBusinessHourRow = (index) => {
    const newSpecialBusinessHour = [...specialBusinessHour];
    newSpecialBusinessHour.splice(index, 1);
    setSpecialBusinessHour(newSpecialBusinessHour);
  };
  const handleStatusDropDown = (event, index) => {
    const newSuperBusinessHours = [...specialBusinessHour];
    newSuperBusinessHours.map((item, idx) => {
      if (idx === parseInt(index, 10)) {
        item.status = parseInt(event.value, 10);
      }
    });
    setSpecialBusinessHour(newSuperBusinessHours);
  };
  const handleSpecialTimeFrom = (event, dayIndex, index) => {
    const newSpecialBusinessHour = [...specialBusinessHour];

    if (event.value === 'DELETE') {
      newSpecialBusinessHour.forEach((item, idx) => {
        if (idx === dayIndex) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newSpecialBusinessHour.forEach((item, idx) => {
        if (idx === dayIndex) {
          item.periods[index].open_at = event.value;
        }
      });
    }
    setSpecialBusinessHour(newSpecialBusinessHour);
  };
  const handleSpecialTimeTo = (event, dayIndex, index) => {
    const newSpecialBusinessHour = [...specialBusinessHour];

    if (event.value === 'DELETE') {
      newSpecialBusinessHour.forEach((item, idx) => {
        if (idx === dayIndex) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newSpecialBusinessHour.forEach((item, idx) => {
        if (idx === dayIndex) {
          item.periods[index].close_at = event.value;
        }
      });
    }
    setSpecialBusinessHour(newSpecialBusinessHour);
  };
  const setSpecialDate = (event, index) => {
    const newSuperBusinessHours = [...specialBusinessHour];
    newSuperBusinessHours.map((item, idx) => {
      if (idx === parseInt(index, 10)) {
        item.special_day = event;
      }
    });
    setSpecialBusinessHour(newSuperBusinessHours);
  };
  // special BusinessHour Start
  const loadLocationList = async () => {
    const resultResponse = await getLocationList();
    const data = resultResponse?.result?.data;
    if (response.ok) {
      const servicesFlag = data?.some((item) => item.has_service_items);
      setHasServiceItems(servicesFlag);
      const menuFlag = data?.some((item) => item.has_food_menus);
      setHasFoodMenus(menuFlag);
      const remainingList = data.filter((location) => {
        return location.basic_information !== null;
      });
      setlocationList(remainingList);
    }
  };

  const groupItems = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const { groupDisplayName } = item;
      if (!grouped[groupDisplayName]) {
        grouped[groupDisplayName] = [];
      }
      grouped[groupDisplayName].push(item);
    });
    return grouped;
  };

  const loadAttributes = async () => {
    const attrResponse = await getAllAttributes();
    const {
      result: { response_en: resEn, response_jp: resJp },
    } = attrResponse;
    if (resEn && resJp) {
      setResponseEn(resEn?.attributeMetadata);
      setResponseJp(resJp?.attributeMetadata);
    }
  };

  const loadDynamicAttributes = (unGroupedItems) => {
    setDynamicItems(groupItems(unGroupedItems));
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  const customStyles = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        width: 80,
      }),
    }),
    [],
  );

  const handleEditItemChange = (target, value) => {
    setEditItems((prevState) => {
      return {
        ...prevState,
        [target]: value,
      };
    });
  };

  useEffect(() => {
    loadDynamicAttributes(selectedLanguage === 'en' ? responseEn : responseJp);
  }, [selectedLanguage, responseEn, responseJp]);

  useEffect(() => {
    loadLocationList();
    loadAttributes();
  }, []);
  return (
    <>
      <Loading loading={loading} />
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="BULK_UPDATE" isConnectDisp />
          <Navigation />
        </>
      )}
      <div className="bulk-update">
        <button
          type="button"
          className={`cancel-button  ${
            menuMode === 'sidebar' ? 'cancel-button--sidebar' : ''
          } ${!isRenderedScreen ? 'cancel-button--hidden' : ''}
          `}
          onClick={resetEditing}
        >
          {t('basic_info:BASIC_INFO.RETURN')}
        </button>
        <button
          type="button"
          className={`transition-button ${
            menuMode === 'sidebar' ? 'transition-button--sidebar' : ''
          }`}
          disabled={isRenderedScreen && Array.from(locationIdList).length === 0}
          onClick={
            isRenderedScreen
              ? () => handleConfirmationModal()
              : () => handleTransition()
          }
        >
          {isRenderedScreen
            ? t('basic_info:BULK_EDIT.REGISTRATION_BUTTON')
            : t('basic_info:BULK_EDIT.BULK_EDIT_BUTTON')}
        </button>
        <CRow>
          <div className="location-wrapper">
            <CCard className="location-card-body">
              <CCardBody className="location-list-card">
                <div className="list-location location-title">
                  <div className="location-name">
                    {t('basic_info:MENU.LOCATION')}
                  </div>
                  <input
                    className="location-check"
                    type="checkbox"
                    checked={locationIdList.size === locationList?.length}
                    onChange={toggleBulkIds}
                  />
                </div>
                {locationList &&
                  locationList.map((item, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className={
                            index % 2 === 0
                              ? ' background-odd list-location'
                              : ' list-location'
                          }
                          role="presentation"
                        >
                          <div className="location-name">{item.name}</div>
                          <input
                            className="location-check"
                            type="checkbox"
                            checked={locationIdList.has(
                              item?.basic_information?.id,
                            )}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() =>
                              handleLocationCheck(item?.basic_information?.id)
                            }
                          />
                        </div>
                      </>
                    );
                  })}
              </CCardBody>
            </CCard>
          </div>
          {isRenderedScreen ? (
            <>
              <div className="full-update-card">
                <div className="bulk-title">
                  <p className="update-title">
                    {t('basic_info:BASIC_INFO.BASIC_INFO_HEADER')}
                  </p>
                </div>

                <div className="bulk-update-card-rows">
                  {rowListState.phoneNumber ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.PHONE_NUMBER')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(event, 'phone_number')
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.locationDescription ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.LOCATION_DESCRIPTION_JP')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(
                                event,
                                'location_description_jp',
                              )
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.businessHour ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.BUSINESS_HOUR')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.SUNDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.MONDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.TUESDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.WEDNESDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.THURSDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.FRIDAY')}
                              </p>
                            </CRow>
                            <CRow>
                              <p className="info-label show-date">
                                {t('basic_info:BASIC_INFO.SATURDAY')}
                              </p>
                            </CRow>
                          </>
                        </CCol>
                        <CCol md="6" className="third-column">
                          {businessHour &&
                            businessHour.map((day) => {
                              return (
                                <CRow>
                                  {day.periods &&
                                    day.periods.map((item, index) => {
                                      return (
                                        <div className="time-wrapper">
                                          <div className="time-from">
                                            {index === 0 ? (
                                              <Select
                                                closeMenuOnSelect
                                                options={modifiedTimeSelect}
                                                styles={customStyles}
                                                value={
                                                  modifiedTimeSelect[
                                                    modifiedTimeSelect.findIndex(
                                                      (el) =>
                                                        el.value ===
                                                        item.open_at,
                                                    )
                                                  ] || false
                                                }
                                                components={{
                                                  DropdownIndicator,
                                                }}
                                                onChange={(event) =>
                                                  handleTimeFrom(
                                                    event,
                                                    day.day,
                                                    index,
                                                  )
                                                }
                                              />
                                            ) : (
                                              <>
                                                {day.status === 0 ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <Select
                                                      closeMenuOnSelect
                                                      options={timeSelect}
                                                      styles={customStyles}
                                                      value={
                                                        timeSelect[
                                                          timeSelect.findIndex(
                                                            (el) =>
                                                              el.value ===
                                                              item.open_at,
                                                          )
                                                        ] || false
                                                      }
                                                      components={{
                                                        DropdownIndicator,
                                                      }}
                                                      onChange={(event) =>
                                                        handleTimeFrom(
                                                          event,
                                                          day.day,
                                                          index,
                                                        )
                                                      }
                                                    />
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </div>
                                          {day.status === 0 ? (
                                            <></>
                                          ) : (
                                            <>
                                              <div className="padding-dash">
                                                −
                                              </div>
                                              <div className="time-to">
                                                {index === 0 ? (
                                                  <Select
                                                    closeMenuOnSelect
                                                    options={
                                                      timeSelectToModified
                                                    }
                                                    styles={customStyles}
                                                    value={
                                                      timeSelectToModified[
                                                        timeSelectToModified.findIndex(
                                                          (el) =>
                                                            el.value ===
                                                            item.close_at,
                                                        )
                                                      ] || false
                                                    }
                                                    components={{
                                                      DropdownIndicator,
                                                    }}
                                                    onChange={(event) =>
                                                      handleTimeTo(
                                                        event,
                                                        day.day,
                                                        index,
                                                      )
                                                    }
                                                  />
                                                ) : (
                                                  <Select
                                                    closeMenuOnSelect
                                                    options={timeSelect}
                                                    styles={customStyles}
                                                    value={
                                                      timeSelect[
                                                        timeSelect.findIndex(
                                                          (el) =>
                                                            el.value ===
                                                            item.close_at,
                                                        )
                                                      ] || false
                                                    }
                                                    components={{
                                                      DropdownIndicator,
                                                    }}
                                                    onChange={(event) =>
                                                      handleTimeTo(
                                                        event,
                                                        day.day,
                                                        index,
                                                      )
                                                    }
                                                  />
                                                )}
                                              </div>
                                              {index ===
                                                day.periods.length - 1 &&
                                              day.periods.length < 3 ? (
                                                <div className="add-split">
                                                  <AddIcon
                                                    width={12}
                                                    height={12}
                                                    onClick={() =>
                                                      handleAddRow(
                                                        day.day,
                                                        'business',
                                                      )
                                                    }
                                                  />
                                                </div>
                                              ) : (
                                                <></>
                                              )}
                                            </>
                                          )}
                                          {index === day.periods.length - 1 &&
                                            day.day !== 'SATURDAY' && (
                                              <div className="next-copy">
                                                <CTooltip
                                                  content={t(
                                                    'basic_info:BASIC_INFO.COPY_NEXT_DAY',
                                                  )}
                                                >
                                                  <ReturnIcon
                                                    onClick={() =>
                                                      handleNextCopy(day.day)
                                                    }
                                                  />
                                                </CTooltip>
                                              </div>
                                            )}
                                        </div>
                                      );
                                    })}
                                </CRow>
                              );
                            })}
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.specialBusinessHour ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.SPECIAL_BUSINESS_HOUR')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          {specialBusinessHour &&
                            specialBusinessHour.map((day, index) => {
                              return (
                                <CRow className="row-height">
                                  <div className="datepicker-wrapper datepicker-special">
                                    <DatePicker
                                      selected={new Date(day.special_day)}
                                      dateFormat="yyyy-MM-dd"
                                      onChange={(date) =>
                                        setSpecialDate(date, index)
                                      }
                                      customInput={<CustomSpecial />}
                                    />
                                  </div>
                                  <div className="select-special">
                                    <Select
                                      closeMenuOnSelect
                                      components={{ DropdownIndicator }}
                                      options={specialHourOptions}
                                      onChange={(event) =>
                                        handleStatusDropDown(event, index)
                                      }
                                      value={
                                        specialHourOptions[
                                          specialHourOptions.findIndex(
                                            (el) =>
                                              el.value === String(day.status),
                                          )
                                        ] || false
                                      }
                                    />
                                  </div>
                                  <div className="delete-special">
                                    <DeleteIcon
                                      width={20}
                                      height={20}
                                      className="delete-split"
                                      onClick={() =>
                                        handleDeleteSpecialBusinessHourRow(
                                          index,
                                        )
                                      }
                                    />
                                  </div>
                                </CRow>
                              );
                            })}
                          <div className="add-split-wrapper">
                            <AddIcon
                              width={12}
                              height={12}
                              className="add-split"
                              onClick={() => handleAddSpecialBusinessHourRow()}
                            />
                          </div>
                        </CCol>
                        <CCol md="6" className="third-column">
                          {specialBusinessHour &&
                            specialBusinessHour.map((day, idx) => {
                              if (day.status === 4) {
                                return (
                                  <CRow>
                                    <div className="closed-wrapper">
                                      {t('basic_info:BASIC_INFO.CLOSED')}
                                    </div>
                                  </CRow>
                                );
                              }
                              if (day.status === 3) {
                                return (
                                  <CRow>
                                    <div className="closed-wrapper">
                                      {t(
                                        'basic_info:BASIC_INFO.TWENTY_FOUR_HOURS',
                                      )}
                                    </div>
                                  </CRow>
                                );
                              }
                              return (
                                <CRow>
                                  {day.periods &&
                                    day.periods.map((item, index) => {
                                      return (
                                        <div className="time-wrapper">
                                          <div className="time-from">
                                            {index === 0 ? (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelectToModified}
                                                styles={customStyles}
                                                value={
                                                  timeSelectToModified[
                                                    timeSelectToModified.findIndex(
                                                      (el) =>
                                                        el.value ===
                                                        item.open_at,
                                                    )
                                                  ] || false
                                                }
                                                components={{
                                                  DropdownIndicator,
                                                }}
                                                onChange={(event) =>
                                                  handleSpecialTimeFrom(
                                                    event,
                                                    idx,
                                                    index,
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelect}
                                                styles={customStyles}
                                                value={
                                                  timeSelect[
                                                    timeSelect.findIndex(
                                                      (el) =>
                                                        el.value ===
                                                        item.open_at,
                                                    )
                                                  ] || false
                                                }
                                                components={{
                                                  DropdownIndicator,
                                                }}
                                                onChange={(event) =>
                                                  handleSpecialTimeFrom(
                                                    event,
                                                    idx,
                                                    index,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          <div className="padding-dash">−</div>
                                          <div className="time-to">
                                            {index === 0 ? (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelectToModified}
                                                styles={customStyles}
                                                value={
                                                  timeSelectToModified[
                                                    timeSelectToModified.findIndex(
                                                      (el) =>
                                                        el.value ===
                                                        item.close_at,
                                                    )
                                                  ] || false
                                                }
                                                components={{
                                                  DropdownIndicator,
                                                }}
                                                onChange={(event) =>
                                                  handleSpecialTimeTo(
                                                    event,
                                                    idx,
                                                    index,
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelect}
                                                styles={customStyles}
                                                value={
                                                  timeSelect[
                                                    timeSelect.findIndex(
                                                      (el) =>
                                                        el.value ===
                                                        item.close_at,
                                                    )
                                                  ] || false
                                                }
                                                components={{
                                                  DropdownIndicator,
                                                }}
                                                onChange={(event) =>
                                                  handleSpecialTimeTo(
                                                    event,
                                                    idx,
                                                    index,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          {index === day.periods.length - 1 &&
                                          day.periods.length < 3 ? (
                                            <div className="add-split">
                                              <AddIcon
                                                width={12}
                                                height={12}
                                                onClick={() =>
                                                  handleSpecialRow(idx)
                                                }
                                              />
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      );
                                    })}
                                </CRow>
                              );
                            })}
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.tempBusinessHour ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.BUSINESS_HOURS_TEMP')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol xs="3" md="6" className="third-column">
                          <div className="selecting-checkbox">
                            <div className="date-checkbox">
                              <input
                                className="reopening-checkbox"
                                type="checkbox"
                                onChange={(evt) =>
                                  toggleState(evt, 'is_temporary_closure')
                                }
                              />
                              <div className="reopening-text">
                                {t('basic_info:BASIC_INFO.TEMPORARY_CLOSED')}
                              </div>
                            </div>
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.url ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.URL')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(event, 'url')
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* {rowListState.menuLink ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.MENU_LINK')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(event, 'menu_link')
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.reservationLink ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.RESERVATION_LINK')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(event, 'reservation_link')
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.preOrderLink ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.PREORDER_LINK')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <input
                            className="info-edit-input-gray"
                            onChange={(event) =>
                              defaultInputChange(event, 'pre_order_link')
                            }
                          />
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.serviceAttributes ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.SERVICE_ATTRIBUTES')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown">
                            {serviceAttributes.map((item, index) => {
                              return (
                                <div className="dropdown-list" key={index}>
                                  <div className="options">{item.name}</div>
                                  <div className="select-wrapper">
                                    <Select
                                      closeMenuOnSelect
                                      options={options}
                                      components={{ DropdownIndicator }}
                                      onChange={(event) =>
                                        handleCommonDropdown(
                                          event,
                                          item.en_name,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )} */}
                  {rowListState.yearEstablishment ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.YEAR')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="datepicker-wrapper datepicker-special">
                            <DatePicker
                              dateFormat="yyyy-MM-dd"
                              selected={
                                tableData && tableData.year_of_establishment
                                  ? new Date(tableData.year_of_establishment)
                                  : null
                              }
                              onChange={(date) =>
                                setCustomDate(date, 'year_of_establishment')
                              }
                              customInput={<CustomSpecial />}
                            />
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {/*
                  {rowListState.paymentOptions ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.PAYMENT_OPTIONS')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown">
                            {paymentOptions.map((item, index) => {
                              return (
                                <div className="dropdown-list" key={index}>
                                  <div className="options">{item.name}</div>
                                  <div className="select-wrapper">
                                    <Select
                                      closeMenuOnSelect
                                      options={options}
                                      components={{ DropdownIndicator }}
                                      onChange={(event) =>
                                        handleCommonDropdown(
                                          event,
                                          item.en_name,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.serviceOptions ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.SERVICE_OPTIONS')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown">
                            {serviceOptions.map((item, index) => {
                              return (
                                <div className="dropdown-list" key={index}>
                                  <div className="options">{item.name}</div>
                                  <div className="select-wrapper">
                                    <Select
                                      closeMenuOnSelect
                                      options={options}
                                      components={{ DropdownIndicator }}
                                      onChange={(event) =>
                                        handleCommonDropdown(
                                          event,
                                          item.en_name,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.barrierFree ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.BARRIER_FREE')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown">
                            {barrierFree.map((item, index) => {
                              return (
                                <div className="dropdown-list" key={index}>
                                  <div className="options">{item.name}</div>
                                  <div className="select-wrapper">
                                    <Select
                                      closeMenuOnSelect
                                      options={options}
                                      components={{ DropdownIndicator }}
                                      onChange={(event) =>
                                        handleCommonDropdown(
                                          event,
                                          item.en_name,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.plan ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.PLAN')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown custom-dropdown-height">
                            <div className="dropdown-list">
                              <div className="options">{PLAN} </div>
                              <div className="select-wrapper">
                                <Select
                                  closeMenuOnSelect
                                  options={options}
                                  components={{ DropdownIndicator }}
                                  onChange={(event) =>
                                    handleCommonDropdown(event, 'plan')
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.healthSafety ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.HEALTH_SAFETY')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown">
                            {healthSafety.map((item, index) => {
                              return (
                                <div className="dropdown-list" key={index}>
                                  <div className="options">{item.name}</div>
                                  <div className="select-wrapper">
                                    <Select
                                      closeMenuOnSelect
                                      options={options}
                                      components={{ DropdownIndicator }}
                                      onChange={(event) =>
                                        handleCommonDropdown(
                                          event,
                                          item.en_name,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowListState.feature ? (
                    <>
                      <CFormGroup row className="background-odd-css">
                        <CCol md="2" className="info-border-right">
                          <p className="info-label label-first-padding">
                            {t('basic_info:BASIC_INFO.FEATURES')}
                          </p>
                        </CCol>
                        <CCol md="3" className="info-border-right">
                          <p className="info-label" />
                        </CCol>
                        <CCol md="6" className="third-column">
                          <div className="custom-dropdown custom-dropdown-height">
                            <div className="dropdown-list">
                              <div className="options">{FEATURES}</div>
                              <div className="select-wrapper">
                                <Select
                                  closeMenuOnSelect
                                  options={options}
                                  components={{ DropdownIndicator }}
                                  onChange={(event) =>
                                    handleCommonDropdown(event, 'features')
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    <></>
                  )} */}
                  {idArray.length > 0 &&
                    idArray.map((itemId, index) => {
                      if (itemId > 7) {
                        const singleItem = bulkUpdateCheckList(
                          dynamicItems,
                        ).find((itm) => itm.id === itemId);
                        return (
                          <CFormGroup
                            row
                            className="background-odd-css"
                            key={index}
                          >
                            <CCol md="2" className="info-border-right">
                              <p className="info-label label-first-padding">
                                {singleItem.name}
                              </p>
                            </CCol>
                            <CCol md="3" className="info-border-right">
                              <p className="info-label" />
                            </CCol>
                            <CCol md="6" className="third-column">
                              <div className="custom-dropdown">
                                {dynamicItems[singleItem.name].length &&
                                  dynamicItems[singleItem.name].map(
                                    (item, idx) => {
                                      return (
                                        <div
                                          key={idx}
                                          className={`dropdown-list ${
                                            item.valueType === 'URL'
                                              ? `url-type`
                                              : null
                                          }`}
                                        >
                                          <div className="options">
                                            {item.displayName}
                                          </div>
                                          <>
                                            {item.valueType &&
                                              ValueTypes[item.valueType] &&
                                              ValueTypes[item.valueType](
                                                idx,
                                                item,
                                                handleEditItemChange,
                                                DropdownIndicator,
                                                true,
                                              )}
                                          </>
                                        </div>
                                      );
                                    },
                                  )}
                              </div>
                            </CCol>
                          </CFormGroup>
                        );
                      }
                      return <></>;
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="full-checklist-card">
              <div className="bulk-title">
                <p className="update-title">
                  {t('basic_info:BASIC_INFO.BASIC_INFO_HEADER')}
                </p>
              </div>
              <div className="bulk-checked-list">
                {bulkUpdateCheckList(dynamicItems) &&
                  bulkUpdateCheckList(dynamicItems).map((info, index) => {
                    return (
                      <div
                        className={`list-info ${
                          index % 2 === 0 ? 'background-odd' : ''
                        }`}
                      >
                        <div className="info-name">{info.name}</div>
                        <input
                          type="checkbox"
                          onChange={(event) =>
                            handleInfoInputChange(event, info.id)
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </CRow>
        <ErrorModal closeModal={toggleErrorModal} modal={errorModal} />
        <BulkConfirmation
          locationList={locationList || []}
          idList={Array.from(locationIdList) || []}
          closeModal={resetEditing}
          modal={confirmationModal}
          editFunc={handleEdit}
        />
      </div>
    </>
  );
}
CustomInput.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
CustomSpecial.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default BulkUpdate;
