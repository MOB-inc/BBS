/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CCol, CRow } from '@coreui/react';
import Select, { components } from 'react-select';
import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import '../modals/approval/approval_post_modal.scss';

function CategoryThree({
  active,
  contents,
  buttonList,
  buttonId,
  buttonName,
  imageUrl,
  imageZoom,
  changeImage,
  setImageZoom,
  getRootProps,
  getInputProps,
  onTextAreaChange,
  onButtonTypeChange,
  toggleApprovalModal,
  toggleRemandModal,
  toggleEditConfirmModal,
  setActive,
  reloadPost,
  buttonLink,
}) {
  const { t } = useTranslation(['basic_info, recognition']);
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  const reload = () => {
    setActive(false);
    reloadPost();
  };
  return (
    <>
      {active ? (
        <textarea
          className="right-content"
          value={contents || ''}
          placeholder={t('recognition:REMAND.CONTENTS')}
          onChange={(event) => onTextAreaChange(event, 'contents')}
        />
      ) : (
        <textarea
          className="right-content custom"
          value={contents || ''}
          placeholder={t('recognition:REMAND.CONTENTS')}
          disabled
        />
      )}
      <div className="right-image">
        {imageUrl ? (
          <div className={imageZoom ? 'zoom-image-side' : 'image-side'}>
            <img
              src={imageUrl}
              alt="preview-image"
              className="preview-image"
              onClick={() => setImageZoom(!imageZoom)}
              role="presentation"
            />
            {active ? (
              <DeleteIcon
                width={10}
                height={10}
                className="delete-icon"
                onClick={changeImage}
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div
            {...getRootProps({
              className: active ? 'photo-select-section' : 'dropzone disabled',
            })}
          >
            <input {...getInputProps()} />
            <p className="image-msg msg-margin">
              {t('basic_info:IMAGE_TAB.MSG_1')}
            </p>
            <p className="image-msg">{t('basic_info:IMAGE_TAB.MSG_2')}</p>
            <button type="button" className="upload-button">
              {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
            </button>
          </div>
        )}
      </div>
      {active ? (
        <div className="right-dropdown">
          <Select
            closeMenuOnSelect
            options={buttonList}
            value={buttonId ? buttonList[buttonId] : buttonList[0]}
            onChange={(event) => onButtonTypeChange(event)}
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
      ) : (
        <div className="right-dropdown">
          <div className="pill-dropdown">
            <div className="dropdown-content">
              {buttonName || t('recognition:APPROVAL.NONE')}
            </div>
          </div>
        </div>
      )}
      {active &&
      buttonId &&
      buttonList.find((link) => {
        return link.label === '今すぐ電話';
      })?.value !== buttonId ? (
        <textarea
          className="right-button-link"
          value={buttonLink || ''}
          onChange={(event) => onTextAreaChange(event, 'buttonlink')}
        />
      ) : !active &&
        buttonId &&
        buttonList.find((link) => {
          return link.label === '今すぐ電話';
        })?.value !== buttonId ? (
        <textarea
          className="right-button-link custom"
          value={buttonLink || ''}
          disabled
        />
      ) : (
        <></>
      )}
      {active ? (
        <></>
      ) : (
        <>
          <CRow>
            <CCol xs="3" />
            <CCol xs="6">
              <button
                type="button"
                color="primary"
                className="px-4 success-button latest"
                onClick={toggleApprovalModal}
              >
                {t('recognition:APPROVAL.APPROVAL_BUTTON')}
              </button>
            </CCol>
            <CCol xs="3" />
          </CRow>
        </>
      )}
      <CRow>
        <CCol xs="3" />
        <CCol xs="6">
          <button
            type="button"
            color="primary"
            className={`px-4 success-button ${
              active ? 'latest-2' : 'pivot-button-margin'
            }`}
            onClick={active ? toggleEditConfirmModal : () => setActive(true)}
          >
            {active
              ? t('recognition:APPROVAL.RELEASE_BUTTON')
              : t('recognition:REMAND.EDIT_BUTTON')}
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
            onClick={active ? reload : toggleRemandModal}
          >
            {active
              ? t('basic_info:MENU.COMMON_RETURN')
              : t('recognition:APPROVAL.REMAND_BUTTON')}
          </button>
        </CCol>
        <CCol xs="3" />
      </CRow>
    </>
  );
}
CategoryThree.propTypes = {
  active: PropTypes.bool.isRequired,
  contents: PropTypes.string.isRequired,
  buttonList: PropTypes.arrayOf(PropTypes.number),
  buttonId: PropTypes.number.isRequired,
  buttonName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageZoom: PropTypes.bool.isRequired,
  changeImage: PropTypes.func.isRequired,
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  setImageZoom: PropTypes.func.isRequired,
  onTextAreaChange: PropTypes.func.isRequired,
  onButtonTypeChange: PropTypes.func.isRequired,
  toggleApprovalModal: PropTypes.func.isRequired,
  toggleRemandModal: PropTypes.func.isRequired,
  toggleEditConfirmModal: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  reloadPost: PropTypes.func.isRequired,
  buttonLink: PropTypes.string.isRequired,
};
CategoryThree.defaultProps = {
  buttonList: [],
};

export default CategoryThree;
