import fs from 'fs';
import path from 'path';
import { getStorage } from "../actions";
import { Suite } from "../suite";
import { SRC } from '../utils/path';

(async () => {
    const suite = new Suite();

    await suite.connect();

    console.log('connect success');
    // const storagesPairs = await getStorage(suite, ['cdpEngine', 'loans', 'acalaOracle', 'system', 'tokens']);
    ['cdpEngine', 'loans', 'acalaOracle', 'system'].map(async (module) => {
        const storagesPairs = await getStorage(suite, [module]);
        fs.writeFileSync(path.resolve(SRC, `../storageData/storage-${module}.json`), JSON.stringify(storagesPairs, undefined, 2), { encoding: 'utf-8' });
    })


    console.log('write success');
})();