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
import { FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSlider from "../../../hooks/useSlider";
import DataNotFound from "../../../Loader/DataNotFound";
import { Pagination } from "../../../Pagination/Pagination";
import { adminSmsAllDelete, adminSmsDelete, adminSmsLog } from "../../../services/services";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import { useDebounceEffect } from "../../../utils/useDebounceEffect";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const SmsLogs = () => {

    usePageTitle(`${constant.PROJECT_NAME} | Sms Logs`);
    const isSlider = useSlider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [meta, setMeta] = useState("");
    const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

    // dedouncing for search
    useDebounceEffect(() => {
        setDebouncedSearch(search.trim());
    }, 300, [search]);

    const {
        data: smsListing,
        refetch
    } = useQuery({
        queryKey: ["sms-log", page, debouncedSearch],
        queryFn: async () => {
            const resp = await adminSmsLog(page, debouncedSearch);
            setMeta(resp?.data?._meta);
            return resp?.data?.data ?? [];
        },
    });

    // Show confirmation dialog before deleting a single sms queue entry

    const handleSingleDelete = (id) => {
        Swal.fire({
            title: "Are you sure ?",
            text: "Do you want to delete the Sms queue ?",
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
        mutationFn: (payload) => adminSmsDelete(payload),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["sms-log"] });
        },
    });

    // Show confirmation dialog before deleting all sms queues

    const handleAllDelete = () => {
        Swal.fire({
            title: "Are you sure ?",
            text: "Do you want to delete all the Sms queue ?",
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
        mutationFn: () => adminSmsAllDelete(),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["sms-log"] });
        },
    });

    return (
        <>
            <div className="mainbox">
                <Sidebar />
                <div className={isSlider ? "body-content close" : "body-content open"}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="mainhead mb-0">
                            <Link
                                to="/admin/dashboard"
                                className="bread_color">
                                Home
                            </Link>
                            / Sms Logs
                        </h2>
                        <div className=" d-flex align-items-center gap-3 my-2 mx-1 onmobile onmobile-center">

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
                                className="btn btn-danger email_btn w-100"
                                disabled={smsListing?.length === 0}
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
                                            <th>To</th>
                                            <th>Created On</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {smsListing?.length > 0 ? (
                                            smsListing?.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{serialNumber(page, index)}</th>
                                                        <td>{data?.to}</td>
                                                        <td>{moment(data?.createdAt).format("LLL")}</td>
                                                        <td>
                                                            <div className="action-btn">

                                                                <button
                                                                    title="View"
                                                                    onClick={() => {
                                                                        navigate(`/admin/view-sms-log/${data?._id}`);
                                                                    }}
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
        </>
    );
};

export default SmsLogs
