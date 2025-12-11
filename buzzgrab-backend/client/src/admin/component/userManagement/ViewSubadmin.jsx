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
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Loader from "../../../Loader/Loader";
import useSlider from "../../../hooks/useSlider";
import { adminUserUpdate, adminUserView } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewSubadmin = () => {

  usePageTitle(`${constant.PROJECT_NAME} | "Sub Admin Details`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const handleClosePreview = () => setShow(false);
  const handleShowPreview = () => setShow(true);
  // View user details
  const { data: subadminDetails, isFetching } = useQuery({
    queryKey: ["subadminDetails", { id }],
    queryFn: async () => {
      const res = await adminUserView(id);
      return res.data?.data;
    },
  });

  // Mutation for updating user state
  const editMutate = useMutation({
    mutationFn: ({ id, body }) => adminUserUpdate(id, body),
    onSuccess: (resp) => {
      if (resp?.data?.data?.stateId == constant.ACTIVE) {
        toastAlert("success", "SubAdmin account has been active successfully")
      }
      else {
        toastAlert("success", "SubAdmin account has been in-ctive successfully")
      }
      queryClient.invalidateQueries({ queryKey: ["subadminDetails"] });
      setReasonModal(false);
      resetForm();
    },
  });


  // Handle button click for activation/deactivation
  const handleButtonClick = () => {
    if (subadminDetails?.stateId === constant.ACTIVE) {
      setReasonModal(true);
    } else {
      editMutate.mutate({
        id: id,
        body: { reason: "Activated", stateId: constant.ACTIVE },
      });
    }
  };

  // Yup Validation Schema
  const validationSchema = yup.object().shape({
    reason: yup
      .string()
      .trim()
      .required("Reason is a required field")
      .max(60, "Reason must be 60 characters or fewer"),
  });

  // Formik setup for modal
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, isSubmitting, setSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      reason: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await editMutate.mutateAsync({
          id: id,
          body: {
            stateId: constant.INACTIVE,
            reason: values.reason.trim(),
          },
        });
        setReasonModal(false);
        resetForm();
      } catch (error) {
        toastAlert("error", "Something went wrong");
      } finally {
        setSubmitting(false);
      }
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
              <Link to="/admin/subadmin-list" className="bread_color">
                / Sub Admin
              </Link>
              / Sub Admin Details
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
                  <Col xl={4} className="mx-auto my-2">
                    <div className="admin-profile view-image">
                      <img
                        width="110px"
                        height="70px"
                        className="file-upload-image"
                        src={subadminDetails?.profileImg || "/images/default.png"}
                        alt="profile-img"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </Col>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>Full Name</th>
                          <td className="text-capitalize">{subadminDetails?.fullName}</td>
                          <th>Email</th>
                          <td>{subadminDetails?.email}</td>
                        </tr>

                        <tr>
                          <th>Phone number</th>
                          <td>{subadminDetails?.countryCode && subadminDetails?.mobile && subadminDetails?.countryCode + " " + subadminDetails?.mobile}</td>
                          <th>Created On </th>
                          <td>{moment(subadminDetails?.createdAt).format("LLL")}</td>
                        </tr>

                        <tr>
                          <th>Status</th>
                          <td>{CheckAdminState(subadminDetails?.stateId)}</td>
                          {
                            subadminDetails?.store?.name ?
                              <>
                                <th>Assign Store</th>
                                <td className=" cursor-pointer text-capitalize text-primary fw-bold" onClick={() => { navigate(`/admin/view-store/${subadminDetails?.store?._id}`) }}>{subadminDetails?.store?.name}</td>
                              </>
                              :
                              <>
                                <th></th>
                                <td></td>
                              </>
                          }
                        </tr>
                        {

                          subadminDetails?.reason &&
                          <>
                            <tr>
                              <th>
                                {subadminDetails?.stateId === constant.INACTIVE
                                  ? "Reason for In-Active subadmin account"
                                  : "Reason for Delete subadmin account"}
                              </th>
                              <td className="text-capitalize text-danger fw-bold ">
                                {subadminDetails?.reason}
                              </td>
                              <th></th>
                              <td></td>
                            </tr>
                          </>
                        }

                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <div className="text-end mt-4 me-3">
                    <button
                      className={`${subadminDetails?.stateId === constant.INACTIVE ||
                        subadminDetails?.stateId === constant.DELETED
                        ? "active-btn"
                        : "inactive-btn"
                        } active-btn btn-md mb-2`}
                      type="button"
                      onClick={handleButtonClick}
                    >
                      {subadminDetails?.stateId === constant.INACTIVE ||
                        subadminDetails?.stateId === constant.DELETED
                        ? "Active"
                        : "In-Active"}
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div >

      <ImagePreviewModal
        show={show}
        handleClose={handleClosePreview}
        imageUrl={subadminDetails?.profileImg}
      />


      <Modal
        show={reasonModal}
        onHide={() => {
          setReasonModal(false);
          resetForm();
        }}
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Provide Reason for In-Active SubAdmin Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="title">Reason for this action
                <span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                placeholder="Enter your reason"
                value={values?.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={60}
              />
              <span className="text-danger">{touched?.reason && errors?.reason}</span>

            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="warning"
              type="submit"
              className="text-white btn btn-md mb-2 mx-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "In-Active"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >
      {
        isFetching && <Loader />
      }
    </>
  );
};
export default ViewSubadmin
