const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const idCounterSchema = new Schema({
  model: String,
  field: String,
  count: Number,
});

const IdCounter = mongoose.model("IdCounter", idCounterSchema);

module.exports = IdCounter;
