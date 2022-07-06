import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useMount, useDebounce } from 'ahooks';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
// import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box'; 
// import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import { LOCATION_LIST, LOCATION_FOR_INSTAGRAM} from '../../commons/constants/url';
import config from '../../OEMConfig';

// import Pagination from '../../commons/components/Pagination';
// import Input from '../../commons/components/Input';
// import { ReactComponent as SearchIcon } from '../../commons/icons/search.svg';
import { ReactComponent as ArrowDown } from '../../commons/icons/arrow-down-select.svg';
import './list.scss';

function LocationList({ url, allLocations, allLocationsSelect }) {
  const history = useHistory();
  const route = useRouteMatch(`${url}/:id`);
  const { t } = useTranslation(['location']);
  const { get, response } = useFetch(LOCATION_LIST);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);
  // const [searchText, setSearchText] = useState('');
  const [searchText] = useState('');
  const [locationsArr, setLocationsArr] = useState([]);
  const debouncedSearchText = useDebounce(searchText, { wait: 250 });
  const [selectedValue, setSelectedValue] = useState('');
  const { get: getLocations } = useFetch(LOCATION_FOR_INSTAGRAM);
  useMount(async () => {
    const params = {
      page,
      pagination_no: 30,
    };
    const resp = await get(`?${new URLSearchParams(params).toString()}`);
    if (response.ok) {
      setLocations(resp?.result?.data);
      // setLastPage(resp?.result?.pagination?.total_pages || 1);
      if (!route?.params?.id && resp?.result?.data?.[0].id) {
        history.push(`${url}/${resp?.result?.data?.[0].id}`);
      }
    }
    const url2 = window.location.pathname;
    if(url2.match(/linkage/) || url2.match(/contract/) || url2.match(/phrase/)){
      // const elem2 = document.getElementById('locName');
      console.log("ttt");
      // elem2.innerHTML = "abc";
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
      // setLastPage(resp?.result?.pagination?.total_pages || 1);
      if (!route?.params?.id && resp?.result?.data?.[0].id) {
        history.push(`${url}/${resp?.result?.data?.[0].id}`);
      }
    }
  }, [page]);


  useEffect(() => {
    if (
      locationsArr &&
      locationsArr.length > 0 &&
      locationsArr[0].value !== undefined
    ) {
      setSelectedValue(locationsArr[0].value);
    }

  }, [locationsArr]);
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
      // setLastPage(resp?.result?.pagination?.total_pages || 1);
      if (!route?.params?.id && resp?.result?.data?.[0].id) {
        history.push(`${url}/${resp?.result?.data?.[0].id}`);
      }
    }
  }, [debouncedSearchText]);

  // const pageChangeHandler = (p) => {
  //   setPage(p);
  // };
  // const output = (event) => {
  //   const path = window.location.pathname;
  //   if( path.match(/fixed_phrases/) || path.match(/linkage/)){
  //     const elem = document.getElementById("locName");
  //     elem.innerHTML = event.target.value;
  //   }
  // };  
  if (allLocationsSelect && !allLocations) {
    history.push(`${url}/${locations[0].id}`);
  }
  // const { t } = useTranslation(['location']);
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const GreenRadio = withStyles({
    root: {
      color: '#000000',
      '&$checked': {
        color: config().side_menu_color,
      },
    },
    checked: {},
  })((props) => {
    return <Radio color="default" {...props} />;
  });
  const { Option } = components;
  const IconOption = (props) => {
  const { data, value } = props;
  
    console.log('value in select option', value, selectedValue);
    return (
      <Option {...props}>
        <Box display="flex" alignItems="center">
          <Box>
            <GreenRadio
              checked={selectedValue === value}
              // onChange={(event) => handleChange(event,value,"r")}
              value={value}
              name="radio-buttons"
              label={data.label}
              size="small"
              color={config().side_menu_color}
              inputProps={{ 'aria-label': 'A' }}
              className="radio"
            />
          </Box>
          <Box>{data.label}</Box>
        </Box>
        
      </Option>
    );
  };
  IconOption.defaultProps = {
    data: '',
    value: '',
  };
  IconOption.propTypes = {
    data: PropTypes.string,
    value: PropTypes.string,
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'white' : 'white',
      color: '#666666',
    }),
    menu: (styles) => ({
      ...styles,
      width: '330px',
      flexDirection: 'reverse-row',
    }),
  };
  const handleChange = (event) => {
    const url2 = window.location.pathname;
    setSelectedValue(event.value);
    if(url2.match(/linkage/) || url2.match(/phrase/)){
      const elem2 = document.getElementById('locName');
      elem2.innerHTML = event.label;
    }
  };
  const getLocationsData = async () => {
    const responseData = await getLocations();
    if (responseData?.success) {
      const locationArrLoop = responseData.result.data.map((val) => ({
        label: val.name,
        value: val.id,
      }));
      console.log('locationArrLoop', locationArrLoop);      
      setLocationsArr(locationArrLoop);
      const url2 = window.location.pathname;
      if(url2.match(/linkage/) || url2.match(/phrase/)){
        const elem2 = document.getElementById('locName');
        elem2.innerHTML = responseData.result.data[0].name;
      }
    }
  };
  useEffect(() => {
    getLocationsData();
  }, []);
  return (
    <div id="list" className="location-list">
      {/* <div className="search-box">
        <div className="search-input">
          <Input
            height={25}
            value={searchText}
            onChange={(event) => setSearchText(event?.target?.value)}
          />
        </div>
        <SearchIcon height={23} width={23} />
      </div> */}
      {/* <div className="pages">
        <Pagination
          current={page}
          last={lastPage}
          onPageChange={pageChangeHandler}
        />
      </div> */}
      
      {/* <div className="header item">{
      t('location:COMMON:LIST_HEADER')}
      </div> */}
      {/* <div className="body"> */}
        {/* {allLocations && (
          <div className="item">
            <NavLink to={`${url}/allLocations`} activeClassName="active">
              {t('location:COMMON:ALL_LOCATIONS')}
            </NavLink>
          </div>
        )} */}
        
      <FormControl variant="outlined" >
        <InputLabel className="label" htmlFor="outlined-age-native-simple">{t('location:COMMON.LIST_HEADER')}</InputLabel>
        <Select
          components={{
            DropdownIndicator,
            Option: IconOption,
            IndicatorSeparator: () => null,
          }}
          // styles={customStyles}
          // isMulti
          // closeMenuOnSelect
          className="select-width-tree-select-group"
          styles={customStyles}
          options={locationsArr}
          value={locationsArr.filter(
            (option) => option.value === selectedValue,
          )}
          // label={t('location:COMMON.LIST_HEADER')}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => handleChange(event, '', '')}
          />
        {/* <Select components={{ Option: IconOption }} isMulti name="hvhgvghvghvghvh" options={options} /> */}
      </FormControl>
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
