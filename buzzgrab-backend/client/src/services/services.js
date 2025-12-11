/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import axios from "axios";
import { store } from "../redux/store";
import { Paginations } from "../utils/constant";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* request interceptor */
http.interceptors.request.use(
  function (config) {
    let token = store.getState()?.auth?.details?.token;
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * Login
 * @param {*} body 
 * @returns 
 */
export const loginApi = async (body) => {
  return await http.post(`/auth/login`, body);
};


/**
 * Verify otp
 * @param {*} body 
 * @returns 
 */
export const verifyOTP = async (body) => {
  return await http.put(`/auth/verifyOtp`, body);
};


/**
 * Forgot password
 * @param {*} body 
 * @returns 
 */
export const forgotPassword = async (body) => {
  return await http.put(`/auth/forgotPassword`, body);
};


/**
 * Reset password
 * @param {*} body 
 * @returns 
 */
export const resetPassword = async (body) => {
  return await http.put(`/auth/resetPassword`, body);
};


/**
 * Change password
 * @param {*} body 
 * @returns 
 */
export const changePassword = async (body) => {
  return await http.put(`/auth/changePassword`, body);
};


/**
 * Admin add contact us
 * @param {*} body 
 * @returns 
 */
export const addContactuS = async (body) => {
  return await http.post(`/contactUs/add`, body);
};


/**
 * Static page
 * @param {*} typeId 
 * @returns 
 */
export const staticPages = async (typeId) => {
  return await http.get(`/pages/cms/${typeId}`);
};


/**
 * User view contact
 * @returns 
 */
export const getContactDirectoryListAdmin = async () => {
  return await http.get(`/user/contactUs/list`);
};


/**
 * Logout
 * @returns 
 */
export const logOut = async () => {
  return await http.post(`/auth/logout`);
};


/**
 * Admin / Subadmin Notification count
 * @param {*} page 
 * @returns 
 */
export const adminNotificationCount = async () => {
  return await http.get(`/admin/notification/count`);
};


/**
 * Admin / Subadmin Notification list
 * @param {*} page 
 * @returns 
 */
export const adminNotificationList = async (page) => {
  return await http.get(`/admin/notification`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE
    },
  });
};


/**
 * Admin / Subadmin Notification delete
 * @returns 
 */
export const adminNotificationDelete = async () => {
  return await http.delete(`/admin/notification/deleteAll`);
};


/**
 * Admin / Subadmin notification view
 * @param {*} id 
 * @returns 
 */
export const adminViewNotification = async (id) => {
  return await http.get(`/admin/notification/view/${id}`);
};


/**
 * Admin / Subadmin update profile
 * @param {*} body 
 * @returns 
 */
export const customerEditProfile = async (body) => {
  return await http.put(`/auth/editProfile`, body);
};


/**
 * Admin / Subadmin view profile
 * @returns 
 */
export const customerProfileView = async () => {
  return await http.get(`/auth/profile`);
};


/**
 * Admin dashboard count
 * @returns
 */
export const adminDashboardCounts = async () => {
  return await http.get(`/admin/dashboard/count`);
};


/**
 * Admin graph data
 * @param {*} year
 * @returns
 */
export const adminGraphData = async (year) => {
  return await http.get(`/admin/dashboard/graphData/${year}`);
};


/**
 * Admin user , driver,subadmin list
 * @param {*} state
 * @param {*} search
 * @param {*} page
 * @param {*} roleId
 * @returns
 */
