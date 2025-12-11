/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { staticPages } from "../services/services";
import { constant } from "../utils/constant";
import "./static.scss";
import DataNotFound from "../Loader/DataNotFound";

function Privacy() {
  const { data: privacy } = useQuery({
    queryKey: ["privacy"],
    queryFn: async () => {
      const resp = await staticPages(constant.PRIVACY_POLICY);
      return resp?.data?.data ?? "";
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
                <h1>Privacy Policy</h1>
                <ul className="d-flex align-items-centere gap-2 justify-content-center mb-0">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>/</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="privacy-main">
        <Container>
          <Row>
            {privacy?.title ? (
              <Col lg={12}>
                <div className="policy-text">
                  <h2 className="pb-3">{privacy?.title}</h2>
                  <ul className="policy-txt">
                    <li
                      dangerouslySetInnerHTML={{
                        __html: privacy?.description,
                      }}
                    ></li>
                  </ul>
                </div>
              </Col>
            ) : (
              <div className="text-center"> <DataNotFound/></div>
            )}
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default Privacy;
