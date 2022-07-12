/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-spread */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import useFetch from 'use-http';
import {
  // CCard,
  // CCardBody,
  CRow,
  CCol,
  CForm,
  CFormGroup,
  CButton,
  CTooltip,
} from '@coreui/react';
import Dropdown from 'react-multilevel-dropdown';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { components } from 'react-select';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import { useMount } from 'ahooks';
import Explanation from '../../commons/components/Explanation';
import Loading from '../../commons/components/Loading';
import { ReactComponent as EditIcon } from '../../commons/icons/edit.svg';
import { ReactComponent as CalendarIcon } from '../../commons/icons/calendar.svg';
import { ReactComponent as AddIcon } from '../../commons/icons/add.svg';
import { ReactComponent as ArrowDown } from '../../commons/icons/arrow-down.svg';
import { ReactComponent as DeleteIcon } from '../../commons/icons/delete_x.svg';
import { ReactComponent as ReturnIcon } from '../../commons/icons/return.svg';
import {
  LOCATIONS,
  BASIC_INFO_GET,
  BASIC_INFORMATIONS,
  PREFECTURES,
  BUSINESS_CATEGORY,
  LOCATION_BOOKS,
} from '../../commons/constants/url';
import {
  // serviceOptions,
  // barrierFree,
  // healthSafety,
  options,
  // paymentOptions,
  specialHourOptions,
  // wifiOptions,
  // serviceAttributes,
  timeSelect,
  modifiedTimeSelect,
  businessDay,
  timeSelectToModified,
} from '../../commons/constants/lists';
// import {
//   PLAN,
//   FEATURES,
//   FREE_WIFI,
//   PAID_WIFI,
// } from '../../commons/constants/key';
import {
  notNullOrEmpty,
  notEmptyOrLengthInvalid,
  phoneNumberLength,
  phoneNumberValidation,
  isLessOrEqualEightChar,
  isUrlPattern,
  notMediaUrl,
} from '../../commons/helpers/validation';
import Navigation from './Navigation/Navigation';
import './basic_info.scss';
import { AppContext } from '../../commons/helpers/appContext';

const CustomInput = React.forwardRef((props, ref) => {
  const { t } = useTranslation(['basic_info']);
  return (
    <>
      <p className="date-choose">
        {t('basic_info:BASIC_INFO.BUSINESS_REOPENING')} {props.value}
      </p>
      <CalendarIcon width={20} height={20} ref={ref} onClick={props.onClick} />
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

const URLInputComponent = ({ keyId, data, onEdit, bulkUpdate = false }) => {
  const [urls, setUrls] = useState([]);
  const handleAddURL = () => {
    setUrls([...urls, {}]);
  };

  useEffect(() => {
    if (data?.valueMetadata?.length > 0) {
      setUrls(data.valueMetadata);
    }
    if (data?.valueMetadata?.length === 0) {
      setUrls([{ value: '' }]);
    }
  }, [data]);

  useEffect(() => {
    onEdit(data.parent, urls);
  }, [urls]);

  useEffect(() => {
    if (bulkUpdate) {
      setUrls([{ value: '' }]);
    }
  }, [bulkUpdate]);
  return (
    <div key={keyId} className="input-url-button-wrapper">
      {urls.map((url, index) => {
        return (
          <div key={index} className="input-url-wrapper">
            <input
              className={`input-url ${
                data.repeatable ? '' : 'input-url--single'
              }`}
              type="text"
              value={url.value || ''}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].value = e.target.value;
                setUrls(newUrls);
              }}
            />
            {data.repeatable ? (
              <CButton
                className="remove-url-button"
                onClick={() => {
                  const newUrls = [...urls];
                  newUrls.splice(index, 1);
                  setUrls(newUrls);
                }}
              >
                <DeleteIcon width={20} height={20} />
              </CButton>
            ) : null}
          </div>
        );
      })}
      {data.repeatable ? (
        <CButton className="add-new-url" onClick={() => handleAddURL()}>
          <AddIcon width={15} height={15} />
        </CButton>
      ) : null}
    </div>
  );
};

const ENUMInputComponent = ({
  keyId,
  data,
  onValueChange,
  dropdownIndicator,
}) => {
  const makeDropdownOptions = (dd_options) => {
    return [
      { value: null, label: '未選択' },
      ...dd_options.map((option) => {
        return {
          value: option.value,
          label: option.displayName,
        };
      }),
    ];
  };

  const getCurrentOption = () => {
    const [crnt] = data.valueMetadata.filter((option) => option.current);
    if (crnt) {
      return { value: crnt.value, label: crnt.displayName };
    }
    return { value: null, label: '未選択' };
  };

  return (
    <div key={keyId} className="select-wrapper">
      <Select
        closeMenuOnSelect
        components={{ dropdownIndicator }}
        options={makeDropdownOptions(data.valueMetadata)}
        defaultValue={getCurrentOption()}
        onChange={(e) => onValueChange(data.parent, e.value)}
      />
    </div>
  );
};

