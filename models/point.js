
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const onePointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});


const pointSchema = new mongoose.Schema({
    //latitude and longitude
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    //geojson object, needs type:'Point' and stuff.
    location: {
        type: onePointSchema,
        index: '2dsphere'
    },
    owner: {
        type: ObjectId,
        ref: "User"
    },
    pointType: {
        type: String,
        default: "i"
    },


    photos: {
        type: [String]
        //by default it's an empty array.
    },
    contactNumber: {
        type: String,
        // default: "c"
    },
    /*
    "a" - only females
    "b" - only males
    "c" - both
    */
    
    distributionDate: {
        type: Date,
        default: "Sorry, no date to show"
    },

    description: {
        type: String,
        // required: true
    },
    landmarkName: {
        type: String,
    },
    avgRating: {
        type: Number,
        default: -1
    },
    usersWhoRated: {
        type: [ObjectId],
        ref: "User"
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    volunteer: {
        type: String,

    },
    

});


module.exports = mongoose.model("Point", pointSchema, 'newPoints');