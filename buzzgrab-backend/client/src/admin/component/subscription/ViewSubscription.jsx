/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { adminStatusSubscription, adminSubscriptionView } from "../../../services/services";
import { CheckAdminState, subscriptionType } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewSubscription = () => {

  usePageTitle(`${constant.PROJECT_NAME} | View Subscription`);

  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: viewSubscription } = useQuery({
    queryKey: ["viewSubscription", { id }],
    queryFn: async () => {
      const res = await adminSubscriptionView(id);
      return res.data?.data;
    },
  });

  // Status update mutation

  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminStatusSubscription(id,
        payload?.stateId,
      );
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["viewSubscription"] });
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-0 flex-wrap">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link>
              <Link to="/admin/subscription" className="bread_color">
                / Subscription
              </Link>
              / Subscription Details
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
              <div className="custom-card pt-0">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>Title</th>
                          <td>{viewSubscription?.name ?? "-"}</td>
                        </tr>

                        <tr>
                          <th>Subscription type</th>
                          <td>{subscriptionType(viewSubscription?.planType)}</td>
                        </tr>
                     
                        <tr>
                          <th>Features</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: viewSubscription?.features
                            }}
                          ></td>
                        </tr>

                        <tr>
                          <th>Price({constant.DOLLAR})</th>
                          <td>
                            {constant.DOLLAR}
                            {Number(
                              viewSubscription?.amount
                            )?.toLocaleString()}
                          </td>
                        </tr>

                        <tr>
                          <th>Created On </th>
                          <td>
                            {moment(viewSubscription?.createdAt).format("LLL")}
                          </td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{CheckAdminState(viewSubscription?.stateId)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <div className="d-flex justify-content-end">
                    {viewSubscription?.stateId === constant.INACTIVE ? (
                      <div className="text-end mt-4 me-3">
                        <button
                          className="active-btn btn-md mb-2"
                          type="submit"
                          onClick={() => {
                            statusMutation.mutate({
                              stateId: constant.ACTIVE,
                            });
                          }}
                        >
                          Active
                        </button>
                      </div>
                    ) : (
                      <div className="text-end mt-4 me-3">
                        <button
                          className="inactive-btn btn-md mb-2"
                          type="submit"
                          onClick={() => {
                            statusMutation.mutate({
                              stateId: constant.INACTIVE,
                            });
                          }}
                        >
                          In-Active
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default ViewSubscription;
