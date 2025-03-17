import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../models/user';

const API_URL = "http://localhost:5046/api/Auth";

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string, password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; username: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`,{
        email: userData.email,
        password: userData.password,
        username: userData.username,
      }

      );
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error.message);
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
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error.message);
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
  reducers: {},
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
        state.user = action.payload as User;
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

export default authSlice;