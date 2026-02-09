import exifr from "exifr";

const parseOptions: any = {
  tiff: true,
  ifd0: true, // カメラメーカー/モデル
  exif: true, // 撮影日時など
  gps: true, // GPS情報
}

export async function parseImageExif(file: Blob): Promise<Record<string, any>> {
  try {
    const output = await exifr.parse(file, parseOptions)
    return output || {}
  } catch (error) {
    console.warn('EXIF parsing failed', error)
    return {}
  }
}