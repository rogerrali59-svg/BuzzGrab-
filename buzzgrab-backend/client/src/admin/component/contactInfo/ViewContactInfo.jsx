/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import Loader from "../../../Loader/Loader";
import { adminViewContactInfo } from "../../../services/services";
import usePageTitle from "../../../utils/usePageTitle";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";
import { CheckAdminState } from "../../../utils/CheckAdminState";
import { constant } from "../../../utils/constant";


const ViewContactInfo = () => {

    usePageTitle(`${constant.PROJECT_NAME} |  Contact Directory Details`);
    const isSlider = useSlider();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: viewContact, isFetching } = useQuery({
        queryKey: ["viewContact", { id }],
        queryFn: async () => {
            const res = await adminViewContactInfo(id);
            return res.data?.data;
        },
    });

    return (
        <>
            <div className="mainbox">
                <Sidebar />
                <div className={isSlider ? "body-content close" : "body-content open"}>
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                        <h2 className="mainhead mb-0">
                            <Link to={'/admin/dashboard'} className="bread_color">
                                Home
                            </Link>
                            <Link
                                to={"/admin/contact-info"}
                                className="bread_color"
                            >
                                / Contact Directory
                            </Link>
                            / Contact Directory  Details
                        </h2>
                        <div className="text-end mx-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="theme-btn btn-md mb-2"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <section className="inner-wrap">
                        <Container fluid className="px-0">
                            <div className="custom-card">
                                <Row>
                                    <Col xl={12}>
                                        <Table responsive bordered>
                                            <tbody>
                                                <tr>
                                                    <th>Email</th>
                                                    <td>{viewContact?.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phone number</th>
                                                    <td>{viewContact?.countryCode + viewContact?.mobile}</td>
                                                </tr>
                                                <tr>
                                                    <th>Description</th>
                                                    <td className="text-wrap text-break"
                                                        dangerouslySetInnerHTML={{
                                                            __html: viewContact?.description,
                                                        }}
                                                    ></td>
                                                </tr>
                                                <tr>
                                                    <th>Address</th>
                                                    <td className="text-capitalize">{viewContact?.address}</td>
                                                </tr>
                                                {viewContact?.instaLink &&
                                                    <>
                                                        <tr>
                                                            <th>Instagram URL</th>
                                                            <td>{viewContact?.instaLink}</td>
                                                        </tr>
                                                    </>
                                                }

                                                {
                                                    viewContact?.fbLink &&
                                                    <>
                                                        <tr>
                                                            <th>Facebook URL</th>
                                                            <td>{viewContact?.fbLink}</td>
                                                        </tr>
                                                    </>
                                                }

                                                {
                                                    viewContact?.linkedinLink &&
                                                    <>
                                                        <tr>
                                                            <th>LinedIn URL</th>
                                                            <td>{viewContact?.linkedinLink}</td>
                                                        </tr>
                                                    </>
                                                }

                                                {
                                                    viewContact?.twitterLink &&
                                                    <>
                                                        <tr>
                                                            <th>Twitter URL</th>
                                                            <td>{viewContact?.twitterLink}</td>
                                                        </tr>
                                                    </>
                                                }

                                                <tr>
                                                    <th>Status</th>
                                                    <td>{CheckAdminState(viewContact?.stateId)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Created On </th>
                                                    <td>{moment(viewContact?.createdAt).format("LLL")}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
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
export default ViewContactInfo
