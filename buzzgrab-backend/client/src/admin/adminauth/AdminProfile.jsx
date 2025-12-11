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
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../hooks/useSlider";
import { login } from "../../redux/features/authSlice";
import { customerEditProfile, customerProfileView } from "../../services/services";
import { toastAlert } from "../../utils/SweetAlert";
import { constant } from "../../utils/constant";
import { emailRegex } from "../../utils/helper";
import Sidebar from "../sidebar/Sidebar";
import AdminFooter from "./AdminFooter";

// Custom hook for fetching profile
const useCustomerProfile = () => {
  return useQuery({
    queryKey: ["customerProfile"],
    queryFn: customerProfileView,
  });
};


const AdminProfile = () => {
  
  const [editButton, setEditButton] = useState(false);
  const dispatch = useDispatch();
  const isSlider = useSlider();
  const queryClient = useQueryClient();

  const { data } = useCustomerProfile();


  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: (payload) => customerEditProfile(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      dispatch(login(resp?.data?.data));
      setEditButton(false);
       queryClient.invalidateQueries(["customerProfile"]);
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      about: "",
      profileImg: "",
      newPicked: "",
      roleId: "",
      store: "",
    },
    validationSchema: yup.object().shape({
      fullName: yup.string().required().label("Full name").trim(),
      email: yup
        .string()
        .required()
        .label("Email")
        .trim()
        .matches(emailRegex, "Invalid email"),
      newPicked: yup.mixed().test(
        "type",
        "Please select jpg, png, jpeg format",
        function (value) {
          if (!value) return true;
          return (
            value.type === "image/jpg" ||
            value.type === "image/png" ||
            value.type === "image/jpeg"
          );
        }
      ),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      payload.append("fullName", values.fullName ?? "");
      payload.append("email", values.email ?? "");
      payload.append("about", values.about ?? "");
      if (values?.newPicked) {
        payload.append("profileImg", values.newPicked);
      }
      mutation.mutate(payload);
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (data?.data?.data) {
      setValues({
        fullName: data?.data?.data?.fullName || "",
        email: data?.data?.data?.email || "",
        profileImg: data?.data?.data?.profileImg || "",
        about: data?.data?.data?.about || "",
        roleId: data?.data?.data?.roleId || "",
        store: data?.data?.data?.store || {},
        newPicked: "",
      });
    }
  }, [data]);


  const profileData = data?.data?.data || {};

  return (
    <div className="mainbox">
      <Sidebar />
      <div className={isSlider ? "body-content close" : "body-content open"}>
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="mainhead mb-0">
            <Link to="/admin/dashboard" className="bread_color">
              Home
            </Link>
            / {profileData?.roleId === constant.ADMIN_ROLE ? "Admin" : "SubAdmin"} Profile
          </h2>
        </div>

        <section className="inner-wrap mt-5">
          <Container fluid className="px-0">
            <div className="custom-card">
              {editButton ? (
                <Form onSubmit={handleSubmit}>
                  <Col lg={4} className="mx-auto">
                    <div className="user-image">
                      <div className="image-uploader mt-3">
                        <img
                          src={
                            values?.newPicked
                              ? URL.createObjectURL(values.newPicked)
                              : values?.profileImg
                                ? values.profileImg
                                : "/images/default.png"
                          }
                          alt="Image"
                          crossOrigin="anonymous"
                        />
                        <label className="icon">
                          <FaCamera />
                        </label>
                        <Form.Control
                          name="profile_file"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFieldValue("newPicked", e.target.files[0])
                          }
                        />
                        <div className="text-danger">
                          {touched?.newPicked && errors?.newPicked}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="title">
                          Full Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter full name"
                          maxLength={30}
                        />
                        <span className="text-danger">
                          {touched?.fullName && errors?.fullName}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="title">
                          Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="text-danger">
                          {touched?.email && errors?.email}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="title">Bio/About Me</Form.Label>
                        <Form.Control
                          type="text"
                          rows={3}
                          name="about"
                          as="textarea"
                          maxLength={230}
                          value={values.about}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter bio/about me"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Col lg={12} className="text-lg-end text-center">
                    <button type="submit" className="theme-btn">
                      Submit
                    </button>
                  </Col>
                </Form>
              ) : (
                <div className="profile-view position-relative">
                  <div
                    className="edit-btn mt-3"
                    title="Edit profile"
                    onClick={() => setEditButton(true)}
                  >
                    <FaPencilAlt />
                  </div>

                  <Row>
                    <Col lg={5} className="mx-auto">
                      <div className="dasboard_header">
                        <div className="dasboard_header_img">
                          <img
                            crossOrigin="anonymous"
                            src={profileData.profileImg || "/images/default.png"}
                            alt="user"
                            className="img-fluid w-100"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <p className="mb-1 text-muted">Full Name</p>
                      <p className="fw-semibold text-dark">{profileData.fullName}</p>
                      <hr />
                    </Col>

                    <Col lg={6}>
                      <p className="mb-1 text-muted">Email</p>
                      <p className="fw-semibold text-dark">{profileData.email}</p>
                      <hr />
                    </Col>

                    <Col lg={6}>
                      <p className="mb-1 text-muted">Role</p>
                      <p className="fw-semibold text-dark">
                        {profileData.roleId == constant.ADMIN_ROLE ? "Admin" : "SubAdmin"}
                      </p>
                      <hr />
                    </Col>
                    {
                      profileData.store?.name &&
                      <>
                        <Col lg={6}>
                          <p className="mb-1 text-muted">Store Assigned</p>
                          <p className="fw-semibold text-dark text-capitalize">
                            {profileData.store?.name || ""}
                          </p>
                          <hr />
                        </Col>
                      </>
                    }

                    <Col lg={12}>
                      <p className="mb-1 text-muted">Bio/About us</p>
                      <p className="fw-semibold text-dark">{profileData?.about}</p>
                      <hr />
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminProfile;

