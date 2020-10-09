import { range } from 'lodash';

import { of, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { feedPrices, generateRandomAccount, updateBalances, setupLoans, createLoans } from "../actions";
import { Suite } from "../suite";

(async () => {
    const suite = new Suite();
    const localWS = "ws://35.220.244.53:9944"
    await suite.connect(localWS);

    console.log('connect success');

    await feedPrices(suite,  { DOT: 6, XBTC: 10000, RENBTC: 10000 });
    console.log('feed prices success');

    await setupLoans(suite);
    console.log('setup loans params success');

    const accounts = range(0, 3200).map(generateRandomAccount).map(i => i[0]);

    await updateBalances(suite, accounts.map(item => item.address));

    console.log('update balances success');

    await from(accounts).pipe(
        mergeMap((account, index) => {
            return from((async () => {
                const stepNum = 3;
                const step = index % stepNum + 1;

                await createLoans(suite, account, 'DOT', 1 * step, 6 / 1.6);
                console.log(`update ${account.address} DOT loan`);
            })())
        }, 100),
    ).toPromise();

    console.log('setup success');

    // await feedPrices(suite,  { DOT: 6 * 0.1, XBTC: 10000 * 0.1, RENBTC: 10000 * 0.1 });

    console.log('trigger liquidity success');
})();