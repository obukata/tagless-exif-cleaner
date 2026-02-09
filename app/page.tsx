'use client'

import { DropZone } from "@/components/ui/DropZone/DropZone";
import { FileTrigger, Text } from "react-aria-components";
import Card from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { ProcessedFile } from "@/lib/types";
import { parseImageExif } from "@/lib/exif";
import { cleanImage, downloadAllAsZip } from "@/lib/cleaner";
import { rotateImage } from "@/lib/canvas";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer/Footer";
import Sideframe from "@/components/shared/Sideframe/Sideframe";

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([])

  const addFiles = async (incomingFiles: File[]) => {
    const newFiles: ProcessedFile[] = incomingFiles.map(file => ({
      id: crypto.randomUUID(),
      file: file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending'
    }))
    setFiles(prev => [...newFiles, ...prev])

    for (const pFile of newFiles) {
      setFiles(prev => prev.map(f => f.id === pFile.id ? { ...f, status: 'processing' } : f))

      // 処理の移り変わりを見るためにディレイをかける
      await new Promise(resolve => setTimeout(resolve, 1000))

      const metadata = await parseImageExif(pFile.file)
      console.log('解析完了:', pFile.file.name, metadata)

      setFiles(prev => prev.map(f => f.id === pFile.id ? {
        ...f,
        status: 'done',
        metadata: metadata
      }: f))
    }
  }

  const handleDrop = async (e: any) => {
    const items = e.items.filter((item: any) => item.kind === 'file')
    const files = await Promise.all(items.map((item: any) => item.getFile()))
    addFiles(files)
  }

  const handleSelect = async (e: any) => {
    // e.filseが空なら空配列を使う、as File[] で型アサーション
    const files = Array.from(e ?? []) as File[]
    addFiles(files)
  }

  const handleDownload = async (fileId: string) => {
    const target = files.find(f => f.id === fileId)
    if (!target) return

    try {
      const cleanedBlob = await cleanImage(target.file)
      const url = URL.createObjectURL(cleanedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = target.file.name.replace(/(\.[\w\d]+)$/, '_clean$1')
      a.click()

      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('クリーニング失敗', e)
      alert('画像の処理に失敗しました')
    }
  }

  const handleDelete = async (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleClear = async (fileId: string) => {
    const target = files.find(f => f.id === fileId)
    if (!target) return

    try {
      const cleanedBlob = await cleanImage(target.file)
      const newMetadata = await parseImageExif(cleanedBlob)
      URL.revokeObjectURL(target.previewUrl)
      const newPreviewUrl = URL.createObjectURL(cleanedBlob)

      setFiles(prev => prev.map(f => f.id === target.id ? {
        ...f,
        status: 'processing',
      } : f))

      // 演出用のディレイ
      await new Promise(resolve => setTimeout(resolve, 500))

      setFiles(prev => prev.map(f => f.id === target.id ? {
        ...f,
        status: 'done',
        file: new File([cleanedBlob], target.file.name, { type: cleanedBlob.type }),
        previewUrl: newPreviewUrl,
        metadata: newMetadata,
      } : f))


    } catch (e) {
      console.error('クリーニング失敗', e)
      alert('画像の処理に失敗しました')
    }
  }

  const handleRotate = async (fileId: string, rotate: number) => {
    const target = files.find(f => f.id === fileId)
    if (!target) return

    const rotatedBlob = await rotateImage(target.file, rotate)
    console.log(rotatedBlob)
    URL.revokeObjectURL(target.previewUrl)
    const newPreviewUrl = URL.createObjectURL(rotatedBlob)

    setFiles(prev => prev.map(f => f.id === target.id ? {
      ...f,
      status: 'processing',
    } : f))

    // 演出用のディレイ
    await new Promise(resolve => setTimeout(resolve, 500))

    setFiles(prev => prev.map(f => f.id === target.id ? {
      ...f,
      status: 'done',
      file: new File([rotatedBlob], target.file.name, { type: rotatedBlob.type }),
      previewUrl: newPreviewUrl,
    } : f))
  }

  return (
    <div className="pattern-grid-md bg-indigo-50/30 text-cyan-700/5">
      <div className="@container flex text-neutral-600">
        <main className="@container px-8 flex-1 flex flex-col min-h-dvh">
          <Header />
          <div className="flex-1 flex flex-col">
            <div className="max-w-4xl w-full mx-auto gap-8 flex flex-col py-8 flex-1">
              <div className="flex-1">
                <DropZone
                  onDrop={handleDrop}
                  className="py-24"
                  getDropOperation={types => (
                    ['image/jpeg', 'image/heic'].some(t => types.has(t)) ? 'copy' : 'cancel'
                  )}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl text-neutral-200 w-fit rounded-xl mx-auto leading-0 ">
                      <Icon icon="heroicons-outline:upload" />
                    </div>
                    <Text className="font-semibold text-neutral-400">
                      ここに画像をドロップまたは貼り付けてください
                    </Text>
                    <FileTrigger
                      onSelect={handleSelect}
                      allowsMultiple
                    >
                      <Button variant="primary" className="text-base" >
                        <Icon icon="heroicons-outline:photograph" />
                        ファイルを選択
                      </Button>
                      <p className="text-sm text-neutral-400">
                        対応形式: JPEG, HEIC
                      </p>
                    </FileTrigger>
                  </div>
                </DropZone>
              </div>
              <div className="@container">
                <div className="grid grid-cols-12 gap-x-2 gap-y-8 @xl:gap-8">
                  {files.map((file) => (
                    <div key={file.id} className="col-span-12 @xl:col-span-6 @4xl:col-span-4">
                      <Card
                        file={file}
                        onDelete={handleDelete}
                        onClear={handleClear}
                        onRotate={handleRotate}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
                <div className="bg-white relative before:absolute before:inset-0 before:m-auto before:w-[calc(100%-16px)] before:h-[calc(100%-16px)] before:bg-linear-to-t before:from-indigo-50/30 before:to-cyan-50/30 before:rounded-lg border border-neutral-100 rounded-2xl p-8 text-center space-y-4">
                  <div className="relative">
                    <img className="mx-auto" src="/img-rotate@4x.png" width="146" height="140" alt="" />
                    <div className="space-y-4">
                      <h2 className="font-bold text-lg bg-linear-to-t from-indigo-500 to-cyan-500 text-transparent bg-clip-text">向きズレを防止</h2>
                      <p className="text-neutral-600 text-sm leading-relaxed">回転情報を整理することで、<span className="inline-block">環境によって写真が横向きになる問題を防げます。</span></p>
                    </div>
                  </div>
                </div>
                <div className="bg-white relative before:absolute before:inset-0 before:m-auto before:w-[calc(100%-16px)] before:h-[calc(100%-16px)] before:bg-linear-to-t before:from-indigo-50/30 before:to-cyan-50/30 before:rounded-lg border border-neutral-100 rounded-2xl p-8 text-center space-y-4">
                  <div className="relative">
                    <img className="mx-auto" src="/img-gps@4x.png" width="158" height="145" alt="" />
                    <div className="space-y-4">
                      <h2 className="font-bold text-lg bg-linear-to-t from-indigo-500 to-cyan-500 text-transparent bg-clip-text">撮影場所を残さない</h2>
                      <p className="text-neutral-600 text-sm leading-relaxed">GPS情報を削除することで、<span className="inline-block">写真から撮影場所が特定される心配を減らせます。</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky py-8 px-0 bottom-0 left-0 right-0 mx-auto z-10 flex gap-8">
            <Button
              className="@xl:text-xl py-[1em] px-[2.5em] data-disabled:opacity-50"
              isDisabled={files.length === 0}
              onPress={() => downloadAllAsZip(files)}
            >
              <Icon icon="heroicons:folder-arrow-down-solid" />
              ダウンロード（ZIP）
            </Button>
          </div>
          <Footer />
        </main>
        <Sideframe
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}