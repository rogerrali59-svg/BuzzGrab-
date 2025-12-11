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
import useSlider from "../../../hooks/useSlider";
import { adminAddSubscription, adminSubscriptionView, adminUpdateSubscription, } from "../../../services/services";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import { restrictAlpha } from "../../../utils/helper";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import MyEditor from "../../../utils/Editor";

const AddSubscription = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | ${id ? "Update Subscription" : "Add Subscription"}`)

  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  On edit, fetch subscription details and set form values.

  if (id) {
    useQuery({
      queryKey: ["subscription-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminSubscriptionView(id);
        setValues({
          ...values,
          name: resp?.data?.data?.name,
          amount: resp?.data?.data?.amount,
          features: resp?.data?.data?.features,
          planType: resp?.data?.data?.planType,
          currency: resp?.data?.data?.currency
        });
        return resp?.data?.data;
      },
    });
  }

  // Handles add/edit Category mutation and post-success actions.

  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminUpdateSubscription(id, body) : adminAddSubscription(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["subscription-list"] });
      navigate(`/admin/subscription`);
    },
  });


  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      amount: "",
      features: "",
      planType: "",
      currency: "usd"
    },
    validationSchema: yup.object().shape({
      name: yup.string().trim().required().label("Title"),
      amount: yup.number().label("Price").required()
        .integer("Price must be a whole number")
        .typeError("Price must be a number")
        .positive("Price must be greater than 0"),
      planType: yup.string().trim().required().label("Subscription type"),
      features: yup.string().trim().required().label("Description"),
    }),
    onSubmit: async (values) => {
      let body;
      body = {
        id: id && id,
        name: values?.name,
        planType: values?.planType,
        amount: values?.amount,
        features: values?.features,
        currency: values?.currency
      }
      mutate(body);
    },
  });

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
              <Link to="/admin/subscription" className="bread_color">
                / Subscription
              </Link>{" "}
              / {id ? "Update Subscription" : "Create Subscription"}
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
                        <Form.Label className="title">Title<span className="text-danger"> *</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
                          name="name"
                          value={values?.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={30}
                        />
                        <span className="text-danger">{touched?.name && errors?.name}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Subscription type <span className="text-danger"> *</span></Form.Label>
                        <select
                          className="form-control fs-6"
                          name="planType"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.planType}
                        >
                          <option value="">-- Select Subscription type --</option>
                          <option value={constant.SUBSCRIPTION_MONTH}>Monthly</option>
                          <option value={constant.SUBSCRIPTION_THREE_MONTH}>Quarterly</option>
                          <option value={constant.SUBSCRIPTION_SIX_MONTH}>Half-Yearly</option>
                          <option value={constant.SUBSCRIPTION_YEAR}>Yearly</option>
                        </select>
                        <span className="text-danger">{touched?.planType && errors?.planType} </span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Price ({constant.DOLLAR})<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter price"
                          name="amount"
                          value={values?.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={restrictAlpha}
                          disabled={id}
                        />
                        <span className="text-danger">{touched?.amount && errors?.amount}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Description<span className="text-danger"> *</span></Form.Label>

                        <MyEditor
                          value={values?.features}
                          onBlur={(newContent) => setFieldValue("features", newContent)}
                        />
                        <span className="text-danger">{touched?.features && errors?.features}</span>
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
      </div >
    </>
  );
};
export default AddSubscription;