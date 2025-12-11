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
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { FaEye, FaPencilAlt, FaRegCheckCircle, FaTrash } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import useSlider from "../../../hooks/useSlider";
import { adminUserList, adminUserUpdate } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import { useDebounceEffect } from "../../../utils/useDebounceEffect";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const SubadminList = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Sub Admin`);

  const isSlider = useSlider();
  const [searchParams] = useSearchParams();
  const stateId = searchParams?.get("stateId") ?? "";
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState(stateId || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const queryClient = useQueryClient();

  const [stateModal, setStateModal] = useState({
    visible: false,
    user: null,
    actionType: "",
  });

  // Debounce for search
  useDebounceEffect(() => {
    setDebouncedSearch(search.trim());
  }, 300, [search]);

  // Fetch user list
  const {
    data: subadminList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["subadmin-List", page, debouncedSearch, state, constant.SUBADMIN_ROLE],
    queryFn: async () => {
      const resp = await adminUserList(page, debouncedSearch, state, constant.SUBADMIN_ROLE);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // Mutation for user update
  const stateMutation = useMutation({
    mutationFn: ({ id, body }) => adminUserUpdate(id, body),
    onSuccess: (resp) => {
      if (resp?.data?.data?.stateId == constant.DELETED) {
        toastAlert("success", "Subadmin account has been deleted successfully")
      }
      else if (resp?.data?.data?.stateId == constant.ACTIVE) {
        toastAlert("success", "Subadmin account has been active successfully")
      }
      else {
        toastAlert("success", "Subadmin account has been in-ctive successfully")
      }
      queryClient.invalidateQueries({ queryKey: ["subadmin-List"] });
    },
  });

  // Handle delete or inactivate
  const handleDelete = (user) => {
    setStateModal({
      visible: true,
      user,
      actionType: "delete",
    });
    resetForm();
  };

  const handleStateChange = (user) => {
    const newStateId = user?.stateId === constant.ACTIVE ? constant.INACTIVE : constant.ACTIVE;
    if (newStateId === constant.INACTIVE) {
      setStateModal({ visible: true, user, actionType: "inactive" });
      resetForm();
    } else {
      stateMutation.mutate({
        id: user._id,
        body: { stateId: newStateId, reason: "Activated" },
      });
    }
  };

  // Formik setup for modal
  const validationSchema = yup.object().shape({
    reason: yup
      .string()
      .trim()
      .required("Reason is a required field")
      .max(60, "Maximum 60 characters allowed"),
  });

  const { values, handleBlur, handleChange, handleSubmit, touched, errors, resetForm, isSubmitting, setSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      reason: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!stateModal.user) return;
      const stateId =
        stateModal.actionType === "delete"
          ? constant.DELETED
          : constant.INACTIVE;

      try {
        await stateMutation.mutateAsync({
          id: stateModal.user._id,
          body: {
            stateId,
            reason: values.reason,
          },
        });

        setStateModal({ visible: false, user: null, actionType: "" });
        resetForm();
      } catch (error) {
        toastAlert("error", "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/dashboard" className="bread_color">
                Home
              </Link>
              / Sub Admin
            </h2>
            <div className="d-flex align-items-center gap-3 my-2 mx-1 onmobile">
              <Form.Control
                type="text"
                value={search}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && refetch()}
                onKeyUp={(e) => e.target.value === "" && refetch()}
              />
              <Form.Select onChange={(e) => setState(e.target.value)}>
                <option value={""}>All Status</option>
                <option value={constant?.ACTIVE}>Active</option>
                <option value={constant?.INACTIVE}>In-Active</option>
              </Form.Select>
              <button
                type="button"
                className="theme-btn btn-md"
                onClick={() => { navigate(`/admin/add-subadmin`) }
                }
              >
                Create
              </button>
            </div>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Table striped responsive bordered>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Profile</th>
                      <th>Full Name </th>
                      <th>Phone number</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subadminList?.length > 0 ? (
                      subadminList.map((data, index) => (
                        <tr key={index}>
                          <th scope="row">{serialNumber(page, index)}</th>

                           <td>
                            <div className="table-user d-flex align-items-center">
                              <span className="table-user-icon">
                                <img
                                  className="file-upload-image"
                                   src={data?.profileImg || "/images/default.png"}
                                  alt="category-img"
                                  crossOrigin="anonymous"
                                />
                              </span>
                            </div>
                          </td>

                          <td className="text-capitalize">{data?.fullName}</td>

                          <td>
                            {data?.countryCode && data?.mobile
                              ? `${data?.countryCode} ${data?.mobile}`
                              : ""}
                          </td>

                          <td>{moment(data?.createdAt).format("LLL")}</td>

                          <td>{CheckAdminState(data?.stateId)}</td>

                          <td>
                            <div className="action-btn">

                              <button
                                title="View"
                                onClick={() => { navigate(`/admin/view-subadmin/${data?._id}`) }}
                                className="btn-small style-one"
                              >
                                <FaEye />
                              </button>

                              <button
                                className="btn-small style-two"
                                title="Update"
                                onClick={() =>
                                  navigate(`/admin/edit-subadmin/${data?._id}`)
                                }
                              >
                                <FaPencilAlt />
                              </button>

                              <button
                                onClick={() => handleStateChange(data)}
                                className={`btn-small ${data?.stateId === constant.ACTIVE
                                  ? "btn btn-warning"
                                  : "btn btn-success"
                                  }`}
                              >
                                {data?.stateId === constant.ACTIVE ? (
                                  <FaCircleXmark title="Inactive" />
                                ) : (
                                  <FaRegCheckCircle title="Active" />
                                )}
                              </button>

                              <button
                                title="Delete"
                                disabled={data?.stateId === constant.DELETED}
                                className="btn btn-danger btn-small"
                                onClick={() => handleDelete(data)}
                              >
                                <FaTrash />
                              </button>

                            </div>
                          </td>
                        </tr>

                      ))
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
        {isFetching && <Loader />}
      </div >

      {/* Reason Modal with Formik Validation */}
      < Modal
        show={stateModal.visible}
        onHide={() => setStateModal({ ...stateModal, visible: false })}
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {stateModal.actionType === "delete"
                ? " Reason for Deleting SubAdmin Account"
                : " Reason for In-Active SubAdmin Account"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group>
              <Form.Label className="title">
                Reason for this action <span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                placeholder="Enter your reason"
                value={values?.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={60}
              />
              <span className="text-danger">{touched?.reason && errors?.reason}</span>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant={
                stateModal.actionType === "delete" ? "danger" : "warning"
              }
              type="submit"
              disabled={isSubmitting}
              className="text-white btn btn-md mb-2 mx-4"
            >
              {isSubmitting
                ? "Processing..."
                : stateModal.actionType === "delete"
                  ? "Delete"
                  : "In-Active"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >
    </>
  );
};


export default SubadminList
