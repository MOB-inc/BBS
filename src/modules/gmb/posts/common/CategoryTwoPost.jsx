/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import * as dayjs from 'dayjs';

import Select, { components } from 'react-select';
import { timeSelect } from '../../../../commons/constants/lists';

import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';

import 'react-datepicker/dist/react-datepicker.css';
import './categoryPostModals.scss';

const CustomInput = React.forwardRef((props, ref) => {
  return (
    <>
      <p className="date-choose">{props?.value}</p>
      <CalendarIcon
        width={20}
        height={20}
        ref={ref}
        onClick={props?.onClick}
        className="calendar-icon"
      />
    </>
  );
});
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <ArrowDown />
    </components.DropdownIndicator>
  );
};

function CategoryTwo({
  data,
  editable,
  schedule,
  onSubmit,
  onReturn,
  onDelete,
  onDataChange: setData,
  setEditable,
}) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  const deleteImage = () => {
    setData({ image: undefined, file: undefined, is_file_deleted: 1 });
  };
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setData({
        is_file_deleted: 0,
        file: acceptedFiles[0],
        image: URL.createObjectURL(acceptedFiles[0]),
      });
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: !editable,
  });

  return (
    <>
      <textarea
        className="right-event-title"
        value={data?.title || ''}
        disabled={!editable}
        placeholder={t('recognition:REMAND.TITLE_2')}
        onChange={(event) => setData({ title: event.target.value })}
      />
      <div className="start-date-time">
        <div className="start-date">
          <DatePicker
            disabled={!editable}
            selected={data?.start_date ? new Date(data?.start_date) : false}
            dateFormat="yyyy-MM-dd"
            onChange={(date) =>
              setData({ start_date: dayjs(date).format('YYYY-MM-DD') })
            }
            customInput={<CustomInput />}
          />
        </div>
        <div className="start-time">
          <Select
            isDisabled={!editable}
            closeMenuOnSelect
            options={timeSelect}
            onChange={(event) => setData({ start_time: event?.value })}
            value={
              data?.start_time &&
              timeSelect[
                timeSelect.findIndex((el) => el.value === data?.start_time)
              ]
            }
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
      </div>
      <div className="end-date-time">
        <div className="end-date">
          <DatePicker
            disabled={!editable}
            selected={data?.end_date ? new Date(data?.end_date) : false}
            dateFormat="yyyy-MM-dd"
            onChange={(date) =>
              setData({ end_date: dayjs(date).format('YYYY-MM-DD') })
            }
            customInput={<CustomInput />}
          />
        </div>
        <div className="end-time">
          <Select
            isDisabled={!editable}
            closeMenuOnSelect
            options={timeSelect}
            value={
              data?.end_time
                ? timeSelect[
                    timeSelect.findIndex((el) => el.value === data?.end_time)
                  ]
                : false
            }
            onChange={(event) => setData({ end_time: event?.value })}
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        </div>
      </div>
      <div className="right-image">
        {data?.image ? (
          <div className="image-side">
            <img
              src={data?.image}
              alt="preview-image"
              className="preview-image"
              role="presentation"
            />
            {editable && (
              <DeleteIcon
                width={10}
                height={10}
                className="delete-icon"
                onClick={deleteImage}
              />
            )}
          </div>
        ) : (
          <div
            className="photo-select-section"
            {...getRootProps({
              className: 'photo-select-section',
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
      <textarea
        className="benefits-details"
        value={data?.contents || ''}
        disabled={!editable}
        placeholder={t('recognition:REMAND.CONTENTS')}
        onChange={(event) => setData({ contents: event.target.value })}
      />
      <textarea
        disabled={!editable}
        className="benefits-coupon"
        placeholder={t('recognition:REMAND.COUPON')}
        value={data?.coupon_code || ''}
        onChange={(event) => setData({ coupon_code: event.target.value })}
      />
      <textarea
        disabled={!editable}
        className="benefits-link"
        value={data?.link_to_benefit || ''}
        placeholder={t('recognition:REMAND.LINK_TO_BENEFIT')}
        onChange={(event) => setData({ link_to_benefit: event.target.value })}
      />
      <textarea
        disabled={!editable}
        className="benefits-tou"
        value={data?.terms_of_use || ''}
        placeholder={t('recognition:REMAND.TERMS')}
        onChange={(event) => setData({ terms_of_use: event.target.value })}
      />
      {schedule && (
        <div className="schedule-checkbox">
          <input
            type="checkbox"
            checked={data?.is_schedule_post}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) =>
              setData({ is_schedule_post: event.target.checked })
            }
          />
          &nbsp; &nbsp; 投稿日時指定
        </div>
      )}
      {data?.is_schedule_post && (
        <div className="start-date-time">
          <div className="start-date">
            <DatePicker
              disabled={!editable}
              selected={data?.post_date ? new Date(data?.post_date) : false}
              dateFormat="yyyy-MM-dd"
              onChange={(date) =>
                setData({ post_date: dayjs(date).format('YYYY-MM-DD') })
              }
              customInput={<CustomInput />}
            />
          </div>
          <div className="start-time">
            <Select
              isDisabled={!editable}
              closeMenuOnSelect
              options={timeSelect}
              onChange={(event) => setData({ post_time: event?.value })}
              value={
                data?.post_time
                  ? timeSelect[
                      timeSelect.findIndex((el) => el.value === data?.post_time)
                    ]
                  : false
              }
              components={{ DropdownIndicator }}
              className="dropdown-wrapper"
            />
          </div>
        </div>
      )}
      {data.is_user_authorized && (
        <div className="footer">
          {editable ? (
            <>
              <button
                type="button"
                color="primary"
                className={`px-4 success-button ${'latest-2'}`}
                onClick={onSubmit}
              >
                {t('recognition:APPROVAL.RELEASE_BUTTON')}
              </button>
              <button
                type="button"
                color="primary"
                className="px-4 cancel-button"
                onClick={onReturn}
              >
                {t('basic_info:MENU.COMMON_RETURN')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                color="primary"
                className="px-4 success-button"
                onClick={setEditable}
              >
                {t('recognition:REMAND.EDIT_BUTTON')}
              </button>
              <button
                type="button"
                color="primary"
                className="px-4 cancel-button"
                onClick={onDelete}
              >
                {t('recognition:REMAND.DELETE_BUTTON')}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
CategoryTwo.propTypes = {
  data: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  schedule: PropTypes.bool.isRequired,
  onReturn: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  setEditable: PropTypes.func.isRequired,
};
CustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
};
CustomInput.defaultProps = {
  onClick: () => {},
  value: undefined,
};

export default CategoryTwo;
