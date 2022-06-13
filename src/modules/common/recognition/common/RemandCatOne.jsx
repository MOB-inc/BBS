/* eslint-disable no-nested-ternary */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CCol, CRow } from '@coreui/react';
import Select, { components } from 'react-select';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import '../modals/remand_post_modal.scss';

function RemandCatOne({
  active,
  contents,
  buttonList,
  buttonId,
  buttonName,
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
      <div className="covid-msg">{t('recognition:REMAND.COVID_MSG')}</div>
      {active ? (
        <textarea
          className="covid-right-content"
          value={contents || ''}
          placeholder={t('recognition:REMAND.COVID_CONTENT')}
          onChange={(event) => onTextAreaChange(event, 'contents')}
        />
      ) : (
        <textarea
          className="covid-right-content custom"
          placeholder={t('recognition:REMAND.COVID_CONTENT')}
          value={contents || ''}
          disabled
        />
      )}
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
            className="px-4 covid-margin success-button"
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
RemandCatOne.propTypes = {
  active: PropTypes.bool.isRequired,
  contents: PropTypes.string.isRequired,
  buttonList: PropTypes.arrayOf(PropTypes.number),
  buttonId: PropTypes.number.isRequired,
  buttonName: PropTypes.string.isRequired,
  onTextAreaChange: PropTypes.func.isRequired,
  onButtonTypeChange: PropTypes.func.isRequired,
  toggleRemandDeleteModal: PropTypes.func.isRequired,
  toggleRemandEditModal: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  reloadPost: PropTypes.func.isRequired,
  buttonLink: PropTypes.string.isRequired,
};
RemandCatOne.defaultProps = {
  buttonList: [],
};

export default RemandCatOne;
