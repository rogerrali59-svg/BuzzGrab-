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
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { FaApple } from "react-icons/fa";
import { IoLogoAndroid } from "react-icons/io";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import "./static.scss";

function HowItWork() {

    return (
        <>
            <Header />
            <section className="breadcrum-main">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="breadcrum-text text-center">
                                <h1>How it Works</h1>
                                <ul className="d-flex align-items-centere gap-2 justify-content-center mb-0">
                                    <li>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li>/</li>
                                    <li>How it Works</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section class="how_it_works" id="how_it_work">
                <Container>
                    <Row className=" justify-content-center">
                        <Col lg={7} md={10} >
                            <div className="section-title text-center">
                                <h3>How it works - 3 easy steps</h3>
                                <p>Getting started with our app is quick and easy. Here's a simple
                                    step-by-step guide to help you make the most of your experience: </p>
                            </div>
                        </Col>
                    </Row>
                    <div class="how_it_inner">
                        <div class="step_block">
                            <ul>
                                <li>
                                    <div class="step_text">
                                        <h4>Download app</h4>
                                        <div class="app_icon">
                                            <Link to="#"><FaApple /></Link> <Link to="#"><IoLogoAndroid /></Link>

                                        </div>
                                        <p>Download App either for Apple or Android </p>
                                    </div>
                                    <div class="step_number">
                                        <h3>01</h3>
                                    </div>
                                    <div class="step_img">
                                        <img src="../images/step1.jpg" alt="image" />
                                    </div>
                                </li>

                                <li>
                                    <div class="step_text">
                                        <h4>Create account</h4>
                                        <p>Sign up free for App account. One account for all devices.</p>
                                    </div>
                                    <div class="step_number">
                                        <h3>02</h3>
                                    </div>
                                    <div class="step_img">
                                        <img src="../images/step2.jpg" alt="image" />
                                    </div>
                                </li>

                                <li>
                                    <div class="step_text">
                                        <h4>It’s done, enjoy the app</h4>
                                        <span>Have any questions check our <a href="#">FAQs</a></span>
                                        <p>Get most amazing app experience,Explore and share the app</p>
                                    </div>
                                    <div class="step_number">
                                        <h3>03</h3>
                                    </div>
                                    <div class="step_img">
                                        <img src="../images/step3.jpg" alt="image" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </Container>
            </section>

            <Footer />
        </>
    );
}

export default HowItWork;
