const { Users } = require("../models/Users");
const { Auth } = require("../models/Auth");
const { authController } = require("../controllers/authController");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const rolesMiddleware = (requiredRoles) => {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ msg: "Acesso negado!" });

        try {
            const secret = process.env.SECRET;

            const decodedToken = jwt.verify(token, secret);
            const userId = decodedToken.id; // Suponha que o ID do usuário esteja no token.

            const user = await Users.findById(userId);

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }

            // Verifique se o usuário tem funções necessárias
            if (user.roles && requiredRoles.every(roles => user.roles.includes(roles))) {
                req.user = user; // Configura o usuário a partir do token
                next();
            } else {
                res.status(403).json({ msg: "Acesso negado! Permissões insuficientes" });
            }
        } catch (err) {
            res.status(400).json({ msg: "Token inválido" });
        }
    };
};

module.exports = rolesMiddleware;
