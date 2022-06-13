/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import useFetch from 'use-http';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CForm } from '@coreui/react';
import { GMB_PHOTOS } from '../../../commons/constants/url';
import Loading from '../../../commons/components/Loading';
import {
  profileImageValidation,
  coverImageValidation,
  commonImageValidation,
} from '../../../commons/helpers/validation';
import './image_upload.scss';

function ImageCategoryModal({
  modal,
  closeModal,
  categoryList,
  imageFile,
  locationId,
  imageList,
  addingImage,
  imageWidth,
  imageHeight,
  imageSize,
}) {
  const { t } = useTranslation(['basic_info']);
  const [selectedCategory, setSelectedCategory] = useState();
  const [gmbName, setGMBName] = useState();
  const [disableButton, setDisableButton] = useState(false);
  const [profileValidation, setProfileValidation] = useState(false);
  const [coverValidation, setCoverValidation] = useState(false);
  const [commonImgValidation, setCommonImgValidation] = useState(false);
  const { post: uploadImage, response } = useFetch(GMB_PHOTOS);
  const [loading, setLoading] = useState(false);
  const setOnSelectLocation = (key, name) => {
    setProfileValidation(false);
    setCoverValidation(false);
    setCommonImgValidation(false);
    if (name === 'PROFILE') {
      if (profileImageValidation(imageWidth, imageHeight, imageSize)) {
        setSelectedCategory(key);
        setGMBName(name);
      } else {
        setProfileValidation(true);
      }
    } else if (name === 'COVER') {
      if (coverImageValidation(imageWidth, imageHeight)) {
        setSelectedCategory(key);
        setGMBName(name);
      } else {
        setCoverValidation(true);
      }
    } else {
      if (commonImageValidation(imageWidth, imageHeight)) {
        setSelectedCategory(key);
        setGMBName(name);
      } else {
        setCommonImgValidation(true);
      }
    }
  };
  const handleUploadPhoto = async () => {
    setLoading(true);
    try {
      setDisableButton(true);
      const data = new FormData();
      data.append('location_id', locationId);
      data.append('photo_category_name', gmbName);
      Array.from(imageFile).forEach((file) => {
        data.append('file[]', file);
      });
      const responseResult = await uploadImage(data);
      if (response.ok) {
        const {
          result: { data: uploadedImages },
        } = responseResult;

        const totalList = imageList || [];
        const newImages =
          uploadedImages
            .sort((a, b) => b.id - a.id)
            .map((image) => {
              const {
                created_at,
                file,
                id,
                location,
                photo_category_name,
                total_view,
                updated_at,
              } = image;
              return {
                created_at,
                file,
                id,
                location,
                photo_category_name,
                total_view: total_view || 0,
                updated_at,
              };
            }) || [];
        const finalData = [...newImages, ...totalList];

        addingImage(finalData);
        closeModal();
      }
    } finally {
      setLoading(false);
      setDisableButton(false);
    }
  };
  const clear = () => {
    setProfileValidation(false);
    setCoverValidation(false);
    setCommonImgValidation(false);
    setGMBName();
    setSelectedCategory();
    closeModal();
  };
  return (
    <>
      <Loading loading={loading} />
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          className="image-upload-modal"
        >
          <CModalBody className="upload-body">
            <CForm action="" method="post" className="form-horizontal">
              <div className="image-category-list">
                {categoryList &&
                  categoryList.map((item) => {
                    return (
                      <div
                        className={`item-name ${
                          selectedCategory === item.id ? 'active-item' : ''
                        }`}
                        onClick={() =>
                          setOnSelectLocation(
                            item.id,
                            item.gmb_photo_category_name,
                          )
                        }
                        role="presentation"
                      >
                        {item.jp_name}
                      </div>
                    );
                  })}
                {profileValidation ? (
                  <div className="image-validation">
                    {t('basic_info:IMAGE_TAB.VALIDATION_INFO_2')}
                  </div>
                ) : coverValidation ? (
                  <div className="image-validation">
                    {t('basic_info:IMAGE_TAB.VALIDATION_INFO_4')}
                  </div>
                ) : commonImgValidation ? (
                  <div className="image-validation">
                    {t('basic_info:IMAGE_TAB.VALIDATION_INFO_3')}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="button-portion">
                <button
                  type="button"
                  color="primary"
                  className="px-4 success-button button-margin-top"
                  onClick={handleUploadPhoto}
                  disabled={
                    disableButton ||
                    profileValidation ||
                    coverValidation ||
                    commonImgValidation
                  }
                >
                  {t('basic_info:IMAGE_TAB.CHOICE_BUTTON')}
                </button>
                <button
                  type="button"
                  color="primary"
                  className="px-4 cancel-button button-margin-top"
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
ImageCategoryModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  categoryList: PropTypes.bool.isRequired,
  locationId: PropTypes.number.isRequired,
  imageList: PropTypes.array.isRequired,
  addingImage: PropTypes.func.isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
};

export default ImageCategoryModal;
