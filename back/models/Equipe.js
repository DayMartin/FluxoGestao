const mongoose = require("mongoose");
const { Schema } = mongoose;

const equipeSchema = new Schema({
  equipeName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Equipe = mongoose.model("Equipe", equipeSchema);

module.exports = {
  Equipe,
  equipeSchema,
};
