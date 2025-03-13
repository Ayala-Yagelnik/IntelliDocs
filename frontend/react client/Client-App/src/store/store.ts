import { combineSlices, configureStore } from "@reduxjs/toolkit";
import fileSlice from "./fileSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: combineSlices(
        fileSlice,
        userSlice,
        authSlice
    ),
});

export type AppDispatch = typeof store.dispatch; 
export default store