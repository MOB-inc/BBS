/* eslint-disable react/prop-types */
import {
  CCol,
  CForm,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CRow,
} from '@coreui/react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../../commons/components/Loading';
import { ReactComponent as DeleteIcon } from '../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import './service_item_modal.scss';
import { priceTypeOptions } from '../../../commons/constants/lists';
import {
  isLengthValid,
  isOnlyNumber,
} from '../../../commons/helpers/validation';
import { SERVICES_ITEMS } from '../../../commons/constants/url';

const customStyles = {
  control: () => ({
    width: '100%',
    border: '1px solid #828282',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
  }),
};
const customStylesOne = {
  control: () => ({
    width: '100%',
    border: '1px solid #828282',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
  }),
};

const ServiceAddEditModal = ({
  modal,
  edit,
  closeModal,
  currentRow,
  openDeleteModal,
  setServiceItems,
  setLocationId,
  setLoactionService,
  serviceOption,
  setServiceOption,
  setResponseEn,
  setResponseJp,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['basic_info']);
  const [addCustomService, setAddCustomService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePriceForm, setServicePriceForm] = useState({});
  const [serviceCost, setServiceCost] = useState('');
  const [isServiceNameValid, setServiceNameValid] = useState(true);
  const [isServiceDescValid, setServiceDescValid] = useState(true);
  const [isServiceCostValid, setServiceCostValid] = useState(true);
  const [serviceValue, setServiceValue] = useState({
    value: 0,
    label: t('basic_info:SERVICES.SELECT_GOOGLE_SERVICE_TEXT'),
  });

  const handleInputChange = (evt, type) => {
    evt.preventDefault();
    if (type === 1) {
      if (isLengthValid(evt.target.value)) {
        setServiceNameValid(true);
        setServiceName(evt.target.value);
      } else {
        setServiceNameValid(false);
      }
    } else if (type === 2) {
      if (isLengthValid(evt.target.value)) {
        setServiceDescValid(true);
        setServiceDescription(evt.target.value);
      } else {
        setServiceDescValid(false);
      }
    } else {
      const number = evt.target.value.replace(/,/g, '');
      if (isOnlyNumber(number) && number.length <= 8) {
        setServiceCost(number);
        setServiceCostValid(true);
      } else {
        setServiceCostValid(false);
      }
    }
  };

  const setDefaultPriceType = () => {
    setServicePriceForm({
      value: Object.values(priceTypeOptions[0])[1],
      label: Object.values(priceTypeOptions[0])[language === 'en' ? 2 : 3],
    });
  };

  const clear = () => {
    setServiceName('');
    setServiceDescription('');
    setServiceCost('');
    setDefaultPriceType();
    setServiceValue({
      value: 0,
      label: t('basic_info:SERVICES.SELECT_GOOGLE_SERVICE_TEXT'),
    });
    setAddCustomService(false);
  };

  const handleServiceItemDelete = async (event) => {
    event.preventDefault();
    openDeleteModal();
    closeModal();
  };

  const openHandler = () => {
    if (edit) {
      setServicePriceForm(
        priceTypeOptions
          .filter(
            (iPriceFilter) => iPriceFilter.value === currentRow.price_type,
          )
          .map((iPriceMap) => ({
            value: iPriceMap.value,
            label: language === 'en' ? iPriceMap.en_name : iPriceMap.name,
          }))[0],
      );
      if ('structuredServiceItem' in currentRow) {
        setServiceName(currentRow.structuredServiceItem.displayName);
        setServiceDescription(currentRow.structuredServiceItem.description);
      } else {
        setServiceName(currentRow.freeFormServiceItem.label.displayName);
        setServiceDescription(currentRow.freeFormServiceItem.label.description);
      }
      setServiceCost(currentRow?.price?.units || '');
    } else {
      clear();
    }
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const { put: EditServiceItem } = useFetch(
    `${SERVICES_ITEMS}/${setLocationId}`,
  );

  const handleEditService = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const editedItems = {
        item: currentRow?.structuredServiceItem?.serviceTypeId
          ? currentRow?.structuredServiceItem?.serviceTypeId
          : currentRow?.key,
        description: serviceDescription,
        price: serviceCost,
        price_type: servicePriceForm,
        name: serviceName !== '' ? serviceName : serviceValue.value,
        structured: !!currentRow?.structuredServiceItem?.serviceTypeId,
      };
      const editResponse = await EditServiceItem(editedItems);
      if (editResponse.success) {
        setResponseEn(editResponse?.result?.data?.response_en || []);
        setResponseJp(editResponse?.result?.data?.response_jp || []);
      }
      clear();
      closeModal();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const { post: AddService } = useFetch(SERVICES_ITEMS);
  const handleAddServiceItem = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const newItem = {
        location_id: setLocationId,
        name: serviceName !== '' ? serviceName : serviceValue.value,
        description: serviceDescription,
        price_type: servicePriceForm,
        price: serviceCost,
        structured: serviceName !== '' ? !true : true,
      };
      const resultResponse = await AddService(newItem);
      if (resultResponse.success) {
        const {
          result: {
            data: { response_en: responseEn, response_jp: responseJp },
          },
        } = resultResponse;
        setLoactionService(language === 'en' ? responseEn : responseJp);
        setServiceOption(responseEn.filter((item) => item.current === false));
      }
      setServiceItems((prevState) => [
        ...prevState,
        { ...newItem, id: Math.max(prevState.map((itm) => itm?.id)) + 1 },
      ]);
      clear();
      closeModal();
    } catch (e) {
      toast.error('No location found');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Loading loading={loading} />
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          onOpened={openHandler}
          className="service-item-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="1" />
                <CCol md={edit ? 10 : 5} className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:SERVICES.SERVICE_NAME_LABEL')}
                  </CLabel>
                </CCol>
                {!edit && (
                  <CCol md="5" className="padding-label">
                    <CLabel
                      onClick={() => {
                        setAddCustomService((prevState) => !prevState);
                        setServiceValue({
                          value: 0,
                          label: t(
                            'basic_info:SERVICES.SELECT_GOOGLE_SERVICE_TEXT',
                          ),
                        });
                        setServiceName('');
                      }}
                      className="input-label input-label--google-text"
                    >
                      {addCustomService
                        ? t('basic_info:SERVICES.ADD_GOOGLE_SERVICE_TEXT')
                        : t('basic_info:SERVICES.ADD_CUSTOM_SERVICE_TEXT')}
                    </CLabel>
                  </CCol>
                )}
                <CCol md="1" />
              </CRow>
              {!edit && !addCustomService ? (
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-left-right">
                    <div className="common-input">
                      <Select
                        closeMenuOnSelect
                        styles={customStylesOne}
                        options={
                          serviceOption.map((i) => ({
                            value: i.structuredServiceItem.serviceTypeId,
                            label: i.structuredServiceItem.displayName,
                          })) || []
                        }
                        value={serviceValue}
                        components={{ DropdownIndicator }}
                        onChange={(event) => {
                          if (event.value === 0)
                            setServiceValue({
                              value: 0,
                              label: t(
                                'basic_info:SERVICES.SELECT_GOOGLE_SERVICE_TEXT',
                              ),
                            });
                          else {
                            setServiceValue(
                              serviceOption
                                .filter(
                                  (i) =>
                                    i.structuredServiceItem.serviceTypeId ===
                                    event.value,
                                )
                                .map((i) => ({
                                  value: i.structuredServiceItem.serviceTypeId,
                                  label: i.structuredServiceItem.displayName,
                                }))[0],
                            );
                            setServiceName('');
                          }
                        }}
                      />
                    </div>
                  </CCol>
                  <CCol md="1" />
                </CRow>
              ) : (
                <></>
              )}
              {addCustomService || edit ? (
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-left-right">
                    <CInput
                      className="common-input"
                      onChange={(evt) => handleInputChange(evt, 1)}
                      value={serviceName}
                      disabled={
                        edit ? 'structuredServiceItem' in currentRow : false
                      }
                    />
                    {/* {!isNameValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                  </CCol>
                  <CCol md="1" />
                </CRow>
              ) : (
                <></>
              )}

              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:SERVICES.DESCRIPTION_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <CInput
                    className="common-input"
                    onChange={(evt) => handleInputChange(evt, 2)}
                    value={serviceDescription}
                  />
                  {/* {!isDescValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="4" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:SERVICES.PRICE_TYPE_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
                <CCol md="4" className="padding-label-custom">
                  <CLabel className="input-label-custom">
                    {t('basic_info:SERVICES.PRICE_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="5" className="padding-left-right">
                  <div className="select-price-types">
                    <Select
                      closeMenuOnSelect
                      styles={customStyles}
                      options={
                        priceTypeOptions.map((i) => ({
                          value: i.value,
                          label: language === 'en' ? i.en_name : i.name,
                        })) || []
                      }
                      value={servicePriceForm}
                      components={{ DropdownIndicator }}
                      onChange={(event) =>
                        setServicePriceForm(
                          priceTypeOptions
                            .filter((i) => i.value === event.value)
                            .map((i) => ({
                              value: i.value,
                              label: language === 'en' ? i.en_name : i.name,
                            }))[0],
                        )
                      }
                    />
                  </div>
                </CCol>
                {servicePriceForm &&
                servicePriceForm.value !== 'free' &&
                servicePriceForm.value !== 'no_price' ? (
                  <CCol md="5" className="padding-left-right-custom">
                    <CInput
                      className="common-input-custom"
                      onChange={(evt) => handleInputChange(evt, 3)}
                      value={serviceCost}
                    />
                    {/* {!isCostValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_NUMBER')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                  </CCol>
                ) : (
                  <></>
                )}
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="submit"
                    color="primary"
                    className="px-4 success-button"
                    onClick={edit ? handleEditService : handleAddServiceItem}
                    disabled={
                      !isServiceNameValid || serviceName !== ''
                        ? serviceName.length <= 0
                        : serviceValue.value === 0 ||
                          !isServiceDescValid ||
                          !isServiceCostValid ||
                          servicePriceForm === null
                    }
                  >
                    {edit
                      ? t('basic_info:SERVICES.REGISTRATION')
                      : t('basic_info:MENU.CREATE')}
                  </button>
                </CCol>
                <CCol xs="3" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="button"
                    color="primary"
                    className="px-4 cancel-button"
                    onClick={closeModal}
                  >
                    {t('basic_info:MENU.COMMON_RETURN')}
                  </button>
                </CCol>
                <CCol xs="3" />
              </CRow>
              {edit ? (
                <div className="delete-icon">
                  <DeleteIcon
                    height={15}
                    width={15}
                    onClick={(event) => handleServiceItemDelete(event)}
                  />
                </div>
              ) : (
                <></>
              )}
            </CForm>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
};

export default ServiceAddEditModal;
