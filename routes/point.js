var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')

var mongoose = require('mongoose');
var db = require('../utility/db.js');
var User = require("../models/user");
var Point = require("../models/point");
const point = require('../models/point');
var ObjectId = require('mongoose').Types.ObjectId


router.post('/newPoint', requireLogin, (req, res) => {
  const {lng, lat, description, photos ,distributionDate, contactNumber, landmarkName, volunteer } = req.body;

  if( !lng ||!lat  ||  !contactNumber || !landmarkName || !volunteer ){
    return res.status(422).json({error:"Null fields are not allowed"})
  }
  const point = new Point({
    lat,
    lng,
    location: {
      type:"Point",
      coordinates:[lng, lat]
    },
    owner: req.user || "", 
    photos: photos, 
    description, 
    contactNumber,
    distributionDate,
    landmarkName, 
    volunteer,
    
  })
  point.save()
    .then(() => {
      res.json({message:"Saved successfully"})
    })
    .catch((error) => {
      console.log(error);
    });

});

router.get("/nearbyPoints", (req, res) => {
  const {maxDistance, lng, lat} = req.query;
  if(!lng||!lat){
    res.status(422).json({ error: "Both lat and lng need to be present!" });
  }
  console.log(req.query)
      Point.find({
        location: {
         $nearSphere: {
          $maxDistance: Number(maxDistance)||(10000), //meters
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          }
         }
        }
      },'_id lat lng')
      .find((error, result) => {
        if(error) 
          console.log(error);
        //console.log("nearby Points called, "+(result)?result.length:"0"+" Points found nearby.")
        res.json(result);
       });
});

router.get("/ownerPoints", requireLogin, async (req, res) => {
  try{
    const pointArray = await Point.find({
      'owner': (ObjectId)(req.user._id) 
    }).populate("owner");
    res.json(pointArray);
    console.log("owner Points called, "+req.user._id)
}
catch (error){
    res.status(422).send(error);
}
 })

router.get("/allPoints", async (req, res) => {
    try{
        const pointArray = await Point.find({}).populate("owner");
        res.json(pointArray);
        console.log("all points called")
    }
    catch (error){
        res.status(422).send(error);
    }
});

router.post("/changeAvailability", requireLogin, async (req, res) => {
    const {point_id} = req.body;
    console.log("change avail re")
    Point.findOne({ _id: point_id }, function(err, point) {
      if(!point){
        console.log(point);
        return res.status(422).json({error:"This point doesn't exist."})
   
   }
      //console.log({point})
      if(String(point.owner)!==String(req.user._id)){
           return res.status(422).json({error:"You do not own this point! point owner- " +point.owner+" and you - "+req.user._id})
      
      }
      
      point.isAvailable = !point.isAvailable;
      point.save()
      .then(() => {
        res.json({message:"Changed availability successfully"})
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

router.post("/newRating", requireLogin,  async (req, res) => {
  const {point_id, rating} = req.body;
  console.log(req.body)
  Point.findOne({ _id: point_id }, function(err, point) {
    // if(point.usersWhoRated.includes(req.user._id)){
    //   return res.status(422).json({error:"You have already voted!"})
      
    // }
    // if(point.avgRating===-1){
    //   point.avgRating===0;
    // }
    // point.avgRating=(point.avgRating*point.usersWhoRated.length+rating)/(point.usersWhoRated.length+1);
    point.usersWhoRated.push(req.user._id); //This is from requireLogin(uses the bearer code there)
    point.save()
    .then((data) => {
      console.log(data)
      res.json(data)
    })
    .catch((error) => {
      console.log(error);
    });
});
});


router.post("/onePoint", requireLogin,  async (req, res)=>{
  const { point_id } = req.body; 
  try
  {
       const thePoint = await Point.findOne({_id: point_id}).populate("owner");
       console.log("the point is: ",thePoint);
      if (thePoint)
      {
        console.log("sending point to the app: ",thePoint);
        res.json(thePoint)
      }
      else
      {
        res.status(422).json({error:"No such point exists"})
      }
  }
  catch (e) 
  {
    console.log(e)
    res.status(422).json({error:"Error"})
  }
  
})

module.exports = router;