namespace slack {
  // 投稿された記事のペイロードの配列を生成
  export function generatePostedArticlePayloads(calendarEntry: adventarBell.CalendarEntry):  Array<string> {
    const payloads: Array<string> = [];

    for (let i: number = 0; i < config.DAYS_IN_CALENDAR; i++) {
      // 新しい投稿があるか
      if (calendarEntry.calendarStatus[i] === 'posted') {
        // 投稿メッセージを作成
        const block: Record<string, string | Record<string, string>> = {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `${calendarEntry.authors[i]} posted <${calendarEntry.articles[i]}|Day ${i + 1} Article>!!`
          }
        };
        // ペイロードを作成
        const _payload: Record<string, string | boolean | Array<typeof block>> = {
          'username': calendarEntry.custom.botName,
          'icon_emoji': calendarEntry.custom.slackIconEmoji,
          'unfurl_links': true, 'unfurl_media': true, // リンク先の記事のプレビューを表示
          'blocks': [block]
        };
        payloads.push(JSON.stringify(_payload));
      }
    }

    return payloads;
  }

  // WebhookにPOSTリクエストを送信
  export function postToWebhook(payload: string): void {
    const _url: string | null = config.SLACK_WEBHOOK_URL;
    if (_url === null) { // error handling
      throw new Error('The value of "SLACK_WEBHOOK_URL" is null.');
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
