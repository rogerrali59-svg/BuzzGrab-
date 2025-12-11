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
import { adminFaqView, adminStatusFAQ } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";

const ViewFaq = () => {

  usePageTitle(`${constant.PROJECT_NAME}| View Faq`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams();
  const { data: viewFaq } = useQuery({
    queryKey: ["viewFaq", { id }],
    queryFn: async () => {
      const res = await adminFaqView(id);
      return res?.data?.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminStatusFAQ(id,
        payload?.stateId,
      );
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["viewFaq"] });
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
              <Link to="/admin/faq-list" className="bread_color">
                / FAQ
              </Link>
              / FAQ Details
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
                          <th>Question</th>
                          <td className="text-capitalize">{viewFaq?.question}</td>
                        </tr>

                        <tr>
                          <th>Answer</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: viewFaq?.answer,
                            }}
                          ></td>
                        </tr>
                        <tr>
                          <th>Created On </th>
                          <td>{moment(viewFaq?.createdAt).format("LLL")}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{CheckAdminState(viewFaq?.stateId)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">

                  <div className="d-flex justify-content-end">
                    {viewFaq?.stateId === constant.INACTIVE ? (
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
export default ViewFaq;