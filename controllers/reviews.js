const campground = require("../models/campground");
const review = require("../models/review");
module.exports.postReview = async(req,res)=>{
    const {id} = req.params;
    const camp =await  campground.findById(id);
    const rev = new review(req.body.review);
    rev.author = req.user._id;
    camp.reviews.push(rev);
    await camp.save();
    await rev.save();
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteReview = async(req,res,next)=>{
    const {id,review_id} = req.params;
    const camp = await campground.findByIdAndUpdate(id,{$pull:{reviews:review_id}});
    const rev = await review.findByIdAndDelete(review_id);
    await camp.save();
    res.redirect(`/campgrounds/${id}`);
}