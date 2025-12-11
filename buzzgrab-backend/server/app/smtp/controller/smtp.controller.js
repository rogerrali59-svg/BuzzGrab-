/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

let { SMTP, TWILIO } = require("../model/smtp.model");
let { CONST } = require("../../../helpers/constant");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;

let smtp = {};

/**
 * Add smtp api
 */
smtp.addSmtp = async (req, res, next) => {
  try {
    const data = req.body;

    // 1. Check if an active SMTP already exists for the email
    const isExist = await SMTP.find({
      email: data.email
    });

    if (isExist) {
      // 2. Inactivate all existing active SMTPs for this email
      await SMTP.updateMany(
        { stateId: CONST.ACTIVE },
        { $set: { stateId: CONST.INACTIVE } }
      );
    }

    // 3. Add the new SMTP with active state
    data.stateId = CONST.ACTIVE; // Ensure new one is active
    const saveKey = await SMTP.create(data);

    if (saveKey) {
      await setResponseObject(
        req,
        true,
        "SMTP created successfully. Previous SMTPs are now inactive.",
        saveKey
      );
    } else {
      await setResponseObject(req, false, "SMTP not created.", saveKey);
    }

    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


/**
 * Edit smtp api
 */
smtp.editSmtp = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await SMTP.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        {
          email: data.email,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Smtp already exist with this email.");
      next();
    } else {
      const editSmtp = await SMTP.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (editSmtp) {
        await setResponseObject(
          req,
          true,
          "Smtp updated successfully.",
          editSmtp
        );
        next();
      } else {
        await setResponseObject(req, false, "Smtp not updated");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * SmtP list api
 */
smtp.smtpList = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    const list = await SMTP.aggregate([
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
        "Smtp list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Smtp list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete smtp
 */
smtp.deleteSmtp = async (req, res, next) => {
  try {
    const deleteKey = await SMTP.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      let findActiveInfo = await SMTP.findOne({ stateId: CONST.ACTIVE });

      if (!findActiveInfo) {
        let findInactiveInfo = await SMTP.findOne({
          stateId: CONST.INACTIVE,
        });

        if (findInactiveInfo) {
          await SMTP.findByIdAndUpdate(
            findInactiveInfo._id,
            { stateId: CONST.ACTIVE },
            { new: true }
          );
        }
      }
      await setResponseObject(req, true, "Smtp deleted successfully");
      next();
    } else {
      await setResponseObject(req, true, "Smtp not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View smtp
 */
smtp.viewSmtp = async (req, res, next) => {
  try {
    const viewSmtp = await SMTP.findById({
      _id: req.params.id,
    });
    if (viewSmtp) {
      await setResponseObject(
        req,
        true,
        "Smtp details found successfully",
        viewSmtp
      );
      next();
    } else {
      await setResponseObject(req, true, "Smtp details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};
/**
 * Update page state id
 */
smtp.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    // Check if the state is being set to ACTIVE (1)
    if (parseInt(req.body.stateId) === CONST.ACTIVE) {
      // Find an existing ACTIVE record and set it to INACTIVE first
      const activeRecord = await SMTP.findOne({ stateId: 1 });

      if (activeRecord) {
        // If there is an ACTIVE record, update it to INACTIVE
        await SMTP.findByIdAndUpdate(activeRecord._id, {
          $set: { stateId: CONST.INACTIVE }, // Set the state of the existing ACTIVE record to INACTIVE
        });
        resp = "Previous Active smtp has been set to Inactive.";
      }

      // Now, update the current record to ACTIVE
      filter = { stateId: CONST.ACTIVE }; // Set current record state to ACTIVE
      resp = resp ? resp + " " : "";
      resp += "SMTP Active successfully.";

    } else if (parseInt(req.body.stateId) === CONST.INACTIVE) {
      const activeCount = await SMTP.countDocuments({ stateId: CONST.ACTIVE });

      if (activeCount <= 1) {
        await setResponseObject(req, false, "At least one record must remain active.");
        return next();
      }
      filter = { stateId: CONST.INACTIVE };
      resp = "SMTP In-Active successfully";
    } else {
      resp = "Invalid state provided.";
    }

    // Perform the state update
    let updateState = await SMTP.findByIdAndUpdate(
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
      await setResponseObject(req, false, "SMTP state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};


/**
 * Add Twillio api
 */
smtp.addTwilio = async (req, res, next) => {
  try {
    const data = req.body;

    // 1. Inactivate all previously active TWILIO records
    await TWILIO.updateMany(
      { stateId: CONST.ACTIVE },
      { $set: { stateId: CONST.INACTIVE } }
    );

    // 2. Add the new TWILIO with active state
    data.stateId = CONST.ACTIVE;
    const saveKey = await TWILIO.create(data);

    if (saveKey) {
      await setResponseObject(
        req,
        true,
        "Twilio created successfully. Previous Twilios are now inactive.",
        saveKey
      );
    } else {
      await setResponseObject(req, false, "Twilio not created.", saveKey);
    }

    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


/**
 * Edit Twillio api
 */
smtp.editTwilio = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await TWILIO.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        {
          number: data.number,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Twillio already exist with this email.");
      next();
    } else {
      const editSmtp = await TWILIO.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (editSmtp) {
        await setResponseObject(
          req,
          true,
          "Twillio updated successfully.",
          editSmtp
        );
        next();
      } else {
        await setResponseObject(req, false, "Twillio not updated");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Twillio list api
 */
smtp.TwilioList = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    const list = await TWILIO.aggregate([
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

    console.log("list", list)
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Twillio list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Twillio list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete Twillio
 */
smtp.deleteTwilio = async (req, res, next) => {
  try {
    const deleteKey = await TWILIO.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      let findActiveInfo = await TWILIO.findOne({ stateId: CONST.ACTIVE });

      if (!findActiveInfo) {
        let findInactiveInfo = await TWILIO.findOne({
          stateId: CONST.INACTIVE,
        });

        if (findInactiveInfo) {
          await TWILIO.findByIdAndUpdate(
            findInactiveInfo._id,
            { stateId: CONST.ACTIVE },
            { new: true }
          );
        }
      }
      await setResponseObject(req, true, "Twillio deleted successfully");
      next();
    } else {
      await setResponseObject(req, true, "Twillio not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View Twillio
 */
smtp.viewTwilio = async (req, res, next) => {
  try {
    const viewSmtp = await TWILIO.findById({
      _id: req.params.id,
    });
    if (viewSmtp) {
      await setResponseObject(
        req,
        true,
        "Twillio details found successfully",
        viewSmtp
      );
      next();
    } else {
      await setResponseObject(req, true, "Twillio details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};
/**
 * Update page state id
 */
smtp.updateTwilioState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    // Check if the state is being set to ACTIVE (1)
    if (parseInt(req.body.stateId) === CONST.ACTIVE) {
      // Find an existing ACTIVE record and set it to INACTIVE first
      const activeRecord = await TWILIO.findOne({ stateId: 1 });

      if (activeRecord) {
        // If there is an ACTIVE record, update it to INACTIVE
        await Twillio.findByIdAndUpdate(activeRecord._id, {
          $set: { stateId: CONST.INACTIVE }, // Set the state of the existing ACTIVE record to INACTIVE
        });
        resp = "Previous active Twillio has been set to inactive. ";
      }

      // Now, update the current record to ACTIVE
      filter = { stateId: CONST.ACTIVE }; // Set current record state to ACTIVE
      resp = resp ? resp + " " : "";
      resp += "Twillio set to active successfully.";

    } else if (parseInt(req.body.stateId) === CONST.INACTIVE) {
      const activeCount = await TWILIO.countDocuments({ stateId: CONST.ACTIVE });
      if (activeCount <= 1) {
        await setResponseObject(req, false, "At least one record must remain active.");
        return next();
      }
      filter = { stateId: CONST.INACTIVE };
      resp = "Twillio In-Active successfully";
    } else {
      resp = "Invalid state provided.";
    }

    // Perform the state update
    let updateState = await TWILIO.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Twillio state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};


/**
 * Add Stripe api
 */
smtp.addStripe = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await STRIPE.findOne({
      $and: [
        {
          publishableKey: data.publishableKey,
        },
        { secretKey: data.secretKey },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Stripe already exist with this email.");
      next();
    } else {

      const saveKey = await STRIPE.create(data);
      if (saveKey) {
        await setResponseObject(
          req,
          true,
          "Stripe created successfully.",
          saveKey
        );
        next();
      } else {
        await setResponseObject(req, false, "Stripe not created.", saveKey);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Edit Stripe api
 */
smtp.editStripe = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await STRIPE.findOne({
      $and: [
        { _id: { $ne: req.params.id } },

        {
          publishableKey: data.publishableKey,
        },
        { secretKey: data.secretKey },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Stripe already exist with this email.");
      next();
    } else {
      const editSmtp = await SMTP.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (editSmtp) {
        await setResponseObject(
          req,
          true,
          "Stripe updated successfully.",
          editSmtp
        );
        next();
      } else {
        await setResponseObject(req, false, "Stripe not updated");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Stripe list api
 */
smtp.stripeList = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    const list = await STRIPE.aggregate([
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
        "Stripe list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Stripe list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete Stripe
 */
smtp.deleteStripe = async (req, res, next) => {
  try {
    const deleteKey = await STRIPE.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      await setResponseObject(req, true, "Stripe deleted successfully");
      next();
    } else {
      await setResponseObject(req, true, "Stripe not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View Stripe
 */
smtp.viewStripe = async (req, res, next) => {
  try {
    const viewSmtp = await STRIPE.findById({
      _id: req.params.id,
    });
    if (viewSmtp) {
      await setResponseObject(
        req,
        true,
        "Stripe details found successfully",
        viewSmtp
      );
      next();
    } else {
      await setResponseObject(req, true, "Stripe details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};
/**
 * Update page state id
 */
smtp.updateStripeState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    // Check if the state is being set to ACTIVE (1)
    if (req.body.stateId === CONST.ACTIVE) {
      // Find an existing ACTIVE record and set it to INACTIVE first
      const activeRecord = await STRIPE.findOne({ stateId: 1 });

      if (activeRecord) {
        // If there is an ACTIVE record, update it to INACTIVE
        await STRIPE.findByIdAndUpdate(activeRecord._id, {
          $set: { stateId: CONST.INACTIVE }, // Set the state of the existing ACTIVE record to INACTIVE
        });
        resp = "Previous Active Faq has been set to Inactive.";
      }

      // Now, update the current record to ACTIVE
      filter = { stateId: CONST.ACTIVE }; // Set current record state to ACTIVE
      resp = resp ? resp + " " : "";
      resp += "Stripe Active successfully.";

    } else if (req.body.stateId === CONST.INACTIVE) {
      const activeCount = await STRIPE.countDocuments({ stateId: CONST.ACTIVE });
      if (activeCount <= 1) {
        await setResponseObject(req, false, "At least one record must remain active.");
        return next();
      }
      filter = { stateId: CONST.INACTIVE };
      resp = "Stripe In-Active successfully";
    } else {
      resp = "Invalid state provided.";
    }

    // Perform the state update
    let updateState = await STRIPE.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Stripe state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};


module.exports = smtp;
