const { Users: UsersModel } = require("../models/Users");
const { Users } = require("../models/Users");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const usersController = {
    create: async (req, res) => {
        try {
            const { name, email, senha, matricula, setor, equipe, roles } = req.body;
    
            // validations
            if (!name) {
                return res.status(422).json({ msg: "O nome é obrigatório!" });
            }
            if (!matricula) {
                return res.status(422).json({ msg: "A matricula é obrigatória!" });
            }
            if (!setor) {
                return res.status(422).json({ msg: "O setor é obrigatório!" });
            }
            if (!equipe) {
                return res.status(422).json({ msg: "A equipe é obrigatória!" });
            }
            if (!email) {
                return res.status(422).json({ msg: "O email é obrigatório!" });
            }
            if (!senha) {
                return res.status(422).json({ msg: "A senha é obrigatória!" });
            }

            // check if user exists
            const usersExists = await Users.findOne({ email });
            if (usersExists) {
                return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
            }

              // create password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(senha, salt);

            const users = new Users({
              name,
              matricula,
              setor: [setor],
              turno: req.body.turno,
              equipe: [equipe],
              email,
              senha: passwordHash,
              roles: [roles]
            });


            const response = await users.save();
            res.status(201).json({ id: response._id, msg: "Usuário criado com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },
    getAll: async (req, res) => {
        try {
            //const users = await UsersModel.find();
         const users = await UsersModel.find().populate(['roles', 'setor']);

            res.json(users);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            //const users = await UsersModel.findById(id);
            const users = await UsersModel.findById(id).populate(['roles', 'setor']);

            if(!users) {
                res.status(404).json({ msg: "Usuário não encontrado"});
                return;
            } 
            
            res.json(users);
 
        } catch (error) {
            console.log(error);
        }
    },
    getByEmail: async (req, res) => {
        try {
          const email = req.query.email;
      
          if (email) {
            const user = await UsersModel.findOne({ email });
      
            if (!user) {
              res.status(404).json({ msg: "Usuário não encontrado" });
            } else {
              res.json(user);
            }
          } else {
            res.status(400).json({ msg: "É necessário fornecer um email válido" });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Erro no servidor" });
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
            matricula: req.body.matricula,
            setor: req.body.setor,
            turno: req.body.turno,
            equipe: req.body.equipe,
            email: req.body.email,
            senha: req.body.senha,
            roles: req.body.roles,
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