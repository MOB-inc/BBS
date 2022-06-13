export const errorMessageGenerator = (errorResponse = {}) => {
  const { message = '', errors } = errorResponse;
  let fieldWiseError = '';
  if (errors) {
    if (errors?.details) {
      fieldWiseError += errors?.message ? `${errors.message} , ` : '';
      // eslint-disable-next-line no-restricted-syntax
      for (const detail of errors?.details) {
        // eslint-disable-next-line no-restricted-syntax
        for (const error of detail.errorDetails) {
          fieldWiseError += `${error.message} , `;
        }
      }
    } else {
      Object.keys(errors).forEach((error) => {
        // concatenate field and global message
        fieldWiseError += `${errors[error].join(', ')}`;
      });
    }
  }
  // eslint-disable-next-line no-nested-ternary
  return fieldWiseError !== '' ? fieldWiseError : message || null;
};

export const passwordValidation = (password) => {
  // atleast 1 digit
  // atleast 1 alphabet
  // atleast 6 digit to max 255 digit
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,255}$/;
  const result = reg.test(password);
  return result;
};

export const comparingPassword = (reset, confirm) => {
  // comparing two password
  if (reset === confirm) {
    return true;
  }
  return false;
};
export function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function isOnlyNumber(number) {
  const reg = /^\d*\.?\d{0,2}$/;
  const result = reg.test(number);
  return result;
}

export function isLengthValid(field) {
  if (field.length <= 255) {
    return true;
  }
  return false;
}

export function notEmptyOrLengthInvalid(field) {
  if (field.length > 0 && field.length <= 750) {
    return true;
  }
  return false;
}

export function phoneNumberLength(number) {
  if (number.length >= 7 && number.length <= 14) {
    return true;
  }
  return false;
}

export function phoneNumberValidation(number) {
  const reg = /^\d{2,4}-\d{2,4}-\d{3,4}$/;
  const result = reg.test(number);
  return result;
}

export function isLessOrEqualEightChar(number) {
  if (number.length <= 8) {
    return true;
  }
  return false;
}

export function isUrlPattern(url) {
  const regex = /^http(s?):\/\/.*/;
  const result = regex.test(url);
  return result;
}

export function notMediaUrl(url) {
  const regex = /\b(tabelog|r.gnavi|hotpepper|ubereats|loco.yahoo)\b/;
  const result = regex.test(url);
  return !result;
}

export function notNullOrEmpty(input) {
  return input !== null && input !== '';
}

export function profileImageValidation(width, height, size) {
  if (width <= 5000 && height <= 5000 && size >= 10240) {
    return true;
  }
  return false;
}

export function coverImageValidation(width, height) {
  if (width >= 480 && width <= 2120 && height >= 270 && height <= 1192) {
    return true;
  }
  return false;
}

export function commonImageValidation(width, height) {
  if (width >= 250 && width <= 10000 && height >= 250 && height <= 10000) {
    return true;
  }
  return false;
}

// アップロードするCSVの上限サイズチェック。
// ひとまず200KBまでとした
export function csvSizeValidation(size) {
  if (size <= 204800) {
    return true;
  }
  return false;
}
