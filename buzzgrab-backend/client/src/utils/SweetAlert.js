/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import Swal from "sweetalert2";
export const toastAlert = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 3000,
  });
};