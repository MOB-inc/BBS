/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {
  CDataTable,
  CPagination,
  CButton,
  CInputGroup,
  CInput,
  CInputGroupAppend,
} from '@coreui/react';
import './location_list.scss';
import CreateLocationModal from '../modals/CreateLocation';
import EditLocationModal from '../modals/EditLocation';
import { ReactComponent as SearchIcon } from '../../../commons/icons/search.svg';
import { ReactComponent as DownloadIcon } from '../../../commons/icons/download.svg';
import { ReactComponent as AddIcon } from '../../../commons/icons/add.svg';
import { ReactComponent as EditIcon } from '../../../commons/icons/edit.svg';

const userData = [
  {
    id: 0,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
  {
    id: 1,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
  {
    id: 2,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
  {
    id: 3,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
  {
    id: 4,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
  {
    id: 5,
    location: 'Mohakhali',
    address: '6,Mohakhali Dhaka',
    status: 'Contracted',
    contract_term: '2021-03-21 - 2021-04-21',
    telephone: '+8808234792834',
    service: 'Bridge',
  },
];

function LocationList() {
  const [items] = useState(userData);
  const [page, setPage] = useState(1);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const toggleCreateModal = () => {
    setCreateModal(!createModal);
  };
  const toggleEditModal = () => {
    setEditModal(!editModal);
  };
  const fields = [
    { key: 'id', label: 'Location_Id', _style: { width: '5%' } },
    { key: 'location', label: 'Location' },
    { key: 'address', label: 'Address', _style: { width: '20%' } },
    { key: 'status', label: 'Status', _style: { width: '10%' } },
    { key: 'contract_term', label: 'Contract Term', style: { width: '20%' } },
    { key: 'telephone', label: 'Telephone', _style: {} },
    { key: 'service', label: 'Service', _style: {} },
    {
      key: 'edit',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false,
    },
  ];
  return (
    <div className="location_list">
      <div className="header">
        <CInputGroup>
          <CInput />
          <CInputGroupAppend>
            <CButton shape="pill">
              <SearchIcon height={20} width={20} />
            </CButton>
          </CInputGroupAppend>
        </CInputGroup>
        <CButton shape="pill">
          <DownloadIcon height={20} width={20} />
        </CButton>
        <CButton shape="pill" onClick={toggleCreateModal}>
          <AddIcon height={20} width={20} />
        </CButton>
      </div>
      <CDataTable
        items={items}
        fields={fields}
        itemsPerPage={5}
        hover
        striped
        bordered
        responsive
        addTableClasses={['table']}
        scopedSlots={{
          edit: () => (
            <td>
              <span
                type="button"
                role="presentation"
                style={{ marginRight: 10 }}
                onClick={toggleEditModal}
              >
                <EditIcon height={20} width={20} />
              </span>
            </td>
          ),
        }}
      />
      <div className="footer">
        <CPagination
          activePage={page}
          pages={5}
          onActivePageChange={(i) => setPage(i)}
        />
      </div>
      <CreateLocationModal closeModal={toggleCreateModal} modal={createModal} />
      <EditLocationModal closeModal={toggleEditModal} modal={editModal} />
    </div>
  );
}

export default LocationList;
