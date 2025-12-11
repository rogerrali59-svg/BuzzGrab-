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
import { adminCmsView, adminStatusCms } from "../../../services/services";
import { CheckAdminState, cmsType } from "../../../utils/CheckAdminState";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import usePageTitle from "../../../utils/usePageTitle";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";

const ViewCms = () => {

  usePageTitle(`${constant.PROJECT_NAME}| Cms Details`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams();
  const { data: viewCms } = useQuery({
    queryKey: ["viewCms", { id }],
    queryFn: async () => {
      const res = await adminCmsView(id);
      return res.data?.data;
    },
  });

 const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminStatusCms(id,
        payload?.stateId,
      );
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["viewCms"] });
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
              <Link to="/admin/cms-list" className="bread_color">
                / Cms
              </Link>
              / Cms Details
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
                          <th>Title</th>
                          <td className="text-capitalize">{viewCms?.title}</td>
                        </tr>
                        <tr>
                          <th>Type</th>
                          <td>{cmsType(viewCms?.typeId)}</td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: viewCms?.description,
                            }}
                          ></td>
                        </tr>
                        <tr>
                          <th>Created On </th>
                          <td>{moment(viewCms?.createdAt).format("LLL")}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{CheckAdminState(viewCms?.stateId)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  {viewCms?.stateId === constant.INACTIVE ||
                  viewCms?.stateId === constant.DELETED ? (
                    <div className="text-end mt-4 me-3">
                      <button
                        className="theme-btn btn-md mb-2"
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
                        className="theme-btn btn-md mb-2"
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
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};
export default ViewCms;