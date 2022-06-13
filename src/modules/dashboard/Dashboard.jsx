/* eslint-disable no-else-return */
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTooltip,
} from '@coreui/react';
import * as dayjs from 'dayjs';
import { useDebounce } from 'ahooks';
import useFetch from 'use-http';
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { parameterizeArray } from '../../commons/helpers/util';
import Pagination from '../../commons/components/Pagination';
import { AppContext } from '../../commons/helpers/appContext';
import { ReactComponent as FilterIcon } from '../../commons/icons/filter.svg';
import { ReactComponent as ArrowUp } from '../../commons/icons/arrow-up.svg';
import { ReactComponent as ArrowDown } from '../../commons/icons/arrow-down.svg';
import { ReactComponent as LinkIcon } from '../../commons/icons/external-link.svg';
import { ReactComponent as DeleteIcon } from '../../commons/icons/delete.svg';
import { ReactComponent as CalendarIcon } from '../../commons/icons/calendar.svg';
import { ReactComponent as InstaIcon } from '../../commons/icons/instagram-logo.svg';
import { ReactComponent as GoogleIcon } from '../../commons/icons/google-logo.svg';
import { ReactComponent as LINEIcon } from '../../commons/icons/line-logo.svg';
import { ReactComponent as CMSIcon } from '../../commons/icons/cms-logo.svg';
import { ReactComponent as LikeIcon } from '../../commons/icons/like.svg';
import { ReactComponent as CommentIcon } from '../../commons/icons/comment.svg';
import { ReactComponent as FavoriteIcon } from '../../commons/icons/favorite.svg';
// import { ReactComponent as CMSIcon } from '../../commons/icons/cms-logo.svg';

// import { ReactComponent as Caution } from '../../commons/icons/caution.svg';

import './dashboard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { DASHBOARDS, INSTAGRAM_MEDIA_URL } from '../../commons/constants/url';
import Explanation from '../../commons/components/Explanation';
import ReactImageTooltip from '../../commons/components/ReactImageTooltip';
import config from '../../OEMConfig';

const DeleteModal = React.lazy(() => import('./modals/delete'));
// const RepostModal = React.lazy(() => import('./modals/repostModal'));
const tz = dayjs.tz.guess();
// eslint-disable-next-line react/prop-types
const DatePickerIcon = React.forwardRef(({ onClick }, ref) => (
  <CalendarIcon height={30} width={30} onClick={onClick} ref={ref} />
));

