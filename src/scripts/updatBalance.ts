import { Fixed18 , convertToFixed18} from "@acala-network/app-util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Suite } from "../suite";


export async function updateBalance(suite:Suite, account:KeyringPair, symbol:string, amount:number) {
    const tx = suite.api.tx.currencies.updateBalance(
        account.address,
        symbol,
        convertToFixed18(amount).innerToString()
    )

    return suite.send(
        suite.sudo,
        tx
    )
}