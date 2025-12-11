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
import { FaImage } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { adminAddCategory, adminCategoryView, adminUpdateCategory } from "../../../services/services";
import { constant } from "../../../utils/constant";
import MyEditor from "../../../utils/Editor";
import { isRichTextEmpty } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const AddCategory = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME}| ${id ? 'Update' : 'Create'} Category Management`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  On edit, fetch Category details and set form values.

  if (id) {
    useQuery({
      queryKey: ["category-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminCategoryView(id);
        setValues({
          ...values,
          title: resp?.data?.data?.title,
          image: resp?.data?.data?.image,
          description: resp?.data?.data?.description
        });
        return resp?.data?.data;

      },
    });
  }

  // Handles add/edit Category mutation and post-success actions.

  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminUpdateCategory(id, body) : adminAddCategory(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      navigate(`/admin/category-list`);
    },
  });


  // Initializes Formik for the add category form.

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      title: "",
      image: "",
      imagePreview: "",
      description: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required().label("Category Title"),
      description: yup.string().test("not-empty", ("Description is a required field"), (value) => !isRichTextEmpty(value || "")),
      imagePreview: yup
        .mixed()
        .test("required", "Category image is a required field", function (value) {
          return !!value || !!this.parent.image;
        })
        .test(
          "fileFormat",
          "Please select jpg, png, jpeg format",
          function (value) {
            if (!value) return true;
            return (
              value &&
              (value.type === "image/jpg" ||
                value.type === "image/png" ||
                value.type === "image/jpeg")
            );
          }
        ),
    }),
    onSubmit: async function (values) {
      let payload = new FormData();
      payload.append("title", values.title ?? "");
      payload.append("description", values.description ?? "");
      if (values?.imagePreview) {
        payload.append("image", values?.imagePreview ?? "");
      }
      mutate(payload);
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
              <Link to={"/admin/category-list"} className="bread_color">
                / Category Management
              </Link>
              / {id ? "Update Category Management" : "Create Category Management "}
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
                        <Form.Label className="title">Catgeory Title<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Category title"
                          name="title"
                          value={values?.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={150}
                        />
                        <span className="text-danger">{touched?.title && errors?.title}</span>
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

                    <Col md={12}>
                      <Row>
                        <Form.Label className="title">
                          Category Image <span className="text-danger"> *</span>
                        </Form.Label>
                        <Col md={12} className="mb-3">
                          <div className="custom_upload d-flex gap-4 mt-0">
                            <label className="custom-image-upload custom-image-upload-box " htmlFor="image-logo">
                              <div className="inner-box">
                                <span>Upload Image Here</span>
                                <div className="upload-icon">
                                  <FaImage />
                                </div>
                                <input
                                  name="logo"
                                  type="file"
                                  accept="image/*"
                                  id="image-logo"
                                  className="d-none"
                                  onChange={(e) =>
                                    setFieldValue("imagePreview", e.target.files[0])
                                  }
                                />
                              </div>
                            </label>
                            <img
                              src={
                                values.imagePreview
                                  ? URL.createObjectURL(values.imagePreview)
                                  : values.image || "/images/static_image.jpg"
                              }
                              width="120px"
                              height="90px"
                              alt="Category-Image"
                              crossOrigin="anonymous"
                            />
                          </div>
                          {touched?.imagePreview &&
                            errors?.imagePreview && (
                              <span className="text-danger">
                                {errors?.imagePreview}
                              </span>
                            )}
                        </Col>
                      </Row>
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
export default AddCategory;