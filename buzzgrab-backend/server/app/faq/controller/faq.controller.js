/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const { FAQ_MODEL } = require("../model/faq.model");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { validateAddFAQ, validateEditFAQ } = require("../model/faq.model");
const { formatErrorResponse } = require("../../../helpers/schedulers");

const faq = {};

/**
 * Add faq api
 */
faq.addFaq = async (req, res, next) => {
  try {
    const data = req.body;
    const { error } = await validateAddFAQ(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });
    data.createdBy = req.userId;
    const isExist = await FAQ_MODEL.findOne({ question: data.question });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Question is already in existence."
      );
      next();
    } else {
      const saveFaq = await FAQ_MODEL.create(data);

      if (saveFaq) {
        await setResponseObject(req, true, "FAQ added successfully", saveFaq);
        next();
      } else {
        await setResponseObject(req, false, "FAQ not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit faq api
 */
faq.editFaq = async (req, res, next) => {
  try {
    const data = req.body;
    const { error } = await validateEditFAQ(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });
    const isExist = await FAQ_MODEL.findOne({
      $and: [{ _id: { $ne: req.params.id } }, { question: data.question }],
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Question is already in existence."
      );
      next();
    }
    const updateFaq = await FAQ_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateFaq) {
      await setResponseObject(req, true, "FAQ updated successfuly", updateFaq);
      next();
    } else {
      await setResponseObject(req, false, "FAQ not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get faq list api
 */
faq.faqList = async (req, res, next) => {
  try {
    let filter = {};
    let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;;
    let pageNo = parseInt(req.query.pageNo) || 1;

    switch (req.query.state) {
      case "1": // ACTIVE
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2": // INACTIVE
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      case "3": // DELETED
        filter = {
          stateId: CONST.DELETED,
        };
        break;

      default:
        break;
    }

    const list = await FAQ_MODEL.aggregate([
      {
        $match: filter,
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
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        "FAQ found successfuly",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "FAQ not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Faq view api
 */
faq.faqDetails = async (req, res, next) => {
  try {
    const details = await FAQ_MODEL.findById({ _id: req.params.id });
    if (details) {
      await setResponseObject(
        req,
        true,
        "FAQ details found successfully",
        details
      );
      next();
    } else {
      await setResponseObject(req, true, "FAQ details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update page state id
 */
faq.updateFaqState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;
    
    switch (parseInt(req.query.stateId)) {
      case 1:
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Faq Active successfully";
        break;

      case 2:
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Faq In-Active successfully";
        break;
      default:
    }

    let updateState = await FAQ_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Faq state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};


/**
 * Update page state id
 */
faq.delete = async (req, res, next) => {
  try {
    let deleteRes = await FAQ_MODEL.findByIdAndDelete({ _id: req.params.id });
    if (deleteRes) {
      await setResponseObject(req, true, "Faq deleted successfully", deleteRes);
      next();
    } else {
      await setResponseObject(req, false, "Faq not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

module.exports = faq;
