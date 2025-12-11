/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 

  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { Col, Container, Row } from "react-bootstrap";
import { FaApple, FaEnvelope, FaGooglePlay, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { constant } from "../utils/constant";

const Footer = () => {
  return (
    <>
      <footer>
        <div class="footer-widgets">
          <Container>
            <Row>
              <Col lg={4} md={6}>
                <div class="widget me-lg-5">
                  <p class="footer-logo">
                    <img src="../images/logo.svg" alt="Naxos" />
                  </p>
                  <p>
                    This Alcohol Delivery Management System is a fully integrated platform designed to streamline the entire alcohol ordering and delivery process through a customer mobile app, driver app, and powerful admin panel.
                  </p>
                </div>
              </Col>
              <Col lg={2} md={6}>
                <div class="widget">
                  <h6>Useful Links</h6>
                  <ul class="footer-menu">
                    <li><Link to="#">Support</Link></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link to="/terms-conditions">Terms &amp; Conditions</Link></li>
                    <li><Link to="#">Affiliate Program</Link></li>
                    <li><Link to="#">Careers</Link></li>
                  </ul>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div class="widget">
                  <h6>Contact Us</h6>
                  <div class="ftr-address">
                    <div class="ftr-cntct">
                      <span class="footr-icn"> <FaPhoneAlt />
                      </span>
                      <p>+91987456123</p>
                    </div>
                    <div class="ftr-cntct">
                      <span class="footr-icn"> <FaEnvelope />
                      </span>
                      <p>sales@abc.com</p>
                    </div>
                    <div class="ftr-cntct">
                      <span class="footr-icn"> <FaLocationDot />
                      </span>
                      <p>#94 ABC Streat, California ,USA</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div class="widget">
                  <h6>Download</h6>
                  <div class="button-store flex-column">
                    <Link to="#" class="custom-btn "><FaGooglePlay /><p>Available on<span>Google Play</span></p></Link>
                    <Link to="#" class="custom-btn "> <FaApple /><p>Download on<span>App Store</span></p></Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className="justify-content-center">
            <Col lg={12}>
              <div className="text-center copyright mt-0">
                <p className="mb-0">
                  © {new Date().getFullYear()} &nbsp;
                  <Link to="/">
                    {constant.PROJECT_NAME}&nbsp;
                  </Link>{" "}
                  | All Rights Reserved.{" "}
                  <Link

                    to={constant.COMPANY_LINK}
                    target="_blank"
                  >
                    {constant.COMPANY_NAME}
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer
