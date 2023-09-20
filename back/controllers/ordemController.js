const OrdemModel = require("../models/Ordem");
const IdCounter = require("../models/IdCounter");

const ordemController = {
    create: async (req, res) => {
        try {

            const idCounter = await IdCounter.findOneAndUpdate(
                { model: "Ordem", field: "ordemId" },
                { $inc: { count: 1 } },
                { upsert: true, new: true }
              );

            const ordem = {
                ordemId: idCounter.count,
                solicitante: req.body.solicitante,
                setor: req.body.setor,
                sala: req.body.sala,
                forno: req.body.forno,
                cabeceira: req.body.cabeceira,
                status: req.body.status,
                services: req.body.services,
                comments: req.body.comments,
                urgencia: req.body.urgencia,
            }

            const response = await OrdemModel.create(ordem)

            res.status(201).json({response, msg: "Ordem de serviço criada com sucesso"});
            
        }   catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const ordens = await OrdemModel.find();
            const totalCount = await OrdemModel.countDocuments();
    
            res.json({ data: ordens, totalCount });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Erro ao buscar ordens de serviço" });
        }
    },
    
    get: async (req, res) => {
        try {
            const idParam = req.params.id;
            let ordem;
    
            if (isNaN(idParam)) {
                // Se o parâmetro não for um número, busca pelo ID gerado pelo MongoDB
                ordem = await OrdemModel.findById(idParam);
            } else {
                // Se o parâmetro for um número, busca pelo ID personalizado
                ordem = await OrdemModel.findOne({ ordemId: parseInt(idParam) });
            }
    
            if (!ordem) {
                res.status(404).json({ msg: "Ordem de serviço não encontrada" });
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
            solicitante: req.body.solicitante,
            setor: req.body.setor,
            sala: req.body.sala,
            forno: req.body.forno,
            cabeceira: req.body.cabeceira,
            status: req.body.status,
            services: req.body.services,
            comments: req.body.comments,
            urgencia: req.body.urgencia,
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