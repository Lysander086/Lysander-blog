SEO: #career

---
## 📄 要約：システム設計面接のためのデータベース選択ガイド

🔗 出典：[Choosing the Right Database: A Guide for System Design Interviews - Medium](https://medium.com/@agustin.ignacio.rossi/choosing-the-right-database-a-guide-for-system-design-interviews-8d176b022011)

### 概要
システム設計において、適切なデータベースの選択は非常に重要。**読み取り重視（Read-Heavy）**か**書き込み重視（Write-Heavy）**かによって選ぶべきDBが変わる。

---

### 読み取り重視（Read-Heavy）システム
- **用途例**：ブログ、動画配信、検索エンジン、ダッシュボード
- **推奨DB**：
  - SQLデータベース（MySQL, PostgreSQL）：インデックスで高速化
  - キーバリューストア（Redis, Memcached）：インメモリで超高速アクセス
  - 検索DB（Elasticsearch）：全文検索に最適
- **スケール戦略**：リードレプリカを追加して負荷分散

### 書き込み重視（Write-Heavy）システム
- **用途例**：イベントログ、IoT、リアルタイム監視
- **推奨DB**：
  - NoSQL（MongoDB, Cassandra）：水平スケールに対応
  - 時系列DB（InfluxDB, TimescaleDB）：タイムスタンプデータに最適
  - カラム型DB（HBase, Bigtable）：分析ワークロード向け
  - キューシステム（Kafka, RabbitMQ）：スループット管理に有効

---

### 重要なトレードオフ

| 観点 | Read-Heavy | Write-Heavy |
|------|-----------|-------------|
| 整合性 | 強整合性が重要（金融・分析） | 結果整合性でOK（ログ・監視） |
| レイテンシ対策 | キャッシュ層（Redis等）活用 | バッチ書き込み・非同期書き込み |
| スケール | リードレプリカ、シャーディング | Cassandra・DynamoDB等の分散DB |

---

### アクションポイント
- [ ] CAP定理を理解した上でDBを選択する
- [ ] 面接では「なぜそのDBを選んだか」を理由付きで説明できるようにする

---

- PAC theorem
