/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useSlider from "../../hooks/useSlider";
import { useDispatch, useSelector } from "react-redux";
import { activeMenu } from "../../redux/features/activeSidebar";
import "./sidebar.scss";

const SubMenu = ({ item, isOpen, toggleSubMenu }) => {

  const slider = useSlider();
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const queryParam = query.get("id");
  const activeSidebarName = useSelector((state) => state?.activesidebar?.details);

  function extractId(url) {
    const regex = /id=([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match && match[1];
  }

  useEffect(() => {
    let isActive = false;
    if (queryParam) {
      isActive = item.subNav?.some(subItem => queryParam === extractId(subItem.path));
    } else {
      isActive = item.subNav?.some(subItem => subItem.path === location.pathname);
    }
    if (isActive) toggleSubMenu();
  }, [queryParam]);

  const isactiveSubmenu = (url) => {
    if (queryParam) return extractId(url) === queryParam;
    return location.pathname === url;
  };

  return (
    <div
      className={`sidebar-link-wrapper ${slider ? "collapsed" : "expanded"}`}
      onMouseEnter={() => slider && setHover(true)}
      onMouseLeave={() => slider && setHover(false)}
    >
      {item.subNav ? (
        <a

          onClick={(e) => {
            e.preventDefault();
            dispatch(activeMenu(item.title));
            if (!slider) toggleSubMenu();
          }}
          className={`${activeSidebarName === item.title ? "active-menu" : ""}`}
        >
          <span className="value">
            {item.icon}
            {!slider && <span>{item.title}</span>}
          </span>
          {!slider && (
            <span className="icon">
              {isOpen ? item.iconOpened : item.iconClosed}
            </span>
          )}
        </a>
      ) : (
        <>
          <Link
            to={item.path}
            className={`${activeSidebarName === item.title ? "active-menu" : ""}`}
            onClick={() => dispatch(activeMenu(item.title))}
          >
            <span className="value">
              {item.icon}
              {!slider && <span>{item.title}</span>}
            </span>
          </Link>

          {slider && hover && (
            <Link
              to={item.path}
              className="hover-title"
              onClick={() => dispatch(activeMenu(item.title))}
            >
              {item.title}
            </Link>
          )}
        </>
      )}

      {slider && hover && item.subNav && ( 
        <div className="hover-subnav">
          {item.subNav.map((subItem, index) => (
            <Link
              key={index}
              to={subItem.path}
              className={isactiveSubmenu(subItem.path) ? "active" : ""}
              onClick={() => dispatch(activeMenu(""))}
            >
              {subItem.icon}
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}

      {!slider && isOpen && item.subNav && (
        <div className="subnav">
          {item.subNav.map((subItem, index) => (
            <Link
              key={index}
              to={subItem.path}
              className={isactiveSubmenu(subItem.path) ? "active" : ""}
              onClick={() => dispatch(activeMenu(""))}
            >
              {subItem.icon}
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

};
export default SubMenu;
