const express = require("express");
const router = express.Router()
const isLoggedin = require("../middlewares/isLoggedin")
const productModel = require("../models/product-model"); // Adjust path according to your project structure
const userModel = require("../models/user-model");


router.get("/",function(req,res){
let error = req.flash("error")
res.render("index",{error,loggedin:false})
});

router.get("/shop", isLoggedin, async function (req, res) {
    let success = req.flash("success")
    try {
        const products = await productModel.find(); // Fetch all products
        res.render("shop", { products,success }); // ✅ Pass products to EJS
    } catch (err) {
        console.error("Error loading shop page:", err.message);
        req.flash("error", "Could not load products");
        res.redirect("/");
    }
});
router.get("/cart", isLoggedin, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  let total = 0;
  const platformFee = 20; // fixed platform fee per product

  user.cart.forEach(item => {
    const itemTotal = Number(item.price) - Number(item.discount) + platformFee;
    total += itemTotal;
  });

  res.render("cart", { user, total }); // pass 'total' instead of 'bill'
});

router.get("/addtocart/:productid", isLoggedin, async function(req, res){
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to add product to cart");
    res.redirect("/shop");
  }
});

router.get("/logout",isLoggedin,function(req,res){
    res.render("shop")
})
module.exports = router;
