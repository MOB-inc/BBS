import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SearchIcon } from '../../icons/search-icon.svg';
import './index.scss';


const SearchForm = () => {
	const { t } = useTranslation(['location']);
	const [searchText, setSerchText] = useState("");
  const handleSearch = (event) => {
    setSerchText(event.target.value);
  }

	return(
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
	)
}

export default SearchForm;