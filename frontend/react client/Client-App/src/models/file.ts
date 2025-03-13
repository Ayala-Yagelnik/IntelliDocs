export interface File {
    id: number;
    name: string;
    size: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    path: string;
}