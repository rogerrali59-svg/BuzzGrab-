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
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useDetails from "../../../hooks/useDetails";
import useSlider from "../../../hooks/useSlider";
import { adminAddSmtp, adminEditSmtp, adminViewSmtp } from "../../../services/services";
import { emailRegex } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { constant } from "../../../utils/constant";

const AddSmtp = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | ${id ? 'Update' : 'Create'} SMTP`);


  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  let details = useDetails();


  /**
   * On edit, fetch smtp details and set form values.
   */

  if (id) {
    useQuery({
      queryKey: ["smtp-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminViewSmtp(id);
        addSmtpFormik?.setValues({
          ...addSmtpFormik?.values,
          email: resp?.data?.data?.email,
          password: resp?.data?.data?.password,
          host: resp?.data?.data?.host,
          port: resp?.data?.data?.port,
        });
        return resp?.data?.data;
      },
    });
  }

  /**
    * Handles add/edit cms mutation and post-success actions.
   */
  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminEditSmtp(id, body) : adminAddSmtp(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      addSmtpFormik?.resetForm();
      queryClient.invalidateQueries({ queryKey: ["smtp-list"] });
      navigate(`/admin/smtp-list`)
    },
  });

  const addSmtpFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      host: "",
      port: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required().label("Smtp Email")
        .matches(emailRegex, "Invalid email").trim(),
      password: yup.string().required().label("Smtp Password").trim(),
      host: yup.string().required().label("Smtp Host").trim(),
      port: yup.string().required().label("Smtp Port").trim(),
    }),

    onSubmit: async (values) => {
      let body;
      body = {
        id: id && id,
        email: values?.email,
        password: values?.password,
        host: values?.host,
        port: values?.port,
      }
      mutate(body);
    },
  });

  return (
    <div className="mainbox">
      <Sidebar />
      <div className={isSlider ? "body-content close" : "body-content open"}>
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          <h2 className="mainhead mb-0">
            <Link to={"/admin/dashboard"} className="bread_color">
              Home
            </Link>{" "}
            <Link to={"/admin/smtp-list"} className="bread_color">
              / SMTP
            </Link>
            / {id ? "Update SMTP" : "Create SMTP"}
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
              <Form>
                <Row>

                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="title">
                        SMTP Email <span className="text-danger"> *</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter SMTP email"
                        name="email"
                        value={addSmtpFormik?.values?.email}
                        onChange={addSmtpFormik?.handleChange}
                        onBlur={addSmtpFormik?.handleBlur}
                        maxLength={50}
                      />
                      <span className="text-danger">
                        {addSmtpFormik?.touched?.email && addSmtpFormik?.errors?.email}
                      </span>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="title">
                        SMTP Password <span className="text-danger"> *</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter SMTP password"
                        name="password"
                        value={addSmtpFormik?.values?.password}
                        onChange={addSmtpFormik?.handleChange}
                        onBlur={addSmtpFormik?.handleBlur}
                        maxLength={30}
                      />
                      <span className="text-danger">
                        {addSmtpFormik?.touched?.password && addSmtpFormik?.errors?.password}
                      </span>                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="title">
                        SMTP Host <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=" Enter SMTP host"
                        name="host"
                        value={addSmtpFormik?.values?.host}
                        onChange={addSmtpFormik?.handleChange}
                        onBlur={addSmtpFormik?.handleBlur}
                        maxLength={15}
                      />
                      <span className="text-danger">
                        {addSmtpFormik?.touched?.host && addSmtpFormik?.errors?.host}
                      </span>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="title">
                        SMTP Port <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter SMTP Port"
                        name="port"
                        value={addSmtpFormik?.values?.port}
                        onChange={addSmtpFormik?.handleChange}
                        onBlur={addSmtpFormik?.handleBlur}
                        maxLength={10}
                      />
                      <span className="text-danger">
                        {addSmtpFormik?.touched?.port && addSmtpFormik?.errors?.port}
                      </span>
                    </Form.Group>
                  </Col>

                  <div className="text-end mt-4">
                    <button
                      className="theme-btn btn-md mb-2"
                      type="submit"
                      onClick={addSmtpFormik?.handleSubmit}
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
  );
};
export default AddSmtp;
