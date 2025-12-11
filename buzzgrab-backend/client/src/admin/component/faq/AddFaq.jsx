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
import { adminCreateFaq, adminEditFaq, adminFaqView, } from "../../../services/services";
import { constant } from "../../../utils/constant";
import MyEditor from "../../../utils/Editor";
import { isRichTextEmpty } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const AddFaq = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | ${id ? 'Update' : 'Create'} FAQ`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * On edit, fetch faq details and set form values.
   */
  if (id) {
    useQuery({
      queryKey: ["faq-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminFaqView(id);
        setValues({
          ...values,
          question: resp?.data?.data?.question,
          answer: resp?.data?.data?.answer,
        });
        return resp?.data?.data;
      },
    });
  }

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema: yup.object().shape({
      question: yup.string().required().label("Question")
        .matches(
          /[a-zA-Z]/,
          "Please Enter valid Question, it must contain at least one letter"
        ),
      answer: yup.string().test("not-empty", ("Answer is a required field"), (value) => !isRichTextEmpty(value || "")),
    
    }),
    onSubmit: async (values) => {
      let body;
      body = {
        id: id && id,
        question: values?.question,
        answer: values?.answer
      }
      mutate(body);
    },
  });

  /**
  * Handles add/edit faq mutation and post-success actions.
  */
  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminEditFaq(id, body) : adminCreateFaq(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["faq-list"] });
      navigate(`/admin/faq-list`);
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
              <Link to="/admin/faq-list" className="bread_color">
                / FAQ
              </Link>
              / {id ? "Update FAQ" : "Create FAQ"}
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
                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Question<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter question"
                          name="question"
                          value={values?.question}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={150}
                        />
                        <span className="text-danger">{touched?.question && errors?.question}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Answer<span className="text-danger"> *</span></Form.Label>
                        <MyEditor
                                                  value={values?.answer}
                                                  onBlur={(newContent) => setFieldValue("answer", newContent)}
                                                />

                        <span className="text-danger">{touched?.answer && errors?.answer} </span>
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
};
export default AddFaq;