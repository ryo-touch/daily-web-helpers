# Daily Web Helpers
日々のウェブ作業を便利にする Chrome 拡張機能集。特定の URL に対して JavaScript / CSS を注入します。

現在搭載している機能:
- **Google Meet 録画自動化** — 録画パネルで「文字起こし」「Gemini ノート」のチェックボックスを自動 ON（詳細: [GoogleMeetTranscriptionEnabler_README.md](./GoogleMeetTranscriptionEnabler_README.md)）
- **Google 検索結果の順位表示** — SERP の各検索結果タイトルに順位番号を表示

## 使用方法
- ファイルをダウンロードする
- 拡張機能を追加する
  - `chrome://extensions/`を開く
  - 右上の「デベロッパーモード」をONにする
  - 「パッケージ化されていない拡張機能を読み込む」をクリック
  - ダウンロードしたファイルを選択する

## 実行したいページを増やしたいとき
manifest.json の `content_scripts` を以下のように編集する。

```json
  "content_scripts": [
    {
      "matches": ["*://example1.com/*"],
      "js": ["javascript1.js"]
    }
    ,{
      "matches": ["*://example2.com/*"],
      "js": ["javascript2.js"]
    }
  ]
```
