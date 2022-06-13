/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { CButton } from '@coreui/react';
import {
  FIXED_REVIEW_PHRASE_BY_LOCATION,
  FIXED_REVIEW_PHRASES,
  REVIEW_AUTOREPLY_SETTINGS_BY_LOCATION,
  FIXED_REVIEW_PHRASE_SELECT,
  REVIEW_AUTOREPLY_SETTINGS,
} from '../../../../commons/constants/url';
import Explanation from '../../../../commons/components/Explanation';
import LocationList from './list';
import { ReactComponent as EditIcon } from '../../../../commons/icons/edit.svg';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as DeleteIcon } from '../../../../commons/icons/delete.svg';
import {
  SERVICE_REVIEW,
  SERVICE_AUTO_REPLY,
} from '../../../../commons/constants/key';
import './phrase.scss';
import { EXAMPLE_TYPE } from '../../../location/phrase/modals/constant';

const ExampleModal = React.lazy(() =>
  import('../../../location/phrase/modals/example'),
);

function FixedPhrase() {
  const { t } = useTranslation(['gmb']);
  const { id: locationId } = useParams();
  const [selected, setSelected] = useState(SERVICE_REVIEW);
  const [editable, setEditable] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [optionFixedReview, setOptionFixedReview] = useState([]);
  const [exampleModal, setExampleModal] = useState(false);

  const [review, setReview] = useState([
    { title: '', phrase: '', branch_number: 1 },
    { title: '', phrase: '', branch_number: 2 },
    { title: '', phrase: '', branch_number: 3 },
    { title: '', phrase: '', branch_number: 4 },
    { title: '', phrase: '', branch_number: 5 },
    { title: '', phrase: '', branch_number: 6 },
    { title: '', phrase: '', branch_number: 7 },
    { title: '', phrase: '', branch_number: 8 },
    { title: '', phrase: '', branch_number: 9 },
    { title: '', phrase: '', branch_number: 10 },
  ]);

  const [autoReplySetteings, setAutoReplySetteings] = useState([
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 1,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 2,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 3,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 4,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 5,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 6,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 7,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 8,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 9,
    },
    {
      target_comment: '',
      target_star_from: '',
      target_star_to: '',
      is_include_recipient_name: '',
      auto_reply_time: '',
      fixed_review_phrase: '',
      branch_number: 10,
    },
  ]);

  const { get: getFixedReviewPhrase } = useFetch(
    locationId ? FIXED_REVIEW_PHRASE_BY_LOCATION(locationId) : null,
  );

  const { get: getReviewAutoReplySetteings } = useFetch(
    locationId ? REVIEW_AUTOREPLY_SETTINGS_BY_LOCATION(locationId) : null,
  );

  const { get: getReviewPhrase } = useFetch(
    locationId ? FIXED_REVIEW_PHRASE_SELECT(locationId) : null,
  );

  const { post: postFixedReviewPhrase } = useFetch(FIXED_REVIEW_PHRASES);
  const { put: putFixedReviewPhrase } = useFetch(
    review[editIndex]?.id
      ? `${FIXED_REVIEW_PHRASES}/${review[editIndex].id}`
      : null,
  );

  const { post: postReviewAutoReplySettings } = useFetch(
    REVIEW_AUTOREPLY_SETTINGS,
  );
  const { put: putReviewAutoReplySettings } = useFetch(
    autoReplySetteings[editIndex]?.id
      ? `${REVIEW_AUTOREPLY_SETTINGS}/${autoReplySetteings[editIndex].id}`
      : null,
  );

  const { delete: deleteReviewAutoReplySettings } = useFetch(
    autoReplySetteings[editIndex]?.id
      ? `${REVIEW_AUTOREPLY_SETTINGS}/${autoReplySetteings[editIndex].id}`
      : null,
  );

  const history = useHistory();
  /* eslint-disable no-param-reassign */
  /* eslint-disable react/no-array-index-key */
  /* eslint-disable no-lonely-if */
  useEffect(() => {
    if (!locationId) return;
    if (selected === SERVICE_REVIEW) {
      getFixedReviewPhrase().then((data) => {
        const newReview = [
          { title: '', phrase: '', branch_number: 1 },
          { title: '', phrase: '', branch_number: 2 },
          { title: '', phrase: '', branch_number: 3 },
          { title: '', phrase: '', branch_number: 4 },
          { title: '', phrase: '', branch_number: 5 },
          { title: '', phrase: '', branch_number: 6 },
          { title: '', phrase: '', branch_number: 7 },
          { title: '', phrase: '', branch_number: 8 },
          { title: '', phrase: '', branch_number: 9 },
          { title: '', phrase: '', branch_number: 10 },
        ];
        newReview.forEach((item) => {
          data?.result?.fixed_review_phrase?.forEach((res) => {
            if (item.branch_number === res.branch_number) {
              item.phrase = res.phrase || '';
              item.title = res.title || '';
            }
          });
        });
        setReview(newReview);
        setEditable(false);
      });
    } else if (selected === SERVICE_AUTO_REPLY) {
      getReviewAutoReplySetteings().then((data) => {
        const newAutoReplySetteings = [
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 1,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 2,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 3,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 4,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 5,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 6,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 7,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 8,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 9,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 10,
          },
        ];
        newAutoReplySetteings.forEach((item) => {
          data?.result?.review_auto_reply_settings?.forEach((res) => {
            if (item.branch_number === res.branch_number) {
              item.target_comment = res.target_comment;
              item.target_star_from = res.target_star_from;
              item.target_star_to = res.target_star_to;
              item.is_include_recipient_name = res.is_include_recipient_name;
              item.auto_reply_time = res.auto_reply_time;
              item.fixed_review_phrase = res.fixed_review_phrase;
              item.id = res.id;
            }
          });
        });
        setAutoReplySetteings(newAutoReplySetteings);
        setEditable(false);
      });
    }
  }, [locationId, selected]);

  useEffect(async () => {
    if (locationId) {
      const phraseResp = await getReviewPhrase();
      const newSelectList = [];
      phraseResp?.result?.forEach((e) => {
        newSelectList.push({
          value: e.id,
          label: e.title,
        });
      });
      setOptionFixedReview(newSelectList);
    }
  }, [locationId]);

  const handleReviewPhraseUpdate = (index, e) => {
    const newReview = [...review];
    newReview[index].phrase = e.target.value;
    setReview(newReview);
  };
  const handleReviewTitleUpdate = (index, e) => {
    const newReview = [...review];
    newReview[index].title = e.target.value;
    setReview(newReview);
  };
  const handleTargetCommentUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    newAutoReplySetteings[index].target_comment = e.value;
    setAutoReplySetteings(newAutoReplySetteings);
  };

  const handleTargetStarFromUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    newAutoReplySetteings[index].target_star_from = e.value;
    setAutoReplySetteings(newAutoReplySetteings);
  };
  const handleTargetStarToUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    newAutoReplySetteings[index].target_star_to = e.value;
    setAutoReplySetteings(newAutoReplySetteings);
  };
  const handleAutoReplyTimeUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    newAutoReplySetteings[index].auto_reply_time = e.target.value;
    setAutoReplySetteings(newAutoReplySetteings);
  };
  const handleRecipientNameUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    newAutoReplySetteings[index].is_include_recipient_name = e.value;
    setAutoReplySetteings(newAutoReplySetteings);
  };

  const handleFixedReviewPhrasesUpdate = (index, e) => {
    const newAutoReplySetteings = [...autoReplySetteings];
    const newFixedReviewPhrase = {
      id: e.value,
      title: e.label,
    };
    newAutoReplySetteings[index].fixed_review_phrase = newFixedReviewPhrase;
    setAutoReplySetteings(newAutoReplySetteings);
  };

  const reload = async () => {
    setBusy(true);
    if (selected === SERVICE_REVIEW) {
      getFixedReviewPhrase().then((data) => {
        const newReview = [
          { title: '', phrase: '', branch_number: 1 },
          { title: '', phrase: '', branch_number: 2 },
          { title: '', phrase: '', branch_number: 3 },
          { title: '', phrase: '', branch_number: 4 },
          { title: '', phrase: '', branch_number: 5 },
          { title: '', phrase: '', branch_number: 6 },
          { title: '', phrase: '', branch_number: 7 },
          { title: '', phrase: '', branch_number: 8 },
          { title: '', phrase: '', branch_number: 9 },
          { title: '', phrase: '', branch_number: 10 },
        ];
        newReview.forEach((item) => {
          data?.result?.fixed_review_phrase?.forEach((res) => {
            if (item.branch_number === res.branch_number) {
              item.phrase = res.phrase || '';
              item.title = res.title || '';
            }
          });
        });
        setReview(newReview);
        setEditable(false);
        setBusy(false);
      });
    } else if (selected === SERVICE_AUTO_REPLY) {
      getReviewAutoReplySetteings().then((data) => {
        const newAutoReplySetteings = [
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 1,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 2,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 3,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 4,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 5,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 6,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 7,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 8,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 9,
          },
          {
            target_comment: '',
            target_star_from: '',
            target_star_to: '',
            is_include_recipient_name: '',
            auto_reply_time: '',
            fixed_review_phrase: '',
            branch_number: 10,
          },
        ];
        newAutoReplySetteings.forEach((item) => {
          data?.result?.review_auto_reply_settings?.forEach((res) => {
            if (item.branch_number === res.branch_number) {
              item.target_comment = res.target_comment;
              item.target_star_from = res.target_star_from;
              item.target_star_to = res.target_star_to;
              item.is_include_recipient_name = res.is_include_recipient_name;
              item.auto_reply_time = res.auto_reply_time;
              item.fixed_review_phrase = res.fixed_review_phrase;
              item.id = res.id;
            }
          });
        });
        setAutoReplySetteings(newAutoReplySetteings);
        setEditable(false);
        setBusy(false);
      });
    }
  };

  const handleReviewEditOrRegister = async (index) => {
    if (!editable) {
      setEditable(true);
      setEditIndex(index);
    } else {
      setBusy(true);
      if (selected === SERVICE_REVIEW) {
        const data = {
          location_id: locationId,
          service_type: selected,
          phrase: review[editIndex].phrase,
          title: review[editIndex].title,
          branch_number: editIndex + 1,
        };
        const response = review[editIndex]?.id
          ? await putFixedReviewPhrase(data)
          : await postFixedReviewPhrase(data);
        if (response?.success) {
          setEditable(false);
          setEditIndex(0);
        }
        setBusy(false);
      } else if (selected === SERVICE_AUTO_REPLY) {
        const data = {
          location_id: locationId,
          target_comment: autoReplySetteings[editIndex].target_comment,
          target_star_from: autoReplySetteings[editIndex].target_star_from,
          target_star_to: autoReplySetteings[editIndex].target_star_to,
          is_include_recipient_name:
            autoReplySetteings[editIndex].is_include_recipient_name,
          auto_reply_time: autoReplySetteings[editIndex].auto_reply_time,
          fixed_review_phrase_id:
            autoReplySetteings[editIndex].fixed_review_phrase.id,
          branch_number: editIndex + 1,
        };
        const response = autoReplySetteings[editIndex]?.id
          ? await putReviewAutoReplySettings(data)
          : await postReviewAutoReplySettings(data);
        if (response?.success) {
          setEditable(false);
          setEditIndex(0);
        }
        setBusy(false);
        await reload();
      }
    }
  };

  const handleReviewCancel = async () => {
    await reload();
  };

  const handleReviewDelete = async () => {
    setBusy(true);
    const response = await deleteReviewAutoReplySettings();
    if (response?.success) {
      setEditable(false);
      setEditIndex(0);
    }
    setBusy(false);
    await reload();
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };
  const toggleExampleModal = async () => {
    setExampleModal(!exampleModal);
  };
  const reflectExampleHandler = async (example) => {
    const newReview = [...review];
    newReview[editIndex].phrase = example;
    setReview(newReview);
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '25px',
      height: '25px',
      boxShadow: state.isFocused ? null : null,
    }),
    container: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '25px',
      padding: '0px',
    }),

    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '25px',
    }),
  };
  const optionsComment = [
    { value: 0, label: 'なし' },
    { value: 1, label: 'あり' },
    { value: 2, label: '両方' },
  ];

  const optionsStar = [
    { value: 1, label: '★☆☆☆☆' },
    { value: 2, label: '★★☆☆☆' },
    { value: 3, label: '★★★☆☆' },
    { value: 4, label: '★★★★☆' },
    { value: 5, label: '★★★★★' },
  ];
  const optionRecipientName = [
    { value: 0, label: 'なし' },
    { value: 1, label: 'あり' },
  ];

  return (
    <div className="gmb-fixed-phrase">
      <div className="content">
        <LocationList
          url="/gmb/reviews/fixed-phrase"
          allLocations
          allLocationsSelect={locationId === 'allLocations'}
        />
        <div className="service-list">
          <div className="services">
            <button
              type="button"
              className={`service ${selected === SERVICE_REVIEW && 'active'}`}
              onClick={() => {
                history.push(`/gmb/reviews/fixed-phrase/allLocations`);
                setSelected(SERVICE_REVIEW);
              }}
            >
              {t('gmb:REVIEWS.PHRASE.REVIEWS')}
            </button>
            <button
              type="button"
              className={`service ${
                selected === SERVICE_AUTO_REPLY && 'active'
              }`}
              onClick={() => {
                history.push(`/gmb/reviews/fixed-phrase/allLocations`);
                setSelected(SERVICE_AUTO_REPLY);
              }}
            >
              {t('gmb:REVIEWS.PHRASE.AUTO_REPLY')}
            </button>
          </div>

          {selected === SERVICE_REVIEW && (
            <>
              <Explanation screen="PHRASE_REVIEW" />
              {Array(10)
                .fill(0)
                .map((val, i) => {
                  return (
                    <div key={i}>
                      <div className="title">
                        {t('gmb:REVIEWS.PHRASE.TITLE')}：
                        <input
                          type="text"
                          value={review[i]?.title}
                          disabled={!(editable && editIndex === i)}
                          onChange={(e) => handleReviewTitleUpdate(i, e)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                              handleReviewTitleUpdate(i, e);
                            }
                          }}
                        />
                      </div>
                      <div className="content">
                        <div
                          className={`editor-small ${
                            (editable && 'active') || ''
                          }`}
                        >
                          <textarea
                            disabled={!(editable && editIndex === i)}
                            value={review[i]?.phrase}
                            onChange={(e) => handleReviewPhraseUpdate(i, e)}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace') {
                                handleReviewPhraseUpdate(i, e);
                              }
                            }}
                            placeholder="返信例
この度はご来店頂き、大変ありがとうございました。
またのお越しを従業員一同、心よりお待ちしております！"
                          />
                        </div>
                        <div className="edit-button">
                          {editable && editIndex === i ? (
                            <>
                              <div
                                className="pills reply-example"
                                role="presentation"
                                onClick={toggleExampleModal}
                              >
                                {t('gmb:REVIEWS.PHRASE.REPLY_EXAMPLE')}
                              </div>
                              <div
                                className="pills register"
                                role="presentation"
                                onClick={() => handleReviewEditOrRegister(i)}
                              >
                                {t('gmb:REVIEWS.PHRASE.REGISTER')}
                              </div>
                              <div
                                className="pills cancel"
                                role="presentation"
                                onClick={handleReviewCancel}
                              >
                                {t('gmb:REVIEWS.PHRASE.CANCEL')}
                              </div>
                            </>
                          ) : (
                            <>
                              {!editable && (
                                <CButton
                                  shape="pill"
                                  onClick={() => handleReviewEditOrRegister(i)}
                                  disabled={busy}
                                >
                                  <EditIcon height={20} width={20} />
                                </CButton>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
          {selected === SERVICE_AUTO_REPLY && (
            <>
              <Explanation screen="PHRASE_REVIEW_AUTO_REPLY" />
              <div className="content-box">
                {Array(10)
                  .fill(0)
                  .map((val, i) => {
                    return (
                      <div key={i}>
                        <div className="auto-reply-title">
                          {t('gmb:REVIEWS.PHRASE.SETTING')}
                          {i + 1}
                        </div>
                        <div className="content">
                          <div
                            className={`auto-reply-editor-small ${
                              (editable && 'active') || ''
                            }`}
                          >
                            <div className="item-box w70">
                              <p className="item-title">
                                {t('gmb:REVIEWS.PHRASE.COMMENT')}
                              </p>
                              <div className="item-content">
                                {editable && editIndex === i ? (
                                  <Select
                                    options={optionsComment}
                                    styles={customStyles}
                                    width="70px"
                                    closeMenuOnSelect={false}
                                    components={{ DropdownIndicator }}
                                    value={
                                      optionsComment[
                                        optionsComment.findIndex(
                                          (el) =>
                                            el.value ===
                                            autoReplySetteings[i]
                                              ?.target_comment,
                                        )
                                      ] || false
                                    }
                                    onChange={(e) =>
                                      handleTargetCommentUpdate(i, e)
                                    }
                                  />
                                ) : (
                                  optionsComment[
                                    optionsComment.findIndex(
                                      (el) =>
                                        el.value ===
                                        autoReplySetteings[i]?.target_comment,
                                    )
                                  ]?.label ||
                                  t('gmb:REVIEWS.PHRASE.NOT_SETTING')
                                )}
                              </div>
                            </div>
                            <div className="item-box w200">
                              <p className="item-title">
                                {t('gmb:REVIEWS.PHRASE.RATING')}
                              </p>
                              <div className="item-content">
                                {editable && editIndex === i ? (
                                  <>
                                    <Select
                                      styles={customStyles}
                                      width="110px"
                                      options={optionsStar}
                                      closeMenuOnSelect={false}
                                      components={{ DropdownIndicator }}
                                      value={
                                        optionsStar[
                                          optionsStar.findIndex(
                                            (el) =>
                                              el.value ===
                                              autoReplySetteings[i]
                                                ?.target_star_from,
                                          )
                                        ] || false
                                      }
                                      onChange={(e) =>
                                        handleTargetStarFromUpdate(i, e)
                                      }
                                    />
                                    &nbsp;〜&nbsp;
                                    <Select
                                      options={optionsStar}
                                      styles={customStyles}
                                      width="110px"
                                      closeMenuOnSelect={false}
                                      components={{ DropdownIndicator }}
                                      value={
                                        optionsStar[
                                          optionsStar.findIndex(
                                            (el) =>
                                              el.value ===
                                              autoReplySetteings[i]
                                                ?.target_star_to,
                                          )
                                        ] || false
                                      }
                                      onChange={(e) =>
                                        handleTargetStarToUpdate(i, e)
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      {optionsStar[
                                        optionsStar.findIndex(
                                          (el) =>
                                            el.value ===
                                            autoReplySetteings[i]
                                              ?.target_star_from,
                                        )
                                      ]?.label ||
                                        t('gmb:REVIEWS.PHRASE.NOT_SETTING')}
                                    </span>
                                    &nbsp;〜&nbsp;
                                    <span>
                                      {optionsStar[
                                        optionsStar.findIndex(
                                          (el) =>
                                            el.value ===
                                            autoReplySetteings[i]
                                              ?.target_star_to,
                                        )
                                      ]?.label ||
                                        t('gmb:REVIEWS.PHRASE.NOT_SETTING')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="item-box w70">
                              <p className="item-title">
                                {t('gmb:REVIEWS.PHRASE.RECIPIENT_NAME')}
                              </p>
                              <div className="item-content">
                                {editable && editIndex === i ? (
                                  <Select
                                    options={optionRecipientName}
                                    styles={customStyles}
                                    width="70px"
                                    closeMenuOnSelect={false}
                                    components={{ DropdownIndicator }}
                                    value={
                                      optionRecipientName[
                                        optionRecipientName.findIndex(
                                          (el) =>
                                            el.value ===
                                            autoReplySetteings[i]
                                              ?.is_include_recipient_name,
                                        )
                                      ] || false
                                    }
                                    onChange={(e) =>
                                      handleRecipientNameUpdate(i, e)
                                    }
                                  />
                                ) : (
                                  optionRecipientName[
                                    optionRecipientName.findIndex(
                                      (el) =>
                                        el.value ===
                                        autoReplySetteings[i]
                                          ?.is_include_recipient_name,
                                    )
                                  ]?.label ||
                                  t('gmb:REVIEWS.PHRASE.NOT_SETTING')
                                )}
                              </div>
                            </div>
                            <div className="item-box w200">
                              <p className="item-title">
                                {t('gmb:REVIEWS.PHRASE.AUTOMATIC_REPLY_TIME')}
                              </p>
                              <div className="item-content">
                                {editable && editIndex === i ? (
                                  <>
                                    {t('gmb:REVIEWS.PHRASE.FROM_POST_REVIEW')}
                                    <input
                                      type="text"
                                      value={
                                        autoReplySetteings[i]?.auto_reply_time
                                      }
                                      onChange={(e) =>
                                        handleAutoReplyTimeUpdate(i, e)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Backspace') {
                                          handleAutoReplyTimeUpdate(i, e);
                                        }
                                      }}
                                    />
                                    {t('gmb:REVIEWS.PHRASE.AFTER_HOUR')}
                                  </>
                                ) : (
                                  <>
                                    {t('gmb:REVIEWS.PHRASE.FROM_POST_REVIEW')}
                                    <span className="underline">
                                      {autoReplySetteings[i]?.auto_reply_time}
                                    </span>
                                    {t('gmb:REVIEWS.PHRASE.AFTER_HOUR')}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="item-box w150">
                              <p className="item-title">
                                {t('gmb:REVIEWS.PHRASE.AUTOMATIC_REPLY_PHRASE')}
                              </p>
                              <div
                                className={`item-content ${
                                  editable && editIndex === i
                                    ? ''
                                    : 'fixed-phrase'
                                }`}
                              >
                                {editable && editIndex === i ? (
                                  <Select
                                    options={optionFixedReview}
                                    styles={customStyles}
                                    width="150px"
                                    closeMenuOnSelect={false}
                                    components={{ DropdownIndicator }}
                                    value={
                                      optionFixedReview[
                                        optionFixedReview.findIndex(
                                          (el) =>
                                            el.value ===
                                            autoReplySetteings[i]
                                              ?.fixed_review_phrase?.id,
                                        )
                                      ] || false
                                    }
                                    onChange={(e) =>
                                      handleFixedReviewPhrasesUpdate(i, e)
                                    }
                                  />
                                ) : (
                                  autoReplySetteings[i]?.fixed_review_phrase
                                    ?.title ||
                                  t('gmb:REVIEWS.PHRASE.NOT_SETTING')
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="edit-button">
                            {editable && editIndex === i ? (
                              <>
                                <div
                                  className="pills register"
                                  role="presentation"
                                  onClick={() => handleReviewEditOrRegister(i)}
                                >
                                  {t('gmb:REVIEWS.PHRASE.REGISTER')}
                                </div>
                                <div
                                  className="pills cancel"
                                  role="presentation"
                                  onClick={handleReviewCancel}
                                >
                                  {t('gmb:REVIEWS.PHRASE.CANCEL')}
                                </div>
                                {autoReplySetteings[editIndex]?.id && (
                                  <DeleteIcon
                                    className="delete-icon"
                                    onClick={handleReviewDelete}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                {!editable && (
                                  <CButton
                                    shape="pill"
                                    onClick={() =>
                                      handleReviewEditOrRegister(i)
                                    }
                                    disabled={busy}
                                  >
                                    <EditIcon height={20} width={20} />
                                  </CButton>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
      <ExampleModal
        exampleType={EXAMPLE_TYPE.REVIEW}
        closeModal={toggleExampleModal}
        modal={exampleModal}
        reflectExampleHandler={reflectExampleHandler}
      />
    </div>
  );
}

export default FixedPhrase;
