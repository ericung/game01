import { createSlice } from "@reduxjs/toolkit";

const signalrSlice = createSlice({
  name: "signalr",
  initialState: {
    isConnected: false,
    messages: [],
  },
  reducers: {
    connectionEstablished(state) {
      state.isConnected = true;
    },
    messageReceived(state, action) {
      state.messages.push(action.payload);
    },
  },
});

export const { connectionEstablished, messageReceived } = signalrSlice.actions;
export default signalrSlice.reducer;