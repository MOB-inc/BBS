import React, { useState, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useTranslation } from 'react-i18next';
import Navigation from '../navigation';
import Switch from '../../../commons/components/Switch';

import StarRating from '../../../commons/components/Rating';
import Explanation from '../../../commons/components/Explanation';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow_d.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/arrow_u.svg';
import { ReactComponent as SearchIcon } from '../../../commons/icons/search-icon.svg';
import { LOCATION_INFORMATIONS } from '../../../commons/constants/url';
import { AppContext } from '../../../commons/helpers/appContext';
import Pagination from '../../../commons/components/Pagination';
import { ReactComponent as InstaIcon } from '../../../commons/icons/insta-trans.svg';
import { ReactComponent as GoogleIcon } from '../../../commons/icons/google-icon.svg';
import { ReactComponent as LineIcon } from '../../../commons/icons/line-icon.svg';
import { ReactComponent as QuesIcon } from '../../../commons/icons/question.svg';

import './info.scss';
import config from '../../../OEMConfig';

function LocationInfo() {
  const { menuMode } = useContext(AppContext);
  const [infoList, setInfoList] = useState([]);
  const [sorts, setSorts] = useState({});
  const { get: getLocationInfo, response: getResponse } = useFetch(
    LOCATION_INFORMATIONS,
  );
  const { put: updateLocationInfo, response: updateResponse } = useFetch(
    `${LOCATION_INFORMATIONS}`,
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(async () => {
    const query = {
      page,
      pagination_no: 30,
    };
    console.log(query);
    if (sorts?.field) query[sorts?.field] = sorts?.order;
    const resp = await getLocationInfo(
      `?${new URLSearchParams(query).toString()}`,
    );
    if (getResponse.ok) {
      setInfoList(resp?.result?.data);
      setLastPage(resp?.result?.pagination?.total_pages || 1);
    }
  }, [sorts, page]);
  const locationUpdateHandler = async (params) => {
    const resp = await updateLocationInfo(`/${params.id}`, params);
    if (updateResponse.ok) {
      const newInfo = infoList.map((info) => {
        if (info.id === resp?.result?.id) {
          const { location } = info;
          // eslint-disable-next-line camelcase
          const { location_id, ...rest } = resp.result;
          return { location, ...rest };
        }
        return info;
      });
      setInfoList(newInfo);
    }
  };
  const [searchText, setSerchText] = useState("");
  const handleSearch = (event) => {
    setSerchText(event.target.value);
  }
  const pageChangeHandler = (p) => {
    setPage(p);
  };
  const { t } = useTranslation(['location']); 
  return (
    <div className="location-info">
      {menuMode === 'sidebar' && (
        <>
          <div className="head">
            <Explanation screen="LOCATION_INFO" />
          </div>
          <Navigation />
        </>
      )}
      
      <div className="info-content">
        <div className="tab-container">
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
            placeholder={t('location:CONTRACTOR.SEARCH')}
          />
          </div>
          <ScrollContainer hideScrollbars='false'> 
          {/* ???????????????????????????????????? */}
          <table className="table">
            <thead>
              <tr>
                <th colSpan="1"> </th>
                <th colSpan="3" className=""><InstaIcon/> </th>
                <th colSpan="4" className=""><GoogleIcon/> </th>
                <th colSpan="3" className=""><LineIcon/> </th>
                {config().is_show_splan === undefined ? 
                  <th colSpan="1" style={{width:'100px'}}> </th>
                  : <th colSpan="2" style={{width:'200px'}}> </th>
                }
                {console.log(config().is_show_splan === undefined ? 1 : 2)}
              </tr>
              <tr>
                <th className="">?????????????????????</th>
                {/* <th className="">????????????????????????</th> */}
                <th className="">
                  ?????????{' '}
                  <span className={`${
                    sorts?.field === 'posting_number' ? 'highlight filter' : 'filter'
                  }`}>
                    {sorts?.field === 'posting_number' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'posting_number', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'posting_number', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th>
                <th className="">
                  ???????????????
                  <span className={`${
                    sorts?.field === 'no_of_followers' ? 'highlight filter' : 'filter'
                  }`}>
                    {sorts?.field === 'no_of_followers' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'no_of_followers', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'no_of_followers', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th>
                <th className="">
                  ????????????
                  <span className={`${
                    sorts?.field === 'no_of_followings' ? 'highlight filter' : 'filter'
                  }`}>
                    {sorts?.field === 'no_of_followings' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({
                            field: 'no_of_followings',
                            order: 'desc',
                          })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'no_of_followings', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th>

                {/* ???????????????????????????ON?????????????????????????????? */}
                {/* <th className="">
                  <img
                    src="/icons/instagram.png"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ????????????
                  <br />
                  ??????
                  <span className="filter">
                    {sorts?.field === 'linkage_of_feed' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'linkage_of_feed', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({
                            field: 'linkage_of_feed',
                            order: 'asc',
                          })
                        }
                      />
                    )}
                  </span>
                      </th> */}
                <th className=" small-font">
                  ????????????
                </th>
                <th className=" small-font">
                  #??????
                  <Tooltip title={t('location:TOOLTIPS.GOOGLE_LINK')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip>
                </th>

                {/* ??????????????????????????????????????? */}
                {/* <th className="">
                  <img
                    src="/icons/instagram.png"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ???????????????
                  <br />
                  ??????
                  <span className="filter">
                    {sorts?.field === 'linkage_of_story' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'linkage_of_story', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'linkage_of_story', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th> */}
                <th>
                  ??????
                  <span className={`${ sorts?.field === 'rating' ? 'highlight filter' : 'filter' }`}>
                    {sorts?.field === 'rating' && sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'rating', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'rating', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th>
                <th>
                  ????????????
                  <span className={`${ sorts?.field === 'two_or_less' ? 'highlight filter' : 'filter' }`}>
                    {sorts?.field === 'two_or_less' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({ field: 'two_or_less', order: 'desc' })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({ field: 'two_or_less', order: 'asc' })
                        }
                      />
                    )}
                  </span>
                </th>
                <th className=" small-font">
                  #??????
                  <Tooltip title={t('location:TOOLTIPS.LINE_LINK')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip>
                </th>
                <th className="">
                  ?????????/??????
                  <span className={`${ sorts?.field === 'line_official_total_usage' ? 'highlight filter' : 'filter' }`}>
                    {sorts?.field === 'line_official_total_usage' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({
                            field: 'line_official_total_usage',
                            order: 'desc',
                          })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({
                            field: 'line_official_total_usage',
                            order: 'asc',
                          })
                        }
                      />
                    )}
                  </span>
                </th>
                <th className="">
                  ????????????
                  <span className={`${ sorts?.field === 'line_official_followers' ? 'highlight filter' : 'filter' }`}>
                    {sorts?.field === 'line_official_followers' &&
                    sorts?.order === 'asc' ? (
                      <ArrowUp
                        onClick={() =>
                          setSorts({
                            field: 'line_official_followers',
                            order: 'desc',
                          })
                        }
                      />
                    ) : (
                      <ArrowDown
                        onClick={() =>
                          setSorts({
                            field: 'line_official_followers',
                            order: 'asc',
                          })
                        }
                      />
                    )}
                  </span>
                </th>
                {config().is_show_splan && (
                  <th className=" small-font">
                    <img
                      src="/icons/cms-logo.svg"
                      alt="cms"
                      height={20}
                      width={20}
                    />{' '}
                    <br />
                    #??????
                  </th>
                )}
                <th className=" small-font">??????????????????
                  <Tooltip title={t('location:TOOLTIPS.ALL_LINK')} arrow interactive style={{cursor:"pointer"}} >
                    <QuesIcon style={{width:"15px",marginLeft:"4px",paddingBottom: "2px"}}/>
                  </Tooltip></th>
              </tr>
            </thead>
            <tbody>
              {infoList.map((info) => {
                return (
                  <tr key={info?.id}>
                    <Tooltip title={info?.location?.name} arrow interactive style={{cursor:"pointer"}}>
                      <td className="over">
                        {info?.location?.name}
                      </td>
                    </Tooltip>
                    {/* <Tooltip title={info?.location?.name} arrow interactive style={{cursor:"pointer"}}>
                      <td className="over">{info?.location?.name}</td>
                    </Tooltip> */}
                    <td className="">{info.posting_number || 0}</td>
                    <td className="">{info.no_of_followers || 0}</td>
                    <td className="">{info.no_of_followings || 0}</td>

                    {/* ??????????????????????????????????????? */}
                    {/* <td className="">
                      <Switch
                        id={`follow-${info.id}`}
                        checked={info.linkage_of_feed === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            linkage_of_feed: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                      </td> */}
                    <td className="">
                      <Switch
                        id={`photo${info.id}`}
                        checked={info.photo_linkage_flag === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            photo_linkage_flag: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                    </td>
                    <td className="">
                      <Switch
                        id={`ig-${info.id}`}
                        checked={info.hashtag_linkage_flag === 1}
                        onChange={(event) => {
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            hashtag_linkage_flag: event.currentTarget.checked
                              ? 1
                              : 0,
                            });
                        }}
                      />
                      
                    </td>

                    {/* ??????????????????????????????????????? */}
                    {/* <td className="">
                      <Switch
                        id={`story-${info.id}`}
                        checked={info.linkage_of_story === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            linkage_of_story: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                      </td> */}
                    <td className="">
                      <StarRating value={info.rating || 0} />
                    </td>
                    <td className="">{info?.two_or_less}</td>
                    {/* <td className="">
                      <Switch
                        id={`photo${info.id}`}
                        checked={info.photo_linkage_flag === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            photo_linkage_flag: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                      <div style={{ fontSize: '10px' }}>
                        {info.photo_linkage_flag
                          ? '??????????????????ON'
                          : '??????????????????OFF'}
                      </div>
                    </td> */}

                    <td className="">
                      <Switch
                        id={`line-${info.id}`}
                        checked={info.line_hashtag_flag === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            line_hashtag_flag: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                    </td>
                    {/* ??????????????????????????????????????? */}
                    {/* <td className="w60">
                      <Switch id={`cms-${info.id}`} />
                    </td> */}
                    {/* ??????????????????????????????????????? */}
                    {/* <td className="w60">
                      <Switch id={`tiktok-${info.id}`} />
                    </td>
                    <td className="w60">
                      <Switch id={`hpb-${info.id}`} />
                    </td> */}
                    <td className="">
                      {info.line_official_total_usage || 0}/
                      {info.line_official_quota || 0}
                    </td>
                    <td className="">{info.line_official_followers || 0}</td>
                    {config().is_show_splan && (
                      <td className="">
                        <Switch
                          id={`splan${info.id}`}
                          checked={info.splan_hashtag_flag === 1}
                          onChange={(event) =>
                            locationUpdateHandler({
                              id: info.id,
                              location_id: info?.location?.id,
                              splan_hashtag_flag: event.currentTarget.checked
                                ? 1
                                : 0,
                            })
                          }
                        />
                      </td>
                    )}
                    <td className="">
                      <Switch
                        id={`follow-${info.id}`}
                        checked={info.linkage_of_feed === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            linkage_of_feed: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </ScrollContainer>

          <div className="pages" style={{display:"none"}}>
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

export default LocationInfo;
