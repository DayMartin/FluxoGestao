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
        const status = req.query.status || '';
        
        
        // Consulta base sem filtros aplicados
        let query = OrdemModel.find();

        // Aplicar filtro para 'ordemId'
        if (filter) {
          query.where({ ordemId: parseInt(filter) });
        }

        // Aplicar filtro para o setor "produção"
        if (setor === 'produção') {
          query.where({ setor: 'produção' });
        } else if (setor === 'mecânica') { // Aplicar filtro para o setor "mecânica"
          query.where({ setor: 'mecânica' });
        }

        // Aplicar filtro para o status "Aguardando atendimento"
        if (status === 'Aguardando atendimento') {
          query.where({ status: 'Aguardando atendimento' });
        } else if (status === 'Concluido') { // Aplicar filtro para o status "Concluido"
          query.where({ status: 'Concluido' });
        } else if (status === 'Em andamento'){
          query.where({ status: 'Em andamento' });
        }
        else if (status === 'Encerrado'){
          query.where({ status: 'Encerrado' });
        }

        // Consulta para contar documentos com base nos filtros aplicados
        const totalCountQuery = OrdemModel.find();

        // Aplicar os mesmos filtros para a contagem de documentos
        if (filter) {
          totalCountQuery.where({ ordemId: parseInt(filter) });
        }

        if (setor === 'produção') {
          totalCountQuery.where({ setor: 'produção' });
        } else if (setor === 'mecânica') {
          totalCountQuery.where({ setor: 'mecânica' });
        }

        if (status === 'Aguardando atendimento') {
          totalCountQuery.where({ status: 'Aguardando atendimento' });
        } else if (status === 'Concluido') {
          totalCountQuery.where({ status: 'Concluido' });
        } else if (status === 'Encerrado'){
          totalCountQuery.where({status:'Encerrado' })
        } else if (status === 'Em andamento'){
          totalCountQuery.where({status:'Em andamento' })
        }
        

        const ordem = await query.skip(skip).limit(limit);

      // Contar documentos com base nos filtros aplicados
        const totalCount = await totalCountQuery.countDocuments();
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