/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    details: "",
    rememberMe: "",
  },
  reducers: {
    login: (state, action) => {
          return {
        ...state,
        details: action.payload,
      };
    },
    rememberAuth: (state, action) => {
      return {
        ...state,
        rememberMe: action.payload,
      };
    },
  },
});

export const { login, rememberAuth } = authSlice.actions;

export default authSlice.reducer;
