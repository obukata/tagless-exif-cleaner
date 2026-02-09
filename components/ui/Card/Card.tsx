import { ProcessedFile } from "@/lib/types";
import { Button } from "../Button/Button";
import Badge from "../Badge/Badge";
import { Icon } from "@iconify-icon/react";
import { Text } from "react-aria-components";

interface CardProps {
  file: ProcessedFile,
  onDelete: (id: string) => void,
  onClear: (id: string) => void,
  onRotate: (id: string, rotate: number) => void,
}

export default function Card({ file, onDelete, onClear, onRotate }: CardProps) {
  // サイズをKB/MB表記にフォーマット
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const meta = file.metadata

  return (
    <div className={`flex flex-col gap-4 duration-200 ${file.status !== 'done' ? 'opacity-30' : ''}`}>
      <div className="rounded-2xl overflow-hidden aspect-square relative bg-white">
        <img
          src={file.previewUrl}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />
        {file.status === 'done' && (
          <>
            <div className="flex gap-4 absolute left-4 right-4 top-4">
              {meta?.latitude && (
                <Badge variant="danger">
                  <Icon icon="heroicons:exclamation-triangle-16-solid" />
                  <Text>GPS情報が含まれています</Text>
                </Badge>
              )}
              {meta?.Orientation && (
                <Badge variant="warning">
                  <Icon icon="f7:rotate-left"></Icon>
                  <Text>回転情報が含まれています</Text>
                </Badge>
              )}
              {!meta?.latitude && !meta?.Orientation && (
                <Badge variant="primary">
                  <Icon icon="heroicons:shield-check-16-solid" />
                  <Text>回転情報・GPS情報なし</Text>
                </Badge>
              )}
            </div>
            {!meta?.latitude && !meta?.Orientation && (
              <div className="absolute bottom-0 left-0 px-4 pb-4 flex w-full justify-between items-center">
                <Button variant="secondary" onPress={() => onRotate(file.id, -90)}>
                  <Icon icon="ix:rotate-90-left" />
                </Button>
                <Button variant="secondary" onPress={() => onRotate(file.id, 90)}>
                  <Icon icon="ix:rotate-90-right" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 px-2">
        <span className="text-sm font-bold">{file.file.name}</span>
        <div className="flex justify-between">
          <span className="text-xs text-neutral-400">{formatSize(file.file.size)}</span>
        </div>
        {meta?.latitude || meta?.Orientation && (
          <div className="flex rounded-md py-2 gap-2">
            <Button onPress={() => onClear(file.id)}>
              <Icon icon="heroicons:shield-check-16-solid" />
              情報の削除
            </Button>
            <Button onPress={() => onDelete(file.id)} variant="quiet">
              キャンセル
            </Button>
          </div>
          )}
      </div>
    </div>
  )
}