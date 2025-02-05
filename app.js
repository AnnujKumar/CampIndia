const express = require("express");
const app = express();
const path = require("path");
const expressError = require("./utils/expressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const ejsMate = require("ejs-mate");
const reviewRouter = require("./routes/review");
const mongoSanitize = require('express-mongo-sanitize');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
require("dotenv").config();
const session = require("express-session");
const userRoutes = require("./routes/users");
const campgroundRouter = require("./routes/campground");
const flash = require("connect-flash");
const helmet = require('helmet');
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl).then(()=>{
console.log("Database connected");
}).catch(err=>{
    console.log(err);
});
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
const sessionConfig = {
    name:"sessionData",
    secret: 'msgisbest',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dlqmb0jce/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.set('view engine','ejs');
app.use(mongoSanitize());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session(sessionConfig));
app.use(methodOverride("_method"));
app.use(flash());

/*Passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*Passport setup done*/ 

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})
app.use("/campgrounds",campgroundRouter);
app.use("/campgrounds/:id/reviews",reviewRouter);
app.get("/fakeuser",async(req,res)=>{
    const user = new User({email:"msginsan@gmail.com",username:"MSG"});
    const newUser = await User.register(user,"insan");
    res.send(newUser);
})
app.use("",userRoutes);
app.all("*",(req,res,next)=>{
    next(new expressError("Sorry boy",404));
})
app.use((err,req,res,next)=>{
    const {message="Sorry couldn't process your request",statusCode=500} = err;
    res.status(statusCode).render("errors/index",{err});
})


app.listen(3000,()=>{
    console.log("Connection established");
})