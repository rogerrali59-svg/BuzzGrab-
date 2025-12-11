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
import { Container, Form, Table } from "react-bootstrap";
import { FaEye, FaPencilAlt, FaRegCheckCircle, FaTrash } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import { adminCategoryList, adminDeleteCategory, adminStatusCategory } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber, truncate } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import { useDebounceEffect } from "../../../utils/useDebounceEffect";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const Category = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Category Management`);

  const isSlider = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  // dedouncing for search
  useDebounceEffect(() => {
    setDebouncedSearch(search.trim());
  }, 1000, [search]);


  const {
    data: categoryList,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["category-list", page, debouncedSearch, state],
    queryFn: async () => {
      const resp = await adminCategoryList(page, debouncedSearch, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });


  // Confirm and delete a category  

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => adminDeleteCategory(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to delete this category ?",
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


  // update status a category  

  const statusMutation = useMutation({
    mutationFn: (payload) => {
      return adminStatusCategory(payload.id, payload.stateId);
    },
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message)
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
    },
  });
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
              / Category Management
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
                onClick={() => { navigate(`/admin/add-category`) }
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
                      <th> Category Image</th>
                      <th> Category Title</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryList?.length > 0 ? (
                      categoryList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>
                              <div className="table-user d-flex align-items-center">
                                <span className="table-user-icon">
                                  <img
                                    className="file-upload-image"
                                    src={data?.image || "/images/static_image.jpg"}
                                    alt="category-img"
                                    crossOrigin="anonymous"
                                  />
                                </span>
                              </div>
                            </td>
                            <td className="text-capitalize">{truncate(data?.title, 50)}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() => { navigate(`/admin/view-category/${data?._id}`) }}
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="btn-small style-two"
                                  title="Update"
                                  onClick={() => { navigate(`/admin/edit-category/${data?._id}`) }}
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
export default Category;