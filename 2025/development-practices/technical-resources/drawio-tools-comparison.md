# Draw.io 作図ツール比較表

## Draw.io で利用可能なツール一覧

| ソリューション名 | 主な機能 | 評価（5点満点） | 備考 |
|--------------|---------|----------------|------|
| **Draw.io Desktop** | • オフライン作業可能<br>• ローカルファイル保存<br>• 豊富な図形ライブラリ<br>• VSCode統合可能<br>• Git連携 | ⭐⭐⭐⭐⭐ | 無料、オープンソース。開発者に最適。ファイル形式は`.drawio`または`.drawio.xml` |
| **Draw.io Web (app.diagrams.net)** | • ブラウザベース<br>• インストール不要<br>• クラウドストレージ統合<br>• リアルタイム共同編集（一部）<br>• テンプレート豊富 | ⭐⭐⭐⭐ | 無料。インターネット接続必須。Google Drive、OneDrive連携可能 |
| **Draw.io VSCode Extension** | • VSCodeで直接編集<br>• マークダウンへの埋め込み<br>• プレビュー機能<br>• Git差分表示<br>• コード連動 | ⭐⭐⭐⭐⭐ | 無料。開発ワークフローに最適。拡張機能ID: `hediet.vscode-drawio` |
| **diagrams.net (旧名)** | • Draw.ioと同一<br>• Webベース<br>• エンタープライズ向けホスティング可能 | ⭐⭐⭐⭐ | Draw.ioの別名。機能は同一 |
| **Obsidian Draw.io Plugin** | • Obsidianノート内で図作成<br>• ナレッジベースとの統合<br>• リンク機能<br>• バックリンク対応 | ⭐⭐⭐⭐⭐ | 無料。Obsidianユーザーに最適。プラグインID: `drawio-obsidian` |

## 推奨ツール選択ガイド

### ユースケース別推奨

| ユースケース | 推奨ツール | 理由 |
|------------|-----------|------|
| **ソフトウェア開発プロジェクト** | Draw.io VSCode Extension | コードとドキュメントを同一環境で管理可能 |
| **技術ドキュメント作成** | Draw.io Desktop | オフライン作業、バージョン管理、高速動作 |
| **ナレッジマネジメント** | Obsidian Draw.io Plugin | ノート間リンク、知識の可視化 |
| **クイック作図** | Draw.io Web | インストール不要、すぐに開始可能 |
| **チームコラボレーション** | Draw.io Web + Google Drive | リアルタイム共有、コメント機能 |

## インストール手順

### 1. Draw.io Desktop
```bash
# Windows (Chocolatey)
choco install drawio

# macOS (Homebrew)
brew install --cask drawio

# Linux (Snap)
snap install drawio
```

### 2. VSCode Extension
```bash
# VSCode内で
code --install-extension hediet.vscode-drawio

# または、Extensions マーケットプレイスで "Draw.io Integration" を検索
```

### 3. Obsidian Plugin
1. Obsidian設定 → コミュニティプラグイン
2. "Draw.io" で検索
3. インストール → 有効化

### 4. Web版（インストール不要）
- URL: https://app.diagrams.net/
- ブラウザで直接アクセス
 
## まとめ

**最適な選択:**
- 本プロジェクト（Lysander-blog）では **Obsidian Draw.io Plugin** を推奨
- 理由: ナレッジベースとの統合、双方向リンク、バージョン管理
- 代替: VSCode Extension（コード関連ドキュメント用）

**次のステップ:**
1. Obsidian Draw.io Pluginをインストール
2. `diagrams/` フォルダを作成
3. タイムラインフローチャートを作成
4. `spec.md` にObsidianリンクを挿入
