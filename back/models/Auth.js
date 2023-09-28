const mongoose = require("mongoose");

const { Schema } = mongoose;

const authSchema = new Schema ({
    
      email: {
        type: String,
    
      },
      senha: {
        type: String,

      },
    }, { timestamps: true }
    );
    
const Auth = mongoose.model("Auth", authSchema);

module.exports = {
    Auth,
    authSchema,
};