function main() {
  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(config.SHEET_NAME);
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  // データの行を1行ずつ処理
  for (let i = 1; i < data.length; i++) {
    // スプレッドシートからカレンダー情報を取得
    const prevCalendarEntry = adventarBell.getCalendarEntryFromSpreadsheet(data[i]);
    Logger.log(prevCalendarEntry);

    // Webから最新のカレンダー情報を取得
    const currentCalendarEntry = adventarBell.getCalendarEntryFromWeb(data[i]);
    Logger.log(currentCalendarEntry);

    // 差分を取得
    const calendarDifference = adventarBell.getCalendarDifference(prevCalendarEntry, currentCalendarEntry);
    Logger.log(calendarDifference);

    // スプレッドシートを更新
    adventarBell.updateSpreadsheet(sheet, i + 1, calendarDifference);

    // 投稿があれば通知用のペイロードを生成
    const payload = slack.generatePostedArticlePayload(calendarDifference);
    Logger.log(payload);

    // 投稿があれば通知
    if (payload !== null) slack.postToWebhook(payload);
  }
}
