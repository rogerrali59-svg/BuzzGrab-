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
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import { Pagination } from "../../../Pagination/Pagination";
import { adminContactInfo, adminDeleteContactInfo } from "../../../services/services";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { CheckAdminState } from "../../../utils/CheckAdminState";

const ContactInfo = () => {

    usePageTitle(`${constant.PROJECT_NAME} | Contact Info`);

    const isSlider = useSlider();
    const navigate = useNavigate();
    const [meta, setMeta] = useState("");
    const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
    const queryClient = useQueryClient();

    const { data: contactInfoList, isFetching } = useQuery({
        queryKey: ["contact-info", page],
        queryFn: async () => {
            const resp = await adminContactInfo(page);
            setMeta(resp?.data?._meta);
            return resp?.data?.data ?? [];
        },
    });

    // Delete contct info
    const { mutate } = useMutation({
        mutationFn: (payload) => adminDeleteContactInfo(payload),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["contact-info"] });
        },
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure ?",
            text: "Do you want to delete this contact directory ?",
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
                            / Contact Directory 
                        </h2>
                        <div className=" d-flex align-items-center gap-3 my-2 mx-1 onmobile">


                            <button
                                type="button"
                                className="theme-btn btn-md"
                                onClick={() => { navigate(`/admin/add-contactinfo`) }
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
                                            <th>Email</th>
                                            <th>Phone number</th>
                                            <th>Created On</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactInfoList?.length > 0 ? (
                                            contactInfoList?.map((data, index) => {
                                                
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{serialNumber(page, index)}</th>
                                                        <td>{data?.email}</td>
                                                        <td>{data?.countryCode + " " + data?.mobile}</td>
                                                        <td>{moment(data?.createdAt).format("LLL")}</td>
                                                        <td>{CheckAdminState(data?.stateId)}</td>
                                                        <td>
                                                            <div className="action-btn">

                                                                <button
                                                                    title="View"
                                                                    onClick={() => { navigate(`/admin/view-contactinfo/${data?._id}`) }
                                                                    }
                                                                    className="btn-small style-one"
                                                                >
                                                                    <FaEye />
                                                                </button>

                                                                <button
                                                                    className="btn-small style-two"
                                                                    title="Update"
                                                                    onClick={() => { navigate(`/admin/edit-contactinfo/${data?._id}`) }
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

export default ContactInfo