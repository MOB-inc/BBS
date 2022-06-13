/* eslint-disable no-undef */
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm } from '@coreui/react';
import useFetch from 'use-http';
import Loading from '../../../commons/components/Loading';
import { csvSizeValidation } from '../../../commons/helpers/validation';
import { MENUS_CSV_UPLOAD } from '../../../commons/constants/url';
import './csv-upload-select-file.scss';

function CsvUploadSelectFile({
  modal,
  closeModal,
  locations,
  callbackComplete,
}) {
  const { t } = useTranslation(['basic_info']);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState([]);
  const [csvValidation, setCsvValidation] = useState(false);
  const { post: uploadCsv, response } = useFetch(MENUS_CSV_UPLOAD);
  const onDrop = useCallback((acceptedFiles) => {
    setCsvFile([...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: '.csv',
  });
  const files =
    csvFile &&
    csvFile.map((file) => (
      <>
        <p key={file.path}>
          {file.path} - {Math.floor((file.size / 1024) * 10) / 10} KB
        </p>
      </>
    ));
  useEffect(() => {
    if (csvFile.length >= 1) {
      if (csvSizeValidation(csvFile[0].size)) {
        setCsvValidation(false);
      } else {
        setCsvValidation(true);
      }
    }
  }, [files]);
  const handleUploadCsv = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('locations', locations);
      data.append('file', csvFile[0]);
      await uploadCsv(data);
      if (response.ok) {
        setCsvFile([]);
        closeModal();
        callbackComplete();
      }
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setCsvValidation(false);
    setCsvFile([]);
    setCsvValidation(false);
    closeModal();
  };

  return (
    <>
      <Loading loading={loading} />
      {modal ? (
        <CModal
          centered
          show
          onClosed={clear}
          onClose={closeModal}
          className="csv-upload-select-file"
          closeOnBackdrop={false}
        >
          <CModalBody className="upload-body">
            <CForm action="" method="post" className="form-horizontal">
              <div className="display-portion" {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="csv-msg msg-margin">
                  {t('basic_info:MENU.CSV_UPLOAD.MSG_1')}
                </p>
                <p className="csv-msg">
                  {t('basic_info:MENU.CSV_UPLOAD.MSG_2')}
                </p>
                <button type="button" className="upload-button" onClick={open}>
                  {t('basic_info:MENU.CSV_UPLOAD.SELECT_FILE_BUTTON')}
                </button>
                <div className="validation-msg">
                  {csvValidation && (
                    <div className="common">
                      {t('basic_info:MENU.CSV_UPLOAD.VALIDATION_INFO_1')}
                    </div>
                  )}
                </div>
                <div>{files}</div>
              </div>
              <div className="button-portion">
                {csvFile.length !== 0 && !csvValidation && (
                  <button
                    type="button"
                    color="primary"
                    className="px-4 success-button"
                    onClick={handleUploadCsv}
                  >
                    {t('basic_info:MENU.UPLOAD')}
                  </button>
                )}
                <button
                  type="button"
                  color="primary"
                  className="px-4 cancel-button"
                  onClick={clear}
                >
                  {t('basic_info:MENU.COMMON_RETURN')}
                </button>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
}
CsvUploadSelectFile.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  locations: PropTypes.arrayOf(PropTypes.number).isRequired,
  callbackComplete: PropTypes.func.isRequired,
};

export default CsvUploadSelectFile;
