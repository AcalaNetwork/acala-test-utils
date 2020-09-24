import { range } from 'lodash';

import { createRandomAccount } from '../utils';
import { cryptoWaitReady } from '@polkadot/util-crypto';

(async () => {
    await cryptoWaitReady();

    const accounts = range(0, 10000).map(() => createRandomAccount({}, 'ed25519')).map(i => i[0]);

    accounts.map((i) => {
        const fn = i.address.length === 48 ? 'log' : 'error';

        console[fn](i.address, i.address.length);
    });
})();