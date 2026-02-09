# EXIF Cleaner Application Specifications

## 1. 概要 (Overview)
簡単な画像変換Webアプリケーション。
アップロードされた写真のEXIF情報を表示し、EXIF情報を削除（クリーンアップ）したファイルをダウンロード可能にする。
また、画面上でEXIF情報を削除した状態へ更新する機能（プレビュー反映）も持つ。

## 2. 機能要件 (Functional Requirements)

### 2.1 画像アップロード (Image Upload)
- ユーザーは画像をアップロードできる。
- **一括アップロード (Batch Upload)** に対応。
- アップロード方法:
    - ファイル選択ダイアログ (`FileTrigger`)
    - ドラッグ＆ドロップ (`DropZone`)
- **対応フォーマット**:
    - JPEG (.jpg, .jpeg)
    - HEIC (.heic) - iOS等 (JPEGへ変換して処理)

### 2.2 EXIF情報の表示 (EXIF Info Display)
- アップロードされた**各**画像のEXIF情報を `exifr` で解析し表示する。
- 表示項目:
    - 撮影日時 (Date/Time Original)
    - カメラメーカー (Make) / モデル (Model)
    - GPS情報 (Latitude/Longitude) - 有無をアイコン等で警告表示
    - 画像の向き (Orientation)

### 2.3 EXIF情報の削除とダウンロード (EXIF Removal & Download)
- **EXIF削除 (Meta Clear)**:
    - JPEG: `piexifjs` を使用してLosslessに削除。
    - HEIC: `heic2any` でJPEG変換時にメタデータを除去。
- **個別操作**:
    - クリーンアップのみ実行（画面上のEXIF情報をクリア＆プレビュー更新）。
    - 削除済みファイルのダウンロード。
    - リストからの削除。
- **一括操作 (Batch Actions)**:
    - **全情報の削除**: リストにある全ファイルのEXIFをその場で削除・更新。
    - **一括ダウンロード**: 処理済みファイルを `jszip` でZIP圧縮してダウンロード。

## 3. 非機能要件 & 技術スタック (Technical Stack & Constraints)

### 3.1 技術スタック (Confirmed)
- Framework: Next.js (TypeScript) - **SSG (Static Export)**
- Styling: **Tailwind CSS** (w/ Tailwind Variants)
- UI Components: **React Aria Components**
- Icons: **Iconify** (`@iconify-icon/react`)
- Libraries:
    - `exifr`: EXIF解析
    - `piexifjs`: JPEG EXIF操作
    - `heic2any`: HEIC -> JPEG変換
    - `jszip`: ZIP圧縮

### 3.2 処理方式 (Processing Method)
- **クライアントサイド (Client-side) 完結**
    - Browser上でJavaScriptを用いて処理。
    - バックエンドAPIは持たない。
    - `window` オブジェクトへの依存があるライブラリは Dynamic Import で対応。

## 4. 画面構成 (UI Structure)
画面分割構成（`Main` + `Sideframe`）。

1. **Main Area**:
    - **Header**: タイトル表示
    - **Upload Zone**: 大きなドロップエリア、ファイル選択ボタン。対応形式の明記。
    - **Message Area**: ファイルがない場合の案内や、メリット訴求（GPS削除、向き補正など）。
    - **Grid View**: カード形式でのファイル一覧。
        - サムネイル、ファイル情報、EXIF概要。
        - 個別アクション: ダウンロード、削除（リストから）、クリア（EXIF削除）。
    - **Bottom Action Bar** (Sticky):
        - "全ファイルの情報を削除"
        - "ダウンロード（ZIP）"
    - **Footer**
2. **Sideframe (Right Sidebar)**:
    - アップロード済みファイルリスト（簡易表示）。
    - ステータス確認、個別アクションへのアクセス。

## 5. 今後の進め方 (Roadmap)
- [x] 技術調査 & 選定
- [x] 基本UI実装 (React Aria + Tailwind)
- [x] EXIF解析ロジック実装 (`exifr`)
- [x] EXIF削除ロジック実装 (`piexifjs`, `heic2any`)
- [x] ZIPダウンロード実装 (`jszip`)
- [ ] UI/UXの改善 (アニメーション、エラーハンドリング強化)
- [ ] テスト & デプロイ (GitHub Pages / Vercel 等)
