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
import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import Loader from "../../../Loader/Loader";
import { adminUpdateStoreStatus, adminViewStore } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewStore = () => {

  usePageTitle(`${constant.PROJECT_NAME} | View Store`);

  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();


  const [previewImage, setPreviewImage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { data: storeView, isFetching } = useQuery({
    queryKey: ["storeView", { id }],
    queryFn: async () => {
      const res = await adminViewStore(id);
      return res?.data?.data;
    },
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminUpdateStoreStatus(id,
        payload?.stateId,
      );
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["storeView"] });
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
              <Link to={"/admin/store-list"} className="bread_color">
                / Store Management
              </Link>
              / Store Management Details
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
                          <th>Store Logo </th>
                          <td>
                            <img
                              width="110px"
                              height="90px"
                              className="file-upload-image cursor-pointer"
                              src={storeView?.logo || "/images/static_image.jpg"}
                              alt="logo-img"
                              crossOrigin="anonymous"
                              onClick={() => {
                                if (storeView?.logo) {
                                  setPreviewImage(storeView?.logo);
                                  setShowImagePreview(true);
                                }
                              }}
                              title="Click to view larger"
                            />
                          </td>

                          <th>Store Cover Image </th>
                          <td>
                            <img
                              width="110px"
                              height="90px"
                              className="file-upload-image cursor-pointer"
                              src={storeView?.coverImg || "/images/static_image.jpg"}
                              alt="cover-img"
                              crossOrigin="anonymous"
                              onClick={() => {
                                if (storeView?.coverImg) {
                                  setPreviewImage(storeView?.coverImg);
                                  setShowImagePreview(true);
                                }
                              }}
                              title="Click to view larger"
                            />
                          </td>
                        </tr>

                        <tr>
                          <th>Store name</th>
                          <td className="text-capitalize">{storeView?.name}</td>
                          <th>Address</th>
                          <td className="text-capitalize">{storeView?.address}</td>
                        </tr>

                        <tr>
                          <th>Created On </th>
                          <td>{moment(storeView?.createdAt).format("LLL")}</td>
                          <th>Status</th>
                          <td>{CheckAdminState(storeView?.stateId)}</td>
                        </tr>

                        {
                          storeView?.subAdmin?.fullName &&
                          <>
                            <tr>
                              <th>
                                Assign to Subadmin
                              </th>
                              <td className=" cursor-pointer text-capitalize fw-bold text-primary" onClick={() => { navigate(`/admin/view-subadmin/${storeView?.subAdmin?._id}`) }}>
                                {storeView?.subAdmin?.fullName}
                              </td>
                              <th></th>
                              <td></td>
                            </tr>
                          </>
                        }
                      </tbody>
                    </Table>
                    <Table responsive bordered>
                      <tbody>

                        <tr>
                          <th>Description</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: storeView?.description,
                            }}
                          ></td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <div className="d-flex justify-content-end">
                    {storeView?.stateId === constant.INACTIVE ? (
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

      <ImagePreviewModal
        show={showImagePreview}
        handleClose={() => setShowImagePreview(false)}
        imageUrl={previewImage}
      />
      {isFetching && <Loader />}
    </>
  );
};
export default ViewStore
