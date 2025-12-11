/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import React from "react";
import { Container, Navbar } from "react-bootstrap";
import "../assets/responsive.scss";
import "./header.scss";

function HeaderCookies() {
  return (
    <>
      <Navbar expand="lg" className="navigation-top">
        <Container>
          <Navbar.Brand href="/" className="header-logo">
            {/* <img src={"/images/logo-white.png"} /> */}
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default HeaderCookies;
