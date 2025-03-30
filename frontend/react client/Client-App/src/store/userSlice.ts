import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../models/user';

// const API_URL = "http://localhost:5046/api/Users";
const API_URL = "https://intellidocs-server.onrender.com/api/Users";

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as { message: string }).message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as { message: string }).message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, user }: { id: string, user: User }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, user, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as { message: string }).message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId: string, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as { message: string }).message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [] as User[],
    user: {} as User,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearCurrentUser(state) {
      state.user = { id: 0, username: '', email: '', password: '',  createdAt: new Date(),updatedAt:new Date() };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload as User[];
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.loading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === (action.payload as User).id);
        if (index !== -1) {
          state.users[index] = action.payload as User;
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== Number(action.payload));
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      });
  },
});


export const { setCurrentUser,clearCurrentUser } = userSlice.actions; 
export default userSlice;