const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersrolesSchema = new Schema ({
    
    name: String,
    description: String,

    }, { timestamps: true });

const UsersRoles = mongoose.model("UsersRoles", usersrolesSchema);

module.exports = {
    UsersRoles,
    usersrolesSchema,
};