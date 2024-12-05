const config = {
  // グローバル定数
  DAYS_IN_CALENDAR: 25, // カレンダーの日数
  YEAR: PropertiesService.getScriptProperties().getProperty('sheet_name'), // 対象の年
  WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty('slack_webhook_url'), // WebhookのURL
}
