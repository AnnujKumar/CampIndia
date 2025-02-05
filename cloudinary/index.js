const multer = require("multer");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.cloud,
    api_key:process.env.api,
    api_secret:process.env.secret
})
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"campground-trial",
        allowedFormats:["jpeg","jpg","png"]
    }
})
module.exports = {cloudinary,storage};