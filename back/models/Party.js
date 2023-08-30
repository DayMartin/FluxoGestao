const mongoose = require("mongoose");

const { Schema } = mongoose

const { serviceSchema } = require("./Service")
const { commentsSchema } = require("./Comments")

const partySchema = new Schema ({
    title: {
        type: String,
        require:true,
    },
    solicitante: {
        type: String,
        require:true,
    },
    setor: {
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
    status: {
        type: String,
        require:true,
    },
    estadoatual: {
        type: String,
        require:true,
    },
    services: {
        type: [serviceSchema],
    },
    comments: {
        type: [commentsSchema],
    },
  },
  { timestamps: true }
);

const Party = mongoose.model("Party", partySchema);

module.exports = Party;