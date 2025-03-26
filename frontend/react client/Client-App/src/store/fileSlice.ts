import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { File } from "../models/file";

// const API_URL = "https://intellidocs-server.onrender.com/api/Files";
const API_URL = "http://localhost:5046/api/Files";

export const fetchUserFiles = createAsyncThunk<File[], void, { rejectValue: { error: string } }>(
  'files/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
  async (file: File, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', new Blob([file.content], { type: file.fileType }), file.fileName);
    try {
      const response = await axios.post(`${API_URL}/upload`,
        //  file,
         formData,
          {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`        },
      });
      return response.data as File;
    } catch (error) {
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
  async ({fileId, isStarred}: {fileId:number, isStarred:boolean},thunkAPI) => {
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
  initialState: { list: [] as File[], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(fetchUserFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
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
      .addCase(shareFile.pending, (state) => {
        state.loading = true;
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
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(starFile.fulfilled, (state, action) => {
        state.list = state.list.filter(file => file.id !== action.payload);
        state.loading = false;
      })
      .addCase(starFile.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      .addCase(starFile.pending, (state) => {
        state.loading = true;
      });
  },
});

export default fileSlice;