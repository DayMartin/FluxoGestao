const { Setor: SetorModel } = require("../models/Setor");
const { Setor } = require("../models/Setor");

const setorController = {
    create: async (req, res) => {
        try {
            const { name, equipe } = req.body;
    
            // validations
            if (!name) {
                return res.status(422).json({ msg: "O nome é obrigatório!" });
            }

            // check if setor exists
            const setorExists = await Setor.findOne({ name });
            if (setorExists) {
                return res.status(422).json({ msg: "setor já cadastrada" });
            }

            const setor = new Setor({
              name,
              equipe: [equipe]
            });


            const response = await setor.save();
            res.status(201).json({ id: response._id, msg: "setor criado com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },
    getAll: async (req, res) => {
        try {
            //const setor = await SetorModel.find();
         const setor = await SetorModel.find().populate('equipe');

            res.json(setor);
        } catch (error) {
            console.log(error); 
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            //const setor = await SetorModel.findById(id);
            const setor = await SetorModel.findById(id).populate('equipe');

            if(!setor) {
                res.status(404).json({ msg: "Setor não encontrada"});
                return;
            } 
            
            res.json(setor);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const setor = await SetorModel.findById(id);

            if (!setor) {
                res.status(404).json({ msg: "Setor não encontrada. "});
                return;
            }

            const deletedSetor = await SetorModel.findByIdAndDelete(id)
            res.status(200).json({ deletedSetor, msg: "Setor excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const setor = {
            name: req.body.name,
            equipe: req.body.equipe
        };

        const updatedSetor = await SetorModel.findByIdAndUpdate(id, setor);

        if (!updatedSetor) {
            res.status(404).json({ msg: "Setor não encontrada. "});
            return;
        }

        res.status(200).json({setor, msg: "Setor atualizada com sucesso"});
    },
};

module.exports = setorController;