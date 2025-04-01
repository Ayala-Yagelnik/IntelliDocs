/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../models/user';

const API_URL = `${import.meta.env.VITE_BASE_URL}/Auth`;
console.log("API_URL : ", API_URL);
console.log("API_URL : ", import.meta.env.VITE_BASE_URL);
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string, password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; username: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: userData.email,
        password: userData.password,
        username: userData.username,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data as { token: string; user: User };
    } catch (error:any) {
      if (error.response && typeof error.response.data === 'string') {
        // Handle plain text error response
        return thunkAPI.rejectWithValue(error.response.data);
      }
      if (error.response && error.response.data && error.response.data.message) {
        // Handle JSON error response
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      // Handle unknown errors
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const setAdmin = createAsyncThunk(
  'auth/setAdmin',
  async ({ userId }: { userId: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/setAdmin`, { userId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(setAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setAdmin.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice;