const mongoose =require("mongoose");
const connectDB=async()=>{
    try{
        console.log("Mongo URI:", process.env.MONGO_URI);

      await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);

       console.log("MongoDB connected successfully");
    }
    catch(err){
        console.error("MongoDB Connectoin failed:",err.message);
        process.exit(1);
    }
};
module.exports=connectDB;