import React, { useEffect, useState, useMemo} from 'react';
import { Route, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetch from 'use-http';
import * as dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Navigation from '../navigation';
import LocationList from '../list';
import { LOCATION_INFO_BY_LOCATION_ID } from '../../../commons/constants/url';
import Explanation from '../../../commons/components/Explanation';
// import { AppContext } from '../../../commons/helpers/appContext';
import './contract.scss';

dayjs.extend(customParseFormat);

function Info() {
  const { id } = useParams();
  const [info, setInfo] = useState();
  const { t } = useTranslation(['location']);

  const { get, response } = useFetch(
    id ? LOCATION_INFO_BY_LOCATION_ID(id) : null,
  );
  useEffect(async () => {
    const resp = await get();
    if (response.ok) {
      setInfo(resp?.result);
    }
  }, [id]);

  return (
    <div className="info">
      <table className="table">
        <thead>
          <tr>
            <th>{t('location:CONTRACTOR.STORE_CLERK')}</th>
            <th>{t('location:CONTRACTOR.DETAILS')}</th>
            <th>{t('location:CONTRACTOR.START_DATE')}</th>
            <th>{t('location:CONTRACTOR.END_DATE')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{info?.location_person}</td>
            <td>{info?.location_detail || "instagram連携"}</td>
            <td>
              {dayjs(info?.contract_start, 'YYYY-MM-DD').format('YYYY/MM/DD')}
            </td>
            <td>
              {dayjs(info?.contract_end, 'YYYY-MM-DD').format('YYYY/MM/DD')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function CustomerInfo() {
  const NavigationMemo = useMemo(() => <Navigation />, []); 
  return (
    <div className="customer-info">
      <div className="head">
          <Explanation screen="CONTRACT" />
          <LocationList url="/locations/contract" />
      </div>
      {NavigationMemo}
      <div className="customer-content">
        <Route path="/locations/contract/:id">
          <Info />
        </Route>
      </div>
    </div>
  );
}

export default CustomerInfo;
