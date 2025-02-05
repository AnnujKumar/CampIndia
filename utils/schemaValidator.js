
const {campgroundSchema}= require("../schemas/campgroundSchema");
const {reviewsSchema} = require("../schemas/campgroundSchema");
const expressError = require("./expressError");
const campgroundValidator = (req,res,next)=>{
    const {error} = campgroundSchema.validate((req.body));
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new expressError(msg);
    }
    else next();
}
const reviewsValidator = (req,res,next)=>{
    const {error} = reviewsSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new expressError(msg);
    }
    else next();
}
module.exports.campgroundValidator = campgroundValidator;
module.exports.reviewsValidator = reviewsValidator;