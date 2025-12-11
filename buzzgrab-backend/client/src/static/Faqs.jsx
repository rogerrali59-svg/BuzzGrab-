/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { constant, Paginations } from "../utils/constant";
import usePageTitle from "../utils/usePageTitle";
import "./static.scss";
import { useQuery } from "@tanstack/react-query";
import { faqList } from "../services/services";
import { FivePagination } from "../Pagination/Pagination";

function Faqs() {
  usePageTitle(`${constant.PROJECT_NAME}| FAQ`);

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

  return (
    <>
      <Header />
      <section className="breadcrum-main">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="breadcrum-text text-center">
                <h1>Frequently Asked Questions</h1>
                <ul className="d-flex align-items-centere gap-2 justify-content-center mb-0">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>/</li>
                  <li>Frequently Asked Questions</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="faqs">
        <Container>
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

export default Faqs;
