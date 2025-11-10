# 2025ディレクトリ ファイル整理計画書

## 📊 現状分析

### ファイル統計
- **総ファイル数**: 50
- **マークダウンファイル**: 42
- **画像ファイル**: 5
- **Draw.io図**: 3

### 現在のディレクトリ構造
```
2025/
├── anchorWiki/
├── consutaiton_n_interview/
│   ├── chatBot_ICE/
│   ├── chornology/
│   ├── diagrams/
│   └── resources/
├── SE/
└── (ルートに散在する多数のファイル)
```

---

## 🎯 整理方針

### カテゴリー分類

ファイルの内容を分析し、以下のカテゴリーに分類します:

#### 1. **プロジェクト管理** (`project-management/`)
- プロジェクト管理、見積もり、デリバリーに関連するファイル
- 対象ファイル:
  - `Project Management.md`
  - `Estimation of tasks.md`
  - `project_delivery_lessons.md`
  - `release_failure_retro.md`
  - `parallel_project_management_strategy.md`

#### 2. **開発ベストプラクティス** (`development-practices/`)
- コーディング標準、PRレビュー、ガイドラインに関連するファイル
- 対象ファイル:
  - `Pull request standards and best Practice.md`
  - `meeting guideline.md`
  - `shift left alert approaches.md`
  - `What Does Larger Scale Software Development Look Like.md`
  - `大規模ソフトウェア開発の実態.md`

#### 3. **技術資料・ツール** (`technical-resources/`)
- 技術調査、ツール比較、設定ガイドに関連するファイル
- 対象ファイル:
  - `ELK.ja.md`
  - `apache_spark_guide.md`
  - `groovy_vs_scala_comparison.md`
  - `scala_use_cases_detailed.md`
  - `Scala in 100 Seconds.md`
  - `drawio-tools-comparison.md`
  - `cypress.md`
  - `bluesky-testing-research.md`
  - `Maestro を使用した自動 UI テスト - YouTube.md`
  - `Let AI Explore Your Site & Write Tests with Playwright MCP!.md`
  - `playwright-mcp-setup-steps.md`

#### 4. **データベース・アーキテクチャ** (`database-architecture/`)
- データベース設計、正規化に関連するファイル
- 対象ファイル:
  - `Datbase NF.md`
  - `mapp.md`

#### 5. **ビジネス・キャリア** (`business-career/`)
- キャリア開発、ビジネス戦略、起業家ストーリーに関連するファイル
- 対象ファイル:
  - `Be at top.md`
  - `story of Marc Lou.md`
  - `信頼できるビジネスパートナーを見極める.md`

#### 6. **チーム・コミュニケーション** (`team-communication/`)
- チームコラボレーション、コミュニケーションに関連するファイル
- 対象ファイル:
  - `How to have a team with better communication practice.md`

#### 7. **ソフトウェアエンジニアリング** (`software-engineering/`)
- 既存のSEフォルダの内容と関連ファイル
- 対象ファイル:
  - `SE/outsourcing points 外部委託の点.md`

#### 8. **法務・契約** (`legal-contracts/`)
- 法的文書、競業避止義務に関連するファイル
- 対象ファイル:
  - `日本国内の競業避止義務.md`

#### 9. **トラブルシューティング・Tips** (`troubleshooting-tips/`)
- 問題解決、設定手順に関連するファイル
- 対象ファイル:
  - `WindowsでGoogle Chromeパスワードマネージャーにアクセスする際のフリーズ問題を解決する方法.md`
  - `Mount path in windows.md`
  - `Intellij IDE GitHub Copilot 言語変更する方法.md`
  - `OpenWrt.md`

#### 10. **図・画像** (`diagrams-images/`)
- ルートレベルの図と画像ファイル
- 対象ファイル:
  - `ELK-architecture.drawio`
  - `image-2.png`

#### 11. **Anchorプロジェクト専用** (`anchor-project/`)
- Anchorプロジェクト関連の仕様書とドキュメント
- 既存フォルダ:
  - `anchorWiki/`
  - `consutaiton_n_interview/` (名前を `consultation-interview/` に修正)

---

## 📋 実行計画

### ステップ1: 新しいディレクトリ構造の作成
```
2025/
├── project-management/
├── development-practices/
├── technical-resources/
├── database-architecture/
├── business-career/
├── team-communication/
├── software-engineering/
├── legal-contracts/
├── troubleshooting-tips/
├── diagrams-images/
└── anchor-project/
    ├── wiki/
    └── consultation-interview/
```

**重要**: すべてのフォルダ名は英語で統一します。

### ステップ2: ファイルの移動
各カテゴリーごとにファイルを適切なディレクトリに移動

### ステップ3: 既存ディレクトリの統合・改名
- `anchorWiki/` → `anchor-project/anchor-wiki/`
- `consutaiton_n_interview/` → `anchor-project/consultation-interview/` (スペル修正)
- `SE/` → `software-engineering/` に統合

### ステップ4: README作成
各カテゴリーディレクトリに `README.md` を作成し、内容の概要を記載

### ステップ5: ルートディレクトリへのインデックス作成
`2025/` ディレクトリに `INDEX.md` を作成し、全体の構造と各カテゴリーの説明を記載

---

## ⚠️ 注意事項

1. **バックアップ**: 移動前に必ずバックアップを作成
2. **リンク切れ**: ファイル移動後、相互参照しているリンクの更新が必要な場合があります
3. **Git履歴**: ファイル移動は `git mv` コマンドを使用して履歴を保持
4. **重複確認**: 移動前に同名ファイルの重複がないか確認

---

## 🎬 次のアクション

承認後、以下の順序で実行します:

1. ✅ 新しいディレクトリ構造の作成
2. ✅ ファイルの移動 (gitコマンドを使用)
3. ✅ README.mdの作成
4. ✅ INDEX.mdの作成
5. ✅ 空ディレクトリの削除
6. ✅ 最終確認とレポート作成

---

## 📝 承認欄

- [x] 上記の整理方針を承認する
- [x] 変更が必要な点があれば、以下にコメントを記入してください:

```
(コメント欄)



```

---

**作成日**: 2025-11-10
**作成者**: Claude Code
