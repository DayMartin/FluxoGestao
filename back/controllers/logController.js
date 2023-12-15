const Log = require("../models/Log");

const logController = {
  create: async (req, res) => {
    try {
      const newLog = await Log.create(req.body);
      res.status(201).json({ log: newLog, msg: "Log criado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: "Erro ao criar o log" });
    }
  },

  getAll: async (req, res) => {
    try {
      const logs = await Log.find();
      res.status(200).json(logs);
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: "Erro ao buscar os logs" });
    }
  },

  getById: async (req, res) => {
    try {
      const logId = req.params.id; 
      const log = await Log.findById(logId);

      if (!log) {
        res.status(404).json({ msg: "Log não encontrado" });
        return;
      }

      res.status(200).json(log);
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: "Erro ao buscar o log" });
    }
  },

  getByEntityId: async (req, res) => {
    try {
      const entityId = req.params.entityId;
      const logs = await Log.find({ entityId }); // Usando find para buscar todos os registros
  
      if (logs.length === 0) {
        res.status(501).json({ msg: "Logs não encontrados para este entityId" });
        return;
      }
  
      // Mapeando os logs para um novo formato mais adequado para exibição no front-end
      const formattedLogs = logs.map(log => ({
        _id: log._id,
        timestamp: log.timestamp,
        userId: log.userId,
        userName: log.userName,
        userEquipe: log.userEquipe,
        userSetor: log.userSetor,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details
        // Adicione outros campos do seu modelo, se necessário
      }));
  
      res.status(200).json(formattedLogs);
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: "Erro ao buscar os logs" });
    }
  },
  
  
};

module.exports = logController;
