const config = {
  // グローバル定数
  DAYS_IN_CALENDAR: 25, // カレンダーの日数
  SHEET_NAME: PropertiesService.getScriptProperties().getProperty('sheet_name'), // シートの名前
  SLACK_WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty('slack_webhook_url'), // WebhookのURL
}
