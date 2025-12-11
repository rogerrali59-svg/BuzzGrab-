/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./features/authSlice";
import sliderSlice from "./features/sliderSlice";
import rememberSlice from "./features/rememberSlice";
import activeSidebar from "./features/activeSidebar";
const store = configureStore({
  reducer: {
    auth: persistReducer(
      {
        key: "auth",
        storage,
      },
      authSlice
    ),
    activesidebar: persistReducer(
      {
        key: "activeSidebar",
        storage,
      },
      activeSidebar
    ),

    sidebar: persistReducer(
      {
        key: "slider",
        storage,
      },
      sliderSlice
    ),
    remember: persistReducer(
      {
        key: "remember",
        storage,
      },
      rememberSlice
    ),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { persistor, store };
