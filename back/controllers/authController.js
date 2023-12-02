const { Auth: AuthModel } = require("../models/Auth");
const { Auth } = require("../models/Auth");
const { Users } = require("../models/Users");



const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


  
  const authController = {
    create: async (req, res) => {
      try {
        const { email, senha } = req.body;
  
        // Validations
        if (!email) {
          return res.status(422).json({ msg: 'O email é obrigatório!' });
        }
        if (!senha) {
          return res.status(422).json({ msg: 'A senha é obrigatória!' });
        }
  
        // Check if user exists
        const user = await Users.findOne({ email: email });
  
        if (!user) {
          return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
  
        // Check if password matches
        const checkPassword = await bcrypt.compare(senha, user.senha);
  
        if (!checkPassword) {
          return res.status(422).json({ msg: 'Senha inválida' });
        }
  
        try {
          const secret = process.env.SECRET;
  
          const token = jwt.sign(
            {
              id: user._id,
              name: user.name,
              setor: user.setor,
              equipe: user.equipe,
              roles: user.roles,
              
            },
            secret
          );
  
          res.status(200).json({ 
            token
           });
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      } catch (error) {
        res.status(500).json({ msg: 'Erro interno do servidor' });
      }
    },
  };

module.exports = authController;
