export const serviceOptions = [
  { id: 0, name: 'ドライブスルー', en_name: 'drive_through' },
  { id: 1, name: '宅配', en_name: 'delivery' },
  { id: 2, name: '店先受取可', en_name: 'picked_at_storefront' },
  { id: 3, name: '店舗内ショッピング可', en_name: 'in_store_shopping' },
  { id: 4, name: '当日配達', en_name: 'same_day_delivery' },
  { id: 5, name: '非接触デリバリー', en_name: 'non_contact_delivery' },
];

export const barrierFree = [
  {
    id: 0,
    name: '車椅子対応のエレベーター',
    en_name: 'wheelchair_accessible_elevator',
  },
  {
    id: 1,
    name: '車椅子対応のトイレ',
    en_name: 'wheelchair_accessible_restroom',
  },
  {
    id: 2,
    name: '車椅子対応の入り口',
    en_name: 'wheelchair_accessible_entrance',
  },
  { id: 3, name: '車椅子対応の座席', en_name: 'wheelchair_accessible_seats' },
  {
    id: 4,
    name: '車椅子対応の駐車場',
    en_name: 'wheelchair_accessible_parking',
  },
];

export const healthSafety = [
  { id: 0, name: 'スタッフの検温', en_name: 'staff_temperature' },
  { id: 1, name: 'スタッフのマスク着用', en_name: 'staff_wearing' },
  {
    id: 2,
    name: 'レジでの飛沫防止措置',
    en_name: 'splash_prevention_measures',
  },
  { id: 3, name: '次の顧客案内前に消毒', en_name: 'next_customer_visit' },
  { id: 4, name: '要マスク', en_name: 'mask' },
  { id: 5, name: '要予約', en_name: 'reservation' },
  { id: 6, name: '要検温', en_name: 'temperature' },
];

export const serviceAttributes = [
  { id: 0, name: 'アルコール', en_name: 'alcohol' },
  { id: 1, name: 'コーヒー', en_name: 'coffee' },
  { id: 2, name: 'キッズメニュー', en_name: 'kids_menu' },
  { id: 3, name: '深夜の食事可', en_name: 'midnight_meal' },
  { id: 4, name: '食べ放題', en_name: 'all_you_can_eat' },
];

export const options = [
  { value: null, label: '未選択' },
  { value: true, label: 'あり' },
  { value: false, label: 'なし' },
];

export const paymentOptions = [
  { id: 0, en_name: 'cash_only', name: '現金のみ' },
  { id: 1, en_name: 'nfc_mobile', name: 'NFCモバイル決済' },
  { id: 2, en_name: 'american_express', name: 'American Express' },
  { id: 3, en_name: 'dinaers_club', name: 'Dinaers Club' },
  { id: 4, en_name: 'discover', name: 'Discover' },
  { id: 5, en_name: 'jcb', name: 'JCB' },
  { id: 6, en_name: 'master_card', name: 'Master Card' },
  { id: 7, en_name: 'visa', name: 'VISA' },
  { id: 8, en_name: 'china_union_pay', name: '中国銀聯' },
  { id: 9, en_name: 'debit_card', name: 'デビットカード可' },
  { id: 10, en_name: 'check', name: '小切手可' },
];

export const priceTypeOptions = [
  { id: 0, value: 'no_price', en_name: 'No Price', name: '価格なし' },
  { id: 1, value: 'free', en_name: 'Free', name: '無料' },
  { id: 2, value: 'fix', en_name: 'Fix', name: '固定' },
];

export const productAddURLTypeButtonOptions = [
  { id: 0, value: 'nothing', en_name: 'Nothing', name: 'なし' },
  {
    id: 1,
    value: 'online-order',
    en_name: 'Online Order',
    name: 'オンライン注文',
  },
  { id: 1, value: 'buy', en_name: 'Buy', name: '購入' },
  { id: 1, value: 'learn-more', en_name: 'Learn more', name: '詳細' },
  { id: 1, value: 'get-offer', en_name: 'Get offer', name: '特典を利用' },
];

export const defaultProductCategory = [
  {
    id: 0,
    value: 'add-new',
    name: '新しいカテゴリを作成する',
    en_name: 'create new category',
  },
];

