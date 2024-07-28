import fs from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function saveEncryptionKey(encryptionKey) {
    fs.writeFileSync(join(__dirname, '../keys/encryption_key.hex'), encryptionKey);
}
