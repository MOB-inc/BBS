/* eslint-disable camelcase */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import * as dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import { NavLink } from 'react-router-dom';

import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';

import Navigation from '../navigation';
import Button from '../../../commons/components/Button';
import Pagination from '../../../commons/components/Pagination';
import Explanation from '../../../commons/components/Explanation';
import { GMB_POST } from '../../../commons/constants/url';
import { parameterizeArray } from '../../../commons/helpers/util';
import { AppContext } from '../../../commons/helpers/appContext';

import { ReactComponent as CalendarIcon } from '../../../commons/icons/calendar.svg';
import { ReactComponent as CautionIcon } from '../../../commons/icons/caution.svg';
import { ReactComponent as FilterIcon } from '../../../commons/icons/filter.svg';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/arrow-up.svg';

import './index.scss';

const NewPostModal = React.lazy(() => import('./modals/NewPostModal'));
const tz = dayjs.tz.guess();
// eslint-disable-next-line react/prop-types
const DatePickerIcon = React.forwardRef(({ onClick }, ref) => (
  <CalendarIcon height={30} width={30} onClick={onClick} ref={ref} />
));

function Posts() {
  const { t } = useTranslation(['common', 'gmb_post']);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState();
  const [lastPage, setLastPage] = useState(1);
  const [listCount, setListCount] = useState(0);
  const [remandCount, setRemandCount] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [pageItemCount, setPageItemCount] = useState(30);
  const [orderField, setOrderField] = useState();
  const [orderType, setOrderType] = useState('asc');
  const [current, setCurrent] = useState();
  const { menuMode, locations } = useContext(AppContext);

  const [gmbPostModal, setGmbPostModal] = useState(false);
  const [gmbPostList, setGmbPostList] = useState([]);

  const STATUS_MAP = {
    1: t('common:REVIEW.STATUS.NOT_REPLIED'),
    2: t('REVIEW.STATUS.APPLIED'),
    3: t('REVIEW.STATUS.REMAND'),
    5: t('REVIEW.STATUS.POSTED'),
  };
  const { get: getGmbPost } = useFetch(GMB_POST);

  const loadGmbPost = async () => {
    const query = { page, pagination_no: pageItemCount };
    if (filter) query.status = filter;
    if (startDate && endDate) {
      query.start_date = dayjs(startDate)
        .hour(0)
        .minute(0)
        .second(0)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      query.end_date = dayjs(endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
    }

    if (orderField) {
      query.order_field = orderField;
      if (orderType) query.order_type = orderType;
    }
    const locationParams = parameterizeArray('locations', locations);
    const response = await getGmbPost(
      `?${new URLSearchParams(query).toString()}${
        locations.length ? locationParams : ''
      }`,
    );

    setGmbPostList(response?.result?.data);
    setLastPage(response?.result?.pagination?.total_pages || 1);
    setListCount(response?.result?.summary?.listCount);

    setRemandCount(response?.result?.summary?.remandCount);
  };

  const toggleGmbPostModal = () => {
    loadGmbPost();
    setGmbPostModal(!gmbPostModal);
  };

  const onRowClick = (currentPost) => {
    setCurrent(currentPost);
    toggleGmbPostModal();
  };

  const pageChangeHandler = (p) => {
    setPage(p);
  };

  const dateChangeHandler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const setOrder = (field, orderingType) => {
    setOrderField(field);
    setOrderType(orderingType);
  };

  const displayLocation = (data) => {
    let location = '';
    data.forEach((element) => {
      location += `${element?.location?.name}\n`;
    });
    return location;
  };

  const stopPropagation = (event) => {
    event?.stopPropagation();
  };

  useEffect(() => {
    loadGmbPost();
  }, [
    page,
    filter,
    startDate,
    endDate,
    pageItemCount,
    locations,
    orderField,
    orderType,
  ]);

  return (
    <div className="posts-page">
      {menuMode === 'sidebar' && <Explanation screen="POST" isConnectDisp />}
      <div className="header">
        {menuMode === 'sidebar' && <Navigation />}
        <Button>
          <div className="tab">
            <NavLink
              to="/gmb/posts/new"
              className="button"
              activeClassName="active"
            >
              {t('gmb_post:POSTS.NEW_POST')}
            </NavLink>
          </div>
        </Button>
      </div>
      <div className="filter-pages">
        <div className="filters">
          <div
            role="presentation"
            className={!filter ? 'active' : ''}
            onClick={() => setFilter()}
          >
            {t('gmb_post:POSTS.LIST')} ({listCount})
          </div>
          <div
            role="presentation"
            className={filter === 3 ? 'active' : ''}
            onClick={() => setFilter(3)}
          >
            {t('gmb_post:POSTS.REMAND')} ({remandCount}) &nbsp;{' '}
            {remandCount > 0 && <CautionIcon width={24} height={24} />}
          </div>
          <div>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={dateChangeHandler}
              customInput={<DatePickerIcon />}
              shouldCloseOnSelect={false}
            />
          </div>
        </div>
        <div className="pages">
          <Pagination
            current={page}
            last={lastPage}
            onPageChange={pageChangeHandler}
          />
          &nbsp;
          <CDropdown direction="dropup">
            <CDropdownToggle href="#">
              <FilterIcon height={13} width={13} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">{t('gmb_post:POSTS.WANT')}</CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(30)}>
                30{t('gmb_post:POSTS.ITEM')}
              </CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(100)}>
                100{t('gmb_post:POSTS.ITEM')}
              </CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(200)}>
                200{t('gmb_post:POSTS.ITEM')}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div className="list">
        <div className="table">
          <div className="thead">
            <div className="row">
              <div className="cell w15p">
                {t(`gmb_post:POSTS.DATE_TIME`)}
                &nbsp; &nbsp; &nbsp;
                <span
                  className={`${
                    orderField === 'post_datetime' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'desc' && orderField === 'post_datetime' ? (
                    <ArrowUp onClick={() => setOrder('post_datetime', 'asc')} />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('post_datetime', 'desc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w15p">
                {t(`gmb_post:POSTS.LOCATION`)}
                &nbsp; &nbsp; &nbsp;
                <span
                  className={`${
                    orderField === 'location_name' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'desc' && orderField === 'location_name' ? (
                    <ArrowUp onClick={() => setOrder('location_name', 'asc')} />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('location_name', 'desc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w25p">{t(`gmb_post:POSTS.CONTENTS`)}</div>
              <div className="cell w25p">{t(`gmb_post:POSTS.PHOTO`)}</div>
              <div className="cell w10p">
                {t(`gmb_post:POSTS.CATEGORY`)}
                &nbsp; &nbsp;
                <span
                  className={`${
                    orderField === 'gmb_post_category_name' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'desc' &&
                  orderField === 'gmb_post_category_name' ? (
                    <ArrowUp
                      onClick={() => setOrder('gmb_post_category_name', 'asc')}
                    />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('gmb_post_category_name', 'desc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w10p">
                {t(`gmb_post:POSTS.STATUS`)}
                &nbsp;&nbsp;
                <span
                  className={`${orderField === 'status' ? 'highlight' : ''}`}
                >
                  {orderType === 'desc' && orderField === 'status' ? (
                    <ArrowUp onClick={() => setOrder('status', 'asc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('status', 'desc')} />
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="tbody">
            {gmbPostList?.map((post) => {
              return (
                <div
                  className="row"
                  role="presentation"
                  key={post?.id}
                  onClick={() => onRowClick(post)}
                >
                  <div className="cell w15p">
                    {dayjs
                      .utc(`${post?.post_date} ${post?.post_time}`)
                      .tz(tz)
                      .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                  </div>
                  <div
                    className="cell w15p scroll"
                    role="presentation"
                    onClick={stopPropagation}
                  >
                    {displayLocation(post?.gmb_post_locations)}
                  </div>
                  <div
                    className="cell w25p content"
                    style={{ fontSize: '11px' }}
                  >
                    {post?.contents}
                  </div>
                  <div className="cell w25p">
                    {post?.file && (
                      <img
                        src={post?.file?.path + post?.file?.name}
                        alt=" "
                        height={31}
                        width={43}
                      />
                    )}
                  </div>
                  <div className="cell w10p">
                    {post?.gmb_post_category?.name}
                  </div>
                  <div
                    className={`cell w10p ${
                      [1, 3].includes(post?.status) ? 'highlight' : ''
                    }`}
                  >
                    {post?.is_schedule_post === 1 &&
                    ((post?.has_approver === 1 &&
                      post?.is_final_approved === 1) ||
                      post?.has_approver === 0) &&
                    post?.is_reflected === 0
                      ? dayjs
                          .utc(`${post?.post_date} ${post?.post_time}`)
                          .tz(tz)
                          .format('MM/DD HH:mm')
                      : STATUS_MAP[post?.status]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <NewPostModal
        isNew={false}
        current={current}
        modal={gmbPostModal}
        closeModal={toggleGmbPostModal}
      />
    </div>
  );
}

export default Posts;
