/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { STORE_MODEL } = require("../model/model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const { USER } = require("../../userService/model/userModel");

const store = {};

/*Add store*/
store.add = async (req, res, next) => {
  try {
    const isExists = await STORE_MODEL.findOne({
      $and: [{ name: req?.body?.name }, { stateId: { $ne: CONST.DELETED } }],
    });

    if (isExists) {
      await setResponseObject(req, false, `Store already exist with this name`);
      next();
      return;
    }

    const data = req.body;
    data.createdBy = req.userId;

    // Upload profile image
    if (req.files.logo && req.files.logo.length > 0) {
      data.logo = new mongoose.Types.ObjectId(req.files.logo[0].id);
    }

    // Upload cover image
    if (req.files.coverImg && req.files.coverImg.length > 0) {
      data.coverImg = new mongoose.Types.ObjectId(req.files.coverImg[0].id);
    }

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    const result = await STORE_MODEL.create(data);
    if (result) {
      await setResponseObject(
        req,
        true,
        "Store has been successfully added. Please ensure that you also assign a sub admin.",
        result
      );

      next();
    } else {
      await setResponseObject(req, false, "Store not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update store*/
store.update = async (req, res, next) => {
  try {
    const isExists = await STORE_MODEL.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      name: req?.body?.name,
      stateId: { $ne: CONST.DELETED },
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        `Store already exist with ${req?.body?.name}`
      );
      next();
      return;
    }

    const data = req.body;

    // Upload logo image
    if (req.files.logo && req.files.logo.length > 0) {
      data.logo = new mongoose.Types.ObjectId(req.files.logo[0].id);
    }

    // Upload cover image
    if (req.files.coverImg && req.files.coverImg.length > 0) {
      data.coverImg = new mongoose.Types.ObjectId(req.files.coverImg[0].id);
    }

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    const updateData = await STORE_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Store updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Store not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all store*/
store.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        stateFilter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        stateFilter = {
          stateId: { $ne: CONST.DELETED },
        };
        break;
    }

    let list = await STORE_MODEL.aggregate([
      {
        $match: stateFilter,
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$subAdmin" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$id", "$_id"] },
                    { $eq: ["$stateId", CONST.ACTIVE] },
                  ],
                },
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
          as: "subAdmin",
        },
      },
      {
        $unwind: {
          path: "$subAdmin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          isAssigned: {
            $cond: {
              if: { $ifNull: ["$subAdmin._id", false] },
              then: true,
              else: false,
            },
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
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (list && list[0].data.length) {
      list[0].data = list[0].data.map((store) => {
        if (store?.logo) {
          store.logo = process.env.IMAGE_BASE_URL + store?.logo;
        }
        if (store?.coverImg) {
          store.coverImg = process.env.IMAGE_BASE_URL + store?.coverImg;
        }
        if (store?.subAdmin?.profileImg) {
          store.subAdmin.profileImg =
            process.env.IMAGE_BASE_URL + store?.subAdmin?.profileImg;
        }
        return store;
      });

      await setResponseObject(
        req,
        true,
        "Store list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Store list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View store */
store.detail = async (req, res, next) => {
  try {
    let getSingle;

    getSingle = await STORE_MODEL.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$subAdmin" },
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
          as: "subAdmin",
        },
      },
      {
        $unwind: {
          path: "$subAdmin",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (getSingle[0]?.logo) {
      getSingle[0].logo = process.env.IMAGE_BASE_URL + getSingle[0]?.logo;
    }

    if (getSingle[0]?.coverImg) {
      getSingle[0].coverImg =
        process.env.IMAGE_BASE_URL + getSingle[0]?.coverImg;
    }

    if (getSingle[0]?.subAdmin?.profileImg) {
      getSingle[0].subAdmin.profileImg =
        process.env.IMAGE_BASE_URL + getSingle[0]?.subAdmin?.profileImg;
    }

    if (getSingle.length > 0) {
      await setResponseObject(req, true, "Store details found", getSingle[0]);
      next();
    } else {
      await setResponseObject(req, true, "Store details not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate store state*/
store.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Store Active successfully";

        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Store In-Active successfully";
        // let findCarts = await CART.find({ companyId: findCompany._id });
        // findCarts.map(async (e) => {
        //   await CART.findByIdAndDelete({ _id: e._id });
        // });
        break;

      default:
    }

    let updateState = await STORE_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: filter,
      },
      { new: true }
    );

    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Store state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete store*/
store.delete = async (req, res, next) => {
  try {
    const deleteData = await STORE_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Store deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Store not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active company list*/
store.storeList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
      );

      searchFilter.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let list = await STORE_MODEL.aggregate([
      {
        $match: { stateId: CONST.ACTIVE },
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
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (list && list[0].data.length) {
      list[0].data = list[0].data.map((store) => {
        if (store?.logo) {
          store.logo = process.env.IMAGE_BASE_URL + store?.logo;
        }
        if (store?.coverImg) {
          store.coverImg = process.env.IMAGE_BASE_URL + store?.coverImg;
        }
        return store;
      });

      await setResponseObject(
        req,
        true,
        "Store list found",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Store list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Sub admin list for assign store*/
store.subAdminList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
      );

      searchFilter.$or = [
        {
          fullName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let list = await USER.aggregate([
      {
        $match: {
          ...searchFilter,
          $or: [{ store: null }, { store: { $exists: false } }],
          roleId: CONST.SUB_ADMIN,
          stateId: CONST.ACTIVE,
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
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Sub admin list found",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Sub admin list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Assign store to sub admin*/
store.assignStore = async (req, res, next) => {
  try {
    let findSubadmin = await USER.findOne({ _id: req.query.subAdmin });

    if (!findSubadmin) {
      await setResponseObject(req, false, "Sub admin not found.");
    }

    let findStore = await STORE_MODEL.findOne({ _id: req.params.id });

    if (!findStore) {
      await setResponseObject(req, false, "Store not found.");
    }

    let assignStore = await USER.findOneAndUpdate(
      { _id: findSubadmin?._id },
      { store: findStore?._id },
      { new: true }
    );

    if (assignStore) {
      await STORE_MODEL.findOneAndUpdate(
        { _id: findStore?._id },
        { subAdmin: findSubadmin?._id },
        { new: true }
      );
      await setResponseObject(
        req,
        true,
        "Store assigned to driver successfully."
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Error occur while assign store to driver."
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Un assign store to sub admin*/
store.unAssign = async (req, res, next) => {
  try {
    let findSubadmin = await USER.findOne({ _id: req.query.subAdmin });

    if (!findSubadmin) {
      await setResponseObject(req, false, "Sub admin not found.");
    }

    let findStore = await STORE_MODEL.findOne({ _id: req.params.id });

    if (!findStore) {
      await setResponseObject(req, false, "Store not found.");
    }

    let assignStore = await USER.findOneAndUpdate(
      { _id: findSubadmin?._id },
      { $unset: { store: "" } },
      { new: true }
    );

    if (assignStore) {
      await STORE_MODEL.findOneAndUpdate(
        { _id: findStore?._id },
        { $unset: { subAdmin: "" } },
        { new: true }
      );
      await setResponseObject(
        req,
        true,
        "Store unassigned from sub-admin successfully."
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Error occur while un assign store from driver."
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = store;
