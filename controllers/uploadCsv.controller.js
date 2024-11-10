import { Csv} from "../models/csv.model.js";
import csv from "csvtojson";
import fs from 'fs';
import Papa from 'papaparse';
import path from "path";

const uploadCsv = async (req, res) => {
  if(!req.file) {
    // return res.status(400).json({ error: '' });
    req.flash('error', 'Please upload a CSV file')
    return res.redirect('back');
  }

  try {
    // Read CSV file content
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    // Parse CSV data using PapaParse
    const { data: parsedRows, errors } = Papa.parse(fileContent, {
      header: true,        // Uses the first row as headers
      skipEmptyLines: true // Skips empty lines
    });
      
    if (errors.length) {
      console.error('Error parsing CSV:', errors);
      return res.status(400).json({ error: 'Error parsing CSV file' });
    }

    // Prepare the document to save
    const csvData = new Csv({
      name: req.file.originalname,
      file: parsedRows // Saves parsed rows directly as JSON objects
    });

    // Save the document in MongoDB
    await csvData.save();

    req.flash('success', 'File  uploaded successfully');

    res.redirect('/api/dashboard');
  

  } catch (error) {
    console.error('Error processing CSV:', error);
    req.flash('error', 'Error processing CSV file')
    // res.status(500).json({ error: 'Error processing CSV file' });
  }
};

const displayCsvData = async(req,res)=>{

  try {
    const csvFiles = await Csv.findById(req.params.id);
    console.log(csvFiles);
    res.render('viewCsvData', { csvFiles });
} catch (error) {
    console.error('Error retrieving CSV data:', error);
    res.status(500).json({ error: 'Error retrieving CSV data' });
} 
  
}


const deleteCsv = async (req,res)=>{
 try{

  const csvFile = await Csv.findById(req.params.id);
  if (!csvFile) {
    return res.status(404).json({ error: 'CSV file not found' });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', csvFile.name); // Assuming `fileName` is stored in MongoDB

    // Delete the file from the filesystem
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting CSV file from filesystem:', err);
      }
    });

    await Csv.findByIdAndDelete(req.params.id);
    req.flash('success','File deleted')
    res.redirect('/api/dashboard');
 }
 catch (error) {
  console.error('Error deleting CSV:', error);  
  res.status(500).json({ error: 'Error deleting CSV file'});
}
}

export {uploadCsv,displayCsvData,deleteCsv};
