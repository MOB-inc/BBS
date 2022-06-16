/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';

import useFetch from 'use-http';
import { useMount } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LOCATIONS_LIST, INQUIRY } from '../../../commons/constants/url';
import { errorMessageGenerator } from '../../../commons/helpers/validation';
import Explanation from '../../../commons/components/Explanation';
import config from '../../../OEMConfig';
import { ReactComponent as SIcon } from '../../../commons/icons/sendArrow.svg';

import './inquiry.scss';



const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function Inquiry() {
	const classes = useStyles();
  const [age, setAge] = React.useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
            <FormControl className={classes.margin}>
              <InputLabel>
                {t('common:INQUIRY:LOCATION')}
              </InputLabel>
              <NativeSelect
                input={<BootstrapInput />}
                onChange={(event) => setLocationId(event.target.value)}
                value={locationId}
              >
                <option value={0}>Location</option>
                {locations.map((l) => {
                  return (
                    <option key={l.id} value={l.id}>
                      {l.name?.length > 15
                        ? `${l.name.slice(0, 15)}...`
                        : l.name}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          </div>
          <div className="input">
            <div>{t('common:INQUIRY:INQUIRY')}</div>
            <TextareaAutosize
              aria-label="minimum height"
              // minRows={3}
              placeholder="Minimum 3 rows"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<SIcon />}
            onClick={sendHandler}
            // disabled={!(contents?.length > 0)}
          >
            送る
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => history.goBack()}
          >
            戻る
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
