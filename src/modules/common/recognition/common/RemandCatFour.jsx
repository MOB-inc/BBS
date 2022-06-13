/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CCol, CRow } from '@coreui/react';
import Select, { components } from 'react-select';
import * as dayjs from 'dayjs';
import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';
import '../modals/remand_post_modal.scss';

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

function RemandCatFour({
  active,
  title,
  contents,
  buttonList,
  buttonId,
  buttonName,
  imageUrl,
  startDate,
  endDate,
  startTime,
  endTime,
  timeSelect,
  changeDate,
  changeTime,
  changeImage,
  getRootProps,
  getInputProps,
  onTextAreaChange,
  onButtonTypeChange,
  toggleRemandDeleteModal,
  toggleRemandEditModal,
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
          className="right-event-title"
          value={title || ''}
          placeholder={t('recognition:REMAND.EVENT_TITLE')}
          onChange={(event) => onTextAreaChange(event, 'title')}
        />
      ) : (
        <textarea
          className="right-event-title custom"
          value={title || ''}
          placeholder={t('recognition:REMAND.EVENT_TITLE')}
          disabled
        />
      )}
      {active ? (
        <textarea
          className="right-event-description"
          value={contents || ''}
          placeholder={t('recognition:REMAND.EVENT_DETAILS')}
          onChange={(event) => onTextAreaChange(event, 'contents')}
        />
      ) : (
        <textarea
          className="right-event-description custom"
          value={contents || ''}
          placeholder={t('recognition:REMAND.EVENT_DETAILS')}
          disabled
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
              startTime
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
          <div className="image-side">
            <img src={imageUrl} alt="preview-image" className="preview-image" />
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
      <CRow>
        <CCol xs="12">
          <button
            type="button"
            color="primary"
            className="px-4 success-button"
            onClick={active ? toggleRemandEditModal : () => setActive(true)}
          >
            {active
              ? t('recognition:REMAND.APPLICATION')
              : t('recognition:REMAND.EDIT_BUTTON')}
          </button>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12">
          <button
            type="button"
            color="primary"
            className="px-4 cancel-button"
            onClick={active ? reload : toggleRemandDeleteModal}
          >
            {active
              ? t('basic_info:MENU.COMMON_RETURN')
              : t('recognition:REMAND.DELETE_BUTTON')}
          </button>
        </CCol>
      </CRow>
    </>
  );
}
RemandCatFour.propTypes = {
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  buttonList: PropTypes.arrayOf(PropTypes.number),
  buttonId: PropTypes.number.isRequired,
  buttonName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
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
  onTextAreaChange: PropTypes.func.isRequired,
  onButtonTypeChange: PropTypes.func.isRequired,
  toggleRemandDeleteModal: PropTypes.func.isRequired,
  toggleRemandEditModal: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  reloadPost: PropTypes.func.isRequired,
  buttonLink: PropTypes.string.isRequired,
};
RemandCatFour.defaultProps = {
  buttonList: [],
  timeSelect: [],
};
CustomInput.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default RemandCatFour;