function Dashboard() {
  const { t } = useTranslation(['dashboard']);
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [pageItemCount, setPageItemCount] = useState(30);
  const [orderField, setOrderField] = useState();
  const [orderType, setOrderType] = useState('desc');
  const [deletePostId, setDeletePostId] = useState();
  const [deleteLocationId, setDeleteLocationId] = useState();
  const { locations, menuMode } = useContext(AppContext);
  const [imageUrl, setImageUrl] = useState('');
  const [selectItem, setSelectItem] = useState();
  const [mouseOver, setMouseOver] = useState(0);
  const debouncedMouseOver = useDebounce(mouseOver, { wait: 250 });

  const { get: getDashboard } = useFetch(DASHBOARDS);
  const { get: getInstagramMediaUrl } = useFetch(INSTAGRAM_MEDIA_URL);

  const pageChangeHandler = (p) => {
    setPage(p);
  };

  const dateChangeHandler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const loadDashboard = async () => {
    const params = {
      page,
      pagination_no: pageItemCount,
    };
    if (orderField) {
      params.order_field = orderField;
      params.order_type = orderType;
    }
    if (startDate && endDate) {
      params.start_date = dayjs(startDate)
        .hour(0)
        .minute(0)
        .second(0)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      params.end_date = dayjs(endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
    }
    const locationParams = parameterizeArray('locations', locations);
    const response = await getDashboard(
      `?${new URLSearchParams(params).toString()}${
        locations.length ? locationParams : ''
      }`,
    );
    setItems(response?.result?.data);
    setItemCount(response?.result?.pagination?.total);
    setLastPage(response?.result?.pagination?.total_pages || 1);
  };

  const setOrder = (field, type) => {
    setOrderField(field);
    setOrderType(type);
  };

  const deletePost = (postId, locationId) => {
    setDeletePostId(postId);
    setDeleteLocationId(locationId);
  };
  const deleteModalCloseHandler = () => {
    setDeletePostId();
    setDeleteLocationId();
    loadDashboard();
  };
  useEffect(async () => {
    if (selectItem?.location) {
      const params = {
        location_id: selectItem?.location?.id,
        igm_id: selectItem?.instagram_media?.id,
      };
      const response = await getInstagramMediaUrl(
        `?${new URLSearchParams(params).toString()}`,
      );
      setImageUrl(
        response?.result?.media_url ? response?.result?.media_url : '',
      );
    }
  }, [debouncedMouseOver]);

  const onMouseEnter = async (item) => {
    setSelectItem(item);
    setMouseOver(Math.random());
  };

  const onMouseLeave = async () => {
    setImageUrl('');
    setSelectItem();
  };

  useEffect(() => {
    loadDashboard();
  }, [
    page,
    pageItemCount,
    orderField,
    orderType,
    startDate,
    endDate,
    locations,
  ]);

  return (
    <div className="dashboard-page">
      {menuMode === 'sidebar' ? (
        <Explanation screen="DASHBOARD" isPhraseDisp />
      ) : (
        <></>
      )}
      <div className="filter-pages">
        <div className="filters">
          <div>
            {t('dashboard:LIST')} ({itemCount})
          </div>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={dateChangeHandler}
            customInput={<DatePickerIcon />}
            shouldCloseOnSelect={false}
            popperPlacement={menuMode === 'sidebar' ? 'top-end' : 'top-start'}
          />
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
              <CDropdownItem href="#">{t('dashboard:WANT')}</CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(30)}>
                30 {t('dashboard:ITEM')}
              </CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(100)}>
                100 {t('dashboard:ITEM')}
              </CDropdownItem>
              <CDropdownItem href="#" onClick={() => setPageItemCount(200)}>
                200 {t('dashboard:ITEM')}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div className="list">
        <div className="table">
          <div className="thead">
            <div className="row">
              <div className="cell w10p">
                {t('dashboard:COLUMNS.POST_DATE_TIME')} &nbsp;
                <span
                  className={`${
                    orderField === 'post_datetime' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'post_datetime' ? (
                    <ArrowUp
                      onClick={() => setOrder('post_datetime', 'desc')}
                    />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('post_datetime', 'asc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w15p">
                {t('dashboard:COLUMNS.LOCATION')} &nbsp;
                <span
                  className={`${
                    orderField === 'location_name' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'location_name' ? (
                    <ArrowUp
                      onClick={() => setOrder('location_name', 'desc')}
                    />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('location_name', 'asc')}
                    />
                  )}
                </span>
              </div>
              {config().is_show_splan ? (
                <div className='cell w22d5p'>
                  <InstaIcon className="icon-svg insta-icon" />
                  {t('dashboard:COLUMNS.CAPTION')}
              </div>
              ) : (
                <div className='cell w27d5p'>
                  <InstaIcon className="icon-svg insta-icon" />
                  {t('dashboard:COLUMNS.CAPTION')}
              </div>
              )}
              <div className="cell w5p">
                <LikeIcon className="icon-svg" /> &nbsp;
                <span
                  className={`${
                    orderField === 'like_count' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'like_count' ? (
                    <ArrowUp onClick={() => setOrder('like_count', 'desc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('like_count', 'asc')} />
                  )}
                </span>
              </div>
              <div className="cell w5p">
                <CommentIcon className="icon-svg" /> &nbsp;
                <span
                  className={`${
                    orderField === 'comments_count' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'comments_count' ? (
                    <ArrowUp
                      onClick={() => setOrder('comments_count', 'desc')}
                    />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('comments_count', 'asc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w5p">
                <FavoriteIcon className="icon-svg" /> &nbsp;
                <span
                  className={`${
                    orderField === 'favorite_count' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'favorite_count' ? (
                    <ArrowUp
                      onClick={() => setOrder('favorite_count', 'desc')}
                    />
                  ) : (
                    <ArrowDown
                      onClick={() => setOrder('favorite_count', 'asc')}
                    />
                  )}
                </span>
              </div>
              <div className="cell w7d5p">
                {t('dashboard:COLUMNS.ENGAGEMENT')} &nbsp;
                <span
                  className={`${
                    orderField === 'engagement' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'engagement' ? (
                    <ArrowUp onClick={() => setOrder('engagement', 'desc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('engagement', 'asc')} />
                  )}
                </span>
              </div>
              <div className="cell w5p">
                {t('dashboard:COLUMNS.IMPRESSIONS')} &nbsp;
                <span
                  className={`${
                    orderField === 'impressions' ? 'highlight' : ''
                  }`}
                >
                  {orderType === 'asc' && orderField === 'impressions' ? (
                    <ArrowUp onClick={() => setOrder('impressions', 'desc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('impressions', 'asc')} />
                  )}
                </span>
              </div>
              <div className="cell w5p">
                {t('dashboard:COLUMNS.REACH')} &nbsp;
                <span
                  className={`${orderField === 'reach' ? 'highlight' : ''}`}
                >
                  {orderType === 'asc' && orderField === 'reach' ? (
                    <ArrowUp onClick={() => setOrder('reach', 'desc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('reach', 'asc')} />
                  )}
                </span>
              </div>
              <div className="cell w7d5p">
                <GoogleIcon className="icon-svg" />
              </div>
              <div className="cell w5p">
                <LINEIcon className="icon-svg" />
              </div>
              {config().is_show_splan && (
                <div className="cell w5p">
                  <CMSIcon className="icon-svg" />
                </div>
              )}
              {/* 未連携のためコメントアウト(CMS) */}
              {/* <div className="cell w7d5p">
                <CMSIcon className="icon-svg" />
              </div> */}

              {/* 未連携のためコメントアウト */}
              {/* <div className="cell w97">TikTok</div>
              <div className="cell w97">HPB</div> */}
            </div>
          </div>
          <div className="tbody">
            {items?.map((item) => {
              return (
                <div className="row" key={item.instagram_media?.id}>
                  <div className="cell w10p">
                    {dayjs
                      .utc(item?.post_datetime)
                      .tz(tz)
                      .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                  </div>
                  <div className="cell w15p">{item?.location?.name}</div>
                  {config().is_show_splan ? (
                    <div className="cell w22d5p content">
                      <ReactImageTooltip image={imageUrl}>
                        <a
                          onMouseEnter={() => onMouseEnter(item)}
                          onMouseLeave={() => onMouseLeave()}
                          href={item?.instagram_media?.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="insta-link"
                        >
                          {item?.instagram_media?.caption}
                        </a>
                      </ReactImageTooltip>
                    </div>
                  ) : (
                    <div className="cell w27d5p content">
                      <ReactImageTooltip image={imageUrl}>
                        <a
                          onMouseEnter={() => onMouseEnter(item)}
                          onMouseLeave={() => onMouseLeave()}
                          href={item?.instagram_media?.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="insta-link"
                        >
                          {item?.instagram_media?.caption}
                        </a>
                      </ReactImageTooltip>
                    </div>
                  )}
                  <div className="cell w5p">
                    {item?.instagram_media?.like_count}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.comments_count}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.favorite_count}
                  </div>
                  <div className="cell w7d5p">
                    {item?.instagram_media?.engagement}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.impressions}
                  </div>
                  <div className="cell w5p">{item?.instagram_media?.reach}</div>
                  {item?.gmb_post_id ? (
                    <div className="cell w7d5p column">
                      {(() => {
                        if (item?.is_gmb_post_deleted) {
                          return (
                            <div className="deleted">
                              {t('dashboard:DELETED')}
                            </div>
                          );
                        } else if (item?.gmb_error_msg) {
                          return (
                            <CTooltip content={item?.gmb_error_msg}>
                              <div className="deleted">
                                {t('dashboard:ERROR')}
                              </div>
                            </CTooltip>
                          );
                        } else {
                          return (
                            <>
                              <a
                                href={item?.search_url}
                                target="_blank"
                                rel="noreferrer"
                                className="link"
                              >
                                <LinkIcon height={20} width={20} />
                              </a>
                              <div
                                className="delete"
                                role="presentation"
                                onClick={() =>
                                  deletePost(
                                    item?.gmb_post_id,
                                    item?.location?.id,
                                  )
                                }
                              >
                                <DeleteIcon height={20} width={20} />
                              </div>
                            </>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="cell w7d5p column">
                      {t('dashboard:UNPOSTED')}
                    </div>
                  )}
                  <div className="cell w5p column">
                    {(() => {
                      if (item?.line_error_msg) {
                        return (
                          <CTooltip content={item?.line_error_msg}>
                            <div className="deleted">
                              {t('dashboard:ERROR')}
                            </div>
                          </CTooltip>
                        );
                      } else if (item?.is_line_official_post) {
                        return (
                          <div className="linePosted">
                            {t('dashboard:POSTED')}
                          </div>
                        );
                      } else {
                        return (
                          <div className="lineUnPosted">
                            {t('dashboard:UNPOSTED')}
                          </div>
                        );
                      }
                    })()}
                  </div>
                  {config().is_show_splan && (
                    <div className="cell w5p column">
                      {(() => {
                        if (item?.splan_error_msg) {
                          return (
                            <CTooltip content={item?.splan_error_msg}>
                              <div className="deleted">
                                {t('dashboard:ERROR')}
                              </div>
                            </CTooltip>
                          );
                        } else if (item?.is_splan_post) {
                          return (
                            <div className="linePosted">
                              {t('dashboard:POSTED')}
                            </div>
                          );
                        } else {
                          return (
                            <div className="lineUnPosted">
                              {t('dashboard:UNPOSTED')}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                  {/* 未連携のためコメントアウト(CMS) */}
                  {/* <div className="cell w7d5p column">
                    <LinkIcon height={20} width={20} />
                    <div className="delete">
                      <DeleteIcon height={20} width={20} />
                    </div>
                  </div> */}

                  {/* 未連携のためコメントアウト */}
                  {/* <div className="cell w97 column">
                    <LinkIcon height={16} width={16} />
                    <div className="delete"><DeleteIcon height={20} width={20} /></div>
                  </div>
                  <div className="cell w97 column">
                    <LinkIcon height={16} width={16} />
                    <div className="delete"><DeleteIcon height={20} width={20} /></div>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DeleteModal
        postId={deletePostId}
        locationId={deleteLocationId}
        onClose={deleteModalCloseHandler}
      />
    </div>
  );
}

export default Dashboard;
