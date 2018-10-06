const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/minutemaker');

const Schema = mongoose.Schema;
 
const ContextSchema = new Schema({
  tid:Number,
  desp:String
});

const Context = mongoose.model('Context', ContextSchema);


module.exports = Context;