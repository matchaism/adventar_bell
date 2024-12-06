const slack = {
  // 投稿された記事のペイロードを生成
  generatePostedArticlePayload: function(calendarEntry) {
    const blocks = [];
    for (let i = 0; i < config.DAYS_IN_CALENDAR; i++) {
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
    // 投稿がなければペイロードは作成しない
    if (blocks.length === 0) return null;

    return {
      'username': calendarEntry.custom.botName,
      'icon_emoji': calendarEntry.custom.iconEmoji,
      "unfurl_links": true, "unfurl_media": true, // リンク先の記事のプレビューを表示
      'blocks': blocks
    };
  },

  // WebhookにPOSTリクエストを送信
  postToWebhook: function(url, payload) {
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    };
    // post
    UrlFetchApp.fetch(url, options);
  },
}
