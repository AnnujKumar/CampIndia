const express = require("express");
const review = require("../models/review");
const Review = require("../controllers/reviews");
const asyncWrap = require("../utils/asyncWrap");
const campground = require("../models/campground");
const {reviewsValidator} = require("../utils/schemaValidator");
const {isLoggedIn,editReview} = require("../middleware");
const router = express.Router({mergeParams:true});
router.post("",isLoggedIn,reviewsValidator,asyncWrap(Review.postReview))
router.delete("/:review_id",isLoggedIn,editReview,asyncWrap(Review.deleteReview));
module.exports = router;