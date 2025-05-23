export interface MyFile {
    isStarred: boolean;
    id: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadDate: Date;
    authorId: number;
    fileKey: string;
    folderId: number|null;
    author?: {
        id: number;
        username: string;
        email: string;
    };
    deletedAt?: string ;
}