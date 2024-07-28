import express from 'express';
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';
import xlsx from 'xlsx';
import {sendMailToAlumni} from '../utils/emailAlumni.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../static/alumni.html"));
});

router.post("/submit-alumni", async (req, res) => {
  try {
    const FName = req.body["FName"];
    const LName = req.body["LName"];
    const MName = req.body["MName"];
    const passOutYear = req.body["passOutYear"];
    const phone = req.body["phone"];
    const Email = req.body["Email"];
    const dob = req.body["dob"];
    const profession = req.body["profession"];
    const company = req.body["company"];
    const qualification = req.body["qualification"];
    const institution = req.body["institution"];
    const memory = req.body["memory"];
    const transactionID = req.body["transactionID"];
    const Name = FName + " " + LName;

    // Generate a unique registration ID
    var registrationID = uuidv4();
    const lis = registrationID.split('-')
    registrationID = 'BSS/'+ lis[lis.length-1]

    // Path to the Excel file
    const filePath = join(__dirname, "../static/updated_field_names.xlsx");

    // Read the existing Excel file
    let workbook;
    try {
      workbook = xlsx.readFile(filePath);
    } catch (err) {
      workbook = xlsx.utils.book_new();
    }

    // Select the first sheet or create a new one if it doesn't exist
    let sheetName = workbook.SheetNames[0] || 'Sheet1';
    let worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      worksheet = xlsx.utils.aoa_to_sheet([
        ['Registration ID', 'First Name', 'Last Name', 'Maiden Name', 'Pass Out Year', 'Phone', 'Email', 'Date of Birth', 'Profession', 'Company Name', 'Highest Qualification', 'Name of Institution', 'Fondest Memory in School', 'Transaction ID']
      ]);
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Convert worksheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Add the new entry
    data.push([registrationID, FName, LName, MName, passOutYear, phone, Email, dob, profession, company, qualification, institution, memory, transactionID]);

    // Convert JSON back to worksheet
    const updatedWorksheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets[sheetName] = updatedWorksheet;

    // Write the updated Excel file
    xlsx.writeFile(workbook, filePath);

    await sendMailToAlumni(Email, Name, registrationID);

    res.sendFile(join(__dirname, "../static/thenga2.html"));
  } catch (error) {
    console.error('Error processing the form submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
