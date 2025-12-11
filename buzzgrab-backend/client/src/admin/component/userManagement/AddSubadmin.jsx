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
import { emailRegex, formatDOB } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

export default function AddSubadmin() {

    const { id } = useParams();
    usePageTitle(`${constant.PROJECT_NAME} | ${id ? "Update Subadmin" : "Add Subadmin"} `)
    const isSlider = useSlider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Handles add/edit subadmin mutation and post-success actions.  

    const subadminMutation = useMutation({
        mutationFn: (body) => id ? adminEditUser(id, body) : adminAddUser(body),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            resetForm();
            navigate(`/admin/subadmin-list`);
            queryClient.invalidateQueries({ queryKey: ["subadmin-List"] });
        },
    });


    // Initializes Formik for the add subadmin form.

    const { values, handleBlur, handleChange, handleSubmit, touched, errors, setValues, setFieldValue, resetForm,
    } = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            countryCode: "",
            mobile: "",
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().required().label("Full Name"),

            email: yup.string().required().label("Email").matches(emailRegex, "Invalid email").trim(),

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
        }),
        onSubmit: async (values) => {
            let number = parsePhoneNumber(String(values?.mobile));
            let body;
            body = {
                id: id && id,
                roleId: constant.SUBADMIN_ROLE,
                fullName: values?.fullName?.trim(),
                email: values?.email,
                mobile: number?.nationalNumber ?? "",
                countryCode: number?.countryCallingCode ? "+" + number?.countryCallingCode : "",
            }
            subadminMutation.mutate(body);
        },
    });

    // On edit, fetch subadmin details and set form values.

    if (id) {
        useQuery({
            queryKey: ["subadmin-detail", id],
            queryFn: async ({ queryKey }) => {
                const [_key, id] = queryKey;
                const resp = await adminUserView(id);
                setValues({
                    ...values,
                    fullName: resp?.data?.data?.fullName,
                    email: resp?.data?.data?.email,
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
                            <Link to="/admin/subadmin-list" className="bread_color">
                                / Sub Admin
                            </Link>
                            / {id ? "Update Sub Admin " : "Create Sub Admin "}
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


