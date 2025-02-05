const mongoose = require("mongoose");
const review = require("./review");
const user = require("./user");
const { campgroundSchema } = require("../schemas/campgroundSchema");
const Schema = mongoose.Schema;
const ImageSchema = Schema({
        url:String,
        filename:String
})
ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200");
})
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema =   Schema({
    title:String,
    price:Number,
    images: [ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:"Point",
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    description:String,
            location:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},opts);
CampgroundSchema.post("findOneAndDelete",async function (doc){
    if(doc){
    await review.deleteMany({_id:{$in:doc.reviews}});
    console.log("Deleted");
}
})
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
module.exports  = mongoose.model("Campground",CampgroundSchema);