namespace discord {
  // 投稿された記事のペイロードの配列を生成
  export function generatePostedArticlePayloads(calendarEntry: adventarBell.CalendarEntry): Array<string> {
    const payloads: Array<string> = [];

    for (let i: number = 0; i < config.DAYS_IN_CALENDAR; i++) {
      // 新しい投稿があるか
      if (calendarEntry.calendarStatus[i] === 'posted') {
        // 投稿メッセージを作成
        const message: string = `${calendarEntry.authors[i]} posted Day ${i + 1} Article!!\r${calendarEntry.articles[i]}`;
        // ペイロードを作成
        const _payload: Record<string, string> = {
          'username': calendarEntry.custom.botName,
          //'avatar_url': , // override the default avatar of the webhook
          'content': message
        };
        payloads.push(JSON.stringify(_payload));
      }
    }

    return payloads;
  }

  // WebhookにPOSTリクエストを送信 (Slackと同じ)
  export function postToWebhook(payload: string): void {
    const _url: string | null = config.DISCORD_WEBHOOK_URL;
    if (_url === null) { // error handling
      throw new Error('The value of "DISCORD_WEBHOOK_URL" is null.');
    }
    const url: string = _url;

    const options: Record<string, string> = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': payload
    };

    // post
    UrlFetchApp.fetch(url, options);
  }
}
