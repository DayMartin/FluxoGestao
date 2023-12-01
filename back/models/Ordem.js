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
        type: Schema.Types.ObjectId,
        ref: 'Users' 
      },
    setor: {
        type: String,
        require:true,
    },
    equipe: {
        type: String,
        require:true,
    },
    setor_criacao: {
        type: String,
        require:true,
    },
    sala: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sala', 
      },
    forno: {
        type: Number,
        require:true,
    },
    cabeceira: {
        type: String,
        require:true,
    },
    status: {
        type: String,
        require:true,
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
