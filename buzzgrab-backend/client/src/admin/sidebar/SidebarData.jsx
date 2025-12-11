/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { LuContact } from "react-icons/lu";
import useDetails from "../../hooks/useDetails";
import useSlider from "../../hooks/useSlider";
import { constant } from "../../utils/constant";
import SubMenu from "./SubMenu";
import * as MdIcons from "react-icons/md";

const SidebarData = () => {
  const isSlider = useSlider();
  const [openSubMenu, setOpenSubMenu] = useState("");
  const details = useDetails();

  useEffect(() => {
    if (isSlider) setOpenSubMenu("");
  }, [isSlider]);

  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? "" : index);
  };

  // Admin Sidebar
  const adminSidebar = [
    { icon: <FaIcons.FaHome />, title: "Dashboard", path: "/admin/dashboard" },
    {
      icon: <FaIcons.FaUsers />,
      title: "User Management",
      iconClosed: <FaIcons.FaAngleDown />,
      iconOpened: <FaIcons.FaAngleUp />,
      subNav: [
        { icon: <FaIcons.FaUsers />, title: "Registers Users", path: "/admin/user-list" },
        { icon: <FaIcons.FaCar />, title: "Registered Drivers", path: "/admin/driver-list" },
        { icon: <FaIcons.FaUserShield />, title: "Sub Admin", path: "/admin/subadmin-list" },
      ],
    },
    { icon: <FaIcons.FaImage />, title: "Banner Management", path: "/admin/banner-list" },
    { icon: <FaIcons.FaFolderOpen />, title: "Category Management", path: "/admin/category-list" },
    { icon: <FaIcons.FaTags />, title: "Brand Management", path: "/admin/brand-list" },
    { icon: <FaIcons.FaStore />, title: "Store Management", path: "/admin/store-list" },
    { icon: <FaIcons.FaBox />, title: "Product Management", path: "/admin/product-list" },
    // { icon: <FaIcons.FaCreditCard />, title: "Subscription Management", path: "/admin/subscription" },
    { icon: <FaIcons.FaBell />, title: "My Notification", path: "/admin/notification" },
    { icon: <LuContact />, title: "Contact Directory", path: "/admin/contact-info" },
    {
      icon: <FaIcons.FaHistory />,
      title: "Logger",
      iconClosed: <FaIcons.FaAngleDown />,
      iconOpened: <FaIcons.FaAngleUp />,

      subNav: [
        {
          icon: <FaIcons.FaExclamationTriangle />,
          title: "Error Logs",
          path: "/admin/error-logs",
        },
        {
          icon: <FaIcons.FaEnvelope />,
          title: "Email Queue",
          path: "/admin/email-queue",
        },
        {
          icon: <FaIcons.FaSignInAlt />,
          title: "Login Activity",
          path: "/admin/login-activity",
        },
        {
          icon: <FaIcons.FaSms />,
          title: "SMS Logs",
          path: "/admin/sms-log",
        },
      ],
    },
    {
      icon: <FaIcons.FaCogs />,
      title: "Settings",
      iconClosed: <FaIcons.FaAngleDown />,
      iconOpened: <FaIcons.FaAngleUp />,
      path: window.location.pathName?.pathName + window?.location?.search,

      subNav: [
        {
          icon: <MdIcons.MdDashboard />,
          title: "CMS",
          path: "/admin/cms-list",
        },
        {
          icon: <FaIcons.FaPhoneAlt />,
          title: "Contact Us",
          path: "/admin/contact-list",
        },
        {
          icon: <FaIcons.FaQuestion />,
          title: "FAQ's",
          path: "/admin/faq-list",
        },
        {
          icon: <FaIcons.FaCheck />,
          title: "Data Check",
          path: "/admin/data-check",
        },
        {
          icon: <FaIcons.FaCloud />,
          title: "SMTP ",
          path: "/admin/smtp-list",
        },
        {
          icon: <FaIcons.FaTwitch />,
          title: "Twillio configuration",
          path: "/admin/twillio-list",
        },
        // {
        //   icon: <FaIcons.FaBackward />,
        //   title: "Backup ",
        //   path: "/admin/backup",
        // },
      ],
    },
  ];

  const subAdminSidebar = [
    { icon: <FaIcons.FaHome />, title: "Dashboard", path: "/subadmin/dashboard" },
    { icon: <FaIcons.FaShoppingCart />, title: "Orders", path: "" },           // Orders icon
    { icon: <FaIcons.FaBell />, title: "Notifications", path: "" },             // Bell is fine
    {
      icon: <FaIcons.FaChartBar />,                                              // Chart icon for analytics
      title: "Report and Analytics",
      iconClosed: <FaIcons.FaAngleDown />,
      iconOpened: <FaIcons.FaAngleUp />,
      subNav: [
        { icon: <FaIcons.FaShoppingBag />, title: "Order Report", path: "" },   // Bag for orders
        { icon: <FaIcons.FaBox />, title: "Product Report", path: "" },          // Box for products
      ],
    },
    { icon: <FaIcons.FaCreditCard />, title: "Transactions", path: "" },        // Credit card for transactions
  ];

  // Decide which sidebar to render based on role
  const sidebarDataValue = details?.roleId === constant.ADMIN_ROLE ? adminSidebar : subAdminSidebar;

  return sidebarDataValue.map((item, index) => (
    <SubMenu
      item={item}
      key={index}
      isOpen={openSubMenu === index}
      toggleSubMenu={() => toggleSubMenu(index)}
    />
  ));
};

export default SidebarData;
