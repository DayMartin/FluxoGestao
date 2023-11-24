const Ordem = require("../models/Ordem");
const { Ordem: OrdemModel } = require("../models/Ordem");

const IdCounter = require("../models/IdCounter");
const { Users: UsersModel } = require("../models/Users");

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
        
        // Mapeamento dos status permitidos
        const statusMap = {
          'Aguardando atendimento': 'Aguardando atendimento',
          'Concluido': 'Concluido',
          'Encerrado': 'Encerrado',
          'Em andamento': 'Em andamento',
          'Pendente': 'Pendente',
        };
    
        let statusQuery = {};
    
        // Se houver um status na requisição
        if (status) {
          const statusList = status.split(','); // Dividir a string de status em um array
          const validStatusList = statusList.filter(s => statusMap.hasOwnProperty(s)); // Filtrar apenas os status válidos
          statusQuery = { status: { $in: validStatusList.map(s => statusMap[s]) } }; // Mapear os status válidos e aplicar na busca
        }
        
        // Consulta base sem filtros aplicados
        let query = OrdemModel.find(statusQuery);
        query = query.populate(['solicitante', 'sala']);
    
        // Aplicar filtro para 'ordemId'
        if (filter) {
          query.where({ ordemId: parseInt(filter) });
        }
    
        // Aplicar filtro para o setor "produção" ou "mecânica"
        if (setor === 'produção' || setor === 'mecânica') {
          query.where({ setor });
        }
    
        // Consulta para contar documentos com base nos filtros aplicados
        let totalCountQuery = OrdemModel.find(statusQuery);
        totalCountQuery = totalCountQuery.populate(['solicitante', 'sala']);
    
        // Aplicar os mesmos filtros para a contagem de documentos
        if (filter) {
          totalCountQuery.where({ ordemId: parseInt(filter) });
        }
    
        if (setor === 'produção' || setor === 'mecânica') {
          totalCountQuery.where({ setor });
        }
        
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
    
        const queryResult = await query.exec();
        const formattedResponse = {
          ordem: queryResult.map((item) => ({
            _id: item._id,
            ordemId: item.ordemId,
            solicitante: item.solicitante, // Verifique se userDetails está definido aqui
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
              { _id: busca },
              { ordemId: parseInt(busca) },
            ],
          }).populate(['solicitante', 'sala'])
 // Aqui você inclui a função populate para preencher o solicitante
        } else {
          if (!isNaN(idParam)) {
            // Se idParam for um número, busca por ordemId
            ordem = await OrdemModel.findOne({ ordemId: parseInt(idParam) }).populate(['solicitante', 'sala'])

          } else {
            // Caso contrário, busca por _id
            ordem = await OrdemModel.findOne({ _id: idParam }).populate(['solicitante', 'sala'])

          }
        }
        
        if (!ordem) {
          res.status(404).json({ msg: "Ordem de serviço não encontrada" });
          return;
        } 
    
        res.json(ordem);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar ordem de serviço" });
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