/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import './menu_delete.scss';
import { SERVICES_ITEMS } from '../../../commons/constants/url';

function CommonDeleteModal({
  modal,
  closeModal,
  currentRow,
  deleteId,
  setResponseEn,
  setResponseJp,
}) {
  const { t } = useTranslation(['basic_info']);
  const getCurrentItemDetalis = (cR) => {
    if (cR.freeFormServiceItem !== undefined) {
      return { key: cR.key, structured: false };
    }
    return { key: cR?.structuredServiceItem?.serviceTypeId, structured: true };
  };
  const currentItemDetalis = getCurrentItemDetalis(currentRow);

  const deleteURL = `${SERVICES_ITEMS}/${deleteId}?item=${currentItemDetalis.key}&structured=${currentItemDetalis.structured}`;
  const { delete: DeleteService } = useFetch(deleteURL);

  const handleDeleteMenuItem = async (event) => {
    event.preventDefault();
    try {
      const deleteResponse = await DeleteService();
      if (deleteResponse.success) {
        const {
          result: {
            data: { response_en: responseEn, response_jp: responseJp },
          },
        } = deleteResponse;
        setResponseEn(responseEn);
        setResponseJp(responseJp);
        closeModal();
      }
    } catch (e) {
      toast.error(e.message || 'Something went wrong');
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
                    {t('basic_info:SERVICES.DELETE_SERVICE_TEXT')}
                    {currentRow?.freeFormServiceItem?.label?.displayName ||
                      currentRow?.structuredServiceItem?.displayName}
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
CommonDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setResponseEn: PropTypes.func.isRequired,
  setResponseJp: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentRow: PropTypes.object,
  deleteId: PropTypes.string,
};

export default CommonDeleteModal;
