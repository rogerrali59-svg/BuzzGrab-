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
import { Container, Table } from "react-bootstrap";
import { FaEye, FaPencilAlt, FaRegCheckCircle, FaTrash } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import { adminCmsList, adminDeleteCMS, adminStatusCms, } from "../../../services/services";
import { CheckAdminState, cmsType } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import usePageTitle from "../../../utils/usePageTitle";

const CmsList = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Cms`);
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cmsList } = useQuery({
    queryKey: ["cms-list"],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await adminCmsList();
      return resp?.data?.data;
    },
  });

  /**
  * Confirm and delete a cms  
  */
  const { mutate } = useMutation({
    mutationFn: (payload) => adminDeleteCMS(payload),
    onSuccess: () => {
      toastAlert("success", "Cms Page Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["cms-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete this cms ?",
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

  /**
    * update status a cms  
    */
  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminStatusCms(payload.id, payload.stateId);
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["cms-list"] });
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
              / Cms
            </h2>
            <div className=" d-flex align-items-center gap-3 my-2 mx-1">
              <button
                type="button"
                className="theme-btn btn-md"
                onClick={() => {
                  navigate(`/admin/add-cms`);
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
                      <th>Type</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmsList?.length > 0 ? (
                      cmsList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-capitalize">{data?.title}</td>
                            <td>{cmsType(data?.typeId)}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() => { navigate(`/admin/view-cms/${data?._id}`) }}
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="btn-small style-two"
                                  title="Update"
                                  onClick={() => { navigate(`/admin/edit-cms/${data?._id}`) }}
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
        </div>
        <AdminFooter />
      </div>
    </>
  );
};
export default CmsList;