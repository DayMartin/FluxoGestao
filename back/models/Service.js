const mongoose = require("mongoose");

const { commentsSchema } = require("./Comments")

const { Schema } = mongoose;

const serviceSchema = new Schema ({
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