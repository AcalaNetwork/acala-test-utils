import { range } from 'lodash';

import { feedPrices, generateRandomAccount, updateBalances, setupLoans, createLoans } from "../actions";
import { Suite } from "../suite";

(async () => {
    const suite = new Suite();
    const localWS = "ws://192.168.145.133:9944"
    await suite.connect(localWS);

    console.log('connect success');

    await feedPrices(suite,  { DOT: 6, XBTC: 10000, RENBTC: 10000 });
    console.log('feed prices success');

    await setupLoans(suite);
    console.log('setup loans params success');

    const accounts = range(0, 10).map(generateRandomAccount).map(i => i[0]);

    for (let account of accounts) {
        await updateBalances(suite, account.address);
    }

    console.log('update balances success');

    for (let account of accounts) {
        await createLoans(suite, account, 'DOT', 1, 6 / 1.6);
        console.log(`update ${account.address} DOT loan`);

        await createLoans(suite, account, 'XBTC', 1, 10000 / 1.6);
        console.log(`update ${account.address} XBTC loan`);

        await createLoans(suite, account, 'RENBTC', 1, 10000 / 1.6);
        console.log(`update ${account.address} RENBTC loan`);
    }

    console.log('setup success');

    await feedPrices(suite,  { DOT: 6 * 0.1, XBTC: 10000 * 0.1, RENBTC: 10000 * 0.1 });

    console.log('trigger liquidity success');
})();