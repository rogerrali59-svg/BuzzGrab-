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
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../redux/features/authSlice";
import { setRememberedEmail, toggleRememberMe, } from "../redux/features/rememberSlice";
import { loginApi } from "../services/services";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import { emailRegex } from "../utils/helper";
import usePageTitle from "../utils/usePageTitle";
import AuthFooter from "./AuthFooter";
import "./auth.scss";

const Login = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Home`);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();

  // Sets up Formik for login form with validation and submission.
  const { values, errors, handleBlur, handleChange, touched, handleSubmit, resetForm,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      // roleId: location?.pathname == "/subadmin/login" ? constant.SUBADMIN_ROLE : constant.ADMIN_ROLE,
    },
    validationSchema: yup.object().shape({
      email: yup.string().required().label("Email").matches(emailRegex, ("Invalid email")).trim(),
      password: yup.string().required().label("Password").trim(),
    }),
    onSubmit: (values) => {
      let body = {
        email: values?.email,
        password: values?.password,
        // roleId: values?.roleId
      };
      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => loginApi(body),
    onSuccess: (resp) => {
      if (resp?.data?.data?.isVerified == 0) {
        toastAlert("success", "Your OTP is " + resp.data?.data?.otp);
        navigate({
          pathname: "/verify-otp",
          search: createSearchParams({ email: values.email }).toString(),
        });
      } else {
        dispatch(login(resp?.data?.data));
        toastAlert("success", "You Have Logged In Successfully!");
        resetForm();
      }
    },
  });

  const ischeck = useSelector((state) => state.remember.rememberMe);
  const rememberedEmail = useSelector(
    (state) => state.remember.rememberedEmail
  );

  useEffect(() => {
    if (ischeck && rememberedEmail) {
      handleChange({ target: { name: "email", value: rememberedEmail } });
    }
  }, [ischeck, rememberedEmail, handleChange]);

  const handleRememberMe = () => {
    dispatch(toggleRememberMe());
    if (!ischeck) {
      dispatch(setRememberedEmail({ email: values.email }));
    }
  };

  return (
    <>
      <div>
        <section className="auth-main p-0">
        <div class="ripple-background">
    <div class="circle xxlarge shade1"></div>
    <div class="circle xlarge shade2"></div>
    <div class="circle large shade3"></div>
    <div class="circle mediun shade4"></div>
    <div class="circle small shade5"></div>
</div>
          <Container className="p-0">
            <Row className="m-0">
              <Col lg={6} className="mx-auto">
                <div className="auth-card border-0 text-black">
                  <div className="auth-logo text-center">
                    <img src="/images/logo.svg" alt="logo-img" onClick={() => { navigate("/") }} />
                    <h4 className="fw-bold mt-4 mb-5 fs-3">Log In to {location?.pathname == "/subadmin/login" ? "SubAdmin " :"Admin "}Account</h4>
                  </div>
                  <Form>
                    <Row>
                      <Col lg={12}>
                        <Form.Group className="mb-4 name-sec">
                          <Form.Label className="title">Email</Form.Label> <span className="text-danger"> *</span>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            onKeyPress={(e) => {
                              if (e.charCode === 13) {
                                e.preventDefault();
                                handleSubmit();
                              }
                            }}
                          />
                          <span className="text-danger">{touched.email && errors.email}</span>
                        </Form.Group>
                      </Col>

                      <Col lg={12}>
                        <Form.Group className="mb-4 position-relative name-sec">
                          <Form.Label className="title">Password</Form.Label><span className="text-danger"> *</span>
                          <Form.Control
                            type={showPass ? "text" : "password"}
                            placeholder="Enter password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
                            onKeyPress={(e) => {
                              if (e.charCode === 13) {
                                e.preventDefault();
                                handleSubmit();
                              }
                            }}
                          />
                          <span className="text-danger">{touched.password && errors.password}</span>
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
                        </Form.Group>
                      </Col>
                      <Col lg={12} className="mb-3">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div>
                            <div className="d-flex align-items-center">
                              <Form.Check
                                type="checkbox"
                                id="remember"
                                checked={ischeck}
                                onChange={handleRememberMe}
                              />
                              <label className="ms-2" htmlFor="remember">
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <div className="forgot-btn">
                            <Link to="/forgot-password">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="sub-btn text-center">
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            className="theme-btn m-auto auth-main-btn outline w-100"
                          >
                            Login
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
export default Login;