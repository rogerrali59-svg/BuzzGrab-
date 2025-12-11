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
import { adminViewError } from "../../../services/services";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import Loader from "../../../Loader/Loader";

const ViewErrorLog = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | Error Logs Details`);
  const isSlider = useSlider();
  const navigate = useNavigate();

  const { data: errorDetails, isFetching } = useQuery({
    queryKey: ["errorDetails", { id }],
    queryFn: async () => {
      const res = await adminViewError(id);
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
              <Link to="/admin/dashboard" className="bread_color">
                / Error Logs
              </Link>
              / Error Logs Details
            </h2>
            <div className="text-end mx-1">
              <button
                type="button"
                className="theme-btn btn-md mb-2"
                onClick={() => navigate(-1)}
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
                          <th> Error ID</th>
                          <td>
                            <b>{errorDetails?._id}</b>
                          </td>
                        </tr>
                        <tr>
                          <th>Error Ip</th>
                          <td>{errorDetails?.ip}</td>
                        </tr>
                        <tr>
                          <th>Error code</th>
                          <td>{errorDetails?.errorCode}</td>
                        </tr>
                        <tr>
                          <th>Error Name</th>
                          <td>{errorDetails?.errorName}</td>
                        </tr>
                        <tr>
                          <th>Created On</th>
                          <td>
                            {moment(errorDetails?.createdAt).format("LLL")}
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
      {isFetching && <Loader />}
    </>
  );
};

export default ViewErrorLog;
