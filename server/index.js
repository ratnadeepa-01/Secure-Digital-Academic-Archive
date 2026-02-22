const express = require("express");
const multer = require("multer");
const dotenv=require("dotenv");
const connectDB=require("./config/DB");
const { upload } = require("./upload");
const path =require("path");
const authRoutes=require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/assignments", assignmentRoutes);

//to serve the user static image when they give url in browser http.. followed by image url
 const folderLocation=path.join(__dirname,"uploads");
app.use("/uploads",express.static(folderLocation));


//const upload=multer({dest:"uploads/"});
app.get("/",(req,res)=>{
    res.send("API is workin...");
});
app.post("/upload/file",upload.single("image"),(req,res)=>{
    return res.json({message:"file uploaded",data:req.file})
});
app.post("/upload/files",upload.array("images",10),(req,res)=>{
    return res.json({message:"files uploaded",data:req.files})
});
app.use((err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        switch(err.code){
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({message:"Error:File too large !Maximum size is 1MB"});
            default:
                return res.status(400).json({message:err.message});
            }
    }
    else{
        return res.status(500).json({message:err.message});
    }
});
app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000");
});