import React, { useState, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CButton } from '@coreui/react';
import Select, { components } from 'react-select';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import {
  GMB_POST,
  BUTTON_TYPES,
  FIXED_PHRASE_BY_LOCATION,
  FIXED_PHRASES,
} from '../../../commons/constants/url';
import { counter } from '../../../commons/helpers/util';
import Explanation from '../../../commons/components/Explanation';
import Navigation from '../navigation';
import LocationList from '../list';

// import { ReactComponent as EditIcon } from '../../../commons/icons/edit.svg';
import { ReactComponent as EditIcon } from '../../../commons/icons/pen-icon.svg';
import { ReactComponent as ExIcon } from '../../../commons/icons/ex-icon.svg';
// import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down-select.svg';
import { AppContext } from '../../../commons/helpers/appContext';
import './phrase.scss';
import {
  SERVICE_GMB,
  SERVICE_CMS,
  // SERVICE_REVIEW,
  SERVICE_LINE_OFFICIAL,
} from '../../../commons/constants/key';
import { EXAMPLE_TYPE } from './modals/constant';
import { ReactComponent as QuesIcon } from '../../../commons/icons/question.svg';

const ExampleModal = React.lazy(() => import('./modals/example'));

function FixedPhrase() {
  const { menuMode } = useContext(AppContext);
  const { t } = useTranslation(['location']);
  const { id: locationId } = useParams();
  const [selected, setSelected] = useState(SERVICE_GMB);
  const [editable, setEditable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phrase, setPhrase] = useState({ phrase: '' });
  const [exampleModal, setExampleModal] = useState(false);
  const [exampleType, setExampleType] = useState(EXAMPLE_TYPE.GBP);
  const [linkType, setLinkType] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const { get: getButtonTypes, response: buttonResponse } = useFetch(
    `${GMB_POST}${BUTTON_TYPES}`,
  );
  const { get: getFixedPhrase } = useFetch(
    locationId ? FIXED_PHRASE_BY_LOCATION(locationId, selected) : null,
  );

  const { post: postFixedPhrase, response: postFixedResponse } =
    useFetch(FIXED_PHRASES);
  const { put: putFixedPhrase, response: putFixedResponse } = useFetch(
    phrase?.id ? `${FIXED_PHRASES}/${phrase.id}` : null,
  );
  const [optionsLinkType, setOptionsLinkType] = useState([]);

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  useEffect(async () => {
    const responseButton = await getButtonTypes();
    if (buttonResponse.ok) {
      const recievedList = responseButton?.result?.data;
      const reformedData = recievedList.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setOptionsLinkType(reformedData);
    }
  }, []);
  /* eslint-disable no-param-reassign */
  /* eslint-disable react/no-array-index-key */
  /* eslint-disable no-lonely-if */
  useEffect(() => {
    if (!locationId) return;

    getFixedPhrase().then((data) => {
      setPhrase(data?.result?.fixed_phrase || { phrase: '' });
      setLinkType(data?.result?.fixed_phrase?.gmb_post_button_type_id || '');
      setLinkName(data?.result?.fixed_phrase?.link_name || '');
      setLinkUrl(data?.result?.fixed_phrase?.link_url || '');
      setEditable(false);
    });
  }, [locationId, selected]);

  const handlePhraseUpdate = (event) => {
    setPhrase((data) => {
      const { phrase: ignore, ...rest } = data;
      return {
        phrase: event.target.value,
        ...rest,
      };
    });
  };

  const handleEditOrRegister = async () => {
    if (!editable) {
      setEditable(true);
    } else {
      setBusy(true);
      const data = {
        location_id: locationId,
        service_type: selected,
        phrase: phrase.phrase,
      };
      if (selected === SERVICE_GMB) {
        if (
          optionsLinkType.find((link) => {
            return link.label === '???????????????';
          })?.value !== linkType
        ) {
          data.link_url = linkUrl || '';
        } else {
          data.link_url = '';
        }
        data.gmb_post_button_type_id = linkType || '';
      } else if (selected === SERVICE_LINE_OFFICIAL) {
        data.link_url = linkUrl || '';
        data.link_name = linkName || '';
      }
      if (phrase?.id) {
        await putFixedPhrase(data);
      } else {
        await postFixedPhrase(data);
      }
      if (putFixedResponse?.ok || postFixedResponse?.ok) {
        setEditable(false);
      }
      setBusy(false);
    }
  };
  const handlerExample = async (type) => {
    setExampleType(type);
    setExampleModal(true);
  };
  const toggleExampleModal = async () => {
    setExampleModal(!exampleModal);
  };
  const reflectExampleHandler = async (example) => {
    setPhrase({ phrase: example });
  };
  const handleCancel = async () => {
    setBusy(true);
    setPhrase({ phrase: '' });
    getFixedPhrase().then((data) => {
      setPhrase(data?.result?.fixed_phrase || { phrase: '' });
      setLinkType(data?.result?.fixed_phrase?.gmb_post_button_type_id);
      setLinkName(data?.result?.fixed_phrase?.link_name);
      setLinkUrl(data?.result?.fixed_phrase?.link_url);
      setEditable(false);
      setBusy(false);
    });
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <div className="fixed-phrase">
      <div className="head">
          <Explanation screen="PHRASE" />
          <LocationList url="/locations/fixed_phrases" />
      </div>
      <Navigation />
      <div className="content">
        <div className="service-list">
        <p id="locName"> </p>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab 
            label={t('location:PHRASE.GMB')} 
            className={`service ${
              selected === SERVICE_LINE_OFFICIAL && 'active'
            }`}
            onClick={() => setSelected(SERVICE_GMB)}
            />
            <Tab 
            label={t('location:PHRASE.LINE_OFFICIAL')}
            className={`service ${
              selected === SERVICE_LINE_OFFICIAL && 'active'
            }`}
            onClick={() => setSelected(SERVICE_LINE_OFFICIAL)}
            />
            <Tab 
            label={t('location:PHRASE.CMS')}
            className={`service ${selected === SERVICE_CMS && 'active'}`}
            onClick={() => setSelected(SERVICE_CMS)} />
          </Tabs>
        </Paper>
          {/* <div className="services">
            <button
              type="button"
              className={`service ${selected === SERVICE_GMB && 'active'}`}
              onClick={() => setSelected(SERVICE_GMB)}
            >
              {t('location:PHRASE.GMB')}
            </button>
            <button
              type="button"
              className={`service ${
                selected === SERVICE_LINE_OFFICIAL && 'active'
              }`}
              onClick={() => setSelected(SERVICE_LINE_OFFICIAL)}
            >
              {t('location:PHRASE.LINE_OFFICIAL')}
            </button>
            <button
              type="button"
              className={`service ${selected === SERVICE_CMS && 'active'}`}
              onClick={() => setSelected(SERVICE_CMS)}
            >
              {t('location:PHRASE.CMS')}
            </button> */}
            {/* <button
              disabled
              type="button"
              className={`service ${selected === SERVICE_TIKTOK && 'active'}`}
              onClick={() => setSelected(SERVICE_TIKTOK)}
            >
              TikTok
            </button>
            <button
              disabled
              type="button"
              className={`service ${selected === SERVICE_HPB && 'active'}`}
              onClick={() => setSelected(SERVICE_HPB)}
            >
              HPB
            </button> */}
          {/* </div> */}
          {selected === SERVICE_GMB && (
            <>
              {menuMode === 'sidebar' && (
                <>  
                <Explanation screen="PHRASE_GMB" />
                <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{t('location:TOOLTIPS.NOTE')} </span>} arrow interactive style={{cursor:"pointer"}} >
                  <ExIcon style={{width:"20px",marginLeft:"4px",paddingBottom: "2px"}}/>
                </Tooltip> 
                </>
              )}
              <div className="content">
                <div className={`editor ${(editable && 'active') || ''}`}>
                  <textarea
                    disabled={!editable}
                    value={phrase?.phrase || ''}
                    onChange={handlePhraseUpdate}
                    placeholder="???????????????
GBP??????????????????????????????????????????
????????????????????????????????????????????????????????????
?????????????????????
??????????????????
???URL
??????????????????????????????(?????????????????????No.1...???)
---------------------------------------------------------------
??????????????????
??????????????? ??????
?????????????????????30??????
????????????????????????????????????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????
???????????????50??????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????????????????????????????????????????????????????
??????????????????????????????
---------------------------------------------------------------"
                  />
                  <div className="edit-button">
                  {editable ? (
                    <>
                    </>
                  ) : (
                    <CButton
                      shape="pill"
                      onClick={handleEditOrRegister}
                      disabled={busy}
                    >
                      <EditIcon height={18} width={18} /> EDIT
                    </CButton>
                  )}
                </div>
                  <div className="counter">
                    {counter(phrase?.phrase || '')} {t('location:PHRASE.TEXT')}
                  </div>
                </div>
              </div>
              <div className="url-box">
                <div className="link-name">
                  <FormControl variant="outlined" >
                    <InputLabel className="label" htmlFor="outlined-age-native-simple">{t('location:PHRASE.ADD_BUTTON')}</InputLabel>
                    <Select
                      options={optionsLinkType}
                      components={{ DropdownIndicator }}
                      isClearable
                      value={
                        optionsLinkType[
                          optionsLinkType.findIndex((el) => el.value === linkType)
                        ] || false
                      }
                      onChange={(select) => {
                        setLinkType(select?.value);
                      }}
                      isDisabled={!editable}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '185px',
                          marginBottom: '10px',
                          marginRight: '10px',
                        }),
                      }}
                    />
                  </FormControl>
                  <Tooltip title={t('location:PHRASE.LINK_TEXT_GBP')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip>
                  
                </div>
                {optionsLinkType.find((link) => {
                  return link.label === '???????????????';
                })?.value !== linkType && (
                  <input
                    className="urlField"
                    value={linkUrl}
                    disabled={!editable}
                    onChange={(event) => setLinkUrl(event?.target?.value)}
                    placeholder="URL"
                  />
                )}
              </div>
              <div className="editButtonWrap">
                { editable ? (
                <>
                  <Button
                    className="pills cancel"
                    role="presentation"
                    onClick={handleCancel} 
                  >
                    {t('location:PHRASE.CANCEL')}
                  </Button>
                  <Button
                    className="pills reply-example"
                    role="presentation"
                    onClick={() => handlerExample(EXAMPLE_TYPE.GBP)}
                  >
                    {t('location:PHRASE.PHRASE_EXAMPLE')}
                  </Button>
                  <Button
                    className="pills register submit"
                    role="presentation"
                    onClick={handleEditOrRegister}
                    variable='outlined'
                  >
                    {t('location:PHRASE.REGISTER')}
                  </Button> 
                </>
                ):<></> }
              </div>
            </>
          )}
          {selected === SERVICE_LINE_OFFICIAL && (
            <>
              <Explanation screen="PHRASE_LINE_OFFICIAL" />
              <div className="content">
                <div className={`editor ${(editable && 'active') || ''}`}>
                  <textarea
                    disabled={!editable}
                    value={phrase?.phrase || ''}
                    onChange={handlePhraseUpdate}
                    placeholder="
---------------------------------------------------------------
??????????????????
??????????????? ??????
?????????????????????30??????
????????????????????????????????????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????
???????????????50??????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????????????????????????????????????????????????????
??????????????????????????????
---------------------------------------------------------------"
                  />
                  <div className="edit-button">
                    {editable ? (
                      <>
                      </>
                    ) : (
                      <CButton
                        shape="pill"
                        onClick={handleEditOrRegister}
                        disabled={busy}
                      >
                        <EditIcon height={18} width={18} /> EDIT
                      </CButton>
                    )}
                  </div>
                  <div className="counter">
                    {counter(phrase?.phrase || '')} {t('location:PHRASE.TEXT')}
                  </div>
                </div>
              </div>
              <div className="url-box">
                <div className="link-name"> 
                  <FormControl variant="outlined" >
                    <InputLabel className="label" htmlFor="outlined-age-native-simple">{t('location:PHRASE.ADD_BUTTON')}</InputLabel>
                    <Select
                      options={optionsLinkType}
                      components={{ DropdownIndicator }}
                      isClearable
                      value={
                        optionsLinkType[
                          optionsLinkType.findIndex((el) => el.value === linkType)
                        ] || false
                      }
                      onChange={(select) => {
                        setLinkType(select?.value);
                      }}
                      isDisabled={!editable}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '185px',
                          marginBottom: '10px',
                          marginRight: '10px',
                        }),
                      }}
                    />
                  </FormControl>
                  <Tooltip title={t('location:PHRASE.LINK_TEXT_LINE')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip>
                </div>
                {optionsLinkType.find((link) => {
                  return link.label === '???????????????';
                })?.value !== linkType && (
                  <input
                    className="urlField"
                    value={linkUrl}
                    disabled={!editable}
                    onChange={(event) => setLinkUrl(event?.target?.value)}
                    placeholder="URL"
                  />
                )}
              </div>
              <div className="editButtonWrap">
                { editable ? (
                <>
                  <Button
                    className="pills cancel"
                    role="presentation"
                    onClick={handleCancel} 
                  >
                    {t('location:PHRASE.CANCEL')}
                  </Button>
                  <Button
                    className="pills reply-example"
                    role="presentation"
                    onClick={() => handlerExample(EXAMPLE_TYPE.GBP)}
                  >
                    {t('location:PHRASE.PHRASE_EXAMPLE')}
                  </Button>
                  <Button
                    className="pills register submit"
                    role="presentation"
                    onClick={handleEditOrRegister}
                    variable='outlined'
                  >
                    {t('location:PHRASE.REGISTER')}
                  </Button> 
                </>
                ):<></> }
              </div>
            </>
          )}
          {selected === SERVICE_CMS && (
            <>
              <Explanation screen="PHRASE_CMS" />
              <div className="content">
                <div className={`editor ${(editable && 'active') || ''}`}>
                  <textarea
                    disabled={!editable}
                    value={phrase?.phrase || ''}
                    onChange={handlePhraseUpdate}
                    placeholder="
---------------------------------------------------------------
??????????????????
??????????????? ??????
?????????????????????30??????
????????????????????????????????????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????
???????????????50??????????????????????????????????????????????????????????????????
???????????????????????????????????????????????????????????????????????????????????????????????????
??????????????????????????????
---------------------------------------------------------------"
                  />
                  <div className="edit-button">
                    {editable ? (
                      <>
                      </>
                    ) : (
                      <CButton
                        shape="pill"
                        onClick={handleEditOrRegister}
                        disabled={busy}
                      >
                        <EditIcon height={18} width={18} /> EDIT
                      </CButton>
                    )}
                  </div>
                  <div className="counter">
                    {counter(phrase?.phrase || '')} {t('location:PHRASE.TEXT')}
                  </div>
                </div>
              </div>
              <div className="url-box">
                <div className="link-name">
                <FormControl variant="outlined" >
                    <InputLabel className="label" htmlFor="outlined-age-native-simple">{t('location:PHRASE.ADD_BUTTON')}</InputLabel>
                    <Select
                      options={optionsLinkType}
                      components={{ DropdownIndicator }}
                      isClearable
                      value={
                        optionsLinkType[
                          optionsLinkType.findIndex((el) => el.value === linkType)
                        ] || false
                      }
                      onChange={(select) => {
                        setLinkType(select?.value);
                      }}
                      defaultValue={value}
                      isDisabled={!editable}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '185px',
                          marginBottom: '10px',
                          marginRight: '10px',
                        }),
                      }}
                    />
                  </FormControl>
                  <Tooltip title={t('location:PHRASE.LINK_TEXT_CMS')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip>
                </div>
                {optionsLinkType.find((link) => {
                  return link.label === '???????????????';
                })?.value !== linkType && (
                  <input
                    className="urlField"
                    value={linkUrl}
                    disabled={!editable}
                    onChange={(event) => setLinkUrl(event?.target?.value)}
                    placeholder="URL"
                  />
                )}
              </div>
              <div className="editButtonWrap">
                { editable ? (
                <>
                  <Button
                    className="pills cancel"
                    role="presentation"
                    onClick={handleCancel} 
                  >
                    {t('location:PHRASE.CANCEL')}
                  </Button>
                  <Button
                    className="pills reply-example"
                    role="presentation"
                    onClick={() => handlerExample(EXAMPLE_TYPE.GBP)}
                  >
                    {t('location:PHRASE.PHRASE_EXAMPLE')}
                  </Button>
                  <Button
                    className="pills register submit"
                    role="presentation"
                    onClick={handleEditOrRegister}
                    variable='outlined'
                  >
                    {t('location:PHRASE.REGISTER')}
                  </Button> 
                </>
                ):<></> }
              </div>
            </>
          )}
          {/* <div style={{textAlign: "right",marginTop: "115px"}}>
            <Button className="submit">{t('location:PHRASE.REGISTER')}</Button>
          </div> */}
        </div>
      </div>
      <ExampleModal
        exampleType={exampleType}
        closeModal={toggleExampleModal}
        modal={exampleModal}
        reflectExampleHandler={reflectExampleHandler}
      />
    </div>
  );
}

export default FixedPhrase;
