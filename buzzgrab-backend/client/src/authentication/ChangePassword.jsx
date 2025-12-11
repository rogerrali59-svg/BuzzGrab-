/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { resetPassword } from "../services/services";
import { constant } from "../utils/constant";
import { toastAlert } from "../utils/SweetAlert";
import usePageTitle from "../utils/usePageTitle";
import AuthFooter from "./AuthFooter";

const ChangePassword = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Reset Password`);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema: yup.object().shape({
        password: yup.string().required().label("Password")
          .matches(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
            "Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character."
          )
          .trim(),
        confirmPassword: yup.string().required().label("Confirm Password")
          .oneOf(
            [yup.ref("password"), null],
            "Password and confirm password must match"
          ),
      }),
      onSubmit: (values) => {
        let body = {
          email: email,
          password: values.password,
        };
        mutation.mutate(body);
      },
    });

  const mutation = useMutation({
    mutationFn: (body) => resetPassword(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      navigate(`/login`);
    },
  });
  return (
    <>
      <div>
        <section className="auth-main p-0">
          <Container className="p-0">
            <Row className="m-0">
              <Col lg={6} className="mx-auto">
                <div className="auth-card text-black border-0">
                  <div className="auth-logo text-center">
                    <img src="/images/logo.svg" alt="logo-img" onClick={() => { navigate("/") }} />
                    <h4 className="fw-bold my-5 fs-2">
                      Reset Password
                    </h4>
                  </div>
                  <Form>
                    <Row>
                      <Col xl={12}>
                        <Form.Group className="mb-4 position-relative name-sec">
                          <div className="auth-label-2">
                            <Form.Label className="title">Password</Form.Label><span className="text-danger"> *</span>
                          </div>
                          <Form.Control
                            type={showPass ? "text" : "password"}
                            placeholder="Enter password"
                            name="password"
                            className="name-sec"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                          />

                          {showPass ? (
                            <span
                              className="eye-icon"
                              onClick={() => {
                                setShowPass(false);
                              }}
                            >
                              <FaEye />
                            </span>
                          ) : (
                            <span
                              className="eye-icon"
                              onClick={() => {
                                setShowPass(true);
                              }}
                            >
                              <FaEyeSlash />
                            </span>
                          )}
                          <span className="text-danger"> {touched.password && errors.password}</span>
                        </Form.Group>
                      </Col>

                      <Col lg={12}>
                        <Form.Group className="mb-4 position-relative name-sec">
                          <Form.Label>Confirm Password</Form.Label><span className="text-danger"> *</span>
                          <Form.Control
                            type={showPassConfirm ? "text" : "password"}
                            placeholder="Enter confirm password"
                            name="confirmPassword"
                            className="name-sec"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                          />
                          {showPassConfirm ? (
                            <span
                              className="eye-icon"
                              onClick={() => {
                                setShowPassConfirm(false);
                              }}
                            >
                              <FaEye />
                            </span>
                          ) : (
                            <span
                              className="eye-icon"
                              onClick={() => {
                                setShowPassConfirm(true);
                              }}
                            >
                              <FaEyeSlash />
                            </span>
                          )}
                          <span className="text-danger">{touched.confirmPassword && errors.confirmPassword}</span>
                        </Form.Group>
                      </Col>
                      <Col lg={12}>
                        <div className="sub-btn text-center">
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            className="theme-btn m-auto w-100 auth-main-btn outline"
                          >
                            Reset Password
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <AuthFooter />
      </div>
    </>
  );
};
export default ChangePassword;