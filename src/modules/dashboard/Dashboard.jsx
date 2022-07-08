import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import * as dayjs from 'dayjs';
import { useDebounce } from 'ahooks';
import useFetch from 'use-http';
import React, { useState, useEffect, useContext } from 'react';

import Select, { components } from 'react-select';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies


import DatePicker from 'react-datepicker';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import DateRangePicker from '../../commons/components/DateRangePicker';
import config from '../../OEMConfig';



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
import { ReactComponent as LikeIcon } from '../../commons/icons/like.svg';
import { ReactComponent as CommentIcon } from '../../commons/icons/comment.svg';
import { ReactComponent as FavoriteIcon } from '../../commons/icons/favorite.svg';
import { ReactComponent as EngagementIcon } from '../../commons/icons/engagement.svg';
import { ReactComponent as ImpressionsIcon } from '../../commons/icons/impressions.svg';
import { ReactComponent as ReachIcon } from '../../commons/icons/reach.svg';
// import { ReactComponent as CMSIcon } from '../../commons/icons/cms-logo.svg';

// import { ReactComponent as Caution } from '../../commons/icons/caution.svg';

import './dashboard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { DASHBOARDS, INSTAGRAM_MEDIA_URL } from '../../commons/constants/url';
import Explanation from '../../commons/components/Explanation';
import ReactImageTooltip from '../../commons/components/ReactImageTooltip';


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




  const customStylesDateSelect = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? config().side_menu_selected_color
        : 'white',
      color: '#666666',
    }),
  };

  const options = [
    { value: 6, label: `${t('過去7日')}` },
    { value: 29, label: `${t('過去30日')}` },
    { value: 179, label: `${t('過去180日')}` },
    { value: 364, label: `${t('過去365日')}` },
    { value: 'custom_range', label: `${t('カスタム日付')}` },
    { value: 'custom_range', label: `${t('カスタム期間')}` },
  ];

  const [selectedOptionDate, setSelectedOptionDate] = useState(6);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const [setDateRange] = useState([null, null]);

  const [setFilterStartEndDate] = useState({
    startDate: moment().subtract(6, 'd').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  const handleChangeDate = (event) => {
    console.log('event', event);
    if (event.value === 'custom_range') {
      setIsOpenDatePicker(true);
      setSelectedOptionDate(event.value);
      return;
    }
    setDateRange([null, null]);
    setIsOpenDatePicker(false);

    const dateTo = moment().subtract(event.value, 'd').format('YYYY-MM-DD');
    const dateFrom = moment().format('YYYY-MM-DD');
    setFilterStartEndDate({
      startDate: dateTo,
      endDate: dateFrom,
    });
    console.log('date start and end', dateTo, dateFrom);
    setSelectedOptionDate(event.value);
  };

  const handleChangeDatepicker = async (update) => {
    const [localStartDate, localEndDate] = update;
    setDateRange(update);
    if (localStartDate && localEndDate) {
      const dateTo = moment(localStartDate).format('YYYY-MM-DD');
      const dateFrom = moment(localEndDate).format('YYYY-MM-DD');
      setFilterStartEndDate({
        startDate: dateTo,
        endDate: dateFrom,
      });
    }
  };

  


  return (
    <div className="dashboard-page">
      {menuMode === 'sidebar' ? (
        <Explanation screen="DASHBOARD" isPhraseDisp />
      ) : (
        <></>
      )}

      <div className="selectors-menu">
      <Button variant="contained">ロケーション選択</Button>

      <Box
            className="mobile-margin-top-10 desktop-margin-left-20"
            style={{ position: 'relative' }}
            flex="1"
          >
            <Select
              components={{
                DropdownIndicator,
                IndicatorSeparator: () => null,
              }}
              styles={customStylesDateSelect}
              className="select-width-select-days"
              closeMenuOnSelect
              options={options}
              defaultValue={selectedOptionDate}
              value={options.filter(
                (option) => option.value === selectedOptionDate,
              )}
              onChange={(event) => handleChangeDate(event, '', '')}
            />
            {isOpenDatePicker && (
              <DateRangePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                handlerOnChange={handleChangeDatepicker}
                dateFormat="yyyy/MM/dd"
                placeholderText={t('top:COMMON.DATA_RANGE_PLACEHOLDER')}
              />
            )}
            
            <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={dateChangeHandler}
            customInput={<DatePickerIcon />}
            shouldCloseOnSelect={false}
            popperPlacement={menuMode === 'sidebar' ? 'top-end' : 'top-start'}
          />
           

          </Box>

      </div>
      <div className="container">
      <div className="filter-pages">
        <div className="filters">
        <CDropdown direction="dropup">
            <CDropdownToggle href="#">
              <FilterIcon height={13} width={13} />
              <div className="filtertitle">FILTERS</div>
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
              <div className="cell w25p">
                <InstaIcon className="icon-svg insta-icon" />
                {t('dashboard:COLUMNS.CAPTION')}
              </div>
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
              <div className="cell w5p">
              <EngagementIcon className="icon-svg" /> &nbsp;
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
              <ImpressionsIcon className="icon-svg" /> &nbsp;
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
              <ReachIcon className="icon-svg" /> &nbsp;
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
                <div className="row" key={item.id}>
                  <div className="cell w10p">
                    {dayjs
                      .utc(item?.post_datetime)
                      .tz(tz)
                      .format('YYYY/MM/DD')}
                  </div>
                  <div className="cell w15p">{item?.location?.name}</div>
                  <div className="cell w25p content">
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
                  <div className="cell w5p">
                    {item?.instagram_media?.like_count}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.comments_count}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.favorite_count}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.engagement}
                  </div>
                  <div className="cell w5p">
                    {item?.instagram_media?.impressions}
                  </div>
                  <div className="cell w5p">{item?.instagram_media?.reach}</div>
                  <div className="cell w7d5p column">
                    {!item?.is_gmb_post_deleted ? (
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
                            deletePost(item?.id, item?.location?.id)
                          }
                        >
                          <DeleteIcon height={20} width={20} />
                        </div>
                      </>
                    ) : (
                      <div className="deleted">{t('dashboard:DELETED')}</div>
                    )}
                  </div>
                  <div className="cell w5p column">
                    {item?.is_line_official_post ? (
                      <div className="linePosted">{t('dashboard:POSTED')}</div>
                    ) : (
                      <div className="lineUnPosted">
                        {t('dashboard:UNPOSTED')}
                      </div>
                    )}
                  </div>

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

      <div className="table-pagination">
       <div className="itemcount">
         {t('dashboard:LIST')} ({itemCount})
       </div>
        <div className="pages">
         <Pagination
            current={page}
           last={lastPage}
           onPageChange={pageChangeHandler}
           />
        </div>
      </div>

    </div>
    </div>
  );
}

export default Dashboard;
