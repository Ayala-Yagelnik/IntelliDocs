import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../models/user";
import { File } from "../models/file";

// const API_URL = "https://intellidocs-server.onrender.com/api/Files";
const API_URL = "http://localhost:5046/api/Files";

export const fetchUserFiles = createAsyncThunk(
  'files/fetch',
  async (userId:number, thunkAPI) => {
    try {
      console.log("fetching files");
      const response = await axios.get<File[]>(
        `${API_URL}/user-files/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("response: ", response);
      return response.data as File[];
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
  async ({ fileUpload , user }: { fileUpload: { fileName: string; fileType: string; fileSize: number }; user: User }, thunkAPI) => {
    try {
      const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;

      if (!bucketName || !region) {
        throw new Error("Environment variables are not properly configured.");
      }

      // Get presigned URL from server
      const presignedResponse = await axios.get(`${API_URL}/upload-url`, {
        params: { fileName: fileUpload.fileName, contentType: fileUpload.fileType },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { url } = presignedResponse.data as { url: string};

      // Upload file to S3 using the presigned URL
      await axios.put(url, fileUpload, {
        headers: { "Content-Type": fileUpload.fileType },
      });

      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${user.username}/${fileUpload.fileName}`;

      // Save file metadata in the database
      const fileMetadata = {
        fileName: fileUpload.fileName,
        filePath: fileUrl,
        fileSize: fileUpload.fileSize,
        fileType: fileUpload.fileType,
        authorId: user.id,
      };

      const savedFileResponse = await axios.post(`${API_URL}/upload`, fileMetadata, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return savedFileResponse.data as File;
    } catch (error) {
      console.error("Error uploading file:", (error as Error).message);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const shareFile = createAsyncThunk(
  'files/share',
  async ({ fileId, userId }: { fileId: number, userId: number }, thunkAPI) => {
    try {
      await axios.post(`${API_URL}/share`, { fileId, userId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      return { fileId, userId };
    } catch (error) {
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
      return response.data as File[];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const deleteFile = createAsyncThunk(
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

const fileSlice = createSlice({
  name: 'files',
  initialState: { list: [] as File[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.list = action.payload;
        console.log(state.list);
        console.log("fetchUserFiles.fulfilled");
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
        state.list.push(action.payload);
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
        state.list = action.payload;
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
        state.list = state.list.filter(file => file.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(starFile.fulfilled, (state, action) => {
        state.list = state.list.map(file =>
          file.id === action.payload ? { ...file, isStarred: !file.isStarred } : file
        );
        state.loading = false;
      })
      .addCase(starFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
  },
});

export default fileSlice;