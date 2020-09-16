import fs from 'fs';
import path from 'path';
import { SRC } from './path';

export function ensureCacheDir() {
    const cacheFolderPath = path.resolve(SRC, './.cache');

    if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
    }

    return cacheFolderPath;
}