export const adminUserList = async (page, search, state, roleId) => {
  return await http.get(`/admin/user/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      state: state,
      roleId: roleId,
    },
  });
};


/**
 * Admin user , driver,subadmin view
 * @param {*} id 
 * @returns 
 */
export const adminUserView = async (id) => {
  return await http.get(`/admin/user/view/${id}`);
};


/**
 * Admin user , driver,subadmin edit
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminEditUser = async (id, body) => {
  return await http.put(`/admin/user/edit/${id}`, body);
};


/**
 * Admin driver,subadmin  add
 * @param {*} body 
 * @returns 
 */
export const adminAddUser = async (body) => {
  return await http.post(`/admin/user/add`, body);
};


/**
 * Admin user , driver,subadmin update status with reason
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUserUpdate = async (id, body) => {
  return await http.put(`/admin/user/updateState/${id}`, body);
};


/**
 *  Admin  approve user front img for verification
 * @param {*} id 
 * @param {*} isFrontImgVerified 
 * @returns 
 */
export const adminApproveFrontImg = async (id, isFrontImgVerified) => {
  return await http.put(`/admin/user/verifyFrontImg/${id}?isFrontImgVerified=${isFrontImgVerified}`);
};


/**
 * Admin approve user back img for verification
 * @param {*} id 
 * @param {*} isBackImgVerified 
 * @returns 
 */
export const adminApproveBackImg = async (id, isBackImgVerified) => {
  return await http.put(`/admin/user/verifyBackImg/${id}?isBackImgVerified=${isBackImgVerified}`);
};


/**
 * Admin approve user live img for verification
 * @param {*} id 
 * @param {*} isLiveSelfyImgVerified 
 * @returns 
 */
export const adminApproveLiveImg = async (id, isLiveSelfyImgVerified) => {
  return await http.put(`/admin/user/verifySelfImg/${id}?isLiveSelfyImgVerified=${isLiveSelfyImgVerified}`);
};



/**
 * Admin  category list
 * @param {*} page 
 * @param {*} search 
 * @param {*} state 
 * @returns 
 */
export const adminCategoryList = async (page, search, state) => {
  return await http.get(`/admin/category/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      state: state,
    },
  });
};


/**
 * Admin add  category 
 * @param {*} body 
 * @returns 
 */
export const adminAddCategory = async (body) => {
  return await http.post(`/admin/category/add`, body);
};


/**
 * Admin view  category 
 * @param {*} id 
 * @returns 
 */
export const adminCategoryView = async (id) => {
  return await http.get(`/admin/category/detail/${id}`);
};


/**
 * Admin update  category 
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateCategory = async (id, body) => {
  return await http.put(`/admin/category/update/${id}`, body);
};


/**
 * Admin update category status
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */

export const adminStatusCategory = async (id, stateId) => {
  return await http.put(`/admin/category/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin delete category 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteCategory = async (id) => {
  return await http.delete(`/admin/category/delete/${id}`);
};


/**
 * Admin brand list
 * @param {*} page 
 * @param {*} search 
 * @param {*} stateId 
 * @returns 
 */
export const adminBrandList = async (page, search, stateId) => {
  return await http.get(`/admin/brand/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: stateId,
    },
  });
};


/**
 * Admin add brand
 * @param {*} body 
 * @returns 
 */
export const adminAddBrand = async (body) => {
  return await http.post(`/admin/brand/add`, body);
};


/**
 * Admin view brand
 * @param {*} id 
 * @returns 
 */
export const adminViewBrand = async (id) => {
  return await http.get(`/admin/brand/detail/${id}`);
};


/**
 * Admin update brand
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateBrand = async (id, body) => {
  return await http.put(`/admin/brand/update/${id}`, body);
};


/**
 * Admin update brand status
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */
export const adminUpdateStatusBrand = async (id, stateId) => {
  return await http.put(`/admin/brand/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin delete brand 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteBrand = async (id) => {
  return await http.delete(`/admin/brand/delete/${id}`);
};


/**
 * Admin  store list
 * @param {*} page 
 * @param {*} search 
 * @param {*} state 
 * @returns 
 */
export const adminStoreList = async (page, search, stateId) => {
  return await http.get(`/admin/store/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: stateId,
    },
  });
};


/**
 * Admin add  store 
 * @param {*} body 
 * @returns 
 */
export const adminAddStore = async (body) => {
  return await http.post(`/admin/store/add`, body);
};


/**
 * Admin view  store 
 * @param {*} id 
 * @returns 
 */
export const adminViewStore = async (id) => {
  return await http.get(`/admin/store/details/${id}`);
};


/**
 * Admin update  store 
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateStore = async (id, body) => {
  return await http.put(`/admin/store/edit/${id}`, body);
};


/**
 * Admin update store status
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */

export const adminUpdateStoreStatus = async (id, stateId) => {
  return await http.put(`/admin/store/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin delete store 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteStore = async (id) => {
  return await http.delete(`/admin/store/delete/${id}`);
};


/**
 * Admin can assign store to subadmin
 * @param {*} id 
 * @param {*} subAdmin 
 * @returns 
 */
export const adminAssignStore = async (id, subAdmin) => {
  return await http.put(`/admin/store/assignStore/${id}?subAdmin=${subAdmin}`);
};


/**
 * Admin can unassign store to subadmin
 * @param {*} id 
 * @param {*} subAdmin 
 * @returns 
 */
export const adminUnassignStore = async (id, subAdmin) => {
  return await http.put(`/admin/store/unAssign/${id}?subAdmin=${subAdmin}`);
};


/**
 * Admin  product list
 * @param {*} page 
 * @param {*} search 
 * @param {*} state 
 * @returns 
 */
export const adminProductList = async (page, search, stateId) => {
  return await http.get(`/admin/product/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: stateId,
    },
  });
};


