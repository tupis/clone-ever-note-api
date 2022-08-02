const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(
    process.env.MONGO_URL, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
).then(() => {
    console.log("Conectado ao banco de dados")
}).catch(() => {
    console.log("Não foi possível conectar ao banco de dados")
})