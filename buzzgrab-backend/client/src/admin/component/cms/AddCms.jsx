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
import { adminCmsView, adminCreateCms, adminUpdateCMS, } from "../../../services/services";
import MyEditor from "../../../utils/Editor";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { isRichTextEmpty } from "../../../utils/helper";

const AddCms = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME} | ${id ? 'Update' : 'Create'} Cms`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
  * On edit, fetch cms details and set form values.
  */
  if (id) {
    useQuery({
      queryKey: ["cms-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminCmsView(id);
        setValues({
          ...values,
          title: resp?.data?.data?.title,
          typeId: resp?.data?.data?.typeId,
          description: resp?.data?.data?.description,
        });
        return resp?.data?.data;
      },
    });
  }

  /**
  * Handles add/edit cms mutation and post-success actions.
  */
  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminUpdateCMS(id, body) : adminCreateCms(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["cms-list"] });
      navigate(`/admin/cms-list`);
    },
  });

  /**
   * Initializes Formik for the add cms form.
   */
  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      typeId: "",
    },
    validationSchema: yup.object().shape({
       title: yup.string().required().label("Title").trim(),
      description: yup.string().test("not-empty", ("Description is a required field"), (value) => !isRichTextEmpty(value || "")),
      typeId: yup.string().trim().required().label("Type"),
    }),

    onSubmit: async (values) => {
      let body;
      body = {
        id: id && id,
        title: values?.title,
        typeId: values?.typeId,
        description: values?.description,
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
              <Link to="/admin/cms-list" className="bread_color">
                / Cms
              </Link>
              / {id ? "Update Cms" : "Create Cms"}
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
                        <Form.Label className="title">Title<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          name="title"
                          value={values?.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={30}
                        />
                        <span className="text-danger">{touched?.title && errors?.title}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Type <span className="text-danger">*</span></Form.Label>
                        <select
                          className="form-control fs-6"
                          name="typeId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.typeId}
                        >
                          <option value="">-- Select Type --</option>
                          <option value={constant.TERM_CONDITION}>Terms & Conditions</option>
                          <option value={constant.PRIVACY_POLICY}>Privacy Policy</option>
                          <option value={constant.ABOUT_US}>About Us</option>
                        </select>
                        <span className="text-danger">{touched?.typeId && errors?.typeId} </span>
                      </Form.Group>
                    </Col>

                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Description<span className="text-danger"> *</span></Form.Label>
                       
                        <MyEditor
                          value={values?.description}
                          onBlur={(newContent) => setFieldValue("description", newContent)}
                        />

                        <span className="text-danger">{touched?.description && errors?.description}</span>
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
export default AddCms;