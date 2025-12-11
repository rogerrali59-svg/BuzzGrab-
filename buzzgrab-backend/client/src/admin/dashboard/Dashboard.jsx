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
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import { FaCreditCard, FaFolderOpen, FaTags, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useSlider from "../../hooks/useSlider";
import { adminDashboardCounts, adminGraphData } from "../../services/services";
import { constant } from "../../utils/constant";
import usePageTitle from "../../utils/usePageTitle";
import AdminFooter from "../adminauth/AdminFooter";
import Sidebar from "../sidebar/Sidebar";

const Dashboard = () => {

  usePageTitle(`${constant.PROJECT_NAME} | Dashboard `)
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
  const [dashboard, setDashboard] = useState([]);

  const dashboardCount = useQuery({
    queryKey: ["dashboardCount"],
    queryFn: async () => {
      const resp = await adminDashboardCounts();
      return resp?.data?.data ?? "";
    },
  });

  useEffect(() => {
    getGraphCounts(selectedYear);
  }, [selectedYear]);

  const getGraphCounts = async (selectedYear) => {
    try {
      const response = await adminGraphData(selectedYear);
      if (response?.status === 200) {
        setDashboard(
          response?.data?.data?.map((data) => {
            return data;
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const years = Array.from(
    { length: 50 },
    (_, index) => new Date().getFullYear() - index
  );
  const headerData = [
    "Months",
    "Registered Users",
    "Category",
    "Brand",
    "Subscription",
  ];

  const data = [headerData, ...dashboard];

  const options = {
    colors: [
      "#FE9F43",
      "#092C4C",
      "#0E9384",
      "#a8990b",
    ],
    is3D: true,
  };
  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <h2 className="mainhead mb-0">
            <Link to="/admin/dashboard" className="bread_color">
              Home
            </Link>
            / Dashboard
          </h2>
          <div className="dash-widget ">
            <Row>
              <Col xl={3} md={6}>
                <div
                  className="widgetcard card1 mt-lg-0 "
                  onClick={() =>
                    navigate(`/admin/user-list?stateId=${constant.INACTIVE}`)}
                >
                  <div className="value">
                    <p>Registered Users</p>
                    <h4>{dashboardCount?.data?.totalUserCount ?? 0}</h4>
                  </div>
                  <div className="icon icon-one"><FaUsers /></div>
                </div>
              </Col>

              <Col xl={3} md={6}>
                <div
                  className="widgetcard card2 mt-lg-0 mt-md-0 "
                  onClick={() =>
                    navigate(`/admin/category-list`)}
                >
                  <div className="value">
                    <p>Category</p>
                    <h4>{dashboardCount?.data?.totalCategoryCount ?? 0}</h4>
                  </div>
                  <div className="icon icon-two"><FaFolderOpen /></div>
                </div>
              </Col>

              <Col xl={3} md={6}>
                <div
                  className="widgetcard card3 mt-lg-0 "
                  onClick={() => navigate("/admin/brand-list")}
                >
                  <div className="value">
                    <p>Brand</p>
                    <h4>{dashboardCount?.data?.totalBrandCount ?? 0}</h4>
                  </div>
                  <div className="icon icon-three"><FaTags /></div>
                </div>
              </Col>

              <Col xl={3} md={6}>
                <div
                  className="widgetcard card4 mt-lg-0 "
                  onClick={() =>
                    navigate("/admin/subscription")}>
                  <div className="value">
                    <p>Subscription</p>
                    <h4>{dashboardCount?.data?.totalSubscriptionCount ?? 0}</h4>
                  </div>
                  <div className="icon icon-four"><FaCreditCard /></div>
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
                    {years?.map((year) => (
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
                    height="600px"
                    data={data}
                    options={options}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};
export default Dashboard;