const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  title_name: { type: String, default: null },
  anime_description: { type: String, default: null },
  anime_type : {type:String,default:null},
  anime_status : {type:String,default:null},
  rating :{type:Number,default:null},
  episodes:{type:Number,default:null},
  duration:{type:String,default:null},
  date_start:{type:Date,default:null},
  date_end:{type:Date,default:null},
  user:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  }],
  comments: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref:'comment'
  }]

});


module.exports = mongoose.model("anime", animeSchema); 