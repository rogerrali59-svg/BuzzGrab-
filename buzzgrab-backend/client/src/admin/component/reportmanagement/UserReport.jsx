/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { Col, Container, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import AdminFooter from '../../adminauth/AdminFooter';
import Sidebar from '../../sidebar/Sidebar';
import useSlider from '../../../hooks/useSlider';
import * as yup from "yup";
import { useMutation } from '@tanstack/react-query';
import { toastAlert } from '../../../utils/SweetAlert';
import { useFormik } from 'formik';
import { adminDownloadUserReports } from '../../../services/services';
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import usePageTitle from '../../../utils/usePageTitle';
import { constant } from '../../../utils/constant';

const UserReport = () => {
    const isSlider = useSlider();
    usePageTitle(`${constant.PROJECT_NAME} | User Report`);
    const [noData, setNoData] = useState(false);
    const downloadMutation = useMutation({
        mutationFn: ({ startDate, endDate }) => adminDownloadUserReports(startDate, endDate),
        onSuccess: (resp) => {
            if (resp?.data?.data) {
                window.open(resp?.data?.data, "_blank");
            }
            toastAlert("success", resp?.data?.message);
            setNoData(!resp?.data?.data ? true : false);
            if (resp?.data?.message == "Report download successfully" || resp?.data?.data) {
                resetForm();
            }
        },
    });

    const {
        values,
        handleSubmit,
        touched,
        errors,
        setFieldValue,
        resetForm,
    } = useFormik({
        initialValues: {
            startDate: "",
            endDate: "",
        },
        validationSchema: yup.object().shape({
            startDate: yup.string().label("Select start date").required(),
            endDate: yup.string().label("Select end date").required(),
        }),
        onSubmit: async (values) => {
            const payload = {
                startDate: moment(values?.startDate).format("YYYY-MM-DD"),
                endDate: moment(values?.endDate).format("YYYY-MM-DD"),
            };
            downloadMutation.mutate(payload);
        },
    });

    const renderNoDataMessage = () => {
        if (noData == true) {
            return (
                <div className="no-data-message text-center">
                    No users are registered between these dates.
                </div>
            );
        } else {
            return null
        }

    };
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
                            / Users Report
                        </h2>
                    </div>

                    <section className="inner-wrap">
                        <Container fluid className="px-0">
                            <div className="custom-card">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col lg={6} className="mx-auto">
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-bold">
                                                    Start Date
                                                    <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <div className="select-date">
                                                    <DatePicker
                                                        autoComplete="off"
                                                        name="startDate"
                                                        selected={values?.startDate}
                                                        onChange={(date) => {
                                                            setFieldValue("startDate", date);
                                                            setFieldValue("endDate", "");
                                                        }}
                                                        placeholderText="Select start Date"
                                                    />
                                                </div>
                                                {touched?.startDate && errors?.startDate && (
                                                    <span className="text-danger">
                                                        {touched?.startDate && errors?.startDate}
                                                    </span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} className="mx-auto">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    End Date
                                                    <span className="text-danger"> *</span>
                                                </Form.Label>
                                                <div className="select-date">
                                                    <DatePicker
                                                        autoComplete="off"
                                                        name="endDate"
                                                        selected={values?.endDate}
                                                        onChange={(date) => setFieldValue("endDate", date)}
                                                        placeholderText="Select end Date"
                                                        minDate={values?.startDate}
                                                    />
                                                </div>
                                                <span className="text-danger">
                                                    {touched?.endDate && errors?.endDate}
                                                </span>
                                            </Form.Group>
                                            <div className="text-end">
                                                <button className="theme-btn btn-md mb-2" type="submit">
                                                    Submit
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                                {noData && renderNoDataMessage()}
                            </div>
                        </Container>
                    </section>
                </div>
                <AdminFooter />
            </div>
        </>
    )
}
export default UserReport