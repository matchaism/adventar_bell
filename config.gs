const config = {
  // グローバル定数
  DAYS_IN_CALENDAR: 25, // カレンダーの日数
  YEAR: 2024, // 対象の年

  // WebhookのURL (プロジェクトの設定 > スクリプト プロパティ)
  WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty('webhook_url'),
}
