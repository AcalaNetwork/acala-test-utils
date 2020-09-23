import {Fixed18, calcSwapTargetAmount, calcSwapSupplyAmount, convertToFixed18} from '@acala-network/app-util'
import {ApiPromise, WsProvider} from '@polkadot/api';
import * as dexServer from '../../actions/dexLiquidity'
import {updateBalances} from '../../actions/updateBalances'
import {Suite} from "../../suite";
import {createRandomAccount} from '../../utils/createAccount'
import {add, assignWith} from 'lodash';
import * as queryBalance from '../../utils/queryBalance'

const localWS = "ws://192.168.145.133:9944"

const suite = new Suite()

export async function SwapOtherToBaseTest(swapType: string, direction: number, supplyPool: number, targetPool: number, amount: number, supplySymobl: string, targetSymbol: string) {
    await suite.connect(localWS);
    await suite.isReady();
    // 获取交易手续费
    const fee = convertToFixed18(suite.api.consts.dex.getExchangeFee)
    // 滑点
    const slippage = convertToFixed18(0.05)
    // 前端数据计算
    const account = createRandomAccount()[0]
    const addAccount = createRandomAccount()[0]

    await updateBalances(suite, account.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, account.address, {[targetSymbol]: 1000000})

    await updateBalances(suite, addAccount.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, addAccount.address, {[targetSymbol]: 1000000})

    //添加流动性
    await dexServer.dexAddLiquidity(suite, addAccount, supplySymobl, supplyPool, targetPool)
    await dexServer.queryLuidityPool(suite, supplySymobl)

    // 初始余额
    const initAcaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const initAusdBalance = await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    // 兑换 10000 个 AUSD 出来
    const swapRes = await dexServer.swapAmount(swapType, direction, suite, account, fee, slippage, amount, supplySymobl, targetSymbol)

    const received = ((swapRes as any)['target']) as number
    const pay = ((swapRes as any)['supply']) as number

    console.log("pay amount: " + pay.toString(), "received amount：" + received.toString())

    console.log(JSON.stringify(swapRes))
    console.log("address info: \n" + JSON.stringify({address: account.address, ACA: 20000, AUSD: 20000}))
    console.log("Balance after exchange: ")

    // 当前余额
    const acaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const ausdBalance = await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    const expected = swapType == "target" ? Math.round(initAusdBalance + received) : Math.round(initAcaBalance - received)
    const actual = swapType == "target" ? Math.round(ausdBalance) : Math.round(acaBalance)

    await dexServer.queryLuidityPool(suite, supplySymobl)
//   if (expected == actual){
//     console.log("case successful")
//     return true
//   }
//   else{
//     console.log("case failed, expected：" + expected + " actual: " + actual)
//     return false
//   }
}

// base other 参数相反
export async function SwapBaseToOtherTest(swapType: string, direction: number, supplyPool: number, targetPool: number, amount: number, supplySymobl: string, targetSymbol: string) {
    await suite.connect(localWS);
    await suite.isReady();
    // 获取交易手续费
    const fee = convertToFixed18(suite.api.consts.dex.getExchangeFee)
    // 滑点
    const slippage = convertToFixed18(0.05)
    // 前端数据计算
    const account = createRandomAccount()[0]
    const addAccount = createRandomAccount()[0]
    //初始账户余额
    await updateBalances(suite, account.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, account.address, {[targetSymbol]: 1000000})

    await updateBalances(suite, addAccount.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, addAccount.address, {[targetSymbol]: 1000000})

    //添加流动性
    await dexServer.dexAddLiquidity(suite, addAccount, supplySymobl, supplyPool, targetPool)
    await dexServer.queryLuidityPool(suite, supplySymobl)

    // 初始余额
    const initAcaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const initAusdBalance = await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    // 兑换
    const swapRes = await dexServer.swapAmount(swapType, direction, suite, account, fee, slippage, amount, supplySymobl, targetSymbol)

    const received = ((swapRes as any)['target']) as number
    const pay = ((swapRes as any)['supply']) as number

    console.log("pay amount: " + pay.toString(), "received amount：" + received.toString())
    console.log(JSON.stringify(swapRes))
    console.log("address info: \n" + JSON.stringify({address: account.address, ACA: 20000, AUSD: 20000}))
    console.log("Balance after exchange: ")

    // 当前余额
    const acaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const ausdBalance = await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    const expected = swapType == "target" ? Math.round(initAusdBalance + received) : Math.round(initAcaBalance - received)
    const actual = swapType == "target" ? Math.round(acaBalance) : Math.round(ausdBalance)

    await dexServer.queryLuidityPool(suite, "ACA")
    // if (expected == actual){
    //   console.log("case successful")
    //   return true
    // }
    // else{
    //   console.log("case failed, expected：" + expected + " actual: " + actual)
    //   return false
    // }
}


export async function SwapOtherToOtherTest(swapType: string, direction: number, supplyPool: number, targetPool: number, amount: number, supplySymobl: string, targetSymbol: string) {
    await suite.connect(localWS);
    await suite.isReady();
    // 获取交易手续费
    const fee = convertToFixed18(suite.api.consts.dex.getExchangeFee)
    // 滑点
    const slippage = convertToFixed18(0.05)
    // 前端数据计算
    const account = createRandomAccount()[0]
    const addAccount = createRandomAccount()[0]

    await updateBalances(suite, account.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, account.address, {[targetSymbol]: 1000000})
    await updateBalances(suite, account.address, {"AUSD": 1000000})
    await updateBalances(suite, addAccount.address, {[supplySymobl]: 1000000})
    await updateBalances(suite, addAccount.address, {[targetSymbol]: 1000000})
    await updateBalances(suite, addAccount.address, {"AUSD": 1000000})
    //添加流动性
    await dexServer.dexAddLiquidity(suite, addAccount, supplySymobl, supplyPool, supplyPool)
    await dexServer.dexAddLiquidity(suite, addAccount, targetSymbol, targetPool, targetPool)

    await dexServer.queryLuidityPool(suite, supplySymobl)
    await dexServer.queryLuidityPool(suite, targetSymbol)

    // 初始余额
    const initAcaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const initAusdBalance = targetSymbol == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    // 兑换 10000 个 AUSD 出来
    const swapRes = await dexServer.swapAmount(swapType, direction, suite, account, fee, slippage, amount, supplySymobl, targetSymbol)

    const received = ((swapRes as any)['target']) as number
    const pay = ((swapRes as any)['supply']) as number

    console.log("pay amount: " + pay.toString(), "received amount：" + received.toString())

    console.log(JSON.stringify(swapRes))
    console.log("address info: \n" + JSON.stringify({address: account.address, ACA: 20000, AUSD: 20000}))
    console.log("Balance after exchange: ")

    // 当前余额
    const acaBalance = supplySymobl == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, supplySymobl)
    const ausdBalance = targetSymbol == "ACA" ? await queryBalance.querySystemBalance(suite, account.address) : await queryBalance.queryTokenBalance(suite, account.address, targetSymbol)

    const expected = swapType == "target" ? Math.round(initAusdBalance + received) : Math.round(initAcaBalance - received)
    const actual = swapType == "target" ? Math.round(ausdBalance) : Math.round(acaBalance)

    await dexServer.queryLuidityPool(suite, supplySymobl)
    await dexServer.queryLuidityPool(suite, targetSymbol)
}