import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { LANGUAGES, DEFAULT_LANG } from './commons/constants/key';

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: LANGUAGES,
    fallbackLng: DEFAULT_LANG,
    defaultNS: 'common',
    ns: 'common',
    debug: process.env.REACT_APP_ENV === 'dev',
    lng: DEFAULT_LANG, // ja -> japanese, en -> english
  });

export default i18n;
