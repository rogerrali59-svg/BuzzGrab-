/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 **/

import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminFooter from "../admin/components/sidebar/AdminFooter";
import Sidebar from "../admin/components/sidebar/Sidebar";
import useRole from "../hooks/useRole";
import useSlider from "../hooks/useSlider";
import useToken from "../hooks/useToken";
import { constant } from "./constant";
import "./notfound.scss";

const NotFound = () => {
  const navigate = useNavigate();
  const role = useRole();
  const token = useToken();
  const isSidebarSlider = useSlider();
  return role == constant.ADMIN_ROLE && token ? (
    <>
      <Container fluid>
        <Sidebar />
        <div
          className={
            isSidebarSlider ? "body-content close" : "body-content open"
          }
        >
          <div className="not-found">
            <h1>404 Not Found</h1>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="btn btn-success"
            >
              Go To Home
            </button>
          </div>
        </div>
      </Container>
      <AdminFooter />
    </>
  ) : (
    <Container fluid>
      <div className="not-found">
        <h1>404 Not Found</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="btn btn-success"
        >
          Go To Home
        </button>
      </div>
    </Container>
  );
};

export default NotFound;
