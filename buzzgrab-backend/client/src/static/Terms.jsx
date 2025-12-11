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
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { staticPages } from "../services/services";
import { constant } from "../utils/constant";
import usePageTitle from "../utils/usePageTitle";
import "./static.scss";
import DataNotFound from "../Loader/DataNotFound";

const Terms = () => {

  usePageTitle(` ${constant.PROJECT_NAME} | Terms & Conditions`);

  const { data: terms } = useQuery({
    queryKey: ["terms"],
    queryFn: async () => {
      const resp = await staticPages(constant.TERM_CONDITION);
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
                <h1>Terms & Conditions</h1>
                <ul className="d-flex align-items-centere gap-2 justify-content-center mb-0">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>/</li>
                  <li>Terms & Conditions</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="privacy-main">
        <Container>
          <Row>
            {terms?.title ? (
              <Col lg={12}>
                <div className="policy-text">
                  <h2 className="pb-3">{terms?.title}</h2>
                  <ul className="policy-txt">
                    <li
                      dangerouslySetInnerHTML={{
                        __html: terms?.description,
                      }}
                    ></li>
                  </ul>
                </div>
              </Col>
            ) : (
              <div className="text-center"> <DataNotFound /></div>
            )}
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};
export default Terms;