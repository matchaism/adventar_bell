// グローバル定数
const DAYS_IN_CALENDAR = 25; // カレンダーの日数
const YEAR = 2024; // 対象の年

class CalendarEntry {
  constructor(title, url) {
    this.title = title;
    this.url = url;
    this.calendarStatus = Array(DAYS_IN_CALENDAR); // 'null', 'registered', 'posted', 'no_change'
    this.authors = Array(DAYS_IN_CALENDAR); // 各日の投稿者
    this.articles = Array(DAYS_IN_CALENDAR); // 各日の記事URL
    this.custom = {
      'botName': title,
      'iconEmoji': ':christmas_tree:' // デフォルトアイコン
    };
  }
};

function main() {
  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(YEAR.toString());
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  // データの行を1行ずつ処理
  for (let i = 1; i < data.length; i++) {
    // スプレッドシートからカレンダー情報を取得
    const prevCalendarEntry = getCalendarEntryFromSpreadsheet(data[i]);
    Logger.log(prevCalendarEntry);

    // Webから最新のカレンダー情報を取得
    const currentCalendarEntry = getCalendarEntryFromWeb(data[i]);
    Logger.log(currentCalendarEntry);

    // 差分を取得
    const calendarDifference = getCalendarDifference(prevCalendarEntry, currentCalendarEntry);
    Logger.log(calendarDifference);

    // スプレッドシートを更新
    updateSpreadsheet(sheet, i + 1, calendarDifference);

    // 投稿があれば通知用のペイロードを生成
    const payload = generatePostedArticlePayload(calendarDifference);
    Logger.log(payload);

    // 投稿があれば通知
    if (payload !== null) {
      postToWebhook(payload);
    }
  }
}

// スプレッドシートからカレンダー情報を抽出
function getCalendarEntryFromSpreadsheet(row) {
  const calendarEntry = new CalendarEntry(row[0], row[1]);

  for (let day = 1; day <= DAYS_IN_CALENDAR; day++) {
    let status = row[day + 1];
    if (status !== 'registered' && status !== 'posted') {
      status = null;
    }
    calendarEntry.calendarStatus[day - 1] = status;
  }

  // カスタムアイコンの設定
  if (row[row.length - 1].length >= 3) {
    calendarEntry.custom.iconEmoji = row[row.length - 1];
  }

  return calendarEntry;
}

// Webから最新のカレンダー情報をスクレイピング
function getCalendarEntryFromWeb(row) {
  const calendarEntry = new CalendarEntry(row[0], row[1]);

  const response = UrlFetchApp.fetch(row[1]);
  const html = response.getContentText();
  const $ = Cheerio.load(html);

  const entryList = $('ul.EntryList').find('li');
  entryList.each(function (i, item) {
    const date = $(this).find('div.head > div.date').text();
    const day = parseInt(date.split('/')[1]);
    const author = $(this).find('div.head > div.user > a').text();
    const articleLink = $(this).find('div.article > div.left > div.link > a').attr('href');

    if (typeof articleLink === 'undefined') {
      // 登録されているが、記事が投稿されていない
      calendarEntry.calendarStatus[day - 1] = 'registered';
      calendarEntry.authors[day - 1] = author;
    } else {
      // 記事が投稿されている
      calendarEntry.calendarStatus[day - 1] = 'posted';
      calendarEntry.authors[day - 1] = author;
      calendarEntry.articles[day - 1] = articleLink;
    }
  });

  return calendarEntry;
}

// カレンダー情報の差分を取得
function getCalendarDifference(prevEntry, currentEntry) {
  if (!(prevEntry.title === currentEntry.title && prevEntry.url === currentEntry.url)) {
    return null; // タイトルまたはURLが異なる場合、差分なし
  }

  const diffEntry = new CalendarEntry(currentEntry.title, currentEntry.url);
  for (let i = 0; i < DAYS_IN_CALENDAR; i++) {
    if (prevEntry.calendarStatus[i] !== currentEntry.calendarStatus[i]) {
      diffEntry.calendarStatus[i] = currentEntry.calendarStatus[i];
      diffEntry.authors[i] = currentEntry.authors[i];
      diffEntry.articles[i] = currentEntry.articles[i];
    } else {
      diffEntry.calendarStatus[i] = 'no_change';
    }
  }

  // カスタム設定は前の情報を維持
  diffEntry.custom = prevEntry.custom;

  return diffEntry;
}

// スプレッドシートを更新
function updateSpreadsheet(sheet, rowIndex, calendarEntry) {
  for (let i = 0; i < DAYS_IN_CALENDAR; i++) {
    if (calendarEntry.calendarStatus[i] !== 'no_change') {
      sheet.getRange(rowIndex, 3 + i).setValue(calendarEntry.calendarStatus[i]);
    }
  }
}

// 投稿された記事のペイロードを生成
function generatePostedArticlePayload(calendarEntry) {
  const blocks = [];
  for (let i = 0; i < DAYS_IN_CALENDAR; i++) {
    if (calendarEntry.calendarStatus[i] === 'posted') {
      blocks.push({
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': `${calendarEntry.authors[i]} posted <${calendarEntry.articles[i]}|Day ${i + 1} Article>!!`
        }
      });
    }
  }

  if (blocks.length === 0) {
    return null; // 投稿がなければペイロードは作成しない
  }

  return {
    'username': calendarEntry.custom.botName,
    'icon_emoji': calendarEntry.custom.iconEmoji,
    "unfurl_links": true, "unfurl_media": true, // リンク先の記事のプレビューを表示
    'blocks': blocks
  };
}

// WebhookにPOSTリクエストを送信
function postToWebhook(payload) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('webhook_url');
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(webhookUrl, options);
}
