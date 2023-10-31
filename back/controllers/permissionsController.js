const { Permissions: PermissionsModel } = require("../models/Permissions");
const { Permissions } = require("../models/Permissions");

const permissionsController = {
    create: async (req, res) => {
        try {
            const { name, description } = req.body;
    
            // validations
            if (!name) {
                return res.status(422).json({ msg: "O nome é obrigatório!" });
            }
            if (!description) {
                return res.status(422).json({ msg: "A descrição é obrigatória!" });
            }
            // check if permissions exists
            const permissionsExists = await Permissions.findOne({ name });
            if (permissionsExists) {
                return res.status(422).json({ msg: "Permissão já cadastrada" });
            }

            const permissions = new Permissions({
              name,
              description,
            });

            const response = await permissions.save();
            res.status(201).json({ id: response._id, msg: "Permissão criada com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },

    getAll: async (req, res) => {
        try {
            const permissions = await PermissionsModel.find();

            res.json(permissions);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            const permissions = await PermissionsModel.findById(id);

            if(!permissions) {
                res.status(404).json({ msg: "Permissão não encontrada"});
                return;
            } 
            
            res.json(permissions);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const permissions = await PermissionsModel.findById(id);

            if (!permissions) {
                res.status(404).json({ msg: "Permissão não encontrada. "});
                return;
            }

            const deletedPermissions = await PermissionsModel.findByIdAndDelete(id)
            res.status(200).json({ deletedPermissions: deletedPermissions, msg: "Permissão excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const permissions = {
            name: req.body.name,
            description: req.body.description,
        };

        const updatedPermissions = await PermissionsModel.findByIdAndUpdate(id, permissions);

        if (!updatedPermissions) {
            res.status(404).json({ msg: "Permissão não encontrada. "});
            return;
        }

        res.status(200).json({permissions: permissions, msg: "Permissão atualizada com sucesso"});
    },
};

module.exports = permissionsController;