export const timeSelect = [
  { value: 'DELETE', label: '-' },
  { value: '00:00', label: '00:00' },
  { value: '00:30', label: '00:30' },
  { value: '01:00', label: '01:00' },
  { value: '01:30', label: '01:30' },
  { value: '02:00', label: '02:00' },
  { value: '02:30', label: '02:30' },
  { value: '03:00', label: '03:00' },
  { value: '03:30', label: '03:30' },
  { value: '04:00', label: '04:00' },
  { value: '04:30', label: '04:30' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
  { value: '07:30', label: '07:30' },
  { value: '08:00', label: '08:00' },
  { value: '08:30', label: '08:30' },
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
  { value: '17:00', label: '17:00' },
  { value: '17:30', label: '17:30' },
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' },
  { value: '21:30', label: '21:30' },
  { value: '22:00', label: '22:00' },
  { value: '22:30', label: '22:30' },
  { value: '23:00', label: '23:00' },
  { value: '23:30', label: '23:30' },
  { value: '24:00', label: '24:00' },
];

export const timeSelectToModified = [
  { value: '00:00', label: '00:00' },
  { value: '00:30', label: '00:30' },
  { value: '01:00', label: '01:00' },
  { value: '01:30', label: '01:30' },
  { value: '02:00', label: '02:00' },
  { value: '02:30', label: '02:30' },
  { value: '03:00', label: '03:00' },
  { value: '03:30', label: '03:30' },
  { value: '04:00', label: '04:00' },
  { value: '04:30', label: '04:30' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
  { value: '07:30', label: '07:30' },
  { value: '08:00', label: '08:00' },
  { value: '08:30', label: '08:30' },
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
  { value: '17:00', label: '17:00' },
  { value: '17:30', label: '17:30' },
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' },
  { value: '21:30', label: '21:30' },
  { value: '22:00', label: '22:00' },
  { value: '22:30', label: '22:30' },
  { value: '23:00', label: '23:00' },
  { value: '23:30', label: '23:30' },
  { value: '24:00', label: '24:00' },
];

export const modifiedTimeSelect = [
  { value: 'HOLIDAY', label: '定休日' },
  { value: '00:00', label: '00:00' },
  { value: '00:30', label: '00:30' },
  { value: '01:00', label: '01:00' },
  { value: '01:30', label: '01:30' },
  { value: '02:00', label: '02:00' },
  { value: '02:30', label: '02:30' },
  { value: '03:00', label: '03:00' },
  { value: '03:30', label: '03:30' },
  { value: '04:00', label: '04:00' },
  { value: '04:30', label: '04:30' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
  { value: '07:30', label: '07:30' },
  { value: '08:00', label: '08:00' },
  { value: '08:30', label: '08:30' },
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
  { value: '17:00', label: '17:00' },
  { value: '17:30', label: '17:30' },
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' },
  { value: '21:30', label: '21:30' },
  { value: '22:00', label: '22:00' },
  { value: '22:30', label: '22:30' },
  { value: '23:00', label: '23:00' },
  { value: '23:30', label: '23:30' },
  { value: '24:00', label: '24:00' },
];

export const specialHourOptions = [
  { value: '1', label: '開店' },
  { value: '2', label: '分割時間' },
  { value: '3', label: '24時間' },
  { value: '4', label: '休業' },
  { value: '5', label: '通常営業時間' },
];

export const specialDayList = [
  { id: '1', name: 'day1' },
  { id: '2', name: 'day2' },
  { id: '3', name: 'day3' },
  { id: '4', name: 'day4' },
  { id: '5', name: 'day5' },
  { id: '6', name: 'day6' },
  { id: '7', name: 'day7' },
];

export const businessDayList = [
  { id: '1', name: 'SUNDAY' },
  { id: '2', name: 'MONDAY' },
  { id: '3', name: 'TUESDAY' },
  { id: '4', name: 'WEDNESDAY' },
  { id: '5', name: 'THURSDAY' },
  { id: '6', name: 'FRIDAY' },
  { id: '7', name: 'SATURDAY' },
];

export const wifiOptions = [
  { value: null, label: '未指定' },
  { value: '0', label: '無料Wi-fi' },
  { value: '1', label: '有料Wi-fi' },
];

export const businessDay = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const bulkUpdateCheckList = (dynamicItems) => {
  return [
    { id: 1, name: '電話番号', value: 'phoneNumber' },
    { id: 2, name: 'ロケーションの説明', value: 'locationDescription' },
    { id: 3, name: '営業時間', value: 'businessHour' },
    { id: 4, name: '特別営業時間', value: 'specialBusinessHour' },
    { id: 5, name: '営業ステータス', value: 'tempBusinessHour' },
    { id: 6, name: 'URL', value: 'url' },
    { id: 7, name: '設立年', value: 'yearEstablishment' },
    ...Object.keys(dynamicItems).map((key, idx) => {
      return {
        id: 8 + idx,
        name: key,
        value: key
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
      };
    }),
  ];
};
