import Cheerio from 'cheerio';
import * as config from "./config";

export class CalendarEntry {
  title: string;
  url: string;
  calendarStatus: Array<string | null>;
  authors: Array<string | null>;
  articles: Array<string | null>;
  custom: Record<string, string>;

  constructor(title: string, url: string) {
    this.title = title; // Adventarのタイトル
    this.url = url; // AdventarのURL
    this.calendarStatus = Array(config.DAYS_IN_CALENDAR).fill(null); // 'null', 'registered', 'posted', 'no_change'
    this.authors = Array(config.DAYS_IN_CALENDAR).fill(null); // 各日の投稿者
    this.articles = Array(config.DAYS_IN_CALENDAR).fill(null); // 各日の記事URL
    this.custom = {
      botName: title,
      slackIconEmoji: ':christmas_tree:' // デフォルトアイコン
    };
  };
}

// スプレッドシートからカレンダー情報を抽出
export function getCalendarEntryFromSpreadsheet(row: Array<string | null>): CalendarEntry {
  // 型チェック
  if (row[0] === null || row[1] === null) { // error handling
    throw new Error('Invalid title or url.');
  }

  // CalendarEntryクラスの宣言
  const calendarEntry: CalendarEntry = new CalendarEntry(row[0], row[1]);

  // 各日の情報を取得
  for (let day: number = 1; day <= config.DAYS_IN_CALENDAR; day++) {
    let status: string | null = row[day + 1];
    // 'registered'でも'posted'でもないとき，null
    if (status !== 'registered' && status !== 'posted') status = null;
    // 記録
    calendarEntry.calendarStatus[day - 1] = status;
  }

  // カスタムアイコンの設定:
  calendarEntry.custom.slackIconEmoji = row[row.length - 1] || ':christmas_tree:'; // 不正値の場合は':christmas_tree:'

  return calendarEntry;
}

// Webから最新のカレンダー情報をスクレイピング
export function getCalendarEntryFromWeb(row: Array<string | null>): CalendarEntry {
  // 型チェック
  if (row[0] === null || row[1] === null) { // error handling
    throw new Error('Invalid title or url.');
  }

  // CalendarEntryクラスの宣言
  const calendarEntry: CalendarEntry = new CalendarEntry(row[0], row[1]);

  // Adventarの取得
  const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(row[1]);
  const html: string = response.getContentText();
  const $: cheerio.Root = Cheerio.load(html); // ライブラリCheerio

  // リストアップ
  const entryList: cheerio.Cheerio = $('ul.EntryList').find('li');
  entryList.each(function (i:number, element:cheerio.Element) {
    const date: string = $(element).find('div.head > div.date').text();
    const day: number = parseInt(date.split('/')[1]);
    const author: string = $(element).find('div.head > div.user > a').text();
    const articleLink: string | undefined = $(element).find('div.article > div.left > div.link > a').attr('href');

    // 記録
    calendarEntry.authors[day - 1] = author;
    if (typeof articleLink === 'undefined') {
      // 登録されているが、記事が投稿されていない
      calendarEntry.calendarStatus[day - 1] = 'registered';
      calendarEntry.articles[day - 1] = null;
    } else {
      // 記事が投稿されている
      calendarEntry.calendarStatus[day - 1] = 'posted';
      calendarEntry.articles[day - 1] = articleLink;
    }
  });

  return calendarEntry;
}

export function getCalendarDifference(prevEntry: CalendarEntry, currentEntry: CalendarEntry): CalendarEntry {
  // タイトルまたはURLが異なる場合
  if (!(prevEntry.title === currentEntry.title && prevEntry.url === currentEntry.url)) { // error handling
    throw new Error('Different "adventarBell.CalendarEntry"s are compared.');
  }

  // CalendarEntryクラスの宣言
  const diffEntry: CalendarEntry = new CalendarEntry(currentEntry.title, currentEntry.url);

  // 差分検出と記録
  for (let i: number = 0; i < config.DAYS_IN_CALENDAR; i++) {
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
export function updateSpreadsheet(sheet: GoogleAppsScript.Spreadsheet.Sheet, rowIndex: number, calendarEntry: CalendarEntry): void {
  for (let i: number = 0; i < config.DAYS_IN_CALENDAR; i++) {
    if (calendarEntry.calendarStatus[i] !== 'no_change') {
      sheet.getRange(rowIndex, 3 + i).setValue(calendarEntry.calendarStatus[i]);
    }
  }
}
