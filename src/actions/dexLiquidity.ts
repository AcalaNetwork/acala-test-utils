import {KeyringPair} from "@polkadot/keyring/types";
import {Suite} from "../suite";
import {FixedPointNumber, getPresetToken, TokenPair} from "@acala-network/sdk-core";
import {getSupplyAmount, getTargetAmount} from "@acala-network/sdk-swap/help";
import Keyring from "@polkadot/keyring";
import {querySystemBalance, queryTokenBalance} from "../utils/queryBalance";


// 添加流动性
export function AddLiquidity(suite: Suite, account: KeyringPair, currency_id_a: string, currency_id_b: string, currency_id_a_amount: number, currency_id_b_amount: number) {
    const tx = suite.api.tx.dex.addLiquidity(
        [{Token: currency_id_a}, {Token: currency_id_b}],
        new FixedPointNumber(currency_id_a_amount).toChainData(),
        new FixedPointNumber(currency_id_b_amount).toChainData()
    )
    return suite.send(account, tx)
}

//根据原有池子和新价格，算出新池子数量
export async function getPriceNeedAmount(suite: Suite, constant: FixedPointNumber, cexPrice: number) {
    // 常数
    // const constant = (oldPool as any)[0].toNumber() * ((oldPool as any)[1]).toNumber()
    let newCoinPool = Math.sqrt(constant.toNumber() / cexPrice)
    let newBasePool = constant.toNumber() / newCoinPool
    return [new FixedPointNumber(newCoinPool), new FixedPointNumber(newBasePool)]
}


// 查询流动性池子
export async function queryLuidityPool(suite: Suite, currencyId_01: string, currencyId_02: string) {
    let pairList = new TokenPair(getPresetToken(currencyId_01 as any), getPresetToken(currencyId_02 as any))
    const pool = await suite.api.query.dex.liquidityPool(
        pairList.toChainData()
    )
    // 根据传入的顺序返回
    return currencyId_01 == (pairList.toChainData() as any)[0].Token ? [((pool as any)[0].toString()), ((pool as any)[1].toString())]:[((pool as any)[1].toString()), ((pool as any)[0].toString())]

    // let baseIndex
    // let coinIndex
    // for (let i = 0; i < 2; i++) {
    //     let token = (pairList.toChainData() as any)[i].Token
    //     // console.log(token)
    //     if (token == currencyId_02) {
    //         baseIndex = i
    //         if (i == 0) {
    //             coinIndex = 1
    //         } else {
    //             coinIndex = 0
    //         }
    //         break
    //     }
    // }
    // // 根据传入的顺序返回
    // return [((pool as any)[coinIndex as any].toString()), ((pool as any)[baseIndex as any].toString())]
}


export async function swapIn(suite: Suite, account: KeyringPair, supplySymbol: string, targetSymbol: string, supplyAmount: FixedPointNumber, exchangeFee: any) {
    let pairList = supplySymbol == "AUSD" || targetSymbol == "AUSD" ? [{Token: supplySymbol}, {Token: targetSymbol}] : [{Token: supplySymbol}, {Token: "AUSD"}, {Token: targetSymbol}]
    let targetAmount
    if (supplySymbol == "AUSD" || targetSymbol == "AUSD") {
        let pool = await queryLuidityPool(suite, supplySymbol, targetSymbol)
        targetAmount = getTargetAmount(FixedPointNumber.fromInner(pool[0]), FixedPointNumber.fromInner(pool[1]), supplyAmount, exchangeFee)
    } else {
        let supplyPool = await queryLuidityPool(suite, supplySymbol, "AUSD")
        let supplyAUSDAmount = getTargetAmount(FixedPointNumber.fromInner(supplyPool[0]), FixedPointNumber.fromInner(supplyPool[1]), supplyAmount, exchangeFee)
        let targetPool = await queryLuidityPool(suite, "AUSD", targetSymbol)
        targetAmount = getTargetAmount(FixedPointNumber.fromInner(targetPool[0]), FixedPointNumber.fromInner(targetPool[1]), supplyAUSDAmount, exchangeFee)
    }
    let tx = await suite.api.tx.dex.swapWithExactSupply(
        pairList,
        supplyAmount.toChainData(),
        targetAmount.toChainData()
    )
    return await suite.send(account, tx)
}

export async function swapOut(suite: Suite, account: KeyringPair, supplySymbol: string, targetSymbol: string, targetAmount: FixedPointNumber, exchangeFee: any) {
    let pairList = supplySymbol == "AUSD" || targetSymbol == "AUSD" ? [{Token: supplySymbol}, {Token: targetSymbol}] : [{Token: supplySymbol}, {Token: "AUSD"}, {Token: targetSymbol}]
    let supplyAmount
    if (supplySymbol == "AUSD" || targetSymbol == "AUSD") {
        let pool = await queryLuidityPool(suite, supplySymbol, targetSymbol)
        supplyAmount = getSupplyAmount(FixedPointNumber.fromInner(pool[0]), FixedPointNumber.fromInner(pool[1]), targetAmount, exchangeFee)
    } else {
        let targetPool = await queryLuidityPool(suite, "AUSD", targetSymbol)
        let targetAUSDAmount = getSupplyAmount(FixedPointNumber.fromInner(targetPool[0]), FixedPointNumber.fromInner(targetPool[1]), targetAmount, exchangeFee)
        let supplyPool = await queryLuidityPool(suite, supplySymbol, "AUSD")
        supplyAmount = getSupplyAmount(FixedPointNumber.fromInner(supplyPool[0]), FixedPointNumber.fromInner(supplyPool[1]), targetAUSDAmount, exchangeFee)
    }
    console.log(supplyAmount.toNumber())
    let tx = await suite.api.tx.dex.swapWithExactTarget(
        pairList,
        targetAmount.toChainData(),
        supplyAmount.toChainData()
    )
    return await suite.send(account, tx)
}

export async function getDexFee(suite: Suite) {
    let fee = suite.api.consts.dex.getExchangeFee.toJSON()
    let numerator = (fee as any)[0]
    let denominator = (fee as any)[1]
    return {numerator: new FixedPointNumber(numerator), denominator: new FixedPointNumber(denominator)}
}