import { configureStore } from "@reduxjs/toolkit";
import tournamentsReducer from "@/store/features/tournamentsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      tournaments: tournamentsReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
