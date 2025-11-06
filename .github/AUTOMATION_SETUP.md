# GitHub プロジェクト自動追加の設定

## 概要

このワークフローは、新しいイシューが作成されたときに自動的に GitHub プロジェクトに追加します。

## 前提条件

このワークフローを使用するには、以下の設定が必要です：

### 1. Personal Access Token (PAT) の作成

1. GitHub の Settings → Developer settings → Personal access tokens → Tokens (classic) に移動
2. "Generate new token (classic)" をクリック
3. 以下のスコープを選択：
   - `repo` (フルコントロール)
   - `project` (プロジェクトへのフルアクセス)
4. トークンを生成してコピー

### 2. リポジトリシークレットの設定

1. リポジトリの Settings → Secrets and variables → Actions に移動
2. "New repository secret" をクリック
3. 名前: `ADD_TO_PROJECT_PAT`
4. 値: 上記で作成した Personal Access Token を貼り付け
5. "Add secret" をクリック

### 3. プロジェクト URL の確認

ワークフローファイル (`.github/workflows/add-to-project.yml`) で、`project-url` が正しいプロジェクトを指しているか確認してください。

現在の設定:
```yaml
project-url: https://github.com/users/Lysander086/projects/1
```

プロジェクト番号を変更する場合は、URL の最後の数字を変更してください。

## 使い方

設定が完了すると、新しいイシューが作成されるたびに、自動的に指定されたプロジェクトに追加されます。

## トラブルシューティング

- ワークフローが失敗する場合は、PAT が正しく設定されているか確認してください
- プロジェクト URL が正しいか確認してください
- PAT に必要な権限が付与されているか確認してください

## 参考

- [actions/add-to-project](https://github.com/actions/add-to-project)
- [GitHub Projects documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
