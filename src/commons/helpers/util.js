/* eslint-disable camelcase */
import * as dayjs from 'dayjs';

export const counter = (str) => {
  return str
    .normalize()
    .split('')
    .filter((f) => f !== '\n').length;
};

export const range = (from, to, step = 1) => {
  return [...Array(Math.floor((to - from) / step))].map(
    (_, i) => from + i * step,
  );
};

export const parameterizeArray = (key, array = []) => {
  const arr = array.map(encodeURIComponent);
  return `&${key}[]=${arr.join(`&${key}[]=`)}`;
};

export const createPostData = (data) => {
  const form = new FormData();
  const {
    image,
    start_date,
    start_time,
    end_date,
    end_time,
    post_date,
    post_time,
    is_schedule_post,
    locations: locationIds,
    client_timezone,
    ...otherData
  } = data;
  form.append('client_timezone', dayjs.tz.guess());
  form.append('is_schedule_post', is_schedule_post ? 1 : 0);
  if (start_date && start_time) {
    const start = dayjs(
      `${start_date} ${start_time}`,
      'YYYY-MM-DD HH:mm',
    ).utc();
    form.append('start_date', start.format('YYYY-MM-DD'));
    form.append('start_time', start.format('HH:mm'));
  }
  if (end_date && end_time) {
    const end = dayjs(`${end_date} ${end_time}`, 'YYYY-MM-DD HH:mm').utc();
    form.append('end_date', end.format('YYYY-MM-DD'));
    form.append('end_time', end.format('HH:mm'));
  }
  if (is_schedule_post) {
    if (post_date && post_time) {
      const post = dayjs(`${post_date} ${post_time}`, 'YYYY-MM-DD HH:mm').utc();
      form.append('post_date', post.format('YYYY-MM-DD'));
      form.append('post_time', post.format('HH:mm'));
    }
  }
  locationIds.forEach((element) => {
    form.append('locations[]', element);
  });
  Object.entries(otherData).forEach(([key, value]) => {
    if (value) form.append(key, value);
  });

  return form;
};
