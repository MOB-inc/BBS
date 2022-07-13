const getSubDomain = () => {
  const parts = window.location.hostname.split('.');
  const subdomain = parts.shift();
  return subdomain;
};

const getOEMConfig = () => {
  const config = {};
  // サブドメインごとに定義。
  // header_background_color: ヘッダーの背景色（必須）
  // header_text_color: ヘッダーの文字色（必須）、人型アイコン
  // inquiries_phone_number: 問い合わせ画面の連絡先電話番号
  // inquiries_phone_hour: 問い合わせ画面の対応時間
  // header_logo_image_path: ヘッダーロゴの画像（S3のパス）
  // login_logo_image_path: ログイン画面のロゴ画像（S3のパス）
  // login_background_image_path: ログイン画面の背景画像（S3のパス）
  // app_location_add_text: サイドメニュー ロケーション追加ボタンの表示名
  // app_location_add_url: サイドメニュー ロケーション追加ボタンのリンク先パス。設定しない場合は「ロケーション追加」ボタンが非表示となる。
  // side_menu_color: サイドメニューの色
  // api_host: バックエンドAPIのURL
  // menu_mode: メニューの表示モード。「sidebar」の場合、サイドメニューを表示する。「horizontal」の場合、サイドメニューを非表示にする。

  switch (getSubDomain()) {
    case 'localhost': // ローカル
      // config.header_background_color = '#181818';
      config.header_background_color = '#ffffff';
      // config.header_text_color = '#ffffff';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '03-5358-9956';
      config.inquiries_phone_hour = '平日10:00~17:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/local/partners/header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/local/partners/login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/local/partners/login_background.jpg`;
      config.app_location_add_text = 'ロケーション追加';
      config.app_location_add_url = 'https://forms.gle/YBKkqENEwLoRb6RH7';
			config.side_menu_color = '#cc0099';
			config.side_menu_selected_color = '#f8ccee';
      config.contrast_color = '#fdecf0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(253, 236, 240)';
      config.api_host = 'https://dev-api.optimize-business.com/api/v1';
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      // mob
      config.prime_color = '#cc0099'; // #CC0099
      config.second_color = '#f8ccee'; // #F8CCEE
      config.third_color = '#fbebf7';  // #FBEBF7
      config.background_color = '#f3f4f6'; // #F3F4F6
      config.tooltip_color = '#757575'; // #757575
      config.button_active_back_color = '#e580cc';// e580cc
      config.border_color = '#bbbbbb'; // #bbbbbb
			config.modal_color = '#000015'; // #000015
			config.is_line_notification = true;

      break;
    case 'dev': // 開発
      config.header_background_color = '#181818';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '03-5358-9956';
      config.inquiries_phone_hour = '平日10:00~17:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/login_background.jpg`;
      config.app_location_add_text = 'ロケーション追加';
      config.app_location_add_url = 'https://forms.gle/YBKkqENEwLoRb6RH7';
      config.side_menu_color = '#cc0099';
      config.contrast_color = '#fdecf0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(253, 236, 240)';
      config.api_host = 'https://dev-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      config.is_show_splan = true;
      // mob
      config.prime_color = '#cc0099'; // #CC0099
      config.second_color = '#f8ccee'; // #F8CCEE
      config.third_color = '#fbebf7';  // #FBEBF7
      config.background_color = '#f3f4f6'; // #F3F4F6
      config.tooltip_color = '#757575'; // #757575
      config.button_active_back_color = '#e580cc';// e580cc
      config.border_color = '#bbbbbb'; // #bbbbbb
      config.modal_color = '#000015'; // #000015
      break;
    case 'oem-dev': // OEM開発
      config.header_background_color = '#ffffff';
      config.header_text_color = '#000000';
      config.is_hide_inquery = true;
      // config.inquiries_phone_number = '';
      // config.inquiries_phone_hour = '';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/epark_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/epark_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/development/partners/login_background.jpg`;
      // config.app_location_add_text = '素敵なリンク';
      // config.app_location_add_url = 'https://www.bbs-grp.com/';
      config.side_menu_color = '#EE6611';
      config.contrast_color = '#ffd0b3';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(238, 102, 17)';
      config.graph_color_sub = 'rgb(255, 208, 179)';
      config.api_host = 'https://oem-dev-api.optimize-business.com/api/v1';
      // config.menu_mode = 'horizontal';
      config.is_line_notification = true;
      config.is_hide_contract = true;
      config.is_hide_top = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      config.is_show_splan = true;
      break;
    case 'stg': // ステージング
      config.header_background_color = '#181818';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '03-5358-9956';
      config.inquiries_phone_hour = '平日10:00~17:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/login_background.jpg`;
      config.app_location_add_text = 'ロケーション追加';
      config.app_location_add_url = 'https://forms.gle/YBKkqENEwLoRb6RH7';
      config.side_menu_color = '#cc0099';
      config.contrast_color = '#fdecf0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(253, 236, 240)';
      config.api_host = 'https://stg-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      config.is_show_splan = true;
      break;
    case 'bbs': // 本番
      config.header_background_color = '#181818';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '03-5358-9956';
      config.inquiries_phone_hour = '平日10:00~17:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/login_background.jpg`;
      config.app_location_add_text = 'ロケーション追加';
      config.app_location_add_url = 'https://forms.gle/YBKkqENEwLoRb6RH7';
      config.side_menu_color = '#cc0099';
      config.contrast_color = '#fdecf0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(253, 236, 240)';
      config.api_host = 'https://api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      // config.menu_mode = 'horizontal';
      break;
    case 'neonboard': // 合同会社Lien
      config.header_background_color = '#181818';
      config.header_text_color = '#ffffff';
      // config.inquiries_phone_number = '';
      // config.inquiries_phone_hour = '';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/neonboard_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/neonboard_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/neonboard_login_background.jpg`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#cc0099';
      config.contrast_color = '#fdecf0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(253, 236, 240)';
      config.api_host = 'https://neonboard-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'adcamp': // 株式会社プラヴィダ
      config.header_background_color = '#f0fff0';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '052-684-6361';
      config.inquiries_phone_hour = '平日9時〜18時';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/adcamp_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/adcamp_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/adcamp_login_background.jpg`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#66cdaa';
      config.contrast_color = '#f0fff0';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(102, 205, 170)';
      config.graph_color_sub = 'rgb(240, 255, 240)';
      config.api_host = 'https://adcamp-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      break;
    case 'man': // 株式会社MSN
      config.header_background_color = '#000000';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '080-4900-1979';
      config.inquiries_phone_hour = '9:30〜18:30';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/man_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/man_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/man_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#00ffff';
      config.contrast_color = '#deffff';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(0, 255, 255)';
      config.graph_color_sub = 'rgb(222, 255, 255)';
      config.api_host = 'https://man-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'cofucoma': // 株式会社LL Innovation
      config.header_background_color = '#000000';
      config.header_text_color = '#ffffff';
      // config.inquiries_phone_number = '052-684-6361';
      config.inquiries_phone_hour = '10時〜17時';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/cofucoma_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/cofucoma_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/cofucoma_login_background.jpg`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#c0c0c0';
      config.contrast_color = '#ebebeb';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(192, 192, 192)';
      config.graph_color_sub = 'rgb(235, 235, 235)';
      config.api_host = 'https://cofucoma-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'righton': // 株式会社ライトオン
      config.header_background_color = '#ffffff';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '0800-111-5886';
      config.inquiries_phone_hour = '月曜日から金曜日 9時〜18時';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/righton_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/righton_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/righton_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#D00B0B';
      config.contrast_color = '#ffb8b8';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(208, 11, 11)';
      config.graph_color_sub = 'rgb(255, 184, 184)';
      config.api_host = 'https://righton-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'streams': // 株式会社BAZIO
      config.header_background_color = '#ebf3ff';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '03-6277-0222';
      config.inquiries_phone_hour = '10:00-18:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/streams_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/streams_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/streams_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#3498db';
      config.contrast_color = '#ebf3ff';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(52, 152, 219)';
      config.graph_color_sub = 'rgb(235, 243, 255)';
      config.api_host = 'https://streams-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'manage-biz': // 株式会社Shock Tech
      config.header_background_color = '#25252c';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '090-2404-4366';
      config.inquiries_phone_hour = '平日10時〜19時　休日10時〜19時';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/manage-biz_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/manage-biz_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/manage-biz_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#41414a';
      config.contrast_color = '#ebebeb';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(65, 65, 74)';
      config.graph_color_sub = 'rgb(235, 235, 235)';
      config.api_host = 'https://manage-biz-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      break;
    case 'i-egg': // 株式会社EPARKグルメ
      config.header_background_color = '#ffffff';
      config.header_text_color = '#000000';
      config.is_hide_inquery = true;
      config.inquiries_phone_number = '03-6878-3049';
      config.inquiries_phone_hour = '平日10:00~18:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/epark_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/epark_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/epark_login_background.jpg`;
      // config.app_location_add_text = '素敵なリンク';
      // config.app_location_add_url = 'https://www.bbs-grp.com/';
      config.side_menu_color = '#EE6611';
      config.contrast_color = '#ffd0b3';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(238, 102, 17)';
      config.graph_color_sub = 'rgb(255, 208, 179)';
      config.api_host = 'https://i-egg-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      config.is_line_notification = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      config.is_show_splan = true;
      break;
    case 'user': // 株式会社アシスト
      config.header_background_color = '#414141';
      config.header_text_color = '#ffffff';
      config.is_hide_inquery = true;
      config.inquiries_phone_number = '050-5433-5878';
      config.inquiries_phone_hour = '月曜〜金曜9:00〜18:00 (土日祝休業)';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/user_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/user_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/user_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#5DB9A9';
      config.contrast_color = '#edfffc';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(93, 185, 169)';
      config.graph_color_sub = 'rgb(237, 255, 252)';
      config.api_host = 'https://user-api.optimize-business.com/api/v1';
      config.menu_mode = 'sidebar';
      // config.menu_mode = 'horizontal';
      config.is_line_notification = true;
      config.is_show_splan = true;
      break;
    case 'miline-bms': // 株式会社ミライアゴーゴー
      config.header_background_color = '#333333';
      config.header_text_color = '#ffffff';
      // config.inquiries_phone_number = '';
      // config.inquiries_phone_hour = '';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/miline-bms_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/miline-bms_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/miline-bms_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#ef7a00';
      config.contrast_color = '#ffc991';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(239, 122, 0)';
      config.graph_color_sub = 'rgb(255, 201, 145)';
      config.api_host = 'https://miline-bms-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'bridge': // エコテクソリューション株式会社
      config.header_background_color = '#000000';
      config.header_text_color = '#ffffff';
      config.inquiries_phone_number = '0570-200-324';
      config.inquiries_phone_hour = '平日10:00～17:00　土日祝除く';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/bridge_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/bridge_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/bridge_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#ff9922';
      config.contrast_color = '#ffd099';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(255, 153, 34)';
      config.graph_color_sub = 'rgb(255, 208, 153)';
      config.api_host = 'https://bridge-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      config.is_hide_contract = true;
      config.is_hide_top = true;
      config.app_release_note_url = 'https://www.bbs-grp.com/releasenote';
      config.is_show_splan = true;
      break;
    case 'tunagoo': // 株式会社Goodbright.
      config.header_background_color = '#FFFF65';
      config.header_text_color = '#000000';
      // config.inquiries_phone_number = '03-5544-9755';
      config.inquiries_phone_hour =
        '平日10:00~18:00（土日祝日、年末年始12/30〜1/3除く）';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tunagoo_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tunagoo_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tunagoo_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#F4BB66';
      config.contrast_color = '#fff0d9';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(244, 187, 102)';
      config.graph_color_sub = 'rgb(255, 240, 217)';
      config.api_host = 'https://tunagoo-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'manual-sample': // マニュアル作成用
      config.header_background_color = '#FFFFFF';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '00-0000-1111';
      config.inquiries_phone_hour = '平日10:00~18:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/manual-sample_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/manual-sample_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/staging/partners/manual-sample_header_logo.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#000000';
      config.contrast_color = '#e8e8e8';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(0, 0, 0)';
      config.graph_color_sub = 'rgb(232, 232, 232)';
      config.api_host =
        'https://manual-sample-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'connectie': // Serina Group
      config.header_background_color = '#dcdcdc';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '03-5927-9401';
      config.inquiries_phone_hour = '土日祝日除く、平日10:00〜19:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/connectie_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/connectie_header_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/connectie_login_background.jpg`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#00bfff';
      config.contrast_color = '#dbf6ff';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(204, 0, 153)';
      config.graph_color_sub = 'rgb(248, 204, 238)';
      config.api_host = 'https://connectie-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'appdate': // 株式会社AppDate
      config.header_background_color = '#0000FF';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '0120-522-922';
      config.inquiries_phone_hour = '10:00〜17:00 (土日祝を除く)';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/appdate_login_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/appdate_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/appdate_login_background.png`;
      // config.app_location_add_text = '契約の確認';
      // config.app_location_add_url = 'https://www.lien-biz.com/';
      config.side_menu_color = '#EEFFFF';
      config.contrast_color = '#EEFFFF';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(0, 191, 255)';
      config.graph_color_sub = 'rgb(238, 255, 255)';
      config.api_host = 'https://appdate-api.optimize-business.com/api/v1';
      config.is_show_splan = true;
      break;
    case 'asistaplus': // 株式会社ライフアップ
      config.header_background_color = '#FFBD59';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '0800-300-9674';
      config.inquiries_phone_hour = '年末年始を除く全日　11:00～20:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/asistaplus_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/asistaplus_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/asistaplus_login_background.png`;
      config.app_location_add_text = 'ロケーション申込';
      config.app_location_add_url =
        'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#FFBD59';
      config.contrast_color = '#ffebcc';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(255, 189, 89)';
      config.graph_color_sub = 'rgb(255, 235, 204)';
      config.api_host = 'https://asistaplus-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'voitasu': // 株式会社オールトゥデイ
      config.header_background_color = '#181818';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '048-638-7035';
      config.inquiries_phone_hour = '9：00～18：00・・・土日祝日は休日';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/voitasu_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/voitasu_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/voitasu_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#bc2795';
      config.contrast_color = '#ffdbf6';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(188, 39, 149)';
      config.graph_color_sub = 'rgb(255, 219, 246)';
      config.api_host = 'https://voitasu-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'rakurakutenpo-shukyaku': // 株式会社ジーズコンサルティング
      config.header_background_color = '#FFEBCC';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '03-6427-4812';
      config.inquiries_phone_hour = '10：00～19：00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/rakurakutenpo-shukyaku_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/rakurakutenpo-shukyaku_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/rakurakutenpo-shukyaku_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#FFAFAF';
      config.contrast_color = '#fff5f5';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(255, 175, 175)';
      config.graph_color_sub = 'rgb(255, 245, 245)';
      config.api_host =
        'https://rakurakutenpo-shukyaku-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'tgmsystem': // 株式会社ツリーフードパートナーズ
      config.header_background_color = '#000000';
      config.header_text_color = '#FFFFFF';
      // config.inquiries_phone_number = '03-6384-7121';
      // config.inquiries_phone_hour = '10：00～18：00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tgmsystem_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tgmsystem_header_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/tgmsystem_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#008b8b';
      config.contrast_color = '#c9ffff';
      config.login_text_color = '#6e7d7d';
      config.graph_color_main = 'rgb(0, 139, 139)';
      config.graph_color_sub = 'rgb(201, 255, 255)';
      config.api_host = 'https://tgmsystem-api.optimize-business.com/api/v1';
      break;
    case 'giftls': // T-ONE
      config.header_background_color = '#1658DC';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '092-600-1238';
      config.inquiries_phone_hour = '土日祝以外の9時～18時まで';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/giftls_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/giftls_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/giftls_login_background.jpg`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#1658DC';
      config.contrast_color = '#dee9ff';
      config.login_text_color = '#6e7d7d';
      config.graph_color_main = 'rgb(22, 88, 220)';
      config.graph_color_sub = 'rgb(222, 233, 255)';
      config.api_host = 'https://giftls-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'premium-biz': // ジャパンネット
      config.header_background_color = '#262626';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '052-728-0502';
      config.inquiries_phone_hour = 'サポート受付時間 平日(9:00〜18:00)';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/premium-biz_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/premium-biz_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/premium-biz_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#773e0d';
      config.contrast_color = '#ffe8d4';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(119, 62, 13)';
      config.graph_color_sub = 'rgb(255, 232, 212)';
      config.api_host = 'https://premium-biz-api.optimize-business.com/api/v1';
      break;
    case 'client': // イートラスト株式会社
      config.header_background_color = '#e8e7e7';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '0120-650-701';
      config.inquiries_phone_hour = '10:00~19:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/client_login_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/client_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/client_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#c20763';
      config.contrast_color = '#ffd9ec';
      config.login_text_color = '#FFFFFF';
      config.graph_color_main = 'rgb(194, 7, 99)';
      config.graph_color_sub = 'rgb(255, 217, 236)';
      config.api_host = 'https://client-api.optimize-business.com/api/v1';
      break;
    case 'fbiz': // 株式会社ファイズホールディングス
      config.header_background_color = '#414141';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '0120-343-052';
      config.inquiries_phone_hour = '9:00~18:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/fbiz_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/fbiz_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/fbiz_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/1HO8uTQpqu0m1MO3SZfiVm4uQYpjlbcIJFFJq5lqahlA/edit';
      config.side_menu_color = '#E99311';
      config.contrast_color = '#ffe3b8';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(233, 147, 17)';
      config.graph_color_sub = 'rgb(255, 227, 184)';
      config.api_host = 'https://fbiz-api.optimize-business.com/api/v1';
      config.is_show_splan = true;
      break;
    case 'yobicom': // 株式会社AEGIS
      config.header_background_color = '#000080';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '080-4295-4692';
      config.inquiries_phone_hour = '土日祝以外 10時〜18時';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/yobicom_login_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/yobicom_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/yobicom_login_background.png`;
      config.app_location_add_text = 'ロケーション申込';
      config.app_location_add_url = 'https://docs.google.com/forms/d/e/1FAIpQLScVOXLtCuN8WZ95jhHvSnfXVsYF4ysTx8ecbUuJX9aF6j9J0A/viewform';
      config.side_menu_color = '#4160e1';
      config.contrast_color = '#dbe2ff';
      config.login_text_color = '#FFFFFF';
      config.graph_color_main = 'rgb(65, 96, 225)';
      config.graph_color_sub = 'rgb(219, 226, 255)';
      config.api_host = 'https://yobicom-api.optimize-business.com/api/v1';
      break;
    case 'htl': // 株式会社アシスト その2
      config.header_background_color = '#d8d8d8';
      config.header_text_color = '#000000';
      config.inquiries_phone_number = '050-5433-5878';
      config.inquiries_phone_hour = '';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/htl_login_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/htl_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/htl_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/e/1FAIpQLScVOXLtCuN8WZ95jhHvSnfXVsYF4ysTx8ecbUuJX9aF6j9J0A/viewform';
      config.side_menu_color = '#8E3F61';
      config.contrast_color = '#f5dae5';
      config.login_text_color = '#000000';
      config.graph_color_main = 'rgb(142, 63, 97)';
      config.graph_color_sub = 'rgb(245, 218, 229)';
      config.api_host = 'https://htl-api.optimize-business.com/api/v1';
      config.is_line_notification = true;
      break;
    case 'onefinity': // 株式会社ビジョン
      config.header_background_color = '#000000';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '0120-95-016';
      config.inquiries_phone_hour = '土日祝を除く平日：10:00〜19:00';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/onefinity_header_logo.svg`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/onefinity_login_logo.svg`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/onefinity_login_background.jpg`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/e/1FAIpQLScVOXLtCuN8WZ95jhHvSnfXVsYF4ysTx8ecbUuJX9aF6j9J0A/viewform';
      config.side_menu_color = '#f5a658';
      config.contrast_color = '#fcecdc';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(245, 166, 88)';
      config.graph_color_sub = 'rgb(252, 236, 220)';
      config.api_host = 'https://onefinity-api.optimize-business.com/api/v1';
      break;
    case 'keykit': // 株式会社K2
      config.header_background_color = '#000000';
      config.header_text_color = '#FFFFFF';
      config.inquiries_phone_number = '050-3631-9922';
      config.inquiries_phone_hour = '土日祝以外の10時〜18時まで';
      config.header_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/keykit_header_logo.png`;
      config.login_logo_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/keykit_login_logo.png`;
      config.login_background_image_path = `${process.env.REACT_APP_AWS_S3_BASE_URL}/files/uploaded/production/partners/keykit_login_background.png`;
      // config.app_location_add_text = 'ロケーション申込';
      // config.app_location_add_url = 'https://docs.google.com/forms/d/e/1FAIpQLScVOXLtCuN8WZ95jhHvSnfXVsYF4ysTx8ecbUuJX9aF6j9J0A/viewform';
      config.side_menu_color = '#ff1493';
      config.contrast_color = '#f5dfeb';
      config.login_text_color = '#ffffff';
      config.graph_color_main = 'rgb(255, 20, 147)';
      config.graph_color_sub = 'rgb(245, 223, 235)';
      config.api_host = 'https://keykit-api.optimize-business.com/api/v1';
      break;
    default:
      break;
  }
  return config;
};

export default getOEMConfig;
