const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let employeeSchema = new Schema ({
  name: {type:String, require: true},
  title: {type:String, default: "null"},
  gender: {type:String, default: "null"},
  startDate: {type:Date, default: Date.now },
  avatar: {type: String, default: "null"},
  officePhone: {type: String, default: "null"},
  cellPhone: {type: String, default: "null"},
  email: {type: String, default: "null"},
  manager: {type: Schema.Types.ObjectId, ref: 'Employee', default: null},
  /* if keep it, need to change array of ID with ref */
  directReports:{type:Number, default: 0, min: 0},
});

module.exports = mongoose.model("Employee", employeeSchema);