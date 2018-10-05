const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/minutemaker');

const Schema = mongoose.Schema;
 
const contextSchema = new Schema({
  tid:Number,
  desp:String
});

const Context = mongoose.model('Context', contextSchema);


module.exports = Context;