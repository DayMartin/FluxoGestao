const { Roles: RolesModel } = require("../models/Roles");
const { Roles } = require("../models/Roles");
const { Permissions: PermissionsModel } = require("../models/Permissions");
const { Permissions } = require("../models/Permissions");


const rolesController = {
    create: async (req, res) => {
        try {
            const { name, description, permissions } = req.body;
    
            // validations
            if (!name) {
                return res.status(422).json({ msg: "O nome é obrigatório!" });
            }
            if (!description) {
                return res.status(422).json({ msg: "A descrição é obrigatória!" });
            }
            // check if roles exists
            const rolesExists = await Roles.findOne({ name });
            if (rolesExists) {
                return res.status(422).json({ msg: "Roles já cadastrada" });
            }

            // Verifique se as permissões existem e coloque o documento de permissão no array
            const existsPermissions = await Permissions.findById(permissions);
            if (!existsPermissions) {
                return res.status(422).json({ msg: "Permissão não encontrada" });
            }

            const roles = new Roles({
              name,
              description,
              permissions: [existsPermissions],
            });

            const response = await roles.save();
            res.status(201).json({ id: response._id, msg: "Role criada com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },

    getAll: async (req, res) => {
        try {
            //const roles = await RolesModel.find();
            const roles = await RolesModel.find().populate('permissions');

            res.json(roles);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            //const roles = await RolesModel.findById(id);

            const roles = await RolesModel.findById(id).populate('permissions');

            if(!roles) {
                res.status(404).json({ msg: "Role não encontrada"});
                return;
            } 
            
            res.json(roles);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const roles = await RolesModel.findById(id);

            if (!roles) {
                res.status(404).json({ msg: "Role não encontrada. "});
                return;
            }

            const deletedRoles = await RolesModel.findByIdAndDelete(id)
            res.status(200).json({ deletedRoles: deletedRoles, msg: "Role excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const roles = {
            name: req.body.name,
            description: req.body.description,
        };

        const updatedRoles = await RolesModel.findByIdAndUpdate(id, roles);

        if (!updatedRoles) {
            res.status(404).json({ msg: "Role não encontrada. "});
            return;
        }

        res.status(200).json({roles: roles, msg: "Role atualizada com sucesso"});
    },
};

module.exports = rolesController;