/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.toxsl.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import moment from "moment";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import DataNotFound from "../../../Loader/DataNotFound";
import Loader from "../../../Loader/Loader";
import useSlider from "../../../hooks/useSlider";
import { adminAddDataCheck, adminDataCheck, adminDeleteDataCheck } from "../../../services/services";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { toastAlert } from "../../../utils/SweetAlert";
import { constant } from "../../../utils/constant";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { restrictAlpha } from "../../../utils/helper";

const DataCheckList = () => {

    usePageTitle(`${constant.PROJECT_NAME} | Data Check`);
    const isSlider = useSlider();
    const queryClient = useQueryClient();

    const {
        data: dataCheck,
        isFetching
    } = useQuery({
        queryKey: ["dataCheck-list"],
        queryFn: async () => {
            const resp = await adminDataCheck();
            return resp?.data?.data ?? [];
        },
    });

    // Confirm action and delete the datacheck entry

    const { mutate, isPending } = useMutation({
        mutationFn: (payload) => adminDeleteDataCheck(payload),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["dataCheck-list"] });
        },
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this data check ?",
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


    // Handles add datacheck mutation and post-success actions.

    const mutation = useMutation({
        mutationFn: (body) => {
            return adminAddDataCheck(body);
        },
        onSuccess: (resp) => {
            values?.id
                ? toastAlert("success", resp?.data?.message)
                : toastAlert("success", resp?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["dataCheck-list"] });
            resetForm();
        },
    });


    // Initializes Formik for the add datacheck form

    const { values, handleSubmit, touched, errors, resetForm, setValues, setFieldValue
    } = useFormik({
        initialValues: {
            date: "",
        },
        validationSchema: yup.object().shape({
            date: yup.string().required().label("DataCheck"),
        }),
        onSubmit: async (values) => {
            let body = {
                date: moment(values?.date).format("YYYY-MM-DD"),
            };
            mutation.mutate(body);
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
                            / DataCheck Management / {values?.id ? "Update DataCheck" : "Add DataCheck"}
                        </h2>
                    </div>
                    <section className="inner-wrap">
                        <Container fluid className="px-0">
                            <div className="custom-card ">
                                <Form>
                                    <Row className="justify-content-center">
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="title">
                                                    DataCheck<span className="text-danger"> *</span>
                                                </Form.Label>

                                                <div className="select-date">
                                                    <DatePicker
                                                        autoComplete="off"
                                                        name="date"
                                                        selected={values?.date}
                                                        onChange={(date) => {
                                                            setFieldValue("date", date);
                                                        }}
                                                        placeholderText="Select Date"
                                                        onKeyDown={restrictAlpha}
                                                        minDate={new Date()}
                                                    />
                                                </div>

                                                <span className="text-danger">{touched?.date && errors?.date}</span>
                                            </Form.Group>
                                        </Col>

                                        <div className="text-center mt-4">
                                            <button
                                                className="theme-btn btn-md mb-2 me-5"
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                {values?.id ? "Update" : "Submit"}
                                            </button>

                                            {values?.id && (
                                                <button
                                                    className="theme-btn btn-md mb-2 me-5"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setFieldValue("date", "");
                                                        setFieldValue("id", "");
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                    </Row>
                                </Form>
                            </div>
                        </Container>
                    </section>

                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                        <h2 className="mainhead mb-0">
                            <Link
                                to="/admin/dashboard"
                                className="bread_color"
                            >
                                Home
                            </Link>
                            / DataCheck Management
                        </h2>

                    </div>
                    <section className="inner-wrap">
                        <Container fluid className="px-0">
                            <div className="custom-card">
                                <Table striped responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Sn.</th>
                                            <th>DataCheck</th>
                                            <th>Created On</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCheck?.length > 0 ? (
                                            dataCheck?.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{moment(data?.date).format("L")}</td>
                                                        <td>{moment(data?.createdAt).format("LLL")}</td>
                                                        <td>{CheckAdminState(data?.stateId)}</td>
                                                        <td>
                                                            <div className="action-btn">

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
            {(isFetching || isPending || mutation?.isPending) && <Loader />}
        </>
    );
};
export default DataCheckList;