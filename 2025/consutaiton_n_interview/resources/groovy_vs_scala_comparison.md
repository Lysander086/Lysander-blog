# Groovy vs Scala 比較表

## 基本情報

| 項目 | Groovy | Scala |
|------|--------|-------|
| **初版リリース** | 2003年 | 2004年 |
| **パラダイム** | オブジェクト指向、関数型、動的型付け | オブジェクト指向、関数型、静的型付け |
| **型システム** | 動的型付け（オプションで静的型付け可） | 静的型付け（型推論あり） |
| **実行環境** | JVM | JVM、JavaScript、Native（Scala.js、Scala Native） |
| **構文の特徴** | Javaとの高い互換性、簡潔 | 関数型プログラミング重視、表現力豊か |

## 言語特性

| 項目 | Groovy | Scala |
|------|--------|-------|
| **学習曲線** | 緩やか（Java開発者にとって容易） | 急峻（関数型プログラミングの概念が必要） |
| **コンパイル速度** | 比較的速い | 遅い（特に大規模プロジェクト） |
| **実行速度** | Javaより遅い（動的型付けのオーバーヘッド） | Javaと同等かそれ以上 |
| **型安全性** | 低い（デフォルトで動的型付け） | 高い（強力な型システム） |
| **null安全性** | 限定的（null安全演算子あり） | Option型による安全な扱い |
| **パターンマッチング** | 限定的 | 強力（ケースクラス、sealed trait） |
| **不変性** | サポートあり（推奨はされない） | 推奨され、容易に実装可能 |
| **並行処理** | 標準的なJava機能 | Akka、Future、Parallel Collectionsなど豊富 |

## 開発体験

| 項目             | Groovy                | Scala                         |
| -------------- | --------------------- | ----------------------------- |
| **ビルドツール**     | Gradle、Maven          | sbt、Maven、Gradle              |
| **IDEサポート**    | IntelliJ IDEA、Eclipse | IntelliJ IDEA、Eclipse、VS Code |
| **REPL**       | groovysh              | scala（高機能）                    |
| **テストフレームワーク** | Spock、JUnit           | ScalaTest、Specs2、JUnit        |
| **ボイラープレート**   | 非常に少ない                | 少ない（ケースクラスなど）                 |
| **DSL作成**      | 非常に容易                 | 容易（演算子オーバーロードなど）              |

## エコシステム

