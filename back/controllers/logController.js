const Log = require("../models/Log");

const logController = {
  create: async (req, res) => {
    try {
      const newLog = await Log.create(req.body);
      res.status(201).json({ log: newLog, msg: "Log criado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar o log" });
    }
  },

  getAll: async (req, res) => {
    try {
      const logs = await Log.find();
      res.status(200).json(logs);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao buscar os logs" });
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
      res.status(500).json({ error: "Erro ao buscar o log" });
    }
  },

  getByEntityId: async (req, res) => {
    try {
      const entityId = req.params.entityId;
      const logs = await Log.find({ entityId }); // Usando find para buscar todos os registros
  
      if (logs.length === 0) {
        res.status(404).json({ msg: "Logs não encontrados para este entityId" });
        return;
      }
  
      res.status(200).json(logs);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao buscar os logs" });
    }
  },
  
};

module.exports = logController;
