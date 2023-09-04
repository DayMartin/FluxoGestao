const { Users: UsersModel } = require("../models/Users");

const usersController = {
    create: async(req, res) => {
        try {
            const users = {
                name: req.body.name,
                matricula:req.body.matricula,
                setor:req.body.setor,
                supervisor:req.body.supervisor,
                turno:req.body.turno
            };
            const response = await UsersModel.create(users);

            res.status(201).json({ response, msg: "Usuário criado com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const users = await UsersModel.find();

            res.json(users);
        } catch (error) {
            console.log(error); 
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const users = await UsersModel.findById(id);

            if(!users) {
                res.status(404).json({ msg: "Usuário não encontrado"});
                return;
            } 
            
            res.json(users);
 
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const users = await UsersModel.findById(id);

            if (!users) {
                res.status(404).json({ msg: "Usuário não encontrado. "});
                return;
            }

            const deletedUsers = await UsersModel.findByIdAndDelete(id)
            res.status(200).json({ deletedUsers, msg: "Usuário excluído com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const users = {
            name: req.body.name,
            matricula:req.body.matricula,
            setor:req.body.setor,
            supervisor:req.body.supervisor,
            turno:req.body.turno,
        };

        const updatedUsers = await UsersModel.findByIdAndUpdate(id, users);

        if (!updatedUsers) {
            res.status(404).json({ msg: "Usuário não encontrado. "});
            return;
        }

        res.status(200).json({users, msg: "Usuário atualizado com sucesso"});
    },
};

module.exports = usersController;