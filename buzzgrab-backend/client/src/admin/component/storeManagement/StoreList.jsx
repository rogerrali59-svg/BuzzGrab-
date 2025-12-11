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
import moment from "moment";
import { useState } from "react";
import { Container, Form, Modal, Table } from "react-bootstrap";
import { FaEye, FaPencilAlt, FaRegCheckCircle, FaTrash, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import { adminAssignStore, adminDeleteStore, adminStoreList, adminUpdateStoreStatus, adminUserList, adminUnassignStore } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber, truncate } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import { useDebounceEffect } from "../../../utils/useDebounceEffect";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { useFormik } from "formik";
import * as yup from "yup";
import { AsyncPaginate } from "react-select-async-paginate";

const StoreList = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Store Management`);

  const isSlider = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const [showReply, setShowReply] = useState(false);
  const [id, setId] = useState({});
  const [showUnassign, setShowUnassign] = useState(false);
  const [unassignId, setUnassignId] = useState(null);
  const [assignedSubAdmin, setAssignedSubAdmin] = useState(null);
  const handleCloseReply = () => setShowReply(false);
  const handleShowReply = () => setShowReply(true);
  const handleCloseUnassign = () => setShowUnassign(false);
  const handleShowUnassign = (store) => {
    setUnassignId(store?._id);
    setAssignedSubAdmin(store?.subAdmin);
    setShowUnassign(true);
  };

  // dedouncing for search
  useDebounceEffect(() => {
    setDebouncedSearch(search.trim());
  }, 1000, [search]);

  const {
    data: storeListing,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["store-list", page, debouncedSearch, state],
    queryFn: async () => {
      const resp = await adminStoreList(page, debouncedSearch, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // Confirm and delete a store  
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => adminDeleteStore(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["store-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete this store ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005CDC",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(id);
      }
    });
  };

  // update status a store  
  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminUpdateStoreStatus(payload.id, payload.stateId);
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message)
      queryClient.invalidateQueries({ queryKey: ["store-list"] });
    },
  });

  /**
   * Formik for Assign SubAdmin
   */
  const { values, errors, touched, setFieldValue, handleSubmit, resetForm } = useFormik({
    initialValues: {
      id: id,
      subAdmin: "",
    },
    validationSchema: yup.object().shape({
      subAdmin: yup.object().required().label("Sub Admin"),
    }),
    onSubmit: (values) => {
      let body = {
        id: id,
        subAdmin: values?.subAdmin?.value,
      };
      mutuationReply.mutate(body);
    },
  });

  const mutuationReply = useMutation({
    mutationFn: () => adminAssignStore(id, values?.subAdmin?.value),
    onSuccess: (resp) => {
      resetForm();
      handleCloseReply();
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["store-list"] });
    },
  });

  let Fetching = false;

  const subAdminOptions = async (search, loadedOptions, { page }) => {
    if (Fetching) return;
    Fetching = true;

    try {
      let resp = await adminUserList(page, search, constant.ACTIVE, constant.SUBADMIN_ROLE);
      let array = await resp?.data?.data;

      return {
        options: array?.map((i) => ({
          label: i?.fullName,
          value: i?._id,
          ...i,
        })),
        hasMore: loadedOptions?.length < resp?.data?._meta?.totalCount,
        additional: {
          page: page + 1,
        },
      };
    } finally {
      Fetching = false;
    }
  };

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <h2 className="mainhead mb-0">
              <Link
                to="/admin/dashboard"
                className="bread_color"
              >
                Home
              </Link>
              / Store Management
            </h2>
            <div className=" d-flex align-items-center gap-3 my-2 mx-1 onmobile">
              <Form.Control
                type="text"
                value={search}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && refetch()}
                onKeyUp={(e) => e.target.value == "" && refetch()}
              />

              <Form.Select onChange={(e) => setState(e.target.value)}>
                <option value={""}>All Status</option>
                <option value={constant?.ACTIVE}>Active</option>
                <option value={constant?.INACTIVE}>In-Active</option>
              </Form.Select>
              <button
                type="button"
                className="theme-btn btn-md"
                onClick={() => { navigate(`/admin/add-store`) }
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
                      <th> Store Logo</th>
                      <th> Store name </th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeListing?.length > 0 ? (
                      storeListing?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>
                              <div className="table-user d-flex align-items-center">
                                <span className="table-user-icon">
                                  <img
                                    className="file-upload-image"
                                    src={data?.logo || "/images/static_image.jpg"}
                                    alt="store-img"
                                    crossOrigin="anonymous"
                                  />
                                </span>
                              </div>
                            </td>
                            <td className="text-capitalize">{truncate(data?.name, 50)}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() => { navigate(`/admin/view-store/${data?._id}`) }}
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="btn-small style-two"
                                  title="Update"
                                  onClick={() => { navigate(`/admin/edit-store/${data?._id}`) }}
                                >
                                  <FaPencilAlt />
                                </button>

                                <button
                                  type="submit"
                                  onClick={() => {
                                    statusMutation.mutate({
                                      id: data?._id,
                                      stateId:
                                        data?.stateId === constant.INACTIVE || data?.stateId === constant.DELETED
                                          ? constant.ACTIVE
                                          : constant.INACTIVE,
                                    });
                                  }}
                                  className={`btn-small ${data?.stateId === constant.ACTIVE
                                    ? "btn btn-small btn-warning"
                                    : "btn btn-small btn-success"
                                    }`}
                                >
                                  {data?.stateId === constant.ACTIVE ? (
                                    <FaCircleXmark title="In-Active" />
                                  ) : (
                                    <FaRegCheckCircle title="Active" />
                                  )}
                                </button>

                                <button
                                  title="Delete"
                                  disabled={data?.stateId === constant.DELETED}
                                  className="btn btn-danger btn-small"
                                  onClick={() => handleDelete(data?._id)}
                                >
                                  <FaTrash />
                                </button>

                                {data?.isAssigned ? (
                                  <button
                                    title="UnAssigned"
                                    className="btn btn-secondary btn-small"
                                    onClick={() => handleShowUnassign(data)}
                                  >
                                    <FaUserMinus />
                                  </button>
                                ) : (
                                  <button
                                    title="Assigned"
                                    className="btn btn-info btn-small"
                                    onClick={() => {
                                      handleShowReply();
                                      setId(data?._id);
                                    }}
                                  >
                                    <FaUserPlus />
                                  </button>
                                )}

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
              </div>
            </Container>
          </section>
          <Pagination
            totalCount={meta?.totalCount}
            handelPageChange={(e) => setPage(e.selected + 1)}
          />
        </div>
        <AdminFooter />
      </div>

      {/* Assign Modal */}
      <Modal show={showReply} onHide={handleCloseReply} centered size="lg">
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Assigned Store To SubAdmin</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group>
            <Form.Label className="title">SubAdmin List <span className="text-danger"> *</span></Form.Label>

            <AsyncPaginate
              value={values?.subAdmin}
              loadOptions={subAdminOptions}
              onChange={(e) => setFieldValue("subAdmin", e)}
              additional={{
                page: 1,
              }}
              isClearable
              className="text-capitalize"
              placeholder="-- Select subAdmin --"
            />
            <span className="text-danger">{touched?.subAdmin && errors?.subAdmin}</span>

          </Form.Group>

        </Modal.Body>
        <Modal.Footer className="pt-0 border-0">
          <button
            className="theme-btn btn-md mb-2"
            type="button"
            onClick={handleSubmit}
          >
            Assigned
          </button>
        </Modal.Footer>
      </Modal>

      {/* Unassign Modal */}
      <Modal show={showUnassign} onHide={handleCloseUnassign} centered size="lg">
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>UnAssigned Store To SubAdmin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="title">Assigned SubAdmin</Form.Label>
            <Form.Control
              type="text"
              value={assignedSubAdmin?.fullName || ""}
              className="text-capitalize"
              disabled
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="pt-0 border-0">
          <button
            className="theme-btn btn-md mb-2"
            onClick={() => {
              if (!unassignId || !assignedSubAdmin?._id) return;
              adminUnassignStore(unassignId, assignedSubAdmin._id)
                .then((resp) => {
                  toastAlert("success", resp?.data?.message);
                  queryClient.invalidateQueries({ queryKey: ["store-list"] });
                  handleCloseUnassign();
                })
                .catch(() => {
                  toastAlert("error", "Something went wrong while unassigning");
                });
            }}
          >
            UnAssigned
          </button>
        </Modal.Footer>
      </Modal>

      {(isFetching || isPending) && <Loader />}
    </>
  );
};

export default StoreList;
