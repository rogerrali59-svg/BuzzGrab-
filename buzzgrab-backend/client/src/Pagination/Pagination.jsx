/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import React from "react";
import ReactPaginate from "react-paginate";
import { Paginations } from "../utils/constant";
import "./pagination.scss";
export function Pagination(props) {
  const { totalCount, handelPageChange } = props;
  return (
    <div className="float-end">
      {Math.ceil(totalCount / Paginations?.PER_PAGE) > 1 && (
        <div>
          <ReactPaginate
            containerClassName={"pagination position-relative mt-5 pt-3"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            previousLabel={"Preview"}
            nextLabel={"Next"}
            onPageChange={(e) => handelPageChange(e)}
            pageCount={Math.ceil(totalCount / Paginations?.PER_PAGE)}
          />
        </div>
      )}
    </div>
  );
}

export function FivePagination(props) {
  const { totalCount, handelPageChange } = props;
  return (
    <div className="float-end">
      {Math.ceil(totalCount / Paginations?.PER_PAGE_FIVE) > 1 && (
        <div>
          <ReactPaginate
            containerClassName={"pagination position-relative mt-5 pt-3"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            previousLabel={"Preview"}
            nextLabel={"Next"}
            onPageChange={(e) => handelPageChange(e)}
            pageCount={Math.ceil(totalCount / Paginations?.PER_PAGE_FIVE)}
          />
        </div>
      )}
    </div>
  );
}

