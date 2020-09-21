import { Suite } from "../suite";
import { Fixed18 } from "@acala-network/app-util";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { add } from "lodash";

type Balances = Record<string, number>;

export function updateBalances (suite: Suite, addresses: string | string[], balances: Balances = { 'ACA': 100000, 'DOT': 100000, 'AUSD': 100000, 'XBTC': 2, 'RENBTC': 2 }) {
    const txs: SubmittableExtrinsic<'promise'>[] = [];

    if (Array.isArray(addresses)) {
        Object.keys(balances).forEach((key) => {
            addresses.forEach((address) => {
                txs.push(suite.api.tx.currencies.updateBalance(address, key, Fixed18.fromNatural((balances as any)[key]).innerToString()))
            });
        });

    } else {
        Object.keys(balances).forEach((key) => {
            txs.push(suite.api.tx.currencies.updateBalance(addresses, key, Fixed18.fromNatural((balances as any)[key]).innerToString()))
        });
    }

    return suite.send(
        suite.sudo,
        suite.batchWrapper(txs).map(suite.sudoWarpper)
    );
}