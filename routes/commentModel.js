const mongoose = require("mongoose");

const comments = new mongoose.Schema({
  animeid: {type: String},
  username: { type: String},
  text : {type:String}
});

module.exports = mongoose.model("comment", comments); 