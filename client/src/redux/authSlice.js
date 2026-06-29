import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
  try {
    const user = localStorage.getItem("flipkart_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    isLoggedIn: !!loadUser(),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("flipkart_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("flipkart_user");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("flipkart_user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export default authSlice.reducer;
