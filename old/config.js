const config = {
  // グローバル定数
  DAYS_IN_CALENDAR: 25, // カレンダーの日数
  SHEET_NAME: PropertiesService.getScriptProperties().getProperty('sheet_name'), // シートの名前
  // WebhookのURL
  SLACK_WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty('slack_webhook_url'),
  DISCORD_WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty('discord_webhook_url'),
}
