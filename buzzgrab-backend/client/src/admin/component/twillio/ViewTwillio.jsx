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
import useSlider from "../../../hooks/useSlider";
import Loader from "../../../Loader/Loader";
import { adminViewTwillio } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewTwillio = () => {

  usePageTitle(`${constant.PROJECT_NAME} | View Twillio`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: twillioView, isFetching } = useQuery({
    queryKey: ["twillio-details", { id }],
    queryFn: async () => {
      const res = await adminViewTwillio(id);
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
              </Link>{" "}
              <Link
                to={"/admin/twillio-list"}
                className="bread_color">
                / Twillio configuration 
              </Link>
              / Twillio configuration  Details
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
                          <th>Twillio Account Sid</th>
                          <td>{twillioView?.sid}</td>
                        </tr>

                        <tr>
                          <th>Twillio Auth Token</th>
                          <td>{twillioView?.token}</td>
                        </tr>

                        <tr>
                          <th>Twillio Phone number</th>
                          <td>{twillioView?.number}</td>
                        </tr>

                        <tr>
                          <th>Status</th>
                          <td>{CheckAdminState(twillioView?.stateId)}</td>
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
export default ViewTwillio
