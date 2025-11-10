# Bluesky Social テスト戦略の完全調査レポート

## エグゼクティブサマリー

Bluesky Socialは、オープンソースの分散型ソーシャルネットワークであり、React Nativeで構築されたモバイルアプリケーションとAT Protocol（atproto）バックエンドから構成されています。本レポートでは、Blueskyのテスト戦略、使用ツール、CI/CD実装、およびコスト最適化アプローチについて詳細に調査した結果を報告します。

---

## 1. プロジェクト構成

### 1.1 リポジトリ構造

Blueskyは2つの主要なGitHubリポジトリで構成されています：

1. **bluesky-social/social-app** - React Nativeモバイルアプリケーション（iOS、Android、Web）
2. **bluesky-social/atproto** - AT Protocolバックエンドサービス（モノレポ構造）

### 1.2 技術スタック

**フロントエンド（social-app）:**
- React Native（Expo使用）
- TypeScript
- Node.js >=18.7.0
- パッケージマネージャー: Yarn/npm

**バックエンド（atproto）:**
- TypeScript
- Node.js >=18.7.0
- パッケージマネージャー: pnpm
- Docker（テスト環境用）

---

## 2. テスト戦略の全体像

### 2.1 テストの種類とカバレッジ

Blueskyは、以下の3層のテスト戦略を採用しています：

```
┌─────────────────────────────────────┐
│  E2E Tests (End-to-End)             │  <- Maestro
│  統合テスト（Integration Tests）      │  <- Jest + Docker
│  ユニットテスト（Unit Tests）         │  <- Jest
└─────────────────────────────────────┘
```

### 2.2 テストフレームワーク

| テストタイプ     | フレームワーク       | 代替            | 用途                   | プロジェクト              |
| ---------- | ------------- | ------------- | -------------------- | ------------------- |
| ユニットテスト    | Jest 29.7.0   |               | コンポーネント・関数の単体テスト     | social-app, atproto |
| 統合テスト      | Jest + Docker |               | サービス間連携テスト           | atproto             |
| E2Eテスト     | Maestro       | Detox, Appium | UIフロー全体のテスト          | social-app          |
| パフォーマンステスト | Flashlight    |               | moible app パフォーマンス測定 | social-app          |
<br>

