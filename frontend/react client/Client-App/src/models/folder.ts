import { MyFile } from "./myfile";

export interface Folder {
  id: number;
  name: string;
  createdAt: string;
  parentFolderId: number | null;
  ownerId: number;
  subFolders: Folder[];
  files: MyFile[];
  isStarred: boolean;
}