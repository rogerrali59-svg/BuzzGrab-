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
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { adminEditUser, adminUserView } from "../../../services/services";
import { constant } from "../../../utils/constant";
import { formatDOB } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

export default function AddUser() {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | ${id ? "Update User" : "Add User"} `)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handles add/edit user mutation and post-success actions.  

  const userMutation = useMutation({
    mutationFn: (body) => id && adminEditUser(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      navigate(`/admin/user-list`);
      queryClient.invalidateQueries({ queryKey: ["user-List"] });
    },
  });


  // Initializes Formik for the add user form.

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, setValues, setFieldValue, resetForm,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      gender: "",
      countryCode: "",
      mobile: "",
    },
    validationSchema: yup.object().shape({
      firstName: yup.string().required().label("Full name"),
      gender: yup.string().required().label("Gender"),

    }),
    onSubmit: async (values) => {
      let body;
      body = {
        id: id && id,
        fullName: values?.fullName?.trim(),
        gender: values?.gender,
        roleId: constant.USER_ROLE,
      }
      userMutation.mutate(body);
    },
  });

  // On edit, fetch user details and set form values.

  if (id) {
    useQuery({
      queryKey: ["user-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminUserView(id);
        setValues({
          ...values,
          fullName: resp?.data?.data?.fullName,
          mobile: resp?.data?.data?.countryCode + resp?.data?.data?.mobile,
          email: resp?.data?.data?.email,
          gender: resp?.data?.data?.gender,
          dob: formatDOB(resp?.data?.data?.dob)
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
              <Link to="/admin/user-list" className="bread_color">
                / Registers Users 
              </Link>{" "}
              / {id ? "Update User Register" : "Create User Register"}
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
                          disabled={id}
                        />
                        <span className="text-danger">{touched?.email && errors?.email}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">
                          Date of Birth
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="dob"
                          value={values?.dob}
                          disabled={id}
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

                          disabled={id}

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