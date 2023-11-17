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
        const setor = req.query.setor || '';
            const query = OrdemModel.find();
        
        if (filter) {
          query.where({ ordemId: parseInt(filter) });
        }

        // Adicione a condição para filtrar pelo setor "produção"
        if (setor === 'produção') {
          query.where({ setor: 'produção' });
        }

        if (setor === 'mecânica') {
          query.where({ setor: 'mecânica' });
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
        const busca = req.query.busca; 
        
        let ordem;
    
        if (busca) {
          ordem = await OrdemModel.findOne({
            $or: [
              { solicitante: { $regex: new RegExp(busca, "i") } }, 
              { setor: { $regex: new RegExp(busca, "i") } },
              { _id: busca }, // Busca por _id
              { ordemId: parseInt(busca) }, // Converta busca para número inteiro e busque por ordemId
            ]
          });
        } else {
          if (!isNaN(idParam)) {
            // Se idParam for um número, busca por ordemId
            ordem = await OrdemModel.findOne({ ordemId: parseInt(idParam) });
          } else {
            // Caso contrário, busca por _id
            ordem = await OrdemModel.findOne({ _id: idParam });
          }
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