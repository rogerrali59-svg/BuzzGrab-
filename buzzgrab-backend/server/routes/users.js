/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var express = require("express");
var router = express.Router();
require("express-group-routes");
const { upload } = require("../middleware/upload");
const { rateLimitChecker } = require("../middleware/rateLimitChecker");
const { CONST } = require("../helpers/constant");

const _product = require("../app/product/controller/product.controller");
const _wishlist = require("../app/wishlist/controller/controller");
const _cart = require("../app/cart/controller/controller");
const _address = require("../app/address/controller/address.controller");
const _order = require("../app/order/controller/order.controller");

const search = require("../app/search/controller/search.controller");
const _search = new search();

/* Product Management  */
router.group("/product", (product) => {
  product.get("/allProduct", _product.allProduct);
  product.get("/details/:id", _product.viewProduct);
  product.get("/relatedProduct", _product.relatedProduct);
});

/* Cart Management  */
router.group("/cart", (cart) => {
  cart.post("/add", _cart.addCart);
  cart.get("/list", _cart.myCart);
  cart.delete("/removeCart/:id", _cart.removeProduct);
  cart.delete("/clearCart", _cart.cartClear);
  cart.put("/increaseQuantity/:id", _cart.increaseQuantity);
  cart.put("/decreaseQuantity/:id", _cart.decreaseQuantity);
});

/* Wishlist Management  */
router.group("/wishlist", (wishlist) => {
  wishlist.post("/add", _wishlist.addWishlist);
  wishlist.get("/list", _wishlist.getwishList);
});

/* Address Management  */
router.group("/address", (address) => {
  address.post("/add", _address.addAddress);
  address.get("/list", _address.myAddress);
  address.get("/details/:id", _address.addressDetails);
  address.put("/edit/:id", _address.editAddress);
  address.put("/setDefault/:id", _address.setDefaultAddress);
  address.delete("/delete/:id", _address.deleteAddress);
});



/* Search Management*/
router.group("/search", (search) => {
  search.post("/add",_search.add);
  search.get("/list", _search.list);
  search.get("/detail/:id", _search.detail);
  search.delete("/delete/:id",_search.delete);
});


/* Order Management*/
router.group("/order", (order) => {
  order.post("/add",_order.createOrder);
  order.get("/list", _order.myOrder);
  order.get("/list", _order.sellerOrderlist);
  order.get("/detail/:id", _order.orderDetails);
  order.put("/edit/:id", _order.updateOrderState);
  order.delete("/delete/:id",_order.cancelOrder);
});


module.exports = router;
