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
import React, { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { Pagination } from "../../../Pagination/Pagination";
import { adminPaymentList } from "../../../services/services";
import { constant, Paginations } from "../../../utils/constant";
import { serialNumber } from "../../../utils/helper";
import AdminFooter from "../../adminauth/AdminFooter";
import Sidebar from "../../sidebar/Sidebar";

const Transcation = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const {
    data: transcationList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["transcationList", page],
    queryFn: async () => {
      const resp = await adminPaymentList(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

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
              /Transactions
            </h2>
          </div>
          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Table striped responsive bordered>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Purchased by</th>
                      <th>Subscription type </th>
                      <th>Price({constant.NIGERIAN})</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcationList?.length > 0 ? (
                      transcationList?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber(page, index)}</th>
                            <td>{data?.userData?.firstName}</td>
                            <td>
                              <b>
                                {data?.subscriptionData?.subscriptionType ===
                                  constant.SUBSCRIPTION_TYPE_BASIC &&
                                  "Basics subscription"}
                                {data?.subscriptionData?.subscriptionType ===
                                  constant.SUBSCRIPTION_TYPE_PREMIUM &&
                                  "Premium subscription"}
                                {data?.subscriptionData?.subscriptionType ===
                                  constant.SUBSCRIPTION_TYPE_GOLD &&
                                  "Gold subscription"}
                              </b>
                            </td>
                            <td>
                              {data?.subscriptionData?.subscriptionType ==
                              constant.SUBSCRIPTION_TYPE_BASIC ? (
                                "Free"
                              ) : (
                                <>
                                  {constant.NIGERIAN}
                                  {Number(
                                    data?.subscriptionData?.price
                                  )?.toLocaleString()}
                                </>
                              )}
                            </td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      `/admin/view-transactions/${data?._id}`
                                    )
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          Data Not Found
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

export default Transcation;
