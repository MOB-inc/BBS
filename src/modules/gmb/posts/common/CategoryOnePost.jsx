/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { components } from 'react-select';
import * as dayjs from 'dayjs';
import { timeSelect } from '../../../../commons/constants/lists';

import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';

import './categoryPostModals.scss';

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

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <ArrowDown />
    </components.DropdownIndicator>
  );
};

function CategoryOne({
  data,
  editable,
  schedule,
  buttonList,
  onDataChange: setData,
  onSubmit: submit,
  onReturn,
  onDelete,
  setEditable,
}) {
  const { t } = useTranslation(['basic_info', 'recognition']);
  return (
    <>
      <div className="covid-msg">{t('recognition:REMAND.COVID_MSG')}</div>

      <textarea
        disabled={!editable}
        className="covid-right-content"
        value={data?.contents}
        placeholder={t('recognition:REMAND.COVID_CONTENT')}
        onChange={(event) => setData({ contents: event.target.value })}
      />

      <div className="right-dropdown">
        {editable ? (
          <Select
            closeMenuOnSelect
            isDisabled={!editable}
            options={buttonList}
            value={buttonList[data?.gmb_post_button_type_id]}
            onChange={(selected) =>
              setData({
                gmb_post_button_type_id: selected.value,
                button_link: null,
              })
            }
            components={{ DropdownIndicator }}
            className="dropdown-wrapper"
          />
        ) : (
          <div className="pill-dropdown">
            <div className="dropdown-content">
              {buttonList[data?.gmb_post_button_type_id]?.label ||
                t('recognition:APPROVAL.NONE')}
            </div>
          </div>
        )}
      </div>
      {!!data?.gmb_post_button_type_id &&
        buttonList.find((link) => {
          return link.label === '今すぐ電話';
        })?.value !== data?.gmb_post_button_type_id && (
          <textarea
            disabled={!editable}
            className="right-event-title"
            value={data?.button_link || ''}
            placeholder="http(s)://..."
            onChange={(event) => setData({ button_link: event.target.value })}
          />
        )}

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
              onChange={(selected) => setData({ post_time: selected?.value })}
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
                className="px-4 success-button"
                onClick={submit}
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
                className={`px-4 success-button ${'latest-2'}`}
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
CategoryOne.propTypes = {
  data: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  schedule: PropTypes.bool.isRequired,
  onReturn: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonList: PropTypes.array.isRequired,
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

export default CategoryOne;
