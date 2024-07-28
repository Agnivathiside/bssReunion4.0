import express from 'express';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../static/index.html"));
});

export default router;
