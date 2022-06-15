import config from '../../OEMConfig';

export const BASE_URL = config().api_host;
export const LOGIN = '/login';
export const FORGOT = '/forgot-password';
export const RESET = '/reset-password';
export const SUCCESS = '/success';
export const LOGOUT = '/logout';
export const INQUIRY = '/inquiries';
export const RECOGNITION = '/recognition';
export const NOTIFICATION = '/notification_settings';
export const EMAIL_SUCCESS = '/email-success';
export const USERS = '/users';
export const USERS_NOTIFICATION_SETTINGS = (id) =>
  `${USERS}/${id}/notification_settings`;
export const LOCATIONS = '/locations';
export const LOCATION_INFO_BY_LOCATION_ID = (id) =>
  `${LOCATIONS}/${id}/location-information-by-location`;
export const LOCATION_LIST = '/locationList';
export const MENU_CATEGORIES = '/menu_categories';
export const CATEGORIES_BY_LOCATION = '/categories-by-location';
export const MENUS_BY_CATEGORY = '/menus-by-category';
export const MENUS = '/menus';
export const SERVICES = '/services';
export const PRODUCTS = '/products';
export const MENUS_CSV_DOWNLOAD = (id) => `${MENUS}/${id}/csv-download`;
export const MENUS_CSV_UPLOAD = 'menus/csv-upload';
export const LOCATION_INFO = '/location/location-information';
export const INSTAGRAM_SETTINGS = '/instagram_settings';
export const INSTAGRAM_SETTINGS_BY_LOCATION = `${INSTAGRAM_SETTINGS}/by-location`;
export const GMB_SETTINGS = '/gmb_settings';
export const LINE_SETTINGS = '/line_settings';
export const LINE_OFFICIAL_SETTINGS = `/line_official_settings`;
export const LINE_OFFICIAL_SETTINGS_BY_LOCATION = `${LINE_OFFICIAL_SETTINGS}/by-location`;
export const SPLAN_SETTINGS = `/splan_settings`;
export const SPLAN_SETTINGS_BY_LOCATION = `${SPLAN_SETTINGS}/by-location`;
export const GMB_SETTINGS_BY_LOCATION = `${GMB_SETTINGS}/by-location`;
export const LOCATION_INFORMATIONS = '/location_informations';
export const FIXED_PHRASES = '/phrase';
export const FIXED_PHRASE_BY_LOCATION = (id, serviceType) =>
  `${LOCATIONS}/${id}/fixed-phrase-by-location/${serviceType}`;
export const FIXED_REVIEW_PHRASES = '/fixed_review_phrases';
export const FIXED_REVIEW_PHRASE_BY_LOCATION = (id) =>
  `${LOCATIONS}/${id}/fixed-review-phrase-by-location`;
export const REVIEW_AUTOREPLY_SETTINGS = '/review-autoreply-settings';
export const REVIEW_AUTOREPLY_SETTINGS_BY_LOCATION = (id) =>
  `${LOCATIONS}/${id}/review-autoreply-settings-by-location`;
export const FIXED_REVIEW_PHRASE_SELECT = (id) =>
  `${FIXED_REVIEW_PHRASES}/${id}/by-location`;
export const BASIC_INFO_GET = '/basic-information-by-location';
export const BASIC_INFORMATIONS = '/basic_informations';
export const PREFECTURES = '/prefectures';
export const GROUPS = '/groups';
export const BUSINESS_CATEGORY = '/business-categories';
export const BULK_UPDATE = `${BASIC_INFORMATIONS}/bulk-edit`;
export const PHOTO_CATEGORIES = '/photo-categories';
export const GMB_PHOTOS = '/gmb_photos';
export const PHOTO_BY_LOCATION = '/basic-gmb-photo-by-location';
export const REVIEWS = '/reviews';
export const SERVICES_ITEMS = '/service_items';
export const REMANDING_REQUEST = '/remanding_requests';
export const BUTTON_TYPES = '/button/types';
export const CATEGORY_TYPES = '/categories';
export const REPLY_DELETE = '/reply/delete';
export const REPLY = '/reply';
export const DASHBOARDS = '/dashboards';
export const GMB_POST = '/gmb_posts';
export const GMB_POST_DELETE = (postId, locationId) =>
  `${GMB_POST}/${postId}/locations/${locationId}`;
export const APPROVAL_REQUEST = '/approving_requests';
export const APPROVE = '/approve';
export const REMAND = '/remand';
export const BULK = '/bulk';
export const LOCATIONS_LIST = '/location/list';
export const LOCATION_BOOKS = '/location/books';
export const LOCATION_SERVICE_ITEM = '/location/location-with-service-items';
export const SERVICE_ITEM_BY_LOCATION = '/service-items-by-location';
export const ALL_ATTRIBUTES = '/all_attributes';
export const LOCATION_FACEBOOK_PAGES = (id) =>
  `${LOCATIONS}/${id}/facebook_pages`;
export const INSTAGRAM_MEDIA_URL = 'instagram_media_url';
export const INSTAGRAM_DASHBOARD = (location, startDate, endDate) =>
  `/top/instagram?locations[]=${location}&start_date=${startDate}&end_date=${endDate}`;
export const LINE_DASHBOARD = (location, startDate, endDate) =>
  `/top/line?locations[]=${location}&start_date=${startDate}&end_date=${endDate}`;
export const GOOGLE_DASHBOARD = (location, startDate, endDate) =>
  `/top/google?locations[]=${location}&start_date=${startDate}&end_date=${endDate}`;
export const LOCATION_FOR_INSTAGRAM = '/location/for-instagram';
export const LOCATION_FOR_GBP = '/location/for-gbp';
export const LOCATION_FOR_LINE = '/location/for-line';
