# Apache Spark - 完全ガイド

## 目次
1. [Apache Sparkとは](#apache-sparkとは)
2. [主要機能](#主要機能)
3. [アーキテクチャ](#アーキテクチャ)
4. [コンポーネント](#コンポーネント)
5. [実装例](#実装例)
6. [ユースケース](#ユースケース)
7. [SparkとHadoopの比較](#sparkとhadoopの比較)

---

## Apache Sparkとは

**Apache Spark**は、大規模データ処理のための統合分析エンジンです。2009年にカリフォルニア大学バークレー校で開発され、2014年にApacheトップレベルプロジェクトになりました。

### 基本概念

```
Apache Spark = 高速 + 汎用的 + 分散処理フレームワーク
```

**定義:**
- **統合分析エンジン**: バッチ処理、ストリーミング、機械学習、グラフ処理を単一のフレームワークで実現
- **分散処理**: 複数のマシンでデータを並列処理
- **インメモリ処理**: データをメモリ上で処理することで高速化（Hadoopの100倍高速）
- **多言語対応**: Scala、Java、Python、R、SQLをサポート

### なぜSparkが重要か

**従来の問題:**
- Hadoopは遅い（ディスクI/Oが多い）
- 異なるタスクに異なるツールが必要（バッチ処理、ストリーミング、機械学習など）
- 複雑なデータパイプラインの構築が困難

**Sparkの解決策:**
- インメモリ処理による高速化
- 単一のAPIで多様なワークロードに対応
- 使いやすいAPIと豊富なライブラリ

---

## 主要機能

### 1. 高速処理 (Speed)

**インメモリコンピューティング:**
```scala
// Hadoop MapReduceの場合：ディスクに頻繁に書き込み
// 各ステップでHDFSに書き込み → 遅い

// Sparkの場合：メモリ上で処理
val data = spark.read.textFile("hdfs://...")
val result = data
  .filter(_.contains("ERROR"))
  .map(_.split(" ")(0))
  .distinct()
  .count()  // すべてメモリ上で実行
```

**性能:**
- **メモリ処理**: Hadoopより100倍高速
- **ディスク処理**: Hadoopより10倍高速
- **遅延評価 (Lazy Evaluation)**: 最適化された実行プランを生成

### 2. 使いやすさ (Ease of Use)

**簡潔なAPI:**
```scala
// Scalaでの例
val textFile = spark.read.textFile("hdfs://...")
val wordCounts = textFile
  .flatMap(line => line.split(" "))
  .groupByKey(identity)
  .count()

// Pythonでも同様に簡単
# Python
text_file = spark.read.text("hdfs://...")
word_counts = text_file \
    .flatMap(lambda line: line.split(" ")) \
    .groupBy(lambda word: word) \
    .count()
```

**対話的シェル (REPL):**
```bash
# Scalaシェル
$ spark-shell

# Pythonシェル
$ pyspark

# SQLシェル
$ spark-sql
```

### 3. 汎用性 (Generality)

**統合されたスタック:**
```
┌─────────────────────────────────────────────┐
│        Applications / User Code             │
├───────────┬──────────┬──────────┬──────────┤
│ Spark SQL │ Streaming│  MLlib   │ GraphX   │
│  (SQL)    │(Realtime)│  (ML)    │ (Graph)  │
├───────────┴──────────┴──────────┴──────────┤
│         Spark Core (RDD API)                │
├─────────────────────────────────────────────┤
│      Cluster Manager (YARN/Mesos/K8s)       │
└─────────────────────────────────────────────┘
```

### 4. どこでも動作 (Runs Everywhere)

**サポートされる環境:**
- **スタンドアロン**: 単一マシンまたはクラスタ
- **Apache Hadoop YARN**: Hadoopクラスタ上で実行
- **Apache Mesos**: データセンタースケールのクラスタ管理
- **Kubernetes**: コンテナオーケストレーション
- **クラウド**: AWS、Azure、Google Cloud

**データソース:**
- HDFS (Hadoop Distributed File System)
- Apache Cassandra
- Apache HBase
- Amazon S3
- MongoDB
- Apache Kafka
- その他多数

---

## アーキテクチャ

### クラスタ構成

```
┌──────────────────────────────────────────────┐
│              Driver Program                   │
│  ┌────────────────────────────────────────┐  │
│  │        SparkContext                    │  │
│  │  - Job scheduling                      │  │
│  │  - Task distribution                   │  │
│  └────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────┘
             │
             │ Cluster Manager
             │ (YARN/Mesos/K8s/Standalone)
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼───┐
│ Worker │      │ Worker │
│  Node  │      │  Node  │
│┌──────┐│      │┌──────┐│
││Exec. ││      ││Exec. ││
││┌────┐││      ││┌────┐││
│││Task│││      │││Task│││
││└────┘││      ││└────┘││
││Cache ││      ││Cache ││
│└──────┘│      │└──────┘│
└────────┘      └────────┘
```

**主要コンポーネント:**

1. **Driver Program**
   - ユーザーのmain()関数を実行
   - SparkContextを作成
   - RDD/DataFrameの変換を定義
   - タスクをExecutorに配布

2. **Cluster Manager**
   - リソース管理
   - ノード間の調整
   - タイプ: Standalone, YARN, Mesos, Kubernetes

3. **Worker Nodes**
   - 実際の計算を実行
   - データをメモリにキャッシュ
   - 結果をDriverに返す

4. **Executors**
   - Worker Node上で動作するプロセス
   - タスクを実行
   - データをメモリまたはディスクに保存

### データ抽象化

**RDD (Resilient Distributed Dataset) - 基本抽象化:**
```scala
// RDDの作成
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5))

// 変換 (Transformation)
val squared = rdd.map(x => x * x)

// アクション (Action)
val sum = squared.reduce(_ + _)
```

**特徴:**
- **不変 (Immutable)**: 一度作成したら変更できない
- **分散 (Distributed)**: 複数ノードに分散
- **耐障害性 (Resilient)**: 障害時に自動復旧
- **遅延評価 (Lazy)**: アクションが呼ばれるまで実行されない

---

## コンポーネント

### 1. Spark Core

**役割:**
- 基本的な I/O機能
- タスクスケジューリング
- メモリ管理
- 障害復旧
- RDD API

**基本操作:**

```scala
// Transformations (遅延評価)
val numbers = sc.parallelize(1 to 100)
val evens = numbers.filter(_ % 2 == 0)      // フィルタ
val doubled = evens.map(_ * 2)               // マップ
val grouped = doubled.groupBy(_ % 10)        // グループ化

// Actions (即座に実行)
val count = doubled.count()                  // カウント
val sum = doubled.reduce(_ + _)              // 削減
val first10 = doubled.take(10)               // 先頭N個取得
val all = doubled.collect()                  // 全データ収集
```

### 2. Spark SQL

**役割:**
- 構造化データの処理
- SQLクエリの実行
- DataFrameとDataset API
- 様々なデータソースとの統合

**DataFrameの例:**
```scala
import org.apache.spark.sql.SparkSession

val spark = SparkSession.builder()
  .appName("Spark SQL Example")
  .getOrCreate()

import spark.implicits._

// DataFrameの作成
val df = spark.read.json("people.json")

// SQLスタイルのクエリ
df.createOrReplaceTempView("people")
val results = spark.sql("SELECT name, age FROM people WHERE age > 21")

// DataFrame API
val filtered = df
  .filter($"age" > 21)
  .select($"name", $"age")
  .orderBy($"age".desc)
  
filtered.show()

// 結果:
// +-------+---+
// |   name|age|
// +-------+---+
// |Michael| 29|
// |   Andy| 30|
// +-------+---+
```

**高度な機能:**
```scala
// ウィンドウ関数
import org.apache.spark.sql.expressions.Window

val windowSpec = Window
  .partitionBy("department")
  .orderBy($"salary".desc)

val rankedDF = df.withColumn(
  "rank",
  rank().over(windowSpec)
)

// 集約
val summary = df.groupBy("department")
  .agg(
    avg("salary").as("avg_salary"),
    max("salary").as("max_salary"),
    count("*").as("employee_count")
  )

// JOIN操作
val employees = spark.read.parquet("employees.parquet")
val departments = spark.read.parquet("departments.parquet")

val joined = employees.join(
  departments,
  employees("dept_id") === departments("id"),
  "inner"
)
```

### 3. Spark Streaming

**役割:**
- リアルタイムデータ処理
- マイクロバッチ処理
- 様々なストリーミングソースからのデータ取り込み

**構造化ストリーミング (Structured Streaming):**
```scala
// Kafkaからのストリーミング
val kafkaDF = spark
  .readStream
  .format("kafka")
  .option("kafka.bootstrap.servers", "localhost:9092")
  .option("subscribe", "topic1")
  .load()

// ストリーミングデータの処理
val processedDF = kafkaDF
  .selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")
  .as[(String, String)]
  .groupBy($"value")
  .count()

// シンクへの書き込み
val query = processedDF
  .writeStream
  .outputMode("complete")
  .format("console")
  .start()

query.awaitTermination()
```

**ウィンドウ処理:**
```scala
import org.apache.spark.sql.functions._

// タイムウィンドウによる集約
val windowedCounts = kafkaDF
  .withColumn("timestamp", $"timestamp".cast("timestamp"))
  .withWatermark("timestamp", "10 minutes")
  .groupBy(
    window($"timestamp", "5 minutes", "1 minute"),
    $"event_type"
  )
  .count()
```

### 4. MLlib (Machine Learning)

**役割:**
- 機械学習アルゴリズム
- 特徴量エンジニアリング
- パイプライン構築
- モデルの評価と調整

**分類の例:**
```scala
import org.apache.spark.ml.classification.LogisticRegression
import org.apache.spark.ml.feature.{VectorAssembler, StringIndexer}
import org.apache.spark.ml.Pipeline

// データ準備
val data = spark.read
  .option("header", "true")
  .option("inferSchema", "true")
  .csv("training_data.csv")

// 特徴量エンジニアリング
val assembler = new VectorAssembler()
  .setInputCols(Array("age", "income", "hours_per_week"))
  .setOutputCol("features")

val indexer = new StringIndexer()
  .setInputCol("label_string")
  .setOutputCol("label")

// モデル
val lr = new LogisticRegression()
  .setMaxIter(10)
  .setRegParam(0.01)

// パイプライン
val pipeline = new Pipeline()
  .setStages(Array(indexer, assembler, lr))

// トレーニング
val model = pipeline.fit(data)

// 予測
val predictions = model.transform(testData)

// 評価
import org.apache.spark.ml.evaluation.BinaryClassificationEvaluator

val evaluator = new BinaryClassificationEvaluator()
  .setLabelCol("label")
  .setMetricName("areaUnderROC")

val auc = evaluator.evaluate(predictions)
println(s"AUC: $auc")
```

**利用可能なアルゴリズム:**
- **分類**: ロジスティック回帰、決定木、ランダムフォレスト、GBT、ナイーブベイズ、SVM
- **回帰**: 線形回帰、決定木回帰、ランダムフォレスト回帰、GBT回帰
- **クラスタリング**: K-means、LDA、ガウス混合モデル
- **協調フィルタリング**: ALS (Alternating Least Squares)
- **次元削減**: PCA、SVD

### 5. GraphX

**役割:**
- グラフ処理と分析
- ソーシャルネットワーク分析
- ページランクなどのグラフアルゴリズム

**グラフの作成と分析:**
```scala
import org.apache.spark.graphx._
import org.apache.spark.rdd.RDD

// 頂点の定義
val users: RDD[(VertexId, (String, String))] = sc.parallelize(Array(
  (1L, ("Alice", "Student")),
  (2L, ("Bob", "Professor")),
  (3L, ("Charlie", "Student"))
))

// エッジの定義
val relationships: RDD[Edge[String]] = sc.parallelize(Array(
  Edge(1L, 2L, "follows"),
  Edge(2L, 3L, "follows"),
  Edge(3L, 1L, "follows")
))

// グラフの作成
val graph = Graph(users, relationships)

// PageRankの計算
val ranks = graph.pageRank(0.0001).vertices

// 結果の取得
val ranksByUser = users.join(ranks).map {
  case (id, ((name, occupation), rank)) => (name, rank)
}

ranksByUser.collect().foreach(println)
```

---

## 実装例

### 例1: ログ分析

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

object LogAnalysis {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Log Analysis")
      .getOrCreate()
    
    import spark.implicits._
    
    // ログファイルの読み込み
    val logs = spark.read.text("access.log")
    
    // エラーログの抽出
    val errors = logs
      .filter($"value".contains("ERROR"))
      .withColumn("timestamp", regexp_extract($"value", """\[(.*?)\]""", 1))
      .withColumn("message", regexp_extract($"value", """ERROR (.*)""", 1))
    
    // エラーの集計
    val errorCounts = errors
      .groupBy($"message")
      .count()
      .orderBy($"count".desc)
    
    // 結果の表示
    errorCounts.show(20)
    
    // 時間帯別エラー数
    val hourlyErrors = errors
      .withColumn("hour", hour(to_timestamp($"timestamp", "dd/MMM/yyyy:HH:mm:ss")))
      .groupBy($"hour")
      .count()
      .orderBy($"hour")
    
    hourlyErrors.show()
    
    spark.stop()
  }
}
```

### 例2: リアルタイム推薦システム

```scala
import org.apache.spark.ml.recommendation.ALS
import org.apache.spark.sql.SparkSession

object RecommendationEngine {
  
  case class Rating(userId: Int, movieId: Int, rating: Float, timestamp: Long)
  
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Movie Recommendation")
      .getOrCreate()
    
    import spark.implicits._
    
    // データ読み込み
    val ratings = spark.read
      .option("header", "true")
      .csv("ratings.csv")
      .as[Rating]
    
    // トレーニング・テストデータ分割
    val Array(training, test) = ratings.randomSplit(Array(0.8, 0.2))
    
    // ALSモデルの構築
    val als = new ALS()
      .setMaxIter(10)
      .setRegParam(0.01)
      .setUserCol("userId")
      .setItemCol("movieId")
      .setRatingCol("rating")
      .setColdStartStrategy("drop")
    
    val model = als.fit(training)
    
    // 予測
    val predictions = model.transform(test)
    
    // 各ユーザーにトップ10の映画を推薦
    val userRecs = model.recommendForAllUsers(10)
    
    // 特定ユーザーへの推薦
    val userId = 123
    val userRecommendations = userRecs
      .filter($"userId" === userId)
      .select("recommendations")
      .collect()
    
    println(s"Recommendations for user $userId:")
    userRecommendations.foreach(println)
    
    spark.stop()
  }
}
```

### 例3: リアルタイム不正検知

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.ml.classification.RandomForestClassifier

object FraudDetection {
  
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Fraud Detection")
      .getOrCreate()
    
    import spark.implicits._
    
    // ストリーミングデータの読み込み
    val transactionStream = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9092")
      .option("subscribe", "transactions")
      .load()
    
    // JSONのパース
    val transactions = transactionStream
      .selectExpr("CAST(value AS STRING) as json")
      .select(from_json($"json", transactionSchema).as("data"))
      .select("data.*")
    
    // 特徴量エンジニアリング
    val features = transactions
      .withColumn("hour", hour($"timestamp"))
      .withColumn("day_of_week", dayofweek($"timestamp"))
      .withColumn("amount_zscore", 
        ($"amount" - avg($"amount").over(userWindow)) / 
        stddev($"amount").over(userWindow)
      )
    
    // 不正スコアの計算
    val assembler = new VectorAssembler()
      .setInputCols(Array("amount", "hour", "day_of_week", "amount_zscore"))
      .setOutputCol("features")
    
    val featuresDF = assembler.transform(features)
    
    // モデルによる予測（事前に学習済みモデルを読み込み）
    val model = RandomForestClassifier.load("models/fraud_detector")
    val predictions = model.transform(featuresDF)
    
    // 不正の疑いがある取引を出力
    val fraudAlerts = predictions
      .filter($"prediction" === 1.0)
      .select($"transaction_id", $"user_id", $"amount", $"probability")
    
    // アラートの送信
    val query = fraudAlerts
      .writeStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9092")
      .option("topic", "fraud-alerts")
      .outputMode("append")
      .start()
    
    query.awaitTermination()
  }
}
```

---

## ユースケース

### 1. データ分析・BI

**企業例: Netflix**
- 視聴履歴の分析（1日あたり数十億イベント）
- コンテンツ推薦
- A/Bテストの分析
- 視聴パターンの発見

**技術:**
```scala
// 視聴パターン分析
val viewingData = spark.read.parquet("s3://netflix-data/viewing")

val popularShows = viewingData
  .groupBy($"show_id", $"show_name")
  .agg(
    countDistinct("user_id").as("unique_viewers"),
    sum("watch_duration").as("total_watch_time"),
    avg("completion_rate").as("avg_completion")
  )
  .filter($"unique_viewers" > 1000000)
  .orderBy($"total_watch_time".desc)
```

### 2. リアルタイム処理

**企業例: Uber**
- リアルタイム価格設定（Surge Pricing）
- ドライバーと乗客のマッチング
- 需要予測
- ルート最適化

**技術:**
```scala
// リアルタイム需要予測
val rideRequests = spark
  .readStream
  .format("kafka")
  .option("kafka.bootstrap.servers", "kafka:9092")
  .option("subscribe", "ride-requests")
  .load()

val demandByArea = rideRequests
  .withWatermark("timestamp", "5 minutes")
  .groupBy(
    window($"timestamp", "5 minutes"),
    $"pickup_area"
  )
  .agg(
    count("*").as("request_count"),
    countDistinct("user_id").as("unique_users")
  )

// Surge Pricingの計算
val surgePricing = demandByArea
  .withColumn("surge_multiplier",
    when($"request_count" > 100, 2.0)
    .when($"request_count" > 50, 1.5)
    .otherwise(1.0)
  )
```

### 3. 機械学習

**企業例: Airbnb**
- 価格推薦
- 検索ランキング
- 不正検知
- 画像分類（物件写真）

**技術:**
```scala
// 価格推薦モデル
val listings = spark.read.parquet("listings.parquet")

val features = new VectorAssembler()
  .setInputCols(Array(
    "bedrooms", "bathrooms", "location_score",
    "amenities_count", "host_rating", "seasonality"
  ))
  .setOutputCol("features")

val rf = new RandomForestRegressor()
  .setLabelCol("optimal_price")
  .setFeaturesCol("features")

val pipeline = new Pipeline().setStages(Array(features, rf))
val model = pipeline.fit(listings)
```

### 4. ETLパイプライン

**企業例: Pinterest**
- ユーザーイベントの集約
- データウェアハウスへの取り込み
- データクレンジング
- データ変換

**技術:**
```scala
// 大規模ETLパイプライン
object PinterestETL {
  def processUserEvents(date: String): Unit = {
    // Extract
    val rawEvents = spark.read.json(s"s3://events/$date/")
    
    // Transform
    val cleanedEvents = rawEvents
      .na.drop()
      .filter($"event_type".isin("pin", "repin", "click"))
      .withColumn("event_hour", hour($"timestamp"))
      .withColumn("user_segment", getUserSegment($"user_id"))
      .join(userMetadata, "user_id")
      .join(pinMetadata, "pin_id")
    
    // Aggregate
    val hourlyMetrics = cleanedEvents
      .groupBy($"event_hour", $"event_type", $"user_segment")
      .agg(
        count("*").as("event_count"),
        countDistinct("user_id").as("unique_users"),
        countDistinct("pin_id").as("unique_pins")
      )
    
    // Load
    hourlyMetrics.write
      .mode("overwrite")
      .partitionBy("event_hour")
      .parquet(s"s3://processed-data/$date/")
  }
}
```

### 5. グラフ処理

**企業例: LinkedIn**
- ソーシャルグラフ分析
- 接続推薦（People You May Know）
- インフルエンサー検出
- コミュニティ検出

**技術:**
```scala
import org.apache.spark.graphx._

// LinkedInネットワーク分析
val connections: RDD[Edge[String]] = loadConnections()
val users: RDD[(VertexId, UserProfile)] = loadUsers()

val graph = Graph(users, connections)

// PageRankでインフルエンサーを検出
val influencers = graph.pageRank(0.001).vertices
  .join(users)
  .sortBy(_._2._1, ascending = false)
  .take(100)

// コミュニティ検出
val communities = graph.connectedComponents().vertices
  .join(users)
  .map { case (id, (component, profile)) => 
    (component, profile)
  }
  .groupByKey()
```

---

## SparkとHadoopの比較

### アーキテクチャの違い

| 特徴 | Hadoop MapReduce | Apache Spark |
|------|------------------|--------------|
| **処理モデル** | バッチ処理のみ | バッチ、ストリーミング、機械学習、グラフ |
| **データ保存** | ディスク（HDFS） | メモリ + ディスク |
| **速度** | 遅い | 100倍速い（メモリ）、10倍速い（ディスク） |
| **使いやすさ** | Javaコードが冗長 | 簡潔なAPI（Scala、Python、R、SQL） |
| **リアルタイム** | 不可 | 可能（Spark Streaming） |
| **機械学習** | Mahout（限定的） | MLlib（豊富） |
| **グラフ処理** | 不可 | GraphX |
| **反復処理** | 非効率（毎回ディスクI/O） | 効率的（メモリキャッシュ） |

### パフォーマンス比較

```scala
// Hadoop MapReduce（疑似コード）
// ステップ1: Map → Reduce → HDFSに書き込み
// ステップ2: HDFSから読み込み → Map → Reduce → HDFSに書き込み
// ステップ3: HDFSから読み込み → Map → Reduce → 結果

// Apache Spark
val result = spark.read.textFile("input")
  .flatMap(_.split(" "))        // メモリ上
  .map(word => (word, 1))       // メモリ上
  .reduceByKey(_ + _)           // メモリ上
  .sortBy(-_._2)                // メモリ上
  .take(10)                     // 結果のみ収集
```

### コード比較例：ワードカウント

**Hadoop MapReduce (Java):**
```java
// Mapperクラス（約20-30行）
public class WordCountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();
    
    public void map(LongWritable key, Text value, Context context) 
            throws IOException, InterruptedException {
        String line = value.toString();
        StringTokenizer tokenizer = new StringTokenizer(line);
        while (tokenizer.hasMoreTokens()) {
            word.set(tokenizer.nextToken());
            context.write(word, one);
        }
    }
}

// Reducerクラス（約15-20行）
public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    public void reduce(Text key, Iterable<IntWritable> values, Context context) 
            throws IOException, InterruptedException {
        int sum = 0;
        for (IntWritable val : values) {
            sum += val.get();
        }
        context.write(key, new IntWritable(sum));
    }
}

// Driverクラス（約30-40行）
// ... 設定とジョブの実行
```

**Spark (Scala):**
```scala
// たった3行！
val textFile = spark.read.textFile("hdfs://...")
val counts = textFile.flatMap(line => line.split(" "))
                    .groupBy(identity).count()
counts.show()
```

**Spark (Python):**
```python
# たった3行！
text_file = spark.read.text("hdfs://...")
counts = text_file.flatMap(lambda line: line.split(" ")) \
                  .groupBy(lambda word: word).count()
counts.show()
```

### いつHadoopを使うべきか？

**Hadoop MapReduceが適している場合:**
- 非常に大きなデータセット（ペタバイト級）でメモリに収まらない
- 単純なバッチ処理のみが必要
- 既存のHadoopインフラが確立している
- コスト最適化が最優先（メモリより安いディスク使用）

**Sparkが適している場合:**
- 反復アルゴリズム（機械学習、グラフ処理）
- リアルタイムまたは準リアルタイム処理
- 対話的なデータ分析
- 複雑なETLパイプライン
- 高速なデータ処理が必要

---

## パフォーマンスチューニング

### メモリ管理

```scala
// メモリ効率の良いコード
val df = spark.read.parquet("large_dataset.parquet")
  .select("id", "name", "value")  // 必要なカラムのみ選択
  .filter($"value" > 100)          // 早めにフィルタリング
  .repartition(200)                // パーティション数を調整

// キャッシング戦略
df.cache()  // または persist(StorageLevel.MEMORY_AND_DISK)

// 不要になったらキャッシュをクリア
df.unpersist()
```

### パーティショニング

```scala
// 適切なパーティション数
val df = spark.read.parquet("data.parquet")
  .repartition(200)  // コア数の2-3倍が目安

// カラムによるパーティショニング
df.write
  .partitionBy("year", "month", "day")
  .parquet("output")

// カスタムパーティショナー
val rdd = df.rdd.partitionBy(new HashPartitioner(100))
```

### ブロードキャスト変数

```scala
// 小さなデータセットをブロードキャスト
val smallTable = spark.read.parquet("small_table.parquet")
val broadcastedTable = broadcast(smallTable)

val result = largTable.join(broadcastedTable, "key")
```

---

## ベストプラクティス

### 1. データフォーマットの選択

```scala
// Parquetを使用（カラムナーフォーマット）
df.write.parquet("output.parquet")  // 推奨

// JSONやCSVは避ける（可能な限り）
df.write.json("output.json")        // 遅い
df.write.csv("output.csv")          // 遅い
```

### 2. 適切なAPIの選択

```scala
// DataFrame/Dataset API を使用（最適化されている）
val df = spark.read.parquet("data.parquet")
  .filter($"age" > 21)
  .select("name", "age")

// RDD APIは避ける（必要な場合を除く）
val rdd = sc.textFile("data.txt")  // 最適化が限定的
```

### 3. データスキュー対策

```scala
// スキューを検出
df.groupBy("key").count().orderBy($"count".desc).show()

// Salt技法でスキューを解消
val saltedDF = df.withColumn("salt", (rand() * 10).cast("int"))
  .withColumn("salted_key", concat($"key", lit("_"), $"salt"))
```

---

## 学習リソース

### 公式ドキュメント
1. **Apache Spark公式サイト**: https://spark.apache.org/
2. **Spark Documentation**: https://spark.apache.org/docs/latest/
3. **Spark SQL Guide**: https://spark.apache.org/docs/latest/sql-programming-guide.html
4. **Spark Streaming**: https://spark.apache.org/docs/latest/streaming-programming-guide.html
5. **MLlib Guide**: https://spark.apache.org/docs/latest/ml-guide.html

### チュートリアル・コース
6. **Databricks Academy**: https://academy.databricks.com/
7. **Coursera - Big Data with Spark**: https://www.coursera.org/specializations/big-data
8. **edX - Spark Fundamentals**: https://www.edx.org/learn/apache-spark
9. **Spark by Examples**: https://sparkbyexamples.com/

### 書籍
10. **Learning Spark (O'Reilly)**: https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/
11. **Spark: The Definitive Guide**: https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/
12. **High Performance Spark**: https://www.oreilly.com/library/view/high-performance-spark/9781491943199/

### コミュニティ
13. **Stack Overflow - Apache Spark**: https://stackoverflow.com/questions/tagged/apache-spark
14. **Spark User Mailing List**: https://spark.apache.org/community.html
15. **Reddit r/apachespark**: https://www.reddit.com/r/apachespark/

### ベンチマーク・事例
16. **Databricks Blog**: https://databricks.com/blog
17. **Netflix Tech Blog**: https://netflixtechblog.com/
18. **Uber Engineering**: https://eng.uber.com/
19. **Airbnb Engineering**: https://medium.com/airbnb-engineering

### ツール・プラットフォーム
20. **Databricks**: https://databricks.com/
21. **AWS EMR**: https://aws.amazon.com/emr/
22. **Google Dataproc**: https://cloud.google.com/dataproc
23. **Azure HDInsight**: https://azure.microsoft.com/services/hdinsight/

---

## まとめ

**Apache Sparkの主要な特徴:**

1. **速度**: インメモリ処理により、Hadoopより最大100倍高速
2. **汎用性**: バッチ、ストリーミング、機械学習、グラフ処理を統一APIで提供
3. **使いやすさ**: 簡潔なAPI、複数言語サポート、対話的シェル
4. **スケーラビリティ**: 単一マシンから数千ノードのクラスタまで対応
5. **エコシステム**: 豊富なライブラリとツールの統合

**Sparkが革新的な理由:**

- **統一されたプラットフォーム**: 1つのツールで多様なデータ処理タスクに対応
- **開発者フレンドリー**: 少ないコードで複雑な処理を実現
- **本番環境での実績**: Netflix、Uber、Airbnb、LinkedInなど大手企業が採用
- **アクティブなコミュニティ**: 継続的な開発と改善

Sparkは現代のビッグデータ処理における事実上の標準となっており、データエンジニア、データサイエンティスト、機械学習エンジニアにとって必須のスキルです。
