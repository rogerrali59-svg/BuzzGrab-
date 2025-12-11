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
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { adminDeleteTwillio, adminTwillio } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const TwillioList = () => {

  usePageTitle(`${constant.PROJECT_NAME} |  Twillio`);

  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: twillio,
    isFetching } = useQuery({
      queryKey: ["twillio-list"],
      queryFn: async () => {
        const resp = await adminTwillio();
        return resp?.data?.data ?? [];
      },
      staleTime: 1000 * 60 * 5,
      keepPreviousData: true,
    });

  /**
   * Confirm and delete a twillio account 
   */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete this Twillio configuration ?",
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


  const { mutate } = useMutation({
    mutationFn: (payload) => adminDeleteTwillio(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["twillio-list"] });
    },
  });

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link>
              / Twillio configuration 
            </h2>
            <div className=" d-flex align-items-center flex-lg-nowrap flex-wrap gap-3 my-2 mx-1">
              <button
                type="button"
                className="theme-btn btn-md"
                onClick={() => { navigate(`/admin/add-twillio`) }
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
                      <th>Twillio Account Sid </th>
                      <th>Twillio Phone number</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {twillio?.length > 0 ? (
                      twillio?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{data?.sid}</td>
                            <td>{data?.number}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">

                                <button
                                  title="View"
                                  onClick={() => { navigate(`/admin/view-twillio/${data?._id}`) }
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="btn-small style-two"
                                  title="Update"
                                  onClick={() => { navigate(`/admin/edit-twillio/${data?._id}`) }
                                  }
                                >
                                  <FaPencilAlt />
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
      {isFetching && <Loader />}
    </>
  );
};
export default TwillioList