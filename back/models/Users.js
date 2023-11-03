const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema ({
    
      name: {
        type: String,
      },
      matricula: {
        type: String,
      },
      setor: {
        type: String,
      },
      turno: {
        type: String,
      },
      funcao: {
        type: String,
      },
      email: {
        type: String,
      },
      senha: {
        type: String,
      },
      situacao: {
        type: String,
      },
      roles: {
        type: String,
      }
    }, { timestamps: true }
    );
    
const Users = mongoose.model("Users", usersSchema);

module.exports = {
    Users,
    usersSchema,
};