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
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { adminLoginActivityView } from "../../../services/services";
import { LoginActivityStatus } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";


const ViewLoginActivity = () => {
  usePageTitle(`${constant.PROJECT_NAME} | View Login Activity`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: viewLogin } = useQuery({
    queryKey: ["viewLogin", { id }],
    queryFn: async () => {
      const res = await adminLoginActivityView(id);
      return res.data?.data;
    },
  });

  return (
    <div className="mainbox">
      <Sidebar />
      <div className={isSlider ? "body-content close" : "body-content open"}>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
          <h2 className="mainhead mb-0">
            <Link to="/admin/dashboard" className="bread_color">
              Home
            </Link>
            <Link to="/admin/login-activity" className="bread_color">
              / Login Activity
            </Link>
            / Login Activity Details
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
                        <th>Id</th>
                        <td>
                          {viewLogin?._id}
                        </td>
                      </tr>
                      <tr>
                        <th>User IP</th>
                        <td>
                          {viewLogin?.userIP}
                        </td>
                      </tr>
                      <tr>
                        <th>Login</th>
                        <td>

                          {moment(viewLogin?.loginAt).format("LL")}

                        </td>
                      </tr>
                      <tr>
                        <th>Created On </th>
                        <td>

                          {moment(viewLogin?.createdAt).format("LLL")}

                        </td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>

                          {LoginActivityStatus(viewLogin?.state)}

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
  );
};

export default ViewLoginActivity;
