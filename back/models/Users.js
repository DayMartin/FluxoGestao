const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema ({
    
    name: {
        type: String,
        required: true,
      },
      matricula: {
        type: String,
        required: true,
      },
      setor: {
        type: String,
        required: true,
      },
      supervisor: {
        type: String,
        required: true,
      },
      turno: {
        type: String,
        required: true,
      },
    }, { timestamps: true }
    );
    
const Users = mongoose.model("Users", usersSchema);

module.exports = {
    Users,
    usersSchema,
};