// カレンダーの日数
export const DAYS_IN_CALENDAR: number = 25;

// シートの名前
const _sheet_name: string | null = PropertiesService.getScriptProperties().getProperty('sheet_name');
if (_sheet_name === null) { // error handling
  throw new Error('The value of "_sheet_name" is null.');
}
export const SHEET_NAME: string = _sheet_name || '';

// WebhookのURL
export const SLACK_WEBHOOK_URL: string | null = PropertiesService.getScriptProperties().getProperty('slack_webhook_url');
export const DISCORD_WEBHOOK_URL: string | null = PropertiesService.getScriptProperties().getProperty('discord_webhook_url');
