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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
    
        const filter = req.query.filter || '';
    
        // Ajuste para buscar o ordemId usando o filtro
        const query = OrdemModel.find();
    
        if (filter) {
          // Use o filtro para buscar o ordemId
          query.where({ ordemId: parseInt(filter) });
        }
    
        const ordem = await query
          .skip(skip)
          .limit(limit);
    
        const totalCount = await OrdemModel.countDocuments();
    
        const results = {
          totalOrdem: totalCount,
          pageCount: Math.ceil(totalCount / limit),
        };
    
        if (page < results.pageCount) {
          results.next = {
            page: page + 1,
          };
        }
    
        if (page > 1) {
          results.prev = {
            page: page - 1,
          };
        }
    
        res.setHeader('x-total-count', totalCount);
    
        const formattedResponse = {
          ordem: ordem.map((item) => ({
            _id: item._id,
            ordemId: item.ordemId,
            solicitante: item.solicitante,
            setor: item.setor,
            sala: item.sala,
            forno: item.forno,
            cabeceira: item.cabeceira,
            status: item.status,
            services: item.services,
            comments: item.comments,
            urgencia: item.urgencia,
          })),
          pagination: results,
        };
    
        res.json(formattedResponse);
    
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar ordens de serviço" });
      }
    },
    
      get: async (req, res) => {
        try {
            const idParam = req.params.id;
            const busca = req.query.busca; // Adicione a busca por ID
            
            let ordem;
    
            if (isNaN(idParam) && !busca) {
                // Se o parâmetro não for um número e não houver busca, retorna um erro
                res.status(400).json({ msg: "Parâmetro de busca inválido" });
                return;
            } 
    
            if (isNaN(idParam) && busca) {
                // Se o parâmetro não for um número, mas houver busca, busca por outros campos
                ordem = await OrdemModel.findOne({ 
                    $or: [
                        { solicitante: { $regex: new RegExp(busca, "i") } }, // Busca por solicitante (case-insensitive)
                        { setor: { $regex: new RegExp(busca, "i") } }, // Busca por setor (case-insensitive)
                        // Adicione outros campos que deseja buscar aqui
                    ]
                });
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