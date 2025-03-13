import store from "../store/store";

export type StoreType = ReturnType<typeof store.getState>
