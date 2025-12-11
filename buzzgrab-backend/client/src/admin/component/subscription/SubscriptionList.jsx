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
import { FaEye, FaPencilAlt, FaRegCheckCircle, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import useSlider from "../../../hooks/useSlider";
import { adminDeleteSubscription, adminStatusSubscription, adminSubscriptionList } from "../../../services/services";
import { CheckAdminState, subscriptionType } from "../../../utils/CheckAdminState";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { FaCircleXmark } from "react-icons/fa6";

const SubscriptionList = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Subscription Management`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);


  const {
    data: subscription,
    isFetching
  } = useQuery({
    queryKey: ["subscription-list", page],
    queryFn: async () => {
      const resp = await adminSubscriptionList(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // Confirm and delete a subscription  

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => adminDeleteSubscription(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["subscription-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this subscription",
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

      // update status a subscription  
  
      const statusMutation = useMutation({
          mutationFn: (payload) => {
              return adminStatusSubscription(payload.id, payload.stateId);
          },
          onSuccess: (resp) => {
              toastAlert("success", resp?.data?.message)
              queryClient.invalidateQueries({ queryKey: ["subscription-list"] });
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
              / Subscription
            </h2>
            <div className=" d-flex align-items-center gap-3 my-2 mx-1">
              <button
                type="button"
                className="theme-btn btn-md"
                onClick={() => {
                  navigate(`/admin/add-subscription`);
                }}
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
                      <th>Title</th>
                      <th>Subscription type</th>
                      <th>Price({constant.DOLLAR})</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription?.length > 0 ? (
                      subscription?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td className="text-capitalize">{data?.name}</td>
                            <td>{subscriptionType(data?.planType)}</td>
                            <td>
                              {constant.DOLLAR}
                              {Number(data?.amount)?.toLocaleString()}
                            </td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      `/admin/view-subscription/${data?._id}`
                                    )
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="btn-small style-two"
                                  title="Update"
                                  onClick={() => {
                                    navigate(
                                      `/admin/edit-subscription/${data?._id}`
                                    );
                                  }}
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
                                  onClick={() =>
                                    handleDelete(data?._id, constant.DELETED)
                                  }
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
      {(isFetching || isPending) && <Loader />}
    </>
  );
};

export default SubscriptionList;
