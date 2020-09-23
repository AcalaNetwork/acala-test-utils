import { Fixed18 ,convertToFixed18 } from "@acala-network/app-util";

import { Suite } from "../suite";

export async function querySystemBalance(suite:Suite, address:string) {
    const account = await suite.api.query.system.account(address);
    const balance = convertToFixed18((account as any)['data']['free']).toNumber()
    console.log("ACA" + " freeBalance：" + balance);
    return balance
}

export async function queryTokenBalance(suite:Suite, address:string, symbol:string) {
    const account = await suite.api.query.tokens.accounts(address, symbol);
    const balance = convertToFixed18((account as any)['free']).toNumber()
    console.log(symbol + " freeBalance：" + balance);
    return balance
}
