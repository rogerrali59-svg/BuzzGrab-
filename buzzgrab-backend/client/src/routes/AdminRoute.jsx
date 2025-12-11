/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { Route, Routes } from "react-router-dom";
import AdminProfile from "../admin/adminauth/AdminProfile";
import AdminResetPassword from "../admin/adminauth/AdminResetPassword";
import AddProduct from "../admin/component/ProductManagement/AddProduct";
import ProductList from "../admin/component/ProductManagement/ProductList";
import ViewProduct from "../admin/component/ProductManagement/ViewProduct";
import AddBanner from "../admin/component/banner/AddBanner";
import Banner from "../admin/component/banner/Banner";
import AddBrand from "../admin/component/brandManagement/AddBrand";
import BrandList from "../admin/component/brandManagement/BrandList";
import ViewBrand from "../admin/component/brandManagement/ViewBrand";
import AddCategory from "../admin/component/categoryManagement/AddCategory";
import Category from "../admin/component/categoryManagement/Category";
import ViewCategory from "../admin/component/categoryManagement/ViewCategory";
import AddCms from "../admin/component/cms/AddCms";
import CmsList from "../admin/component/cms/CmsList";
import ViewCms from "../admin/component/cms/ViewCms";
import AddContactInfo from "../admin/component/contactInfo/AddContactInfo";
import ContactInfo from "../admin/component/contactInfo/ContactInfo";
import ViewContactInfo from "../admin/component/contactInfo/ViewContactInfo";
import ContactList from "../admin/component/contactus/ContactList";
import ViewContact from "../admin/component/contactus/ViewContact";
import AddFaq from "../admin/component/faq/AddFaq";
import FaqList from "../admin/component/faq/FaqList";
import ViewFaq from "../admin/component/faq/ViewFaq";
import EmailQueue from "../admin/component/logger/EmailQueue";
import ErrorLogs from "../admin/component/logger/ErrorLogs";
import LoginActivity from "../admin/component/logger/LoginActivity";
import SmsLogs from "../admin/component/logger/SmsLogs";
import ViewEmailQueue from "../admin/component/logger/ViewEmailQueue";
import ViewErrorLog from "../admin/component/logger/ViewErrorLog";
import ViewLoginActivity from "../admin/component/logger/ViewLoginActivity";
import ViewSmsLog from "../admin/component/logger/ViewSmsLog";
import NotificationList from "../admin/component/notifications/NotificationList";
import ViewNotification from "../admin/component/notifications/ViewNotification";
import UserReport from "../admin/component/reportmanagement/UserReport";
import AddSmtp from "../admin/component/smtpsetting/AddSmtp";
import Smtp from "../admin/component/smtpsetting/Smtp";
import ViewSmtp from "../admin/component/smtpsetting/ViewSmtp";
import AddStore from "../admin/component/storeManagement/AddStore";
import StoreList from "../admin/component/storeManagement/StoreList";
import ViewStore from "../admin/component/storeManagement/ViewStore";
import AddSubscription from "../admin/component/subscription/AddSubscription";
import SubscriptionList from "../admin/component/subscription/SubscriptionList";
import ViewSubscription from "../admin/component/subscription/ViewSubscription";
import Transcation from "../admin/component/transcation/Transcation";
import ViewTranscation from "../admin/component/transcation/ViewTranscation";
import AddTwillio from "../admin/component/twillio/AddTwillio";
import TwillioList from "../admin/component/twillio/TwillioList";
import ViewTwillio from "../admin/component/twillio/ViewTwillio";
import AddDriver from "../admin/component/userManagement/AddDriver";
import AddSubadmin from "../admin/component/userManagement/AddSubadmin";
import AddUser from "../admin/component/userManagement/AddUser";
import DriverList from "../admin/component/userManagement/DriverList";
import SubadminList from "../admin/component/userManagement/SubadminList";
import UserList from "../admin/component/userManagement/UserList";
import ViewDriver from "../admin/component/userManagement/ViewDriver";
import ViewSubadmin from "../admin/component/userManagement/ViewSubadmin";
import ViewUser from "../admin/component/userManagement/ViewUser";
import Dashboard from "../admin/dashboard/Dashboard";
import NotFound from "../component/NotFound";
import DataCheckList from "../admin/component/dataCheck/DataCheckList";

