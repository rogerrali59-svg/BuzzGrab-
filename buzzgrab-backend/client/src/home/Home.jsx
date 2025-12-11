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
import Accordion from 'react-bootstrap/Accordion';
import { FaApple, FaCheck, FaCloudUploadAlt, FaDatabase, FaDownload, FaGooglePlay, FaInbox, FaShieldAlt, FaStar, FaUsers } from "react-icons/fa";
import { MdControlCamera, MdLockOutline, MdOutlineManageHistory, MdOutlineVerifiedUser } from "react-icons/md";
import { RiDashboard3Line } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { Swiper, SwiperSlide } from 'swiper/react';
import "../assets/responsive.scss";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { constant, Paginations } from "../utils/constant";
import usePageTitle from "../utils/usePageTitle";
import Counter from "../component/Counter";
import "./home.scss";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { useQuery } from "@tanstack/react-query";

// import required modules
import { Link } from "react-router-dom";
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import { FaMobileScreen } from "react-icons/fa6";
import { faqList } from "../services/services";
import { FivePagination } from "../Pagination/Pagination";
function Home() {
  usePageTitle(`${constant.PROJECT_NAME}| Home`);

  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);

  const {
    data: faqListing,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["faq-list", page, constant.ACTIVE],
    queryFn: async () => {
      const resp = await faqList(page, constant.ACTIVE);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

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
  return (
    <>
      <Header />
      <section className="banner image-bg">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="banner-text">
                <h1>
                  On-Demand Alcohol Delivery Anytime, Anywhere
                </h1>
                <p >
                  Experience the easiest way to browse, order, and receive your favorite drinks. Our platform connects customers, drivers, and businesses through a seamless and secure delivery ecosystem designed for convenience and compliance.
                </p>
                <div >
                  <div className="button-store">
                    <Link to="#" className="custom-btn ">
                      <FaGooglePlay /><p>Available on<span>Google Play</span></p>
                    </Link>
                    <Link to="#" className="custom-btn ">
                      <FaApple /><p>Download on<span>App Store</span></p>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="banner-image">
                <img className="bounce-effect"
                  src="../images/banner.png" alt="img" />
              </div>
            </Col>
          </Row>
        </Container>
        <div className="wave-effect wave-anim">
          <div className="waves-shape shape-one">
            <div className="wave wave-one"></div>
          </div>
          <div className="waves-shape shape-two">
            <div className="wave wave-two"></div>
          </div>
          <div className="waves-shape shape-three">
            <div className="wave wave-three"></div>
          </div>
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

      <section id="overview" className="bg-grey">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="offset-lg-1 order-lg-last res-margin">
              <div className="section-title text-center text-lg-start">
                <h3>Featured Highlights</h3>
                <p>We combine the most essential features—real-time tracking, optimized delivery, advanced age verification, and seamless payments—to create a complete ecosystem for alcohol delivery.
                </p>
              </div>
              <div className="overview-item">
                <div className="overview-box d-flex flex-wrap">
                  <div className="icon">
                    <TbTruckDelivery />
                  </div>
                  <div className="content">
                    <h6 className=" mb-2 mt-0">Ultra-Fast Delivery</h6>
                    <p>Our optimized delivery engine ensures customers get their orders in record time with smart routing and dynamic driver allocation.</p>
                  </div>
                </div>
                <div className="overview-box d-flex flex-wrap">
                  <div className="icon ">
                    <MdOutlineVerifiedUser />
                  </div>
                  <div className="content">
                    <h6 className=" mb-2 mt-0">Compliance You Can Trust</h6>
                    <p>Built-in age verification, ID scanning, and digital signatures ensure every delivery meets local alcohol regulations.</p>
                  </div>
                </div>
                <div className="overview-box d-flex flex-wrap">
                  <div className="icon">
                    <MdLockOutline />
                  </div>
                  <div className="content">
                    <h6 className=" mb-2 mt-0">Top-Notch Security</h6>
                    <p>Encrypted payments, verified profiles, and protected customer data ensure a safe and secure shopping experience.</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5} className="order-lg-first text-sm-center" >
              <img src="../images/track-time.png" alt="img" />
            </Col>
          </Row>
          <div className="empty-100"></div>
          <Row className="align-items-center">
            <Col lg={6} className="res-margin">
              <div className="section-title text-center text-lg-start">
                <h3>Advanced System Features</h3>
                <p>From AI-powered recommendations to intelligent route optimization and automated compliance checks, our system is equipped with technology that simplifies complex operations.
                </p>
              </div>
              <ul className="overview-list">
                <li>
                  <p><FaCheck /> AI-driven suggestions based on user behavior, past orders, and trending products.</p>
                </li>
                <li>
                  <p><FaCheck /> Save time and fuel with intelligent route planning for drivers.</p>
                </li>
                <li>
                  <p><FaCheck />Timestamp, customer signature, and ID verification captured digitally.</p>
                </li>
                <li>
                  <p><FaCheck />Manage multiple outlets under one platform with centralized analytics.</p>
                </li>
                <li>
                  <p><FaCheck /> Stay compliant effortlessly with accurate tax additions per local regulations.</p>
                </li>
              </ul>
              <p className="text-center text-lg-start">
                <Link to="#" className="theme-btn">Learn More</Link>
              </p>
            </Col>
            <Col lg={5} className="offset-lg-1 text-sm-center" >
              <img src="../images/daily-schedule.png" alt="img" />
            </Col>
          </Row>
        </Container>

      </section>
      <section className="app_screenshots py-0">
        <Container>
          <Row className=" justify-content-center">
            <Col lg={7} md={10} >
              <div className="section-title text-center">
                <h3>App Screenshots</h3>
                <p>Our beautifully designed Customer App, Driver App, and Admin Panel showcase a smooth, user-friendly interface that makes ordering, delivering, and managing operations effortless.
                </p>
              </div>
            </Col>
          </Row>
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            breakpoints={{
              220: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 4,
              },
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot1.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot4.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot2.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot3.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot5.png" alt="img" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="app_image">
                <img src="../images/screenshot6.png" alt="img" />
              </div>
            </SwiperSlide>

          </Swiper>
        </Container>
      </section>

      <section className="faqs">
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
              {faqListing?.length > 0 ? (
                <Accordion>
                  {faqListing.map((data, index) => (
                    <Accordion.Item eventKey={String(index)} key={index}>
                      <Accordion.Header>{data?.question}</Accordion.Header>
                      <Accordion.Body
                        dangerouslySetInnerHTML={{
                          __html: data?.answer,
                        }}
                      ></Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <h4 className="text-center">FAQ coming soon...</h4>
              )}
            </Col>

            <FivePagination
              totalCount={meta?.totalCount}
              handelPageChange={(e) => setPage(e.selected + 1)}
            />
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
}
export default Home;