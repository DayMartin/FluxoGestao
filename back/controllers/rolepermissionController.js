const { RolePermission: RolePermissionModel } = require("../models/RolePermission");
const { RolePermission } = require("../models/RolePermission");

const rolePermissionController = {
  create: async (req, res) => {
    try {
      const { role_id, permission_id } = req.body;

      // Validações (verifique se role_id e permission_id são fornecidos e válidos)

      const rolePermission = new RolePermission({
        role_id,
        permission_id,
      });

      const response = await rolePermission.save();
      res.status(201).json({ id: response._id, msg: "Relação Role-Permission criada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  getAll: async (req, res) => {
    try {
      const rolePermissions = await RolePermission.find();
      res.json(rolePermissions);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const rolePermission = await RolePermission.findById(id);

      if (!rolePermission) {
        res.status(404).json({ msg: "Relação Role-Permission não encontrada" });
        return;
      }

      const deletedRolePermission = await RolePermission.findByIdAndDelete(id);
      res.status(200).json({ deletedRolePermission, msg: "Relação Role-Permission excluída com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = rolePermissionController;
