const mongoose = require("mongoose");
const { Schema } = mongoose;

const rolesSchema = new Schema({
  name: String,
  description: String,
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permissions'  // Referência à coleção de Permissões
  }]
}, { timestamps: true });

const Roles = mongoose.model("Roles", rolesSchema);

module.exports = {
  Roles: Roles,
  rolesSchema: rolesSchema,
};