const AdminRoute = () => {
  return (
    <>
      <Routes>
        {/***********************Dashboard section **********************/}
        <Route path="/dashboard" element={<Dashboard />} />


        {/***********************Admin profile  section **********************/}
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/reset-password" element={<AdminResetPassword />} />


        {/***********************User section **********************/}
        <Route path="/user-list" element={<UserList />} />
        <Route path="/view-user/:id" element={<ViewUser />} />
        <Route path="/edit-user/:id" element={<AddUser />} />


        {/***********************Driver section **********************/}
        <Route path="/driver-list" element={<DriverList />} />
        <Route path="/view-driver/:id" element={<ViewDriver />} />
        <Route path="/edit-driver/:id" element={<AddDriver />} />
        <Route path="/add-driver" element={<AddDriver />} />


        {/***********************sub admin  section **********************/}
        <Route path="/subadmin-list" element={<SubadminList />} />
        <Route path="/view-subadmin/:id" element={<ViewSubadmin />} />
        <Route path="/edit-subadmin/:id" element={<AddSubadmin />} />
        <Route path="/add-subadmin" element={<AddSubadmin />} />


        {/***********************Banner section **********************/}
        <Route path="/banner-list" element={<Banner />} />
        <Route path="/add-banner" element={<AddBanner />} />
        <Route path="/edit-banner/:id" element={<AddBanner />} />


        {/***********************Category  section **********************/}
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/edit-category/:id" element={<AddCategory />} />
        <Route path="/category-list" element={<Category />} />
        <Route path="/view-category/:id" element={<ViewCategory />} />


        {/***********************Brand  section **********************/}
        <Route path="/add-brand" element={<AddBrand />} />
        <Route path="/edit-brand/:id" element={<AddBrand />} />
        <Route path="/brand-list" element={<BrandList />} />
        <Route path="/view-brand/:id" element={<ViewBrand />} />

        {/***********************Store  section **********************/}
        <Route path="/add-store" element={<AddStore />} />
        <Route path="/edit-store/:id" element={<AddStore />} />
        <Route path="/store-list" element={<StoreList />} />
        <Route path="/view-store/:id" element={<ViewStore />} />


        {/***********************Product  section **********************/}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<AddProduct />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />


        {/***********************Subscription section **********************/}
        <Route path="/subscription" element={<SubscriptionList />} />
        <Route path="/add-subscription" element={<AddSubscription />} />
        <Route path="/edit-subscription/:id" element={<AddSubscription />} />
        <Route path="/view-subscription/:id" element={<ViewSubscription />} />


        {/***********************Notification section **********************/}
        <Route path="/notification" element={<NotificationList />} />
        <Route path="/view-notification/:id" element={<ViewNotification />} />


        {/***********************Contact info section **********************/}
        <Route path="/contact-info" element={<ContactInfo />} />
        <Route path="/add-contactinfo" element={<AddContactInfo />} />
        <Route path="/edit-contactinfo/:id" element={<AddContactInfo />} />
        <Route path="/view-contactinfo/:id" element={<ViewContactInfo />} />


        {/***********************Data check section **********************/}
        <Route path="/data-check" element={<DataCheckList />} />


        {/***********************User report section **********************/}
        <Route path="/user-report" element={<UserReport />} />


        {/***********************Logger section **********************/}
        <Route path="/error-logs" element={<ErrorLogs />} />
        <Route path="/view-error/:id" element={<ViewErrorLog />} />
        <Route path="/email-queue" element={<EmailQueue />} />
        <Route path="/email-view/:id" element={<ViewEmailQueue />} />
        <Route path="/login-activity" element={<LoginActivity />} />
        <Route path="/view-login-activity/:id" element={<ViewLoginActivity />} />
        <Route path="/sms-log" element={<SmsLogs />} />
        <Route path="/view-sms-log/:id" element={<ViewSmsLog />} />


        {/***********************Cms section **********************/}
        <Route path="/cms-list" element={<CmsList />} />
        <Route path="/add-cms" element={<AddCms />} />
        <Route path="/edit-cms/:id" element={<AddCms />} />
        <Route path="/view-cms/:id" element={<ViewCms />} />


        {/***********************Contact section **********************/}
        <Route path="/contact-list" element={<ContactList />} />
        <Route path="/view-contact/:id" element={<ViewContact />} />


        {/***********************Faq section **********************/}
        <Route path="/faq-list" element={<FaqList />} />
        <Route path="/add-faq" element={<AddFaq />} />
        <Route path="/edit-faq/:id" element={<AddFaq />} />
        <Route path="/view-faq/:id" element={<ViewFaq />} />


        {/***********************Smtp section**********************/}
        <Route path="/smtp-list" element={<Smtp />} />
        <Route path="/add-smtp" element={<AddSmtp />} />
        <Route path="/edit-smtp/:id" element={<AddSmtp />} />
        <Route path="/view-smtp/:id" element={<ViewSmtp />} />


        {/***********************Twillio section**********************/}

        <Route path="/twillio-list" element={<TwillioList />} />
        <Route path="/add-twillio" element={<AddTwillio />} />
        <Route path="/edit-twillio/:id" element={<AddTwillio />} />
        <Route path="/view-twillio/:id" element={<ViewTwillio />} />

        {/***********************Transcation section **********************/}
        <Route path="/transactions-list" element={<Transcation />} />
        <Route path="/view-transactions/:id" element={<ViewTranscation />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AdminRoute;
