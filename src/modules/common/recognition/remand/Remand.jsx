import React, { useContext, useState, useEffect, useMemo } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import * as dayjs from 'dayjs';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { AppContext } from '../../../../commons/helpers/appContext';
import Navigation from '../navigation/navigation';
import Pagination from '../../../../commons/components/Pagination/index';
// import Explanation from '../../../../commons/components/Explanation';
import { REMANDING_REQUEST } from '../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow_d.svg';
import { ReactComponent as ArrowUp } from '../../../../commons/icons/arrow_u.svg';
import { ReactComponent as SearchIcon } from '../../../../commons/icons/search-icon.svg';
import { ReactComponent as FilterIcon } from '../../../../commons/icons/antena.svg';
import './remand.scss';

const tz = dayjs.tz.guess();

const RemandPostModal = React.lazy(() => import('../modals/RemandPostModal'));
const RemandReviewModal = React.lazy(() =>
  import('../modals/RemandReviewModal'),
);

function Remand() {
  const { t } = useTranslation(['recognition']);
  const [remandPostModal, setRemandPostModal] = useState(false);
  const [remandReviewModal, setRemandReviewModal] = useState(false);
  const [remandList, setRemandList] = useState([]);
  const [summary, setSummary] = useState({});
  const [currentId, setCurrentId] = useState();
  const [type, setCurrentType] = useState();
  const [orderField, setOrderField] = useState();
  const [orderType, setOrderType] = useState('asc');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [locationId, setLocationId] = useState();
  const { setRecognitionCount } = useContext(AppContext);
  const [pageItemCount, setPageItemCount] = useState(30);
  const toggleRemandPostModal = () => {
    setRemandPostModal(!remandPostModal);
  };
  const toggleRemandReviewModal = () => {
    setRemandReviewModal(!remandReviewModal);
  };
  const pageChangeHandler = (p) => {
    setPage(p);
  };
  
  const onRowClick = (remandType, id, location) => {
    setCurrentId(id);
    setLocationId(location);
    setCurrentType(remandType);
    if (remandType === 1) {
      toggleRemandPostModal();
    } else {
      toggleRemandReviewModal();
    }
  };
  const dateChangeHandler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const { get: getRemandList } = useFetch(REMANDING_REQUEST);
  const loadRemandList = async () => {
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
    setRemandList(response?.result?.data);
    setSummary(response?.result?.summary);
    setLastPage(response?.result?.pagination?.total_pages || 1);
    const listCount = response?.result?.summary?.listCount || 0;
    const remandCount = response?.result?.summary?.remandCount || 0;
    setRecognitionCount(listCount + remandCount);
  };
  const setOrder = (field, orderingType) => {
    setOrderField(field);
    setOrderType(orderingType);
  };
  useEffect(() => {
    loadRemandList();
  }, [page, startDate, endDate, orderField, orderType]);
  const [searchText, setSerchText] = useState("");
  const handleSearch = (event) => {
    setSerchText(event.target.value);
  };
  const NavigationMemo = useMemo(() => <Navigation 
  summary={summary}
  dateChangeHandler={dateChangeHandler}
  startDate={startDate}
  endDate={endDate} />, []); 
  return (
    <div className="remand">
      {/* <Explanation screen="REMAND" /> */}
      { NavigationMemo }
      <div className="filter-pages">
        {/* <Navigation
          summary={summary}
          dateChangeHandler={dateChangeHandler}
          startDate={startDate}
          endDate={endDate}
        /> */}
        <div className="sub-header" style={{display:"none"}}>
          <Pagination
            current={page}
            last={lastPage}
            onPageChange={pageChangeHandler}
          />
        </div>
      </div>
      <div className="remand-table">
        <div className="flex">
          <TextField
            label=""
            id=""
            className="search"
            InputProps={{
              startAdornment: <InputAdornment position="end"><SearchIcon className="searchIcon"/></InputAdornment>,
            }}
            variant="outlined"
            onChange={handleSearch}
            value={searchText}
            placeholder={t('recognition:APPROVAL.SEARCH_BUTTON')}
          />
        </div>
        <ScrollContainer hideScrollbars='false'>
          <div className="table">
            <div className="filter-pages">
              <div className="sub-header">
                <CDropdown direction="dropup">
                  <CDropdownToggle href="#">
                    <p className="filters"><FilterIcon height={12} width={18}/>FILTERS</p>
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
            <div className="thead">
              <div className="row">
                {/* <div className="cell w10p">
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div> */}
                <div className="cell a">
                  {t('recognition:REMAND.APPLICATION_DATE_TIME')}
                  &nbsp;&nbsp;
                  <span
                    className={`filter ${
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
                <div className="cell b">
                  {t('recognition:REMAND.REMAND_DATE_TIME')}
                  &nbsp;&nbsp; 
                  <span
                    className={`filter ${
                      orderField === 'remand_datetime' ? 'highlight' : ''
                    }`}
                  >
                    {orderType === 'desc' && orderField === 'remand_datetime' ? (
                      <ArrowUp
                        onClick={() => setOrder('remand_datetime', 'asc')}
                      />
                    ) : (
                      <ArrowDown
                        onClick={() => setOrder('remand_datetime', 'desc')}
                      />
                    )}
                  </span>
                </div>
                <div className="cell c">
                  {t('recognition:REMAND.APPLICANT')}
                  &nbsp;&nbsp; 
                  <span
                    className={`filter ${orderField === 'user_name' ? 'highlight' : ''}`}
                  >
                    {orderType === 'desc' && orderField === 'user_name' ? (
                      <ArrowUp onClick={() => setOrder('user_name', 'asc')} />
                    ) : (
                      <ArrowDown onClick={() => setOrder('user_name', 'desc')} />
                    )}
                  </span>
                </div>
                {/* <div className="cell w7d5p">
                  {t('recognition:REMAND.NO_OF_STORE')}
                </div> */}
                <div className="cell d">
                  {t('recognition:REMAND.LOCATION')}
                  &nbsp;&nbsp; 
                  <span
                    className={`filter ${
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
                <div className="cell e">
                  {t('recognition:REMAND.CONTENTS')}
                </div>
                <div className="cell f">{t('recognition:REMAND.TYPE')}</div>
                <div className="cell g">{t('recognition:REMAND.NUM')}</div>
              </div>
            </div>
            <div className="tbody">
              {remandList &&
                remandList.map((item) => {
                  return (
                    <div
                      className="row"
                      onClick={() =>
                        onRowClick(item?.type, item?.id, item?.location_id)
                      }
                      role="presentation"
                    >
                      <div className="cell a">
                        {dayjs
                          .utc(item?.post_datetime)
                          .tz(tz)
                          .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                      </div>
                      <div className="cell b">
                        {dayjs
                          .utc(item?.remand_datetime)
                          .tz(tz)
                          .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                      </div>
                      <Tooltip title={item?.user_name} arrow interactive style={{cursor:"pointer"}}>
                        <div className="cell c">{item?.user_name}</div>
                      </Tooltip>
                      {/* <div className="cell w7d5p">{item?.no_of_store}</div> */}
                      <Tooltip title={item?.location_name} arrow interactive style={{cursor:"pointer"}}>
                        <div className="cell d">{item?.location_name}</div>
                      </Tooltip>
                      <Tooltip title={item?.contents} arrow interactive style={{cursor:"pointer"}}>
                        <div className="cell e content">{item?.contents}</div>
                      </Tooltip>
                      <div className="cell f">{item.type === 1 ? 'GBP??????' : '???????????????'}</div>
                      <div className="cell g">
                        {item?.is_remanded}
                        {console.log(item)}
                      </div>
                      {/* <div className="cell w15p">{item?.reason_for_remand}</div> */}
                    </div>
                  );
                })}
            </div>
          </div>
        </ScrollContainer>
      </div>
      <RemandPostModal
        type={type}
        currentId={currentId}
        modal={remandPostModal}
        loadRemandList={loadRemandList}
        closeModal={toggleRemandPostModal}
      />
      <RemandReviewModal
        type={type}
        currentId={currentId}
        modal={remandReviewModal}
        loadRemandList={loadRemandList}
        closeModal={toggleRemandReviewModal}
        locationId={locationId}
      />
    </div>
  );
}

export default Remand;
