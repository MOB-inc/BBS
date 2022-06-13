import React, { useState, useEffect, useContext } from 'react';
import useFetch from 'use-http';
import Navigation from '../navigation';
import Switch from '../../../commons/components/Switch';
import StarRating from '../../../commons/components/Rating';
import Explanation from '../../../commons/components/Explanation';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/arrow-up.svg';
import { LOCATION_INFORMATIONS } from '../../../commons/constants/url';
import { AppContext } from '../../../commons/helpers/appContext';
import Pagination from '../../../commons/components/Pagination';
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

  const pageChangeHandler = (p) => {
    setPage(p);
  };

  return (
    <div className="location-info">
      {menuMode === 'sidebar' && (
        <>
          <Explanation screen="LOCATION_INFO" />
          <Navigation />
        </>
      )}
      <div className="pages">
        <Pagination
          current={page}
          last={lastPage}
          onPageChange={pageChangeHandler}
        />
      </div>
      <div className="info-content">
        <div className="tab-container">
          <table className="table">
            <thead>
              <tr>
                <th className="wide">ロケーション名</th>
                <th className="w70">
                  <img
                    src="/icons/instagram-logo.svg"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  投稿数{' '}
                  <span className="filter">
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
                <th className="w70">
                  <img
                    src="/icons/instagram-logo.svg"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  フォロワー
                  <span className="filter">
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
                <th className="w70">
                  <img
                    src="/icons/instagram-logo.svg"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  フォロー
                  <span className="filter">
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

                {/* フィード連携は常にONのためコメントアウト */}
                {/* <th className="w70">
                  <img
                    src="/icons/instagram.png"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  フィード
                  <br />
                  連携
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

                <th className="semi-wide small-font">
                  <img
                    src="/icons/google-logo.svg"
                    alt="google"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ハッシュタグ連携
                </th>

                {/* 未連携のためコメントアウト */}
                {/* <th className="w70">
                  <img
                    src="/icons/instagram.png"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ストーリー
                  <br />
                  連携
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
                <th className="semi-wide">
                  <img
                    src="/icons/google-logo.svg"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  評価
                  <span className="filter">
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
                <th className="w70">
                  <img
                    src="/icons/google-logo.svg"
                    alt="instagram"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ☆２以下
                  <span className="filter">
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

                <th className="w70 small-font">
                  <img
                    src="/icons/google-logo.svg"
                    alt="google"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  写真連携
                </th>
                <th className="semi-wide small-font">
                  <img
                    src="/icons/line-logo.svg"
                    alt="line"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  ハッシュタグ連携
                </th>
                <th className="w70">
                  <img
                    src="/icons/line-logo.svg"
                    alt="line"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  送信数/上限
                  <span className="filter">
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
                <th className="w70">
                  <img
                    src="/icons/line-logo.svg"
                    alt="line"
                    height={20}
                    width={20}
                  />{' '}
                  <br />
                  友だち数
                  <span className="filter">
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
                  <th className="semi-wide small-font">
                    <img
                      src="/icons/cms-logo.svg"
                      alt="cms"
                      height={20}
                      width={20}
                    />{' '}
                    <br />
                    ハッシュタグ連携
                  </th>
                )}
                <th className="w60 small-font">全体投稿連携</th>
              </tr>
            </thead>
            <tbody>
              {infoList.map((info) => {
                return (
                  <tr key={info?.id}>
                    <td className="wide ellipsis">{info?.location?.name}</td>
                    <td className="w70">{info.posting_number || 0}</td>
                    <td className="w70">{info.no_of_followers || 0}</td>
                    <td className="w70">{info.no_of_followings || 0}</td>

                    {/* 未連携のためコメントアウト */}
                    {/* <td className="w70">
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

                    <td className="semi-wide">
                      <Switch
                        id={`ig-${info.id}`}
                        checked={info.hashtag_linkage_flag === 1}
                        onChange={(event) =>
                          locationUpdateHandler({
                            id: info.id,
                            location_id: info?.location?.id,
                            hashtag_linkage_flag: event.currentTarget.checked
                              ? 1
                              : 0,
                          })
                        }
                      />
                      <div style={{ fontSize: '10px' }}>
                        {info.hashtag_linkage_flag
                          ? '#拡散 が付いた投稿のみ連携'
                          : 'すべての投稿を連携'}
                      </div>
                    </td>

                    {/* 未連携のためコメントアウト */}
                    {/* <td className="w70">
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
                    <td className="semi-wide">
                      <div style={{ fontSize: '10px' }}>{info.rating || 0}</div>
                      <StarRating value={info.rating || 0} />
                    </td>
                    <td className="w70">{info?.two_or_less}</td>
                    <td className="w70">
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
                          ? '『写真』連携ON'
                          : '『写真』連携OFF'}
                      </div>
                    </td>

                    <td className="semi-wide">
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
                      <div style={{ fontSize: '10px' }}>
                        {info.line_hashtag_flag
                          ? '#LINEまたは#lineが付いた投稿のみ連携'
                          : 'すべての投稿を連携'}
                      </div>
                    </td>
                    {/* 未連携のためコメントアウト */}
                    {/* <td className="w60">
                      <Switch id={`cms-${info.id}`} />
                    </td> */}
                    {/* 未連携のためコメントアウト */}
                    {/* <td className="w60">
                      <Switch id={`tiktok-${info.id}`} />
                    </td>
                    <td className="w60">
                      <Switch id={`hpb-${info.id}`} />
                    </td> */}
                    <td className="w70">
                      {info.line_official_total_usage || 0}/
                      {info.line_official_quota || 0}
                    </td>
                    <td className="w70">{info.line_official_followers || 0}</td>
                    {config().is_show_splan && (
                      <td className="semi-wide">
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
                        <div style={{ fontSize: '10px' }}>
                          {info.splan_hashtag_flag
                            ? '#CMSまたは#cmsが付いた投稿のみ連携'
                            : 'すべての投稿を連携'}
                        </div>
                      </td>
                    )}
                    <td className="w60">
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
        </div>
      </div>
    </div>
  );
}

export default LocationInfo;
