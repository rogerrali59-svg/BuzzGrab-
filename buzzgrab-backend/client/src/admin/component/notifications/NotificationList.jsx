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
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import { adminNotificationDelete, adminNotificationList } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";


const NotificationList = () => {
  usePageTitle(`${constant.PROJECT_NAME} | Notification`);

  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();

  const {
    data: notification,
    isFetching
  } = useQuery({
    queryKey: ["notifi-list", page],
    queryFn: async () => {
      const resp = await adminNotificationList(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  /**
   * Confirm and delete a notification  
   */
  const handleAllDelete = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete all the notifications ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005CDC",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };

  const deleteMutation = useMutation({
    mutationFn: () => adminNotificationDelete(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["notifi-list"] });
    },
  });


  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
            <h2 className="mainhead mb-0">
              <Link
                to="/admin/dashboard"
                className="bread_color"
              >
                Home
              </Link>
              / Notification
            </h2>
            <div className=" d-flex align-items-center gap-3 my-2 mx-1">
              <button
                type="button"
                className="btn btn-danger email_btn "
                disabled={notification?.length === 0}
                onClick={() => {
                  handleAllDelete();
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
                      <th>Title</th>
                      <th>Fullname</th>
                      <th>Phone number</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notification?.length > 0 ? (
                      notification?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td className="text-capitalize">
                              {data?.isSeen == false ?
                                <b>{data?.title}</b> : data?.title}
                            </td>
                            <td className="text-capitalize">{data?.sendFrom?.fullName}</td>
                            <td>{data?.sendFrom?.countryCode + " " + data?.sendFrom?.mobile}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      `/admin/view-notification/${data?._id}`
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
export default NotificationList
