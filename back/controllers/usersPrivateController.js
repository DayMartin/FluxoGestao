const { Users } = require("../models/Users");
const { Auth } = require("../models/Auth");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const usersPrivateController = {
    get: [
        async (req, res, next) => {
            try {
                const id = req.params.id;

                // Check if user exists
                const user = await Users.findById(id, "-senha");

                if (!user) {
                    return res.status(404).json({ msg: "Usuário não encontrado" });
                }

                req.user = user; 
                next();
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: "Erro interno do servidor" });
            }
        },
        checkToken,
        async (req, res) => {
            try {
                const user = req.user;

                res.status(200).json({ user });
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: "Erro interno do servidor" });
            }
        }
    ]
};

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}

module.exports = usersPrivateController;
