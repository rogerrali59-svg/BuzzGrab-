/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { WISHLIST } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const wishlist = {};

/**
 *  ADD PRODUCT IN WISHLIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
wishlist.addWishlist = async (req, res, next) => {
  try {
    const data = req.body;

    data.createdBy = req.userId;
    let isExist;

    let resp;
    if (data?.productId) {
      resp =
        data.isWishlist == true || data.isWishlist == "true"
          ? "Product added in Wishlist"
          : "Product removed from Wishlist";

      isExist = await WISHLIST.findOne({
        createdBy: req.userId,
        productId: data?.productId,
        isWishlist: true,
      });
    }

    if (!isExist) {
      const addWishList = await WISHLIST.create(data);
      await setResponseObject(req, true, resp);
      next();
    } else {
      const updateData = await WISHLIST.findByIdAndDelete({
        _id: isExist._id,
      });
      await setResponseObject(req, true, resp);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY WISHLIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
wishlist.getwishList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    const wishList = await WISHLIST.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" }, // LOCAL FIELD
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
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
    if (wishList && wishList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Wishlist product found successfully",
        wishList[0].data,
        wishList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Wishlist product not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = wishlist;
