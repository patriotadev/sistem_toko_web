import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./common/darkModeSlice";
import colorSchemeReducer from "./common/colorSchemeSlice";
import sideMenuReducer from "./common/sideMenuSlice";
import simpleMenuReducer from "./common/simpleMenuSlice";
import topMenuReducer from "./common/topMenuSlice";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    simpleMenu: simpleMenuReducer,
    topMenu: topMenuReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
