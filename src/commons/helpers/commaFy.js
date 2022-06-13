export default function commafy(num) {
  let returnVal;
  // if (num % 10 === 0) {
  if (Math.abs(num) > 99999) {
    console.log('Math.sign(num)', `${num.toString().slice(0, -3)}k`);
    // returnVal = `${Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1))}k`;
    returnVal = `${num.toString().slice(0, -3)}k`;
  } else {
    const str = num.toString().split('.');
    if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 4) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    returnVal = str.join('.');
  }

  // } else {
  // 	const str = num.toString().split('.');
  // 	if (str[0].length >= 4) {
  // 		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  // 	}
  // 	if (str[1] && str[1].length >= 4) {
  // 		str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  // 	}
  // 	returnVal = str.join('.');
  // }
  return returnVal;
}
