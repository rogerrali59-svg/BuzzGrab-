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
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./notfound.scss";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <div className="not-found">
        <div className="not_found" data-text={404}>
          <img src={"/images/not-found.gif"} />
        </div>
        <h1 className="mainhead mb-0">404 Not Found</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="theme-btn btn-md"
        >
          Go to Home
        </button>
      </div>
    </Container>
  );
};

export default NotFound;
