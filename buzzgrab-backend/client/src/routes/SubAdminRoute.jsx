/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { Route, Routes } from "react-router-dom";
import AdminProfile from "../admin/adminauth/AdminProfile";
import AdminResetPassword from "../admin/adminauth/AdminResetPassword";
import NotFound from "../component/NotFound";
import Dashboard from "../subadmin/component/Dashboard";

const SubAdminRoute = () => {
  return (
    <>
      <Routes>
        {/***********************Dashboard section **********************/}
        <Route path="/dashboard" element={<Dashboard />} />


        {/***********************Admin profile  section **********************/}
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/reset-password" element={<AdminResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};


export default SubAdminRoute
