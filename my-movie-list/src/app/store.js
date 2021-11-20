import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../components/searchSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});
