const { UsersRoles: UsersRolesModel } = require("../models/Roles");
const { UsersRoles } = require("../models/Roles");

const usersrolesController = {
    create: async (req, res) => {
        try {
            const { name, description } = req.body;
    
            // validations
            if (!name) {
                return res.status(422).json({ msg: " nome é obrigatório!" });
            }
            if (!description) {
                return res.status(422).json({ msg: " description é obrigatória!" });
            }

            // check if user exists
            const usersrolesExists = await UsersRoles.findOne({ name });
            if (usersrolesExists) {
                return res.status(422).json({ msg: "Role já cadastrada" });
            }

            const usersroles = new UsersRoles({
                name: req.body.name,
                description: req.body.description,
            });


            const response = await usersroles.save();
            res.status(201).json({ id: response._id, msg: "Role cadastrada com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },
    getAll: async (req, res) => {
        try {
            //const usersroles = await UsersModel.find();
         const usersroles = await UsersRolesModel.find();

            res.json(usersroles);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            //const users = await UsersModel.findById(id);
            const usersroles = await UsersRolesModel.findById(id);

            if(!usersroles) {
                res.status(404).json({ msg: "Role não encontrado"});
                return;
            } 
            
            res.json(usersroles);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const usersroles = await UsersRolesModel.findById(id);

            if (!usersroles) {
                res.status(404).json({ msg: "Role não encontrado. "});
                return;
            }

            const deletedUsersRoles = await UsersRolesModel.findByIdAndDelete(id)
            res.status(200).json({ deletedUsersRoles, msg: "Role excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const users = {
            name: req.body.name,
            description: req.body.description,
        };

        const updatedUsersRoles = await UsersRolesModel.findByIdAndUpdate(id, users);

        if (!updatedUsersRoles) {
            res.status(404).json({ msg: "Usuário não encontrado. "});
            return;
        }

        res.status(200).json({msg: "Role atualizado com sucesso"});
    },
};

module.exports = usersrolesController;