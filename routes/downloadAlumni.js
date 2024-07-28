import express from 'express';
import XLSX from 'xlsx';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();


router.get('/', (req, res) => {
    const filePath = join(__dirname, "../static/updated_field_names.xlsx");
    res.download(filePath, "updated_field_names.xlsx", (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).send('Error downloading the file');
        }
    });
})

export default router;