const campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
module.exports.home = async(req,res)=>{
    const campgrounds = await campground.find({});
    req.flash("success","MSG");
    res.render("campgrounds/index",{campgrounds});
}
module.exports.createCampground = async(req,res,next)=>{
    if(!req.body.title) next(new expressError("Opps no title entered!",404));
    const data = req.body;
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });    
    const images = req.files.map(f=>({url:f.path,filename:f.filename}));
    const camp = new campground(data);
    camp.geometry = geoData.features[0].geometry;
    camp.images = images;
    camp.author = req.user._id;
    await camp.save();
    console.log(camp)
    if(camp){
        req.flash("success","Successfully Created Campground");
    }
    res.redirect("/campgrounds");
}
module.exports.newCampground = (req,res)=>{
    res.render("campgrounds/new");
}
module.exports.showIndividual  = async(req,res)=>{
    const {id} = req.params;
    const item = await campground.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author");
    res.render("campgrounds/show",{item});
}
module.exports.updateCampground = async(req,res)=>{
    const edit = {};
    if(req.body.title) edit.title=req.body.title;
    if(req.body.price)edit.price = req.body.price;
    if(req.body.description)edit.description = req.body.description;
    if(req.body.location){
        edit.location = req.body.location;
        const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
        edit.geometry = geoData.features[0].geometry;
    }
    const camp =await  campground.findByIdAndUpdate(req.params.id,edit,{new:true});
    const image = req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.images.push(...image);
    if(req.body.deleteImages){
        for(let img of req.body.deleteImages){
            console.log(img);
            await cloudinary.uploader.destroy(img);
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
    }
   await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteCampground = async(req,res)=>{
    const camp = await campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
};
module.exports.updateIndividual = async (req,res)=>{
    const camp = await campground.findById(req.params.id);
    res.render("campgrounds/edit",{camp});
}