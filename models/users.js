var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var users=new Schema({
  _id:Number,
  name:String,
  dob:{
    type:Date,
    default:Date.now
  }
});

users.plugin(mongoosePaginate);
// mongoose Hooks
users.pre('save',function(next){

})
//
users.post('remove',function(doc){
  /// Cascade ..
  var user_id = doc._id;
  mongoose.model("posts").remove({user:user_id},function(err,resutl){

  })
});
// Register Model ..
mongoose.model("users",users);
