import express from 'express';
import XLSX from 'xlsx';
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import Registration from '../models/Registration.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().lean();

    const data = registrations.map(registration => [
      registration.name,
      registration.email,
      registration.phone,
      registration.whatsApp,
      registration.passOutYear,
      registration.meal, 
      registration.uniqueId,
      registration.transactionID,
      registration.entered ? 'Yes' : 'No'
    ]);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Name", "Email", "Phone", "WhatsApp No", "Pass Out Year", "Meal", "Unique ID", "Transaction ID", "Entered"],
      ...data
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const excelFilePath = join(__dirname, "../static/registrations.xlsx");
    XLSX.writeFile(workbook, excelFilePath);

    res.download(excelFilePath, 'registrations.xlsx', err => {
      if (err) {
        console.error('Error downloading the file', err);
      }
      fs.unlinkSync(excelFilePath);
    });
  } catch (error) {
    console.error('Error generating the Excel file:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
