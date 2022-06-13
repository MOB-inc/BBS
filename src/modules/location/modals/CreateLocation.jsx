import React from 'react';
import PropTypes from 'prop-types';
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
  CInput,
  CSelect,
} from '@coreui/react';
import './modals.scss';

function CreateLocation({ closeModal, modal }) {
  return (
    <CModal show={modal} onClose={closeModal} className="location-modal">
      <CModalHeader>
        <CModalTitle>Create New Location</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          action=""
          method="post"
          // encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup row>
            <CCol md="3">
              <CLabel>Location ID</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <p className="form-control-static">1</p>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="text-input">Location</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="text-input" placeholder="Text" />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="text-input" />
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="text-input" placeholder="Text" />
            </CCol>
            <CCol md="3">
              <CLabel htmlFor="text-input">Address</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="text-input" placeholder="Text" />
            </CCol>
            <CCol md="3">
              <CLabel htmlFor="text-input" />
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="text-input" placeholder="Text" />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="select">Status</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CSelect custom name="select">
                <option value="0">Please select</option>
                <option value="1">Contract</option>
                <option value="2">Cancel</option>
              </CSelect>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="text-input">Contract</CLabel>
            </CCol>
            <CCol sm="3">
              <CSelect custom name="select">
                <option value="0">2021</option>
                <option value="1">2020</option>
                <option value="2">2019</option>
                <option value="3">2018</option>
              </CSelect>
            </CCol>
            <CCol sm="3">
              <CInput placeholder="04" />
            </CCol>
            <CCol sm="3">
              <CInput placeholder="15" />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="select">Service</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CSelect custom name="select">
                <option value="0">Please select</option>
                <option value="1">Bridge</option>
                <option value="2">Book</option>
                <option value="3">BridgeBook</option>
              </CSelect>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="text-input">Tel</CLabel>
            </CCol>
            <CCol sm="3">
              <CInput placeholder="090" />
            </CCol>
            <CCol sm="3">
              <CInput placeholder="1234" />
            </CCol>
            <CCol sm="3">
              <CInput placeholder="5678" />
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary">Register</CButton>{' '}
        <CButton color="secondary" onClick={closeModal}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
CreateLocation.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default CreateLocation;