/**
 * Admin add  product 
 * @param {*} body 
 * @returns 
 */
export const adminAddProduct = async (body) => {
  return await http.post(`/admin/product/add`, body);
};


/**
 * Admin view product 
 * @param {*} id 
 * @returns 
 */
export const adminViewProduct = async (id) => {
  return await http.get(`/admin/product/details/${id}`);
};


/**
 * Admin update product 
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateProduct = async (id, body) => {
  return await http.put(`/admin/product/edit/${id}`, body);
};


/**
 * Admin update product status
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */

export const adminUpdateProductStatus = async (id, stateId) => {
  return await http.put(`/admin/product/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin delete product 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteProduct = async (id) => {
  return await http.delete(`/admin/product/delete/${id}`);
};


/**
 * Admin can delete product image
 * @param {*} id 
 * @param {*} imageId 
 * @returns 
 */
export const adminDeleteImage = async (id, imageId) => {
  return await http.delete(
    `/admin/product/removeImage?id=${id}&imageId=${imageId}`
  );
};


/**
 * Admin add contact info
 * @param {*} body 
 * @returns 
 */
export const adminAddContactInfo = async (body) => {
  return await http.post(`/admin/adminContactUs/add`, body);
};


/**
 * Admin update contact info
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateContactInfo = async (id, body) => {
  return await http.put(`/admin/adminContactUs/update/${id}`, body);
};


/**
 * Admin delete contact info
 * @param {*} id 
 * @returns 
 */
export const adminDeleteContactInfo = async (id) => {
  return await http.delete(`/admin/adminContactUs/delete/${id}`);
};


/**
 * Admin contact info
 * @param {*} page 
 * @returns 
 */
export const adminContactInfo = async (page) => {
  return await http.get(`/admin/adminContactUs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin view contact info
 * @param {*} id 
 * @returns 
 */
export const adminViewContactInfo = async (id) => {
  return await http.get(`/admin/adminContactUs/view/${id}`);
};


/**
 * Admin error log
 * @param {*} page
 * @param {*} error_type
 * @returns
 */
export const adminErrorLog = async (page) => {
  return await http.get(`/admin/logs/errorList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin view error log
 * @param {*} id
 * @returns
 */
export const adminViewError = async (id) => {
  return await http.get(`/admin/logs/errorView/${id}`);
};


/**
 * Admin log delete
 * @param {*} id
 * @returns
 */
export const adminLogDelete = async (id) => {
  return await http.delete(`/admin/logs/delete/${id}`);
};


/**
 * Admin log delete all
 * @returns
 */
export const adminLogAllDelete = async () => {
  return await http.delete(`/admin/logs/deleteAll`);
};


/**
 * Admin email list
 * @param {*} page
 * @param {*} search
 * @param {*} state
 * @returns
 */
export const adminEmailList = async (page, search, state) => {
  return await http.get(`/admin/emailLogs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      state: state,
    },
  });
};

/**
 * Admin email view
 * @param {*} id
 * @returns
 */
export const adminEmailView = async (id) => {
  return await http.get(`/admin/emailLogs/view/${id}`);
};


/**
 * Admin email delete
 * @param {*} id
 * @returns
 */
export const adminEmailDelete = async (id) => {
  return await http.delete(`/admin/emailLogs/delete/${id}`);
};


/**
 * Admin email all delete
 * @returns
 */
export const adminEmailAllDelete = async () => {
  return await http.delete(`/admin/emailLogs/deleteAll`);
};


/**
 * Admin login activity
 * @param {*} page
 * @returns
 */
export const adminLoginActivity = async (page) => {
  return await http.get(`/admin/loginActivity/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin login activity view
 * @param {*} id
 * @returns
 */
export const adminLoginActivityView = async (id) => {
  return await http.get(`/admin/loginActivity/details/${id}`);
};


/**
 * Admin login activity all delete
 * @returns
 */
export const adminLoginAllDelete = async () => {
  return await http.delete(`/admin/loginActivity/deleteAll`);
};


/**
 * Admin sms logs
 * @param {*} page 
 * @returns 
 */
export const adminSmsLog = async (page, search) => {
  return await http.get(`/admin/smsLogs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search
    },
  });
};


