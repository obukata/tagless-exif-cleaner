import { ProcessedFile } from "./types";

export async function rotateImage(file: File, rotate: number): Promise<Blob> {

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // 画像のサイズ取得
      const size = {
        width: img.width,
        height: img.height
      }

      // canvasの設定
      const canvas = document.createElement('canvas')

      // 回転後のcanvasサイズに変更
      canvas.width = size.height
      canvas.height = size.width
      const ctx = canvas.getContext('2d')

      // ここから回転処理
      ctx?.translate(size.height / 2, size.width / 2)
      ctx?.rotate((Math.PI / 180) * rotate)
      ctx?.drawImage(img, -(size.width/2), -(size.height/2))

      // 全ての処理が終わった画像を返す
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to Blob failed'))
        }
      }, 'image/jpeg', 1)
    }
    img.src = URL.createObjectURL(file)
  })
}