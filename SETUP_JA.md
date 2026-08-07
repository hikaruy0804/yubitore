# ゆっくりタイピング ソースコード

## 起動方法

macOS に Node.js 22.13以上を用意し、ターミナルで展開したフォルダへ移動して次を実行してください。

まずバージョンを確認します。

```bash
node --version
```

`v22.13.0` 以上が表示されない場合は、Node.js 22へ切り替えてから進めてください。
このフォルダには nvm / nodenv / mise などが参照できるバージョン指定ファイルも含めています。

```bash
npm install
npm run dev
```

画面に表示されたローカルURL（通常は `http://localhost:5173`）をブラウザで開きます。
終了するときはターミナルで `Control + C` を押します。

配布用ビルドも確認する場合は、次を実行します。

```bash
npm run build
npm run start
```

`npm run install:ci` は公開環境向けの Linux 専用処理です。macOS のローカル実行では使用しません。

## 主なファイル

- `app/page.tsx`: 練習データ、入力判定、画面UI
- `app/globals.css`: デザインとレスポンシブ表示
- `app/layout.tsx`: ページ情報と共通レイアウト
- `package.json`: 依存パッケージと実行コマンド

履歴と設定はブラウザの `localStorage` に保存されます。

依存パッケージと生成済みファイルは配布物に含まれないため、初回に `npm install` が必要です。
