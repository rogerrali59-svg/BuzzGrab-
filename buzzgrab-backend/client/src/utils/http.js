/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta < shiv@ozvid.com >
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import axios from "axios";
import { store } from "../redux/store";
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* request interceptor */
http.interceptors.request.use(
  function (config) {
    let token = store.getState()?.auth?.details?.token;
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
