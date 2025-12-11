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
import OTPInput from "react-otp-input";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { forgotPassword, verifyOTP } from "../services/services";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import usePageTitle from "../utils/usePageTitle";
import AuthFooter from "./AuthFooter";

const VerifyOTP = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Verify OTP`);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams?.get("type");

  const { values, errors, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object().shape({
      otp: yup.string().required().label("OTP").length(4),
    }),
    onSubmit: (values) => {
      let body = {
        otp: values?.otp,
        email: email,
      };
      verifyOTPMutation(body);
    },
  });

  const { mutate: verifyOTPMutation } = useMutation({
    mutationFn: (body) => verifyOTP(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      if (type == "forget") {
        navigate({
          pathname: "/change-password",
          search: createSearchParams({ email: email }).toString(),
        });
      } else {
        navigate(`/login`);
      }
    },
  });

  const { mutate: resendOTPMutation } = useMutation({
    mutationFn: (body) => forgotPassword(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      setNewIsActive(true);
    }
  });

  const [newTimer, setNewTimer] = useState(60);
  const [newIsActive, setNewIsActive] = useState(false);

  const handleClick = () => {
    resendOTPMutation({
      email: email?.trim(),
    });
    toastAlert("success");
    resetForm();
    setNewIsActive(true);
  };

  useEffect(() => {
    let intervalId;
    if (newIsActive) {
      intervalId = setInterval(() => {
        setNewTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [newIsActive]);

  useEffect(() => {
    if (newTimer === 0) {
      setNewIsActive(false);
      setNewTimer(60);
    }
  }, [newTimer]);

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData("Text");
    const otp = pastedValue.slice(0, 4);
    setFieldValue("otp", otp);
    e.preventDefault();
  };

  return (
    <>
      <section className="auth-main p-0">
        <Container>
          <Row>
            <Col lg={6} className="mx-auto">
              <div className="auth-card text-black border-0">
                <div className="auth-logo text-center">
                  <img src="/images/logo.svg" alt="logo-img" onClick={() => { navigate("/") }} />
                  <h4 className="fw-bold my-5 fs-2">
                    Verify OTP
                  </h4>
                </div>
                <Form>
                  <Row >
                    <Col lg={12}>
                      <Form.Group className="mb-4 name-sec">
                        <OTPInput
                          value={values?.otp}
                          onChange={(e) => setFieldValue("otp", e)}
                          numInputs={4}
                          renderSeparator={<span>-</span>}
                          inputType="text"
                          renderInput={(props) => (
                            <input
                              {...props}
                              onPaste={handlePaste}
                            />
                          )}
                          containerStyle={"otp-input"}
                        />
                        <p className="text-danger mt-3 text-center mb-0">{errors.otp}</p>
                      </Form.Group>
                    </Col>

                    <div className="resend-btn d-flex align-items-center justify-content-center flex-column gap-3">
                      {newIsActive ? (
                        <span className="fs-5 fw-bold mt-4 mb-3 text-dark">
                          Resend OTP in {newTimer} seconds
                        </span>
                      ) : (
                        <span
                          onClick={handleClick}
                          className="fs-5 fw-bold mt-4 mb-3 text-dark"
                          style={{ cursor: "pointer" }}
                        >
                          Resend OTP
                        </span>
                      )}
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="theme-btn auth-main-btn w-100 outline"
                      >
                        Verify
                      </Button>
                    </div>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <AuthFooter />
    </>
  );
};

export default VerifyOTP;
