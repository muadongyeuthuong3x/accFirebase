import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './loginSlice.js';

export const store = configureStore({
  reducer: {
    counter: loginSlice,
  },
});