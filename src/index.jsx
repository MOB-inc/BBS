import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { StylesProvider } from '@material-ui/core/styles';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.scss';
import './i18n';

Sentry.init({
  dsn: 'https://166dcce919cf497581b153c4199a7dc8@o1170889.ingest.sentry.io/6265624',
  environment: process.env.REACT_APP_ENV,
  integrations: [new BrowserTracing()],
  release: process.env.REACT_APP_SENTRY_RELEASE,
  tracesSampleRate: 0.1,
});

ReactDOM.render(
  <StylesProvider injectFirst>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StylesProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
