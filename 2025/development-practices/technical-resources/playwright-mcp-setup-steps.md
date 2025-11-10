# Playwright MCP セットアップ - 実行可能なステップ

## 概要
このガイドは、Playwright MCP (Model Context Protocol) を使用してAIにWebサイトの探索とテスト作成を実行させるための手順です。

## 前提条件
- Node.js と npm がインストールされていること
- VSCode または対応するエディタがインストールされていること
- Claude Code または MCP対応のAIツールが利用可能であること

## ステップ1: プロジェクトの準備

### 1.1 プロジェクトディレクトリの確認
```bash
# 現在のディレクトリを確認
pwd
```

### 1.2 package.json の存在確認
```bash
# package.json が存在しない場合は作成
npm init -y
```

## ステップ2: Playwright MCP サーバーの設定

### 2.1 MCP設定ファイルの作成
プロジェクトルートに `mcp.json` ファイルを作成します:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

### 2.2 設定ファイルの配置場所
```bash
# VSCode の場合: .vscode/mcp.json
mkdir -p .vscode
cp mcp.json .vscode/mcp.json

# または プロジェクトルートに配置
# ./mcp.json
```

## ステップ3: Playwright のインストール

### 3.1 Playwright パッケージのインストール
```bash
npm install -D @playwright/test
```

### 3.2 Playwright ブラウザのインストール
```bash
npx playwright install
```

### 3.3 インストールの確認
```bash
npx playwright --version
```

## ステップ4: MCP サーバーの起動と確認

### 4.1 Claude Code または対応ツールでの確認
- エディタを再起動
- MCP サーバーが自動的に起動することを確認
- ステータスバーに "Running | Stop | Restart | 25 tools | More..." のような表示があることを確認

### 4.2 利用可能なツールの確認
MCP が正しく動作している場合、以下のようなツールが利用可能になります:
- `playwright_navigate` - ページへの移動
- `playwright_screenshot` - スクリーンショットの取得
- `playwright_click` - 要素のクリック
- `playwright_fill` - フォーム入力
- `playwright_evaluate` - JavaScriptの実行
- その他多数のPlaywright関数

## ステップ5: AIによるサイト探索の実行

### 5.1 基本的な探索コマンド例
AIに以下のような指示を出します:

```
「https://example.com にアクセスして、
ページの構造を探索し、主要な要素をスクリーンショットしてください」
```

### 5.2 テスト生成の指示例
```
「先ほど探索したページに対して、
以下のシナリオのPlaywrightテストを生成してください:
1. ページが正しく読み込まれること
2. ナビゲーションメニューが表示されること
3. 検索フォームが機能すること」
```

## ステップ6: 生成されたテストの実行

### 6.1 テストファイルの配置
生成されたテストコードを `tests/` ディレクトリに保存:
```bash
mkdir -p tests
# AIが生成したコードを tests/example.spec.ts に保存
```

### 6.2 テストの実行
```bash
# すべてのテストを実行
npx playwright test

# 特定のテストファイルを実行
npx playwright test tests/example.spec.ts

# ヘッドモードで実行(ブラウザを表示)
npx playwright test --headed

# UIモードで実行(デバッグ用)
npx playwright test --ui
```

### 6.3 テスト結果の確認
```bash
# HTMLレポートを生成して表示
npx playwright show-report
```

## ステップ7: 継続的な改善

### 7.1 テストの更新
AIに以下のような指示でテストを改善:
```
「先ほどのテストに以下を追加してください:
- エラーハンドリング
- より詳細なアサーション
- スクリーンショット比較」
```

### 7.2 ページオブジェクトモデルの作成
```
「このテストをページオブジェクトモデルパターンに
リファクタリングしてください」
```

## トラブルシューティング

### MCP サーバーが起動しない場合
```bash
# npxのキャッシュをクリア
npm cache clean --force

# Playwrightを再インストール
npm uninstall @playwright/test
npm install -D @playwright/test
npx playwright install
```

### ブラウザが起動しない場合
```bash
# システムの依存関係をインストール(Linux)
npx playwright install-deps

# 特定のブラウザのみインストール
npx playwright install chromium
```

### テストがタイムアウトする場合
`playwright.config.ts` でタイムアウトを調整:
```typescript
export default {
  timeout: 60000, // 60秒
  expect: {
    timeout: 10000 // 10秒
  }
}
```

## 次のステップ

1. **CI/CDへの統合**: GitHub Actions や他のCI/CDツールでテストを自動実行
2. **ビジュアルリグレッションテスト**: スクリーンショット比較を追加
3. **アクセシビリティテスト**: `@axe-core/playwright` を統合
4. **パフォーマンステスト**: Lighthouse との統合

## 参考リンク

- [Playwright 公式ドキュメント](https://playwright.dev/)
- [MCP プロトコル仕様](https://modelcontextprotocol.io/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---
*生成日: 2024年11月*
*対象: Playwright MCP を使用したAI駆動のテスト作成*
