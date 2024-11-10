import express from "express"
import upload from "../middleware/multer.middleware.js";
import {uploadCsv,  displayCsvData, deleteCsv } from "../controllers/uploadCsv.controller.js";
import { Csv} from "../models/csv.model.js";

const studentRouter = express.Router()

studentRouter.get('/dashboard',async (req, res) =>{
    try {
        
        const files = await Csv.find({});

        res.render('dashboard',{files,flash: { 
            success: req.flash('success'), 
            error: req.flash('error') 
        }})
    } catch (error) {
        console.log(error);
    }
    
})

studentRouter.route('/upload').post(upload.single('file'),uploadCsv);

studentRouter.route('/file-data/:id').get(displayCsvData);

studentRouter.route('/file-data/delete/:id').delete(deleteCsv);




export default studentRouter;