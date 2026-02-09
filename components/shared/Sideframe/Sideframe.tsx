import { Separator } from "@/components/ui/Separator/Separator";
import UploadItem from "@/components/ui/UploadItem/UploadItem";
import { ProcessedFile } from "@/lib/types";

interface SideframeProps {
  files: ProcessedFile[],
  onDownload: (id: string) => void,
  onDelete: (id: string) => void,
}

export default function Sideframe({ files, onDownload, onDelete }: SideframeProps) {
  return (
    <aside className="shrink-0 w-92 @4xl:block hidden">
      <div className="h-dvh fixed top-0 w-92 border-l border-neutral-100 flex flex-col bg-white">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-2">
            <img className="w-10" src="/symbol.svg" alt="" width={44} height={44} />
            <img className="h-4.5 mt-1.5" src="/logo.svg" alt="" />
          </div>
          <Separator className="bg-neutral-100" />
          <div className="bg-neutral-50 rounded-2xl p-4">
            <div className="flex justify-between gap-6 items-center">
              <div className="font-bold text-sm text-neutral-600 py-2">📂 アップロード済み</div>
              <p className="font-bold text-sm text-neutral-500">{files.length}件</p>
            </div>
            {files.length === 0 ? (
              <p className="text-sm text-neutral-400">
                まだファイルはありません
              </p>
            ): (
              <div className="space-y-2">
                {files.map((file) => (
                  <UploadItem
                    key={file.id}
                    file={file}
                    onDownload={onDownload}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}