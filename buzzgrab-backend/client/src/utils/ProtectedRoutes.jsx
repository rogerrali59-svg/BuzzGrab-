/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { Navigate, Outlet } from "react-router-dom";
import useRole from "../hooks/useRole";
import useToken from "../hooks/useToken";
import { constant } from "./constant";


export const AdminAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.SUBADMIN_ROLE) {
      return <Navigate to="/subadmin/dashboard" replace={true} />;
    }
    else {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/" replace={true} />;
  }
};


export const SubAdminAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.ADMIN_ROLE) {
      return <Navigate to="/admin/dashboard" replace={true} />;
    }
    else {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/" replace={true} />;
  }
};


export const PublicAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.ADMIN_ROLE) {
      return <Navigate to="/admin/dashboard" replace={true} />;
    }
    else if (role == constant.SUBADMIN_ROLE) {
      return <Navigate to="/subadmin/dashboard" replace={true} />;
    }
  } else {
    return <Outlet />;
  }
};