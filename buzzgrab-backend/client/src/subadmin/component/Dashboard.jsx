/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { constant } from "../../utils/constant";
import useSlider from "../../hooks/useSlider";
import Sidebar from "../../admin/sidebar/Sidebar";
import AdminFooter from "../../admin/adminauth/AdminFooter";
import usePageTitle from "../../utils/usePageTitle";
import moment from "moment";

const Dashboard = () => {
    usePageTitle(`${constant.PROJECT_NAME} | Dashboard`);
    const isSlider = useSlider();
    const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

    // Dummy counts
    const orderCount = 120;

    // Dummy graph data for orders
    const dummyGraphData = [
        ["Month", "Orders"],
        ["Jan", 10],
        ["Feb", 15],
        ["Mar", 20],
        ["Apr", 25],
        ["May", 30],
        ["Jun", 22],
        ["Jul", 18],
        ["Aug", 28],
        ["Sep", 24],
        ["Oct", 30],
        ["Nov", 35],
        ["Dec", 40],
    ];

    const options = {
        colors: ["#FE9F43"],
        is3D: false,
    };

    const years = Array.from(
        { length: 10 },
        (_, index) => new Date().getFullYear() - index
    );

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // Optionally, you can filter dummyGraphData based on year here
    };

    return (
        <div className="mainbox">
            <Sidebar />
            <div className={isSlider ? "body-content close" : "body-content open"}>
                <h2 className="mainhead mb-0">
                    <Link to="/subadmin/dashboard" className="bread_color">
                        Home
                    </Link>
                    / Dashboard
                </h2>

                <div className="dash-widget">
                    <Row>
                        <Col xl={3} md={6}>
                            <div className="widgetcard card1 mt-lg-0">
                                <div className="value">
                                    <p>Orders</p>
                                    <h4>{orderCount}</h4>
                                </div>
                                <div className="icon icon-one">
                                    <FaUsers />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="inner-wrap">
                    <div className="custom-card">
                        <Row>
                            <Col xl={3} className="ms-auto mb-4">
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="form-select cursor"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col xl={12}>
                                <Chart
                                    chartType="Bar"
                                    width="100%"
                                    height="500px"
                                    data={dummyGraphData}
                                    options={options}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <AdminFooter />
        </div>
    );
};

export default Dashboard;