# Daily Web Helpers

日々のウェブ作業を便利にする Chrome 拡張機能集。特定 URL に対して JavaScript / CSS を注入する。

## アーキテクチャ

- Manifest V3 Chrome 拡張
- エントリポイント: `manifest.json` の `content_scripts` で URL → script を紐付け
- 各 content script は IIFE で独立。スクリプト間通信 / `chrome.storage` は使用していない
- background service worker / popup UI は持たない（必要になったら追加）
- ホスト権限は `content_scripts.matches` で限定（`host_permissions` は使わない）

## ファイル構成

- `manifest.json` — 拡張定義
- `googleMeetAutoRecord.js` — Google Meet 録画パネルで「文字起こし」「Gemini ノート」を自動チェック
- `google_rank.css` — Google 検索結果に順位番号を CSS counter で表示
- `icons/` — 拡張アイコン（16/48/128px）
- `README.md` — 拡張全体の概要と機能一覧
- `GoogleMeetTranscriptionEnabler_README.md` — Meet 自動化機能の詳細マニュアル

## 新しい URL 向けスクリプトを追加するとき

1. ルート直下にスクリプトファイル（例: `myFeature.js`）を作成
2. `manifest.json` の `content_scripts` 配列に追記:
   ```json
   {
     "matches": ["*://example.com/*"],
     "js": ["myFeature.js"]
   }
   ```
3. `chrome://extensions/` で「更新」ボタンを押して再読み込み
4. 既存パターン（IIFE + `CONFIG` オブジェクト + MutationObserver + debounce + ログヘルパー）を参考にする

## 動作確認方法

- `chrome://extensions/` → デベロッパーモード ON → 「パッケージ化されていない拡張機能を読み込む」
- F12 → Console で `[<Feature Name>] ...` プレフィックスのログを確認
- Meet 機能は録画権限のあるアカウントで会議オーナーとしてテストが必要
- SERP 機能は `https://www.google.com/search?q=test` で順位番号が表示されることを確認

## 既知の脆さ

- DOM クラス名（`KGC9Kd-muHVFf-bMcfAe`、`.MjjYud`、`h3.LC20lb` 等）は Google 側の変更で壊れる
- 日本語 UI 文字列（「ビデオ通話の録画」）依存。多言語対応はしていない
- 壊れたら Issue 化 → 新しい selector / fallback を検討する

## コーディング規約

- 関数名・変数名は英語
- コメントは日本語可（既存スクリプトに倣う）
- ログプレフィックスは `[<Feature Name>]` 形式で統一し、`log` / `warn` ヘルパー経由で出力
- IIFE で global 汚染を避ける
- 設定値はファイル冒頭の `CONFIG` オブジェクトに集約

## 開発ワークフロー

- 機能追加: ブランチ切る → 実装 → 手動確認 → PR
- バグ修正: Console ログで現象を再現できることを確認してから修正
- リリース: `manifest.json` の `version` をインクリメント
