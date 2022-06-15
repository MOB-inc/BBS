import React, { useContext, useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import * as dayjs from 'dayjs';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { AppContext } from '../../../../commons/helpers/appContext';
import Navigation from '../navigation/navigation';
import Pagination from '../../../../commons/components/Pagination/index';
// import Explanation from '../../../../commons/components/Explanation';
import { APPROVAL_REQUEST } from '../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../../commons/icons/arrow-up.svg';
import { ReactComponent as RemandIcon } from '../../../../commons/icons/remand-icon.svg';
import { ReactComponent as FilterIcon } from '../../../../commons/icons/filter.svg';
import './approval.scss';

const tz = dayjs.tz.guess();

const ApprovalReviewModal = React.lazy(() =>
  import('../modals/approval/ApprovalReviewModal'),
);
const ApprovalPostModal = React.lazy(() =>
  import('../modals/approval/ApprovalPostModal'),
);
const BulkApprovalModal = React.lazy(() =>
  import('../modals/bulk/BulkApprovalModal'),
);

function Approval() {
  const { t } = useTranslation(['recognition', 'gmb']);
  const [approvalList, setApprovalList] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [type, setCurrentType] = useState();
  const [approvalReviewModal, setApprovalReviewModal] = useState(false);
  const [approvalPostModal, setApprovalPostModal] = useState(false);
  const [bulkApprovalModal, setBulkApprovalModal] = useState(false);
  const [orderField, setOrderField] = useState();
  const [orderType, setOrderType] = useState('asc');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [summary, setSummary] = useState({});
  const [pageItemCount, setPageItemCount] = useState(30);
  const [bulkState, setBulkState] = useState(false);
  const [bulkIds, setBulkIds] = useState(new Set());
  const [reviewIds, setReviewIds] = useState(new Set());
  const [postIds, setPostIds] = useState(new Set());
  const [locationId, setLocationId] = useState();
  const { menuMode, setRecognitionCount } = useContext(AppContext);
  const pageChangeHandler = (p) => {
    setPage(p);
  };
  const toggleApprovalReviewModal = () => {
    setApprovalReviewModal(!approvalReviewModal);
  };
  const toggleApprovalPostModal = () => {
    setApprovalPostModal(!approvalPostModal);
  };
  const toggleBulkApprovalModal = () => {
    setBulkApprovalModal(!bulkApprovalModal);
  };
  const onRowClick = (remandType, id, location) => {
    setCurrentId(id);
    setLocationId(location);
    setCurrentType(remandType);
    if (remandType === 1) {
      toggleApprovalPostModal();
    } else {
      toggleApprovalReviewModal();
    }
  };
  const toggleBulkId = (id, itemType) => {
    if (!bulkIds.has(id)) {
      if (itemType === 1) {
        postIds.add(id);
      } else {
        reviewIds.add(id);
      }
      bulkIds.add(id);
    } else {
      if (itemType === 1) {
        postIds.delete(id);
      } else {
        reviewIds.delete(id);
      }
      bulkIds.delete(id);
    }
    setBulkIds(new Set(bulkIds));
    setPostIds(new Set(postIds));
    setReviewIds(new Set(reviewIds));
  };

  const toggleBulkIds = (event) => {
    event.stopPropagation();
    if (bulkIds.size === approvalList?.length) {
      setBulkIds(new Set());
      setPostIds(new Set());
      setReviewIds(new Set());
    } else {
      const ids = approvalList?.map((item) => item?.id);
      setBulkIds(new Set(ids));
      const revIds = approvalList
        ?.filter((review) => {
          return review?.type === 2;
        })
        .map((review) => {
          return review?.id;
        });
      setReviewIds(new Set(revIds));
      const posIds = approvalList
        ?.filter((post) => {
          return post?.type === 1;
        })
        .map((review) => {
          return review?.id;
        });
      setPostIds(new Set(posIds));
    }
  };
  const { get: getRemandList } = useFetch(APPROVAL_REQUEST);
  const loadApprovalList = async () => {
    let query = `?page=${page}&pagination_no=${pageItemCount}`;
    if (startDate)
      query += `&start_date=${dayjs(startDate)
        .hour(0)
        .minute(0)
        .second(0)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')}`;
    if (endDate)
      query += `&end_date=${dayjs(endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')}`;
    if (orderField) {
      query += `&order_field=${orderField}`;
      if (orderType) query += `&order_type=${orderType}`;
    }
    const response = await getRemandList(query);
    setApprovalList(response?.result?.data);
    setSummary(response?.result?.summary);
    setLastPage(response?.result?.pagination?.total_pages || 1);
    const listCount = response?.result?.summary?.listCount || 0;
    const remandCount = response?.result?.summary?.remandCount || 0;
    setRecognitionCount(listCount + remandCount);
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
  useEffect(() => {
    loadApprovalList();
  }, [page, startDate, endDate, pageItemCount, orderField, orderType]);
  return (
    <div className="approval">
      {/* <Explanation screen="APPROVAL" /> */}
      <button
        type="button"
        className={`bulk-button ${
          menuMode === 'sidebar' ? 'bulk-button--sidebar' : ''
        }`}
        onClick={bulkState ? toggleBulkApprovalModal : () => setBulkState(true)}
        disabled={bulkState && bulkIds.size === 0}
      >
        {t('recognition:APPROVAL.BULK_APPROVAL')}
      </button>
      <div className="filter-pages">
        <Navigation
          summary={summary}
          dateChangeHandler={dateChangeHandler}
          startDate={startDate}
          endDate={endDate}
        />
        <div className="sub-header">
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
      </div>
      <div className="approval-table">
        <div className="table">
          <div className="thead">
            <div className="row">
              <div className="cell w2d5p border-none" />
              <div className="cell w15p">
                <div className="start">
                  {bulkState && (
                    <input
                      type="checkbox"
                      checked={bulkIds.size === approvalList?.length}
                      onChange={toggleBulkIds}
                    />
                  )}
                </div>
                {t('recognition:REMAND.APPLICATION_DATE_TIME')}
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
                {t('recognition:REMAND.APPLICANT')}
                &nbsp; &nbsp; &nbsp;
                <span
                  className={`${orderField === 'user_name' ? 'highlight' : ''}`}
                >
                  {orderType === 'desc' && orderField === 'user_name' ? (
                    <ArrowUp onClick={() => setOrder('user_name', 'asc')} />
                  ) : (
                    <ArrowDown onClick={() => setOrder('user_name', 'desc')} />
                  )}
                </span>
              </div>
              <div className="cell w7d5p">
                {t('recognition:REMAND.NO_OF_STORE')}
              </div>
              <div className="cell w20p">
                {t('recognition:REMAND.LOCATION')}
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
              <div className="cell w30p">
                {t('recognition:REMAND.CONTENTS')}
              </div>
              <div className="cell w7d5p">{t('recognition:REMAND.TYPE')}</div>
            </div>
          </div>
          <div className="tbody">
            {approvalList &&
              approvalList.map((item) => {
                return (
                  <>
                    <div
                      className="row"
                      onClick={() =>
                        onRowClick(item?.type, item?.id, item?.location_id)
                      }
                      role="presentation"
                    >
                      <div className="cell w2d5p border-none">
                        {item.is_remanded === 1 ? (
                          <RemandIcon
                            className="remand-icon"
                            width={15}
                            height={15}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="cell w15p">
                        <div className="start">
                          {bulkState && (
                            <input
                              type="checkbox"
                              checked={bulkIds.has(item?.id)}
                              onClick={(event) => event.stopPropagation()}
                              onChange={() =>
                                toggleBulkId(item?.id, item?.type)
                              }
                            />
                          )}
                        </div>
                        {dayjs
                          .utc(item?.post_datetime)
                          .tz(tz)
                          .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                      </div>
                      <div className="cell w15p">{item?.user_name}</div>
                      <div className="cell w7d5p">{item?.no_of_store}</div>
                      <div className="cell w20p">{item?.location_name}</div>
                      <div className="cell w30p content">{item?.contents}</div>
                      <div className="cell w7d5p">
                        {item.type === 1 ? 'GBP投稿' : '口コミ返信'}
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
      <ApprovalReviewModal
        type={type}
        currentId={currentId}
        reloadList={loadApprovalList}
        modal={approvalReviewModal}
        closeModal={toggleApprovalReviewModal}
        locationId={locationId}
      />
      <ApprovalPostModal
        type={type}
        currentId={currentId}
        reloadList={loadApprovalList}
        modal={approvalPostModal}
        closeModal={toggleApprovalPostModal}
      />
      <BulkApprovalModal
        modal={bulkApprovalModal}
        closeModal={toggleBulkApprovalModal}
        reviewIds={Array.from(reviewIds)}
        postIds={Array.from(postIds)}
        reloadList={loadApprovalList}
      />
    </div>
  );
}

export default Approval;