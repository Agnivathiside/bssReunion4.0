import qrcode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

export const generateQrCodeAndCompositeImage = async (qrCodeData, email, templateImagePath) => {
  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData);

  const templateImage = await loadImage(templateImagePath);
  const canvas = createCanvas(templateImage.width, templateImage.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(templateImage, 0, 0);

  const qrCode = await loadImage(qrCodeDataURL);
  const qrCodeSize = 1000; 
  const qrX = (canvas.width - qrCodeSize) / 2;
  const qrY = (canvas.height / 2 - qrCodeSize) / 2 - 100; 
  ctx.drawImage(qrCode, qrX, qrY, qrCodeSize, qrCodeSize);

  return canvas.toBuffer('image/png');
};
