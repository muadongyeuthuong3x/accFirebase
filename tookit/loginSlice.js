import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
 id : 0
};


export const counterSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    idLogin:  (state, action) => {
      state.id  ="AAAAA";
    },
  },
});

export const {idLogin } = counterSlice.actions;

export const selectIdLogin = state => state.id;


export default counterSlice.reducer;