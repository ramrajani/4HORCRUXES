const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/minutemaker');
var passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
  username:String,
  password:String,
  datastore:[{name:String,desp:String,context:String}],
  emailid:String
});


UserSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",UserSchema);