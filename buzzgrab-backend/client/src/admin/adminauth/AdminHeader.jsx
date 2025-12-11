/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown } from "react-bootstrap";
import { FaBars, FaBell, FaPen, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useDetails from "../../hooks/useDetails";
import useSlider from "../../hooks/useSlider";
import { login } from "../../redux/features/authSlice";
import { slider } from "../../redux/features/sliderSlice";
import { adminNotificationCount, logOut } from "../../services/services";
import { toastAlert } from "../../utils/SweetAlert";
import { constant } from "../../utils/constant";

const AdminHeader = () => {

  const data = useDetails();
  const dispatch = useDispatch();
  const isSlider = useSlider();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "Do you want to logout ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout it!",
      confirmButtonColor: "#005CDC",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutMutation.mutate();
      }
    });
  };

  const logoutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      localStorage.clear();
      dispatch(login(""));
    },
  });

  const {
    data: notification
  } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const resp = await adminNotificationCount();
      return resp?.data ?? [];
    },

  });

  return (
    <>
      <header className={isSlider ? "header close" : "header open"}>
        <ul>
          <div className="navicon">
            <span
              onClick={() => {
                if (isSlider) {
                  dispatch(slider(false));
                } else {
                  dispatch(slider(true));
                }
              }}
            >
              <FaBars />
            </span>
          </div>

          <div className="header-right">
            <div className="notification-wrapper" onClick={() => navigate("/admin/notification")}>
              <FaBell className="notification-icon" />
              {
                notification?.data &&
                <span className="notification-count">{notification?.data ?? ""}</span>
              }
            </div>
            <div className="admin-drop">

              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  <span className="img-ic">
                    <img
                      src={
                        data?.profileImg ?
                          data?.profileImg
                          : "/images/default.png"
                      }
                      alt="Image"
                      crossOrigin="anonymous"
                    />
                  </span>
                  {data?.firstName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      navigate(data?.roleId == constant.ADMIN_ROLE ? "/admin/profile" : "/subadmin/profile")
                    }
                  >
                    <FaUser /> Profile
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() =>
                      navigate(
                        data?.roleId == constant.ADMIN_ROLE ? "/admin/reset-password" : "/subadmin/reset-password"
                      )
                    }
                  >
                    <FaPen /> Change Password
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt />
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </ul>
      </header >
    </>
  );
};

export default AdminHeader;