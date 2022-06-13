import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CCol,
  CLabel,
  CInputRadio,
} from '@coreui/react';
import { LOCATION_FACEBOOK_PAGES } from '../../../../commons/constants/url';

import './modals.scss';

function SelectFacebookPage({ closeModal, modal, locationId }) {
  const { t } = useTranslation(['location']);
  const [facebookPages, setFacebookPages] = useState([]);
  const [facebookPage, setFacebookPage] = useState('');
  const { get: getFacebookPages } = useFetch(
    locationId ? LOCATION_FACEBOOK_PAGES(locationId) : null,
  );
  const { post: postFacebookPages, response } = useFetch(
    locationId ? LOCATION_FACEBOOK_PAGES(locationId) : null,
  );

  const openHandler = async () => {
    const getResponse = await getFacebookPages();
    setFacebookPages(getResponse?.result?.data);
  };

  const handleFacebookPage = async () => {
    await postFacebookPages({ fb_page_id: facebookPage });
    if (response.ok) {
      closeModal();
      window.location = `/locations/linkage/${locationId}`;
    }
  };

  return (
    <CModal
      onOpened={openHandler}
      show={modal}
      onClose={closeModal}
      closeOnBackdrop={false}
      className="location-modal"
    >
      <CModalHeader>
        <CModalTitle>{t('location:LINKAGE.MODAL.TITLE')}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm action="" method="post" className="form-horizontal">
          {facebookPages?.map((page) => {
            return (
              <CFormGroup row>
                <CCol xs="2">
                  <CInputRadio
                    id={page.fb_page_id}
                    name="fb_page_id"
                    value={page.fb_page_id}
                    onChange={(e) => {
                      setFacebookPage(e.target.value);
                    }}
                  />
                </CCol>
                <CCol className="label-box" xs="10" md="9">
                  <CLabel
                    className="select-facebook-label"
                    htmlFor={page.fb_page_id}
                  >
                    {page.fb_page_name}
                  </CLabel>
                </CCol>
              </CFormGroup>
            );
          })}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton className="success-button" onClick={handleFacebookPage}>
          {t('location:LINKAGE.MODAL.REGISTER')}
        </CButton>{' '}
        <CButton className="cancel-button" onClick={closeModal}>
          {t('location:LINKAGE.MODAL.CANCEL')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
SelectFacebookPage.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  locationId: PropTypes.string.isRequired,
};

export default SelectFacebookPage;
