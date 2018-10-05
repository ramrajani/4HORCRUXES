const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/minutemaker');

const Schema = mongoose.Schema;
 
const SpokenTextSchema = new Schema({
  tid:Number,
  desp:String
});

const Spokentext = mongoose.model('Spokentext', SpokenTextSchema);


module.exports = Spokentext;