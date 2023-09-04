const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema ({
    name: {
        type: String,
        require:true
    },
    matricula: {
        type: String,
        require:true,
    },
    setor: {
        type: String,
        require:true,
    },
    supervisor: {
        type: String,
        require:true,
    },
    turno: {
        type: String,
        require:true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = {
    Users,
    usersSchema,
};