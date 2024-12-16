const adventarBell = {
  CalendarEntry: class {
    constructor(title, url) {
      this.title = title; // Adventarのタイトル
      this.url = url; // AdventarのURL
      this.calendarStatus = Array(config.DAYS_IN_CALENDAR); // 'null', 'registered', 'posted', 'no_change'
      this.authors = Array(config.DAYS_IN_CALENDAR); // 各日の投稿者
      this.articles = Array(config.DAYS_IN_CALENDAR); // 各日の記事URL
      this.custom = {
        'botName': title,
        'slackIconEmoji': ':christmas_tree:' // デフォルトアイコン
      };
    }
  },

  // スプレッドシートからカレンダー情報を抽出
  getCalendarEntryFromSpreadsheet: function(row) {
    // CalendarEntryクラスの宣言
    const calendarEntry = new adventarBell.CalendarEntry(row[0], row[1]);

    // 各日の情報を取得
    for (let day = 1; day <= config.DAYS_IN_CALENDAR; day++) {
      let status = row[day + 1];
      // 'registered'でも'posted'でもないとき，null
      if (status !== 'registered' && status !== 'posted') status = null;
      // 記録
      calendarEntry.calendarStatus[day - 1] = status;
    }

    // カスタムアイコンの設定
    if (row[row.length - 1].length >= 3) calendarEntry.custom.slackIconEmoji = row[row.length - 1];

    return calendarEntry;
  },

  // Webから最新のカレンダー情報をスクレイピング
  getCalendarEntryFromWeb: function(row) {
    // CalendarEntryクラスの宣言
    const calendarEntry = new adventarBell.CalendarEntry(row[0], row[1]);

    // Adventarの取得
    const response = UrlFetchApp.fetch(row[1]);
    const html = response.getContentText();
    const $ = Cheerio.load(html); // ライブラリCheerio

    // リストアップ
    const entryList = $('ul.EntryList').find('li');
    entryList.each(function() {
      const date = $(this).find('div.head > div.date').text();
      const day = parseInt(date.split('/')[1]);
      const author = $(this).find('div.head > div.user > a').text();
      const articleLink = $(this).find('div.article > div.left > div.link > a').attr('href');

      // 記録
      calendarEntry.authors[day - 1] = author;
      calendarEntry.articles[day - 1] = articleLink;
      if (typeof articleLink === 'undefined') { // 登録されているが、記事が投稿されていない
        calendarEntry.calendarStatus[day - 1] = 'registered';
      } else { // 記事が投稿されている
        calendarEntry.calendarStatus[day - 1] = 'posted';
      }
    });

    return calendarEntry;
  },

  // カレンダー情報の差分を取得
  getCalendarDifference: function(prevEntry, currentEntry) {
    // タイトルまたはURLが異なる場合、差分なし
    if (!(prevEntry.title === currentEntry.title && prevEntry.url === currentEntry.url)) return null;

    // CalendarEntryクラスの宣言
    const diffEntry = new adventarBell.CalendarEntry(currentEntry.title, currentEntry.url);

    // 差分検出と記録
    for (let i = 0; i < config.DAYS_IN_CALENDAR; i++) {
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
  },

  // スプレッドシートを更新
  updateSpreadsheet: function(sheet, rowIndex, calendarEntry) {
    for (let i = 0; i < config.DAYS_IN_CALENDAR; i++) {
      if (calendarEntry.calendarStatus[i] !== 'no_change') sheet.getRange(rowIndex, 3 + i).setValue(calendarEntry.calendarStatus[i]);
    }
  },
}