| solution name | features(most powerful ones)                                                       | github links                                                        | stars | pros                           | cons                                       | 5pts | notes                                           |
| :------------ | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------ | :---- | :----------------------------- | :----------------------------------------- | :--- | :---------------------------------------------- |
| **Maestro**   | 宣言的なYAML構文、組み込みの耐障害性（Flake-free）、高速なセットアップ、クロスプラットフォーム（iOS, Android, React Native） | [mobile-dev-inc/maestro](https://github.com/mobile-dev-inc/maestro) | 9.3k  | シンプルで学習が容易、テストが安定しやすい、モバイルに最適  | Webテスト機能は限定的、複雑なロジックには不向き                  | 4/5  | Blueskyで採用。モバイルファーストのE2Eテストに非常に適している。           |
| **Cypress**   | タイムトラベルデバッグ、自動待機、ネットワークスタブ、優れたGUIのテストランナー                                          | [cypress-io/cypress](https://github.com/cypress-io/cypress)         | 49k   | 優れた開発者体験、強力なデバッグ機能、Webテストの業界標準 | **ネイティブモバイルアプリをサポートしない**、Maestroより学習コストが高い | 2/5  | Webアプリのテストには最適だが、Blueskyのようなモバイル中心のプロジェクトには不完全。 |

---

## 3. フロントエンド（social-app）のテスト実装

### 3.1 テストディレクトリ構造

```
social-app/
├── __e2e__/              # E2Eテスト（Maestro）
├── __tests__/            # ユニット・統合テスト
│   └── lib/              # ライブラリテスト
├── __mocks__/            # モックデータ
├── jest/                 # Jest設定
│   └── jestSetup.js      # セットアップファイル
└── tsconfig.e2e.json     # E2E用TypeScript設定
```

### 3.2 package.json テストスクリプト

```json
{
  "scripts": {
    // ユニット・統合テスト
    "test": "NODE_ENV=test jest --forceExit --testTimeout=20000 --bail",
    "test-watch": "NODE_ENV=test jest --watchAll",
    "test-ci": "NODE_ENV=test jest --ci --forceExit --reporters=default --reporters=jest-junit",
    "test-coverage": "NODE_ENV=test jest --coverage",

    // E2Eテスト（Maestro）
    "e2e:mock-server": "...",
    "e2e:build": "...",
    "e2e:start": "...",
    "e2e:run": "maestro test __e2e__",

    // パフォーマンステスト
    "perf:test": "flashlight test",
    "perf:measure": "..."
  }
}
```

### 3.3 Jest設定

```javascript
// jest.config.js の主要設定
{
  "preset": "jest-expo/ios",
  "setupFilesAfterEnv": ["./jest/jestSetup.js"],
  "transform": {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  "modulePathIgnorePatterns": [
    "<rootDir>/__e2e__"  // E2Eテストを除外
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/__mocks__/",
    // プラットフォーム固有コードとサードパーティライブラリを除外
  ]
}
```

### 3.4 テスト関連の依存関係

```json
{
  "devDependencies": {
    // コアフレームワーク
    "jest": "^29.7.0",
    "jest-expo": "~54.0.13",
    "jest-junit": "^16.0.0",
    "babel-jest": "^29.7.0",

    // テストライブラリ
    "@testing-library/react-native": "^13.2.0",
    "@testing-library/jest-native": "^5.4.3",

    // 型定義
    "@types/jest": "29.5.14"
  }
}
```

### 3.5 Maestro による E2E テスト

**Maestroを選んだ理由:**
- YAMLベースのシンプルな記法（Detoxと比較して学習コストが低い）
- React Native、iOS、Androidに対応
- 5分以内に最初のテストを書ける
- フレークが少ない（Flake-free）

**Maestro テストの実行:**
```bash
# E2Eテストの実行
yarn e2e:run

# または直接Maestroを使用
maestro test __e2e__
```

**Maestro YAMLファイルの例:**
```yaml
# __e2e__/login.yaml の例
appId: xyz.blueskyweb.app
---
- launchApp
- tapOn: "Sign In"
- inputText: "user@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Continue"
- assertVisible: "Home Feed"
```

---

## 4. バックエンド（atproto）のテスト実装

### 4.1 モノレポ構造とテスト

AT Protocolはモノレポ構造で、各パッケージが独自のテストスイートを持っています：

```
atproto/
├── packages/
│   ├── pds/              # Personal Data Server
│   │   └── tests/
│   ├── api/              # API Client
│   │   └── tests/
│   ├── crypto/           # 暗号化ライブラリ
│   │   └── tests/
│   └── ...
├── interop-test-files/   # 相互運用性テストファイル
└── Makefile              # テスト実行用
```

### 4.2 テストスクリプト（パッケージ別）

**@atproto/pds (Personal Data Server):**
```json
{
  "scripts": {
    "test": "../dev-infra/with-test-redis-and-db.sh jest",
    "test:sqlite": "jest",
    "test:sqlite-only": "..."
  }
}
```
→ Redis と PostgreSQL/MySQL が必要な統合テスト

**@atproto/api:**
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
→ シンプルなユニットテスト

**@atproto/crypto:**
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
→ 暗号化関数のユニットテスト

### 4.3 Make コマンドによるテスト実行

```bash
# すべてのパッケージのテストを実行（Dockerサービスを自動起動）
make test

# 依存関係のインストール
make deps

# ビルド
make build

# 開発環境の起動（フェイクアカウント・データ付き）
make run-dev-env
```

### 4.4 Docker による統合テスト環境

**開発環境のDocker構成:**
- Personal Data Server (PDS)
- AppView
- Redis
- PostgreSQL/MySQL
- フェイクテストアカウント・データ

**テスト実行の流れ:**
```bash
# 1. Dockerサービスの起動
docker-compose up -d

# 2. テストの実行
make test

# 3. サービスの停止
docker-compose down
```

### 4.5 相互運用性テスト

**interop-test-files/ ディレクトリ:**
- 言語中立のテストファイル
- 他のAT Protocol実装が仕様準拠を検証するために使用
- JSONベースのテストケース

**目的:**
- 異なる実装間での互換性を保証
- プロトコル仕様の正確性を検証
- クロスプラットフォーム対応

---

## 5. CI/CD とテスト自動化

### 5.1 GitHub Actions の活用

**両方のリポジトリで使用:**
- `.github/workflows/` ディレクトリに定義
- `github-actions[bot]` による自動化
- プルリクエストごとにテストを実行

### 5.2 social-app の CI/CD 戦略

**課題:**
週に40件のPRがマージされるが、リリース前にまとめてテストされていた。

**解決策の進化:**

#### フェーズ1: 毎日のTestFlightデプロイ
```
毎晩9PM → TestFlight ビルド
問題: 夜型開発者にとって不便
```

#### フェーズ2: マージごとのビルド（GitHub Actions）
```
PR マージ → GitHub Actions → IPA/APK ビルド（20-30分）
問題: ビルド時間が長い
```

#### フェーズ3: カスタムOTAシステム（現在）
```
PR マージ → フィンガープリント検証 → OTA または フルビルド
利点: 数分でデプロイ、コスト削減
```

### 5.3 カスタムOTA（Over-The-Air）アップデートシステム

**技術実装:**

1. **フィンガープリント検出（@expo/fingerprint）**
   ```bash
   # ネイティブコード変更の検出
   expo-fingerprint compare

   # 変更あり → フルビルド（IPA/APK）
   # 変更なし → OTAデプロイ（JSバンドルのみ）
   ```

2. **デプロイフロー**
   ```
   コミット → フィンガープリント比較
              ↓
        ┌─────┴─────┐
        │             │
   ネイティブ変更   JS変更のみ
        ↓             ↓
   フルビルド      OTAアップデート
   (20-30分)       (数分)
        ↓             ↓
   TestFlight      CDN配信
   ```

3. **アップデート配信**
   - アプリがフォアグラウンドの間、15分ごとにチェック
   - バックグラウンドでアセットをダウンロード
   - 15分以上バックグラウンド後に適用（ユーザー体験を妨げない）

4. **セキュリティ**
   - RSA-v1_5-sha256証明書検証
   - コード署名による改ざん防止

5. **インフラストラクチャ**
   ```
   GitHub → カスタムアップデートサーバー → CDN → モバイルアプリ
   ```

### 5.4 コスト最適化

**EAS（Expo Application Services）との比較:**

| 項目 | EAS | Blueskyカスタムシステム |
|------|-----|----------------------|
| 月額コスト | $$$（スケール時） | $ （GitHub + CDN + サーバー） |
| ビルド時間 | 20-30分 | 数分（OTA時） |
| ホットフィックス | アプリストア審査必要 | 即時デプロイ可能 |
| 内部テスト | TestFlightスロット制限 | 無制限 |

**コスト削減効果:**
- EASを使わずに独自実装
- GitHub Actions の無料枠を活用
- CDNコストのみ（低コスト）
- アプリストア審査なしでホットフィックス可能

---

## 6. テストの実行とベストプラクティス

### 6.1 social-app のテスト実行フロー

**開発時:**
```bash
# 監視モードでテスト（開発中）
yarn test-watch

# 単発実行
yarn test

# カバレッジ付き
yarn test-coverage
```

**CI環境:**
```bash
# CI用（JUnit レポート生成）
yarn test-ci
```

**E2Eテスト:**
```bash
# モックサーバー起動
yarn e2e:mock-server

# アプリビルド
yarn e2e:build

# アプリ起動
yarn e2e:start

# Maestroテスト実行
yarn e2e:run
```

### 6.2 atproto のテスト実行フロー

**開発時:**
```bash
# 依存関係インストール
make deps

# ビルド
make build

# 全テスト実行（Dockerサービス自動起動）
make test

# 開発環境起動（手動テスト用）
make run-dev-env
```

**個別パッケージテスト:**
```bash
cd packages/pds
pnpm test

cd packages/api
pnpm test
```

### 6.3 テストベストプラクティス

#### ユニットテスト
```typescript
// __tests__/lib/example.test.ts
import { someFunction } from '../../src/lib/example'

describe('someFunction', () => {
  it('should return expected value', () => {
    const result = someFunction('input')
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(() => someFunction(null)).toThrow()
  })
})
```

#### 統合テスト（React Native）
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../../src/components/Button'

describe('Button', () => {
  it('should call onPress when tapped', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button onPress={onPress}>Click me</Button>
    )

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

#### E2Eテスト（Maestro）
```yaml
# __e2e__/post-creation.yaml
appId: xyz.blueskyweb.app
---
- launchApp
- tapOn: "New Post"
- inputText: "Hello Bluesky!"
- tapOn: "Post"
- assertVisible: "Hello Bluesky!"
```

---

## 7. パフォーマンステスト

### 7.1 Flashlight による測定

**目的:**
- アプリの起動時間測定
- UIレンダリングパフォーマンス測定
- メモリ使用量監視

**実行コマンド:**
```bash
# パフォーマンステスト
yarn perf:test

# 測定結果の分析
yarn perf:measure
```

### 7.2 測定指標

- **起動時間（App Launch Time）**
- **フレームレート（FPS）**
- **メモリ使用量（Memory Usage）**
- **バッテリー消費（Battery Drain）**

---

## 8. 品質保証の課題と解決策

### 8.1 課題1: 週40件のPRの品質管理

**問題:**
- 多数のPRがマージされるが、個別にテストされない
- リリース前に統合テストが必要

**解決策:**
1. PR単位での自動テスト（GitHub Actions）
2. 内部リリースシステム（カスタムOTA）
3. 毎日の統合テスト（TestFlight + OTA）

### 8.2 課題2: ビルド時間の長さ

**問題:**
- IPA/APKビルドに20-30分かかる
- 開発速度が低下

**解決策:**
- フィンガープリント検出によるOTA/フルビルドの自動判定
- ネイティブコード変更時のみフルビルド
- JS変更のみの場合はOTA（数分）

### 8.3 課題3: コスト管理

**問題:**
- EASの大規模利用は高コスト
- TestFlightのスロット制限

**解決策:**
- カスタムOTAシステムの構築
- GitHub + CDN + 自前サーバーの組み合わせ
- ほぼゼロコストでCI/CD実現

---

## 9. まとめと推奨事項

### 9.1 Blueskyのテスト戦略の特徴

**強み:**
1. **多層的なテスト戦略** - ユニット、統合、E2Eの3層
2. **適切なツール選択** - Jest（標準的）+ Maestro（シンプル）
3. **コスト最適化** - カスタムOTAシステムによる大幅なコスト削減
4. **高速デプロイ** - フィンガープリント検出による最適化
5. **相互運用性** - 言語中立のテストファイルによる仕様準拠保証

**学ぶべきポイント:**
1. **フィンガープリント検出**: `@expo/fingerprint` でネイティブ変更を検出し、不要なフルビルドを回避
2. **カスタムOTA**: Expo Updatesプロトコルを活用した独自実装
3. **Maestro採用**: DetoxよりシンプルなYAMLベースのE2Eテスト
4. **Docker活用**: 統合テスト環境をコンテナ化し、再現性を保証

### 9.2 他プロジェクトへの適用推奨

#### React Nativeプロジェクト向け

**基本構成:**
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-expo": "~54.0.13",
    "@testing-library/react-native": "^13.2.0",
    "@testing-library/jest-native": "^5.4.3"
  },
  "scripts": {
    "test": "jest",
    "test-watch": "jest --watchAll",
    "test-ci": "jest --ci --forceExit",
    "test-coverage": "jest --coverage"
  }
}
```

**E2Eテスト（Maestro）:**
```bash
# インストール
curl -Ls https://get.maestro.mobile.dev | bash

# テストディレクトリ作成
mkdir __e2e__

# テスト実行
maestro test __e2e__
```

**CI/CD（GitHub Actions）:**
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test-ci
```

#### Node.jsバックエンドプロジェクト向け

**Dockerベースの統合テスト:**
```yaml
# docker-compose.test.yml
version: '3'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: testdb
      POSTGRES_PASSWORD: testpass
  redis:
    image: redis:7
  app:
    build: .
    depends_on:
      - postgres
      - redis
    command: npm test
```

**Makefileでテスト実行:**
```makefile
.PHONY: test
test:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit
	docker-compose -f docker-compose.test.yml down
```

### 9.3 段階的導入ロードマップ

#### フェーズ1: 基本テスト環境構築（1-2週間）
- [ ] Jest + Testing Libraryのセットアップ
- [ ] 基本的なユニットテストの作成
- [ ] GitHub Actionsでのテスト自動化

#### フェーズ2: E2Eテスト導入（2-3週間）
- [ ] Maestroのインストールと設定
- [ ] 主要ユーザーフローのE2Eテスト作成
- [ ] CI/CDパイプラインへの統合

#### フェーズ3: カスタムOTAシステム構築（4-6週間）
- [ ] @expo/fingerprintの導入
- [ ] カスタムアップデートサーバーの構築
- [ ] CDN配信設定
- [ ] セキュリティ（コード署名）実装

#### フェーズ4: 最適化と拡張（継続的）
- [ ] テストカバレッジ向上
- [ ] パフォーマンステスト追加
- [ ] ビジュアルリグレッションテスト
- [ ] アクセシビリティテスト

---

## 10. 参考リンク

### 公式ドキュメント
- [Bluesky Social App Repository](https://github.com/bluesky-social/social-app)
- [AT Protocol Repository](https://github.com/bluesky-social/atproto)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

### 技術記事
- [How we do React Native CI/CD at Bluesky - At Nearly Zero Cost](https://hailey.at/posts/3kvl7ydcadk2i)
- [Guide to E2E Testing with Maestro](https://medium.com/@malikchohra/guide-to-testing-in-react-native-end-to-end-test-using-detox-f29fd1344180)
- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)

### ツール
- [Expo Fingerprint](https://docs.expo.dev/guides/fingerprint/)
- [Flashlight Performance Testing](https://github.com/bamlab/flashlight)
- [Testing Library](https://testing-library.com/)

---

**調査完了日**: 2024年11月2日
**調査者**: Claude (Anthropic AI Assistant)
**バージョン**: 1.0
**対象プロジェクト**: Bluesky Social (social-app & atproto)

---

## 付録A: 完全なテストコマンドリファレンス

### social-app テストコマンド

```bash
# ユニット・統合テスト
yarn test                    # 通常のテスト実行
yarn test-watch              # 監視モード
yarn test-ci                 # CI用（JUnitレポート付き）
yarn test-coverage           # カバレッジ測定

# E2Eテスト
yarn e2e:mock-server         # モックサーバー起動
yarn e2e:build               # アプリビルド
yarn e2e:start               # アプリ起動
yarn e2e:run                 # Maestroテスト実行

# パフォーマンステスト
yarn perf:test               # パフォーマンス測定
yarn perf:measure            # 測定結果分析
```

### atproto テストコマンド

```bash
# Make コマンド
make deps                    # 依存関係インストール
make build                   # ビルド
make test                    # 全テスト実行
make run-dev-env             # 開発環境起動

# パッケージ個別テスト
cd packages/pds && pnpm test          # PDSテスト
cd packages/api && pnpm test          # APIテスト
cd packages/crypto && pnpm test       # Cryptoテスト
```

## 付録B: テスト環境のトラブルシューティング

### Jest関連

**問題: テストがタイムアウトする**
```bash
# タイムアウト時間を延長
jest --testTimeout=30000
```

**問題: モジュールが見つからない**
```bash
# node_modules を再インストール
rm -rf node_modules
yarn install
```

### Maestro関連

**問題: Maestroが起動しない**
```bash
# Maestroの再インストール
maestro uninstall
curl -Ls https://get.maestro.mobile.dev | bash
```

**問題: シミュレータが見つからない**
```bash
# iOS シミュレータ起動
open -a Simulator

# Android エミュレータ起動
emulator -avd Pixel_4_API_30
```

### Docker関連

**問題: コンテナが起動しない**
```bash
# コンテナとイメージをクリーンアップ
docker-compose down -v
docker system prune -a
```

**問題: ポートが既に使用されている**
```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

---

## 付録C: サンプルテストコード集

### ユニットテスト例

```typescript
// __tests__/lib/string-utils.test.ts
import { capitalize, truncate } from '../../src/lib/string-utils'

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const long = 'This is a very long string'
      expect(truncate(long, 10)).toBe('This is a...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })
  })
})
```

### コンポーネントテスト例

```typescript
// __tests__/components/PostCard.test.tsx
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { PostCard } from '../../src/components/PostCard'

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    text: 'Hello Bluesky!',
    author: 'user.bsky.social',
    timestamp: '2024-11-02T10:00:00Z'
  }

  it('should render post content', () => {
    const { getByText } = render(<PostCard post={mockPost} />)
    expect(getByText('Hello Bluesky!')).toBeTruthy()
    expect(getByText('user.bsky.social')).toBeTruthy()
  })

  it('should call onLike when like button is pressed', () => {
    const onLike = jest.fn()
    const { getByTestId } = render(
      <PostCard post={mockPost} onLike={onLike} />
    )

    fireEvent.press(getByTestId('like-button'))
    expect(onLike).toHaveBeenCalledWith(mockPost.id)
  })

  it('should show loading state', async () => {
    const { getByTestId } = render(
      <PostCard post={mockPost} loading={true} />
    )

    expect(getByTestId('loading-spinner')).toBeTruthy()
  })
})
```

### 統合テスト例（API）

```typescript
// __tests__/integration/api.test.ts
import { BskyAgent } from '@atproto/api'

describe('Bluesky API Integration', () => {
  let agent: BskyAgent

  beforeAll(async () => {
    agent = new BskyAgent({
      service: 'https://bsky.social'
    })
  })

  it('should fetch user profile', async () => {
    const response = await agent.getProfile({
      actor: 'jay.bsky.social'
    })

    expect(response.data).toBeDefined()
    expect(response.data.handle).toBe('jay.bsky.social')
  })

  it('should handle authentication', async () => {
    await agent.login({
      identifier: 'test.bsky.social',
      password: 'test-password'
    })

    expect(agent.session).toBeDefined()
  })
})
```

### E2Eテスト例（Maestro）

```yaml
# __e2e__/complete-user-flow.yaml
appId: xyz.blueskyweb.app
---
# ログイン
- launchApp
- tapOn: "Sign In"
- inputText: "test.bsky.social"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Continue"
- assertVisible: "Home Feed"

# 投稿作成
- tapOn: "New Post"
- inputText: "This is a test post"
- tapOn: "Post"
- assertVisible: "This is a test post"

# プロフィール表示
- tapOn: "Profile"
- assertVisible: "test.bsky.social"
- assertVisible: "Posts"
- assertVisible: "Followers"

# ログアウト
- tapOn: "Settings"
- tapOn: "Sign Out"
- tapOn: "Confirm"
- assertVisible: "Sign In"
```

---

**本レポートは、Bluesky Socialのオープンソースリポジトリおよび公開されている技術記事を基に作成されました。**
