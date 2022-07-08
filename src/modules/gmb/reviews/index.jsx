import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import { Route, useHistory } from 'react-router-dom';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTooltip,
} from '@coreui/react';
import useFetch from 'use-http';
import * as dayjs from 'dayjs';
import Navigation from '../navigation';
import Rating from '../../../commons/components/Rating';
// import Button from '../../../commons/components/Button';
import Pagination from '../../../commons/components/Pagination';
import { REVIEWS } from '../../../commons/constants/url';
import { parameterizeArray } from '../../../commons/helpers/util';
import { AppContext } from '../../../commons/helpers/appContext';
import { ReactComponent as CalendarIcon } from '../../../commons/icons/calendar.svg';
import { ReactComponent as CautionIcon } from '../../../commons/icons/caution.svg';
import { ReactComponent as FilterIcon } from '../../../commons/icons/filter.svg';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/arrow-up.svg';
import { ReactComponent as Gear } from '../../../commons/icons/gear.svg';
import { STAR_MAP } from './constant';

import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

const FixedPhrase = React.lazy(() => import('./phrase/phrase'));
const DisplayModal = React.lazy(() => import('./modals/display'));
const BulkModal = React.lazy(() => import('./modals/bulk'));
const tz = dayjs.tz.guess();
// eslint-disable-next-line react/prop-types
const DatePickerIcon = React.forwardRef(({ onClick }, ref) => (
  <CalendarIcon height={30} width={30} onClick={onClick} ref={ref} />
));
function Reviews() {
  const { t } = useTranslation(['common', 'gmb']);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState();
  const [lastPage, setLastPage] = useState(1);
  const [listCount, setListCount] = useState(0);
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkIds, setBulkIds] = useState(new Set());
  const [bulkReply, setBulkReply] = useState(false);
  const [bulkLocationIds, setBulkLocationIds] = useState(new Set());
  const [notRepliedCount, setNotRepliedCount] = useState(0);
  const [noReplyRequiredCount, setNoReplyRequiredCount] = useState(0);
  const [remandCount, setRemandCount] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [reviews, setReviews] = useState([]);
  const [pageItemCount, setPageItemCount] = useState(30);
  const [displayId, setDisplayId] = useState();
  const [locationId, setLocationId] = useState();
  const [orderField, setOrderField] = useState();
  const [checkedNoComment, setCheckedNoComment] = useState(false); // 「コメントのなし」のチェック
  const [orderType, setOrderType] = useState('desc');
  const { get: getReviews } = useFetch(`${REVIEWS}`);
  const { locations, menuMode } = useContext(AppContext);
  const STATUS_MAP = {
    1: t('common:REVIEW.STATUS.NOT_REPLIED'),
    2: t('REVIEW.STATUS.APPLIED'),
    3: t('REVIEW.STATUS.REMAND'),
    5: t('REVIEW.STATUS.PUBLISHED'),
    6: t('REVIEW.STATUS.REVIEW_DELETE'),
  };
  const history = useHistory();

  const pageChangeHandler = (p) => {
    setPage(p);
  };

  const toggleBulkId = (id, locId) => {
    if (!bulkIds.has(id)) {
      bulkIds.add(id);
      bulkLocationIds.add(locId);
    } else {
      bulkIds.delete(id);
      bulkLocationIds.delete(locId);
    }
    setBulkIds(new Set(bulkIds));
    setBulkLocationIds(new Set(bulkLocationIds));
  };

  const toggleBulkIds = (event) => {
    event.stopPropagation();
    if (bulkIds.size === reviews?.length) {
      setBulkIds(new Set());
      setBulkLocationIds(new Set());
    } else {
      const ids = reviews?.map((review) => review?.id);
      setBulkIds(new Set(ids));
      const locId = reviews?.map((review) => review?.location?.id);
      setBulkLocationIds(new Set(locId));
    }
  };

  const toggleCheckedNoComment = () => {
    setCheckedNoComment(!checkedNoComment);
  };

  const loadReviews = async () => {
    if (filter === 99) return;
    const query = {
      page,
      pagination_no: pageItemCount,
    };
    if (filter) {
      if (filter === 'NO_REPLY_REQUIRED') {
        query.status = 1;
        query.is_no_reply_required = 1;
      } else if (filter === 1) {
        query.status = filter;
        query.is_no_reply_required = 0;
      } else {
        query.status = filter;
      }
    }

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
    if (checkedNoComment && bulkReply && filter === 1) {
      query.no_comment = true;
    }
    const locationParams = parameterizeArray('locations', locations);
    const response = await getReviews(
      `?${new URLSearchParams(query).toString()}${
        locations.length ? locationParams : ''
      }`,
    );
    setReviews(response?.result?.data);
    setLastPage(response?.result?.pagination?.total_pages || 1);
    setListCount(response?.result?.summary?.listCount);
    setNotRepliedCount(response?.result?.summary?.notRepliedCount);
    setNoReplyRequiredCount(response?.result?.summary?.noReplyRequiredCount);
    setRemandCount(response?.result?.summary?.remandCount);
  };

  const dateChangeHandler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const display = (id, location) => {
    setDisplayId(id);
    setLocationId(location);
  };

  const displayCloseHandler = () => {
    setDisplayId();
    loadReviews();
  };

  const bulkCloseHandler = () => {
    setBulkModal(false);
    loadReviews();
  };

  const setOrder = (field, type) => {
    setOrderField(field);
    setOrderType(type);
  };

  const bulkReplyHandler = () => {
    if (filter === 1 && !bulkReply) {
      setBulkReply(true);
      setCheckedNoComment(false);
    } else if (bulkIds.size > 0) setBulkModal(true);
  };

  useEffect(() => {
    loadReviews();
    setBulkIds(new Set());
    setBulkLocationIds(new Set());
    setBulkReply(false);
  }, [
    page,
    filter,
    startDate,
    endDate,
    pageItemCount,
    orderField,
    orderType,
    locations,
  ]);

  useEffect(() => {
    loadReviews();
  }, [checkedNoComment]);

  return (
    <div className="reviews-page">
      <div className="header">
        {menuMode === 'sidebar' && <Navigation />}
        {/* {filter === 1 ? ( */}
        {/* ↑一時的にスタイルあてるためにコメントアウト20220708aikou */}
        <Button onClick={bulkReplyHandler} disabled={filter !== 1 && bulkReply}>
          {t('gmb:REVIEWS.BULK_REPLY')}
        </Button>
        {/* ) : (
          ''
        )} */}
        {/* ↑一時的にスタイルあてるためにコメントアウト20220708aikou */}
			</div>
			<ScrollContainer hideScrollbars="false">
							{/* ↑ドラッグスクロール機能 */}
			<div className='wrapper'>
				<div className="filter-pages">
					<div className="filters">
						<div
							role="presentation"
							className={!filter ? 'active' : ''}
							onClick={() => setFilter()}
						>
							{t('gmb:REVIEWS.LIST')} ({listCount})
						</div>
						<div
							role="presentation"
							className={filter === 1 ? 'active' : ''}
							onClick={() => setFilter(1)}
						>
							{t('gmb:REVIEWS.NOT_REPLIED')} ({notRepliedCount}) &nbsp;{' '}
							{notRepliedCount > 0 && <CautionIcon width={24} height={24} />}
						</div>
						<div
							role="presentation"
							className={filter === 'NO_REPLY_REQUIRED' ? 'active' : ''}
							onClick={() => setFilter('NO_REPLY_REQUIRED')}
						>
							{t('gmb:REVIEWS.NO_REPLY_REQUIRED')} ({noReplyRequiredCount}) &nbsp;{' '}
						</div>
						<div
							role="presentation"
							className={filter === 3 ? 'active' : ''}
							onClick={() => setFilter(3)}
						>
							{t('gmb:REVIEWS.REMAND')} ({remandCount}) &nbsp;{' '}
							{remandCount > 0 && <CautionIcon width={24} height={24} />}
						</div>
						<div
							role="presentation"
							className={filter === 99 ? 'active' : ''}
							onClick={() => {
								setFilter(99);
								history.push('/gmb/reviews/fixed-phrase');
							}}
						>
							<Gear width={22} height={22} />
							&nbsp; {t('gmb:REVIEWS.SETTING')}
						</div>
						{filter !== 99 && (
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
						)}
					</div>
					{filter !== 99 && (
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
									<CDropdownItem href="#">{t('gmb:REVIEWS.WANT')}</CDropdownItem>
									<CDropdownItem href="#" onClick={() => setPageItemCount(30)}>
										30 {t('gmb:REVIEWS.ITEM')}
									</CDropdownItem>
									<CDropdownItem href="#" onClick={() => setPageItemCount(100)}>
										100 {t('gmb:REVIEWS.ITEM')}
									</CDropdownItem>
									<CDropdownItem href="#" onClick={() => setPageItemCount(200)}>
										200 {t('gmb:REVIEWS.ITEM')}
									</CDropdownItem>
								</CDropdownMenu>
							</CDropdown>
						</div>
					)}
				</div>
				{filter !== 99 ? (
					<div className="list">
						<div className="table">
							<div className="thead">
								<div className="row">
									<div className="cell w15p">
										<div className="start">
											{bulkReply && (
												<input
													type="checkbox"
													checked={bulkIds.size === reviews?.length}
													onChange={toggleBulkIds}
												/>
											)}
										</div>
										<div className="center">
											{t('gmb:REVIEWS.DATE_TIME')}
											&nbsp; &nbsp; &nbsp;
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
									</div>
									<div className="cell w15p">
										{t('gmb:REVIEWS.LOCATION')}
										&nbsp; &nbsp;
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
										{t('gmb:REVIEWS.REVIEW')}
										{bulkReply && (
											<div className="check-comment">
												<CTooltip
													content={t('gmb:REVIEWS.REVIEW_COMMENT_TOOLTIP')}
													placement="top"
												>
													<label htmlFor="no-comment">
														<input
															type="checkbox"
															checked={checkedNoComment}
															onChange={toggleCheckedNoComment}
															id="no-comment"
														/>
														<span className="empty-text">
															{t('gmb:REVIEWS.EMPTY_SEARCH')}
														</span>
													</label>
												</CTooltip>
											</div>
										)}
									</div>
									<div className="cell w25p">{t('gmb:REVIEWS.REPLY')}</div>
									<div className="cell w10p">
										{t('gmb:REVIEWS.EVALUATION')}
										&nbsp; &nbsp; &nbsp;
										<span
											className={`${orderField === 'rating' ? 'highlight' : ''}`}
										>
											{orderType === 'asc' && orderField === 'rating' ? (
												<ArrowUp onClick={() => setOrder('rating', 'desc')} />
											) : (
												<ArrowDown onClick={() => setOrder('rating', 'asc')} />
											)}
										</span>
									</div>
									<div className="cell w10p">
										{t('gmb:REVIEWS.STATUS')}&nbsp;
										<span
											className={`${orderField === 'status' ? 'highlight' : ''}`}
										>
											{orderType === 'asc' && orderField === 'status' ? (
												<ArrowUp onClick={() => setOrder('status', 'desc')} />
											) : (
												<ArrowDown onClick={() => setOrder('status', 'asc')} />
											)}
										</span>
									</div>
								</div>
							</div>
							<div className="tbody">
								{reviews?.map((review) => {
									return (
										<div
											className="row"
											role="presentation"
											key={review?.id}
											onClick={() => display(review?.id, review?.location?.id)}
										>
											<div className="cell w15p">
												<div className="start">
													{bulkReply && (
														<input
															type="checkbox"
															checked={bulkIds.has(review?.id)}
															onClick={(event) => event.stopPropagation()}
															onChange={() =>
																toggleBulkId(review?.id, review?.location?.id)
															}
														/>
													)}
												</div>
												{review?.post_datetime &&
													dayjs
														.utc(review?.post_datetime)
														.tz(tz)
														.format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
											</div>
											<div className="cell w15p">{review?.location?.name}</div>
											<div
												className="cell w25p content"
												style={{ fontSize: '11px' }}
												title={review?.review_comment}
											>
												{review?.review_comment}
											</div>
											<div
												className="cell w25p content"
												style={{ fontSize: '11px' }}
												title={review?.reply}
											>
												{review?.reply}
											</div>
											<div className="cell w10p">
												<Rating value={STAR_MAP[review?.gmb_star_rating]} />
											</div>
											<div
												className={`cell w10p ${
													[1, 3].includes(review?.status) ? 'highlight' : ''
												} ${review?.status === 6 && 'deleted'}
											`}
											>
												{STATUS_MAP[review?.status]}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				) : (
					<>
						<Route path="/gmb/reviews/fixed-phrase/:id?">
							<FixedPhrase />
						</Route>
					</>
				)}
			</div>
			</ ScrollContainer>
      <DisplayModal
        id={displayId}
        onClose={displayCloseHandler}
        remand={filter === 3}
        locationId={locationId}
      />
      <BulkModal
        show={bulkModal}
        ids={Array.from(bulkIds)}
        onClose={bulkCloseHandler}
        bulkLocationIds={Array.from(bulkLocationIds)}
      />
    </div>
  );
}

export default Reviews;
