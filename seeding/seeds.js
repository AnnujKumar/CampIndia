const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const {descriptors,places} = require("./seedHelpers");
mongoose.connect("mongodb://localhost:27017/yelp-camp").then(()=>{
console.log("Database connected");
}).catch(err=>{
    console.log(err);
});

const sample = (array)=>{return array[Math.floor(Math.random()*array.length)]};


const seedDb = async ()=>{
    await campground.deleteMany({});
    for(let i = 0;i<300;i++){
    const randomNum = Math.floor(Math.random()*1000);
    const camp = new campground({
        price:Math.floor(Math.random()*100),
        images:[
            {
              url: 'https://res.cloudinary.com/dlqmb0jce/image/upload/v1738527267/campground-trial/dbdz6l088lmuxwagxy3p.jpg',
              filename: 'campground-trial/dbdz6l088lmuxwagxy3p',
              
            },
            {
              url: 'https://res.cloudinary.com/dlqmb0jce/image/upload/v1738527276/campground-trial/pmmwvjbngyut1h8isdzi.jpg',
              filename: 'campground-trial/pmmwvjbngyut1h8isdzi',
              
            },
            {
              url: 'https://res.cloudinary.com/dlqmb0jce/image/upload/v1738527286/campground-trial/dhg6afcexxrtrk1ofdrp.jpg',
              filename: 'campground-trial/dhg6afcexxrtrk1ofdrp',
              
            },
            {
              url: 'https://res.cloudinary.com/dlqmb0jce/image/upload/v1738527290/campground-trial/pg8ascl0tu34vrruondj.jpg',
              filename: 'campground-trial/pg8ascl0tu34vrruondj',
            
            }
          ],        title:`${sample(descriptors)} ${sample(places)}`,
        location:`${cities[randomNum]['city']}, ${cities[randomNum]['state']}`,
        geometry:{
          type:"Point",
          coordinates:[cities[randomNum].longitude,cities[randomNum].latitude]
        }
        
        ,
        description:"Msg Is Best",
        author:"678f97faa11ad66743a042a2"
    })
    await camp.save();
}
}

seedDb().then(()=>{
    mongoose.connection.close();
})