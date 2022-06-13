/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { CModal, CModalBody } from '@coreui/react';

import './csv-upload-complete.scss';

function CsvUploadSelectFile({ modal }) {
  const { t } = useTranslation(['basic_info']);
  const dispMenuTop = () => {
    // アップロードした情報の再読み込みをさせるためメニュートップをリロードさせる。
    window.location = '/basic-info/menu';
  };
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          className="csv-upload-complete"
          closeOnBackdrop={false}
        >
          <CModalBody className="upload-body">
            <div className="text-portion">{t('basic_info:MENU.COMPLETE')}</div>
            <div className="button-portion">
              <button
                type="button"
                color="primary"
                className="px-4 cancel-button"
                onClick={dispMenuTop}
              >
                {t('basic_info:MENU.COMMON_RETURN')}
              </button>
            </div>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
}
CsvUploadSelectFile.propTypes = {
  modal: PropTypes.bool.isRequired,
};

export default CsvUploadSelectFile;
