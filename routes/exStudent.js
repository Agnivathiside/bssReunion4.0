import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import xlsx from 'xlsx';
import { createCanvas, loadImage } from 'canvas';
import qrcode from 'qrcode';
import crypto from 'crypto';
import dotenv from 'dotenv';

import Registration from '../models/Registration.js';
import { sendEmailWithAttachment } from '../utils/email.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const writeFile = promisify(fs.writeFile);
const router = express.Router();

// Retrieve the encryption key from environment variables
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../static/form.html'));
});

router.post('/submit', async (req, res) => {
  try {
    console.log(req.body);

    const name = req.body['Name'];
    const email = req.body['Email'];
    const no = req.body['phone'];
    const whatsApp = req.body['whatsApp'];
    const passOutYear = req.body['passoutyear'];
    const transactionID = req.body['transactionid'];
    const registrationID = req.body['registrationid'];
    const meal = req.body['meal'];
    const uniqueId = uuidv4();

    const newRegistration = new Registration({
      name,
      email,
      phone: no,
      whatsApp,
      passOutYear,
      meal,
      uniqueId,
      transactionID
    });

    await newRegistration.save();

    const qrCodeData = `ID: ${uniqueId}, Name: ${name}, Email: ${email}, Phone: ${no}, WhatsApp: ${whatsApp}, Year of Pass Out: ${passOutYear}, Meal: ${meal}, Transaction ID: ${transactionID}`;

    const encryptedData = encrypt(qrCodeData);

    const qrCodeDataURL = await qrcode.toDataURL(encryptedData, {
      color: {
        dark: '#4A2924',
        light: '#FFFFFF'
      }
    });

    const templateImagePath = join(__dirname, '../static/pass.png');
    const templateImage = await loadImage(templateImagePath);
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);

    const qrCode = await loadImage(qrCodeDataURL);
    const qrCodeSize = 600;
    const qrX = (canvas.width - qrCodeSize) / 2;
    const qrY = canvas.height - qrCodeSize - 300;
    ctx.drawImage(qrCode, qrX, qrY, qrCodeSize, qrCodeSize);

    const outputImagePath = join(__dirname, `../static/composite_${email}.png`);
    const buffer = canvas.toBuffer('image/png');
    await writeFile(outputImagePath, buffer);

    await sendEmailWithAttachment(email, name, outputImagePath);

    res.sendFile(join(__dirname, '../static/thenga.html'));
  } catch (error) {
    console.error('Error processing the form submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
