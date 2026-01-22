# 画面の見方

このページでは、小説らいたーの画面構成を説明します。

## 全体構成

小説らいたーの画面は、大きく3つのエリアに分かれています。

<ScreenLayout />

## ヘッダー

画面上部のヘッダーには、主要な操作ボタンが並んでいます。

<CardGrid :columns="2">

<FeatureCard icon="🏠" title="プロジェクト一覧へ" color="#6366f1">
プロジェクト選択画面に戻ります
</FeatureCard>

<FeatureCard icon="📤" title="エクスポート" color="#8b5cf6">
プロジェクトをJSONで保存
</FeatureCard>

<FeatureCard icon="🔍" title="検索" color="#06b6d4">
プロジェクト全体を検索<br>
<strong>Ctrl+F</strong>
</FeatureCard>

<FeatureCard icon="🎨" title="表示設定" color="#10b981">
テーマ、フォント変更
</FeatureCard>

<FeatureCard icon="🔄" title="モード切替" color="#f59e0b">
シンプル/標準を切り替え
</FeatureCard>

<FeatureCard icon="👁️" title="プレビュー" color="#ec4899">
本文のプレビュー表示
</FeatureCard>

<FeatureCard icon="📝" title=".txt出力" color="#64748b">
テキストファイルで保存
</FeatureCard>

<FeatureCard icon="🌐" title=".html出力" color="#ef4444">
装飾付きHTMLで保存
</FeatureCard>

</CardGrid>

### サイドバー開閉ショートカット

| 操作 | ショートカット |
|------|--------------|
| 左パネル開閉 | `Ctrl+[` |
| 右パネル開閉 | `Ctrl+]` |

## 左パネル（設定ライブラリ）

::: info シンプルモードでは非表示
シンプルモードでは左パネルは表示されません。
:::

左パネルには3つのタブがあります。

<Accordion icon="📚" title="設定ライブラリ タブ" defaultOpen>

物語を構成するすべての「資料」を管理します。

<CardGrid :columns="2">

<FeatureCard icon="👤" title="キャラクター" color="#ec4899">
登場人物の一覧と作成
</FeatureCard>

<FeatureCard icon="🌍" title="世界観" color="#10b981">
場所、組織、魔法体系などの設定
</FeatureCard>

<FeatureCard icon="🔗" title="相関図" color="#8b5cf6">
キャラクター間の関係を視覚化
</FeatureCard>

<FeatureCard icon="📅" title="タイムライン" color="#06b6d4">
時系列で出来事を管理
</FeatureCard>

<FeatureCard icon="✨" title="固有名詞ジェネレーター" color="#f59e0b">
名前のアイデアを生成
</FeatureCard>

<FeatureCard icon="📖" title="ナレッジベース" color="#6366f1">
独自用語の辞書
</FeatureCard>

<FeatureCard icon="🗂️" title="プロットボード" color="#ef4444">
ストーリーの骨組み
</FeatureCard>

<FeatureCard icon="⚙️" title="設定" color="#64748b">
AIの挙動やプロフィールを設定
</FeatureCard>

</CardGrid>

</Accordion>

<Accordion icon="📋" title="アウトライン タブ">

本文の構造を章単位で管理します。

- 章のタイトルをクリック → その箇所にジャンプ
- ドラッグ&ドロップで章の順番を入れ替え
- 章ごとのメモを記録

</Accordion>

## 中央パネル（本文エリア）

物語の本文を執筆するメインエリアです。

### 本文の表示

- 段落ごとにテキストが表示されます
- マウスオーバーで編集・ピン留めボタンが表示されます

### 編集モード

段落の編集ボタンをクリックすると、編集モードになります。

<CardGrid :columns="3">

<FeatureCard icon="𝐁" title="太字" color="#1e293b">
テキストを強調
</FeatureCard>

<FeatureCard icon="U̲" title="下線" color="#1e293b">
下線を追加
</FeatureCard>

<FeatureCard icon="𝐇" title="見出し" color="#1e293b">
章タイトルを作成
</FeatureCard>

<FeatureCard icon="ル" title="ルビ" color="#1e293b">
ふりがなを追加
</FeatureCard>

<FeatureCard icon="🎨" title="文字色" color="#1e293b">
テキストの色を変更
</FeatureCard>

</CardGrid>

### 直接入力エリア

画面下部の「本文を直接入力」エリアで、新しい段落を追加できます。

1. テキストを入力
2. 「本文に追加」ボタンをクリック
3. 入力した内容が本文の最後に追加される

## 右パネル（AIアシスタント）

AIと対話するエリアです。

### モード切替

<CardGrid :columns="2">

<FeatureCard icon="💬" title="相談モード" color="#8b5cf6">
アイデア出し、プロット相談
</FeatureCard>

<FeatureCard icon="✍️" title="執筆モード" color="#06b6d4">
物語の続きを書いてもらう
</FeatureCard>

</CardGrid>

### 複数提案

「複数提案」をONにすると、AIが複数の展開案を提示します。気に入ったものを選んで採用できます。

### AIへの指示

テキストエリアに指示を入力して送信ボタン（または `Ctrl+Enter`）で送信します。

### 提案の承認/却下

AIからの提案（ナレッジ、プロット）は、承認または却下を選択できます。

## レイアウトのカスタマイズ

<Accordion icon="↔️" title="サイドバーの幅調整">

サイドバーの境界線をドラッグして、幅を調整できます。

</Accordion>

<Accordion icon="📐" title="パネルの開閉">

- **左パネル**: `Ctrl+[`
- **右パネル**: `Ctrl+]`

</Accordion>

<Accordion icon="🎨" title="表示設定">

ヘッダーの「表示設定」ボタンから、以下を変更できます。

- **テーマ**: ライト / セピア / ダーク
- **フォント**: 使用するフォントを選択
- **文字サイズ**: 本文の文字サイズを調整

</Accordion>

## 次のステップ

画面構成を理解したら、実際に[本文を書く](/user-guide/writing)方法を学びましょう。
