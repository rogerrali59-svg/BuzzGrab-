/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { Link } from 'react-router-dom'
import { constant } from '../utils/constant'

const AuthFooter = () => {
  return (
    <div className="text-center bg-purple copyright mt-0 p-0">
      <p className=" mb-0 py-3">
        © {new Date().getFullYear()}{" "}
        <Link to="/" >
          {constant.PROJECT_NAME}&nbsp;
        </Link>{" "}
        | All Rights Reserved.{" "}
        <Link

          to={constant.COMPANY_LINK}
          target="_blank"
        >
          {constant.COMPANY_NAME}
        </Link>
      </p>
    </div>
  )
}
export default AuthFooter