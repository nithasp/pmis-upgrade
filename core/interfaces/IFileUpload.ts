export interface IFileUpload {
   document_file_type: string;
   extension: string
   fileName: string
   filePath: string
   preview: string
   size: number
   fileType?: string
   isError?: boolean
   id?: number
}
