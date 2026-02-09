export interface ProcessedFile {
  id: string
  file: File
  previewUrl: string
  status: 'pending' | 'processing' | 'done' | 'error'
  metadata?: Record<string, any>
}