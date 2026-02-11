const multer=require("multer");
const path =require("path");
let file_size=5*1024*1024;//5MB

const storage=multer .diskStorage({
    destination:(req,file,cb)=>{
       const fs = require("fs");
       if (!fs.existsSync("uploads")) {
          fs.mkdirSync("uploads");
}
    },
    filename:(req,file,cb)=>{
      const extension = path.extname(file.originalname);
      const newName = `${Date.now()}--${Math.round(Math.random()*1e9)}${extension}`;
      cb(null,newName);
    }
});

const fileFilter = (req,file,cb)=>{
const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf"
];
    const isAllowed=allowedTypes.test(file.mimetype);
    if(isAllowed){
        cb(null,true);
    }
    else{
        cb(new Error("Only JPEG,PNG or PDF files are allowed"),false);
    }
};

exports.upload=multer({
    storage:storage,
    limits:{
        fileSize:file_size,
    },
    fileFilter:fileFilter,
    
})