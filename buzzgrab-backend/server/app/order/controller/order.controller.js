/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const {
  setResponseObject,
  generateUniqueID,
  generateOTP,
  formatNumber,
} = require("../../../middleware/commonFunction");
const ORDER = require("../model/order.model");
const { CART } = require("../../cart/model/model");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { USER } = require("../../userService/model/userModel");
const { ADDRESS } = require("../../address/model/address.model");
const { CONST } = require("../../../helpers/constant");
const { NOTIFICATION } = require("../../notification/model/notification.model");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const QRCode = require("qrcode");
const nodemailer = require("../../../helpers/nodemailer");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const mongoose = require("mongoose");
const moment = require("moment/moment");
const {
  ORDER_INCOICE,
  SELLER_ORDER_TEMPLATE,
} = require("../../../helpers/email_template");
const fs = require("fs");
const ExcelJS = require("exceljs");
const puppeteer = require("puppeteer");
const path = require("path");
const twilio = require("twilio");
const { Sms_Logs } = require("../../errorLogs/model/logModal");
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const order = {};



/**
 * CREATE ORDER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.createOrder = async (req, res, next) => {
  try {
   

    let data = req.body;

    Object.keys(data).forEach((key) => {
      if (
        data[key] === "" ||
        data[key] == null ||
        data[key] == undefined ||
        data[key] == "undefined"
      ) {
        delete data[key];
      }
    });
    const myCart = await CART.find({ createdBy: req.userId });

    if (myCart.length == 0) {
      await setResponseObject(
        req,
        false,
        "There is no product in your cart",
        []
      );
      next();
      return;
    }

    const findProduct = await PRODUCT_MODEL.findById({
      _id: myCart[0]?.productId,
    });

    const findSeller = await USER.findById({ _id: findProduct.createdBy });

    const arr = [];
    let quentityLength = 0;
    myCart.map(async (e) => {
      const findProduct = await PRODUCT_MODEL.findById({ _id: e.productId });
      let record = {
        items: new mongoose.Types.ObjectId(e.productId),
        productName: e?.productName,
        productImg:
          findProduct?.productImg?.map((img) => ({
            url: img.url,
            type: img.type,
          })) || [],
        size: e?.size,
        color: e?.color,
        discount: e?.discount,
        mrp: e?.mrp,
        quantity: e?.quantity,
        product_price: e?.purchase_Price,
        product_cost: e?.product_cost,
        discount: e?.discount,
        note: e?.note,
        answers: e?.answers.map((ele) => ({
          questionId: ele?.questionId,
          answerId: ele?.answerId,
        })),
        deliveryCharge: findProduct?.deliveryCost,
        productPrice: e?.productPrice,
        productCode: findProduct?.productCode,
      };
      quentityLength += e?.quantity;
      arr.push(record);
    });

    const findOrder = await ORDER.findOne().sort({ createdAt: -1 });
    if (findOrder) {
      data.orderId = findOrder.orderId + 1;
    } else {
      data.orderId = generateUniqueID(8);
    }

    const payload = {
      products: arr,
      fullName: data.fullName,
      address: data?.address,
      store: data?.store,
      orderId: data.orderId,
      subTotal: data.subTotal,
      total: data.total,
      createdBy: req.userId,
      orderType: data.orderType,
     
      company: myCart[0]?.companyId,
      deliveryStatus: CONST.PENDING,
      cashBack: data.cashBack,
    };


    for (const element of myCart) {
      let productQuantity = await PRODUCT_MODEL.findOne({
        _id: new mongoose.Types.ObjectId(element.productId),
      });

      if (productQuantity.quantity === 0) {

        // SEND NOTIFICATION TO SELLER
        var sellerNotificationBody = {
          to: findSeller._id,
          title: "Product is out of stock",
          description: `${productQuantity.productName} is out of stock`,
          notificationType: CONST.PRODUCT,
        };

        let sellerNotificatioN = await NOTIFICATION.create(
          sellerNotificationBody
        );

        await setResponseObject(
          req,
          false,
          "Order not placed due to out of stock"
        );
        next();
        return; // Exit the entire process if any product is out of stock
      }

      if (productQuantity.quantity < element.quantity) {
        await setResponseObject(
          req,
          false,
          "Order not placed due to out of stock"
        );

        next();
        return;
      }

      let minus =
        parseInt(productQuantity.quantity) - parseInt(element.quantity);

      await PRODUCT_MODEL.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(element.productId) },
        { quantity: minus },
        { new: true }
      );
    }

    let order;

    order = await ORDER.create(payload);

    cartTotal = 0;
    sum = [];
    order.products.map((e) => {
      sum.push(e.product_price);
      cartTotal = cartTotal + e.product_price;
    });

   
    let totalPrice = cartTotal + charge;


    let findAddres;
    if (order?.address && order.address !== "null") {
      findAddres = await ADDRESS.findOne({
        $or: [
          { _id: order?.address },
          { createdBy: req.userId, isDefault: true },
        ],
      });
    }


  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY ORDER LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.myOrder = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let dates = new Date();
    let todayDate = moment(dates).format("YYYY-MM-DD");

   
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

   

   

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      // Try to parse the orderId from the search value
      const searchNumber = parseInt(searchValue, 10);

      // Build the search filter
      searchFilter.$or = [
        {
          "userDetails.fullName": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $eq: searchNumber,
          },
        },
        {
          mobileNumber: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
      ];
    }

    const orderList = await ORDER.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
    
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$id",
                        in: {
                          $toObjectId: "$$this",
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                productName: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if language is 'AR'
                    then: {
                      $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
                    },
                    else: "$productName", // If language is not 'AR', use category
                  },
                },
                productArabicName: 1,
                description: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if language is 'AR'
                    then: {
                      $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
                    },
                    else: "$description", // If language is not 'AR', use category
                  },
                },
                arabicDescription: 1,
                productImg: 1,
                price: 1,
                mrpPrice: 1,
                size: 1,
                color: 1,
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] },
              },
            },
            {
              $project: {
                _id: 1,
                company: 1,
              },
            },
            {
              $lookup: {
                from: "companies",
                let: { id: "$company" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                ],
                as: "company",
              },
            },
            {
              $unwind: {
                path: "$company",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
     
    
      
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $project: {
          _id: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                items: "$$product.items",
                productName: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Assuming you have a field that indicates the language
                    then: "$$product.productArabicName",
                    else: "$$product.productName",
                  },
                },
                productImg: "$$product.productImg",
                quantity: "$$product.quantity",
                product_price: "$$product.product_price",
                discount: "$$product.discount",
                mrp: "$$product.mrp",
                deliveryCharge: "$$product.deliveryCharge",
                size: "$$product.size",
                color: "$$product.color",
                answers: "$$product.answers",
                _id: "$$product._id",
              },
            },
          },
          orderId: 1,
          deliveryCharge: 1,
          subTotal: 1,
          total: 1,
          address: 1,
          deliveryStatus: 1,
          paymentType: 1,
          orderType: 1,
          
          createdAt: 1,
          productDetails: 1,
         
         
         
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (orderList && orderList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        orderList[0].data,
        orderList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ORDER DETAILS FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.orderDetails = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    const orderDetails = await ORDER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$id",
                        in: {
                          $toObjectId: "$$this",
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$productId"] },
                      createdBy: new mongoose.Types.ObjectId(req.userId),
                    },
                  },
                ],
                as: "rating",
              },
            },

            {
              $addFields: {
                isWishlist: {
                  $cond: {
                    if: { $size: "$rating" },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "addresses",
          let: { id: "$address" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "addressesDetails",
        },
      },
      {
        $unwind: {
          path: "$addressesDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                country: 1,
                countryCode: 1,
                mobile: 1,
                email: 1,
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      
   
     
     
    
     
     
     
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                items: "$$product.items",
                productName: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Assuming you have a field that indicates the language
                    then: "$$product.productArabicName",
                    else: "$$product.productName",
                  },
                },
                productImg: "$$product.productImg",
                quantity: "$$product.quantity",
                product_price: "$$product.product_price",
                discount: "$$product.discount",
                mrp: "$$product.mrp",
                deliveryCharge: "$$product.deliveryCharge",
                size: "$$product.size",
                color: "$$product.color",
                answers: "$$product.answers",
                _id: "$$product._id",
                isRefund: "$$product.isRefund",
                productCode: "$$product.productCode",
              },
            },
          },
          orderId: 1,
          deliveryCharge: 1,
          subTotal: 1,
          total: 1,
          deliveryStatus: 1,
          paymentType: 1,
          orderType: 1,
          paymentReturnType: 1,
          createdAt: 1,
          productDetails: 1,
          addressesDetails: 1,
          userDetails: 1,
         
          
          
        },
      },
    ]);

    if (orderDetails.length > 0) {
      await setResponseObject(
        req,
        true,
        "Order details found successfully",
        orderDetails[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Order details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * CANCEL ORDER BY USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.cancelOrder = async (req, res, next) => {
  try {
    const data = req.body;

    const findOrder = await ORDER.findById({ _id: req.params.id });
    const findUser = await USER.findById({ _id: findOrder.createdBy });

    const findProduct = await PRODUCT_MODEL.findById({
      _id: findOrder.products[0].items,
    });
    const findSeller = await USER.findById({ _id: findProduct.createdBy });

   
    

    const cancelOrder = await ORDER.findByIdAndUpdate(
      { _id: req.params.id },
      {
        deliveryStatus: data.deliveryStatus,
        reason: data.reason,
        
      },
      { new: true }
    );

    if (cancelOrder) {
      const order = await ORDER.findById({ _id: req.params.id });

      order.products.map(async (e) => {
        const findProduct = await PRODUCT_MODEL.findById({
          _id: e.items,
        });
        const quantity = parseInt(findProduct.quantity) + parseInt(e.quantity);
        const update = await PRODUCT_MODEL.findByIdAndUpdate(
          { _id: e.items },
          { quantity: quantity },
          { new: true }
        );
      });

     
      var userNotificationBody = {
        to: findUser._id,
        title: "Your order cancelled successfully.",
        description: `Your order Id ${findOrder.orderId} is cancelled successfully, amount will be refunded in your account as soon as possible.`,
        orderId: findOrder._id,
      };

      let saveNotification = await NOTIFICATION.create(userNotificationBody);

      await setResponseObject(
        req,
        true,
        "Order cancelled successfully, amount will be refunded",
        cancelOrder
      );
      next();
    } else {
      await setResponseObject(req, false, "Order not cancelled");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*******************************************************************FOR SELLER**********************************************************/

