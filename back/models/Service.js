const mongoose = require("mongoose");

const { commentsSchema } = require("./Comments")

const { Schema } = mongoose;

const { v4: uuidv4 } = require('uuid');

const serviceSchema = new Schema ({
    id_service: {
        type: String,
        default: uuidv4,
        required: true,
      },
    name: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require:true,
    },
    status: {
        type: String,
        require:true,
    },
    solicitante_servico: {
        type: String,
        require:true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service,
    serviceSchema,
};