/**
 * Admin view sms log
 * @param {*} id
 * @returns
 */
export const adminViewSms = async (id) => {
  return await http.get(`/admin/smsLogs/details/${id}`);
};


/**
 * Admin sms delete
 * @param {*} id
 * @returns
 */
export const adminSmsDelete = async (id) => {
  return await http.delete(`/admin/smsLogs/delete/${id}`);
};


/**
 * Admin sms delete all
 * @returns
 */
export const adminSmsAllDelete = async () => {
  return await http.delete(`/admin/smsLogs/deleteAll`);
};


/**
 * Admin cms
 * @returns
 */
export const adminCmsList = async () => {
  return await http.get(`/admin/cms/list`);
};


/**
 * Admin cms view
 * @param {*} id
 * @returns
 */
export const adminCmsView = async (id) => {
  return await http.get(`/admin/cms/detail/${id}`);
};


/**
 * Admin create cms
 * @param {*} body
 * @returns
 */
export const adminCreateCms = async (body) => {
  return await http.post(`/admin/cms/add`, body);
};


/**
 * Admin update cms
 * @param {*} id
 * @param {*} body
 * @returns
 */
export const adminUpdateCMS = async (id, body) => {
  return await http.put(`/admin/cms/update/${id}`, body);
};


/**
 * Admin delete cms
 * @param {*} id
 * @returns
 */
export const adminDeleteCMS = async (id) => {
  return await http.delete(`/admin/cms/delete/${id}`);
};


