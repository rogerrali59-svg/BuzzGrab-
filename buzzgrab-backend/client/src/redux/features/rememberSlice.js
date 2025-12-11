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
  const rememberSlice = createSlice({
    name: "remember",
    initialState: {
      rememberMe: localStorage.getItem("rememberMe") === "true",
      rememberedEmail: localStorage.getItem("rememberedEmail") || "",
    },
    reducers: {
      toggleRememberMe: (state) => {
        const newState = !state.rememberMe;
        localStorage.setItem("rememberMe", newState);
        return {
          ...state,
          rememberMe: newState,
        };
      },
      setRememberedEmail: (state, action) => {
        const { email } = action.payload;
        localStorage.setItem("rememberedEmail", email);
        return {
          ...state,
          rememberedEmail: email,
        };
      },
    },
  });
  
  export const { toggleRememberMe, setRememberedEmail } = rememberSlice.actions;
  
  export default rememberSlice.reducer;