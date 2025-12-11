/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { NavbarBrand } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useSlider from "../../hooks/useSlider";
import AdminHeader from "../adminauth/AdminHeader";
import SidebarData from "./SidebarData.jsx";
import "./sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const isSlider = useSlider();

  return (
    <>
      <AdminHeader />
      <div className={isSlider ? "sidebarmain close" : "sidebarmain open"}>
        <>
          <NavbarBrand
            onClick={() => navigate("/admin/dashboard")}
            className="admin-logo"
            style={{ cursor: "pointer" }}
          >
            <img src={"/images/logo.svg"} alt="LOGO" className="full-logo" />
            <img src={"/images/logo.svg"} alt="LOGO" className="small-logo" />
          </NavbarBrand>
          <div className="sidelist">
            <SidebarData />
          </div>
        </>
      </div>
    </>
  );
};

export default Sidebar;
