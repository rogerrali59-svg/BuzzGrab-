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
import { CheckAdminState, GenderType } from "../../../utils/CheckAdminState";
import ImagePreviewModal from "../../../utils/ImagePreviewModal";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ViewDriver = () => {

  usePageTitle(`${constant.PROJECT_NAME} | "Driver Details`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [reasonModal, setReasonModal] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);


  // View user details
  const { data: driverDetails, isFetching } = useQuery({
    queryKey: ["driverDetails", { id }],
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
        toastAlert("success", "Driver account has been active successfully")
      }
      else {
        toastAlert("success", "Driver account has been in-ctive successfully")
      }
      queryClient.invalidateQueries({ queryKey: ["driverDetails"] });
      setReasonModal(false);
      resetForm();
    },
  });


  // Handle button click for activation/deactivation
  const handleButtonClick = () => {
    if (driverDetails?.stateId === constant.ACTIVE) {
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
              <Link to="/admin/driver-list" className="bread_color">
                / Registered Drivers
              </Link>
              / Registered Drivers Details
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
                        src={driverDetails?.profileImg || "/images/default.png"}
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
                          <td className="text-capitalize">{driverDetails?.fullName}</td>
                          <th>Email</th>
                          <td>{driverDetails?.email}</td>
                        </tr>

                        <tr>
                          <th>Phone number</th>
                          <td>{driverDetails?.countryCode && driverDetails?.mobile && driverDetails?.countryCode + " " + driverDetails?.mobile}</td>
                          <th>DOB</th>
                          <td>{driverDetails?.dob}</td>
                        </tr>

                        <tr>
                          <th>Gender</th>
                          <td >{GenderType(driverDetails?.gender)}</td>
                          <th>Profile Image Preview</th>
                          <td onClick={() => {
                            if (driverDetails?.profileImg) {
                              setPreviewImage(driverDetails?.profileImg);
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
                          <td>{moment(driverDetails?.createdAt).format("LLL")}</td>
                          <th>Status</th>
                          <td>{CheckAdminState(driverDetails?.stateId)}</td>
                        </tr>

                        {
                          driverDetails?.reason &&
                          <>
                            <tr>
                              <th>
                                {driverDetails?.stateId === constant.INACTIVE
                                  ? "Reason for In-Active drivre account"
                                  : "Reason for Delete drivre account"}
                              </th>
                              <td className="text-capitalize text-danger fw-bold">
                                {driverDetails?.reason}
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

                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th> Vehicle Image </th>
                          <td> <img
                            width="110px"
                            height="90px"
                            className="file-upload-image cursor-pointer"
                            src={driverDetails?.vehicleImg || "/images/static_image.jpg"}
                            alt="back-img"
                            crossOrigin="anonymous"
                            onClick={() => {
                              if (driverDetails?.vehicleImg) {
                                setPreviewImage(driverDetails?.vehicleImg);
                                setShowImagePreview(true);
                              }
                            }}
                            title="Click to view larger"
                          /></td>
                        </tr>

                        <tr>
                          <th> Vehicle Registration Image</th>
                          <td> <img
                            width="110px"
                            height="90px"
                            className="file-upload-image cursor-pointer"
                            src={driverDetails?.vehicleRegistrationImg || "/images/static_image.jpg"}
                            alt="back-img"
                            crossOrigin="anonymous"
                            onClick={() => {
                              if (driverDetails?.vehicleRegistrationImg) {
                                setPreviewImage(driverDetails?.vehicleRegistrationImg);
                                setShowImagePreview(true);
                              }
                            }}
                            title="Click to view larger"
                          /></td>
                        </tr>

                        <tr>
                          <th>Insurance Image</th>
                          <td> <img
                            width="110px"
                            height="90px"
                            className="file-upload-image cursor-pointer"
                            src={driverDetails?.insuranceImg || "/images/static_image.jpg"}
                            alt="back-img"
                            crossOrigin="anonymous"
                            onClick={() => {
                              if (driverDetails?.insuranceImg) {
                                setPreviewImage(driverDetails?.insuranceImg);
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
                  <div className="text-end mt-4 me-3">
                    <button
                      className={`${driverDetails?.stateId === constant.INACTIVE ||
                        driverDetails?.stateId === constant.DELETED
                        ? "active-btn"
                        : "inactive-btn"
                        } active-btn btn-md mb-2`}
                      type="button"
                      onClick={handleButtonClick}
                    >
                      {driverDetails?.stateId === constant.INACTIVE ||
                        driverDetails?.stateId === constant.DELETED
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
            <Modal.Title>Provide Reason for In-Active Driver Account</Modal.Title>
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

export default ViewDriver
