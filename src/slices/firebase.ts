import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: '',
};
const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    setFirebaseToken(state, action) {
      state.token = action.payload.token;
      console.log(state.token, 'slice');
    },
  },
  extraReducers: {},
});

export default firebaseSlice;
