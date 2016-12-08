var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  useremail: {type:String, required:true, trim:true},
  hostemail: {type:String, required:true, trim:true},
  postid: {type:String, required:true, trim:true},
  title: {type:String, required:true},
  address: {type:String, required:true},
  fromDate: {type:Date},
  toDate: {type:Date},
  createdAt: {type:Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var User = mongoose.model('Reserve', schema);

module.exports = User;