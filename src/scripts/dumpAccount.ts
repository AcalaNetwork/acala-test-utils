import fs from 'fs';
import path from 'path';
import { getStorage } from "../actions";
import { Suite } from "../suite";
import { SRC } from '../utils/path';

(async () => {
    const suite = new Suite();

    await suite.connect('wss://node-6684611762228215808.jm.onfinality.io/ws');

    console.log('connect success');

    let accounts = await getStorage(suite, ['system'], ['account']);

    const result: Record<any, any> = {};

    Object.keys(accounts).map((item) => {

        const account = suite.api.createType('AccountId', '0x' + item.slice(item.length - 64, item.length)).toString();
        const data = suite.api.createType('AccountInfo', accounts[item]).toHuman();

        result[account] = data;
    });

    fs.writeFileSync(path.resolve(SRC, path.resolve(__dirname, '../storageData/account.json')), JSON.stringify(result as any, undefined, 2), { encoding: 'utf-8' });

    console.log('write success');
})();
