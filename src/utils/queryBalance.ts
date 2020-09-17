import { Fixed18 ,convertToFixed18 } from "@acala-network/app-util";

import { Suite } from "../suite";

export async function querySystemBalance(suite:Suite, address:string) {
    const aliceAccount = await suite.api.query.system.account(address);
    const balance = convertToFixed18(aliceAccount['data']['free']).toNumber()
    console.log(balance)
    return balance
}

export async function queryTokenBalance(suite:Suite, address:string, symbol:string) {
    const aliceAccount = await suite.api.query.tokens.accounts(address, symbol);
    const balance = convertToFixed18(aliceAccount['free']).toNumber()
    console.log(balance);
    return balance
}
