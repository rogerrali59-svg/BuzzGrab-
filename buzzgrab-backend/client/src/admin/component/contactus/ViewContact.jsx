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
import moment from "moment";
import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { adminContactDetail } from "../../../services/services";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";

const ViewContact = () => {
  usePageTitle(`${constant.PROJECT_NAME} | Contact Us Details`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: viewContact } = useQuery({
    queryKey: ["viewContact", { id }],
    queryFn: async () => {
      const res = await adminContactDetail(id);
      return res.data?.data;
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link>
              <Link
                to={"/admin/contact-list"}
                className="bread_color"
              >
                / Contact Us
              </Link>
              / Contact Us Details
            </h2>
            <div className="text-end mx-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="theme-btn btn-md mb-2"
              >
                Back
              </button>
            </div>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>Fullname</th>
                          <td className="text-capitalize">{viewContact?.fullName}</td>
                        </tr>

                        <tr>
                          <th>Email</th>
                          <td>{viewContact?.email}</td>
                        </tr>

                        <tr>
                          <th>Phone number</th>
                          <td>{viewContact?.countryCode + " " + viewContact?.phoneNumber}</td>
                        </tr>

                        <tr>
                          <th>Message</th>
                          <td>{viewContact?.message}</td>
                        </tr>

                        <tr>
                          <th>Created On </th>
                          <td>
                            {moment(viewContact?.createdAt).format("LLL")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};
export default ViewContact;