/**
 * Admin update status cms
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */
export const adminStatusCms = async (id, stateId) => {
  return await http.put(`/admin/cms/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin contact list
 * @param {*} page
 * @returns
 */
export const adminContactList = async (page) => {
  return await http.get(`/admin/contactUs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin reply user
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminReplyUser = async (id, body) => {
  return await http.put(`/admin/contactUs/reply/${id}`, body);
};


/**
 * Admin delete contact us 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteContact = async (id) => {
  return await http.delete(`/admin/contactus/delete/${id}`);
};


/**
 * Admin contact details
 * @param {*} id
 * @returns
 */
export const adminContactDetail = async (id) => {
  return await http.get(`/admin/contactus/view/${id}`);
};


/**
 * Admin faq list
 * @param {*} page
 * @returns
 */
export const adminFaqList = async (page) => {
  return await http.get(`/admin/faq/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE
    },
  });
};


/**
 * Admin faq update status
 * @param {*} id
 * @param {*} stateId
 * @returns
 */
export const adminStatusFAQ = async (id, stateId) => {
  return await http.put(`/admin/faq/updateState/${id}?stateId=${stateId}`);
};


/**
 * Admin faq create
 * @param {*} body
 * @returns
 */
export const adminCreateFaq = async (body) => {
  return await http.post(`/admin/faq/add`, body);
};


/**
 * Admin faq view
 * @param {*} id
 * @returns
 */
export const adminFaqView = async (id) => {
  return await http.get(`/admin/faq/detail/${id}`);
};


/**
 * Admin faq update
 * @param {*} id
 * @param {*} body
 * @returns
 */
export const adminEditFaq = async (id, body) => {
  return await http.put(`/admin/faq/edit/${id}`, body);
};


/**
 * Admin faq delete
 * @param {*} id
 * @returns
 */
export const adminDeleteFaq = async (id) => {
  return await http.delete(`/admin/faq/delete/${id}`);
};


/**
 * Admin add smtp
 * @param {*} body
 * @returns
 */
export const adminAddSmtp = async (body) => {
  return await http.post(`/admin/smtp/add`, body);
};


/**
 * Admin smtp
 * @param {*} page
 * @returns
 */
export const adminSmtp = async (page) => {
  return await http.get(`/admin/smtp/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin update smtp
 * @param {*} id
 * @param {*} body
 * @returns
 */
export const adminEditSmtp = async (id, body) => {
  return await http.put(`/admin/smtp/update/${id}`, body);
};


/**
 * Admin view smtp
 * @param {*} id
 * @returns
 */
export const adminViewSmtp = async (id) => {
  return await http.get(`/admin/smtp/view/${id}`);
};


/**
 * Admin delete smtp
 * @param {*} id
 * @returns
 */
export const adminDeleteSmtp = async (id) => {
  return await http.delete(`/admin/smtp/delete/${id}`);
};


/**
 * Admin add twillio
 * @param {*} body
 * @returns
 */
export const adminAddTwillio = async (body) => {
  return await http.post(`/admin/twillio/add`, body);
};


/**
 * Admin twillio list
 * @param {*} page 
 * @returns 
 */
export const adminTwillio = async (page) => {
  return await http.get(`/admin/twillio/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin update twillio
 * @param {*} id
 * @param {*} body
 * @returns
 */
export const adminEditTwillio = async (id, body) => {
  return await http.put(`/admin/twillio/update/${id}`, body);
};


/**
 * Admin view twillio
 * @param {*} id
 * @returns
 */
export const adminViewTwillio = async (id) => {
  return await http.get(`/admin/twillio/view/${id}`);
};


/**
 * Admin twillio delete
 * @param {*} id
 * @returns
 */
export const adminDeleteTwillio = async (id) => {
  return await http.delete(`/admin/twillio/delete/${id}`);
};































/**
 * Admin subcription list
 * @param {*} page 
 * @returns 
 */
export const adminSubscriptionList = async (page) => {
  return await http.get(`/admin/subscription-plan/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};


/**
 * Admin add subscription 
 * @param {*} body 
 * @returns 
 */
export const adminAddSubscription = async (body) => {
  return await http.post(`/admin/subscription-plan/add`, body);
};


/**
 * Admin update subscription 
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateSubscription = async (id, body) => {
  return await http.put(`/admin/subscription-plan/update/${id}`, body);
};


/**
 * Admin delete subscription 
 * @param {*} id 
 * @returns 
 */
export const adminDeleteSubscription = async (id) => {
  return await http.delete(`/admin/subscription-plan/delete/${id}`);
};


/**
 * Admin view subscription
 * @param {*} id 
 * @returns 
 */
export const adminSubscriptionView = async (id) => {
  return await http.get(`/admin/subscription-plan/detail/${id}`);
};


/**
 * Admin update subscription status
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */
export const adminStatusSubscription = async (id, stateId) => {
  return await http.put(`/admin/subscription-plan/updateState/${id}?stateId=${stateId}`);
};


/**
 * Download  user report 
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
export const adminDownloadUserReports = async (startDate, endDate) => {
  return await http.get(`/admin/user/downloadUserReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};


export const adminPaymentList = async (query) => {
  return await http.get(`/admin/payment/list`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminViewTranscation = async (id) => {
  return await http.get(`/admin/payment/detail/${id}`);
};



/**
 * Admin banner list 
 * @param {*} page 
 * @param {*} search 
 * @returns 
 */
export const adminBannerList = async (page, stateId) => {
  return await http.get(`/admin/banner/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      stateId: stateId
    },
  });
};

/**
 * Admin add banner
 * @param {*} body 
 * @returns 
 */
export const adminAddBanner = async (body) => {
  return await http.post(`/admin/banner/add`, body);
};

/**
 * Admin update banner
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const adminUpdateBanner = async (id, body) => {
  return await http.put(`/admin/banner/update/${id}`, body);
};

/**
 * Admin delete banner
 * @param {*} id
 * @returns
 */
export const adminDeleteBanner = async (id) => {
  return await http.delete(`/admin/banner/delete/${id}`);
};

/**
 * Admin banner  status update
 * @param {*} id 
 * @param {*} stateId 
 * @returns 
 */
export const adminStatusBanner = async (id, stateId) => {
  return await http.put(`/admin/banner/updateState/${id}?stateId=${stateId}`);
};


export const adminViewBanner = async (id) => {
  return await http.get(`/admin/banner/detail/${id}`);
};

/**
 * Admin DataCheck list
 * @returns 
 */
export const adminDataCheck = async () => {
  return await http.get(`/admin/dateCheck/list`);
};

/**
 * Admin add DataCheck
 * @param {*} body 
 * @returns 
 */
export const adminAddDataCheck = async (body) => {
  return await http.post(`/admin/dateCheck/add`, body);
};

/**
 * Admin delete DataCheck
 * @param {*} id 
 * @returns 
 */
export const adminDeleteDataCheck = async (id) => {
  return await http.delete(`/admin/dateCheck/delete/${id}`);
};


/**
 * Faq List
 * @param {*} page 
 * @returns 
 */
export const faqList = async (page,state) => {
  return await http.get(`/pages/faq`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE_FIVE,
      state: state
    },
  });
};













