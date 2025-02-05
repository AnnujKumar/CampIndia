
const asyncWrap = require("../utils/asyncWrap");
const expressError = require("../utils/expressError");
const campground = require("../models/campground");
const {campgroundValidator} = require("../utils/schemaValidator");
const express = require("express");
const multer = require("multer");

const {cloudinary,storage} = require("../cloudinary");

const upload = multer({storage:storage});
const {isLoggedIn,isAuthor} = require("../middleware");
const Campground = require("../controllers/campground");
const router = express.Router({mergeParams:true});
router.get("",asyncWrap(Campground.home));
router.get("/new",isLoggedIn,Campground.newCampground);
router.post("",isLoggedIn,upload.array("image"),campgroundValidator,asyncWrap(Campground.createCampground));
router.get("/:id",isLoggedIn,asyncWrap(Campground.showIndividual));
router.put("/:id",isLoggedIn,upload.array("image"),asyncWrap(Campground.updateCampground));
router.delete("/:id",isLoggedIn,asyncWrap(Campground.deleteCampground));
router.get("/:id/edit",isLoggedIn,asyncWrap(Campground.updateIndividual));
module.exports = router;