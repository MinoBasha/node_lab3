var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var posts=new Schema({
  _id:Number,
  title:String,
  comment:[Object],
  image:String,
  time:{
    type:Date,
    default:Date.now
  },
  // FK
  user:{
    type:Number,
    ref:"users"
  }
});


// Register Model ..
mongoose.model("posts",posts);
