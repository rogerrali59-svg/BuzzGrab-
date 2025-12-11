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
import { adminAddStore, adminUpdateStore, adminViewStore } from "../../../services/services";
import { constant } from "../../../utils/constant";
import MyEditor from "../../../utils/Editor";
import { isRichTextEmpty } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { FaImagePortrait } from "react-icons/fa6";

const AddStore = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME}| ${id ? 'Update' : 'Create'} Store `);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  On edit, fetch store details and set form values.

  if (id) {
    useQuery({
      queryKey: ["store-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminViewStore(id);
        setValues({
          ...values,
          name: resp?.data?.data?.name,
          logo: resp?.data?.data?.logo,
          coverImg: resp?.data?.data?.coverImg,
          description: resp?.data?.data?.description,
          address: resp?.data?.data?.address
        });
        return resp?.data?.data;

      },
    });
  }

  // Handles add/edit store mutation and post-success actions.

  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminUpdateStore(id, body) : adminAddStore(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["store-list"] });
      navigate(`/admin/store-list`);
    },
  });


  // Initializes Formik for the add store form.

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      logo: "",
      logoPreview: "",
      description: "",
      coverImg: "",
      coverImgPreview: "",
      address: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required().label("Store name"),
      address: yup.string().required().label("Address"),
      description: yup.string().test("not-empty", ("Description is a required field"), (value) => !isRichTextEmpty(value || "")),
      logoPreview: yup
        .mixed()
        .test("required", "Store Logo is a required field", function (value) {
          return !!value || !!this.parent.logo;
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
      coverImgPreview: yup
        .mixed()
        .test("required", "Cover image is a required field", function (value) {
          return !!value || !!this.parent.coverImg;
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
      payload.append("name", values.name ?? "");
      payload.append("address", values.address ?? "");
      payload.append("description", values.description ?? "");
      if (values?.logoPreview) {
        payload.append("logo", values?.logoPreview ?? "");
      }
      if (values?.coverImgPreview) {
        payload.append("coverImg", values?.coverImgPreview ?? "");
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
              <Link to={"/admin/store-list"} className="bread_color">
                / Store Management
              </Link>
              / {id ? "Update Store Management" : "Create Store Management"}
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
                        <Form.Label className="title">Store name<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Store name"
                          name="name"
                          value={values?.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={150}
                        />
                        <span className="text-danger">{touched?.name && errors?.name}</span>
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

                    <Col lg={12}>
                      <Form.Group className="mb-3" >
                        <Form.Label className="title">Address <span className="text-danger"> *</span></Form.Label>
                        <Form.Control as="textarea" rows={3} type="text"
                          placeholder="Enter address"
                          name="address"
                          value={values?.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={300} />
                        <span className="text-danger">{touched?.address && errors?.address}</span>

                      </Form.Group>
                    </Col>


                    <Col md={12}>
                      <Row>
                        <Form.Label className="title">
                          Store Logo <span className="text-danger"> *</span>
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
                                    setFieldValue("logoPreview", e.target.files[0])
                                  }
                                />
                              </div>
                            </label>
                            <img
                              src={
                                values.logoPreview
                                  ? URL.createObjectURL(values.logoPreview)
                                  : values.logo || "/images/static_image.jpg"
                              }
                              width="120px"
                              height="90px"
                              alt="store-logo"
                              crossOrigin="anonymous"
                            />
                          </div>
                          {touched?.logoPreview &&
                            errors?.logoPreview && (
                              <span className="text-danger">
                                {errors?.logoPreview}
                              </span>
                            )}
                        </Col>
                      </Row>
                    </Col>


                    <Col md={12}>
                      <Row>
                        <Form.Label className="title">
                          Store Cover Image <span className="text-danger"> *</span>
                        </Form.Label>
                        <Col md={12} className="mb-3">
                          <div className="custom_upload d-flex gap-4 mt-0">
                            <label className="custom-image-upload custom-image-upload-box " htmlFor="cover-logo">
                              <div className="inner-box">
                                <span>Upload Image Here</span>
                                <div className="upload-icon">
                                  <FaImagePortrait />
                                </div>
                                <input
                                  name="logo"
                                  type="file"
                                  accept="image/*"
                                  id="cover-logo"
                                  className="d-none"
                                  onChange={(e) =>
                                    setFieldValue("coverImgPreview", e.target.files[0])
                                  }
                                />
                              </div>
                            </label>
                            <img
                              src={
                                values.coverImgPreview
                                  ? URL.createObjectURL(values.coverImgPreview)
                                  : values.coverImg || "/images/static_image.jpg"
                              }
                              width="120px"
                              height="90px"
                              alt="store-cover-img"
                              crossOrigin="anonymous"
                            />
                          </div>
                          {touched?.coverImgPreview &&
                            errors?.coverImgPreview && (
                              <span className="text-danger">
                                {errors?.coverImgPreview}
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

export default AddStore
