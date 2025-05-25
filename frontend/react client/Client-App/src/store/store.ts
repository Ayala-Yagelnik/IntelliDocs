import { combineSlices, configureStore } from "@reduxjs/toolkit";
import fileSlice from "./StorageSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";



const store = configureStore({
    reducer: combineSlices(
        fileSlice,
        userSlice,
        authSlice,
    ),
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store