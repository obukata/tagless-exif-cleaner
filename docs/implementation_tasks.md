# EXIF Cleaner 実装進行表

このドキュメントは、EXIF Cleanerアプリケーションを実装するためのステップバイステップガイドです。
上から順に進めていくことで、機能とUIを完成させることができます。

## Phase 1: ベースセットアップ
- [x] **ライブラリのインストール**
    - `react-aria-components`, `exifr`, `piexifjs` 等のインストール完了。
- [x] **ディレクトリ作成**
    - [x] `components/ui` (UIパーツ用)
    - [x] `lib` (ロジック用)

## Phase 2: UIコンポーネントの実装 (`components/ui`)
機能実装の前に、見た目のパーツを用意します。
- [ ] **Button コンポーネント** (`Button.tsx`)
    - React Ariaの `Button` をラップし、Tailwindでスタイルを適用。
- [ ] **DropZone コンポーネント** (`DropZone.tsx`)
    - ファイルをドラッグ＆ドロップできるエリア。React Ariaの `FileTrigger` や `DropZone` を使用。
- [ ] **ImageGrid コンポーネント** (`ImageGrid.tsx`) (Option)
    - 追加されたファイルを一覧表示する枠組み。

## Phase 3: ロジックの実装 (`lib`)
アプリケーションの「頭脳」となる処理を作成します。
- [ ] **EXIF解析処理** (`lib/exif.ts`)
    - `exifr` を使ってファイルからメタデータを読み取る関数。
- [ ] **画像クリーニング処理** (`lib/cleaner.ts`)
    - JPEG: `piexifjs` で削除。
    - HEIC: `heic2any` でJPEG変換。
    - PNG: Canvasで再描画してメタデータ削除。

## Phase 4: メイン画面の統合 (`app/page.tsx`)
UIとロジックを組み合わせます。
- [ ] **State管理**
    - アップロードされたファイル一覧 (`File[]` や独自の型) を管理するStateを作成。
- [ ] **アップロード処理の接続**
    - DropZoneでファイルを受け取り、Stateに追加する。
- [ ] **解析・表示の接続**
    - ファイル追加時にEXIF解析関数を呼び出し、結果を表示する。
- [ ] **ダウンロード処理の接続**
    - 「保存」ボタンでクリーニング処理を実行し、ダウンロードさせる。

## Phase 5: 仕上げ
- [ ] **一括ダウンロード** (`jszip`)
    - 複数ファイルをZIPにまとめる機能。
- [ ] **デザイン調整**
    - 全体のレイアウト、SP対応、ダークモード等。
