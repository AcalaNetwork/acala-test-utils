import fs from 'fs';
import path from 'path';
import { Suite } from "../suite";

(async () => {
    const suite = new Suite();

    await suite.connect();

    console.log('connect success');
    const _path = path.resolve(__dirname, '../storageData/storage-test.json');

    const content = JSON.parse(fs.readFileSync(_path, { encoding: 'utf-8' }));

    const _content = Object.keys(content).map((item) => {
        return [item, content[item]];
    });
    await suite.send(suite.sudo, suite.sudoWarpper(suite.api.tx.system.setStorage(_content as any)));

    console.log('set success');
})();
