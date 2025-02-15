# Subaru Tone

## 実行はここから！

[Subaru Tone](https://sayonari.github.io/subaru_tone/)

---

## 概要

Subaru Toneは、画面上のグラデーション部分をタップまたはクリックすることで音を鳴らせるウェブアプリケーションです。オタマトーンのように操作しながらピッチを変化させることができます。

## 特徴

- **シンプルな操作性**：画面をタップ・クリックするだけで音が鳴ります。
- **ピッチ調整可能**：タッチ位置に応じて音程が変化します。
- **デスクトップおよびモバイル対応**：マウスやタッチ操作をサポートします。

## 使用方法

1. 上記リンクからアプリケーションを開きます。
2. グラデーションエリア（画面下部）をクリックまたはタップします。
3. マウスや指を上下に移動するとピッチが変化します（上が高音、下が低音）。
4. クリックやタップを離すと音が停止します。

## 開発者

- 開発者： [さよなり](https://x.com/sayonari)
- 発想参照元： [くみゆき進 様](https://x.com/kumiyuki_P)
- 声の主： [大空スバル 様](https://x.com/oozorasubaru)

## ファイル構成

```
subaru_tone/
├── index.html       # メインHTMLファイル
├── style.css        # スタイルシート
├── script.js        # JavaScriptロジック
└── sound/
    └── subaru_tone.wav # 音声データ
```

## プログラム詳細

### グラデーションデザイン

このアプリは大空スバルさんをイメージしたカラーリングを採用しています。グラデーションは以下の4色で構成され、音程に対応します。

- 白 (#ffffff): 高音（上）
- 黄色 (#ffd700): 中高音
- 赤 (#ff3333): 中低音
- 水色 (#87ceeb): 低音（下）

### 音声処理

JavaScriptの`AudioContext`を使用し、音声ファイルを再生しながらピッチを動的に調整します。

### ピッチ計算

タップやクリックの位置に応じて、2オクターブ内の音程を計算し周波数を調整します。

## 参考文献

### 動画参考
<a href="https://www.youtube.com/watch?v=1eFY9CDFBkw" target="_blank">
  <img src="./img/kumiyuki_youtube.png" alt="スバルトーン：くみゆき進" width="300">
</a>

### 音声取得元
<a href="https://www.youtube.com/live/3LA6t9YHsKw?t=1380" target="_blank">
  <img src="./img/subaru_youtube.png" alt="おはすば！！！！！ / OHASHUBA！！！FREE TALK【ホロライブ/大空スバル】" width="300">
</a>

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。

## 今後の課題

- より直感的な操作感の追求
- 音色や効果音の追加
- 音声調整機能の拡張

---

ぜひお試しください！
