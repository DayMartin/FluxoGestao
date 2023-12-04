const mongoose = require("mongoose");

const { Schema } = mongoose

const { serviceSchema } = require("./Service")
const { commentsSchema } = require("./Comments")

const ordemSchema = new Schema ({

    ordemId: {
        type: Number,
        require:false,
    },
    solicitante: {
        type: String,
        require:true,
      },

    solicitante_name: {
        type: String,
        require:true,
      },

    setor_solicitante: {
         type: String,
         require:true,
     },
    name_setor_solicitante: {
        type: String,
        require:true,
    },
    equipe_solicitante: {
        type: String,
        require:true,
    },
    name_equipe_solicitante: {
        type: String,
        require:true,
    },
    sala: {
        type: Number,
        require:true,
      },
    forno: {
        type: Number,
        require:true,
    },
    cabeceira: {
        type: String,
        require:true,
    },
    setor: {
        type: Schema.Types.ObjectId,
        ref: 'Setor' 
    },
    status: {
        type: String,
        require:true,
    },
    equipe: {
        type: Schema.Types.ObjectId,
        ref: 'Equipe' 
    },
    services: {
        type: [serviceSchema],
    },
    comments: {
        type: [commentsSchema],
    },
    urgencia: {
        type: String,
        require:true,
    },
  },
  { timestamps: true }
);

const Ordem = mongoose.model("Ordem", ordemSchema);

module.exports = {
  Ordem,
  ordemSchema,
};
