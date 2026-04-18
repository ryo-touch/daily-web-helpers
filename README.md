# Daily Web Helpers

日々のウェブ作業を便利にする Chrome 拡張機能集。特定の URL に対して JavaScript / CSS を注入します。

## 搭載機能

| 機能 | 対象 URL | 実装 | 詳細 |
| --- | --- | --- | --- |
| Google Meet 録画自動化 | `meet.google.com/*` | `googleMeetAutoRecord.js` | [googleMeetAutoRecord_README.md](./googleMeetAutoRecord_README.md) |
| Google 検索結果の順位表示 | `www.google.com/search*`, `www.google.co.jp/search*` | `google_rank.css` | 下記参照 |

### Google Meet 録画自動化

録画パネルで「文字起こしも開始」「Gemini によるメモ作成も開始する」を自動でチェックします。録画の開始ボタン自体は手動でクリックする必要があります。詳細・トラブルシューティングは [googleMeetAutoRecord_README.md](./googleMeetAutoRecord_README.md) を参照。

### Google 検索結果の順位表示

SERP の各検索結果タイトル（`h3.LC20lb`）の前に、CSS counter を使って順位番号をハイライト表示します。広告や特殊カードは対象外で、通常の検索結果のみをカウントします。

## インストール方法

1. このリポジトリを clone または ZIP ダウンロードして展開する
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」を ON にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. ダウンロードした**フォルダ**（`manifest.json` があるディレクトリ）を選択する

## 新しい URL 向けスクリプトを追加する

1. ルート直下にスクリプトファイル（例: `myFeature.js`）を作成する
2. `manifest.json` の `content_scripts` 配列に追記する:
   ```json
   {
     "matches": ["*://example.com/*"],
     "js": ["myFeature.js"]
   }
   ```
   CSS の場合は `"js"` の代わりに `"css"` を使う。
3. `chrome://extensions/` で拡張機能を「更新」ボタンで再読み込みする
4. 既存スクリプトのパターン（IIFE + `CONFIG` オブジェクト + MutationObserver + debounce + ログヘルパー）に倣う

## ファイル構成

```
.
├── manifest.json                       # 拡張定義（Manifest V3）
├── googleMeetAutoRecord.js             # Meet 録画自動化スクリプト
├── googleMeetAutoRecord_README.md      # Meet 機能の詳細マニュアル
├── google_rank.css                     # SERP 順位表示スタイル
├── icons/                              # 拡張アイコン（16/48/128px）
├── CLAUDE.md                           # Claude Code 向けプロジェクト指示
├── LICENSE                             # MIT License
└── README.md                           # このファイル
```

## バージョン

現在のバージョンは `manifest.json` の `version` フィールドを参照してください。

## ライセンス

[MIT License](./LICENSE)
