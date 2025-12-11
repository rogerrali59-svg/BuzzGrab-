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
import "./App.css";
import ChangePassword from "./authentication/ChangePassword";
import Forgot from "./authentication/Forgot";
import Login from "./authentication/Login";
import VerifyOTP from "./authentication/VerifyOTP";
import NotFound from "./component/NotFound";
import Home from "./home/Home";
import AdminRoute from "./routes/AdminRoute";
import About from "./static/About";
import ContactUs from "./static/ContactUs";
import Privacy from "./static/Privacy";
import Terms from "./static/Terms";
import {
  AdminAuth,
  PublicAuth,
  SubAdminAuth
} from "./utils/ProtectedRoutes";
import ScrollTop from "./utils/ScrollTop";
import SubAdminRoute from "./routes/SubAdminRoute";
import Faqs from "./static/Faqs";
import HowItWork from "./static/HowItWork";

function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        {/*******************************Admin Routes********************************/}
        <Route path="*" element={<AdminAuth />}>
          <Route path="admin/*" element={<AdminRoute />} />
        </Route>

        <Route path="*" element={<SubAdminAuth />}>
          <Route path="subadmin/*" element={<SubAdminRoute />} />
        </Route>
        {/*******************************Public Routes*******************************/}
        <Route path="*" element={<PublicAuth />}>
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="subadmin/login" element={<Login />} />
          <Route path="forgot-password" element={<Forgot />} />
          <Route path="subadmin/forgot-password" element={<Forgot />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="about-us" element={<About />} />
          <Route path="privacy-policy" element={<Privacy />} />
          <Route path="terms-conditions" element={<Terms />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="how-it-work" element={<HowItWork />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
