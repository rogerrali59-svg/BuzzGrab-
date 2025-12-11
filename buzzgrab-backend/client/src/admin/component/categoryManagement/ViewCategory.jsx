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
import { adminCategoryView, adminStatusCategory } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewCategory = () => {

    usePageTitle(`${constant.PROJECT_NAME} | View Category`);

    const isSlider = useSlider();
    const navigate = useNavigate();
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const queryClient = useQueryClient();

    const { data: categoryView, isFetching } = useQuery({
        queryKey: ["categoryView", { id }],
        queryFn: async () => {
            const res = await adminCategoryView(id);
            return res?.data?.data;
        },
    });

    // Status update mutation
    const statusMutation = useMutation({
        mutationFn: (payload) => {
            return adminStatusCategory(id,
                payload?.stateId,
            );
        },
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["categoryView"] });
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
                            <Link to={"/admin/category-list"} className="bread_color">
                                / Category Management
                            </Link>
                            / Category Management Details
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
                                                    <th>Catgeory Image</th>
                                                    <td>
                                                        <img
                                                            width="110px"
                                                            height="70px"
                                                            className="file-upload-image"
                                                            src={categoryView?.image || "/images/static_image.jpg"}
                                                            alt="category-img"
                                                            crossOrigin="anonymous"
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Catgeory Image Preview</th>
                                                    <td onClick={handleShow}
                                                        style={{ cursor: "pointer" }}>
                                                        <span className="custom-badge-pink">
                                                            Click here to preview image
                                                        </span>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Catgeory Title</th>
                                                    <td className="text-capitalize">{categoryView?.title}</td>
                                                </tr>

                                                <tr>
                                                    <th>Description</th>
                                                    <td
                                                        dangerouslySetInnerHTML={{
                                                            __html: categoryView?.description,
                                                        }}
                                                    ></td>
                                                </tr>
                                                <tr>
                                                    <th>Created On </th>
                                                    <td>{moment(categoryView?.createdAt).format("LLL")}</td>
                                                </tr>

                                                <tr>
                                                    <th>Status</th>
                                                    <td>{CheckAdminState(categoryView?.stateId)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex justify-content-end">
                                        {categoryView?.stateId === constant.INACTIVE ? (
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
            <ImagePreviewModal show={show} handleClose={handleClose} imageUrl={categoryView?.image} />

            {isFetching && <Loader />}
        </>
    );
};
export default ViewCategory;