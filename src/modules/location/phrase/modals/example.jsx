import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody } from '@coreui/react';
import './example.scss';
import Select, { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
// import Button from '../../../../commons/components/Button';
import { OPTIONS } from './constant';

function Example({ exampleType, closeModal, modal, reflectExampleHandler }) {
  const { t } = useTranslation(['location']);
  const [example, setExample] = useState({});
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const openHandler = () => {
    setExample(null);
  };

  return (
    <CModal
      show={modal}
      onOpened={openHandler}
      onClose={closeModal}
      className="example-modal"
    >
      <CModalBody>
        <Select
          closeMenuOnSelect
          options={OPTIONS[exampleType]}
          value={example}
          onChange={(selected) => {
            setExample(selected);
          }}
          placeholder={t('location:PHRASE.SELECT_PLACEHOLDER')}
          components={{ DropdownIndicator }}
          className="dropdown-wrapper"
        />
        <textarea
          className="panel"
          disabled
          value={example ? example.value : ''}
        />
        <div className="buttons">
          <Button
            type="reset"
            onClick={() => {
              closeModal();
            }}
            variant="outlined"
            className="back"
          >
            {t('location:PHRASE.RETURN')}
          </Button>
          <Button
            onClick={() => {
              if (example) reflectExampleHandler(example?.value);
              closeModal();
            }}
            variant="contained"
            className="submit"
          >
            {t('location:PHRASE.REGISTER')}
          </Button>
        </div>
      </CModalBody>
    </CModal>
  );
}
Example.propTypes = {
  exampleType: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  reflectExampleHandler: PropTypes.func.isRequired,
};

export default Example;
