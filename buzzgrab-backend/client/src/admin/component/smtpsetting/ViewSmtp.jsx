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
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDetails from "../../../hooks/useDetails";
import useSlider from "../../../hooks/useSlider";
import Loader from "../../../Loader/Loader";
import { adminViewSmtp } from "../../../services/services";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { constant } from "../../../utils/constant";

const ViewSmtp = () => {

  usePageTitle(`${constant.PROJECT_NAME}| View SMTP`);

  let detail = useDetails()
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: smtpView, isFetching } = useQuery({
    queryKey: ["smtp-details", { id }],
    queryFn: async () => {
      const res = await adminViewSmtp(id);
      return res?.data?.data;
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link>
              <Link to={ "/admin/smtp-list"} className="bread_color">
                / SMTP
              </Link>
              / SMTP Detail
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
                          <th>SMTP Email</th>
                          <td>{smtpView?.email}</td>
                        </tr>
                        <tr>
                          <th>SMTP Password</th>
                          <td>{smtpView?.password}</td>
                        </tr>

                        <tr>
                          <th>SMTP Port</th>
                          <td>{smtpView?.port}</td>
                        </tr>

                        <tr>
                          <th>SMTP Host</th>
                          <td>{smtpView?.host}</td>
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
        {isFetching && <Loader />}
      </div>
    </>
  );
};

export default ViewSmtp;
