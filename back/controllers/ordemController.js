const OrdemModel = require("../models/Ordem");

const ordemController = {
    create: async (req, res) => {
        try {

            const ordem = {
                title: req.body.title,
                solicitante: req.body.solicitante,
                setor: req.body.setor,
                sala: req.body.sala,
                forno: req.body.forno,
                cabeceira: req.body.cabeceira,
                status: req.body.status,
                estadoatual: req.body.estado_atual,
                services: req.body.services,
                comments: req.body.comments,
            }

            const response = await OrdemModel.create(ordem)

            res.status(201).json({response, msg: "Ordem de serviço criada com sucesso"});
            
        }   catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const ordem = await OrdemModel.find();

            res.json(ordem);
        } catch (error) {
            console.log(error); 
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const ordem = await OrdemModel.findById(id);

            if(!ordem) {
                res.status(404).json({ msg: "Ordem de serviço não encontrada"});
                return;
            } 
            
            res.json(ordem);
 
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const ordem = await OrdemModel.findById(id);

            if (!ordem) {
                res.status(404).json({ msg: "Ordem de Serviço não encontrado. "});
                return;
            }

            const deletedOrdem = await OrdemModel.findByIdAndDelete(id)
            res.status(200).json({ deletedOrdem, msg: "Ordem de serviço excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const ordem = {

            title: req.body.title,
            solicitante: req.body.solicitante,
            setor: req.body.setor,
            sala: req.body.sala,
            forno: req.body.forno,
            cabeceira: req.body.cabeceira,
            status: req.body.status,
            estadoatual: req.body.estado_atual,
            services: req.body.services,
        };

        const updatedOrdem = await OrdemModel.findByIdAndUpdate(id, ordem);

        if (!updatedOrdem) {
            res.status(404).json({ msg: "Ordem de serviço não encontrada. "});
            return;
        }

        res.status(200).json({ordem, msg: "Ordem de serviço atualizada com sucesso"});
    },

};

module.exports = ordemController;