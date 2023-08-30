const { Comments: CommentsModel } = require("../models/Comments");

const commentsController = {
    create: async(req, res) => {
        try {
            const comments = {
                usuario: req.body.usuario,
                description:req.body.description,
            };
            const response = await CommentsModel.create(comments);

            res.status(201).json({ response, msg: "Comentário criado com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const comments = await CommentsModel.find();

            res.json(comments);
        } catch (error) {
            console.log(error); 
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const comments = await CommentsModel.findById(id);

            if(!comments) {
                res.status(404).json({ msg: "Comentário não encontrado"});
                return;
            } 
            
            res.json(comments);
 
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const comments = await CommentsModel.findById(id);

            if (!comments) {
                res.status(404).json({ msg: "Comentário não encontrado. "});
                return;
            }

            const deletedComments = await CommentsModel.findByIdAndDelete(id)
            res.status(200).json({ deletedComments, msg: "comentário excluído com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const comments = {
            usuario: req.body.usuario,
            description:req.body.description,
        };

        const updatedComments = await CommentsModel.findByIdAndUpdate(id, comments);

        if (!updatedComments) {
            res.status(404).json({ msg: "Comentário não encontrado. "});
            return;
        }

        res.status(200).json({comments, msg: "Comentário atualizado com sucesso"});
    },
};

module.exports = commentsController;