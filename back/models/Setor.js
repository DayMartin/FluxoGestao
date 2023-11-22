const mongoose = require("mongoose");

const { Schema } = mongoose

const setorSchema = new Schema ({

    name: {
        type: String,
        require:true,
    },
    equipe: [{
        type: Schema.Types.ObjectId,
        ref: 'Equipe' 
      }],
  },
  { timestamps: true }
);

const Setor = mongoose.model("Setor", setorSchema);

module.exports = {
    Setor,
    setorSchema,
  };
  