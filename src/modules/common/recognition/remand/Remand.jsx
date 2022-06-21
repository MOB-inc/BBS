import React, { useContext, useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import * as dayjs from 'dayjs';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { AppContext } from '../../../../commons/helpers/appContext';
import Navigation from '../navigation/navigation';
import Pagination from '../../../../commons/components/Pagination/index';
// import Explanation from '../../../../commons/components/Explanation';
import { REMANDING_REQUEST } from '../../../../commons/constants/url';
import { ReactComponent as ArrowDown } from '../../../../commons/icons/arrow_d.svg';
import { ReactComponent as ArrowUp } from '../../../../commons/icons/arrow_u.svg';
import { ReactComponent as SearchIcon } from '../../../../commons/icons/search-icon.svg';
import { ReactComponent as AntenaIcon } from '../../../../commons/icons/antena.svg';
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
    let query = `?page=${page}`;
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
  }
  return (
    <div className="remand">
      {/* <Explanation screen="REMAND" /> */}
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
          <Button className="button" variant="contained" size="large">{t('recognition:APPROVAL.SEARCH_BUTTON')}</Button>
        </div>
        <div className="table">
          <p style={{color:"#cc0099",textAlign:"left",paddingLeft:"12px",paddingTop:"12px"}}><AntenaIcon style={{marginRight:"12px",marginBottom:"4px"}}/>FILTERS</p>
          <div className="thead">
            <div className="row">
              {/* <div className="cell w10p">
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div> */}
              <div className="cell w15p">
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
                {t('recognition:REMAND.REMAND_DATE_TIME')}
                &nbsp; &nbsp; &nbsp;
                <span
                  className={`${
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
              <div className="cell w20p">
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
              {/* <div className="cell w7d5p">
                {t('recognition:REMAND.NO_OF_STORE')}
              </div> */}
              <div className="cell w15p">
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
              <div className="cell w20p">
                {t('recognition:REMAND.CONTENTS')}
              </div>
              {/* <div className="cell w7d5p">{t('recognition:REMAND.TYPE')}</div> */}
              <div className="cell w15p">{t('recognition:REMAND.NUM')}</div>
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
                    <div className="cell w10p">
                      {dayjs
                        .utc(item?.post_datetime)
                        .tz(tz)
                        .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                    </div>
                    <div className="cell w10p">
                      {dayjs
                        .utc(item?.remand_datetime)
                        .tz(tz)
                        .format('YYYY/MM/DD \xa0\xa0\xa0 HH:mm')}
                    </div>
                    <div className="cell w15p">{item?.user_name}</div>
                    <div className="cell w7d5p">{item?.no_of_store}</div>
                    <div className="cell w15p">{item?.location_name}</div>
                    <div className="cell w20p content">{item?.contents}</div>
                    <div className="cell w7d5p">
                      {item?.type === 1 ? 'GBP投稿' : '口コミ返信'}
                    </div>
                    <div className="cell w15p">{item?.reason_for_remand}</div>
                  </div>
                );
              })}
          </div>
        </div>
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
