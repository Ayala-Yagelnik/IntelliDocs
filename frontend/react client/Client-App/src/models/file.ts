export interface File {
    isStarred: boolean;
    id: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    fileKey: string;
    content: ArrayBuffer;
}