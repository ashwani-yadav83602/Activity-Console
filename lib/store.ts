import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { taskApi } from "@/lib/services/taskApi";
import taskFeedReducer from "@/lib/redux/taskFeedSlice";
import { AnyARecord } from "dns";

export const makeStore:any = () => {
  const store = configureStore({
    reducer: {
      [taskApi.reducerPath]: taskApi.reducer,
      taskFeed: taskFeedReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(taskApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];