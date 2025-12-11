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
import React, { useState } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import {
  adminEmailAllDelete,
  adminEmailDelete,
  adminEmailList,
} from "../../../services/services";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant, Paginations } from "../../../utils/constant";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { Pagination } from "../../../Pagination/Pagination";
import { serialNumber } from "../../../utils/helper";
import { EmailQueueStatus } from "../../../utils/CheckAdminState";
import usePageTitle from "../../../utils/usePageTitle";
import Loader from "../../../Loader/Loader";
import DataNotFound from "../../../Loader/DataNotFound";

const EmailQueue = () => {
  usePageTitle(`${constant.PROJECT_NAME} | Email Queue`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const queryClient = useQueryClient();

  const {
    data: emailList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["emailQueue", page, state],
    queryFn: async () => {
      const resp = await adminEmailList(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const handleAllDelete = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete all the email queues ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005CDC",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete It!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(); 
      }
    });
  };

  const deleteMutation = useMutation({
    mutationFn: () => adminEmailAllDelete(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["emailQueue"] });
    },
  });

  const handleSingleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete the email queue ?",
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

  const { mutate } = useMutation({
    mutationFn: (payload) => adminEmailDelete(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["emailQueue"] });
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
              / Email Queue
            </h2>
            <div className=" d-flex align-items-center gap-3 my-2 mx-1 onmobile onmobile-center">
              <Form.Select onChange={(e) => setState(e.target.value)}>
                <option value={""}>All</option>
                <option value={constant.EMAIL_SUCCESS}>Success</option>
                <option value={constant.EMAIL_FAILED}>Failed</option>
              </Form.Select>
              <Form.Control
                type="text"
                value={search}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && refetch()}
                onKeyUp={(e) => e.target.value == "" && refetch()}
              />
              <button
                type="button"
                disabled={emailList?.length === 0}
                onClick={() => {
                  handleAllDelete();
                }}
                className="btn btn-danger email_btn w-100"
              >
                Delete All
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
                      <th>From</th>
                      <th>To</th>
                      <th>Subject</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailList?.length > 0 ? (
                      emailList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>{data?.from}</td>
                            <td>{data?.to}</td>
                            <td>{data?.subject}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{EmailQueueStatus(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/email-view/${data?._id}`)
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  title="Delete"
                                  className="btn btn-danger btn-small"
                                  onClick={() => {
                                    handleSingleDelete(data?._id);
                                  }}
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
      {isFetching && <Loader />}
    </>
  );
};

export default EmailQueue;
