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
import React, { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import { Pagination } from "../../../Pagination/Pagination";
import { adminLoginActivity, adminLoginAllDelete, } from "../../../services/services";
import { LoginActivityStatus } from "../../../utils/CheckAdminState";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import usePageTitle from "../../../utils/usePageTitle";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";

const LoginActivity = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Login Activity`)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();
  const {
    data: loginList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["login-Activity", page],
    queryFn: async () => {
      const resp = await adminLoginActivity(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const handleDeleteAll = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete all the login activity ?",
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
    mutationFn: () => adminLoginAllDelete(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["login-Activity"] });
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
              / Login Activity
            </h2>
            <div className=" d-flex align-items-center my-2 mx-1">
              <button
                type="button"
                className="btn btn-danger"
                disabled={loginList?.length === 0}
                onClick={() => {
                  handleDeleteAll();
                }}
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
                      <th>Id</th>
                      <th>User IP</th>
                      <th>Login</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginList?.length > 0 ? (
                      loginList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>{data?._id}</td>
                            <td>{data?.userIP}</td>
                            <td>{moment(data?.loginAt).format("LL")}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{LoginActivityStatus(data?.state)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      `/admin/view-login-activity/${data?._id}`
                                    )
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
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

export default LoginActivity;
