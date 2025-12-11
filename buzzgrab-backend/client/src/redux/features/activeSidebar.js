import { createSlice } from "@reduxjs/toolkit";
const activeSidebar = createSlice({
  name: "auth",
  initialState: {
    menu: "",
  },
  reducers: {
    activeMenu: (state, action) => {
      return {
        ...state,
        details: action.payload,
      };
    },
  },
});
export const { activeMenu } = activeSidebar.actions;
export default activeSidebar.reducer;                                                      