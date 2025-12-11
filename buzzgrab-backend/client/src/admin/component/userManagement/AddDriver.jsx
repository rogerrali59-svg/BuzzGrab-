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
import { Col, Container, Form, Row } from "react-bootstrap";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { adminAddUser, adminEditUser, adminUserView } from "../../../services/services";
import { constant } from "../../../utils/constant";
import { emailRegex, formatDOB, toBackendDOB } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { FaCamera, FaImage } from "react-icons/fa";

export default function AddDriver() {

    const { id } = useParams();
    usePageTitle(`${constant.PROJECT_NAME} | ${id ? "Update Driver" : "Add Driver"} `)
    const isSlider = useSlider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Handles add/edit driver mutation and post-success actions.  

    const userMutation = useMutation({
        mutationFn: (body) => id ? adminEditUser(id, body) : adminAddUser(body),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            resetForm();
            navigate(`/admin/driver-list`);
            queryClient.invalidateQueries({ queryKey: ["driver-List"] });
        },
    });


    // Initializes Formik for the add driver form.

    const { values, handleBlur, handleChange, handleSubmit, touched, errors, setValues, setFieldValue, resetForm,
    } = useFormik({
        initialValues: {
            profileImg: "",
            newPicked: "",
            fullName: "",
            email: "",
            dob: "",
            gender: "",
            countryCode: "",
            mobile: "",

            vehicleImg: "",
            vehicleImgPreview: "",

            vehicleRegistrationImg: "",
            vehicleRegistrationImgPreview: "",

            insuranceImg: "",
            insuranceImgPreview: ""
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().required().label("Full Name"),

            email: yup.string().required().label("Email").matches(emailRegex, "Invalid email").trim(),

            dob: yup
                .string()
                .required("Date of birth is required")
                .test("is-18", "Driver must be 18 or older", value => {
                    const today = new Date();
                    const dob = new Date(value);
                    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()) >= dob;
                }),


            gender: yup.string().required().label("Gender"),

            mobile: yup
                .string()
                .min(7, "Phone Number is a required field")
                .test("phone-validate", "Invalid phone number", function (value) {
                    if (value?.length > 6) {
                        return isValidPhoneNumber(String(value));
                    } else {
                        return true;
                    }
                })
                .required("Phone Number is a required field"),


            vehicleImgPreview: yup
                .mixed()
                .test("required", "Vehicle Image is a required field", function (value) {
                    return !!value || !!this.parent.vehicleImg;
                })
                .test(
                    "fileFormat",
                    "Please select jpg, png, jpeg format",
                    function (value) {
                        if (!value) return true;
                        return (
                            value &&
                            (value.type === "image/jpg" ||
                                value.type === "image/png" ||
                                value.type === "image/jpeg")
                        );
                    }
                ),

            vehicleRegistrationImgPreview: yup
                .mixed()
                .test("required", "Vehicle Registration Image is a required field", function (value) {
                    return !!value || !!this.parent.vehicleRegistrationImg;
                })
                .test(
                    "fileFormat",
                    "Please select jpg, png, jpeg format",
                    function (value) {
                        if (!value) return true;
                        return (
                            value &&
                            (value.type === "image/jpg" ||
                                value.type === "image/png" ||
                                value.type === "image/jpeg")
                        );
                    }
                ),


            insuranceImgPreview: yup
                .mixed()
                .test("required", "Insurance Image is a required field", function (value) {
                    return !!value || !!this.parent.insuranceImg;
                })
                .test(
                    "fileFormat",
                    "Please select jpg, png, jpeg format",
                    function (value) {
                        if (!value) return true;
                        return (
                            value &&
                            (value.type === "image/jpg" ||
                                value.type === "image/png" ||
                                value.type === "image/jpeg")
                        );
                    }
                ),

            newPicked: yup
                .mixed()
                .test("required", "Profile Image is a required field", function (value) {
                    return !!value || !!this.parent.profileImg;
                })
                .test(
                    "fileFormat",
                    "Please select jpg, png, jpeg format",
                    function (value) {
                        if (!value) return true;
                        return (
                            value &&
                            (value.type === "image/jpg" ||
                                value.type === "image/png" ||
                                value.type === "image/jpeg")
                        );
                    }
                ),
        }),
        onSubmit: async (values) => {
            let number = parsePhoneNumber(String(values?.mobile));
            // let body;
            // body = {
            //     id: id && id,
            //     roleId: constant.DRIVER_ROLE,
            //     fullName: values?.fullName?.trim(),
            //     email: values?.email,
            //     dob: toBackendDOB(values?.dob),
            //     gender: values?.gender,
            //     mobile: number?.nationalNumber ?? "",
            //     countryCode: number?.countryCallingCode ? "+" + number?.countryCallingCode : "",
            // }
            let payload = new FormData();
            payload.append("roleId", constant.DRIVER_ROLE ?? "");
            payload.append("fullName", values.fullName ?? "");
            payload.append("email", values.email ?? "");
            payload.append("dob", toBackendDOB(values?.dob) ?? "");
            payload.append("gender", values.gender ?? "");
            payload.append("mobile", number?.nationalNumber ?? "");
            payload.append("countryCode", number?.countryCallingCode ? "+" + number?.countryCallingCode : "");
            if (values?.vehicleImgPreview) {
                payload.append("vehicleImg", values?.vehicleImgPreview ?? "");
            }
            if (values?.vehicleRegistrationImgPreview) {
                payload.append("vehicleRegistrationImg", values?.vehicleRegistrationImgPreview ?? "");
            }
            if (values?.insuranceImgPreview) {
                payload.append("insuranceImg", values?.insuranceImgPreview ?? "");
            }
            if (values?.newPicked) {
                payload.append("profileImg", values?.newPicked ?? "");
            }
            userMutation.mutate(payload);
        },
    });

    // On edit, fetch driver details and set form values.

    if (id) {
        useQuery({
            queryKey: ["driver-detail", id],
            queryFn: async ({ queryKey }) => {
                const [_key, id] = queryKey;
                const resp = await adminUserView(id);
                setValues({
                    ...values,
                    profileImg: resp?.data?.data?.profileImg,
                    fullName: resp?.data?.data?.fullName,
                    email: resp?.data?.data?.email,
                    dob: formatDOB(resp?.data?.data?.dob),
                    gender: resp?.data?.data?.gender,
                    vehicleImg: resp?.data?.data?.vehicleImg,
                    vehicleRegistrationImg: resp?.data?.data?.vehicleRegistrationImg,
                    insuranceImg: resp?.data?.data?.insuranceImg,
                    mobile: resp?.data?.data?.countryCode + resp?.data?.data?.mobile,
                });
                return resp?.data?.data;
            },
        });
    }

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
                            <Link to="/admin/driver-list" className="bread_color">
                                / Registered Drivers
                            </Link>
                            / {id ? "Update Registered Drivers " : "Create Registered Drivers "}
                        </h2>
                        <div className="text-end mx-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="theme-btn btn-md mb-2 mx-4"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <section className="inner-wrap">
                        <Container fluid className="px-0">
                            <div className="custom-card">
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
                                <Form>
                                    <Row>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title"> Full Name<span className="text-danger"> *</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    name="fullName"
                                                    value={values?.fullName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <span className="text-danger">{touched?.fullName && errors?.fullName}</span>
                                            </Form.Group>
                                        </Col>


                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Email<span className="text-danger"> *</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Email"
                                                    name="email"
                                                    value={values?.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <span className="text-danger">{touched?.email && errors?.email}</span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    Date of Birth <span className="text-danger"> *</span>
                                                </Form.Label>

                                                <Form.Control
                                                    type="date"
                                                    name="dob"
                                                    value={values?.dob}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    max={new Date().toISOString().split("T")[0]}   // Prevent future date
                                                />


                                                <span className="text-danger">
                                                    {touched?.dob && errors?.dob}
                                                </span>
                                            </Form.Group>
                                        </Col>


                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    Gender <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <select
                                                    className="form-control fs-6"
                                                    name="gender"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values?.gender}
                                                >
                                                    <option value="">-- Select Gender --</option>
                                                    <option value={constant.FEMALE}>Female</option>
                                                    <option value={constant.MALE}>Male</option>
                                                    <option value={constant.OTHERS}>Other</option>
                                                </select>
                                                <span className="text-danger">{touched?.gender && errors?.gender}</span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Phone Number <span className="text-danger"> *</span></Form.Label>
                                                <PhoneInput
                                                    defaultCountry="in"
                                                    placeholder="Enter phone number"
                                                    value={values?.mobile}
                                                    onChange={(value) => {
                                                        setFieldValue("mobile", value);
                                                    }}

                                                />
                                                <span className="text-danger">{touched?.mobile && errors?.mobile}</span>
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Row>
                                                <Form.Label className="title">
                                                    Vehicle Image  <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Col md={12} className="mb-3">
                                                    <div className="custom_upload d-flex gap-4 mt-0">
                                                        <label className="custom-image-upload custom-image-upload-box " htmlFor="vehicle-logo">
                                                            <div className="inner-box">
                                                                <span>Upload Image Here</span>
                                                                <div className="upload-icon">
                                                                    <FaImage />
                                                                </div>
                                                                <input
                                                                    name="logo"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    id="vehicle-logo"
                                                                    className="d-none"
                                                                    onChange={(e) =>
                                                                        setFieldValue("vehicleImgPreview", e.target.files[0])
                                                                    }
                                                                />
                                                            </div>
                                                        </label>
                                                        <img
                                                            src={
                                                                values.vehicleImgPreview
                                                                    ? URL.createObjectURL(values.vehicleImgPreview)
                                                                    : values.vehicleImg || "/images/static_image.jpg"
                                                            }
                                                            width="120px"
                                                            height="90px"
                                                            alt="vehicle-img"
                                                            crossOrigin="anonymous"
                                                        />
                                                    </div>
                                                    {touched?.vehicleImgPreview &&
                                                        errors?.vehicleImgPreview && (
                                                            <span className="text-danger">
                                                                {errors?.vehicleImgPreview}
                                                            </span>
                                                        )}
                                                </Col>
                                            </Row>
                                        </Col>


                                        <Col md={12}>
                                            <Row>
                                                <Form.Label className="title">
                                                    Vehicle Registration Image <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Col md={12} className="mb-3">
                                                    <div className="custom_upload d-flex gap-4 mt-0">
                                                        <label className="custom-image-upload custom-image-upload-box " htmlFor="registration-logo">
                                                            <div className="inner-box">
                                                                <span>Upload Image Here</span>
                                                                <div className="upload-icon">
                                                                    <FaImage />
                                                                </div>
                                                                <input
                                                                    name="logo"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    id="registration-logo"
                                                                    className="d-none"
                                                                    onChange={(e) =>
                                                                        setFieldValue("vehicleRegistrationImgPreview", e.target.files[0])
                                                                    }
                                                                />
                                                            </div>
                                                        </label>
                                                        <img
                                                            src={
                                                                values.vehicleRegistrationImgPreview
                                                                    ? URL.createObjectURL(values.vehicleRegistrationImgPreview)
                                                                    : values.vehicleRegistrationImg || "/images/static_image.jpg"
                                                            }
                                                            width="120px"
                                                            height="90px"
                                                            alt="registration-img"
                                                            crossOrigin="anonymous"
                                                        />
                                                    </div>
                                                    {touched?.vehicleRegistrationImgPreview &&
                                                        errors?.vehicleRegistrationImgPreview && (
                                                            <span className="text-danger">
                                                                {errors?.vehicleRegistrationImgPreview}
                                                            </span>
                                                        )}
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col md={12}>
                                            <Row>
                                                <Form.Label className="title">
                                                    Insurance Image <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Col md={12} className="mb-3">
                                                    <div className="custom_upload d-flex gap-4 mt-0">
                                                        <label className="custom-image-upload custom-image-upload-box " htmlFor="insurance-logo">
                                                            <div className="inner-box">
                                                                <span>Upload Image Here</span>
                                                                <div className="upload-icon">
                                                                    <FaImage />
                                                                </div>
                                                                <input
                                                                    name="logo"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    id="insurance-logo"
                                                                    className="d-none"
                                                                    onChange={(e) =>
                                                                        setFieldValue("insuranceImgPreview", e.target.files[0])
                                                                    }
                                                                />
                                                            </div>
                                                        </label>
                                                        <img
                                                            src={
                                                                values.insuranceImgPreview
                                                                    ? URL.createObjectURL(values.insuranceImgPreview)
                                                                    : values.insuranceImg || "/images/static_image.jpg"
                                                            }
                                                            width="120px"
                                                            height="90px"
                                                            alt="insurance-img"
                                                            crossOrigin="anonymous"
                                                        />
                                                    </div>
                                                    {touched?.insuranceImgPreview &&
                                                        errors?.insuranceImgPreview && (
                                                            <span className="text-danger">
                                                                {errors?.insuranceImgPreview}
                                                            </span>
                                                        )}
                                                </Col>
                                            </Row>
                                        </Col>



                                        <div className="text-end mt-4">
                                            <button
                                                className="theme-btn btn-md mb-2"
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Row>
                                </Form>
                            </div>
                        </Container>
                    </section>
                </div>
                <AdminFooter />
            </div>
        </>
    );
}

