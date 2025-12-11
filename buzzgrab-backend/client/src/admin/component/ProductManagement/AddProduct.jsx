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
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { adminAddProduct, adminBrandList, adminCategoryList, adminDeleteImage, adminStoreList, adminUpdateProduct, adminViewProduct } from "../../../services/services";
import { constant } from "../../../utils/constant";
import MyEditor from "../../../utils/Editor";
import { isRichTextEmpty, restrictAlpha, sizeRegex } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const AddStore = () => {

  const { id } = useParams();
  usePageTitle(`${constant.PROJECT_NAME}| ${id ? 'Update' : 'Create'} Store Management`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  On edit, fetch store details and set form values.

  if (id) {
    useQuery({
      queryKey: ["store-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminViewProduct(id);
        setValues({
          ...values,
          productName: resp?.data?.data?.productName,
          mrp: resp?.data?.data?.mrp,
          description: resp?.data?.data?.description,
          address: resp?.data?.data?.address,
          size: resp?.data?.data?.size,
          ingredients: resp?.data?.data?.ingredients,
          discount: resp?.data?.data?.discount,
          quantity: resp?.data?.data?.quantity,
          category: {
            label: resp?.data?.data?.categoryDetails?.title,
            value: resp?.data?.data?.categoryDetails?._id,
          },
          brand: {
            label: resp?.data?.data?.brandDetails?.title,
            value: resp?.data?.data?.brandDetails?._id,
          },
          store: {
            label: resp?.data?.data?.storeDetails?.name,
            value: resp?.data?.data?.storeDetails?._id,
          },
          productImg:
            resp?.data?.data?.productImg?.map((file) => {
              const fileUrl = file?.url || "";
              const fileName = fileUrl.split("/").pop();
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);

              return {
                url: fileUrl,
                type: isImage ? "image" : "unknown",
                _id: file._id,
                name: fileName,
              };
            }) || [],
        });
        return resp?.data?.data;

      },
    });
  }

  // Handles add/edit store mutation and post-success actions.

  const { mutate } = useMutation({
    mutationFn: (body) => id ? adminUpdateProduct(id, body) : adminAddProduct(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["product-list"] });
      navigate(`/admin/product-list`);
    },
  });


  // Initializes Formik for the add store form.

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, setValues, setFieldValue,
  } = useFormik({
    initialValues: {
      productImg: [],
      productName: "",
      mrp: "",
      // address: "",
      category: "",
      description: "",
      brand: "",
      size: "",
      ingredients: "",
      quantity: "",
      discount: "",
      store: ""
    },
    validationSchema: yup.object().shape({
      productName: yup.string().required().label("Product name"),
      quantity: yup.string().required().label("Quantity"),
      // discount: yup.string().required().label("Discount"),
      discount: yup
        .string()
        .required("Discount is a required field")
        .test("is-valid-discount", "Discount must be between 1 and 100", (value) => {
          const num = Number(value);
          return num > 0 && num <= 100;
        }),

      size: yup
        .string()
        .required("Size is a required field")
        .matches(sizeRegex, "Size must be a number followed by ml, e.g., 750ml "),
      // address: yup.string().required().label("Address"),
      // mrp: yup.string().required().label("M.R.P"),
      // mrp: yup
      //   .string()
      //   .required("M.R.P is a required field")
      //   .test("is-positive", "M.R.P must be greater than 0", (value) => {
      //     const num = Number(value);
      //     return num > 0; // no zero, no negative
      //   }),

      mrp: yup
        .string()
        .required("M.R.P is a required field")
        .test("is-positive", "M.R.P must be greater than 0", (value) => {
          const num = Number(value);
          return num > 0;
        })
        .test(
          "mrp-greater-than-discount",
          "M.R.P must be greater than Discount",
          function (value) {
            const mrp = Number(value);
            const discount = Number(this.parent.discount);
            if (!mrp || !discount) return true; // handle empty or invalid values safely
            return mrp > discount;
          }
        ),

      category: yup.object().required().label("Category"),
      store: yup.object().required().label("Store"),
      brand: yup.object().required().label("Brand"),
      description: yup.string().test("not-empty", ("Description is a required field"), (value) => !isRichTextEmpty(value || "")),
      ingredients: yup.string().test("not-empty", ("Ingredients is a required field"), (value) => !isRichTextEmpty(value || "")),
      productImg: yup
        .array()
        .min(1, "At least one file is required")
        .max(5, "Only 5 files are allowed")
        .of(
          yup
            .mixed()
            .test(
              "fileTypeAndSize",
              "Only image files under 50 MB are allowed",
              (value) => {
                if (!value) return true;

                if (value instanceof File) {
                  const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                  ];

                  const isValidType = allowedTypes.includes(value.type);
                  const isValidSize = value.size <= 50 * 1024 * 1024;

                  return isValidType && isValidSize;
                }

                return true;
              }
            )
        ),
    }),
    onSubmit: async function (values) {
      let payload = new FormData();
      payload.append("productName", values.productName ?? "");
      payload.append("size", values.size ?? "");
      payload.append("ingredients", values.ingredients ?? "");
      // payload.append("address", values.address ?? "");
      payload.append("description", values.description ?? "");
      payload.append("mrp", values.mrp ?? "");
      payload.append("discount", values.discount ?? "");
      payload.append("quantity", values.quantity ?? "");
      payload.append("category", values.category?.value);
      payload.append("store", values.store?.value);
      payload.append("brand", values.brand?.value);
      if (values?.productImg?.length) {
        values.productImg.forEach((file) => {
          if (file instanceof File) {
            payload.append("productImg", file);
          }
        });
      }
      mutate(payload);
    },
  });

  let isFetching = false;

  const categoryOptions = async (search, loadedOptions, { page }) => {
    if (isFetching) return;
    isFetching = true;

    try {
      let resp = await adminCategoryList(page, search, constant.ACTIVE);
      let array = await resp?.data?.data;

      return {
        options: array?.map((i) => ({
          label: i?.title,
          value: i?._id,
          ...i,
        })),
        hasMore: loadedOptions?.length < resp?.data?._meta?.totalCount,
        additional: {
          page: page + 1,
        },
      };
    } finally {
      isFetching = false;
    }
  };

  const brandOptions = async (search, loadedOptions, { page }) => {
    if (isFetching) return;
    isFetching = true;

    try {
      let resp = await adminBrandList(page, search, constant.ACTIVE);
      let array = await resp?.data?.data;

      return {
        options: array?.map((i) => ({
          label: i?.title,
          value: i?._id,
          ...i,
        })),
        hasMore: loadedOptions?.length < resp?.data?._meta?.totalCount,
        additional: {
          page: page + 1,
        },
      };
    } finally {
      isFetching = false;
    }
  };

  const storeOptions = async (search, loadedOptions, { page }) => {
    if (isFetching) return;
    isFetching = true;

    try {
      let resp = await adminStoreList(page, search, constant.ACTIVE);
      let array = await resp?.data?.data;

      return {
        options: array?.map((i) => ({
          label: i?.name,
          value: i?._id,
          ...i,
        })),
        hasMore: loadedOptions?.length < resp?.data?._meta?.totalCount,
        additional: {
          page: page + 1,
        },
      };
    } finally {
      isFetching = false;
    }
  };


  // When files are dropped
  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFieldValue("productImg", [
        ...(values.productImg || []),
        ...Array.from(droppedFiles),
      ]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };


  const handleDeleteImage = async (file, index) => {
    try {
      const isFileObject = file instanceof File;

      if (!isFileObject) {
        await adminDeleteImage(id, file._id);
      }

      const updated = [...values.productImg];
      updated.splice(index, 1);
      setFieldValue("productImg", updated);

    } catch (error) {
      console.error("Delete failed:", error);
    }
  };



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
              <Link to={"/admin/product-list"} className="bread_color">
                / Product Management
              </Link>
              / {id ? "Update Product Management " : "Create Product Management"}
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
                        <Form.Label className="title">Product name<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Product name"
                          name="productName"
                          value={values?.productName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={150}
                        />
                        <span className="text-danger">{touched?.productName && errors?.productName}</span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">
                          Category<span className="text-danger"> *</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.category}
                          loadOptions={categoryOptions}
                          onChange={(e) => setFieldValue("category", e)}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          className="text-capitalize"
                          placeholder="-- Select category --"
                        />
                        <span className="text-danger">
                          {" "}
                          {touched?.category && errors?.category}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">
                          Brand<span className="text-danger"> *</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.brand}
                          loadOptions={brandOptions}
                          onChange={(e) => setFieldValue("brand", e)}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          className="text-capitalize"
                          placeholder="-- Select brand --"
                        />
                        <span className="text-danger">
                          {" "}
                          {touched?.brand && errors?.brand}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">
                          Store<span className="text-danger"> *</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.store}
                          loadOptions={storeOptions}
                          onChange={(e) => setFieldValue("store", e)}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          className="text-capitalize"
                          placeholder="-- Select store --"
                        />
                        <span className="text-danger">
                          {" "}
                          {touched?.store && errors?.store}
                        </span>
                      </Form.Group>
                    </Col>



                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Size (ML)<span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter size"
                          name="size"
                          value={values?.size}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={20}
                        />
                        <span className="text-danger">{touched?.size && errors?.size}</span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">({constant.DOLLAR}) M.R.P <span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter M.R.P"
                          name="mrp"
                          value={values?.mrp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={10}
                          onKeyPress={restrictAlpha}
                        />
                        <span className="text-danger">{touched?.mrp && errors?.mrp}</span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Discount <span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter discount"
                          name="discount"
                          value={values?.discount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={3}
                          onKeyPress={restrictAlpha}
                        />
                        <span className="text-danger">{touched?.discount && errors?.discount}</span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Quantity <span className="text-danger"> *</span></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter quantity"
                          name="quantity"
                          value={values?.quantity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={10}
                          onKeyPress={restrictAlpha}
                        />
                        <span className="text-danger">{touched?.quantity && errors?.quantity}</span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Description<span className="text-danger"> *</span></Form.Label>
                        <MyEditor
                          value={values?.description}
                          onBlur={(newContent) => setFieldValue("description", newContent)}
                        />
                        <span className="text-danger">{touched?.description && errors?.description}</span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="title">Ingredients<span className="text-danger"> *</span></Form.Label>
                        <MyEditor
                          value={values?.ingredients}
                          onBlur={(newContent) => setFieldValue("ingredients", newContent)}
                        />
                        <span className="text-danger">{touched?.ingredients && errors?.ingredients}</span>
                      </Form.Group>
                    </Col>


                    <Col lg={12}>
                      {/* <Form.Group className="mb-3" >
                          <Form.Label className="title">Address <span className="text-danger"> *</span></Form.Label>
                          <Form.Control as="textarea" rows={3} type="text"
                            placeholder="Enter address"
                            name="address"
                            value={values?.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={300} />
                          <span className="text-danger">{touched?.address && errors?.address}</span>
  
                        </Form.Group> */}
                      <div className="form-group">
                        <label for="hospitalDocuments" className="title">
                          Product Image <span className="text-danger">*</span>
                        </label>

                        <div
                          className="file-drop-area"
                          onClick={() =>
                            document.getElementById("productImage").click()
                          }
                          onDrop={handleFileDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <input
                            id="productImage"
                            name="productImg"
                            type="file"
                            accept="image/*"
                            className="file-input d-none"
                            multiple
                            onChange={(e) => {
                              const newFiles = Array.from(e.target.files);
                              setFieldValue("productImg", [
                                ...(values?.productImg || []),
                                ...newFiles,
                              ]);
                            }}
                          />

                          <p className="file-placeholder">
                            Drag & Drop your files here, or click to select
                          </p>
                        </div>

                        {/* ------------ Preview Section ------------ */}
                        <div className="file-preview mt-3">
                          <div className="d-flex flex-wrap gap-3">
                            {values?.productImg?.map((file, index) => {
                              const isFileObject = file instanceof File;

                              const previewUrl = isFileObject
                                ? URL.createObjectURL(file)
                                : file.url;

                              return (
                                <Col lg={2} key={index} title={file?.name || ""}>
                                  <div className="d-flex flex-column align-items-center p-2 border rounded">

                                    <img
                                      crossOrigin="anonymous"
                                      src={previewUrl}
                                      alt="preview"
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                      }}
                                    />

                                    <div
                                      className="icon-container mt-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleDeleteImage(file, index)}
                                    >
                                      <FaTimes className="dark-cross-icon" />
                                    </div>

                                  </div>
                                </Col>
                              );
                            })}

                          </div>
                        </div>
                      </div>
                      <span className="text-danger">
                        {touched?.productImg &&
                          errors?.productImg}
                      </span>
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



20000