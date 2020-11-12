import {Suite} from "../suite";

//  查询 ACA 余额
export async function querySystemBalance(suite: Suite, address: string) {
    const account = await suite.api.query.system.account(address);
    return ((account as any)['data']['free']).toString()
}

// 查询 tokens余额
export async function queryTokenBalance(suite: Suite, address: string, symbol: string) {
    const account = await suite.api.query.tokens.accounts(address, {Token: symbol});
    return ((account as any)['free']).toString()
}

// 查询 dex 份额
export async function queryDexShares(suite: Suite, address: string, tokenSymbol_a: string, tokenSymbol_b: string) {
    const shares = await suite.api.query.tokens.accounts(address, {DEXShare: [tokenSymbol_a, tokenSymbol_b]})
    console.log(JSON.stringify(shares))
}
