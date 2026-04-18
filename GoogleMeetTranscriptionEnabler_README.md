# Google Meet Transcription Enabler

Google Meetの録画パネルで「文字起こしも開始」と「Geminiによるメモ作成も開始する」のチェックボックスを自動的にチェックするChrome拡張スクリプトです。

## 機能

✅ **自動チェック対応:**
- 「文字起こしも開始」チェックボックスを自動選択
- 「Gemini によるメモ作成も開始する」チェックボックスを自動選択

❌ **自動チェック非対応:**
- 「録画に字幕を含める」チェックボックスは触りません

📝 **録画開始:**
- 録画開始ボタンは**手動でクリック**してください（自動クリックしません）

## なぜChrome拡張機能なのか？

Google Meetは「Add-onsを使うことを推奨」していますが、**Add-ons APIでは録画/文字起こしのUIを自動操作できません**。チェックボックスの自動選択にはChrome拡張機能が必須です。

> ⚠️ Google Meetのコンソールに「拡張機能よりもアドオンを開発することをおすすめします」という警告が表示されますが、この用途では無視してOKです。

## 必要条件

- Google Meetで録画を開始できる権限（会議のオーナーまたは管理者）
- [Daily Web Helpers](https://github.com/ryo-touch/daily-web-helpers) Chrome拡張機能

## 使い方

1. Google Meetで会議を開始または参加
2. **画面下部の「⋮」(その他のオプション)をクリック**
3. **「録画を管理する」をクリック**
4. 録画パネルが右側に表示される
5. スクリプトが自動的に2つのチェックボックスをチェック ✓
6. コンソールログで動作を確認（F12キーで開発者ツールを開く）
7. **手動で「録画を開始」ボタンをクリック**

## コンソールログ例

### 成功時

```
[Google Meet Auto-Record] Script initialized. Watching for recording dialog...
[Google Meet Auto-Record] Recording dialog detected
[Google Meet Auto-Record] Found 3 checkbox(es)
[Google Meet Auto-Record] Transcription checkbox checked ✓
[Google Meet Auto-Record] Gemini checkbox checked ✓
[Google Meet Auto-Record] Auto-checkbox execution completed. You can now manually click the start recording button.
[Google Meet Auto-Record] Observer disconnected
```

### チェックボックスが既にチェック済みの場合

```
[Google Meet Auto-Record] Recording dialog detected
[Google Meet Auto-Record] Found 3 checkbox(es)
[Google Meet Auto-Record] Transcription checkbox already checked
[Google Meet Auto-Record] Gemini checkbox already checked
[Google Meet Auto-Record] Auto-checkbox execution completed.
```

### 録画権限がない場合（60秒後）

```
[Google Meet Auto-Record] Script initialized. Watching for recording dialog...
[Google Meet Auto-Record] Recording dialog not detected within timeout period. This may occur if you are not the meeting owner or do not have recording permissions.
```

## トラブルシューティング

### チェックボックスが自動選択されない

1. **録画パネルを開いているか確認**
   - 「⋮」→「録画を管理する」をクリックしましたか？

2. **ブラウザのコンソール（F12）でエラーメッセージを確認**
   - `[Google Meet Auto-Record] Recording dialog detected` が表示されますか？
   - `[Google Meet Auto-Record] Found 0 checkbox(es)` の場合、Google MeetのUI構造が変更された可能性があります

3. **拡張機能が有効か確認**
   - `chrome://extensions/` で「URL-Specific-JS-Executor」が有効になっているか確認
   - ページをリロード（F5）

### タイムアウトメッセージが表示される

```
[Google Meet Auto-Record] Recording dialog not detected within timeout period.
```

**原因:**
- 会議のオーナーではない
- 録画権限がない
- 録画パネルを開いていない

**対処法:**
- Google Workspace管理者に録画権限を確認
- 会議のオーナーとして参加
- 手動で録画パネルを開く（「⋮」→「録画を管理する」）

### Google Meetの警告について

以下の警告が表示されますが、**無視してOK**です：

```
Meet の拡張機能よりも、アドオンを開発することをおすすめします。
拡張機能はページを変更するため、ユーザーにとって問題が生じる可能性が高まります。
```

**理由:** Google Meet Add-ons APIでは録画オプションのUI自動操作ができません。この用途ではChrome拡張機能が唯一の解決策です。

## 技術的な詳細

### 実装方法

- **監視方法:** MutationObserverでDOM変化を監視
- **要素検出:** クラス名 `KGC9Kd-muHVFf-bMcfAe` でチェックボックスを特定
- **識別方法:** チェックボックスの順序で判定
  - 0番目: 「録画に字幕を含める」→ スキップ
  - 1番目: 「文字起こしも開始」→ 自動チェック
  - 2番目: 「Gemini によるメモ作成も開始する」→ 自動チェック
- **デバウンス:** 200msの遅延で過剰な実行を防止
- **タイムアウト:** 60秒後に自動的に監視を停止
- **実行制御:** 1回のみ実行（複数回の実行を防止）

### エッジケース対応

スクリプトは以下のケースに対応しています：

- ✅ チェックボックスが既にチェック済みの場合（再クリックせずスキップ）
- ✅ ダイアログの表示が遅い場合（デバウンスとリトライ）
- ✅ 会議オーナーでない場合（タイムアウト後にグレースフル終了）
- ✅ ダイアログを複数回開く場合（実行フラグで防止）
- ✅ 要素が見つからない場合（nullチェックと警告ログ）

## よくある質問

**Q: 録画を自動開始できますか？**
A: いいえ。このスクリプトはチェックボックスの自動選択のみです。「録画を開始」ボタンは手動でクリックしてください。

**Q: Google Meetが「Add-onsを使え」と言ってきますが？**
A: Add-ons APIではUI自動操作ができないため無視してOKです。

**Q: チェックボックスの順序が変わったら？**
A: Google MeetのUI変更により動作しなくなる可能性があります。その場合はIssueを報告してください。

**Q: 他のGoogle Meetユーザーにも影響しますか？**
A: いいえ。あなたのブラウザでのみ動作します。

## ライセンス

MIT License

## 関連リンク
- [Google Meet API](https://developers.google.com/workspace/meet/api/guides/overview) - API制限の説明
