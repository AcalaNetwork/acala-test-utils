import fs from 'fs';
import path from 'path';
import { retrieveMapKeys } from "../actions";
import { Suite } from "../suite";
import { SRC } from '../utils/path';

(async () => {
    const suite = new Suite();

    await suite.connect('wss://node-6684611762228215808.jm.onfinality.io/ws');

    console.log('connect success');
    let accounts = await retrieveMapKeys(suite, suite.api.query.system.account.keyPrefix());

    accounts = accounts.map((key) => {
        return suite.api.createType('AccountId', '0x' + key.slice(key.length - 64, key.length)).toString();
    });

    fs.writeFileSync(path.resolve(SRC, path.resolve(__dirname, '../storageData/account.json')), JSON.stringify(accounts, undefined, 2), { encoding: 'utf-8' });


    console.log('write success');
})();
