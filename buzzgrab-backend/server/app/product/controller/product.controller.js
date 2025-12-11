/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { PRODUCT } = require("../model/product.model");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const {
  productAddValidation,
  productUpdateValidation,
} = require("../model/product.model");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const mongoose = require("mongoose");

const product = {};

/**
 * ADD PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.addProduct = async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = productAddValidation(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    data.createdBy = req.userId;
    const isExist = await PRODUCT.findOne({
      productName: data.productName,
      createdBy: res.userId,
      stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED },
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Product already in existence with this name."
      );
      next();
    } else {
      if (req?.files) {
        const arr = [];
        req.files.productImg.map((e) => {
          let url = new mongoose.Types.ObjectId(e.id);
          let type = e.mimetype;
          arr.push({
            url: url,
            type: type,
          });
          const img = arr;
          data.productImg = img;
        });
      }

      if (data?.longitude && data?.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      data.price = data?.mrp - (data?.mrp * (data?.discount || 0)) / 100;

      const saveProduct = await PRODUCT.create(data);

      if (saveProduct) {
        await setResponseObject(
          req,
          true,
          "Product added successfully.",
          saveProduct
        );
        next();
      } else {
        await setResponseObject(req, false, "Product not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * EDIT PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.editProduct = async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = productUpdateValidation(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    const isExist = await PRODUCT.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      productName: data.productName,
      createdBy: res.userId,
      stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED },
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Product already in existence with this name."
      );
      next();
    }

    if (req?.files) {
      const arr = [];
      req?.files?.productImg?.map((e) => {
        let url = new mongoose.Types.ObjectId(e.id);
        let type = e.mimetype;
        arr.push({
          url: url,
          type: type,
        });
      });

      await PRODUCT.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { productImg: arr } },
        { new: true }
      );
    }

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    data.price = data?.mrp - (data?.mrp * (data?.discount || 0)) / 100;

    const updateProduct = await PRODUCT.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateProduct) {
      await setResponseObject(
        req,
        true,
        "Product update successfully",
        updateProduct
      );
      next();
    } else {
      await setResponseObject(req, false, "Product not update");
      next();
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE PRODUCT IMAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.removeImage = async (req, res, next) => {
  try {
    const removeDoc = await PRODUCT.findByIdAndUpdate(
      req.query.id,
      { $pull: { productImg: { _id: req.query.imageId } } },
      { new: true }
    );

    if (removeDoc) {
      await setResponseObject(req, true, "Image deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Image not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * MY PRODUCT LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.myProduct = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        $or: [
          {
            productName: {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
          {
            "categoryDetails.title": {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
        ],
      };
    }

    var filter;
    switch (req.query.stateId) {
      case "1":
        filter = { stateId: CONST.PRODUCT_STATE_ID.PENDING };
        break;

      case "2":
        filter = { stateId: CONST.PRODUCT_STATE_ID.ACTIVE };
        break;

      case "3":
        filter = { stateId: CONST.PRODUCT_STATE_ID.INACTIVE };
        break;

      case "5":
        filter = { stateId: CONST.PRODUCT_STATE_ID.OUT_OF_STOCK };
        break;

      default:
        filter = { stateId: { $ne: CONST.DELETED } };
    }

    const productList = await PRODUCT.aggregate([
      {
        $match: {
          $and: [
            { createdBy: new mongoose.Types.ObjectId(req.userId) },
            { stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED } },
          ],
        },
      },
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$categoryId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
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
                fullName: 1,
                firstName: 1,
                lastName: 1,
                profileImg: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
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

    let data = productList[0].data;
    let total = productList[0].count[0] ? productList[0].count[0].count : 0;

    data = data.map((item) => {
      if (item?.productImg && Array.isArray(item.productImg)) {
        item.productImg = item.productImg.map((image) => {
          if (image?.url) {
            image.url = process.env.IMAGE_BASE_URL + image.url;
          }

          return image;
        });
      }
      if (item?.createdBy?.profileImg) {
        item.createdBy.profileImg =
          process.env.IMAGE_BASE_URL + item?.createdBy?.profileImg;
      }

      return item;
    });

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        data,
        total,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VIEW PRODUCT DETAILS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.viewProduct = async (req, res, next) => {
  try {
    const viewProduct = await PRODUCT.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
                fullName: 1,
                firstName: 1,
                lastName: 1,
                profileImg: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$category" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brands",
          let: { id: "$brand" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "brandDetails",
        },
      },
      {
        $unwind: {
          path: "$brandDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stores",
          let: { id: "$store" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: "storeDetails",
        },
      },
      {
        $unwind: {
          path: "$storeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },

      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
    ]);

    if (
      viewProduct[0]?.productImg &&
      Array.isArray(viewProduct[0]?.productImg)
    ) {
      viewProduct[0].productImg = viewProduct[0].productImg.map((img) => {
        if (img.url) {
          return {
            ...img,
            url: process.env.IMAGE_BASE_URL + img.url,
          };
        }
        return img;
      });
    }

    if (viewProduct[0]?.createdBy.profileImg) {
      viewProduct[0].createdBy.profileImg =
        process.env.IMAGE_BASE_URL + viewProduct[0].createdBy.profileImg;
    }

    if (viewProduct.length > 0) {
      await setResponseObject(
        req,
        true,
        "Product details found successfully",
        viewProduct[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Product details not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.deleteProduct = async (req, res, next) => {
  try {
    const deleteProduct = await PRODUCT.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        stateId: CONST.PRODUCT_STATE_ID.DELETED,
      }
    );

    if (deleteProduct) {
      await setResponseObject(req, true, "Product deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Product not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ALL PRODUCT LIST FOR ADMIN
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.adminProdcutList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        $or: [
          {
            productName: {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
          {
            "categoryDetails.title": {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
          {
            "createdBy.fullName": {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
          {
            "createdBy.firstName": {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
          {
            "createdBy.lastName": {
              $regex: req.query.search
                ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
                : "",
              $options: "i",
            },
          },
        ],
      };
    }

    var filter;
    switch (req.query.stateId) {
      case "1":
        filter = { stateId: CONST.PRODUCT_STATE_ID.PENDING };
        break;

      case "2":
        filter = { stateId: CONST.PRODUCT_STATE_ID.ACTIVE };
        break;

      case "3":
        filter = { stateId: CONST.PRODUCT_STATE_ID.INACTIVE };
        break;

      case "5":
        filter = { stateId: CONST.PRODUCT_STATE_ID.OUT_OF_STOCK };
        break;

      default:
        filter = { stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED } };
    }

    let roleFilter = {};
    if (req.roleId == CONST.SUB_ADMIN) {
      roleFilter = {
        $and: [
          { createdBy: { $eq: new mongoose.Types.ObjectId(req.userId) } },
          { stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED } },
        ],
      };
    } else {
      roleFilter = { stateId: { $ne: CONST.PRODUCT_STATE_ID.DELETED } };
    }

    const productList = await PRODUCT.aggregate([
      {
        $match: roleFilter,
      },
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$categoryId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
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
                fullName: 1,
                firstName: 1,
                lastName: 1,
                profileImg: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
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

    let data = productList[0].data;
    let total = productList[0].count[0] ? productList[0].count[0].count : 0;

    data = data.map((item) => {
      if (item?.productImg && Array.isArray(item.productImg)) {
        item.productImg = item.productImg.map((image) => {
          if (image?.url) {
            image.url = process.env.IMAGE_BASE_URL + image.url;
          }

          return image;
        });
      }

      if (item?.createdBy?.profileImg) {
        item.createdBy.profileImg =
          process.env.IMAGE_BASE_URL + item?.createdBy?.profileImg;
      }

      return item;
    });

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        data,
        total,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * UPDATE PRODUCT STATE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "2":
        filter = {
          stateId: 2, // 1 => ACTIVE
        };
        resp = "Product active successfully";
        break;

      case "3":
        filter = {
          stateId: 3, // 2 => INACTIVE
        };
        resp = "Product inactive successfully";
        break;
      default:
    }

    let updateState = await PRODUCT.findByIdAndUpdate(
      { _id: req.params.id },
      filter,
      {
        new: true,
      }
    );
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Product state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.allProduct = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    // ---------------------------
    // SEARCH FILTER
    // ---------------------------
    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const s = req.query.search.replace(new RegExp("\\\\", "g"), "\\\\");

      searchFilter = {
        $or: [
          { productName: { $regex: s, $options: "i" } },
          { "categoryDetails.title": { $regex: s, $options: "i" } },
        ],
      };
    }

    // ---------------------------
    // CATEGORY FILTER
    // ---------------------------
    let categoryFilter = {};
    if (req.query.categoryId) {
      categoryFilter = {
        category: new mongoose.Types.ObjectId(req.query.categoryId),
      };
    }

    // ---------------------------
    // BRAND FILTER (FIXED)
    // ---------------------------
    let brandFilter = {};
    if (req.query.brandId) {
      let brandIds = [];

      if (Array.isArray(req.query.brandId)) {
        brandIds = req.query.brandId;
      } else if (typeof req.query.brandId === "string") {
        brandIds = req.query.brandId.split(",");
      }

      // Filter valid ObjectIds
      brandIds = brandIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      if (brandIds.length > 0) {
        brandFilter = { brandId: { $in: brandIds } }; // Use $in for multiple brands
      }
    }

    // ---------------------------
    // PRICE FILTER
    // ---------------------------
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice)
        priceFilter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        priceFilter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // ---------------------------
    // RATING FILTER
    // ---------------------------
    let ratingFilter = {};
    if (req.query.minRating || req.query.maxRating) {
      ratingFilter.averageRating = {};
      if (req.query.minRating)
        ratingFilter.averageRating.$gte = parseFloat(req.query.minRating);
      if (req.query.maxRating)
        ratingFilter.averageRating.$lte = parseFloat(req.query.maxRating);
    }

    // ---------------------------
    // GEO FILTER → $geoNear
    // ---------------------------
    let geoStage = [];
    if (req.query.lat && req.query.lng) {
      let distance = req.query.distance ? parseFloat(req.query.distance) : 10; // default 10km

      geoStage.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: distance * 1000, // convert to meters
        },
      });
    }

    let stockFilter = {};
    if (req.query.stockStatus) {
      const stockStatus = parseInt(req.query.stockStatus);

      if (stockStatus === 1) {
        // In Stock: quantity > 0
        stockFilter = { quantity: { $gt: 0 } };
      } else if (stockStatus === 2) {
        // Low Stock: quantity > 0 and <= 5
        stockFilter = { quantity: { $gt: 0, $lte: 5 } };
      }
    }


    // ---------------------------
    // AGGREGATION PIPELINE
    // ---------------------------
    const productList = await PRODUCT.aggregate([
      ...geoStage,
      {
        $match: {
          stateId: CONST.PRODUCT_STATE_ID.ACTIVE,
          ...categoryFilter,
          ...brandFilter,
          ...priceFilter,
          ...ratingFilter,
          ...stockFilter
        },
      },

      // CATEGORY LOOKUP
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },

      // BRAND LOOKUP
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      { $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true } },

      // STORE LOOKUP
      {
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "storeDetails",
        },
      },
      { $unwind: { path: "$storeDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
     

      // SEARCH FILTER
      { $match: searchFilter },

      // SORTING
      { $sort: { createdAt: -1 } },

      // PAGINATION
      {
        $facet: {
          data: [{ $skip: (pageNo - 1) * pageLimit }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    let data = productList[0].data;
    let total = productList[0].count[0]?.count || 0;

    data = data.map((item) => {
      // IMAGE FIX
      if (item?.productImg) {
        item.productImg = item.productImg.map((img) => ({
          ...img,
          url: img.url ? process.env.IMAGE_BASE_URL + img.url : null,
        }));
      }

      if (item?.createdBy?.profileImg) {
        item.createdBy.profileImg =
          process.env.IMAGE_BASE_URL + item.createdBy.profileImg;
      }

      return item;
    });

    if (data.length > 0) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        data,
        total,
        pageNo,
        pageLimit
      );
    } else {
      await setResponseObject(req, true, "Product list not found", []);
    }

    next();
  } catch (error) {
    console.log("error=======", error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * RELATED PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.relatedProduct = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    // ---------------------------
    // SEARCH FILTER
    // ---------------------------
    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const s = req.query.search.replace(new RegExp("\\\\", "g"), "\\\\");

      searchFilter = {
        $or: [
          { productName: { $regex: s, $options: "i" } },
          { "categoryDetails.title": { $regex: s, $options: "i" } },
        ],
      };
    }

    // ---------------------------
    // CATEGORY FILTER
    // ---------------------------
    let categoryFilter = {};
    if (req.query.categoryId) {
      categoryFilter = {
        categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
      };
    }

    // --------------------------
    // AGGREGATION PIPELINE
    // ---------------------------
    const productList = await PRODUCT.aggregate([
      {
        $match: {
          stateId: CONST.PRODUCT_STATE_ID.ACTIVE,
          ...categoryFilter,
        },
      },

      // CATEGORY LOOKUP
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },

      // BRAND LOOKUP
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      { $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true } },

      // STORE LOOKUP
      {
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "storeDetails",
        },
      },
      { $unwind: { path: "$storeDetails", preserveNullAndEmptyArrays: true } },

      { $match: searchFilter },

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [{ $skip: (pageNo - 1) * pageLimit }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    let data = productList[0].data;
    let total = productList[0].count[0]?.count || 0;

    data = data.map((item) => {
      // IMAGE FIX
      if (item?.productImg) {
        item.productImg = item.productImg.map((img) => ({
          ...img,
          url: img.url ? process.env.IMAGE_BASE_URL + img.url : null,
        }));
      }

      return item;
    });

    if (data.length > 0) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        data,
        total,
        pageNo,
        pageLimit
      );
    } else {
      await setResponseObject(req, true, "Product list not found", []);
    }

    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = product;
