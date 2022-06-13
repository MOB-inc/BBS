import { createContext } from 'react';
import { DEFAULT_LANG } from '../constants/key';

export const AppContext = createContext({
  menuMode: 'horizontal',
  hasServiceItems: true,
  hasFoodMenus: true,
  setMenuMode: () => {},
  token: null,
  lang: DEFAULT_LANG,
  user: null,
  selectedLocationID: null,
  setToken: () => {},
  changeLang: () => {},
  setUser: () => {},
  isAdmin: false,
  services: new Set(),
  groups: [],
  locations: [],
  setGroups: () => {},
  setLocations: () => {},
  recognitionCount: 0,
  setRecognitionCount: () => {},
  closeSidebar: true,
  setCloseSidebar: () => {},
  setSelectedLocationID: () => {},
  setHasFoodMenus: () => {},
});

export default AppContext;
