import { Suite } from "../suite";
import { Fixed18 } from "@acala-network/app-util";
type Balances = Record<string, number>;

export function updateBalances (suite: Suite, address: string, balances: Balances = { 'ACA': 100000, 'DOT': 100000, 'AUSD': 100000, 'XBTC': 2, 'RENBTC': 2 }) {
    return suite.send(
        suite.sudo,
        suite.batchWrapper(
            Object.keys(balances).map((key) => {
                return suite.api.tx.currencies.updateBalance(address, key, Fixed18.fromNatural((balances as any)[key]).innerToString())
            })
        ).map(suite.sudoWarpper)
    );
}