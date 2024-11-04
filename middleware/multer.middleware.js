import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check the file extension and MIME type
        const fileExt = path.extname(file.originalname).toLowerCase();
        const isCsv = file.mimetype === 'text/csv' || fileExt === '.csv';
        
        if (isCsv) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only CSV files are allowed'), false); // Reject the file
        }
    }
});


export default upload