const { Sala: SalaModel } = require("../models/Sala");
const { Sala } = require("../models/Sala");

const salaController = {
    create: async (req, res) => {
        try {
            const { salaNumber } = req.body;
    
            // validations
            if (!salaNumber) {
                return res.status(422).json({ msg: "O numero da sala é obrigatório!" });
            }

            // check if sala exists
            const salaExists = await Sala.findOne({ salaNumber });
            if (salaExists) {
                return res.status(422).json({ msg: "Sala já cadastrada" });
            }

            const sala = new Sala({
              salaNumber,
            });


            const response = await sala.save();
            res.status(201).json({ id: response._id, msg: "Sala criada com sucesso" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        },
        getAll: async (req, res) => {
            try {
                const sala = await SalaModel.find()
                    // .populate({
                    //     path: 'setor',
                    //     populate: {
                    //         path: 'equipe'
                    //     }
                    // });
        
                res.json(sala);
            } catch (error) {
                console.log(error); 
            }
        },
        

    get: async (req, res) => {
        try {
            const _id = req.params.id;
            //const sala = await SalaModel.findById(id);
            const sala = await SalaModel.findById(_id)
            // .populate({
            //     path: 'setor',
            //     populate: {
            //         path: 'equipe'
            //     }
            // });
            if(!sala) {
                res.status(404).json({ msg: "Sala não encontrada"});
                return;
            } 
            
            res.json(sala);
 
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const sala = await SalaModel.findById(id);

            if (!sala) {
                res.status(404).json({ msg: "Sala não encontrada. "});
                return;
            }

            const deletedSala = await SalaModel.findByIdAndDelete(id)
            res.status(200).json({ deletedSala, msg: "Sala excluída com sucesso"});

        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const id = req.params.id;

        const sala = {
            salaNumber: req.body.salaNumber,
            // setor: req.body.setor,
        };

        const updatedSala = await SalaModel.findByIdAndUpdate(id, sala);

        if (!updatedSala) {
            res.status(404).json({ msg: "Sala não encontrada. "});
            return;
        }

        res.status(200).json({sala, msg: "Sala atualizada com sucesso"});
    },
};

module.exports = salaController;