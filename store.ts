import { Tuple, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./Redux/Reducers";

let browserWindow: any;
if (typeof window !== "undefined") browserWindow = window;

const store = configureStore({
  reducer: rootReducer,
  devTools:
    browserWindow &&
    browserWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    browserWindow.__REDUX_DEVTOOLS_EXTENSION__(),
});

export default store;
