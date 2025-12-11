/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import "./loader.scss";
function Loader() {
  return (
    <div className="maindiv">
      <div>
        <div className="loadericon">
          <div className="outerCircle"></div>
          <div className="icon">
            <img alt="loader-img" width="10" src={"/images/logo.svg"} className="logoname" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Loader;