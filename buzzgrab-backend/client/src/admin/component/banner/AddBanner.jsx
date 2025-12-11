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
import { adminAddBanner, adminUpdateBanner, adminViewBanner } from "../../../services/services";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const AddBanner = () => {
  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME}| ${id ? "Update" : "Create"} Banner Management`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Convert image URL to File (binary)
  const urlToFile = async (url, filename = "banner.jpg") => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // ------------------------ FORM ------------------------
  const {
    values,
    touched,
    errors,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      bannerImg: "",      // URL for preview
      imagePreview: "",   // File for upload
    },
    validationSchema: yup.object({
      imagePreview: yup
        .mixed()
        .test("required", "Banner image is a required field", function (value) {
          return !!value || !!this.parent.bannerImg;
        })
        .test("fileFormat", "Please select jpg, png, jpeg format", function (value) {
          if (!value) return true;
          return (
            value.type === "image/jpeg" ||
            value.type === "image/png" ||
            value.type === "image/jpg"
          );
        }),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      payload.append("bannerImg", values.imagePreview);
      mutate(payload);
    },
  });

  // ------------------------ FETCH DATA ON EDIT ------------------------
  useQuery({
    queryKey: ["banner-detail", id],
    queryFn: async () => {
      const resp = await adminViewBanner(id);
      const data = resp?.data?.data;

      if (data?.bannerImg) {
        const file = await urlToFile(data.bannerImg);

        setFieldValue("bannerImg", data.bannerImg); // URL for preview
        setFieldValue("imagePreview", file);        // Binary File
      }

      return data;
    },
    enabled: !!id,
  });

  // ------------------------ MUTATION ------------------------
  const { mutate } = useMutation({
    mutationFn: (body) =>
      id ? adminUpdateBanner(id, body) : adminAddBanner(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries(["banner-list"]);
      navigate(`/admin/banner-list`);
    },
  });

  // ------------------------ UI ------------------------
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
              <Link to={"/admin/banner-list"} className="bread_color">
                / Banner Management
              </Link>
              / {id ? "Update Banner Management" : "Create Banner Management"}
            </h2>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="theme-btn btn-md mb-2 mx-4"
            >
              Back
            </button>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Label className="title">
                        Banner Image <span className="text-danger">*</span>
                      </Form.Label>

                      <div className="custom_upload d-flex gap-4 mt-0 mb-3">
                        <label
                          className="custom-image-upload custom-image-upload-box"
                          htmlFor="image-logo"
                        >
                          <div className="inner-box">
                            <span>Upload Image</span>
                            <div className="upload-icon">
                              <FaImage />
                            </div>
                            <input
                              type="file"
                              id="image-logo"
                              className="d-none"
                              accept="image/*"
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
                              : values.bannerImg || "/images/static_image.jpg"
                          }
                          width="120"
                          height="90"
                          alt="banner-Image"
                        />
                      </div>

                      {touched.imagePreview && errors.imagePreview && (
                        <span className="text-danger">{errors.imagePreview}</span>
                      )}
                    </Col>

                    <div className="text-end mt-4">
                      <button className="theme-btn btn-md mb-2" type="submit">
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

export default AddBanner;