import React, { useContext, useState } from 'react';
import useFetch from 'use-http';
import { useMount, useDebounce } from 'ahooks';
// import { CRow, CCol } from '@coreui/react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
// import Input from '../../commons/components/Input';
import { USERS } from '../../commons/constants/url';
import Explanation from '../../commons/components/Explanation';
import { AppContext } from '../../commons/helpers/appContext';
import { ReactComponent as SearchIcon } from '../../commons/icons/search-icon.svg';
import { ReactComponent as CrossIcon } from '../../commons/icons/cross.svg';
import { ReactComponent as CircleIcon } from '../../commons/icons/circle.svg';
import './index.scss';

function UsersPage() {
	// const [searchText2, setSerchText2] = useState('');
  // const handleSearch = (event) => {
  //   setSerchText2(event.target.value);
  // };
  const { menuMode } = useContext(AppContext);
  const history = useHistory();
  const { t } = useTranslation(['user']);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, { wait: 500 });

  const { get: getUsers, response: getUserStatus } = useFetch(
    searchText ? `${USERS}?searchText=${searchText}` : USERS,
    {
      onNewData: (currData, newData) => {
        const {
          result: { data },
        } = newData;
        setUsers(data);
        return newData;
      },
    },
    [debouncedSearchText],
  );

  const loadUsers = async () => {
    const respData = await getUsers();
    if (getUserStatus.ok) setUsers(respData?.result?.data);
  };

  const editHandler = (id) => {
    history.push(`/users/edit/${id}`);
  };

  useMount(async () => {
    loadUsers();
  });

  return (
    <div className="user-page">
      {menuMode === 'sidebar' && <Explanation screen="USER_MANAGE" />}
      <NavLink to="/users/create">
        <Button>{t('user:CREATE:BUTTON')}</Button>
      </NavLink>
      <div className="container">
        <div className="search-bar">
          {/* <Input
            autoComplete="off"
            onChange={(event) => setSearchText(event.target.value)}
          /> */}
          <TextField
            // label=""
            // id=""
            autoComplete="off"
            onChange={(event) => setSearchText(event.target.value)}
            className="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon className="searchIcon" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            // onChange={handleSearch}
            // value={searchText2}
            placeholder={t('user:EDIT.SEARCH')}
          />
					<Button className="button" variant="contained" size="large">
						{t('user:EDIT.SEARCH_BTN')}
					</Button>
        </div>
        {/* <div className="search-icon">
          <SearchIcon height={23} width={23} />
        </div> */}
        <div className="list">
          <div className="table">
            <div className="thead">
              <div className="row">
                <div className="cell w15p">
                  {t('user:TABLE.COLUMNS.USERNAME')}
                </div>
                <div className="cell w20p">{t('user:TABLE.COLUMNS.ID')}</div>
                <div className="cell w5p">
                  {t('user:TABLE.COLUMNS.MANAGEMENT_COUNT')}
                </div>
                <div className="cell w15p">
                  {t('user:TABLE.COLUMNS.LOCATION')}
                </div>
                <div className="cell w15p">
                  {t('user:TABLE.COLUMNS.APPROVAL')}
                </div>
                <div className="cell w10p">
                  {t('user:TABLE.COLUMNS.CONNECTED')}
                </div>
                <div className="cell w10p">
                  {t('user:TABLE.COLUMNS.FIXED_PHRASE')}
                </div>
                <div className="cell w10p" />
              </div>
            </div>
            <div className="tbody">
              {users?.map((item) => {
                return (
                  <div className="row" key={item.id}>
                    <div className="cell w15p">{item.name}</div>
                    <div className="cell w20p">{item.email}</div>
                    <div className="cell w5p">{item.locations?.length}</div>
                    <div className="cell w15p scroll">
                      {item.locations?.map((l) => l.name).join('\r\n')}
                    </div>
                    <div className="cell w15p" style={{ whiteSpace: 'pre' }}>
                      {item.approvers?.map((a) => a.name).join('\r\n')}
                    </div>
                    <div className="cell w10p">
                      {item.is_linkage_authority === 1 ? (
                        <CircleIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </div>
                    <div className="cell w10p">
                      {item.is_fixed_sentence_edit_authority === 1 ? (
                        <CircleIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </div>
                    <div className="cell w10p">
                      {item.roles[0].name !== 'admin' && (
                        <Button
                          height={24}
                          width={74}
                          onClick={() => editHandler(item.id)}
                        >
                          {t('user:EDIT:BUTTON')}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
