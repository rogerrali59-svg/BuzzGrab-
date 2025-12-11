/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import React, { useEffect } from "react";
import "./static.scss";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { staticPages } from "../services/services";
import { constant } from "../utils/constant";
import { useQuery } from "@tanstack/react-query";
import DataNotFound from "../Loader/DataNotFound";
import { FaCheck, FaDownload, FaInbox, FaStar, FaUsers } from "react-icons/fa";
import { MdControlCamera, MdLockOutline, MdOutlineManageHistory, MdOutlineVerifiedUser } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FaMobileScreen } from "react-icons/fa6";
import { RiDashboard3Line } from "react-icons/ri";

function About() {

  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    const animateCounters = () => {
      counters.forEach((counter) => {
        counter.innerText = "0";
        const target = +counter.getAttribute("data-target");
        const speed = 150;

        const updateCount = () => {
          const current = +counter.innerText;
          const increment = target / speed;

          if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };

        updateCount();
      });
    };

    let started = false;
    const handleScroll = () => {
      const section = document.querySelector(".counter").offsetTop;
      const scrollPos = window.scrollY + window.innerHeight;

      if (!started && scrollPos > section) {
        animateCounters();
        started = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutUsQuery = useQuery({
    queryKey: ["aboutUsQuery"],
    queryFn: async () => {
      const resp = await staticPages(constant.ABOUT_US);
      // console.log(resp?.data?.data?.data);
      return resp.data?.data ?? "";
    },
  });

  return (
    <>
      <Header />
      <section className="breadcrum-main">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="breadcrum-text text-center">
                <h1>About Us</h1>
                <ul className="d-flex align-items-centere gap-2 justify-content-center mb-0">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>/</li>
                  <li>About Us</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <section className="about-txt d-none">
          <Container>
            <Row className="align-items-center">
              {aboutUsQuery?.data?.title ? (
                <>
                  <Col>
                    <div className="about-rigth-txt">
                      <h2>{aboutUsQuery?.data?.title}</h2>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: aboutUsQuery?.data?.description,
                        }}
                      />
                    </div>
                  </Col>
                </>
              ) : (
                <div className="text-center"> <DataNotFound/></div>
              )}
            </Row>
          </Container>
        </section> */}
      <section id="overview" className="bg-grey">
        <Container>

          <Row className="align-items-center">
            <Col lg={6} className="res-margin">
              <div className="section-title text-center text-lg-start">
                {/* <h3>Buzzgrab Help to Manage Everything for You</h3> */}
                <h3>{aboutUsQuery?.data?.title}</h3>
                {/* <p>Our Alcohol Delivery Management System is built to bring convenience, safety, and efficiency to the way alcohol is ordered and delivered.</p> */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: aboutUsQuery?.data?.description,
                  }}
                />
              </div>
              {/* <ul className="overview-list">
                <li>
                  <p><FaCheck /> Easy-to-use customer app for browsing products, placing orders, and making secure payments.</p>
                </li>
                <li>
                  <p><FaCheck />Integrated identity checks ensure safe and legally compliant alcohol delivery.</p>
                </li>
                <li>
                  <p><FaCheck />Customers can track their delivery status from confirmation to doorstep arrival.</p>
                </li>
                <li>
                  <p><FaCheck />Drivers receive optimized routes, instant order assignments, and delivery guidance.</p>
                </li>
                <li>
                  <p><FaCheck /> Centralized system for managing orders, inventory, pricing, customers, and drivers.</p>
                </li>
              </ul>
              <p className="text-center text-lg-start">
                <Link to="#" className="theme-btn">Learn More</Link>
              </p> */}
            </Col>
            <Col lg={5} className="offset-lg-1 text-sm-center" >
              <img src="../images/daily-schedule.png" alt="img" />
            </Col>
          </Row>
        </Container>

      </section>
      <section className="parallax">
        <div className="overlay"></div>
        <div className="container">
          <Row>
            <Col xs={6} md={6} lg={3}>
              <div className="counter-card">
                <div className="icon">
                  <FaDownload />
                </div>
                <div className="info">
                  <h3 className="counter" data-target="2397">
                    0
                  </h3>
                  <p>Total Downloads</p>
                </div>
              </div>
            </Col>
            <Col xs={6} md={6} lg={3}>
              <div className="counter-card">
                <div className="icon">
                  <FaUsers />
                </div>
                <div className="info">
                  <h3 className="counter" data-target="982">
                    0
                  </h3>
                  <p>Happy Clients</p>
                </div>
              </div>
            </Col>
            <Col xs={6} md={6} lg={3}>
              <div className="counter-card">
                <div className="icon">
                  <FaMobileScreen />
                </div>
                <div className="info">
                  <h3 className="counter" data-target="890">
                    0
                  </h3>
                  <p>Active Users</p>
                </div>
              </div>
            </Col>
            <Col xs={6} md={6} lg={3}>
              <div className="counter-card">
                <div className="icon">
                  <FaStar />
                </div>
                <div className="info">
                  <h3 className="counter" data-target="537">
                    0
                  </h3>
                  <p>App Rates</p>
                </div>
              </div>
            </Col>
          </Row>



        </div>
      </section>
      <section className="features">
        <Container>
          <Row className=" justify-content-center">
            <Col lg={7} md={10} >
              <div className="section-title text-center">
                <h3>Why Choose Our Alcohol Delivery Management System?</h3>
                <p>Our platform brings together fast ordering, secure verification, and efficient delivery operations in one seamless system. </p>
              </div>
            </Col>
          </Row>

          <Row >
            <Col lg={4} md={6} >
              <ul className="features-item">
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <TbTruckDelivery />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Fast Online Ordering</h4>
                      <p>Browse an extensive catalog of wines, beers, spirits, and more. Order in just a few taps through our intuitive mobile app.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <MdLockOutline />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Secure Age Verification</h4>
                      <p>Compliance-first design ensures all deliveries include verified age checks, keeping your business and users protected.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <FaInbox />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Real-Time Order Tracking</h4>
                      <p>Track your order from checkout to doorstep with live map updates and real-time notifications.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </Col>
            <Col lg={4} md={6} className="d-none d-lg-block" >
              <div className="features-thumb text-center">
                <img src="../images/awesome-features.png" alt="img" />
              </div>
            </Col>
            <Col lg={4} md={6} >
              <ul className="features-item">
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <MdOutlineManageHistory />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Optimized Driver Management</h4>
                      <p>Assign, monitor, and support drivers effortlessly with intelligent routing, in-app navigation, and live performance metrics.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <MdControlCamera />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Smart Inventory Control</h4>
                      <p>Stay in control with automated stock updates, low-inventory alerts, and real-time product availability across multiple locations.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="feature-box d-flex">
                    <div className="box-icon">
                      <RiDashboard3Line />
                    </div>
                    <div className="box-text align-self-center align-self-md-start">
                      <h4>Powerful Admin Dashboard</h4>
                      <p>Gain complete visibility with an easy-to-use web panel for managing orders, customers, drivers, payments, promotions, and compliance.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="faqs pt-0">
        <Container>
          <Row className=" justify-content-center">
            <Col lg={7} md={10} >
              <div className="section-title text-center">
                <h3>Frequently Asked Questions</h3>
                <p>Our FAQ section is designed to give you clear, straightforward answers so you can understand exactly how our system works and how it can support your business. </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header> How does the alcohol delivery process work?</Accordion.Header>
                  <Accordion.Body>
                    Our system allows customers to browse products, place orders, and track deliveries in real time. Once an order is placed, it’s assigned to the nearest driver, who verifies the customer's age upon delivery and completes the handover securely.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>How do you ensure legal age verification? </Accordion.Header>
                  <Accordion.Body>
                    We use built-in age-verification tools, including ID scanning, digital signatures, and in-app authentication. Drivers must confirm the customer’s age during delivery to maintain compliance with local alcohol regulations.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Can I manage multiple stores or delivery locations?</Accordion.Header>
                  <Accordion.Body>
                    Yes. The admin panel supports multi-store and multi-location management, allowing you to control inventory, track performance, and manage orders across all outlets from a unified dashboard.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>What types of payments are supported? </Accordion.Header>
                  <Accordion.Body>
                    The platform supports major credit/debit cards, mobile wallets, and optional cash-on-delivery depending on your business needs and local laws. All transactions are securely processed with encryption for maximum safety.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>How are drivers managed through the system? </Accordion.Header>
                  <Accordion.Body>
                    Drivers receive delivery assignments through the Driver App, which provides optimized routes, delivery instructions, and in-app verification tools. Admins can track driver locations, performance, and delivery statuses in real time.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
}

export default About;
