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
import { adminUpdateProductStatus, adminViewProduct } from "../../../services/services";
import { ProductStatus } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import { formatCurrency } from "../../../utils/helper";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewProduct = () => {

  usePageTitle(`${constant.PROJECT_NAME} | View Product`);

  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();


  const [previewImage, setPreviewImage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { data: productView, isFetching } = useQuery({
    queryKey: ["productView", { id }],
    queryFn: async () => {
      const res = await adminViewProduct(id);
      return res?.data?.data;
    },
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminUpdateProductStatus(id,
        payload?.stateId,
      );
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["productView"] });
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
              <Link to={"/admin/product-list"} className="bread_color">
                / Product Management
              </Link>
              / Product Management Details
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
                          <th>Product Images</th>
                          <td>
                            <div className="d-flex gap-3 flex-wrap">

                              {productView?.productImg?.length > 0 ? (
                                productView.productImg.map((img, index) => (
                                  <img
                                    key={index}
                                    width="110"
                                    height="90"
                                    className="file-upload-image cursor-pointer"
                                    src={img?.url || "/images/static_image.jpg"}
                                    alt={`product-img-${index}`}
                                    crossOrigin="anonymous"
                                    onClick={() => {
                                      setPreviewImage(img?.url);
                                      setShowImagePreview(true);
                                    }}
                                    title="Click to view larger"
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                      border: "1px solid #ddd"
                                    }}
                                  />
                                ))
                              ) : (
                                <img
                                  width="110"
                                  height="90"
                                  className="file-upload-image"
                                  src="/images/static_image.jpg"
                                  alt="product-img"
                                />
                              )}

                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table responsive bordered>
                      <tbody>

                        <tr>
                          <th>Product name</th>
                          <td className="text-capitalize">{productView?.productName}</td>
                          <th>Category name</th>
                          <td className="text-capitalize">{productView?.categoryDetails?.title}</td>
                        </tr>

                        <tr>
                          <th>Brand name</th>
                          <td className="text-capitalize">{productView?.brandDetails?.title}</td>
                          <th>Store</th>
                          <td className="text-capitalize">{productView?.storeDetails?.name}</td>

                        </tr>

                        <tr>
                          <th> ({constant.DOLLAR})M.R.P</th>
                            <td className=" fw-bold">
                            {productView?.mrp
                              ? formatCurrency(productView?.mrp)
                              : "-"}
                          </td>
                          <th>Discount %</th>
                          <td>{productView?.discount + "%"}</td>
                        </tr>

                        <tr>
                          <th> ({constant.DOLLAR})Selling Price</th>
                          <td className="text-primary fw-bold">
                            {productView?.price
                              ? formatCurrency(productView?.price)
                              : "-"}
                          </td>
                          <th>Size (ML)</th>
                          <td className="text-capitalize">{productView?.size}</td>
                        </tr>

                        <tr>
                          <th>Quantity</th>
                          <td>{productView?.quantity}</td>
                          <th>Ingredients</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: productView?.ingredients,
                            }}
                          ></td>
                        </tr>

                        <tr>
                          <th>Description</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: productView?.description,
                            }}
                          ></td>
                          {/* <th>Address</th>
                          <td className="text-capitalize">{productView?.address}</td> */}
                          <th>Created On </th>
                          <td>{moment(productView?.createdAt).format("LLL")}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{ProductStatus(productView?.stateId)}</td>
                          <th></th>
                          <td></td>
                        </tr>


                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <div className="d-flex justify-content-end">
                    {productView?.stateId === constant.PRODUCT_INACTIVE ? (
                      <div className="text-end mt-4 me-3">
                        <button
                          className="active-btn btn-md mb-2"
                          type="submit"
                          onClick={() => {
                            statusMutation.mutate({
                              stateId: constant.PRODUCT_ACTIVE,
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
                              stateId: constant.PRODUCT_INACTIVE,
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
export default ViewProduct
