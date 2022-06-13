/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm } from '@coreui/react';
import './image_upload.scss';
import { toast } from 'react-toastify';

function ImageUploadModal({
  modal,
  closeModal,
  imageFileCallback,
  OpenCategoryModal,
}) {
  const { t } = useTranslation(['basic_info']);
  const [imageFile, setImageFile] = useState([]);
  const [imageWidth, setImageWidth] = useState();
  const [imageHeight, setImageHeight] = useState();
  const [imageSize, setImageSize] = useState();
  const onDrop = useCallback((acceptedFiles) => {
    try {
      setImageFile([...imageFile, ...acceptedFiles]);
      setImageSize(acceptedFiles[0]?.size);
      const img = new Image();
      img.src = window.URL.createObjectURL(acceptedFiles[0]);
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
    } catch (e) {
      toast.error(t('basic_info:IMAGE_TAB.MAX_ITEM_COUNT'));
    }
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 10,
    accept: 'image/jpeg, image/png, image/jpg',
  });
  const files =
    imageFile &&
    imageFile.map((file) => (
      <>
        <p key={file.path}>
          {file.path} - {file.size} bytes
        </p>
        <p>
          幅: {imageWidth}px - 高さ: {imageHeight}px
        </p>
      </>
    ));
  const onClickTransition = () => {
    if (imageFile) {
      imageFileCallback(imageFile, imageWidth, imageHeight, imageSize);
      closeModal();
      OpenCategoryModal();
      setImageFile([]);
    }
  };

  const clear = () => {
    closeModal();
    if (files.length > 0) {
      setImageFile([]);
    }
  };
  return (
    <>
      {modal ? (
        <CModal
          centered
          show
          onClosed={clear}
          onClose={closeModal}
          className="image-upload-modal"
        >
          <CModalBody className="upload-body">
            <CForm action="" method="post" className="form-horizontal">
              <div className="photo-display-portion" {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="image-msg msg-margin">
                  {t('basic_info:IMAGE_TAB.MSG_1')}
                </p>
                <p className="image-msg">{t('basic_info:IMAGE_TAB.MSG_2')}</p>
                <button type="button" className="upload-button" onClick={open}>
                  {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
                </button>
                {imageFile.length > 0 ? (
                  <></>
                ) : (
                  <div className="validation-msg">
                    <div className="common">
                      {t('basic_info:IMAGE_TAB.VALIDATION_INFO_1')}
                    </div>
                    <div className="common">
                      {t('basic_info:IMAGE_TAB.VALIDATION_INFO_2')}
                    </div>
                    <div className="common">
                      {t('basic_info:IMAGE_TAB.VALIDATION_INFO_3')}
                    </div>
                    <div className="common">
                      {t('basic_info:IMAGE_TAB.VALIDATION_INFO_4')}
                    </div>
                  </div>
                )}
                <div>{files}</div>
              </div>
              <div className="image-msg-2">
                {t('basic_info:IMAGE_TAB.MSG_3')}
              </div>
              <div className="button-portion">
                <button
                  type="button"
                  color="primary"
                  className="px-4 success-button"
                  onClick={onClickTransition}
                  disabled={imageFile.length === 0}
                >
                  {t('basic_info:IMAGE_TAB.CATEGORY_SELECTION_BUTTON')}
                </button>
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
ImageUploadModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  imageFileCallback: PropTypes.func.isRequired,
  OpenCategoryModal: PropTypes.func.isRequired,
};

export default ImageUploadModal;