/**
 * UPDATE ORDER STATUS BY SEELER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.updateOrderState = async (req, res, next) => {
  try {
    let dates = new Date();
    let findOrder = await ORDER.findById({ _id: req.params.id });

    let findUser = await USER.findById({ _id: findOrder.createdBy });
   
   

    let findSeller = await USER.findOne({
      _id: req.userId,
      roleId: CONST.SALES,
    });
    let filter = {};
    let resp;
    let saveNotification;
    let updateTracking;
    let obj;
    let cashBackData;

   

    const orderState = await ORDER.findByIdAndUpdate(
      { _id: req.params.id },
      filter,
      { new: true }
    );
    if (orderState) {
      if (req.query.deliveryStatus == CONST.COMPLETED) {
        const findOrder = await ORDER.findById({ _id: req.params.id });

        for (let index = 0; index < findOrder.products.length; index++) {
          const element = findOrder.products[index].items;
          const puchaseCount = await PRODUCT_MODEL.findByIdAndUpdate(
            {
              _id: findOrder.products[index].items,
            },
            {
              $inc: {
                purchaseCount: 1,
              },
            },
            { new: true }
          );
        }
      }

      await setResponseObject(req, true, resp, orderState);
      next();
    } else {
      await setResponseObject(req, false, "Order state Id not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VENDER ORDER MANAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.sellerOrderlist = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let stateFilter = {};

  
    let typeFilter = {};

    switch (req.query.type) {
      case "1":
        typeFilter = {
          orderType: CONST.DELIVERY,
        };
        break;
      case "2":
        typeFilter = {
          orderType: CONST.PICKUP,
        };
        break;

      default:
        break;
    }

    let filter = [];

    if (req.query.startDate && req.query.endDate) {
      const startDateString = new Date(req.query.startDate);

      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          createdAt: {
            $gte: startDateString,
            $lte: endDateString,
          },
        },
      });
    } else if (req.query.startDate) {
      const startDateString = new Date(req.query.startDate);

      filter.push({
        $match: {
          createdAt: {
            $gte: startDateString,
          },
        },
      });
    } else if (req.query.endDate) {
      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          createdAt: {
            $lte: endDateString,
          },
        },
      });
    }

    if (req.query.orderId) {
      filter.push({
        $match: {
          orderId: parseInt(req.query.orderId),
        },
      });
    }

    const seller = await USER.findById({
      _id: req.userId,
      stateId: { $ne: CONST.DELETED },
    });

    const findProduct = await PRODUCT_MODEL.find({ company: seller.company });

    const productArr = [];
    findProduct.map((e) => {
      productArr.push(e._id);
    });

    const findOrders = await ORDER.aggregate([
      {
        $match: {
          visibleToSeller: { $eq: true },
        },
      },
     
    
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                country: 1,
                countryCode: 1,
                mobile: 1,
              },
            },
            {
              $lookup: {
                from: "addresses",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$createdBy"] },
                    },
                  },
                ],
                as: "addressesDetails",
              },
            },
            {
              $unwind: {
                path: "$addressesDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $group: {
          _id: "$_id",
          products: { $first: "$products" },
          orderId: { $first: "$orderId" },
          deliveryCharge: { $first: "$deliveryCharge" },
          subTotal: { $first: "$subTotal" },
          total: { $first: "$total" },
          address: { $first: "$address" },
          createdBy: { $first: "$createdBy" },
          deliveryStatus: { $first: "$deliveryStatus" },
          paymentType: { $first: "$paymentType" },
          orderType: { $first: "$orderType" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          userDetails: { $first: "$userDetails" },
          
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (findOrders && findOrders[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        findOrders[0].data,
        findOrders[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ADMIN ORDER MANAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.adminOrderList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let stateFilter = { deliveryStatus: { $ne: CONST.ORDERDELETED } };

    switch (req.query.deliveryStatus) {
      case "5":
        stateFilter = {
          deliveryStatus: CONST.PENDING,
        };
        break;
      case "8":
        stateFilter = {
          deliveryStatus: CONST.SHIPPED,
        };
        break;
      case "9":
        stateFilter = {
          deliveryStatus: CONST.COMPLETED,
        };
        break;

      case "10":
        stateFilter = {
          deliveryStatus: CONST.CANCELED,
        };
        break;

      case "11":
        stateFilter = {
          deliveryStatus: CONST.READY,
        };
        break;

      default:
        break;
    }

    let filter = [];
    let startDateString;
    let endDateString;

    if (req.query.startDate) {
      const startDate = moment(req?.query?.startDate);
      if (!startDate.isValid()) {
        console.log("Invalid start date");
      } else {
        startDateString = startDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
      }
    }

    if (req?.query?.endDate) {
      const endDate = moment(req?.query?.endDate);
      if (!endDate.isValid()) {
        console.log("Invalid end date");
      } else {
        endDateString = endDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
      }
    }

    if (startDateString && endDateString) {
      filter.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  startDateString,
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  endDateString,
                ],
              },
            ],
          },
        },
      });
    } else if (startDateString) {
      filter.push({
        $match: {
          $expr: {
            $gte: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              startDateString,
            ],
          },
        },
      });
    } else if (endDateString) {
      filter.push({
        $match: {
          $expr: {
            $lte: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              endDateString,
            ],
          },
        },
      });
    }

    if (req.query.companyArr) {
      filter.push({
        $match: {
          company: {
            $in: req.query.companyArr
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          }, // Using the array directly
        },
      });
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      // Try to parse the orderId from the search value
      const searchNumber = parseInt(searchValue, 10);

      // Build the search filter
      searchFilter.$or = [
        {
          "userDetails.fullName": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $eq: searchNumber,
          },
        },
        {
          mobileNumber: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
      ];
    }

    let categoryFilter = {};

   
    const findOrders = await ORDER.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: stateFilter,
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                country: 1,
                countryCode: 1,
                mobile: 1,
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          mobileNumber: {
            $concat: [
              { $toString: "$userDetails.countryCode" }, // Add a space or any separator if needed
              { $toString: "$userDetails.mobile" }, // Ensure it's a string
            ],
          },
        },
      },
      {
        $match: searchFilter,
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      ...filter,

      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (findOrders && findOrders[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        findOrders[0].data,
        findOrders[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};
module.exports = order;
