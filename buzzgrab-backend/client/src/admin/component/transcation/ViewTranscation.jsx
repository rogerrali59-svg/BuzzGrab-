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
import { adminViewTranscation } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewTranscation = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: viewTranscation } = useQuery({
    queryKey: ["viewTranscation", { id }],
    queryFn: async () => {
      const res = await adminViewTranscation(id);
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
              <Link to="/admin/transactions-list" className="bread_color">
                / Transactions
              </Link>
              /Transactions Details
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
            <h2 className="mainhead mb-0">Purchased by</h2>
            <Container fluid className="px-0">
              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>First name</th>
                          <td>{viewTranscation?.paidBy?.firstName}</td>
                        </tr>
                        <tr>
                          <th>Last name</th>
                          <td>{viewTranscation?.paidBy?.lastName}</td>
                        </tr>
                        <tr>
                          <th>Email address</th>
                          <td>{viewTranscation?.paidBy?.email}</td>
                        </tr>
                        <tr>
                          <th>Price({constant.NIGERIAN})</th>
                          <td>
                            {viewTranscation?.subscriptionId
                              ?.subscriptionType ==
                            constant.SUBSCRIPTION_TYPE_BASIC ? (
                              "Free"
                            ) : (
                              <>
                                {constant.NIGERIAN}
                                {Number(
                                  viewTranscation?.subscriptionId?.price
                                )?.toLocaleString()}
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Subscription start date</th>
                          <td>
                            {moment(
                              viewTranscation?.subscriptionStartDate
                            ).format("LLL")}
                          </td>
                        </tr>
                        <tr>
                          <th>Subscription expiry date</th>
                          <td>
                            {moment(
                              viewTranscation?.subscriptionExpireDate
                            ).format("LLL")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Container>
          </section>

          <section className="inner-wrap">
            <h2 className="mainhead mb-0">Subscription details</h2>
            <Container fluid className="px-0">
              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{viewTranscation?.subscriptionId?.name}</td>
                        </tr>
                        <tr>
                          <th>Subscription type </th>
                          <td>
                            <b>
                              {viewTranscation?.subscriptionId
                                ?.subscriptionType ===
                                constant.SUBSCRIPTION_TYPE_BASIC &&
                                "Basics subscription"}
                              {viewTranscation?.subscriptionId
                                ?.subscriptionType ===
                                constant.SUBSCRIPTION_TYPE_PREMIUM &&
                                "Premium subscription"}
                              {viewTranscation?.subscriptionId
                                ?.subscriptionType ===
                                constant.SUBSCRIPTION_TYPE_GOLD &&
                                "Gold subscription"}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <th>Duration</th>
                          <td>
                            {viewTranscation?.subscriptionId?.duration ===
                              constant.SUBSCRIPTION_DURATION_YEARLY && "Yearly"}
                            {viewTranscation?.subscriptionId?.duration ===
                              constant.SUBSCRIPTION_DURATION_MONTHLY &&
                              "Monthly"}
                            {viewTranscation?.subscriptionId?.duration ===
                              constant.SUBSCRIPTION_DURATION_QUARTERLY &&
                              "Quarterly"}
                          </td>
                        </tr>
                        <tr>
                          <th>Features</th>
                          <td>
                            {viewTranscation?.subscriptionId?.features?.map(
                              (data, index) => (
                                <>
                                  <li key={index}>{data}</li>
                                </>
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Created On </th>
                          <td>
                            {moment(
                              viewTranscation?.subscriptionId?.createdAt
                            ).format("LLL")}
                          </td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>
                            {CheckAdminState(
                              viewTranscation?.subscriptionId?.stateId
                            )}
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

export default ViewTranscation;
