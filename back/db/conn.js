const mongoose = require("mongoose");

async function main() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(
            "mongodb+srv://negociosdinah:IKxKACgqYePR9T3m@cluster0.qalhw9d.mongodb.net/?retryWrites=true&w=majority"
        );
        console.log("Conectado ao banco!");
    } catch (error) {
        console.log(`Erro: ${error}`);
    }
}

module.exports = main;