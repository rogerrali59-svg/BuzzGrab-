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
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { forgotPassword } from "../services/services";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import { emailRegex } from "../utils/helper";
import usePageTitle from "../utils/usePageTitle";
import AuthFooter from "./AuthFooter";
import "./auth.scss";

const Forgot = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Forgot Password`);
  const navigate = useNavigate();

  // Sets up Formik for forgot password form with validation and submission.
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: yup.object().shape({
        email: yup.string().required().label("Email").trim().matches(emailRegex, "Invalid Email"),
      }),
      onSubmit: (values) => {
        const body = {
          email: values.email,
        };
        mutation.mutate(body);
      },
    });

  const mutation = useMutation({
    mutationFn: (body) => forgotPassword(body),
    onSuccess: (res, body) => {
      toastAlert("success",  res.data?.message);
      navigate({
        pathname: `/verify-otp`,
        search: createSearchParams({
          email: body?.email,
          type: "forget",
        }).toString(),
      });
    },
  });

  return (
    <>
      <div className="auth-main">
      <div class="ripple-background">
    <div class="circle xxlarge shade1"></div>
    <div class="circle xlarge shade2"></div>
    <div class="circle large shade3"></div>
    <div class="circle mediun shade4"></div>
    <div class="circle small shade5"></div>
</div>
        <Container>
          <Row>
            <Col lg={6} className="mx-auto">
              <div className="auth-card text-black border-0">
                <div className="auth-logo text-center">
                  <img src="/images/logo.svg" alt="logo-img" onClick={() => { navigate("/") }} />
                  <h4 className="fw-bold mt-4 mb-5 fs-5">
                    Please Fill out your email for reset the password.
                  </h4>
                </div>
                <Form>
                  <Row>

                    <Col lg={12}>
                      <Form.Group className="mb-3 name-sec">
                        <Form.Label className="title">Email</Form.Label><span className="text-danger"> *</span>
                        <Form.Control
                          type="email"
                          placeholder="Enter email "
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <span className="text-danger">{touched.email && errors.email}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={12}>
                      <div className="sub-btn text-center mt-4">
                        <Button
                          className="auth-main-btn w-100"
                          type="button"
                          onClick={handleSubmit}
                        >
                          Send Email
                        </Button>
                      </div>
                    </Col>
                    
                    <div className="text-center footer-forgot mt-4">
                      <p className="mb-0 fw-medium">
                        Return to &nbsp;
                        <Link to="/login" className="btn-link text-decoration-underline">
                          Login
                        </Link>
                      </p>
                    </div>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <AuthFooter/>
    </>
  );
};
export default Forgot;