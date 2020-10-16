import { range } from 'lodash';

import { of, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { feedPrices, generateRandomAccount, updateBalances, setupLoans, createLoans } from "../actions";
import { Suite } from "../suite";

(async () => {
    const suite = new Suite();
    const localWS = "ws://127.0.0.1:9944"
    await suite.connect(localWS);

    console.log('connect success');

    await feedPrices(suite,  { DOT: 6, XBTC: 10000, RENBTC: 10000 });
    console.log('feed prices success');

    await setupLoans(suite);
    console.log('setup loans params success');

    const accounts = range(0, 10000).map(generateRandomAccount).map(i => i[0]);

    await updateBalances(suite, accounts.map(item => item.address));

    console.log('update balances success');

    await from(accounts).pipe(
        mergeMap((account, index) => {
            return from((async () => {
                const stepNum = 100;
                const step = index % stepNum + 1;

                await createLoans(suite, account, 'XBTC', 1 * step, 10000 / 2);
                console.log(`update ${account.address} XBTC loan`);
            })())
        }, 100),
    ).toPromise();

    console.log('setup success');

    // await feedPrices(suite,  { DOT: 6 * 0.1, XBTC: 10000 * 0.1, RENBTC: 10000 * 0.1 });

    console.log('trigger liquidity success');
})();