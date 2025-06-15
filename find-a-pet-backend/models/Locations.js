const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  country: { type: String, required: true },
  departments: {
    type: Map,
    of: [String],
    required: true
  }
});

module.exports = mongoose.model('Locations', locationSchema);
