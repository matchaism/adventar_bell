const slack = {
  // 投稿された記事のペイロードの配列を生成
  generatePostedArticlePayloads: function(calendarEntry) {
    const payloads = [];

    for (let i = 0; i < config.DAYS_IN_CALENDAR; i++) {
      // 新しい投稿があるか
      if (calendarEntry.calendarStatus[i] === 'posted') {
        // 投稿メッセージを作成
        const block = {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `${calendarEntry.authors[i]} posted <${calendarEntry.articles[i]}|Day ${i + 1} Article>!!`
          }
        };
        // ペイロードを作成
        payloads.push({
          'username': calendarEntry.custom.botName,
          'icon_emoji': calendarEntry.custom.iconEmoji,
          "unfurl_links": true, "unfurl_media": true, // リンク先の記事のプレビューを表示
          'blocks': [block]
        });
      }
    }

    return payloads;
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
