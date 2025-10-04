  # 実行したこと：
  sudo mount --bind /mnt/c/Users/Lysander/Desktop/k8s_dev/ancho
  r-series-k8s/all-wiki
  /home/u24/u24_dev/u24-anchor-series/all-wiki

  これは何か？
  - Bind Mount = 実際のマウント（シンボリックリンクではない）
  - Windowsの実ディレクトリをWSL内のパスに直接マウント
  - /home/u24/u24_dev/u24-anchor-series/all-wiki
  に直接アクセス可能

  シンボリックリンクとの違い：

  | 項目       | Bind Mount (今回) | Symbolic Link |
  |----------|-----------------|---------------|
  | 実体       | 実マウント           | リンク           |
  | パフォーマンス  | 高速              | やや遅い          |
  | システム再起動後 | 消える             | 残る            |

  確認方法：
  # マウント状態確認
  mount | grep all-wiki

  # 内容確認
  ls -la /home/u24/u24_dev/u24-anchor-series/all-wiki

  再起動後も永続化したい場合：
  以前提案したsystemd mount
  unitを作成すれば、WSL起動時に自動マウントされます。
