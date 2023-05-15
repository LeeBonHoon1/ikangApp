import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  number: '',
  password: '',
  sortation: 0,
  userIdx: 0,
  token: '',
  groupIdx: '',
  isLoggedIn: false,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.number = action.payload.number;
      state.password = action.payload.password;
      state.sortation = action.payload.sortation;
      state.userIdx = action.payload.userIdx;
      state.token = action.payload.token;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.groupIdx = action.payload.groupIdx;
    },
  },
  extraReducers: {},
});

export default userSlice;
