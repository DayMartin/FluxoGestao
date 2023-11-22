const mongoose = require("mongoose");

const { Schema } = mongoose

const salaSchema = new Schema ({

    salaNumber: {
        type: Number,
        require:true,
    },
    setor: [{
        type: Schema.Types.ObjectId,
        ref: 'Setor' 
      }],
  },
  { timestamps: true }
);

const Sala = mongoose.model("Sala", salaSchema);

module.exports = {
    Sala,
    salaSchema,
  };
  