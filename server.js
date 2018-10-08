const express = require("express");
const multer = require("multer");
const path = require("path");

const PORT = 5000;

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb)
{
    const filetypes = /jpeg|jpg|png/;

    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype)
    {
        return cb(null, true);
    }
    else
    {
        cb("Error: only images!!"); 
    }
}

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 10000000
    },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

const app = express();

//public folder
app.use(express.static('./public'));

app.get("/",(req,res)=>{ 
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/upload", (req,res)=>{

    upload(req, res, (err) => {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(req.file == undefined)
            {
                res.send("No file selected");
            }
            else
            {
                res.send("upload done");
            }
        }
    })
});

app.listen(PORT,()=>{
    console.log(`app listining on port ${PORT}`);
});
