import React, { useContext } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { AppContext } from '../helpers/appContext';
import { ENGLISH_KEY, JAPANESE_KEY } from '../constants/key';
import config from '../../OEMConfig';

function LangToggler() {
  const { lang, changeLang } = useContext(AppContext);
  return (
    <CDropdown>
      <CDropdownToggle caret style={{ color: config().header_text_color }}>
        {lang.toUpperCase()}
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={() => changeLang(JAPANESE_KEY)}>
          Japanese
        </CDropdownItem>
        <CDropdownItem onClick={() => changeLang(ENGLISH_KEY)}>
          English
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
}

export default LangToggler;
