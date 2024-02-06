const mongoose = require("mongoose");
require('dotenv').config();

const  MongoUrl = "mongodb+srv://guvib46:guviB46@cluster0.ebhseuj.mongodb.net/?retryWrites=true&w=majority"

const  dbConnection = () => {
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }  
    try {
        mongoose.connect(MongoUrl,params)
        console.log("Database connected successful")
    } catch (error) {
        console.log("Database connected failed")
    }
}

module.exports = {dbConnection}  