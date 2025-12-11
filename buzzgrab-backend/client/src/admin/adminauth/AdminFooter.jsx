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
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSlider from "../../hooks/useSlider";
import { constant } from "../../utils/constant";

const AdminFooter = () => {
  const isSlider = useSlider();
  return (
    <>
      <section
        className={isSlider ? "admin-footer close" : "admin-footer open"}
      >
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <p className="mb-0">
                &copy; {new Date().getFullYear()}&nbsp;
                <Link
                  to="/admin/dashboard"
                  className="text-decoration-underline "
                >
                  {constant.PROJECT_NAME}&nbsp;
                </Link>
                | All Rights Reserved. Developed By &nbsp;
                <Link
                  to={constant.COMPANY_LINK}
                  target="_blank"
                  className="text-decoration-underline "
                >
                  {constant.COMPANY_NAME}
                </Link>
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminFooter;
