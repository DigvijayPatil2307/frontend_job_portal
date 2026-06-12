import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateSavedJobs: (state, action) => {
      if (state.user) {
        state.user.savedJobs = action.payload;
      }
    },
  },
});

export const { setLoading, setUser, updateSavedJobs } = authSlice.actions;
export default authSlice.reducer;
