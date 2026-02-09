import { ProcessedFile } from './types'

export async function cleanImage(file: File): Promise<Blob> {

  // HEICの処理
  if (file.name.toLowerCase().endsWith('.heic')) {
    const heic2any = (await import('heic2any')).default

    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: .9
    })
    return Array.isArray(converted) ? converted[0] : converted
  }

  // JPEGの処理
  if (file.type === 'image/jpeg' || file.name.toLocaleLowerCase().endsWith('.jpg')) {
    const piexif = (await import('piexifjs')).default

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataURL = e.target?.result as string

        // 画像データ（Blobデータ）をBase64にエンコードして、EXIF情報だけを空っぽにした後に再度画像データ（Blobデータ）に戻す。
        try {
          // pixeif.remove()すると画像データがBase64になる。（エンコードする）
          const cleanedDataURL = piexif.remove(dataURL)

          // split(',')[0] => 'data:image/jpeg;base64,'  split(',')[1] => それ以外。atob()はBase64をデコード。
          const byteString = atob(cleanedDataURL.split(',')[1])

          // MIMEタイプを取り出したいので、'image/jpeg' を抜き出す。
          const mimeString = cleanedDataURL.split(',')[0].split(':')[1].split(';')[0]

          // Base64からBlobデータへの変換にあたっての特有のメモリ管理方法。（直接変換は出来ないので、こういうもんだと思います）
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([ab], {type: mimeString})
          resolve(blob)
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  return file
}

export async function downloadAllAsZip(files: ProcessedFile[]) {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const folder = zip.folder('images_cleaned')
  if (!folder) throw new Error('ZIPフォルダの作成に失敗しました')

  const doneFiles = files.filter(f => f.status === 'done')
  if (doneFiles.length === 0) {
    alert('ダウンロード出来るファイルがありません')
    return
  }

  const promises = doneFiles.map(async (pFile) => {
    try {
      console.log(pFile.file)
      const cleanedBlob = await cleanImage(pFile.file)
      const fileName = pFile.file.name.replace(/(\.[\w\d]+)$/, '_cleaned$1')
      folder.file(fileName, cleanedBlob)
    } catch (e) {
      console.error('ZIP追加失敗', pFile.file.name, e)
    }
  })
  await Promise.all(promises)

  const content = await zip.generateAsync({ type: 'blob' })

  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'images_cleaned.zip'
  a.click()
  URL.revokeObjectURL(url)
}
