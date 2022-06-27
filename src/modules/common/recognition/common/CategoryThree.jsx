/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CCol, CRow } from '@coreui/react';
import Select, { components } from 'react-select';
// import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import '../modals/approval/approval_post_modal.scss';
import { ReactComponent as CloudIcon } from '../../../../commons/icons/cloud-up.svg';

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
      {/* <TextField
        id="outlined-textarea"
        className="review-user custom"
        multiline
        variant="outlined"
        value={review}
        disabled
      /> */}
                {/* <textarea
                  className="review-user custom"
                  value={review}
                  disabled
                /> */}
    {active ? (
      <TextField
        className="right-content"
        value={contents || ''}
        placeholder={t('recognition:REMAND.CONTENTS')}
        onChange={(event) => onTextAreaChange(event, 'contents')}
        label={t('recognition:REMAND.CONTENTS')}
        multiline
        rows={6}
        variant="outlined"
      />
    ) : (
      <TextField
        className="right-content"
        value={contents || ''}
        placeholder={t('recognition:REMAND.CONTENTS')}
        disabled
        label={t('recognition:REMAND.CONTENTS')}
        multiline
        rows={6}
        variant="outlined"
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
          <div className="image-area"
            {...getRootProps({
              className: active ? 'photo-select-section' : 'dropzone disabled',
            })}
          >
            <input {...getInputProps()} />
            <div>
            <p className="image-msg msg-margin"><CloudIcon/> UPLOAD IMAGE
              {/* {t('basic_info:IMAGE_TAB.MSG_1')} */}
            </p>
            {/* <p className="image-msg">{t('basic_info:IMAGE_TAB.MSG_2')}</p> */}
            {/* <button type="button" className="upload-button">
              {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
            </button> */}
            </div>
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
                {/* <div className="flex">
                  <Button
                      onClick={toggleApprovalModal}
                      variant="contained"
                      className="submit button"
                      size="large"
                  >
                    {t('recognition:APPROVAL.APPROVAL_BUTTON')}
                  </Button>
                  <Button
                      onChange={(event) => onTextAreaChange(event)}
                      variant="contained"
                      className="edit button"
                      onClick={
                        active ? toggleEditConfirmModal : () => setActive(true)
                      }
                      size="large"
                  >
                    {active
                      ? t('recognition:APPROVAL.RELEASE_BUTTON')
                      : t('recognition:REMAND.EDIT_BUTTON')}
                  </Button>
                  <Button
                      onClick={active ? reload : toggleRemandModal}
                      variant="outlined"
                      className="remand button"
                      size="large"
                  >
                    {t('recognition:APPROVAL.REMAND_BUTTON')}
                  </Button>  
                </div> */}
      {/* {active ? (
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
      )} */}
      
      {/* {active ? (
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
      )} */}
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
              <Button
                type="button"
                color="primary"
                className="submit"
                onClick={toggleApprovalModal}
              >
                {t('recognition:APPROVAL.APPROVAL_BUTTON')}
              </Button>
            </CCol>
            <CCol xs="3" />
          </CRow>
        </>
      )}
      <CRow>
        <CCol xs="3" />
        <CCol xs="6">
          <Button
            type="button"
            color="primary"
            className={active
            ? "submit"
            : "edit"}
            onClick={active ? toggleEditConfirmModal : () => setActive(true)}
          >
            {active
              ? t('recognition:APPROVAL.RELEASE_BUTTON')
              : t('recognition:REMAND.EDIT_BUTTON')}
          </Button>
        </CCol>
        <CCol xs="3" />
      </CRow>
      <CRow>
        <CCol xs="3" />
        <CCol xs="6">
          <Button
            type="button"
            color="primary"
            className="remand"
            onClick={active ? reload : toggleRemandModal}
            variant="outlined"
          >
            {active
              ? t('basic_info:MENU.COMMON_RETURN')
              : t('recognition:APPROVAL.REMAND_BUTTON')}
          </Button>
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
