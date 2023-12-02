const mongoose = require("mongoose");

const { Schema } = mongoose

const salaSchema = new Schema ({

    salaNumber: {
        type: Number,
        require:true,
    }
  },
  { timestamps: true }
);

const Sala = mongoose.model("Sala", salaSchema);

module.exports = {
    Sala,
    salaSchema,
  };
  