/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import useFetch from 'use-http';
import {
  CModal,
  CModalBody,
  CForm,
  CCol,
  CInput,
  CRow,
  CLabel,
  CImg,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { MENUS } from '../../../commons/constants/url';
import MenuItemPhotoModal from './MenuItemPhotoModal';
import { ReactComponent as DeleteIcon } from '../../../commons/icons/delete.svg';
import { ReactComponent as CameraIcon } from '../../../commons/icons/camera-plus.svg';
import { ReactComponent as DeleteXIcon } from '../../../commons/icons/delete_x.svg';
import {
  isLengthValid,
  isOnlyNumber,
} from '../../../commons/helpers/validation';
import Loading from '../../../commons/components/Loading';

import './menu_item_modal.scss';

function MenuItemModal({
  closeModal,
  modal,
  categoryId,
  edit,
  menuItemList,
  addingItem,
  currentRow,
  menuId,
  openDeleteModal,
  locationId,
}) {
  const { t } = useTranslation(['basic_info']);
  const [title, setName] = useState();
  const [subtitle, setDescription] = useState();
  const [cost, setPrice] = useState();
  const [photo, setPhoto] = useState();
  const [isNameValid, setNameValid] = useState(true);
  const [isDescValid, setDescValid] = useState(true);
  const [isCostValid, setCostValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);

  const handleInputChange = (evt, type) => {
    evt.preventDefault();
    if (type === 1) {
      if (isLengthValid(evt.target.value)) {
        setNameValid(true);
        setName(evt.target.value);
      } else {
        setNameValid(false);
      }
    } else if (type === 2) {
      if (isLengthValid(evt.target.value)) {
        setDescValid(true);
        setDescription(evt.target.value);
      } else {
        setDescValid(false);
      }
    } else {
      const number = evt.target.value.replace(/,/g, '');
      if (isOnlyNumber(number) && number.length <= 8) {
        setPrice(number);
        setCostValid(true);
      } else {
        setCostValid(false);
      }
    }
  };
  const { put: editMenuItem, response: editResponse } = useFetch(
    `${MENUS}/${menuId}`,
  );
  const clear = () => {
    setName();
    setDescription();
    setPrice();
    setPhoto();
  };
  const handleEditMenuItem = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      await editMenuItem({
        menu_id: menuId,
        category_id: categoryId,
        name: title || currentRow.name,
        description: subtitle || currentRow.description,
        price: cost,
        gmb_photo_id: photo?.id || null,
      });
      if (editResponse.ok) {
        const data = menuItemList;
        const oldData = currentRow;
        const newData = {};
        newData.id = oldData.id;
        newData.name = title || oldData.name;
        newData.description = subtitle || oldData.description;
        newData.price = cost;
        newData.gmb_photo = photo;
        newData.created_at = oldData.created_at;
        newData.updated_at = oldData.updated_at;
        if (oldData) {
          data[data.indexOf(oldData)] = newData;
          addingItem(data, 2);
          clear();
          closeModal();
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const { post: addMenuItem, response } = useFetch(MENUS);
  const handleAddMenuItem = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const addResponse = await addMenuItem({
        category_id: categoryId,
        name: title,
        description: subtitle,
        price: cost,
        gmb_photo_id: photo?.id,
      });
      if (response.ok) {
        const addedData = addResponse?.result?.data;
        const totalData = menuItemList || {};
        const {
          id,
          name,
          description,
          price,
          created_at,
          updated_at,
          gmb_photo,
        } = addedData;
        const newData = {};
        newData.id = id;
        newData.name = name;
        newData.description = description;
        newData.price = price;
        newData.gmb_photo = gmb_photo;
        newData.created_at = created_at;
        newData.updated_at = updated_at;
        const finalData = [...totalData, newData];
        addingItem(finalData, 2);
        clear();
        closeModal();
      }
    } finally {
      setLoading(false);
    }
  };
  const handleMenuItemDelete = async (event) => {
    event.preventDefault();
    openDeleteModal();
    closeModal();
  };
  const togglePhotoModal = () => {
    setPhotoModal(!photoModal);
  };
  const selectPhoto = (gmbPhoto) => {
    setPhoto(gmbPhoto);
    setPhotoModal(false);
  };
  const deletePhoto = () => {
    setPhoto();
  };
  const openHandler = () => {
    if (edit) {
      setName(currentRow.name);
      setDescription(currentRow.description);
      setPrice(currentRow.price);
      setPhoto(currentRow.gmb_photo);
    } else {
      clear();
    }
  };
  return (
    <>
      <Loading loading={loading} />
      {modal ? (
        <>
          <CModal
            centered
            show
            onClose={closeModal}
            onOpened={openHandler}
            className="menu-item-modal"
          >
            <CModalBody>
              <CForm action="" method="post" className="form-horizontal">
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-label">
                    <CLabel className="input-label">
                      {t('basic_info:MENU.MENU_NAME_LABEL')}
                    </CLabel>
                  </CCol>
                  <CCol md="1" />
                </CRow>
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-left-right">
                    <CInput
                      className="common-input"
                      onChange={(evt) => handleInputChange(evt, 1)}
                      value={title}
                    />
                    {!isNameValid ? (
                      <p className="error-message">
                        {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                      </p>
                    ) : (
                      <></>
                    )}
                  </CCol>
                  <CCol md="1" />
                </CRow>
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-label">
                    <CLabel className="input-label">
                      {t('basic_info:MENU.DESCRIPTION_LABEL')}
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
                      value={subtitle}
                    />
                    {!isDescValid ? (
                      <p className="error-message">
                        {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                      </p>
                    ) : (
                      <></>
                    )}
                  </CCol>
                  <CCol md="1" />
                </CRow>
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-label">
                    <CLabel className="input-label">
                      {t('basic_info:MENU.PRICE_LABEL')}
                    </CLabel>
                  </CCol>
                  <CCol md="1" />
                </CRow>
                <CRow>
                  <CCol md="1" />
                  <CCol md="10" className="padding-left-right">
                    <CInput
                      className="common-input"
                      onChange={(evt) => handleInputChange(evt, 3)}
                      value={cost}
                    />
                    {!isCostValid ? (
                      <p className="error-message">
                        {t('basic_info:BASIC_INFO.ERROR_NUMBER')}
                      </p>
                    ) : (
                      <></>
                    )}
                  </CCol>
                  <CCol md="1" />
                </CRow>
                <CRow>
                  <CCol xs="4" />
                  <CCol xs="4">
                    {photo?.file && (
                      <>
                        <CImg
                          className="select-photo"
                          thumbnail
                          src={
                            photo?.photo_category_name === 'PROFILE'
                              ? photo?.file.path
                              : photo?.file.thumb_path
                          }
                          width={200}
                        />
                        <DeleteXIcon
                          width={20}
                          height={20}
                          className="delete-icon"
                          onClick={() => deletePhoto()}
                        />
                      </>
                    )}
                  </CCol>
                  <CCol xs="4">
                    <CameraIcon
                      className="photo-button"
                      onClick={togglePhotoModal}
                    >
                      {t('basic_info:MENU.PHOTO_SELECT')}
                    </CameraIcon>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="3" />
                  <CCol xs="6">
                    <button
                      type="submit"
                      color="primary"
                      className="px-4 success-button"
                      onClick={edit ? handleEditMenuItem : handleAddMenuItem}
                      disabled={
                        !title || !isNameValid || !isDescValid || !isCostValid
                      }
                    >
                      {edit
                        ? t('basic_info:MENU.REGISTRATION')
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
                      onClick={(event) => handleMenuItemDelete(event)}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </CForm>
            </CModalBody>
          </CModal>
          <MenuItemPhotoModal
            closeModal={togglePhotoModal}
            modal={photoModal}
            locationId={locationId}
            selectPhoto={selectPhoto}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
MenuItemModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  menuItemList: PropTypes.array.isRequired,
  addingItem: PropTypes.func.isRequired,
  currentRow: PropTypes.object,
  categoryId: PropTypes.string,
  menuId: PropTypes.string,
  openDeleteModal: PropTypes.func.isRequired,
  locationId: PropTypes.number.isRequired,
};

export default MenuItemModal;
