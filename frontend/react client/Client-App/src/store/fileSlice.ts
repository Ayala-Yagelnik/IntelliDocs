import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../models/user";
import { MyFile } from "../models/myfile";

const API_URL = `${import.meta.env.VITE_BASE_URL}/Files`;

export const fetchUserFiles = createAsyncThunk(
  'files/fetch',
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get<MyFile[]>(
        `${API_URL}/user-files/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.response) {
        if (e.response.status === 401) {
          return thunkAPI.rejectWithValue({ error: 'Unauthorized access' });
        }
        if (e.response.status === 403) {
          return thunkAPI.rejectWithValue({ error: 'Forbidden access' });
        }
      }
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ fileUpload, user }: { fileUpload: File, user: User }, thunkAPI) => {
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
      const response = await axios.post(`${API_URL}/search`,
        { query, userId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
      return response.data as MyFile[];
    } catch (error) {
      console.error('Error in searchFiles:', error);
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


const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [] as MyFile[],
    shareFile: [] as MyFile[],
    loading: false,
    presignedUrls: null as Record<string, string> | null
  },
  reducers: {
    logout: (state) => {
      state.files = [];
      state.shareFile = [];
      state.presignedUrls = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        console.log(state.files);
        state.loading = false;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.loading = false;
        console.log("fetchUserFiles.rejected");
        console.error('failed', action.payload);
      })
      .addCase(fetchUserFiles.pending, (state) => {
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
        const resultIds = new Set(action.payload.map((f) => f.id ));
        console.log("files",action.payload);
      
        state.files = state.files.filter((f) => resultIds.has(f.id));
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
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(starFile.fulfilled, (state, action) => {
        state.files = state.files.map(file =>
          file.id === action.payload ? { ...file, isStarred: !file.isStarred } : file
        );
        state.loading = false;
      })
      .addCase(starFile.rejected, (state, action) => {
        state.loading = false;
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
        state.shareFile = action.payload;
        state.loading = false;
      })
      .addCase(fetchSharedFiles.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch shared files:", action.payload);
      })
      .addCase(fetchSharedFiles.pending, (state) => {
        state.loading = true;
      });
  },
});

export default fileSlice;