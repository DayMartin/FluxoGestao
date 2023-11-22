const { Equipe: EquipeModel } = require("../models/Equipe");
const { Equipe } = require("../models/Equipe");

const equipeController = {
    create: async (req, res) => {
        try {
            const { equipeName } = req.body;
    
            // validations
            if (!equipeName) {
                return res.status(422).json({ msg: "O nome é obrigatório!" });
            }

            // check if equipe exists
            const equipeExists = await Equipe.findOne({ equipeName });
            if (equipeExists) {
                return res.status(422).json({ msg: "equipe já cadastrada" });
            }

            const equipe = new Equipe({
                equipeName: req.body.equipeName
              });

            const response = await equipe.save();
            res.status(201).json({ id: response._id, msg: "equipe criada com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },
    getAll: async (req, res) => {
        try {
            //const equipe = await EquipeModel.find();
         const equipe = await EquipeModel.find();

            res.json(equipe);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            //const equipe = await EquipeModel.findById(id);
            const equipe = await EquipeModel.findById(id);

            if(!equipe) {
                res.status(404).json({ msg: "Equipe não encontrada"});
                return;
            } 
            
            res.json(equipe);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const equipe = await EquipeModel.findById(id);

            if (!equipe) {
                res.status(404).json({ msg: "Equipe não encontrada. "});
                return;
            }

            const deletedEquipe = await EquipeModel.findByIdAndDelete(id)
            res.status(200).json({ deletedEquipe, msg: "Equipe excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const equipe = {
            equipeName: req.body.equipeName,
        };

        const updatedEquipe = await EquipeModel.findByIdAndUpdate(id, equipe);

        if (!updatedEquipe) {
            res.status(404).json({ msg: "Equipe não encontrada. "});
            return;
        }

        res.status(200).json({equipe, msg: "Equipe atualizada com sucesso"});
    },
};

module.exports = equipeController;