const mongoose = require("mongoose");
const { Schema } = mongoose;

const rolePermissionSchema = new Schema({
  role_id: {
    type: Schema.Types.ObjectId,
    ref: "Roles", // Referência à coleção de Roles
  },
  permission_id: {
    type: Schema.Types.ObjectId,
    ref: "Permissions", // Referência à coleção de Permissions
  },
});

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);

module.exports = RolePermission;
