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
import { Container, Table } from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import {adminErrorLog, adminLogAllDelete, adminLogDelete} from "../../../services/services";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber, truncate } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const ErrorLogs = () => {
  usePageTitle(`${constant.PROJECT_NAME} | Error List`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();

  const {
    data: errorList,
    isFetching,
  } = useQuery({
    queryKey: ["errorLogs", page],
    queryFn: async () => {
      const resp = await adminErrorLog(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const handleSingleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete the error log ?",
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
    mutationFn: (payload) => adminLogDelete(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["errorLogs"] });
    },
  });

  const handleAllDelete = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete all the error logs ?",
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
    mutationFn: () => adminLogAllDelete(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["errorLogs"] });
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
              / Error Logs
            </h2>
            <button
              type="button"
              className="btn btn-danger"
              disabled={errorList?.length === 0}
              onClick={() => {
                handleAllDelete();
              }}
            >
              Delete All
            </button>
          </div>
          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Table striped responsive bordered>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Error ID</th>
                      <th>Error Ip</th>
                      <th>Error Code</th>
                      <th>Error Name</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorList?.length > 0 ? (
                      errorList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>
                              <b>{data?._id}</b>
                            </td>
                            <td>{data?.ip}</td>
                            <td>{data?.errorCode}</td>
                            <td>{truncate(data?.errorName, 15)}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/view-error/${data?._id}`)
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
        {isFetching  && <Loader />}
    </>
  );
};
export default ErrorLogs;
