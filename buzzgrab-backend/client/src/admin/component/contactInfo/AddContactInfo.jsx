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
import { adminAddContactInfo, adminUpdateContactInfo, adminViewContactInfo } from "../../../services/services";
import { emailRegex } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { constant } from "../../../utils/constant";

const AddContactInfo = () => {

    const { id } = useParams();
    usePageTitle(`${constant.PROJECT_NAME}| ${id ? 'Update' : 'Create'} Contact Directory`);
    const isSlider = useSlider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    /**
     * Handles add/edit creator mutation and post-success actions.
     */
    const addAndUpdateCreatorMutation = useMutation({
        mutationFn: (body) => id ? adminUpdateContactInfo(id, body) : adminAddContactInfo(body),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            addContactInfoFormik?.resetForm();
            navigate(`/admin/contact-info`);
            queryClient.invalidateQueries({ queryKey: ["contact-info"] });
        },
    });

    /**
     * Initializes Formik for the add creator form.
     */
    const addContactInfoFormik = useFormik({
        initialValues: {
            email: "",
            countryCode: "",
            mobile: "",
            address: "",
            facebookLink: "",
            linkedinLink: "",
            instaLink: "",
            twitterLink: ""
        },
        validationSchema: yup.object().shape({
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
            address: yup.string().required().label("Address"),
            facebookLink: yup.string()
                .matches(
                    /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
                    'Must be a valid Facebook profile URL'
                ),

            linkedinLink: yup.string()
                .matches(
                    /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/,
                    'Must be a valid LinkedIn profile or company URL'
                ),

            instaLink: yup.string()
                .matches(
                    /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/,
                    'Must be a valid Instagram profile URL'
                ),
            twitterLink: yup.string()
                .matches(
                    /^(https?:\/\/)?(www\.)?twitter\.com\/([A-Za-z0-9_]{1,15})\/?$/,
                    'Must be a valid Twitter profile URL'
                ),

        }),
        onSubmit: async (values) => {
            let number = parsePhoneNumber(String(values?.mobile));
            let body;
            body = {
                id: id && id,
                email: values?.email,
                mobile: number?.nationalNumber ?? "",
                countryCode: number?.countryCallingCode ? "+" + number?.countryCallingCode : "",
                address: values?.address ?? "",
                facebookLink: values?.facebookLink ?? "",
                linkedinLink: values?.linkedinLink ?? "",
                instaLink: values?.instaLink ?? "",
                twitterLink: values?.twitterLink
            }
            addAndUpdateCreatorMutation.mutate(body);
        },
    });

    /**
     * On edit, fetch creator details and set form values.
     */
    if (id) {
        useQuery({
            queryKey: ["creator-detail", id],
            queryFn: async ({ queryKey }) => {
                const [_key, id] = queryKey;
                const resp = await adminViewContactInfo(id);
                addContactInfoFormik?.setValues({
                    ...addContactInfoFormik?.values,
                    email: resp?.data?.data?.email,
                    mobile: resp?.data?.data?.countryCode + resp?.data?.data?.mobile,
                    address: resp?.data?.data?.address,
                    facebookLink: resp?.data?.data?.facebookLink,
                    linkedinLink: resp?.data?.data?.linkedinLink,
                    instaLink: resp?.data?.data?.instaLink,
                    twitterLink: resp?.data?.data?.twitterLink

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
                            <Link
                                to="/admin/dashboard"
                                className="bread_color">
                                Home
                            </Link>
                            <Link
                                to={"/admin/contact-info"}
                                className="bread_color">
                                / Contact Directory Management
                            </Link>
                            / {id ? "Update Contact Directory" : "Create Contact Directory"}
                        </h2>
                        <div className="text-end mx-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="theme-btn btn-md mb-2 mx-4">
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
                                                <Form.Label className="title">
                                                    Email <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    value={addContactInfoFormik?.values?.email}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={60}
                                                />
                                                <span className="text-danger">
                                                    {addContactInfoFormik?.touched?.email && addContactInfoFormik?.errors?.email}
                                                </span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    Phone Number <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <PhoneInput
                                                    defaultCountry="in"
                                                    placeholder="Enter phone number"
                                                    value={addContactInfoFormik?.values?.mobile}
                                                    onChange={(value) => {
                                                        addContactInfoFormik?.setFieldValue("mobile", value);
                                                    }}
                                                />
                                                <span className="text-danger">
                                                    {addContactInfoFormik?.touched?.mobile && addContactInfoFormik?.errors?.mobile}
                                                </span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    Address <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter address"
                                                    name="address"
                                                    value={addContactInfoFormik?.values?.address}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={100}
                                                />
                                                <span className="text-danger">{addContactInfoFormik?.touched?.address && addContactInfoFormik?.errors?.address}</span>
                                            </Form.Group>
                                        </Col>



                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Instagram URL </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter instagram"
                                                    name="instaLink"
                                                    value={addContactInfoFormik?.values?.instaLink}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={100}
                                                />
                                                <span className="text-danger">{addContactInfoFormik?.touched?.instaLink && addContactInfoFormik?.errors?.instaLink}</span>
                                            </Form.Group>
                                        </Col>


                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Facebook URL </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter facebook"
                                                    name="facebookLink"
                                                    value={addContactInfoFormik?.values?.facebookLink}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={100}
                                                />
                                                <span className="text-danger">{addContactInfoFormik?.touched?.facebookLink && addContactInfoFormik?.errors?.facebookLink}</span>
                                            </Form.Group>
                                        </Col>


                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Linkedin URL </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter linkedin"
                                                    name="linkedinLink"
                                                    value={addContactInfoFormik?.values?.linkedinLink}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={100}
                                                />
                                                <span className="text-danger">{addContactInfoFormik?.touched?.linkedinLink && addContactInfoFormik?.errors?.linkedinLink}</span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">Twitter URL </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter twiiter"
                                                    name="twitterLink"
                                                    value={addContactInfoFormik?.values?.twitterLink}
                                                    onChange={addContactInfoFormik?.handleChange}
                                                    onBlur={addContactInfoFormik?.handleBlur}
                                                    maxLength={100}
                                                />
                                                <span className="text-danger">{addContactInfoFormik?.touched?.twitterLink && addContactInfoFormik?.errors?.twitterLink}</span>
                                            </Form.Group>
                                        </Col>


                                        <div className="text-end mt-4">
                                            <button
                                                className="theme-btn btn-md mb-2"
                                                type="submit"
                                                onClick={addContactInfoFormik?.handleSubmit}>
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


export default AddContactInfo
