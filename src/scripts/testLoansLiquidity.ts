import { range } from 'lodash';

import { feedPrices, generateRandomAccount, updateBalances, setupLoans, createLoans } from "../actions";
import { Suite } from "../suite";

(async () => {
    const suite = new Suite();

    await suite.connect();

    console.log('connect success');

     await feedPrices(suite,  { DOT: 6, XBTC: 10000, RENBTC: 10000 });
    console.log('feed prices success');

    await setupLoans(suite);
    console.log('setup loans params success');

    const accounts = range(0, 100).map(generateRandomAccount).map(i => i[0]);

    await updateBalances(suite, accounts.map(item => item.address));

    console.log('update balances success');

    await Promise.all(accounts.map(async account => {
        await createLoans(suite, account, 'DOT', 1, 6 / 1.6);
        console.log(`update ${account.address} DOT loan`);

        await createLoans(suite, account, 'XBTC', 1, 10000 / 1.6);
        console.log(`update ${account.address} XBTC loan`);

        await createLoans(suite, account, 'RENBTC', 1, 10000 / 1.6);
        console.log(`update ${account.address} RENBTC loan`);
    }));

    console.log('setup success');

    await feedPrices(suite,  { DOT: 6 * 0.1, XBTC: 10000 * 0.1, RENBTC: 10000 * 0.1 });

    console.log('trigger liquidity success');
})();
