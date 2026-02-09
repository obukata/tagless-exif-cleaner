import { ProcessedFile } from "@/lib/types"
import Badge from "../Badge/Badge"
import { Menu, MenuItem, MenuTrigger } from "../Menu/Menu"
import { Button } from "../Button/Button"
import { MoreHorizontal } from "lucide-react"
import { Icon } from "@iconify-icon/react"

interface UploadItemProps {
  file: ProcessedFile,
  onDownload: (id: string) => void,
  onDelete: (id: string) => void,
}

export default function UploadItem({ file, onDownload, onDelete }: UploadItemProps) {
  return (
    <div className={`flex gap-2 justify-between items-center duration-200 ${file.status !== 'done' ? 'opacity-30' : ''}`}>
      <div className="flex gap-2 items-center min-w-0">
        <div className="w-12 shrink-0 rounded-xl overflow-hidden aspect-square">
          <img src={file.previewUrl} alt={file.file.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-start gap-0.5 min-w-0">
          <span className="font-bold text-sm text-ellipsis whitespace-nowrap overflow-hidden w-full">{file.file.name}</span>
          {/* <Badge variant={file.status}>{file.status}</Badge> */}
        </div>
      </div>
      <div>
        {/* <MenuTrigger>
          <Button variant="quiet">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          <Menu>
            <MenuItem onAction={() => onDownload(file.id)}>
              🦄
              ダウンロード
            </MenuItem>
            <MenuItem onAction={() => onDelete(file.id)}>
              🗑️
              削除
            </MenuItem>
          </Menu>
        </MenuTrigger> */}
      </div>
    </div>
  )
}