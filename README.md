# Adventar Bell

[![adventar](https://img.shields.io/badge/adventar-D35F4A.svg)](https://adventar.org/) [![Google Sheets](https://img.shields.io/badge/Google%20Sheets-gray.svg?logo=googlesheets)](https://www.google.com/intl/ja_jp/sheets/about/) [![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-gray.svg?logo=googleappsscript)](https://script.google.com/) [![slack](https://img.shields.io/badge/slack-gray.svg?logo=slack)](https://slack.com/) [![discord](https://img.shields.io/badge/discord-gray.svg?logo=discord)](https://discord.com/) [![clasp](https://img.shields.io/badge/deploy%20with-clasp-4285f4.svg)](https://github.com/google/clasp) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![deploy](https://github.com/matchaism/adventar_bell/actions/workflows/deploy.yml/badge.svg?branch=deploy)](https://github.com/matchaism/adventar_bell/actions/workflows/deploy.yml)

## Usage

本体は`src/`で，それ以外は雑多な用途のためのファイル．

 1. [advent_calendar.xlsx](./template/advent_calendar.xlsx)を参考に，Googleスプレッドシートを作成
    - CSV版: [advent_calendar.csv](./template/advent_calendar.csv)
    - スプレッドシートにコピー&ペーストか，インポート
 2. 登録したいAdventarのtitle, urlを入力 (1行に1つのAdventar)
 3. スプレッドシートの拡張機能Apps Scriptの画面へ
 4. `src/`以下のスクリプト(JavaScript)を全てアップロード: エディタ > ファイル > + (ファイルを追加) > スクリプト
 5. ライブラリの登録: エディタ > ライブラリ > + (ライブラリを追加) > Cheerioを追加
 6. スクリプトプロパティの編集: プロジェクトの設定 > スクリプトプロパティ
    - `sheet_name`: `<スプレッドシートのシート名>`
    - Slack
      1. 事前にカスタムインテグレーションから，Incoming Webhookの設定
      2. `slack_webhook_url`: `https://hooks.slack.com/services/~` > WebhookのURLをコピー
    - Discord
      1. 事前にサーバ設定 > 連携サービス > ウェブフック > 新しいウェブフックの作成 > ウェブフックURLをコピー
      2. `discord_webhook_url`: `https://discord.com/api/webhooks/~`
 7. これで実行できる
 8. 定期実行のため，トリガーを追加

## GitHub Actionsによるclaspを利用した自動デプロイ

ワークフロー: [deploy.yml](.github/workflows/deploy.yml)

 1. clasp，Apps Scriptの認証情報を，[Actions secrets and variables](./settings/secrets/actions) (Settings > Secrets and variables > Actions)に登録
 2. deployブランチにpush，または手動で実行([Actions](./actions/))
 3. GitHub Actionsによるデプロイが自動で進行
    - 内部では，`clasp push --force`と`clasp deploy --deploymentId $DEPLOYMENT_ID`を実行
 4. GAS側の定期実行が必要なら，別途設定

### 認証情報

|認証|Secrets|
|---|---|
|clasp|`ACCESS_TOKEN`, `REFRESH_TOKEN`, `SCOPE`, `TOKEN_TYPE`, `ID_TOKEN`, `EXPIRY_DATE`, `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `IS_LOCAL_CREDS`|
|Apps Script|`DEPLOYMENT_ID`, `SCRIPT_ID`|

## License

This package is open-sourced software licensed under the [MIT license](https://choosealicense.com/licenses/mit/).
