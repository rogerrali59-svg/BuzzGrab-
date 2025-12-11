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
import { adminApproveBackImg, adminApproveFrontImg, adminApproveLiveImg, adminUserUpdate, adminUserView } from "../../../services/services";
import { CheckAdminState, GenderType } from "../../../utils/CheckAdminState";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewUser = () => {

  usePageTitle(`${constant.PROJECT_NAME} | "User Details`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [reasonModal, setReasonModal] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);


  // View user details
  const { data: userDetails, isFetching } = useQuery({
    queryKey: ["userDetails", { id }],
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
        toastAlert("success", "User account has been active successfully")
      }
      else {
        toastAlert("success", "User account has been in-ctive successfully")
      }
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      setReasonModal(false);
      resetForm();
    },
  });


  // Handle button click for activation/deactivation
  const handleButtonClick = () => {
    if (userDetails?.stateId === constant.ACTIVE) {
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


  const handleFrontVerification = async (status) => {
    try {
      const resp = await adminApproveFrontImg(userDetails?._id, status);
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["userDetails", { id }] });
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleBackVerification = async (status) => {
    try {
      const resp = await adminApproveBackImg(userDetails?._id, status);
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["userDetails", { id }] });
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleLiveVerification = async (status) => {
    try {
      const resp = await adminApproveLiveImg(userDetails?._id, status);
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["userDetails", { id }] });
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Something went wrong");
    }
  };


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
              <Link to="/admin/user-list" className="bread_color">
                / Registers Users 
              </Link>
              / Registers User Details
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
                        src={userDetails?.profileImg || "/images/default.png"}
                        alt="profile-img"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </Col>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>Full name</th>
                          <td className="text-capitalize">{userDetails?.fullName}</td>
                          <th>Gender</th>
                          <td >{GenderType(userDetails?.gender)}</td>
                        </tr>

                        <tr>
                          <th>Email</th>
                          <td>{userDetails?.email}</td>
                          <th>Phone number</th>
                          <td>{userDetails?.countryCode && userDetails?.mobile && userDetails?.countryCode + " " + userDetails?.mobile}</td>
                        </tr>

                        <tr>
                          <th>DOB</th>
                          <td>{userDetails?.dob}</td>
                          <th>Profile Image Preview</th>
                          <td
                            onClick={() => {
                              if (userDetails?.profileImg) {
                                setPreviewImage(userDetails?.profileImg);
                                setShowImagePreview(true);
                              }
                            }}
                          >
                            <span className="custom-badge-pink cursor-pointer">
                              Click here to preview image
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <th>Created On </th>
                          <td>{moment(userDetails?.createdAt).format("LLL")}</td>
                          <th>Status</th>
                          <td>{CheckAdminState(userDetails?.stateId)}</td>
                        </tr>

                        {
                          userDetails?.reason &&
                          <>
                            <tr>
                              <th>
                                {userDetails?.stateId === constant.INACTIVE
                                  ? "Reason for In-Active user account"
                                  : "Reason for Delete user account"}
                              </th>
                              <td className="text-capitalize text-danger fw-bold">
                                {userDetails?.reason}
                              </td>

                              <th></th>
                              <td></td>
                            </tr>
                          </>
                        }
                        <tr>

                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <div className="text-end mt-4 me-3">
                    <button
                      className={`${userDetails?.stateId === constant.INACTIVE ||
                        userDetails?.stateId === constant.DELETED
                        ? "active-btn"
                        : "inactive-btn"
                        } active-btn btn-md mb-2`}
                      type="button"
                      onClick={handleButtonClick}
                    >
                      {userDetails?.stateId === constant.INACTIVE ||
                        userDetails?.stateId === constant.DELETED
                        ? "Active"
                        : "In-Active"}
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </section>


          {
            userDetails?.frontImg &&

            <section className="inner-wrap">
              <Container fluid className="px-0">
                <div className="custom-card">

                  <Row>
                    <h4>Front Document</h4>
                    <Col xl={12}>
                      <Table responsive bordered>
                        <tbody>

                          <tr>
                            <th>Front ID Image</th>
                            <td >
                              <img
                                width="110px"
                                height="90px"
                                className="file-upload-image cursor-pointer"
                                src={userDetails?.frontImg || "/images/static_image.jpg"}
                                alt="frontImg-img"
                                crossOrigin="anonymous"
                                onClick={() => {
                                  if (userDetails?.frontImg) {
                                    setPreviewImage(userDetails?.frontImg);
                                    setShowImagePreview(true);
                                  }
                                }}
                                title="Click to view larger"
                              />
                            </td>
                          </tr>

                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    {
                      userDetails?.isFrontImgVerified == constant.DOC_VERIFY_APPROVED ? "" :

                        <div className="text-end mt-4 me-3">
                          <button
                            className="active-btn btn-md mb-2"
                            type="button"
                            onClick={() => handleFrontVerification(constant.DOC_VERIFY_APPROVED)}
                          >
                            Approve
                          </button>
                        </div>
                    }
                    {userDetails?.isFrontImgVerified == constant.DOC_VERIFY_REJECTED ? "" :

                      <div className="text-end mt-4 me-3">
                        <button
                          className="rejected-btn btn-md mb-2"
                          type="button"
                          onClick={() => handleFrontVerification(constant.DOC_VERIFY_REJECTED)}
                        >
                          Reject
                        </button>
                      </div>
                    }



                  </div>
                </div>
              </Container>
            </section>
          }


          {
            userDetails?.backImg &&

            <section className="inner-wrap">
              <Container fluid className="px-0">
                <div className="custom-card">

                  <Row>
                    <h4>Back Document</h4>
                    <Col xl={12}>
                      <Table responsive bordered>
                        <tbody>
                          <tr>
                            <th>Back ID Image</th>
                            <td> <img
                              width="110px"
                              height="90px"
                              className="file-upload-image cursor-pointer"
                              src={userDetails?.backImg || "/images/static_image.jpg"}
                              alt="back-img"
                              crossOrigin="anonymous"
                              onClick={() => {
                                if (userDetails?.backImg) {
                                  setPreviewImage(userDetails?.backImg);
                                  setShowImagePreview(true);
                                }
                              }}
                              title="Click to view larger"
                            /></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    {
                      userDetails?.isBackImgVerified == constant.DOC_VERIFY_APPROVED ? "" :
                        <div className="text-end mt-4 me-3">
                          <button
                            className="active-btn btn-md mb-2"
                            type="button"
                            onClick={() => handleBackVerification(constant.DOC_VERIFY_APPROVED)}
                          >
                            Approve
                          </button>
                        </div>

                    }

                    {userDetails?.isBackImgVerified == constant.DOC_VERIFY_REJECTED ? "" :

                      <div className="text-end mt-4 me-3">
                        <button
                          className="rejected-btn btn-md mb-2"
                          type="button"
                          onClick={() => handleBackVerification(constant.DOC_VERIFY_REJECTED)}
                        >
                          Reject
                        </button>
                      </div>
                    }


                  </div>
                </div>
              </Container>
            </section>
          }


          {
            userDetails?.liveSelfyImg &&

            <section className="inner-wrap">
              <Container fluid className="px-0">
                <div className="custom-card">

                  <Row>
                    <h4>Live Selfie Verification</h4>
                    <Col xl={12}>
                      <Table responsive bordered>
                        <tbody>

                          <tr>
                            <th>Live Selfie Photo</th>
                            <td> <img
                              width="110px"
                              height="90px"
                              className="file-upload-image cursor-pointer"
                              src={userDetails?.liveSelfyImg || "/images/static_image.jpg"}
                              alt="live-img"
                              crossOrigin="anonymous"

                              onClick={() => {
                                if (userDetails?.liveSelfyImg) {
                                  setPreviewImage(userDetails?.liveSelfyImg);
                                  setShowImagePreview(true);
                                }
                              }}
                              title="Click to view larger"
                            /></td>
                          </tr>


                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    {
                      userDetails?.isLiveSelfyImgVerified == constant.DOC_VERIFY_APPROVED ? "" :

                        <div className="text-end mt-4 me-3">
                          <button
                            className="active-btn btn-md mb-2"
                            type="button"
                            onClick={() => handleLiveVerification(constant.DOC_VERIFY_APPROVED)}
                          >
                            Approve
                          </button>
                        </div>
                    }

                    {
                      userDetails?.isLiveSelfyImgVerified == constant.DOC_VERIFY_REJECTED ? "" :

                        <div className="text-end mt-4 me-3">
                          <button
                            className="rejected-btn btn-md mb-2"
                            type="button"
                            onClick={() => handleLiveVerification(constant.DOC_VERIFY_REJECTED)}
                          >
                            Reject
                          </button>
                        </div>
                    }

                  </div>
                </div>
              </Container>
            </section>
          }

        </div>
        <AdminFooter />
      </div>

      <ImagePreviewModal
        show={showImagePreview}
        handleClose={() => setShowImagePreview(false)}
        imageUrl={previewImage}
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
            <Modal.Title>Provide Reason for In-Active User Account</Modal.Title>
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
      {isFetching && <Loader />
      }
    </>
  );
};
export default ViewUser;