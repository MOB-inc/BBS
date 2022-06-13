/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import useFetch from 'use-http';
import { useMount } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LOCATIONS_LIST, INQUIRY } from '../../../commons/constants/url';
import Button from '../../../commons/components/Button';
import { errorMessageGenerator } from '../../../commons/helpers/validation';
import Explanation from '../../../commons/components/Explanation';
import config from '../../../OEMConfig';

import './inquiry.scss';

function Inquiry() {
  const { t } = useTranslation();
  const history = useHistory();
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState(0);
  const [contents, setContents] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  const { get: getLocations } = useFetch(LOCATIONS_LIST, {
    onNewData: (old, fresh) => {
      const {
        result: { data },
      } = fresh;
      setLocations(data);
      return fresh;
    },
  });

  const { post: sendInquiry } = useFetch(INQUIRY);

  useMount(() => {
    getLocations();
  });

  const sendHandler = async () => {
    const resp = await sendInquiry({
      location_id: locationId,
      contents,
    });
    if (resp.success) {
      setApiMessage(resp.message);
    } else {
      setApiMessage(errorMessageGenerator(resp));
    }
  };

  return (
    <div className="inquiry-page">
      {!apiMessage ? (
        <>
          <div className="input">
            <Explanation screen="INQUIRY" />
            <div>{t('common:INQUIRY:LOCATION')}</div>
            <select
              onChange={(event) => setLocationId(event.target.value)}
              value={locationId}
            >
              <option value={0}>Select</option>
              {locations.map((l) => {
                return (
                  <option key={l.id} value={l.id}>
                    {l.name?.length > 15 ? `${l.name.slice(0, 15)}...` : l.name}
                  </option>
                );
              })}
            </select>
          </div>
          <br />
          <br />
          <div className="input">
            <div>{t('common:INQUIRY:INQUIRY')}</div>
            <textarea
              className="textarea"
              name=""
              rows={5}
              onChange={(event) => setContents(event.target.value)}
            />
          </div>
          <br /> <br />
          <Button onClick={sendHandler} disabled={!(contents?.length > 0)}>
            {t('common:INQUIRY:SEND')}
          </Button>
          <br />
          <Button type="reset" onClick={() => history.goBack()}>
            {t('common:INQUIRY:RETURN')}
          </Button>
          {config().inquiries_phone_number && (
            <div className="contact">
              <p className="phone-message">
                {t('common:INQUIRY:TELEPHONE_MESSAGE')}
              </p>
              <p className="phone-number">{config().inquiries_phone_number}</p>
              <p className="phone-hour">{config().inquiries_phone_hour}</p>
            </div>
          )}
        </>
      ) : (
        <div>{apiMessage}</div>
      )}
    </div>
  );
}

export default Inquiry;
