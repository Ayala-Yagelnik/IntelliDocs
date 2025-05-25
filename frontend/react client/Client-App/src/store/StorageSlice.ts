import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../models/user";
import { MyFile } from "../models/myfile";
import { Folder } from "../models/folder";

const API_URL = `${import.meta.env.VITE_BASE_URL}/Files`;
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const createFolder = createAsyncThunk(
  "folders/createFolder",
  async ({ name, parentFolderId, ownerId }: { name: string; parentFolderId: number | null; ownerId: number }, thunkAPI) => {
    try {
      const response = await axios.post<Folder>(
        `${BASE_URL}/folders`,
        { name, parentFolderId, ownerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserContent = createAsyncThunk(
  "files/fetchUserContent",
  async (
    { userId }: { userId: number },
    thunkAPI
  ) => {
    try {
      const response = await axios.get<{ files: MyFile[]; folders: Folder[] }>(
        `${BASE_URL}/Users/${userId}/root-contents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFolderContents = createAsyncThunk(
  "files/fetchFolderContents",
  async ({ folderId }: { folderId: number }, thunkAPI) => {
    try {
      const response = await axios.get<{ files: MyFile[]; subFolders: Folder[] }>(
        `${BASE_URL}/Folders/${folderId}/contents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ fileUpload, user, folderId }: { fileUpload: File, user: User, folderId: number | null }, thunkAPI) => {
    try {
      const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;

      if (!bucketName || !region) {
        throw new Error("Environment variables are not properly configured.");
      }

      // Get presigned URL from server
      const presignedResponse = await axios.get(`${API_URL}/upload-url`, {
        params: {
          fileName: fileUpload.name
          , contentType: fileUpload.type
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });


      const { url } = presignedResponse.data as { url: string };
      console.log("presigned URL:", url);
      console.log("fileUpload:", fileUpload);
      // Upload file to S3 using the presigned URL
      await axios.put(url, fileUpload, {

        headers: { "Content-Type": fileUpload.type },
      });
      console.log(fileUpload.type);
      const fileKey = `${user.username}/${fileUpload.name}`;

      // Save file metadata in the database
      const fileMetadata = {
        fileName: fileUpload.name,
        fileKey: fileKey,
        fileSize: fileUpload.size,
        fileType: fileUpload.type,
        authorId: user.id,
        folderId: folderId,
        uploadDate: new Date().toISOString(),
      };
      console.log("fileMetadata:", fileMetadata);
      const savedFileResponse = await axios.post(`${API_URL}/upload`, fileMetadata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

      });

      return savedFileResponse.data as MyFile;
    } catch (error) {
      console.error("Error uploading file:", (error as Error).message);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const shareFile = createAsyncThunk(
  'files/share',
  async ({ fileId, email }: { fileId: number, email: string }, thunkAPI) => {
    console.log("Sharing file:", fileId, "with email:", email);
    try {
      const response = await axios.post(`${API_URL}/share`, { fileId, email }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("File shared successfully:", response.data);
      return { fileId, email };
    } catch (error) {
      console.error("Error sharing file:", error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const searchFiles = createAsyncThunk(
  'files/search',
  async ({ query, userId }: { query: string, userId: number }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { query, userId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data as MyFile[];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/trash',
  async (fileId: number, thunkAPI) => {
    try {
      console.log("move to trash file");
      await axios.delete(`${API_URL}/${fileId}/trash`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const deleteFolder = createAsyncThunk(
  'folder/trash',
  async (folderId: number, thunkAPI) => {
    try {
      console.log("move to trash folder");
      await axios.delete(`${BASE_URL}/folders/${folderId}/trash`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return folderId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const deleteFilePermanently = createAsyncThunk(
  'files/delete',
  async (fileId: number, thunkAPI) => {
    try {
      console.log("deleting file");
      await axios.delete(`${API_URL}/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAllFilesPermanently = createAsyncThunk(
  'files/deleteAll',
  async (fileIds: number[], thunkAPI) => {
    try {
      console.log("deleting all files");
      await Promise.all(
        fileIds.map(fileId =>
          axios.delete(`${API_URL}/${fileId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
        )
      );
      return fileIds;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);


export const starFile = createAsyncThunk(
  'files/star',
  async ({ fileId, isStarred }: { fileId: number, isStarred: boolean }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/${fileId}/star`,
        !isStarred,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPresignedUrl = createAsyncThunk(
  'files/fetchPresignedUrl',
  async (file: { fileKey: string }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/download-url`, {
        params: { filekey: file.fileKey },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = response.data as { presignedUrl: string };
      return { fileName: file.fileKey, presignedUrl: data.presignedUrl };
    } catch (error) {
      console.error('Error fetching pre-signed URL:', (error as Error).message);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const fetchSharedFiles = createAsyncThunk(
  "files/fetchShared",
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get<MyFile[]>(`${API_URL}/shared-files/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("fetchSharedFiles: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching shared files:", (error as Error).message);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDeletedFiles = createAsyncThunk(
  "files/fetchDeleted",
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get<MyFile[]>(`${API_URL}/trash/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("fetchDeletedFiles: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching deleted files:", (error as Error).message);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
export const restoreFile = createAsyncThunk(
  'files/restore',
  async (fileId: number, thunkAPI) => {
    try {
      await axios.patch(`${API_URL}/${fileId}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [] as MyFile[],
    shareFiles: [] as MyFile[],
    folders: [] as Folder[],
    trashFiles: [] as MyFile[],
    loading: false,
    presignedUrls: null as Record<string, string> | null
  },
  reducers: {
    logout: (state) => {
      state.files = [];
      state.folders = [];
      state.shareFiles = [];
      state.trashFiles = [];
      state.presignedUrls = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContent.fulfilled, (state, action) => {
        state.files = action.payload.files;
        state.folders = action.payload.folders;
        console.log(state.files);
        console.log(state.folders);
        state.loading = false;
      })
      .addCase(fetchUserContent.rejected, (state, action) => {
        state.loading = false;
        console.log("fetchUserContent.rejected");
        console.error('failed', action.payload);
      })
      .addCase(fetchUserContent.pending, (state) => {
        console.log("fetchUserFiles.pending");
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        console.error('Upload failed:', action.payload);
      })
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(shareFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(shareFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })

      .addCase(searchFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(searchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
        const trashedFile = state.files.find(file => file.id === action.payload);
        if (trashedFile) {
          state.trashFiles.push(trashedFile);
        }
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(folder => folder.id !== action.payload);
        const deletedFolder = state.folders.find(folder => folder.id === action.payload);
        if (deletedFolder) {
          const filesInDeletedFolder = state.files.filter(file => file.folderId === deletedFolder.id);
          state.trashFiles.push(...filesInDeletedFolder);
          state.files = state.files.filter(file => file.folderId !== deletedFolder.id);
        }
        state.loading = false;
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(starFile.fulfilled, (state, action) => {
        state.files = state.files.map(file =>
          file.id === action.payload ? { ...file, isStarred: !file.isStarred } : file
        );
      })
      .addCase(starFile.rejected, (_, action) => {
        console.error('failed', action.payload);
      })
      .addCase(fetchPresignedUrl.fulfilled, (state, action) => {
        const { fileName, presignedUrl } = action.payload;
        if (!state.presignedUrls) {
          state.presignedUrls = {};
        }
        state.presignedUrls[fileName] = presignedUrl;
      })
      .addCase(fetchPresignedUrl.rejected, (_state, action) => {
        console.error('Failed to fetch pre-signed URL:', action.payload);
      })
      .addCase(fetchSharedFiles.fulfilled, (state, action) => {
        state.shareFiles = action.payload;
        state.loading = false;
      })
      .addCase(fetchSharedFiles.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch shared files:", action.payload);
      })
      .addCase(fetchSharedFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
      })
      .addCase(fetchFolderContents.fulfilled, (state, action) => {
        state.files = action.payload.files;
        state.folders = action.payload.subFolders;
        console.log(state.files);
        console.log(state.folders);
        state.loading = false;
      })
      .addCase(fetchFolderContents.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(fetchFolderContents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeletedFiles.fulfilled, (state, action) => {
        state.trashFiles = action.payload;
        console.log(state.trashFiles);
        state.loading = false;
      })
      .addCase(fetchDeletedFiles.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(fetchDeletedFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFilePermanently.fulfilled, (state, action) => {
        state.trashFiles.filter(file => file.id !== action.payload);
      })
      .addCase(deleteFilePermanently.rejected, (_, action) => {
        console.error('failed', action.payload);
      })
      .addCase(restoreFile.fulfilled, (state, action) => {
        state.trashFiles = state.trashFiles.filter(file => file.id !== action.payload);
        const restoredFile = state.trashFiles.find(file => file.id === action.payload);
        if (restoredFile) {
          state.files.push(restoredFile);
        }
      })
      .addCase(restoreFile.rejected, (_, action) => {
        console.error('failed', action.payload);
      })
      .addCase(deleteAllFilesPermanently.fulfilled, (state) => {
        state.trashFiles = [];
      })
      .addCase(deleteAllFilesPermanently.rejected, (_, action) => {
        console.error('failed', action.payload);
      });

  },
});

export default fileSlice;