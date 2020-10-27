import { Suite } from "../suite";
import { from, Observable } from 'rxjs';
import { Fixed18 } from '@acala-network/app-util';
import fs from 'fs';
import { mergeMap, map, tap } from 'rxjs/operators';
import airdropAccounts from '../data/airdrop-accounts.json';
import { Keyring, ApiPromise } from '@polkadot/api';
import { cryptoWaitReady } from "@polkadot/util-crypto";

function getErrorAccount (account: [string, string ,number][]): string[] {
    return Array.from(new Set(airdropAccounts.filter(item => item[2] === 95 * 10**18).map(item => item[0]))) as string[];
}

async function getACAAirdrop (api: ApiPromise, account: string): Promise<[string, string]> {
    const amount = await api.query.airDrop.airDrops(account, 'ACA');

    return [account, amount.toString()];
}

async function getKARAirdrop (api: ApiPromise, account: string): Promise<[string, string]> {
    const amount = await api.query.airDrop.airDrops(account, 'KAR');

    return [account, amount.toString()];
}

(async () => {
    const suite = new Suite();
    const localWS = "wss://node-6714447553211260928.rz.onfinality.io/ws"

    await suite.connect(localWS);

    let acaResult: string[][] = [];

    const accounts = getErrorAccount(airdropAccounts as any);

    await from(accounts).pipe(
        mergeMap((account) => {
            return from(getKARAirdrop(suite.api, account)) as Observable<[string, string]>;
        }),
        map((item) => {
            return [item[0], Fixed18.fromParts((item as any)[1]).sub(Fixed18.fromNatural('85.5')).innerToString()];
        }),
        tap(item => acaResult.push(item))
    ).toPromise();

    await suite.send(suite.sudo, suite.batchWrapper(acaResult.map((item) => {
        return suite.sudoWarpper(suite.api.tx.airDrop.updateAirdrop(item[0], 'KAR', item[1]));
    })));

    fs.writeFileSync('kar_before.json', JSON.stringify(acaResult, undefined, 2));

    await from(accounts).pipe(
        mergeMap((account) => {
            return from(getKARAirdrop(suite.api, account)) as Observable<[string, string]>;
        }),
        tap((item) => {
            const saved = acaResult.find(i => i[0] === item[0])!;

            if (saved[1] === item[1]) {
                console.info(`update ${item[0]} success`);
            } else {
                console.error(`update ${item[0]} failed, should be ${saved[1]}, current is ${item[1]}`);
            }
        }),
        tap(item => acaResult.push(item))
    ).toPromise();

})();
