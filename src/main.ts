function main(): void {
  // スプレッドシートを取得
  const spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const _sheet: GoogleAppsScript.Spreadsheet.Sheet | null = spreadsheet.getSheetByName(config.SHEET_NAME);
  if (_sheet === null) { // error handling
    throw new Error(`Sheet with name "${config.SHEET_NAME}" not found.`);
  }
  const sheet: GoogleAppsScript.Spreadsheet.Sheet = _sheet;

  const dataRange: GoogleAppsScript.Spreadsheet.Range = sheet.getDataRange();

  const data: Array<Array<string | null>> = dataRange.getValues();

  // データの行を1行ずつ処理
  for (let i: number = 1; i < data.length; i++) {
    // スプレッドシートからカレンダー情報を取得
    const prevCalendarEntry: adventarBell.CalendarEntry = adventarBell.getCalendarEntryFromSpreadsheet(data[i]);
    Logger.log(prevCalendarEntry);

    // Webから最新のカレンダー情報を取得
    const currentCalendarEntry: adventarBell.CalendarEntry = adventarBell.getCalendarEntryFromWeb(data[i]);
    Logger.log(currentCalendarEntry);

    // 差分を取得
    const calendarDifference: adventarBell.CalendarEntry = adventarBell.getCalendarDifference(prevCalendarEntry, currentCalendarEntry);
    Logger.log(calendarDifference);

    // スプレッドシートを更新
    adventarBell.updateSpreadsheet(sheet, i + 1, calendarDifference);

    // Slack
    if (config.SLACK_WEBHOOK_URL !== null) {
      // 投稿があれば通知用のペイロードを生成
      const payloads: Array<string> = slack.generatePostedArticlePayloads(calendarDifference);
      Logger.log(payloads);
      // 投稿があれば通知
      for (let i: number = 0; i < payloads.length; i++) {
        slack.postToWebhook(payloads[i]);
        Utilities.sleep(1000); // 1秒待機 (Slackのレート制限:1 per second)
      }
    }

    // Discord
    if (config.DISCORD_WEBHOOK_URL !== null) {
      // 投稿があれば通知用のペイロードを生成
      const payloads: Array<string> = discord.generatePostedArticlePayloads(calendarDifference);
      Logger.log(payloads);
      // 投稿があれば通知
      for (let i: number = 0; i < payloads.length; i++) {
        discord.postToWebhook(payloads[i]);
        Utilities.sleep(500); // 0.5秒待機 (Discordのレート制限:2 per second)
      }
    }

  }
}
