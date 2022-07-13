/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useContext, useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useTranslation } from 'react-i18next';
import { CTooltip } from '@coreui/react';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '../../../commons/components/Switch';
import {
  LINE_SETTINGS,
  USERS_NOTIFICATION_SETTINGS,
} from '../../../commons/constants/url';
import './notification.scss';
import { AppContext } from '../../../commons/helpers/appContext';
import config from '../../../OEMConfig';
import { ReactComponent as QuestionIcon } from '../../../commons/icons/question.svg';

function Notification() {
  const { t } = useTranslation(['common']);
  const { user, setUser } = useContext(AppContext);
  const [lineStatus, setLineStatus] = useState(
    user?.line_access_token !== null,
  );
  const { post: linkLine, response: lineLinkStatus } = useFetch(LINE_SETTINGS);
  const { put: updateUser } = useFetch(
    user?.id ? USERS_NOTIFICATION_SETTINGS(user?.id) : null,
  );

  const handleLineLinkage = async () => {
    const resp = await linkLine({ user_id: user?.id });
    if (lineLinkStatus.ok) {
      window.location = resp?.result?.redirect_url;
    }
  };
  const notificationUpdateHandler = async (params) => {
    const resp = await updateUser(params);
    if (resp.success) {
      setUser(resp.result);
      setLineStatus(resp.result.line_access_token !== null);
    }
  };

  useEffect(() => {
    notificationUpdateHandler({ user_id: user?.id });
  }, []);

  return (
    <div className="notification-settings">
      {config().is_line_notification && (
        <div className="line-login">
          <button
            type="button"
            className="button line"
            onClick={handleLineLinkage}
          >
            <span className="login">{t('common:NOTIFICATION.LINE_LOGIN')}</span>
          </button>
          <div className="question">
            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {t('common:NOTIFICATION.LINE_LOGIN_DESC')}
                </span>
              }
              placement="right"
							arrow="true"
							className='notification-tool tip'
            >
              <QuestionIcon className="question" />
            </Tooltip>
          </div>
          <div className="status">
            <img
              src="/icons/line.png"
              alt="LINE"
              height="30px"
              width="30px"
              style={{ borderRadius: '5px' }}
            />
            <div className={lineStatus ? `linked` : ''}>
              {lineStatus
                ? t('common:NOTIFICATION.STATUS_CONNECTED')
                : t('common:NOTIFICATION.STATUS_DISCONNECTED')}
            </div>{' '}
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="table">
          <tr>
            <th rowSpan="2">{t('common:NOTIFICATION.REVIEW')}</th>
            <th>メール通知</th>
            {config().is_line_notification && <th>LINE通知</th>}
          </tr>
          <tr key={user?.id}>
            <td>
              <Switch
                id={`review-email-${user.id}`}
                checked={user?.is_review_notification_email === 1}
                onChange={(event) =>
                  notificationUpdateHandler({
                    user_id: user?.id,
                    is_review_notification_email: event.currentTarget.checked
                      ? 1
                      : 0,
                  })
                }
              />
            </td>
            {config().is_line_notification && (
              <td>
                <CTooltip
                  content={t('common:NOTIFICATION.LINE_DISABLED_TOOLTIP')}
                >
                  <Switch
                    id={`review-line-${user.id}`}
                    disabled={!lineStatus}
                    checked={user?.is_review_notification_line === 1}
                    onChange={(event) =>
                      notificationUpdateHandler({
                        user_id: user?.id,
                        is_review_notification_line: event.currentTarget.checked
                          ? 1
                          : 0,
                      })
                    }
                  />
                </CTooltip>
              </td>
            )}
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Notification;
