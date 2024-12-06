const discord = {
  generatePostedArticlePayloads: function(calendarEntry) {
    const payloads = [];

    for (let i = 0; i < config.DAYS_IN_CALENDAR; i++) {
      // 新しい投稿があるか
      if (calendarEntry.calendarStatus[i] === 'posted') {
        // 投稿メッセージを作成
        const message = `${calendarEntry.authors[i]} posted Day ${i + 1} Article!!\r${calendarEntry.articles[i]}`;
        // ペイロードを作成
        payloads.push({
          'username': calendarEntry.custom.botName,
          //'avatar_url': , // override the default avatar of the webhook
          'content': message
        });
      }
    }

    return payloads;
  },

  // WebhookにPOSTリクエストを送信
  // Slackと同じ
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
