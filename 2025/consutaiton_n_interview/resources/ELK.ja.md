# ELKスタック概要

## ELKスタックとは?

ELKスタックは、Elastic社が開発・保守する3つのオープンソース製品(Elasticsearch、Logstash、Kibana)の集合体です。集中ログ管理、ログ解析、データ可視化に使用されます。

## アーキテクチャ図

[ELKスタックアーキテクチャ図を表示](./ELK-architecture.drawio)

## 各コンポーネントの役割

### 1. Elasticsearch
**役割**: データストレージ & 検索エンジン

- **目的**: 分散型RESTful検索・分析エンジン
- **主要機能**:
  - ログデータをJSON形式で保存
  - ほぼリアルタイムの検索機能を提供
  - 複数ノードで水平スケーリング
  - 高速検索のためのデータインデックス化
- **技術**: Apache Lucene上に構築
- **データ構造**: ドキュメント指向型(NoSQL)

### 2. Logstash
**役割**: データ収集 & 処理パイプライン

- **目的**: サーバーサイドのデータ処理パイプライン
- **主要機能**:
  - 複数のソースから同時にデータを**取り込み**
  - ログデータの**変換**と解析
  - データの**フィルタリング**と拡張
  - Elasticsearchや他の宛先へデータを**出力**
- **プラグインアーキテクチャ**:
  - Inputプラグイン: file, syslog, beats, http, kafka等
  - Filterプラグイン: grok, mutate, drop, date等
  - Outputプラグイン: elasticsearch, file, graphite, statsd等

### 3. Kibana
**役割**: データ可視化 & ユーザーインターフェース

- **目的**: ElasticsearchのWebベースUI
- **主要機能**:
  - 可視化(チャート、グラフ、マップ)の作成
  - 監視用ダッシュボードの構築
  - ログデータの検索とフィルタリング
  - アラート機能の提供
  - Elasticsearchクラスタの管理
- **可視化タイプ**: 折れ線グラフ、棒グラフ、円グラフ、ヒートマップ、時系列等

## 現代のELKスタック拡張機能

### Beats
**役割**: 軽量データシッパー

LogstashまたはElasticsearchにデータを送信する軽量エージェント:
- **Filebeat**: ログファイル
- **Metricbeat**: システムとサービスのメトリクス
- **Packetbeat**: ネットワークデータ
- **Winlogbeat**: Windowsイベントログ
- **Auditbeat**: 監査データ
- **Heartbeat**: 稼働時間監視

### Elastic Agent
**役割**: 統合エージェント

すべてのBeatsの機能を統合した単一エージェントで、デプロイと管理を簡素化します。

## データフロー

```
データソース(アプリ、サーバー、ログ)
    ↓
Beats / Logstash(収集 & 処理)
    ↓
Elasticsearch(インデックス化 & 保存)
    ↓
Kibana(可視化 & 分析)
```

## 主な使用例

1. **集中ログ管理**: 複数のサーバー/アプリケーションからログを集約
2. **アプリケーションパフォーマンス監視(APM)**: アプリケーションパフォーマンスの追跡
3. **セキュリティ分析**: セキュリティ脅威と異常の検出
4. **インフラストラクチャ監視**: サーバーメトリクスと健全性の監視
5. **ビジネス分析**: ビジネスメトリクスとKPIの分析
6. **コンプライアンス & 監査**: システムアクセスの追跡と監査

## 主要機能

- **スケーラビリティ**: 複数ノードでの水平スケーリング
- **リアルタイム**: ほぼリアルタイムのデータインデックス化と検索
- **柔軟性**: 構造化・非構造化データに対応
- **オープンソース**: コミュニティ主導、商用サポート利用可能
- **エコシステム**: 大規模なプラグインエコシステムと統合

## 参考リンク

### 公式ドキュメント
- [Elastic公式ウェブサイト](https://www.elastic.co/)
- [Elasticsearchドキュメント](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/index.html)
- [Kibanaドキュメント](https://www.elastic.co/guide/en/kibana/current/index.html)
- [Beatsドキュメント](https://www.elastic.co/guide/en/beats/libbeat/current/index.html)

### チュートリアル & ガイド
- [ELKスタック入門](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html)
- [ELKスタックチュートリアル - Guru99](https://www.guru99.com/elk-stack-tutorial.html)
- [DigitalOcean - Elasticsearch、Logstash、Kibanaのインストール方法](https://www.digitalocean.com/community/tutorials/how-to-install-elasticsearch-logstash-and-kibana-elastic-stack-on-ubuntu-20-04)

### アーキテクチャ & ベストプラクティス
- [Elastic Stackアーキテクチャ](https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html)
- [本番環境デプロイのベストプラクティス](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html)
- [Elasticブログ](https://www.elastic.co/blog)

### コミュニティリソース
- [Elasticコミュニティフォーラム](https://discuss.elastic.co/)
- [GitHub - Elastic](https://github.com/elastic)
- [Stack Overflow - ELKスタック質問](https://stackoverflow.com/questions/tagged/elk)

## パフォーマンス考慮事項

- **インデックス戦略**: 管理を容易にする時系列インデックス
- **シャード割り当て**: 最適なパフォーマンスのための適切なシャードサイズ
- **ハードウェア要件**: ストレージにSSD、Elasticsearchに十分なRAM
- **クラスタ設定**: 高可用性のためのマルチノード設定
- **保持ポリシー**: インデックスライフサイクル管理(ILM)の実装

## セキュリティ機能

- **認証**: 組み込みユーザー認証
- **認可**: ロールベースアクセス制御(RBAC)
- **暗号化**: 転送中データのTLS/SSL
- **監査ログ**: ユーザーアクティビティの追跡
- **IPフィルタリング**: IPアドレスによるアクセス制限

## 実務での活用ポイント

### SRE/DevOpsエンジニアとしての経験アピール

1. **ログ集約基盤の構築**
   - 複数のマイクロサービスからのログ収集
   - Filebeat/Metricbeatの設定と運用
   - Logstashでのログパース・フィルタリングルール作成

2. **監視ダッシュボードの作成**
   - Kibanaでのカスタムダッシュボード構築
   - メトリクス可視化とアラート設定
   - チーム向けの運用ドキュメント作成

3. **パフォーマンスチューニング**
   - インデックス設計とシャード最適化
   - クエリパフォーマンスの改善
   - リソース使用量の監視と調整

4. **トラブルシューティング**
   - ログ分析による障害原因の特定
   - クラスタ健全性の監視
   - データ保持ポリシーの運用

### 面接での回答例

**「ELKスタックの経験はありますか?」**

「はい、前職では○○プロジェクトで ELK/EFK スタックを使用した監視基盤の構築・運用経験があります。具体的には:

1. **Filebeat/Metricbeat**を使用して、複数のサーバーとアプリケーションからログとメトリクスを収集
2. **Logstash**でログのパースとフィルタリングを行い、構造化データとしてElasticsearchに保存
3. **Kibana**でダッシュボードを作成し、リアルタイムでシステムの健全性を監視
4. アラート設定により、異常を早期に検知し、インシデント対応時間を○○%削減

この経験を通じて、SREとしてのシステム可視化とプロアクティブな監視の重要性を学びました。」

---

*最終更新: 2025年11月*
