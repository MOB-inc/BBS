/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CCol, CRow } from '@coreui/react';
import Select, { components } from 'react-select';
import * as dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';
import { ReactComponent as CloudIcon } from '../../../../commons/icons/cloud-up.svg';
import '../modals/approval/approval_post_modal.scss';

const CustomInput = React.forwardRef((props, ref) => {
  return (
    <>
      <p className="date-choose">{props.value}</p>
      <CalendarIcon
        width={20}
        height={20}
        ref={ref}
        onClick={props.onClick}
        className="calendar-icon"
      />
    </>
  );
});

function CategoryTwo({
  active,
  title,
  contents,
  imageUrl,
  coupon,
  link,
  tou,
  imageZoom,
  startDate,
  endDate,
  startTime,
  endTime,
  timeSelect,
  changeDate,
  changeTime,
  changeImage,
  setImageZoom,
  getRootProps,
  getInputProps,
  onTextAreaChange,
  toggleApprovalModal,
  toggleRemandModal,
  toggleEditConfirmModal,
  setActive,
  reloadPost,
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
        <TextField
          className="right-event-title"
          value={title || ''}
          placeholder={t('recognition:REMAND.TITLE_2')}
          onChange={(event) => onTextAreaChange(event, 'title')}
          variant="outlined"
        />
      ) : (
        <TextField
          className="right-event-title custom"
          value={title || ''}
          placeholder={t('recognition:REMAND.TITLE_2')}
          disabled
          variant="outlined"
        />
      )}
      <div className="start-date-time">
        <div className="start-date">
          <DatePicker
            disabled={!active}
            selected={startDate ? new Date(startDate) : false}
            dateFormat="yyyy-MM-dd"
            onChange={(date) =>
              changeDate(dayjs(date).format('YYYY-MM-DD'), 'start')
            }
            customInput={<CustomInput />}
          />
        </div>
        <div className="start-time">
          <Select
            closeMenuOnSelect
            isDisabled={!active}
            options={timeSelect}
            onChange={(event) => changeTime(event, 'start')}
            value={
              startTime
                ? timeSelect[
                    timeSelect.findIndex((el) => el.value === startTime)
                  ]
                : false
            }
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
      </div>
      <div className="end-date-time">
        <div className="end-date">
          <DatePicker
            disabled={!active}
            selected={endDate ? new Date(endDate) : false}
            dateFormat="yyyy-MM-dd"
            onChange={(date) =>
              changeDate(dayjs(date).format('YYYY-MM-DD'), 'end')
            }
            customInput={<CustomInput />}
          />
        </div>
        <div className="end-time">
          <Select
            closeMenuOnSelect
            isDisabled={!active}
            options={timeSelect}
            value={
              endTime
                ? timeSelect[timeSelect.findIndex((el) => el.value === endTime)]
                : false
            }
            onChange={(event) => changeTime(event, 'end')}
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
      </div>
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
            className="photo-select-section"
            {...getRootProps({
              className: active ? 'photo-select-section' : 'dropzone disabled',
            })}
          >
            <input {...getInputProps()} />
            <p className="image-msg msg-margin"><CloudIcon/> UPLOAD IMAGE
              {/* {t('basic_info:IMAGE_TAB.MSG_1')} */}
            </p>
            {/* <p className="image-msg">{t('basic_info:IMAGE_TAB.MSG_2')}</p> */}
            {/* <button type="button" className="upload-button">
              {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
            </button> */}
          </div>
        )}
      </div>
      {active ? (
        <TextField
          className="benefits-details"
          value={contents || ''}
          placeholder={t('recognition:REMAND.CONTENTS')}
          onChange={(event) => onTextAreaChange(event, 'contents')}
          variant="outlined"
        />
      ) : (
        <TextField
          className="benefits-details custom"
          placeholder={t('recognition:REMAND.CONTENTS')}
          value={contents || ''}
          disabled
          variant="outlined"
        />
      )}
      {active ? (
        <TextField
          className="benefits-coupon"
          placeholder={t('recognition:REMAND.COUPON')}
          value={coupon || ''}
          onChange={(event) => onTextAreaChange(event, 'coupon')}
          variant="outlined"
        />
      ) : (
        <TextField
          className="benefits-coupon custom"
          placeholder={t('recognition:REMAND.COUPON')}
          value={coupon || ''}
          disabled
          variant="outlined"
        />
      )}
      {active ? (
        <TextField
          className="benefits-link"
          value={link || ''}
          placeholder={t('recognition:REMAND.LINK_TO_BENEFIT')}
          onChange={(event) => onTextAreaChange(event, 'link')}
          variant="outlined"
        />
      ) : (
        <TextField
          className="benefits-link custom"
          value={link || ''}
          placeholder={t('recognition:REMAND.LINK_TO_BENEFIT')}
          disabled
          variant="outlined"
        />
      )}
      {active ? (
        <TextField
          className="benefits-tou"
          value={tou || ''}
          placeholder={t('recognition:REMAND.TERMS')}
          onChange={(event) => onTextAreaChange(event, 'tou')}
          variant="outlined"
        />
      ) : (
        <TextField
          className="benefits-tou custom"
          value={tou || ''}
          placeholder={t('recognition:REMAND.TERMS')}
          disabled
          variant="outlined"
        />
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
                className="px-4 success-button benefits-margin"
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
          <Button
            type="button"
            color="primary"
            className={`px-4 success-button ${
              active ? 'benefits-margin-2' : 'pivot-button-margin'
            }`}
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
            className="px-4 cancel-button"
            onClick={active ? reload : toggleRemandModal}
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
CategoryTwo.propTypes = {
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  buttonList: PropTypes.arrayOf(PropTypes.number),
  buttonId: PropTypes.number.isRequired,
  buttonName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  coupon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  tou: PropTypes.string.isRequired,
  imageZoom: PropTypes.bool.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  timeSelect: PropTypes.arrayOf(PropTypes.string),
  changeDate: PropTypes.func.isRequired,
  changeTime: PropTypes.func.isRequired,
  changeImage: PropTypes.func.isRequired,
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  setImageZoom: PropTypes.func.isRequired,
  onTextAreaChange: PropTypes.func.isRequired,
  onButtonTypeChange: PropTypes.func.isRequired,
  DropdownIndicator: PropTypes.func.isRequired,
  toggleApprovalModal: PropTypes.func.isRequired,
  toggleRemandModal: PropTypes.func.isRequired,
  toggleEditConfirmModal: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  reloadPost: PropTypes.func.isRequired,
};
CategoryTwo.defaultProps = {
  buttonList: [],
  timeSelect: [],
};
CustomInput.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default CategoryTwo;
