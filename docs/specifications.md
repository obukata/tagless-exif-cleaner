# EXIF Cleaner Application Specifications

## 1. 概要 (Overview)
簡単な画像変換Webアプリケーション。
アップロードされた写真のEXIF情報を表示し、EXIF情報を削除（クリーンアップ）したファイルをダウンロード可能にする。

## 2. 機能要件 (Functional Requirements)

### 2.1 画像アップロード (Image Upload)
- ユーザーは画像をアップロードできる。
- **一括アップロード (Batch Upload)** に対応。
- アップロード方法:
    - ファイル選択ダイアログ
    - ドラッグ＆ドロップ（推奨）

### 2.2 EXIF情報の表示 (EXIF Info Display)
- アップロードされた**各**画像のEXIF情報を解析し、表示する。
- 複数画像の場合はリストまたはグリッドで表示。
- 表示項目例:
    - 撮影日時 (Date/Time Original)
    - カメラメーカー (Make)
    - カメラモデル (Model)
    - GPS情報 (Latitude/Longitude)
    - その他主要なパラメータ

### 2.3 EXIF情報の削除とダウンロード (EXIF Removal & Download)
- EXIF情報を完全に削除した画像を生成する。
- **一括ダウンロード (Batch Download)**:
    - 複数ファイルを処理した場合、ZIP形式などでまとめてダウンロード、または個別にダウンロード可能にする。

## 3. 非機能要件 & 技術スタック (Technical Stack & Constraints)

### 3.1 技術スタック (Confirmed)
- Framework: Next.js (TypeScript)
- Styling: **Tailwind CSS**
- UI Components: **React Aria** (Tailwindと組み合わせてアクセシブルなUIを構築)

### 3.2 処理方式 (Processing Method)
- **クライアントサイド (Client-side) 完結**
    - Browser上でJavaScriptを用いて処理。
    - バックエンドAPIは持たない。

### 3.3 対応フォーマット
- JPEG (.jpg, .jpeg)
- PNG
- **HEIC** (.heic) - iOSで撮影された写真など
    - ※ブラウザ表示のために変換(HEIC -> JPEG/PNG)が必要になる可能性あり。

## 4. 画面構成 (UI Structure)
シングルページアプリケーション (SPA) 構成。
1. **Header**: タイトル表示
2. **Main Area**:
    - **Upload Zone**: "ここに画像をドロップ (複数可)"
    - **Process List / Grid**:
        - アップロードされた画像の一覧表示
        - 各画像のサムネイルと検出されたEXIF概要
        - ステータス（EXIF削除済み、など）
    - **Global Actions**:
        - "すべてダウンロード" (ZIP推奨)

## 5. 今後の進め方
1. 技術調査
    - HEIC変換 (`heic2any` 等)
    - EXIF操作 (`piexifjs`, `exifr` 等)
    - ZIP圧縮 (`jszip` 等)
2. 実装計画作成 (`implementation_plan.md`)
3. 実装開始
