const PartyModel = require("../models/Party");

const partyController = {
    create: async (req, res) => {
        try {

            const party = {
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

            const response = await PartyModel.create(party)

            res.status(201).json({response, msg: "Ordem de serviço criada com sucesso"});
            
        }   catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const parties = await PartyModel.find();

            res.json(parties);
        } catch (error) {
            console.log(error); 
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const parties = await PartyModel.findById(id);

            if(!parties) {
                res.status(404).json({ msg: "Ordem de serviço não encontrada"});
                return;
            } 
            
            res.json(parties);
 
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const parties = await PartyModel.findById(id);

            if (!parties) {
                res.status(404).json({ msg: "Serviço não encontrado. "});
                return;
            }

            const deletedParty = await PartyModel.findByIdAndDelete(id)
            res.status(200).json({ deletedParty, msg: "Ordem de serviço excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const parties = {

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

        const updatedParty = await PartyModel.findByIdAndUpdate(id, parties);

        if (!updatedParty) {
            res.status(404).json({ msg: "Ordem de serviço não encontrada. "});
            return;
        }

        res.status(200).json({parties, msg: "Ordem de serviço atualizada com sucesso"});
    },

};

module.exports = partyController;