| 項目              | Groovy                  | Scala                                                                                                                                                                                                                                                                                         |
| --------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **主な用途**        | スクリプティング、ビルド自動化、テスト     | バックエンド開発、データ処理、分散システム<br><br>[detail](obsidian://open?vault=all-wiki&file=Lysander-blog%2F2025%2Fconsutaiton_n_interview%2Fresources%2Fscala_use_cases_detailed)<br>obsidian://open?vault=all-wiki&file=Lysander-blog%2F2025%2Fconsutaiton_n_interview%2Fresources%2Fscala_use_cases_detailed |
| **人気フレームワーク**   | Grails、Spock、Geb        | Play Framework、Akka、Spark                                                                                                                                                                                                                                                                     |
| **コミュニティサイズ**   | 中規模                     | 大規模                                                                                                                                                                                                                                                                                           |
| **企業採用**        | Netflix、LinkedIn、Oracle | Twitter、LinkedIn、Apple、Netflix                                                                                                                                                                                                                                                                |
| **求人市場**        | 中程度                     | 高い                                                                                                                                                                                                                                                                                            |
| **パッケージマネージャー** | Grape、Maven Central     | Maven Central、Coursier                                                                                                                                                                                                                                                                        |

## コード例

### Hello World

**Groovy:**
```groovy
println "Hello, World!"
```

**Scala:**
```scala
println("Hello, World!")
// または
object HelloWorld extends App {
  println("Hello, World!")
}
```

### クラス定義

**Groovy:**
```groovy
class Person {
    String name
    int age
    
    def greet() {
        println "Hello, I'm $name"
    }
}

def person = new Person(name: "John", age: 30)
person.greet()
```

**Scala:**
```scala
case class Person(name: String, age: Int) {
  def greet(): Unit = {
    println(s"Hello, I'm $name")
  }
}

val person = Person("John", 30)
person.greet()
```

### リスト操作

**Groovy:**
```groovy
def numbers = [1, 2, 3, 4, 5]
def doubled = numbers.collect { it * 2 }
def evens = numbers.findAll { it % 2 == 0 }
```

**Scala:**
```scala
val numbers = List(1, 2, 3, 4, 5)
val doubled = numbers.map(_ * 2)
val evens = numbers.filter(_ % 2 == 0)
```

## 適用シーン

| シーン | Groovy | Scala |
|--------|--------|-------|
| **スクリプティング** | ◎ 最適 | △ 可能だが重い |
| **ビルド自動化** | ◎ Gradleで広く使用 | △ sbtスクリプト |
| **Webアプリケーション** | ○ Grailsフレームワーク | ◎ Play、Akka HTTP |
| **データ処理** | △ 可能 | ◎ Apache Spark |
| **マイクロサービス** | ○ 軽量 | ◎ Akka、ZIO |
| **関数型プログラミング** | △ サポート限定的 | ◎ 強力なサポート |
| **エンタープライズ** | ○ 中規模システム | ◎ 大規模分散システム |
| **テスト自動化** | ◎ Spock | ○ ScalaTest |

## 長所・短所

### Groovy

**長所:**
- Java開発者にとって学習が容易
- 簡潔な構文、ボイラープレートが少ない
- 動的型付けによる柔軟性
- スクリプティングに最適
- Gradleビルドツールの基盤

**短所:**
- 実行速度がJavaより遅い
- 型安全性が低い
- 大規模プロジェクトでの保守性の課題
- コミュニティがScalaより小さい
- 現代的な関数型プログラミング機能が限定的

### Scala

**長所:**
- 強力な型システムと型推論
- 関数型プログラミングとオブジェクト指向の融合
- Javaと同等以上のパフォーマンス
- 豊富なエコシステム（Akka、Play、Spark）
- 大規模プロジェクトでの保守性
- 並行処理・非同期処理のサポートが優れている

**短所:**
- 学習曲線が急峻
- コンパイル速度が遅い
- 複雑な構文になることがある
- バージョン間の非互換性（Scala 2 vs 3）
- 初心者には難しい

## まとめ

**Groovyを選ぶべき場合:**
- スクリプティングや小規模な自動化タスク
- Gradleビルドスクリプトのカスタマイズ
- Java開発者がすぐに使える言語が必要
- 動的型付けの柔軟性を活かしたい
- テスト自動化（Spock）

**Scalaを選ぶべき場合:**
- 大規模なエンタープライズアプリケーション
- 関数型プログラミングを活用したい
- 型安全性が重要
- データ処理（Apache Spark）
- 並行処理・分散システム（Akka）
- 高パフォーマンスが必要

---

## 情報源・参考リンク

### 公式ドキュメント
1. **Groovy公式サイト**: https://groovy-lang.org/
2. **Scala公式サイト**: https://www.scala-lang.org/
3. **Groovy Documentation**: https://groovy-lang.org/documentation.html
4. **Scala Documentation**: https://docs.scala-lang.org/

### 言語比較・ベンチマーク
5. **JVM Languages Report**: https://www.jrebel.com/blog/java-jvm-languages-report
6. **Programming Language Benchmarks**: https://benchmarksgame-team.pages.debian.net/benchmarksgame/
7. **TIOBE Index** (言語人気度): https://www.tiobe.com/tiobe-index/
8. **Stack Overflow Developer Survey**: https://survey.stackoverflow.co/

### 技術記事・比較
9. **Groovy vs Scala: DZone**: https://dzone.com/articles/groovy-vs-scala
10. **Baeldung - Introduction to Groovy**: https://www.baeldung.com/groovy-language
11. **Baeldung - Introduction to Scala**: https://www.baeldung.com/scala-intro
12. **InfoQ - Scala Articles**: https://www.infoq.com/scala/

### コミュニティ・フォーラム
13. **Groovy Community**: https://groovy-lang.org/community.html
14. **Scala Community**: https://www.scala-lang.org/community/
15. **Reddit - r/scala**: https://www.reddit.com/r/scala/
16. **Reddit - r/groovy**: https://www.reddit.com/r/groovy/

### フレームワーク
17. **Grails Framework**: https://grails.org/
18. **Play Framework**: https://www.playframework.com/
19. **Akka**: https://akka.io/
20. **Apache Spark**: https://spark.apache.org/

### 学習リソース
21. **Groovy Tutorial - TutorialsPoint**: https://www.tutorialspoint.com/groovy/
22. **Scala Exercises**: https://www.scala-exercises.org/
23. **Coursera - Functional Programming in Scala**: https://www.coursera.org/specializations/scala
24. **Scala School by Twitter**: https://twitter.github.io/scala_school/

### 書籍（オンラインで検証可能）
25. **Programming in Scala** (公式): https://www.artima.com/shop/programming_in_scala_5ed
26. **Groovy in Action**: https://www.manning.com/books/groovy-in-action-second-edition

### パフォーマンス比較
27. **Computer Language Benchmarks Game**: https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/java-scala.html
28. **JVM Performance Comparison**: https://www.optaplanner.org/blog/

### 採用・求人市場
29. **Indeed Salary Search**: https://www.indeed.com/
30. **LinkedIn Jobs**: https://www.linkedin.com/jobs/

これらのリンクは、表で示した情報を検証し、さらに深く理解するための信頼できる情報源です。
