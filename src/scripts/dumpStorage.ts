import fs from 'fs';
import path from 'path';
import { getStorage } from "../actions";
import { Suite } from "../suite";
import { SRC } from '../utils/path';

(async () => {
    const suite = new Suite();

    await suite.connect();

    console.log('connect success');
    const storagesPairs = await getStorage(suite);

    fs.writeFileSync(path.resolve(SRC, '../storage.json'), JSON.stringify(storagesPairs, undefined, 2), { encoding: 'utf-8' });

    console.log('write success');
})();