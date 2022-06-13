import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import saveAs from 'file-saver';
import dateFormat from 'dateformat';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm, CCol, CRow } from '@coreui/react';
import { MENUS_CSV_DOWNLOAD } from '../../../commons/constants/url';
import Loading from '../../../commons/components/Loading';
import './csv-download.scss';

function CsvDownloadConfirm({ modal, closeModal, locationId }) {
  const { t } = useTranslation(['basic_info']);
  const [loading, setLoading] = useState(false);
  const handleCsvDownload = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const res = await axios.get(MENUS_CSV_DOWNLOAD(locationId), {
        responseType: 'blob',
      });
      if (res.status === 200) {
        const mineType = res.headers['content-type'];
        const name = `${dateFormat(new Date(), 'yyyymmddHHMMss')}-download.csv`;
        const blob = new Blob([res.data], { type: mineType });
        saveAs(blob, name);
        closeModal();
      } else {
        toast.error('downloadに失敗しました');
      }
    } catch (e) {
      toast.error('downloadに失敗しました');
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
          className="csv-download-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="2" />
                <CCol md="8" className="padding-label" />
                <CCol md="2" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <p className="download-msg">
                    {t('basic_info:MENU.DOWNLOAD_MSG')}
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
                    onClick={(event) => handleCsvDownload(event)}
                  >
                    {t('basic_info:MENU.DOWNLOAD')}
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
CsvDownloadConfirm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  locationId: PropTypes.number.isRequired,
};

export default CsvDownloadConfirm;
