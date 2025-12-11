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
import { isValidPhoneNumber } from "react-phone-number-input";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { adminAddTwillio, adminEditTwillio, adminViewTwillio } from "../../../services/services";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { constant } from "../../../utils/constant";

const AddTwillio = () => {

    const { id } = useParams();
    usePageTitle(`${constant.PROJECT_NAME}| ${id ? 'Update' : 'Create'} Twillio configuration `);
    const isSlider = useSlider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (id) {
        useQuery({
            queryKey: ["twillio-detail", id],
            queryFn: async ({ queryKey }) => {
                const [_key, id] = queryKey;
                const resp = await adminViewTwillio(id);
                addTwillioFormik?.setValues({
                    ...addTwillioFormik?.values,
                    sid: resp?.data?.data?.sid,
                    token: resp?.data?.data?.token,
                    number: resp?.data?.data?.number,
                });
                return resp?.data?.data;
            },

        });
    }

    /**
      * Handles add/edit twillio mutation and post-success actions.
     */
    const { mutate } = useMutation({
        mutationFn: (body) => id ? adminEditTwillio(id, body) : adminAddTwillio(body),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            addTwillioFormik?.resetForm();
            queryClient.invalidateQueries({ queryKey: ["twillio-list"] });
            navigate(`/admin/twillio-list`);
        },
    });

    const addTwillioFormik = useFormik({
        initialValues: {
            sid: "",
            token: "",
            number: "",
        },
        validationSchema: yup.object().shape({
            sid: yup
                .string()
                .required()
                .label("Twillio account sid")
                .trim()
                .matches(/^[a-zA-Z0-9]+$/, "Twillio account sid only contain letters, numbers"),
            token: yup.string().required().label("Twillio auth token").trim().matches(/^[a-zA-Z0-9]+$/, "Twillio auth token only contain letters, numbers"),

            number: yup.string()
                .min(7, "Twillio phone number is a required field")
                .test("phone-validate", "Invalid phone number", function (value) {
                    if (value?.length > 6) {
                        return isValidPhoneNumber(String(value));
                    } else {
                        return true;
                    }
                })
                .required("Twillio phone number is a required field"),
        }),
        onSubmit: async (values) => {
            let body;
            body = {
                id: id && id,
                sid: values?.sid,
                token: values?.token,
                number: values?.number
            }
            mutate(body);
        },
    });

    return (
        <>
            <div className="mainbox">
                <Sidebar />
                <div className={isSlider ? "body-content close" : "body-content open"}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                        <h2 className="mainhead mb-0">
                            <Link to="/admin/dashboard" className="bread_color">
                                Home
                            </Link>{" "}
                            <Link
                                to={"/admin/twillio-list"}
                                className="bread_color">
                                / Twillio configuration 
                            </Link>
                            / {id ? "Update Twillio configuration " : "Create Twillio configuration "}
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
                                <Form className="common-form">
                                    <Row>
                                        <Col lg={6}>
                                            <Form.Group className="mb-4 name-sec">
                                                <Form.Label className="title">
                                                    Twillio Account Sid<span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter twillio account sid"
                                                    name="sid"
                                                    value={addTwillioFormik?.values?.sid}
                                                    onChange={addTwillioFormik?.handleChange}
                                                    onBlur={addTwillioFormik?.handleBlur}
                                                    maxLength={50}
                                                />
                                                <span className="text-danger">
                                                    {addTwillioFormik?.touched?.sid && addTwillioFormik?.errors?.sid}
                                                </span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    Twillio Auth Token <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Twillio auth token"
                                                    name="token"
                                                    value={addTwillioFormik?.values?.token}
                                                    onChange={addTwillioFormik?.handleChange}
                                                    onBlur={addTwillioFormik?.handleBlur}
                                                    maxLength={50}
                                                />
                                                <span className="text-danger">
                                                    {addTwillioFormik?.touched?.token && addTwillioFormik?.errors?.token}
                                                </span>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-4 name-sec">
                                                <Form.Label className="title">
                                                    Twillio Phone number <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <PhoneInput
                                                    defaultCountry="in"
                                                    placeholder="Enter Twillio phone number"
                                                    value={addTwillioFormik?.values?.number}
                                                    onChange={(value) => {
                                                        addTwillioFormik?.setFieldValue("number", value);
                                                    }}
                                                />
                                                <span className="text-danger">
                                                    {addTwillioFormik?.touched?.number && addTwillioFormik?.errors?.number}
                                                </span>
                                            </Form.Group>
                                        </Col>

                                        <div className="text-end mt-4">
                                            <button
                                                className="theme-btn btn-md mb-2"
                                                type="submit"
                                                onClick={addTwillioFormik?.handleSubmit}
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
};

export default AddTwillio
