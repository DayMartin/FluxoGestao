const mongoose = require("mongoose");

const { Schema } = mongoose;

const permissionsSchema = new Schema ({
    
      name: {
        type: String,
      },
      description: {
        type: String,
      },
    }, { timestamps: true }
    );
    
const Permissions = mongoose.model("Permissions", permissionsSchema);

module.exports = {
    Permissions: Permissions,
    permissionsSchema: permissionsSchema,
};