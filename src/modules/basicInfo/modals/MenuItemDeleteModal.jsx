/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { MENUS } from '../../../commons/constants/url';
import './menu_delete.scss';

function MenuItemDeleteModal({
  modal,
  closeModal,
  currentRow,
  menuItemList,
  menuId,
  addingItem,
}) {
  const { t } = useTranslation(['basic_info']);
  const { delete: deleteMenuItem, response: deleteResponse } = useFetch(
    `${MENUS}/${menuId}`,
  );
  const handleDeleteMenuItem = async (event) => {
    event.preventDefault();
    await deleteMenuItem({
      id: menuId,
    });
    if (deleteResponse.ok) {
      const remainingItems = menuItemList.filter((elem) => {
        return elem.id !== parseInt(menuId, 10);
      });
      addingItem(remainingItems, 2);
      closeModal();
    }
  };
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          className="menu-delete-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="2" />
                <CCol md="8" className="padding-label">
                  <p>
                    {t('basic_info:MENU.MENU_ITEM')}
                    {currentRow.name}
                  </p>
                </CCol>
                <CCol md="2" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="delete-msg">
                    {t('basic_info:MENU.DELETE_MSG')}
                  </p>
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
                    onClick={(event) => handleDeleteMenuItem(event)}
                  >
                    {t('basic_info:MENU.DELETE')}
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
            </CForm>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
}
MenuItemDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  menuItemList: PropTypes.array.isRequired,
  currentRow: PropTypes.object,
  menuId: PropTypes.string,
  addingItem: PropTypes.func.isRequired,
};

export default MenuItemDeleteModal;
