const mongoose = require("mongoose");

require("dotenv").config();

const db_pass = process.env.DB_PASS;
const db_user = process.env.DB_USER; 
const ip_mongo = process.env.IP_MONGO;

async function main() {
    
    try {
        mongoose.set("strictQuery", true);
        
        await mongoose.connect(
            `mongodb+srv://${db_user}:${db_pass}@${ip_mongo}/?retryWrites=true&w=majority`
        );
        console.log("Conectado ao banco!");
    } catch (error) {
        console.log(`Erro: ${error}`);
    }
}

module.exports = main;