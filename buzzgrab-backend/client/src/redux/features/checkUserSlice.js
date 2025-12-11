/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const checkCurrentUser = createAsyncThunk("current_user", async () => {
  try {
    const response = await checkUser();
    if (response.status === 200) {
      localStorage.setItem("currentUser", JSON.stringify(response.data?.data));
      return response.data?.data;
    }
  } catch (error) {
    console.error(error);
  }
});

const checkUserSlice = createSlice({
  name: "checkUser",
  initialState: {
    data: JSON.parse(localStorage.getItem("currentUser"))
      ? JSON.parse(localStorage.getItem("currentUser"))
      : null,
    pending: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkCurrentUser.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          pending: false,
        };
      })
      .addCase(checkCurrentUser.rejected, (state) => {
        return {
          ...state,
          data: null,
        };
      });
  },
});

export default checkUserSlice.reducer;
