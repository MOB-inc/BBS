/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
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
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isLengthValid } from '../../../commons/helpers/validation';
import { MENU_CATEGORIES } from '../../../commons/constants/url';
import { ReactComponent as DeleteIcon } from '../../../commons/icons/delete.svg';
import './menu_modal.scss';

function CreateModal({
  closeModal,
  modal,
  locationId,
  edit,
  addingCategory,
  menuCateList,
  currentRow,
  categoryId,
  openDeleteModal,
}) {
  const { t } = useTranslation(['basic_info']);
  const [cateName, setCateName] = useState();
  const [isValid, setIsValid] = useState(true);
  const handleInputChange = (evt) => {
    evt.preventDefault();
    if (isLengthValid(evt.target.value)) {
      setIsValid(true);
      setCateName(evt.target.value);
    } else {
      setIsValid(false);
    }
  };
  const { put: editMenuCategory, response: editResponse } = useFetch(
    `${MENU_CATEGORIES}/${categoryId}`,
  );
  const clear = () => {
    setCateName();
  };
  const handleEditMenuCat = async (event) => {
    event.preventDefault();
    await editMenuCategory({
      category_id: categoryId,
      name: cateName || currentRow.name,
      location_id: locationId,
    });
    if (editResponse.ok) {
      // editing the menu category name
      const data = menuCateList;
      const oldData = currentRow;
      const newData = {};
      newData.id = oldData?.id;
      newData.name = cateName || oldData?.name;
      newData.created_at = oldData?.created_at;
      newData.updated_at = oldData?.updated_at;
      if (oldData) {
        data[data.indexOf(oldData)] = newData;
        addingCategory(data, 1);
        clear();
        closeModal();
      }
    }
  };
  const { post: addMenuCategory, response } = useFetch(MENU_CATEGORIES);
  const handleAddMenuCat = async (event) => {
    event.preventDefault();
    await addMenuCategory({
      name: cateName,
      location_id: locationId,
    });
    if (response.ok) {
      // appending newly added data to the category list
      const totalData = menuCateList || {};
      const { result } = response.data;
      const { id, name, created_at, updated_at } = result;
      const newData = {};
      newData.id = id;
      newData.name = name;
      newData.created_at = created_at;
      newData.updated_at = updated_at;
      const finalData = [...totalData, newData];
      addingCategory(finalData, 1);
      clear();
      closeModal();
    }
  };
  const handleMenuDelete = async (event) => {
    event.preventDefault();
    openDeleteModal();
    closeModal();
  };
  const OpenHandler = () => {
    if (edit) {
      setCateName(currentRow.name);
    } else {
      clear();
    }
  };
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          onOpened={OpenHandler}
          className="menu-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:MENU.COMMON_MODAL_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <CInput
                    className="category-field"
                    onChange={(evt) => handleInputChange(evt)}
                    value={cateName}
                  />
                  {!isValid ? (
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
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="submit"
                    color="primary"
                    className="px-4 success-button"
                    onClick={edit ? handleEditMenuCat : handleAddMenuCat}
                    disabled={!cateName || !isValid}
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
                    onClick={(event) => handleMenuDelete(event)}
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
}
CreateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  locationId: PropTypes.string.isRequired,
  addingCategory: PropTypes.func.isRequired,
  menuCateList: PropTypes.array.isRequired,
  currentRow: PropTypes.object,
  categoryId: PropTypes.string,
  openDeleteModal: PropTypes.string.isRequired,
};

export default CreateModal;
