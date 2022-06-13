import React, { useState } from 'react';
import useFetch from 'use-http';
import { CModal, CModalBody, CImg, CRow } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { GMB_PHOTOS, PHOTO_BY_LOCATION } from '../../../commons/constants/url';
import Loading from '../../../commons/components/Loading';

import './menu_item_photo_modal.scss';

function MenuItemPhotoModal({ closeModal, modal, locationId, selectPhoto }) {
  const { t } = useTranslation(['basic_info']);
  const [imageList, setImageList] = useState();
  const [loading, setLoading] = useState(false);
  const { get: getPhotos } = useFetch(
    `${GMB_PHOTOS}/${locationId}${PHOTO_BY_LOCATION}?photo_category_name=undefined`,
  );
  const openHandler = async () => {
    setLoading(true);
    try {
      const resultResponse = await getPhotos();
      setImageList(resultResponse?.result?.data);
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
          onOpened={openHandler}
          className="menu-item-photo-modal"
        >
          <CModalBody>
            <CRow>{t('basic_info:MENU.PHOTO_SELECT_DESC')}</CRow>
            {imageList &&
              imageList.map((image) => {
                return (
                  <CImg
                    thumbnail
                    src={
                      image.photo_category_name === 'PROFILE'
                        ? image.file.path
                        : image.file.thumb_path
                    }
                    width={200}
                    onClick={() => selectPhoto(image)}
                  />
                );
              })}
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
}
MenuItemPhotoModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  locationId: PropTypes.number.isRequired,
  selectPhoto: PropTypes.func.isRequired,
};

export default MenuItemPhotoModal;
