# Adventar Bell

 1. [このスプレッドシート](https://docs.google.com/spreadsheets/d/14hlydGir8g9v0aACmaKSolURhq8drC39v0V7HGUdT0k/edit?usp=sharing)を参考に，スプレッドシートを作成
    - 1行目(ヘッダー)を作成
    - Adventarのtitle, urlを入力 (1行に1つのAdventar)
 2. スプレッドシートの拡張機能Apps Scriptの画面へ
 3. スクリプトを全て載せる: エディタ > ファイル > ラスクリプトを追加
 4. ライブラリの登録: エディタ > ライブラリ > Cheerioを追加
 5. スクリプトプロパティの編集: プロジェクトの設定 > スクリプトプロパティ
    - `slack_webhook_url: https://hooks.slack.com/services/~`
    - `sheet_name: <スプレッドシートのシート名>`
 6. これで実行できる
 7. 定期実行のため，トリガーを追加
