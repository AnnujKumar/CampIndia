const Campground  = require("./models/campground");
const Review = require("./models/review");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else {
        req.session.returnTo = req.originalUrl;
        req.flash("error","You have to login first");;
        res.redirect("/login");
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const campground = await Campground.findById(id);
    console.log(campground);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.editReview = async(req,res,next)=>{
    const {id,review_id} = req.params;
    console.log(id,review_id)
    const review = await Review.findById(review_id);
    console.log(review);
    if(review.author.equals(req.user._id)){
       return  next();
    }
    req.flash("error","You cant delete this review since you dont own it");
    res.redirect(`/campgrounds/${id}`);
}


module.exports.isLoggedIn = isLoggedIn;