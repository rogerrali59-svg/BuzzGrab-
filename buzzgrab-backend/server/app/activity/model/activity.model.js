/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const mongoose = require("mongoose")
const activeSchema  = new mongoose.Schema({
    error:{
        type: String
    },
    url:{
        type: String
    },
    method:{
        type: String
    },
    userIP:{
        type: String
    },
    reqMethod:{
        type: String
    },
    email:{
        type: String
    }
    
}, { timestamps: true })

module.exports = mongoose.model("activity", activeSchema)