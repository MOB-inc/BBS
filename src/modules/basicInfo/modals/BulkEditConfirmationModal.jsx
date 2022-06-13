import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import './bulk_confirmation_modal.scss';

function BulkEditConfirmationModal({
  closeModal,
  modal,
  locationList,
  idList,
  editFunc,
}) {
  const { t } = useTranslation(['basic_info']);
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          className="bulk-confirmation-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="2" />
                <CCol md="8" className="padding-label">
                  <div className="location-name-list">
                    {idList.map((id) => {
                      return locationList.map((item) => {
                        if (item.basic_information.id === id) {
                          return <p className="location-item">{item.name}</p>;
                        }
                        return <></>;
                      });
                    })}
                  </div>
                </CCol>
                <CCol md="2" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="delete-msg">
                    {t('basic_info:BULK_EDIT.CONFIRMATION_MESSAGE')}
                  </p>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="button"
                    color="primary"
                    className="px-4 success-button"
                    onClick={editFunc}
                  >
                    {t('basic_info:BULK_EDIT.OKAY_BUTTON')}
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
                    {t('basic_info:BULK_EDIT.NO_BUTTON')}
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
BulkEditConfirmationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  locationList: PropTypes.func.isRequired,
  idList: PropTypes.func.isRequired,
  editFunc: PropTypes.func.isRequired,
};

export default BulkEditConfirmationModal;
