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
import moment from "moment";
import { useState } from "react";
import { Container, Form, Modal, Table } from "react-bootstrap";
import { FaEye, FaReply, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import { adminContactList, adminDeleteContact, adminReplyUser } from "../../../services/services";
import { constant, Paginations } from "../../../utils/constant";
import { isRichTextEmpty, serialNumber } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import MyEditor from "../../../utils/Editor";

const ContactList = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Contact Us`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();
  const [showReply, setShowReply] = useState(false);
  const [id, setId] = useState({});

  const handleCloseReply = () => setShowReply(false);
  const handleShowReply = () => setShowReply(true);

  const { data: contactList, isFetching } = useQuery({
    queryKey: ["contact-list", page],
    queryFn: async () => {
      const resp = await adminContactList(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  /**
  * Confirm and delete a contact   
  */
  const { mutate } = useMutation({
    mutationFn: (payload) => adminDeleteContact(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["contact-list"] });
    },
  });

const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure ?",
    text: "Do you want to delete this contact ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0062FF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      mutate(id);
    }
  });
};

  /**
   * Formik for reply contact us user
   */
  const { values, errors, touched, handleBlur,setFieldValue, handleChange, handleSubmit, resetForm,
  } = useFormik({
    initialValues: {
      id: id,
      reply: "",
    },
    validationSchema: yup.object().shape({
      reply: yup.string().test("not-empty", ("Reply is a required field"), (value) => !isRichTextEmpty(value || "")),
    }),
    onSubmit: (values) => {
      let body;
      body = {
        id: id,
        reply: values?.reply,
      };
      mutuationReply.mutate(body);
    },
  });
  const mutuationReply = useMutation({
    mutationFn: (body) => adminReplyUser(id, body),
    onSuccess: (resp) => {
      resetForm();
      handleCloseReply();
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["contact-list"] });
      queryClient.invalidateQueries({ queryKey: ["view-contact"] });
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link>
              / Contact Us
            </h2>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Table striped responsive bordered>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Fullname</th>
                      <th>Email</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactList?.length > 0 ? (
                      contactList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td className="text-capitalize">{data?.fullName}</td>
                            <td>{data?.email}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() => { navigate(`/admin/view-contact/${data?._id}`) }
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="btn-small style-two "
                                  title="Update"
                                  onClick={() => {
                                    handleShowReply();
                                    setId(data?._id);
                                  }}
                                >

                                  <FaReply />
                                </button>
                                <button
                                  title="Delete"
                                  disabled={data?.stateId === constant.DELETED}
                                  className="btn btn-danger btn-small"
                                  onClick={() => handleDelete(data?._id)}
                                >
                                  <FaTrash />
                                </button>

                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          <DataNotFound />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Pagination
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                />
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>

      <Modal show={showReply} onHide={handleCloseReply} centered size="lg">
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Reply user</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group>
            <Form.Label className="title">Reply <span className="text-danger"> *</span></Form.Label>

            <MyEditor
              value={values?.reply}
              onBlur={(newContent) => setFieldValue("reply", newContent)}
            />
            <span className="text-danger">{touched?.reply && errors?.reply}</span>

          </Form.Group>

        </Modal.Body>
        <Modal.Footer className="pt-0 border-0">
          <button
            className="theme-btn btn-md mb-2"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
      {isFetching && <Loader />}
    </>
  );
};
export default ContactList;