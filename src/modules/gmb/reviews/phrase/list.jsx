import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useMount, useDebounce } from 'ahooks';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { LOCATION_LIST } from '../../../../commons/constants/url';
import Pagination from '../../../../commons/components/Pagination';
import Input from '../../../../commons/components/Input';
import { ReactComponent as SearchIcon } from '../../../../commons/icons/search.svg';

import './list.scss';

function LocationList({ url, allLocations, allLocationsSelect }) {
  const history = useHistory();
  const route = useRouteMatch(`${url}/:id`);
  const { t } = useTranslation(['gmb']);
  const { get, response } = useFetch(LOCATION_LIST);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, { wait: 250 });

  useMount(async () => {
    const params = {
      page,
      pagination_no: 30,
    };
    const resp = await get(`?${new URLSearchParams(params).toString()}`);
    if (response.ok) {
      setLocations(resp?.result?.data);
      setLastPage(resp?.result?.pagination?.total_pages || 1);
      if (!route?.params?.id && resp?.result?.data?.[0].id) {
        history.push(`/gmb/reviews/fixed-phrase/allLocations`);
      }
    }
  });

  useEffect(async () => {
    const params = {
      page,
      pagination_no: 30,
    };
    const serchQuery = searchText ? `&searchName=${searchText}` : '';
    const resp = await get(
      `?${new URLSearchParams(params).toString()}${serchQuery}`,
    );
    if (response.ok) {
      setLocations(resp?.result?.data);
      setLastPage(resp?.result?.pagination?.total_pages || 1);
    }
  }, [page]);

  useEffect(async () => {
    const params = {
      page: 1,
      pagination_no: 30,
    };
    const serchQuery = searchText ? `&searchName=${searchText}` : '';
    const resp = await get(
      `?${new URLSearchParams(params).toString()}${serchQuery}`,
    );
    if (response.ok) {
      setPage(1);
      setLocations(resp?.result?.data);
      setLastPage(resp?.result?.pagination?.total_pages || 1);
    }
  }, [debouncedSearchText]);

  const pageChangeHandler = (p) => {
    setPage(p);
  };

  if (allLocationsSelect && !allLocations && locations[0]?.id) {
    history.push(`${url}/${locations[0].id}`);
  }
  return (
    <div className="gmb-location-list">
      <div className="search-box">
        <div className="search-input">
          <Input
            height={25}
            value={searchText}
            onChange={(event) => setSearchText(event?.target?.value)}
          />
        </div>
        <SearchIcon height={23} width={23} />
      </div>
      <div className="pages">
        <Pagination
          current={page}
          last={lastPage}
          onPageChange={pageChangeHandler}
        />
      </div>
      <div className="header item">{t('gmb:REVIEWS.PHRASE.LIST_HEADER')}</div>
      <div className="body">
        {allLocations && page === 1 && (
          <div className="item">
            <NavLink to={`${url}/allLocations`} activeClassName="active">
              {t('gmb:REVIEWS.PHRASE.ALL_LOCATIONS')}
            </NavLink>
          </div>
        )}
        {locations.map((loc) => {
          return (
            <div className="item" key={loc.id}>
              <NavLink to={`${url}/${loc.id}`} activeClassName="active">
                {loc.name}
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}

LocationList.propTypes = {
  url: PropTypes.string.isRequired,
  allLocations: PropTypes.bool,
  allLocationsSelect: PropTypes.bool,
};

LocationList.defaultProps = {
  allLocations: false,
  allLocationsSelect: false,
};

export default LocationList;