const REPEATEDENUMInputComponent = ({
  data,
  onValueChange,
  dropdownIndicator,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const addOrRemoveItems = (target, value) => {
    setSelectedItems((ps) =>
      ps.map((s) => {
        if (Object.keys(s)[0] === target) {
          return { [target]: value };
        }
        return s;
      }),
    );
  };

  const getCurrentOption = (slItem, vlMeta) => {
    const findedItem = slItem.find(
      (item) =>
        item[vlMeta] === true ||
        item[vlMeta] === false ||
        item[vlMeta] === null,
    );
    if (findedItem && findedItem[vlMeta]) {
      return options[1];
    }
    if (findedItem && findedItem[vlMeta] === false) {
      return options[2];
    }
    return options[0];
  };

  useEffect(() => {
    onValueChange(data.parent, selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    setSelectedItems(
      data?.valueMetadata?.map((item) => {
        return { [item.value]: item?.current };
      }),
    );
  }, []);

  return (
    <div className="select-wrapper">
      <Dropdown title="選択" menuClassName="repeated-enum-menu">
        {data.valueMetadata.map((option, index) => {
          return (
            <Dropdown.Item key={index} className="a-multi-lable-dd">
              <div>{option.displayName}</div>
              <Select
                closeMenuOnSelect
                options={options}
                components={{ dropdownIndicator }}
                className="option-w"
                defaultValue={getCurrentOption(selectedItems, option.value)}
                onChange={(e) => addOrRemoveItems(option.value, e.value)}
              />
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

const BoolInputComponent = ({
  keyId,
  data,
  onValueChange,
  dropdownIndicator,
}) => {
  const getCurrentOpt = () => {
    const [crnt] = data.valueMetadata?.filter(
      (itm) => itm.current || itm.current === false,
    );
    if (crnt && crnt.current && crnt.value) {
      return options[1];
    }
    if (crnt && crnt.current && crnt.value === false) {
      return options[2];
    }
    if (crnt && crnt.current === false && crnt.value) {
      return options[2];
    }
    // if (crnt && !crnt.value) {
    //   return options[2];
    // }
    return options[0];
  };

  return (
    <div key={keyId} className="select-wrapper">
      <Select
        closeMenuOnSelect
        components={{ dropdownIndicator }}
        options={options}
        defaultValue={getCurrentOpt()}
        onChange={(e) => onValueChange(data.parent, e.value)}
      />
    </div>
  );
};

export const ValueTypes = {
  URL: (keyId, data, onValueChange, ddIndicator, bulkUpdate) => (
    <URLInputComponent
      keyId={keyId}
      onEdit={onValueChange}
      data={data}
      bulkUpdate={bulkUpdate}
    />
  ),
  BOOL: (keyId, data, onValueChange, DropdownIndicator) => (
    <BoolInputComponent
      keyId={keyId}
      onValueChange={onValueChange}
      data={data}
      dropdownIndicator={DropdownIndicator}
    />
  ),
  ENUM: (keyId, data, onValueChange, DropdownIndicator) => (
    <ENUMInputComponent
      keyId={keyId}
      data={data}
      dropdownIndicator={DropdownIndicator}
      onValueChange={onValueChange}
    />
  ),
  REPEATED_ENUM: (keyId, data, onValueChange, DropdownIndicator) => (
    <REPEATEDENUMInputComponent
      keyId={keyId}
      data={data}
      onValueChange={onValueChange}
      dropdownIndicator={DropdownIndicator}
    />
  ),
};
function BasicInfo() {
  const [locationList, setlocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [currentActive, setCurrentActive] = useState('');
  const [prefectures, setPrefectures] = useState([]);
  const [responsePrefecture, setResponsePrefecture] = useState('');
  const [formattedPrefecture, setFormattedPrefecture] = useState([]);
  const [addressFlag, setAddressFlag] = useState(false);
  const [idBasicInfo, setIdBasicInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [newOptions, setNewOptions] = useState([]);
  const [editItem, setEditItem] = useState({});
  const [hasSpecialHourError, setSpecialHourError] = useState(false);
  const {
    setHasFoodMenus,
    setHasServiceItems,
    setSelectedLocationID,
    menuMode,
  } = useContext(AppContext);

  // cursor ref
  const inputRef = useRef(null);

  // category
  const [categoryList, setCategoryList] = useState([]);
  const initMainCateObj = {
    id: null,
    name: null,
    gmb_category_id: null,
  };
  const [mainCategoryObj, setMainCategoryObj] = useState(initMainCateObj);
  const [additionalCategory, setAdditionalCategory] = useState([
    {
      id: '',
      name: '',
      gmb_category_id: '',
    },
  ]);
  const [additionalCateId, setAdditionalCateId] = useState([]);

  // all common dropdown list
  const initTableData = {
    id: '',
    business_name_jp: '',
    business_name_en: '',
    main_category_id: null,
    additional_category_id: [],
    postcode_jp: '',
    address_jp_1: '',
    address_jp_2: '',
    prefecture_id_jp: '',
    postcode_en: '',
    address_en_1: '',
    address_en_2: '',
    gmb_prefecture_name: '',
    service_area: '',
    location_description_jp: '',
    location_description_en: '',
    is_temporary_closure: '',
    business_reopening_date: null,
    phone_number: '',
    fax_number: '',
    url: '',
    menu_link: '',
    reservation_link: '',
    pre_order_link: '',
    year_of_establishment: null,
    plan: '',
    features: '',
    facility_wifi: '',
    staff_temperature: '',
    staff_wearing: '',
    splash_prevention_measures: '',
    next_customer_visit: '',
    mask: '',
    temperature: '',
    drive_through: '',
    delivery: '',
    in_store_shopping: '',
    same_day_delivery: '',
    non_contact_delivery: '',
    wheelchair_accessible_elevator: '',
    wheelchair_accessible_restroom: '',
    wheelchair_accessible_entrance: '',
    wheelchair_accessible_seats: '',
    wheelchair_accessible_parking: '',
    location_id: selectedLocation,
    day: [],
    day_status: [],
    sunday_from: [],
    sunday_to: [],
    monday_from: [],
    monday_to: [],
    tueday_from: [],
    tueday_to: [],
    wedday_from: [],
    wedday_to: [],
    thuday_from: [],
    thuday_to: [],
    special_day: [],
    special_day_status: [],
  };
  const initServOption = {
    drive_through: null,
    delivery: null,
    in_store_shopping: null,
    same_day_delivery: null,
    non_contact_delivery: null,
  };
  const initBarrOption = {
    wheelchair_accessible_elevator: null,
    wheelchair_accessible_restroom: null,
    wheelchair_accessible_entrance: null,
    wheelchair_accessible_seats: null,
    wheelchair_accessible_parking: null,
  };
  const initServAttOption = [];
  const initHealthOptions = {
    staff_temperature: null,
    staff_wearing: null,
    splash_prevention_measures: null,
    next_customer_visit: null,
    temperature: null,
  };
  const initPaymentOptions = {
    cash_only: null,
    nfc_mobile: null,
    american_express: null,
    dinaers_club: null,
    discover: null,
    jcb: null,
    master_card: null,
    visa: null,
    china_union_pay: null,
    debit_card: null,
    check: null,
  };

  const [tableData, setTableData] = useState(initTableData);
  const [servOption, setServOption] = useState(initServOption);
  const [barrOption, setBarrOption] = useState(initBarrOption);
  const [servAttOption, setServAttOption] = useState(initServAttOption);
  const [healthOptions, setHealthOptions] = useState(initHealthOptions);
  const [payOptions, setPayOptions] = useState(initPaymentOptions);
  const [showSpecialBusinessHour, setShowSpecialBusinessHour] = useState(false);

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
  const [specialBusinessHour, setSpecialBusinessHour] = useState([]);
  const [moreHourTypes, setMoreHourTypes] = useState([]);
  const [responseEN, setResponseEN] = useState([]);
  const [responseJP, setResponseJP] = useState([]);
  const {
    t,
    i18n: { language: selectedLanguage },
  } = useTranslation(['basic_info']);
  const makeGroupedResult = (data) => {
    const grpres = data.reduce((r, a) => {
      r[a.groupDisplayName] = r[a.groupDisplayName] || [];
      r[a.groupDisplayName].push(a);
      return r;
    }, Object.create(null));
    return grpres;
  };
  const { get: getLocationList, response } = useFetch(LOCATION_BOOKS);
  const { get: getPrefectures, response: preresponse } = useFetch(PREFECTURES);
  const today = moment(new Date()).format('yyyy-MM-DD');
  const { get: getBusinessCategory, response: cateResponse } =
    useFetch(BUSINESS_CATEGORY);
  const { get: getBasicInfo, response: getResponse } = useFetch(
    `${LOCATIONS}/${selectedLocation}${BASIC_INFO_GET}`,
  );

  useEffect(async () => {
    if (!selectedLocation) return;
    const newData = await getBasicInfo();
    if (getResponse.ok) {
      setSpecialBusinessHour([]);
      setCurrentActive('');
      const { result } = newData;
      const { basic_information = {} } = result;
      if (basic_information) {
        const {
          gmb_prefecture_name,
          payment_options,
          id,
          service_options,
          barrier_frees,
          health_and_safety,
          service_attributes,
          year_of_establishment,
          business_reopening_date,
          main_category,
          additionl_categories,
          business_hours,
          attributes = {},
          businessCategoryMoreHourTypes,
          special_business_hours,
          ...reducedBasicInfo
        } = basic_information;
        const { response_en = [], response_jp = [] } = attributes || {};
        setTableData(reducedBasicInfo);
        setResponsePrefecture(gmb_prefecture_name);
        setIdBasicInfo(id);
        setResponseEN(response_en);
        setResponseJP(response_jp);
        if (
          main_category !== null &&
          Object.keys(main_category).length !== 0 &&
          main_category.constructor === Object
        ) {
          setMainCategoryObj(main_category);
        } else {
          setMainCategoryObj(initMainCateObj);
        }
        if (
          main_category !== null &&
          Object.keys(main_category).length !== 0 &&
          main_category.constructor === Object
        ) {
          setTableData((previousState) => ({
            ...previousState,
            main_category_id: main_category.id,
          }));
        }
        if (business_hours.length !== 0) {
          const tempBusinessHours = business_hours;
          tempBusinessHours.forEach((item) => {
            if (item.status === 1 && item.periods.length === 0) {
              const tempObj = {
                open_at: '',
                close_at: '',
              };
              item.periods.push(tempObj);
            } else if (item.status === 0 && item.periods.length === 0) {
              const tempObj = {
                open_at: 'HOLIDAY',
                close_at: '',
              };
              item.periods.push(tempObj);
            }
          });
          setBusinessHour(tempBusinessHours);
        } else {
          const initBHours = [
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
          ];
          setBusinessHour(initBHours);
        }
        if (special_business_hours.length !== 0) {
          const tempBusinessHours = special_business_hours;
          tempBusinessHours.forEach((item) => {
            if (
              (item.status === 1 || item.status === 2 || item.status || 5) &&
              item.periods.length === 0
            ) {
              const tempObj = {
                open_at: '',
                close_at: '',
              };
              item.periods.push(tempObj);
            }
          });
          setSpecialBusinessHour(tempBusinessHours);
        }
        if (
          businessCategoryMoreHourTypes &&
          businessCategoryMoreHourTypes.length !== 0
        ) {
          businessCategoryMoreHourTypes.forEach((type) => {
            const tempMoreHour = [];
            const sunday = type.morehour.filter(
              (morehour) => morehour.day === 'SUNDAY',
            );
            const monday = type.morehour.filter(
              (morehour) => morehour.day === 'MONDAY',
            );
            const tuesday = type.morehour.filter(
              (morehour) => morehour.day === 'TUESDAY',
            );
            const wednesday = type.morehour.filter(
              (morehour) => morehour.day === 'WEDNESDAY',
            );
            const thursday = type.morehour.filter(
              (morehour) => morehour.day === 'THURSDAY',
            );
            const friday = type.morehour.filter(
              (morehour) => morehour.day === 'FRIDAY',
            );
            const saturday = type.morehour.filter(
              (morehour) => morehour.day === 'SATURDAY',
            );

            const func = function (array, day, daystr) {
              if (day.length) {
                array.push(day[0]);
              } else {
                array.push({
                  day: daystr,
                  status: 0,
                  periods: [
                    {
                      open_at: 'HOLIDAY',
                      close_at: '',
                    },
                  ],
                });
              }
            };

            func(tempMoreHour, sunday, 'SUNDAY');
            func(tempMoreHour, monday, 'MONDAY');
            func(tempMoreHour, tuesday, 'TUESDAY');
            func(tempMoreHour, wednesday, 'WEDNESDAY');
            func(tempMoreHour, thursday, 'THURSDAY');
            func(tempMoreHour, friday, 'FRIDAY');
            func(tempMoreHour, saturday, 'SATURDAY');

            type.morehour = tempMoreHour;
          });

          setMoreHourTypes(businessCategoryMoreHourTypes);
        }
        if (additionl_categories.length !== 0) {
          const idxArray = additionl_categories.map((item) => {
            return item.id;
          });
          setAdditionalCateId(idxArray);
          setAdditionalCategory(additionl_categories);
        } else {
          const addCatObj = {
            id: '',
            name: '',
            gmb_category_id: '',
          };
          setAdditionalCategory([addCatObj]);
        }
        if (year_of_establishment !== null) {
          const establishedYear = new Date(year_of_establishment);
          setTableData((prevState) => ({
            ...prevState,
            year_of_establishment: establishedYear,
          }));
        }
        if (business_reopening_date !== null) {
          const tempYear = new Date(business_reopening_date);
          setTableData((prevState) => ({
            ...prevState,
            business_reopening_date: tempYear,
          }));
        }
        if (basic_information !== null) {
          setTableData((prevState) => ({
            ...prevState,
            id: basic_information.id,
          }));
        }
      } else {
        setResponsePrefecture('');
        setTableData(initTableData);
        setServOption(initServOption);
        setBarrOption(initBarrOption);
        setServAttOption(initServAttOption);
        setHealthOptions(initHealthOptions);
        setIdBasicInfo('');
        setMainCategoryObj({});
        const addCatObj = {
          id: '',
          name: '',
          gmb_category_id: '',
        };
        setAdditionalCategory([addCatObj]);
        setPayOptions(initPaymentOptions);
        const initBHours = [
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
        ];
        setBusinessHour(initBHours);
        const initSpecialBusinessHour = [
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
          {
            special_day: new Date(),
            status: 1,
            periods: [
              {
                open_at: '',
                close_at: '',
              },
            ],
          },
        ];
        setSpecialBusinessHour(initSpecialBusinessHour);
      }
    }
  }, [selectedLocation]);

  const loadPrefectures = async () => {
    const respPrefecture = await getPrefectures();
    if (preresponse.ok) {
      setPrefectures(respPrefecture?.result);
      const responseData = respPrefecture?.result;
      const formattedPrefectureArray = responseData.map((item) => ({
        label: item.jp_name,
        value: item.id,
      }));
      setFormattedPrefecture(formattedPrefectureArray);
    }
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
  const getRow = (id) => {
    setCurrentActive(id);
    if (id === 'fg-7') {
      setSpecialHourError(true);
    }
  };

  const getCurrentValue = (val, type) => {
    if (type === 'BOOL' || type === 'ENUM' || type === 'URL') {
      const [crnt_val = {}] = val.filter((item) => item.current);
      if (Object.keys(crnt_val).length > 0) {
        return crnt_val.value;
      }
    }
    return null;
  };

  const handleEditRow = (id, data) => {
    setCurrentActive(id);
    setEditItem(
      data.reduce((acc, val) => {
        acc[val.parent] = getCurrentValue(val.valueMetadata, val.valueType);
        return acc;
      }, {}),
    );
  };

  useEffect(() => {
    if (currentActive) {
      if (inputRef.current) {
        inputRef?.current?.focus();
      }
    }
  }, [currentActive]);
  const { put: editBasicInfo, response: editResponse } = useFetch(
    `${BASIC_INFORMATIONS}/${idBasicInfo}`,
  );
  const resetEditing = async () => {
    setCurrentActive('');
    const newSelectedLocation = selectedLocation;
    await setSelectedLocation('');
    await setSelectedLocation(newSelectedLocation);
    setEditItem({});
    setSpecialHourError(false);
  };
  const disableEditing = async () => {
    try {
      setLoading(true);
      if (currentActive === 'fg-8') {
        const resultedDate = moment(tableData.business_reopening_date).format(
          'YYYY-MM-DD',
        );
        const temporaryClosed = {
          id: idBasicInfo,
          location_id: selectedLocation,
          business_reopening_date: resultedDate,
          is_temporary_closure: tableData.is_temporary_closure,
        };
        await editBasicInfo(temporaryClosed);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-14') {
        const responseLocationId = {
          location_id: selectedLocation,
        };
        const finalServAttOption = { ...servAttOption, ...responseLocationId };
        const serAtResponse = await editBasicInfo(finalServAttOption);
        if (editResponse.ok) {
          const { result } = serAtResponse;
          const { data } = result;
          const servAttOptionReturnResponse =
            data &&
            data.map((item) => {
              if (item.location_id === selectedLocation) {
                return item.service_attribute;
              }
              return null;
            });
          const { id, basic_info_id, ...remainingServAttResponse } =
            servAttOptionReturnResponse[0];
          setServAttOption(remainingServAttResponse);
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-15') {
        const resultedDate = moment(tableData.year_of_establishment).format(
          'YYYY-MM-DD',
        );
        const estalishedYear = {
          id: idBasicInfo,
          location_id: selectedLocation,
          year_of_establishment: resultedDate,
        };
        await editBasicInfo(estalishedYear);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-16') {
        const responseLocationId = {
          location_id: selectedLocation,
        };
        const finalPayOptions = { ...payOptions, ...responseLocationId };
        const payOpResponse = await editBasicInfo(finalPayOptions);
        if (editResponse.ok) {
          const { result } = payOpResponse;
          const { data } = result;
          const payOptionReturnResponse =
            data &&
            data.map((item) => {
              if (item.location_id === selectedLocation) {
                return item.payment_option;
              }
              return null;
            });
          const { id, basic_info_id, ...remainingPaymentResponse } =
            payOptionReturnResponse[0];
          setPayOptions(remainingPaymentResponse);
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-17') {
        const responseLocationId = {
          location_id: selectedLocation,
        };
        const finalServOptions = { ...servOption, ...responseLocationId };
        const servOpResponse = await editBasicInfo(finalServOptions);
        if (editResponse.ok) {
          const { result } = servOpResponse;
          const { data } = result;
          const servOptionReturnResponse =
            data &&
            data.map((item) => {
              if (item.location_id === selectedLocation) {
                return item.service_option;
              }
              return null;
            });
          const { id, basic_info_id, ...remainingServOptionsResponse } =
            servOptionReturnResponse[0];
          setServOption(remainingServOptionsResponse);
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-18') {
        const responseLocationId = {
          location_id: selectedLocation,
        };
        const finalBarrOption = { ...barrOption, ...responseLocationId };
        const barrOpResponse = await editBasicInfo(finalBarrOption);
        if (editResponse.ok) {
          const { result } = barrOpResponse;
          const { data } = result;
          const barrOptionReturnResponse =
            data &&
            data.map((item) => {
              if (item.location_id === selectedLocation) {
                return item.barrier_free;
              }
              return null;
            });
          const { id, basic_info_id, ...remainingBarrOptionResponse } =
            barrOptionReturnResponse[0];
          setBarrOption(remainingBarrOptionResponse);
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-20') {
        const responseLocationId = {
          location_id: selectedLocation,
        };
        const finalHealthOptions = { ...healthOptions, ...responseLocationId };
        const healthOpResponse = await editBasicInfo(finalHealthOptions);
        if (editResponse.ok) {
          const { result } = healthOpResponse;
          const { data } = result;
          const healthOptionReturnResponse =
            data &&
            data.map((item) => {
              if (item.location_id === selectedLocation) {
                return item.health_and_safety;
              }
              return null;
            });
          const { id, basic_info_id, ...remainingHealthOptionResponse } =
            healthOptionReturnResponse[0];
          setHealthOptions(remainingHealthOptionResponse);
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-3') {
        if (
          notNullOrEmpty(tableData.address_jp_1) &&
          notNullOrEmpty(tableData.postcode_jp) &&
          notNullOrEmpty(tableData.gmb_prefecture_name) &&
          isLessOrEqualEightChar(tableData.postcode_jp)
        ) {
          const addressObj = {
            location_id: selectedLocation,
            address_jp_1: tableData.address_jp_1,
            postcode_jp: tableData.postcode_jp,
            gmb_prefecture_name: responsePrefecture,
            address_jp_2: tableData.address_jp_2,
          };
          await editBasicInfo(addressObj);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-2') {
        const categoryObj = {
          location_id: selectedLocation,
          main_category_id: tableData.main_category_id,
          additional_category_id: additionalCateId,
        };
        await editBasicInfo(categoryObj);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-6') {
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
        const businessObj = {
          location_id: selectedLocation,
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
        };
        await editBasicInfo(businessObj);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive.startsWith('fg-more-hour-')) {
        const targetIndex = currentActive.replace('fg-more-hour-', '');
        const moreHourType = moreHourTypes[targetIndex];

        const statusArray = moreHourType.morehour.map((item) => {
          return item.status;
        });

        const days = {};
        moreHourType.morehour.forEach((item) => {
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

        const businessObj = {
          location_id: selectedLocation,
          business_category_more_hour_type_id: moreHourType?.id,
          hours_type_id: moreHourType?.hours_type_id,
          morehour_sunday_from: days?.SUNDAY?.from,
          morehour_sunday_to: days?.SUNDAY?.to,
          morehour_monday_from: days?.MONDAY?.from,
          morehour_monday_to: days?.MONDAY?.to,
          morehour_tueday_from: days?.TUESDAY?.from,
          morehour_tueday_to: days?.TUESDAY?.to,
          morehour_wedday_from: days?.WEDNESDAY?.from,
          morehour_wedday_to: days?.WEDNESDAY?.to,
          morehour_thuday_from: days?.THURSDAY?.from,
          morehour_thuday_to: days.THURSDAY?.to,
          morehour_friday_from: days?.FRIDAY?.from,
          morehour_friday_to: days?.FRIDAY?.to,
          morehour_saturday_from: days?.SATURDAY?.from,
          morehour_saturday_to: days?.SATURDAY?.to,
          morehour_day: businessDay,
          morehour_day_status: statusArray,
        };
        await editBasicInfo(businessObj);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-7') {
        const dateArray = specialBusinessHour.map((item) => {
          return moment(item.special_day).format('yyyy-MM-DD');
        });
        const statusArray = specialBusinessHour.map((item) => {
          return item.status;
        });
        const weekDaysArray = dateArray.map((singleDate) => {
          return moment(singleDate).format('dddd').toUpperCase();
        });
        const specialBusinessObj = {
          location_id: selectedLocation,
          special_day: dateArray,
          week_days: weekDaysArray,
          special_day_status: statusArray,
        };
        specialBusinessHour.forEach((item, index) => {
          specialBusinessObj[`special_day_${index + 1}_from`] =
            item.status === 4
              ? []
              : item.status === 3
              ? ['00:00']
              : item.periods.map((period) => period.open_at);
          specialBusinessObj[`special_day_${index + 1}_to`] =
            item.status === 4
              ? []
              : item.status === 3
              ? ['00:00']
              : item.periods.map((period) => period.close_at);
        });

        await editBasicInfo(specialBusinessObj);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-1') {
        if (notEmptyOrLengthInvalid(tableData.business_name_jp)) {
          const businessName = {
            location_id: selectedLocation,
            business_name_jp: tableData.business_name_jp,
          };
          await editBasicInfo(businessName);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-4') {
        if (notEmptyOrLengthInvalid(tableData.service_area)) {
          const servArea = {
            location_id: selectedLocation,
            service_area: tableData.service_area,
          };
          await editBasicInfo(servArea);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-5') {
        if (notEmptyOrLengthInvalid(tableData.location_description_jp)) {
          const locationDesc = {
            location_id: selectedLocation,
            location_description_jp: tableData.location_description_jp,
          };
          await editBasicInfo(locationDesc);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-9') {
        if (
          phoneNumberLength(tableData.phone_number) &&
          phoneNumberValidation(tableData.phone_number)
        ) {
          const numberPayload = {
            location_id: selectedLocation,
            phone_number: tableData.phone_number,
          };
          await editBasicInfo(numberPayload);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-10') {
        if (
          isUrlPattern(tableData.url) &&
          notEmptyOrLengthInvalid(tableData.url)
        ) {
          const urlPayload = {
            location_id: selectedLocation,
            url: tableData.url,
          };
          await editBasicInfo(urlPayload);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-11') {
        if (
          isUrlPattern(tableData.url) &&
          notEmptyOrLengthInvalid(tableData.url)
        ) {
          const menuLinkPayload = {
            location_id: selectedLocation,
            menu_link: tableData.menu_link,
          };
          await editBasicInfo(menuLinkPayload);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-12') {
        if (
          isUrlPattern(tableData.url) &&
          notEmptyOrLengthInvalid(tableData.url) &&
          notMediaUrl(tableData.url)
        ) {
          const reservationPayload = {
            location_id: selectedLocation,
            reservation_link: tableData.reservation_link,
          };
          await editBasicInfo(reservationPayload);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-13') {
        if (
          isUrlPattern(tableData.url) &&
          notEmptyOrLengthInvalid(tableData.url) &&
          notMediaUrl(tableData.url)
        ) {
          const preOrderPayload = {
            location_id: selectedLocation,
            pre_order_link: tableData.pre_order_link,
          };
          await editBasicInfo(preOrderPayload);
          if (editResponse.ok) {
            setCurrentActive('');
            setAddressFlag(false);
          }
        } else {
          setAddressFlag(true);
        }
      } else if (currentActive === 'fg-19') {
        const planPayload = {
          location_id: selectedLocation,
          plan: tableData.plan,
        };
        await editBasicInfo(planPayload);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-21') {
        const featuresPayload = {
          location_id: selectedLocation,
          features: tableData.features,
        };
        await editBasicInfo(featuresPayload);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else if (currentActive === 'fg-22') {
        const facilityWifiPayload = {
          location_id: selectedLocation,
          facility_wifi: tableData.facility_wifi,
        };
        await editBasicInfo(facilityWifiPayload);
        if (editResponse.ok) {
          setCurrentActive('');
        }
      } else {
        const dynamicAttributePayload = {
          location_id: selectedLocation,
          updating_attributes: true,
          ...editItem,
        };
        const dyResponse = await editBasicInfo(dynamicAttributePayload);
        if (dyResponse.success) {
          const {
            result: { attributes },
          } = dyResponse;
          const { response_en, response_jp } = attributes;
          setResponseJP(response_jp);
          setResponseEN(response_en);
        }
        setCurrentActive('');
      }
    } finally {
      setLoading(false);
    }
  };
  const defaultInputChange = (evt, key) => {
    setTableData((prevState) => ({
      ...prevState,
      [key]: evt.target.value,
      location_id: selectedLocation,
      id: idBasicInfo,
    }));
  };
  // const handleWifiDropdown = (event, key) => {
  //   if (key === 'facility_wifi') {
  //     setTableData((prevState) => ({
  //       ...prevState,
  //       [key]: event.value,
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   } else {
  //     setTableData((prevState) => ({
  //       ...prevState,
  //       [key]: parseInt(event.value, 10),
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   }
  // };
  // const handleCustomDropdown = (event, key) => {
  //   if (currentActive === 'fg-14') {
  //     setServAttOption((prevState) => [
  //       ...prevState,
  //       {
  //         displayName: key,
  //         location_id: selectedLocation,
  //         selected: 1,
  //         id: idBasicInfo,
  //       },
  //     ]);
  //   } else if (currentActive === 'fg-16') {
  //     setPayOptions((prevState) => ({
  //       ...prevState,
  //       [key]: parseInt(event.value, 10),
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   } else if (currentActive === 'fg-17') {
  //     setServOption((prevState) => ({
  //       ...prevState,
  //       [key]: parseInt(event.value, 10),
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   } else if (currentActive === 'fg-18') {
  //     setBarrOption((prevState) => ({
  //       ...prevState,
  //       [key]: parseInt(event.value, 10),
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   } else if (currentActive === 'fg-20') {
  //     setHealthOptions((prevState) => ({
  //       ...prevState,
  //       [key]: parseInt(event.value, 10),
  //       location_id: selectedLocation,
  //       id: idBasicInfo,
  //     }));
  //   }
  // };
  const getPrefectureId = (event) => {
    setTableData((prevState) => ({
      ...prevState,
      gmb_prefecture_name: event.label,
    }));
    setResponsePrefecture(event.label);
  };
  // const setCustomDate = (event, key) => {
  //   const customDate = new Date(event);
  //   setTableData((prevState) => ({
  //     ...prevState,
  //     [key]: customDate,
  //     location_id: selectedLocation,
  //     id: idBasicInfo,
  //   }));
  // };
  const toggleState = (event, key) => {
    if (event.target.checked) {
      setTableData((prevState) => ({
        ...prevState,
        [key]: 1,
        location_id: selectedLocation,
        id: idBasicInfo,
      }));
    } else {
      setTableData((prevState) => ({
        ...prevState,
        [key]: 0,
        location_id: selectedLocation,
        id: idBasicInfo,
      }));
    }
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

  const handleMoreHourTimeFrom = (event, day, index, hoursTypeId) => {
    const newMoreHourTypes = [...moreHourTypes];
    const newMoreHourType = newMoreHourTypes.find(
      (type) => type.hours_type_id === hoursTypeId,
    );
    if (event.value === 'HOLIDAY') {
      newMoreHourType?.morehour.forEach((item) => {
        if (item.day === day) {
          item.periods[index].open_at = 'HOLIDAY';
          item.status = 0;
        }
      });
    } else if (event.value === 'DELETE') {
      newMoreHourType?.morehour.forEach((item) => {
        if (item.day === day) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newMoreHourType?.morehour.forEach((item) => {
        if (item.day === day) {
          item.status = 1;
          item.periods[index].open_at = event.value;
        }
      });
    }
    setMoreHourTypes(newMoreHourTypes);
  };

  const handleMoreHourTimeTo = (event, day, index, hoursTypeId) => {
    const newMoreHourTypes = [...moreHourTypes];
    const newMoreHourType = newMoreHourTypes.find(
      (type) => type.hours_type_id === hoursTypeId,
    );
    if (event.value === 'DELETE') {
      newMoreHourType?.morehour.forEach((item) => {
        if (item.day === day) {
          item.periods.splice(index, 1);
        }
      });
    } else {
      newMoreHourType?.morehour.forEach((item) => {
        if (item.day === day) {
          item.periods[index].close_at = event.value;
        }
      });
    }
    setMoreHourTypes(newMoreHourTypes);
  };

  const handleMoreHourAddRow = (day, hoursTypeId) => {
    const newMoreHourTypes = [...moreHourTypes];
    const newMoreHourType = newMoreHourTypes.find(
      (type) => type.hours_type_id === hoursTypeId,
    );
    newMoreHourType?.morehour.forEach((item) => {
      if (item.day === day) {
        const timeVal = {
          open_at: '',
          close_at: '',
        };
        item.periods.push(timeVal);
      }
    });
    setMoreHourTypes(newMoreHourTypes);
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
  const handleMoreHourNextCopy = (day, hoursTypeId) => {
    const newMoreHourTypes = [...moreHourTypes];
    const newMoreHourType = newMoreHourTypes.find(
      (type) => type.hours_type_id === hoursTypeId,
    );

    let clickIndex = 0;
    newMoreHourType?.morehour.forEach((item, index) => {
      if (item.day === day) {
        clickIndex = index;
      }
    });
    // 次のインデックスの要素へオブジェクトコピー
    newMoreHourType.morehour[clickIndex + 1].status =
      newMoreHourType?.morehour[clickIndex].status;
    newMoreHourType.morehour[clickIndex + 1].periods =
      newMoreHourType?.morehour[clickIndex].periods.map((obj) => ({ ...obj }));
    setMoreHourTypes(newMoreHourTypes);
  };
  const handleAddSpecialBusinessHourRow = () => {
    const newSpecialBusinessHour = [...specialBusinessHour];

    newSpecialBusinessHour.push({
      special_day: moment(new Date()).format('yyyy-MM-DD'),
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
        item.special_day = moment(event).format('yyyy-MM-DD');
      }
    });
    setSpecialBusinessHour(newSuperBusinessHours);
  };
  const showPastSpecialDate = () => {
    setShowSpecialBusinessHour(!showSpecialBusinessHour);
  };
  const handleCategoryChange = (event, index) => {
    const preData = [...additionalCategory];
    preData[index].id = parseInt(event.value, 10);
    preData[index].name = event.label;
    setAdditionalCategory(preData);
    const preIdList = [...additionalCateId];
    preIdList[index] = parseInt(event.value, 10);
    setAdditionalCateId(preIdList);
  };
  const handleAddCategory = () => {
    const preData = [...additionalCategory];
    const mockObj = {
      id: '',
      name: '',
      gmb_category_id: '',
    };
    preData.push(mockObj);
    setAdditionalCategory(preData);
  };
  const handleDeleteCategory = (index) => {
    const preData = [...additionalCategory];
    preData.splice(index, 1);
    setAdditionalCategory(preData);
    const preIdList = [...additionalCateId];
    preIdList.splice(index, 1);
    setAdditionalCateId(preIdList);
  };
  const commonCategoryDropdown = (event, key) => {
    setTableData((prevState) => ({
      ...prevState,
      [key]: event.value,
      location_id: selectedLocation,
      id: idBasicInfo,
    }));
    if (key === 'main_category_id') {
      const newCategoryUpdatedObj = {
        id: event.value,
        name: event.label,
        gmb_category_id: null,
      };
      setMainCategoryObj(newCategoryUpdatedObj);
    }
  };
  const loadBusinessCategory = async () => {
    const responseCate = await getBusinessCategory();
    const cateData = responseCate?.result;
    if (cateResponse.ok) {
      const formattedCategoryList =
        cateData &&
        cateData.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      setCategoryList(formattedCategoryList);
    }
  };
  const colourStyles = {
    option: (styles, { isSelected }) => {
      return {
        ...styles,
        cursor: 'default',
        textDecoration: isSelected ? 'underline' : 'none',
        backgroundColor: isSelected ? 'white' : 'default',
        color: isSelected ? 'default' : 'default',
        ':hover': {
          backgroundColor: 'white',
        },
      };
    },
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  useMount(() => {
    loadLocationList();
    loadPrefectures();
    loadBusinessCategory();
  }, []);

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
    setEditItem((prevState) => {
      return {
        ...prevState,
        [target]: value,
      };
    });
  };

  const getAllDisplayNames = (key) => {
    const filteredStrings =
      newOptions[key].length &&
      newOptions[key] instanceof Array &&
      newOptions[key]
        .map((opt) => {
          const [singleDisplayName] = opt.valueMetadata
            ?.filter((fil_i) => fil_i.current)
            .map((item) => {
              return item.displayName;
            });
          return singleDisplayName;
        })
        .filter((fil_item) => fil_item !== undefined);
    return filteredStrings.join(`${t('basic_info:BASIC_INFO.COMMA')} `);
  };
  useEffect(() => {
    setNewOptions([]);
    setSelectedLocationID(selectedLocation);
  }, [selectedLocation]);
  useEffect(() => {
    if (selectedLanguage === 'ja') {
      setNewOptions(makeGroupedResult(responseJP));
    }
    if (selectedLanguage === 'en') {
      setNewOptions(makeGroupedResult(responseEN));
    }
  }, [selectedLanguage, responseJP, responseEN]);

  useEffect(() => {
    if (currentActive === 'fg-7') {
      const errorFlag = specialBusinessHour
        .filter(
          ({ status, special_day }) =>
            (status === 1 || status === 2) && special_day >= today,
        )
        .some(({ periods }) =>
          periods.some(
            ({ open_at, close_at }) => open_at === '' || close_at === '',
          ),
        );
      setSpecialHourError(errorFlag);
    }
  }, [specialBusinessHour, currentActive]);
  const setOnSelectLocation = (event) => {
    setSelectedLocation(event.target.value);
  };
  useEffect(() => {
    if (
      locationList &&
      locationList.length > 0 &&
      locationList[0].id !== undefined
    ) {
      setSelectedLocation(locationList[0].id); 
      console.log("effect",selectedLocation);
    }
  }, []);
  
  return (
    <>
      <Loading loading={loading} />
      {menuMode === 'sidebar' ? (
        <>
          <div className="flex">
            <Explanation screen="BASIC_INFO" />
            <div className="location-wrapper">
              <FormControl>
                <TextField select id="loc" defaultValue='725' label={t('basic_info:MENU.LOCATION')} value={selectedLocation} onChange={setOnSelectLocation} variant='outlined' style={{width:'220px',height:'40px'}} InputLabelProps={{shrink: true}}>
                  {locationList && locationList.map((item) => {
                    return(
                      <MenuItem style={{height:'40px'}} value={item.id} key={item.id}><Radio checked={selectedLocation === item.id}/>{item.name}</MenuItem>
                    )                      
                    }
                  )}
                </TextField>
              </FormControl>
            </div>
          </div>
          <Navigation />
        </>
      ) : (
        <></>
      )}

      <div className="basic-info">
        {currentActive === '' ? (
          <></>
        ) : (
          <>
            <button
              type="button"
              className={`cancel-button ${
                menuMode === 'sidebar' ? '' : 'cancel-button--top'
              }`}
              onClick={resetEditing}
            >
              {t('basic_info:BASIC_INFO.RETURN')}
            </button>
            <button
              type="button"
              className={`update-button ${
                menuMode === 'sidebar' ? '' : 'update-button--top'
              }`}
              onClick={disableEditing}
              disabled={hasSpecialHourError}
            >
              {t('basic_info:BASIC_INFO.EDIT')}
            </button>
          </>
        )}
        <CRow>
          {/* <div className="basic-location-wrapper">
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
                        onClick={() => setOnSelectLocation(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </CCardBody>
            </CCard>
          </div> */}
          <div className="full-info-card">
            <div className="info-title">
              <p className="info-header-text">
                {t('basic_info:BASIC_INFO.BASIC_INFO_HEADER')}
              </p>
            </div>
            <CForm action="" method="post" className="form-horizontal">
              {/* ======================================ビジネス名====================================== */}
              <CFormGroup
                row
                className={`${
                  currentActive === 'fg-1'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }`}
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.INFO_BUSINESS_NAME_JP')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-1' ? (
                    <>
                      <input
                        ref={inputRef}
                        className="info-edit-input-odd"
                        value={
                          tableData === null ||
                          tableData.business_name_jp === ''
                            ? ''
                            : tableData.business_name_jp
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'business_name_jp')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_VALIDATE')}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p className="info-label">
                      {tableData === null || tableData.business_name_jp === ''
                        ? ''
                        : tableData.business_name_jp}
                    </p>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-1')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================カテゴリ====================================== */}
              <CFormGroup
                row
                className={
                  currentActive === 'fg-2'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.CATEGORY')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label">
                    {t('basic_info:BASIC_INFO.MAIN_CATEGORY')}
                  </p>
                  <p className="info-label">
                    {t('basic_info:BASIC_INFO.ADDITIONAL_CATEGORY')}
                  </p>
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-2' ? (
                    <div className="select-category-wrapper">
                      <div className="select-category">
                        <Select
                          isSearchable
                          closeMenuOnSelect={false}
                          styles={colourStyles}
                          onChange={(event) =>
                            commonCategoryDropdown(event, 'main_category_id')
                          }
                          components={{ DropdownIndicator }}
                          value={
                            categoryList[tableData.main_category_id - 1] ||
                            false
                          }
                          options={categoryList || []}
                        />
                      </div>
                      {additionalCategory &&
                        additionalCategory.map((addCat, index) => {
                          return (
                            <div
                              className="select-additional-category"
                              id={index}
                            >
                              <Select
                                isSearchable
                                closeMenuOnSelect={false}
                                styles={colourStyles}
                                options={categoryList || []}
                                value={
                                  addCat.id !== ''
                                    ? categoryList[addCat.id - 1]
                                    : false
                                }
                                components={{ DropdownIndicator }}
                                onChange={(event) =>
                                  handleCategoryChange(event, index)
                                }
                              />
                              <div className="delete-additional-category">
                                <DeleteIcon
                                  width={20}
                                  height={20}
                                  className="delete-split"
                                  onClick={() => handleDeleteCategory(index)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      {additionalCategory && (
                        <AddIcon
                          width={15}
                          height={15}
                          className="add-category"
                          onClick={() => handleAddCategory()}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="info-label">
                        {mainCategoryObj && mainCategoryObj.name
                          ? mainCategoryObj.name
                          : ''}
                      </p>
                      {additionalCategory &&
                        additionalCategory.map((addCat, index) => {
                          return (
                            <p className="info-label" key={index}>
                              {addCat.name}
                            </p>
                          );
                        })}
                    </>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-2')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================住所====================================== */}
              <CFormGroup
                row
                className={`${
                  currentActive === 'fg-3'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }`}
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.ADDRESS_JP')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  {currentActive === 'fg-3' ? (
                    <>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.POSTAL_CODE_JP')}
                      </p>
                      <p className="info-label prefecture-specific-padding">
                        {t('basic_info:BASIC_INFO.PREFECTURE_JP')}
                      </p>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.STREET_ADDRESS_JP')}
                      </p>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.ADDRESS_2_JP')}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.POSTAL_CODE_JP')}
                      </p>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.PREFECTURE_JP')}
                      </p>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.STREET_ADDRESS_JP')}
                      </p>
                      <p className="info-label">
                        {t('basic_info:BASIC_INFO.ADDRESS_2_JP')}
                      </p>
                    </>
                  )}
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-3' ? (
                    <>
                      <input
                        ref={inputRef}
                        className="info-edit-input-odd"
                        value={
                          tableData === null || tableData.postcode_jp === ''
                            ? ''
                            : tableData.postcode_jp
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'postcode_jp')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_POSTCODE')}
                        </p>
                      ) : (
                        <></>
                      )}
                      <div className="select-prefecture">
                        <Select
                          options={
                            prefectures
                              ? prefectures.map((item) => ({
                                  label: item.jp_name,
                                  value: item.id,
                                }))
                              : []
                          }
                          components={{ DropdownIndicator }}
                          styles={colourStyles}
                          value={
                            formattedPrefecture[
                              formattedPrefecture.findIndex(
                                (el) => el.label === responsePrefecture,
                              )
                            ]
                          }
                          onChange={(event) => getPrefectureId(event)}
                        />
                      </div>
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_MESSAGE')}
                        </p>
                      ) : (
                        <></>
                      )}
                      <input
                        className="info-edit-input-odd"
                        value={
                          tableData === null || tableData.address_jp_1 === ''
                            ? ''
                            : tableData.address_jp_1
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'address_jp_1')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_MESSAGE')}
                        </p>
                      ) : (
                        <></>
                      )}
                      <input
                        className="info-edit-input-odd"
                        value={
                          tableData === null || tableData.address_jp_2 === ''
                            ? ''
                            : tableData.address_jp_2
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'address_jp_2')
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p className="info-label">
                        {tableData === null || tableData.postcode_jp === ''
                          ? ''
                          : tableData.postcode_jp}
                      </p>
                      <p className="info-label">
                        {tableData === null || responsePrefecture === null
                          ? ''
                          : responsePrefecture}
                      </p>
                      <p className="info-label">
                        {tableData === null || tableData.address_jp_1 === ''
                          ? ''
                          : tableData.address_jp_1}
                      </p>
                      <p className="info-label">
                        {tableData === null || tableData.address_jp_2 === ''
                          ? ''
                          : tableData.address_jp_2}
                      </p>
                    </>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-3')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================サービス提供地域====================================== */}
              <CFormGroup
                row
                className={
                  currentActive === 'fg-4'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.SERVICE_AREA')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-4' ? (
                    <>
                      <input
                        ref={inputRef}
                        className="info-edit-input-white"
                        value={
                          tableData === null || tableData.service_area === ''
                            ? ''
                            : tableData.service_area
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'service_area')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_VALIDATE')}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p className="info-label">
                      {tableData === null || tableData.service_area === ''
                        ? ''
                        : tableData.service_area}
                    </p>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-4')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================ロケーションの説明====================================== */}
              <CFormGroup
                row
                className={`${
                  currentActive === 'fg-5'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }`}
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.LOCATION_DESCRIPTION_JP')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-5' ? (
                    <>
                      <textarea
                        ref={inputRef}
                        className="info-edit-input-odd"
                        value={
                          tableData === null ||
                          tableData.location_description_jp === ''
                            ? ''
                            : tableData.location_description_jp
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'location_description_jp')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t(
                            'basic_info:BASIC_INFO.ERROR_VALIDATE_LOCATION_DESCRIPTION',
                          )}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p className="info-label">
                      {tableData === null ||
                      tableData.location_description_jp === ''
                        ? ''
                        : tableData.location_description_jp}
                    </p>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-5')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================営業時間====================================== */}
              <CFormGroup
                row
                className={
                  currentActive === 'fg-6'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.BUSINESS_HOUR')}
                  </p>
                  {currentActive === 'fg-6' && (
                    <p className="hour-remark label-first-padding">
                      {t('basic_info:BASIC_INFO.HOUR_REMARKS')}
                    </p>
                  )}
                </CCol>

                <CCol md="3" className="info-border-right">
                  {currentActive === 'fg-6' ? (
                    <>
                      <CRow>
                        <p className="info-label show-date ">
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
                  ) : (
                    <>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.SUNDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.MONDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.TUESDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.WEDNESDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.THURSDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.FRIDAY')}
                        </p>
                      </CRow>
                      <CRow>
                        <p className="time-row">
                          {t('basic_info:BASIC_INFO.SATURDAY')}
                        </p>
                      </CRow>
                    </>
                  )}
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-6' ? (
                    businessHour &&
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
                                        components={{ DropdownIndicator }}
                                        styles={customStyles}
                                        value={
                                          modifiedTimeSelect[
                                            modifiedTimeSelect.findIndex(
                                              (el) => el.value === item.open_at,
                                            )
                                          ] || false
                                        }
                                        onChange={(event) =>
                                          handleTimeFrom(event, day.day, index)
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
                                              components={{ DropdownIndicator }}
                                              styles={customStyles}
                                              value={
                                                timeSelect[
                                                  timeSelect.findIndex(
                                                    (el) =>
                                                      el.value === item.open_at,
                                                  )
                                                ] || false
                                              }
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
                                      <div className="padding-dash">−</div>
                                      <div className="time-to">
                                        {index === 0 ? (
                                          <Select
                                            closeMenuOnSelect
                                            options={timeSelectToModified}
                                            components={{ DropdownIndicator }}
                                            styles={customStyles}
                                            value={
                                              timeSelectToModified[
                                                timeSelectToModified.findIndex(
                                                  (el) =>
                                                    el.value === item.close_at,
                                                )
                                              ] || false
                                            }
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
                                            components={{ DropdownIndicator }}
                                            styles={customStyles}
                                            value={
                                              timeSelect[
                                                timeSelect.findIndex(
                                                  (el) =>
                                                    el.value === item.close_at,
                                                )
                                              ] || false
                                            }
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
                                      {index === day.periods.length - 1 &&
                                      day.periods.length < 3 ? (
                                        <div className="add-split-wrapper">
                                          <AddIcon
                                            width={12}
                                            height={12}
                                            onClick={() =>
                                              handleAddRow(day.day, 'business')
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
                    })
                  ) : (
                    <>
                      {businessHour &&
                        businessHour.map((day) => {
                          if (day.status === 0) {
                            return (
                              <CRow>
                                <p className="time-row one-row">
                                  {t('basic_info:BASIC_INFO.REGULAR_HOLIDAY')}
                                </p>
                              </CRow>
                            );
                          }
                          return (
                            <CRow>
                              {day && day.periods ? (
                                day.periods.map((period) => {
                                  return (
                                    <p className="time-row one-row">
                                      {period.open_at} − {period.close_at}
                                    </p>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </CRow>
                          );
                        })}
                    </>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-6')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================営業時間の詳細 ====================================== */}
              {Object.keys(moreHourTypes).map((key) => {
                return (
                  <CFormGroup
                    row
                    className={
                      currentActive === `fg-more-hour-${key}`
                        ? 'active'
                        : currentActive === ''
                        ? ''
                        : 'disable'
                    }
                  >
                    <CCol md="2" className="info-border-right">
                      <p className="info-label label-first-padding">
                        {t('basic_info:BASIC_INFO.DETAIL_BUSINESS_HOUR')}
                        <br />({moreHourTypes[key]?.localized_display_name})
                      </p>
                      {currentActive === `fg-more-hour-${key}` && (
                        <p className="hour-remark label-first-padding">
                          {t('basic_info:BASIC_INFO.HOUR_REMARKS')}
                        </p>
                      )}
                    </CCol>

                    <CCol md="3" className="info-border-right">
                      {currentActive === `fg-more-hour-${key}` ? (
                        <>
                          <CRow>
                            <p className="info-label show-date ">
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
                      ) : (
                        <>
                          {moreHourTypes[key]?.morehour?.map((data) => {
                            if (data.status === 1) {
                              return (
                                <CRow>
                                  <p className="time-row">
                                    {t(`basic_info:BASIC_INFO.${data.day}`)}
                                  </p>
                                </CRow>
                              );
                            }
                            return <></>;
                          })}
                        </>
                      )}
                    </CCol>
                    <CCol xs="3" md="6">
                      {currentActive === `fg-more-hour-${key}` ? (
                        moreHourTypes[key]?.morehour?.map((data) => {
                          return (
                            <CRow>
                              {data.periods &&
                                data.periods.map((item, index) => {
                                  return (
                                    <div className="time-wrapper">
                                      <div className="time-from">
                                        {index === 0 ? (
                                          <Select
                                            closeMenuOnSelect
                                            options={modifiedTimeSelect}
                                            components={{ DropdownIndicator }}
                                            styles={customStyles}
                                            value={
                                              modifiedTimeSelect[
                                                modifiedTimeSelect.findIndex(
                                                  (el) =>
                                                    el.value === item.open_at,
                                                )
                                              ] || false
                                            }
                                            onChange={(event) =>
                                              handleMoreHourTimeFrom(
                                                event,
                                                data.day,
                                                index,
                                                moreHourTypes[key]
                                                  ?.hours_type_id,
                                              )
                                            }
                                          />
                                        ) : (
                                          <>
                                            {data.status === 0 ? (
                                              <></>
                                            ) : (
                                              <>
                                                <Select
                                                  closeMenuOnSelect
                                                  options={timeSelect}
                                                  components={{
                                                    DropdownIndicator,
                                                  }}
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
                                                  onChange={(event) =>
                                                    handleMoreHourTimeFrom(
                                                      event,
                                                      data.day,
                                                      index,
                                                      moreHourTypes[key]
                                                        ?.hours_type_id,
                                                    )
                                                  }
                                                />
                                              </>
                                            )}
                                          </>
                                        )}
                                      </div>
                                      {data.status === 0 ? (
                                        <></>
                                      ) : (
                                        <>
                                          <div className="padding-dash">−</div>
                                          <div className="time-to">
                                            {index === 0 ? (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelectToModified}
                                                components={{
                                                  DropdownIndicator,
                                                }}
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
                                                onChange={(event) =>
                                                  handleMoreHourTimeTo(
                                                    event,
                                                    data.day,
                                                    index,
                                                    moreHourTypes[key]
                                                      ?.hours_type_id,
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Select
                                                closeMenuOnSelect
                                                options={timeSelect}
                                                components={{
                                                  DropdownIndicator,
                                                }}
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
                                                onChange={(event) =>
                                                  handleMoreHourTimeTo(
                                                    event,
                                                    data.day,
                                                    index,
                                                    moreHourTypes[key]
                                                      ?.hours_type_id,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          {index === data.periods.length - 1 &&
                                          data.periods.length < 3 ? (
                                            <div className="add-split-wrapper">
                                              <AddIcon
                                                width={12}
                                                height={12}
                                                onClick={() =>
                                                  handleMoreHourAddRow(
                                                    data.day,
                                                    moreHourTypes[key]
                                                      ?.hours_type_id,
                                                  )
                                                }
                                              />
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      )}
                                      {index === data.periods.length - 1 &&
                                        data.day !== 'SATURDAY' && (
                                          <div className="next-copy">
                                            <CTooltip
                                              content={t(
                                                'basic_info:BASIC_INFO.COPY_NEXT_DAY',
                                              )}
                                            >
                                              <ReturnIcon
                                                onClick={() =>
                                                  handleMoreHourNextCopy(
                                                    data.day,
                                                    moreHourTypes[key]
                                                      ?.hours_type_id,
                                                  )
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
                        })
                      ) : (
                        <>
                          {moreHourTypes[key]?.morehour?.map((data) => {
                            if (data.status === 1) {
                              return (
                                <CRow>
                                  {data && data.periods ? (
                                    data.periods.map((period) => {
                                      return (
                                        <p className="time-row one-row">
                                          {period.open_at} − {period.close_at}
                                        </p>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </CRow>
                              );
                            }
                            return <></>;
                          })}
                        </>
                      )}
                    </CCol>
                    <CCol md="1" className="background-white">
                      <CButton
                        shape="pill"
                        className={currentActive === '' ? '' : ' no-display'}
                        onClick={() => getRow(`fg-more-hour-${key}`)}
                      >
                        <EditIcon height={20} width={20} />
                      </CButton>
                    </CCol>
                  </CFormGroup>
                );
              })}
              {/* ======================================特別営業時間 ====================================== */}
              <CFormGroup
                row
                className={`${
                  currentActive === 'fg-7'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }`}
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.SPECIAL_BUSINESS_HOUR')}
                  </p>
                  {currentActive === 'fg-7' && (
                    <button
                      type="button"
                      className="special-business-hour-past-button"
                      onClick={showPastSpecialDate}
                    >
                      {showSpecialBusinessHour
                        ? t('basic_info:BASIC_INFO.HIDE_PAST')
                        : t('basic_info:BASIC_INFO.DISP_PAST')}
                    </button>
                  )}
                </CCol>
                <CCol md="3" className="info-border-right">
                  {currentActive === 'fg-7' ? (
                    specialBusinessHour &&
                    specialBusinessHour.map((day, index) => {
                      return (
                        <>
                          {showSpecialBusinessHour ||
                          (day.special_day && day.special_day >= today) ? (
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
                                  defaultValue={
                                    specialHourOptions[
                                      specialHourOptions.findIndex(
                                        (el) =>
                                          el.value === day.status.toString(),
                                      )
                                    ]
                                  }
                                  value={
                                    specialHourOptions[
                                      specialHourOptions.findIndex(
                                        (el) => el.value === String(day.status),
                                      )
                                    ] || false
                                  }
                                  components={{ DropdownIndicator }}
                                  options={specialHourOptions}
                                  onChange={(event) =>
                                    handleStatusDropDown(event, index)
                                  }
                                />
                              </div>
                              <div className="delete-special">
                                <DeleteIcon
                                  width={20}
                                  height={20}
                                  className="delete-split"
                                  onClick={() =>
                                    handleDeleteSpecialBusinessHourRow(index)
                                  }
                                />
                              </div>
                            </CRow>
                          ) : (
                            ''
                          )}
                        </>
                      );
                    })
                  ) : (
                    <>
                      {specialBusinessHour.map((item) => {
                        return (
                          <>
                            {item.special_day && item.special_day >= today ? (
                              <CRow>
                                <p className="time-row">
                                  {moment(item.special_day).format(
                                    'yyyy-MM-DD',
                                  )}
                                </p>
                                <p className="info-label">
                                  {item.status === 3
                                    ? t(
                                        'basic_info:BASIC_INFO.TWENTY_FOUR_HOURS',
                                      )
                                    : item.status === 4
                                    ? t('basic_info:BASIC_INFO.CLOSED')
                                    : item.status === 1
                                    ? t('basic_info:BASIC_INFO.OPEN')
                                    : item.status === 2
                                    ? t('basic_info:BASIC_INFO.SPLIT')
                                    : t('basic_info:BASIC_INFO.NORMAL')}
                                </p>
                              </CRow>
                            ) : (
                              ''
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
                  {currentActive === 'fg-7' && (
                    <div className="add-split-wrapper">
                      <AddIcon
                        width={12}
                        height={12}
                        className="add-split"
                        onClick={() => handleAddSpecialBusinessHourRow()}
                      />
                    </div>
                  )}
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-7' ? (
                    specialBusinessHour &&
                    specialBusinessHour.map((day, idx) => {
                      if (
                        showSpecialBusinessHour ||
                        (day.special_day && day.special_day >= today)
                      ) {
                        if (day.status === 5) {
                          return (
                            <CRow>
                              <p className="closed-wrapper">
                                {t('basic_info:BASIC_INFO.NORMAL')}
                              </p>
                            </CRow>
                          );
                        }
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
                                {t('basic_info:BASIC_INFO.TWENTY_FOUR_HOURS')}
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
                                    <div className="special-time-from">
                                      {index === 0 ? (
                                        <Select
                                          closeMenuOnSelect
                                          options={timeSelectToModified}
                                          value={
                                            timeSelectToModified[
                                              timeSelectToModified.findIndex(
                                                (el) =>
                                                  el.value === item.open_at,
                                              )
                                            ] || false
                                          }
                                          components={{ DropdownIndicator }}
                                          styles={customStyles}
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
                                          value={
                                            timeSelect[
                                              timeSelect.findIndex(
                                                (el) =>
                                                  el.value === item.open_at,
                                              )
                                            ] || false
                                          }
                                          components={{ DropdownIndicator }}
                                          styles={customStyles}
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
                                    <div className="special-time-to">
                                      {index === 0 ? (
                                        <Select
                                          closeMenuOnSelect
                                          options={timeSelectToModified}
                                          value={
                                            timeSelectToModified[
                                              timeSelectToModified.findIndex(
                                                (el) =>
                                                  el.value === item.close_at,
                                              )
                                            ] || false
                                          }
                                          components={{ DropdownIndicator }}
                                          styles={customStyles}
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
                                          value={
                                            timeSelect[
                                              timeSelect.findIndex(
                                                (el) =>
                                                  el.value === item.close_at,
                                              )
                                            ] || false
                                          }
                                          components={{ DropdownIndicator }}
                                          styles={customStyles}
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
                                      <div className="add-split-wrapper">
                                        <AddIcon
                                          width={12}
                                          height={12}
                                          className="add-split"
                                          onClick={() => handleSpecialRow(idx)}
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
                      }
                      return '';
                    })
                  ) : (
                    <>
                      {specialBusinessHour &&
                        specialBusinessHour.map((day) => {
                          if (day.special_day && day.special_day >= today) {
                            if (day.status === 4) {
                              return (
                                <CRow>
                                  <p className="time-row">
                                    {t('basic_info:BASIC_INFO.CLOSED')}
                                  </p>
                                </CRow>
                              );
                            }
                            if (day.status === 3) {
                              return (
                                <CRow>
                                  <p className="time-row">
                                    {t(
                                      'basic_info:BASIC_INFO.TWENTY_FOUR_HOURS',
                                    )}
                                  </p>
                                </CRow>
                              );
                            }
                            if (day.status === 5) {
                              return (
                                <CRow>
                                  <p className="time-row">
                                    {t('basic_info:BASIC_INFO.NORMAL')}
                                  </p>
                                </CRow>
                              );
                            }
                            return (
                              <CRow>
                                {day && day.periods ? (
                                  day.periods.map((period) => {
                                    return (
                                      <p className="time-row one-row">
                                        {period.open_at} − {period.close_at}
                                      </p>
                                    );
                                  })
                                ) : (
                                  <></>
                                )}
                              </CRow>
                            );
                          }
                          return '';
                        })}
                    </>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-7')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================営業ステータス====================================== */}
              <CFormGroup
                row
                className={
                  currentActive === 'fg-8'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.BUSINESS_HOURS_TEMP')}
                  </p>
                </CCol>

                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>

                <CCol xs="3" md="6" className="info-label">
                  <div className="selecting-checkbox">
                    {currentActive === 'fg-8' ? (
                      <div className="date-checkbox">
                        <input
                          className="reopening-checkbox"
                          type="checkbox"
                          checked={
                            tableData.is_temporary_closure &&
                            tableData.is_temporary_closure === 1
                          }
                          onChange={(evt) =>
                            toggleState(evt, 'is_temporary_closure')
                          }
                        />
                        <div className="reopening-text">
                          {t('basic_info:BASIC_INFO.TEMPORARY_CLOSED')}
                        </div>
                      </div>
                    ) : (
                      <p>
                        {tableData.is_temporary_closure === 1
                          ? t('basic_info:BASIC_INFO.TEMPORARY_CLOSED')
                          : t('basic_info:BASIC_INFO.UNDER_BUSINESS')}
                      </p>
                    )}
                  </div>
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-8')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================電話番号====================================== */}
              <CFormGroup
                row
                className={`${
                  currentActive === 'fg-9'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }`}
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.PHONE_NUMBER')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-9' ? (
                    <>
                      <input
                        ref={inputRef}
                        className="info-edit-input-odd"
                        placeholder="000-0000-0000"
                        value={
                          tableData === null || tableData.phone_number === ''
                            ? ''
                            : tableData.phone_number
                        }
                        onChange={(event) =>
                          defaultInputChange(event, 'phone_number')
                        }
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_PHONE')}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p className="info-label">
                      {tableData === null || tableData.phone_number === ''
                        ? ''
                        : tableData.phone_number}
                    </p>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-9')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================URL====================================== */}
              <CFormGroup
                row
                className={
                  currentActive === 'fg-10'
                    ? 'active'
                    : currentActive === ''
                    ? ''
                    : 'disable'
                }
              >
                <CCol md="2" className="info-border-right">
                  <p className="info-label label-first-padding">
                    {t('basic_info:BASIC_INFO.URL')}
                  </p>
                </CCol>
                <CCol md="3" className="info-border-right">
                  <p className="info-label" />
                </CCol>
                <CCol xs="3" md="6">
                  {currentActive === 'fg-10' ? (
                    <>
                      <input
                        ref={inputRef}
                        className="info-edit-input-white"
                        value={
                          tableData === null || tableData.url === ''
                            ? ''
                            : tableData.url
                        }
                        onChange={(event) => defaultInputChange(event, 'url')}
                      />
                      {addressFlag ? (
                        <p className="error-message">
                          {t('basic_info:BASIC_INFO.ERROR_URL')}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p className="info-label">
                      {tableData === null || tableData.url === ''
                        ? ''
                        : tableData.url}
                    </p>
                  )}
                </CCol>
                <CCol md="1" className="background-white">
                  <CButton
                    shape="pill"
                    className={currentActive === '' ? '' : ' no-display'}
                    onClick={() => getRow('fg-10')}
                  >
                    <EditIcon height={20} width={20} />
                  </CButton>
                </CCol>
              </CFormGroup>
              {/* ======================================その他属性====================================== */}
              {Object.keys(newOptions).map((key, index) => {
                return (
                  <CFormGroup
                    row
                    className={`${
                      currentActive === `fg-new-${index}`
                        ? 'active'
                        : currentActive === ''
                        ? ''
                        : 'disable'
                    }`}
                  >
                    <CCol md="2" className="info-border-right">
                      <p className="info-label label-first-padding">{key}</p>
                    </CCol>
                    <CCol md="3" className="info-border-right">
                      <p className="info-label" />
                    </CCol>
                    <CCol xs="3" md="6">
                      {currentActive === `fg-new-${index}` ? (
                        <div className="custom-dropdown">
                          {newOptions[key].length &&
                            newOptions[key].map((item, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className={`dropdown-list ${
                                    item.valueType === 'URL' ? `url-type` : null
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
                                      )}
                                  </>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="info-label">{getAllDisplayNames(key)}</p>
                      )}
                    </CCol>
                    <CCol md="1" className="background-white">
                      <CButton
                        shape="pill"
                        className={currentActive === '' ? '' : ' no-display'}
                        onClick={() =>
                          handleEditRow(`fg-new-${index}`, newOptions[key])
                        }
                      >
                        <EditIcon height={20} width={20} />
                      </CButton>
                    </CCol>
                  </CFormGroup>
                );
              })}
            </CForm>
          </div>
        </CRow>
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

export default BasicInfo;
