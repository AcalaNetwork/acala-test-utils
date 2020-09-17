import { Fixed18, calcTargetInOtherToBase, calcTargetInBaseToOther,convertToFixed18 ,calcSupplyInOtherToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther} from "@acala-network/app-util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Suite } from "../suite";
import { feedPrices } from "./feedPrices";


// 查询流动性池子
export async function queryLuidityPool(suite:Suite,currencyId:string) {
    const pool = await suite.api.query.dex.liquidityPool(
      currencyId
    )
    const pooList = [convertToFixed18(pool[0]).toNumber(), convertToFixed18(pool[1]).toNumber()]
    console.log(pooList)
    return pooList
  }

export function dexAddLiquidity(suite:Suite, account: KeyringPair, asset: string, otherSupply:number , baseSupply:number){
    const tx = suite.api.tx.dex.dexAddLiquidity(
        asset,
        Fixed18.fromNatural(otherSupply).innerToString(),
        Fixed18.fromNatural(baseSupply).innerToString()
    )
    return suite.send(account, tx)
}


export function calcSwapTargetAmount(suite:Suite, account: KeyringPair, target: any, supply:number, otherSymbol:string, baseSymbol:string){
    const tx = suite.api.tx.dex.swapCurrency(
        otherSymbol,
        Fixed18.fromNatural(supply).innerToString(),
        baseSymbol,
        target.innerToString()
      )
    return suite.send(account, tx)
}

// other -=-> base
export function supplytOtherToBase(suite:Suite, account: KeyringPair, supply:number, otherSymbol:string, baseSymbol:string){
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const pool = (suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcSupplyInOtherToBase(
        convertToFixed18(supply),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(0.001) 
    )
    return calcSwapTargetAmount(suite, account, target, supply, otherSymbol, baseSymbol) 

}

// other -=-> base
export function targetOtherToBase(suite:Suite, account: KeyringPair, supply:number, otherSymbol:string, baseSymbol:string){
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const pool = (suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcTargetInOtherToBase(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(0.001)
    )
    return calcSwapTargetAmount(suite, account, target, supply, otherSymbol, baseSymbol)
}

//base ---> other
export function supplyBaseToOther(suite:Suite, account:KeyringPair, supply:number, baseSymbol:string, otherSymbol:string){
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const pool = (suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcSupplyInBaseToOther(
        convertToFixed18(supply),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(0.01)
        )
    calcSwapTargetAmount(suite, account, target, supply, baseSymbol, otherSymbol)
}

//base ---> other
export function targetBaseToOther(suite:Suite, account:KeyringPair, supply:number, baseSymbol:string, otherSymbol:string) {
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const pool = (suite.api.derive as any).dex.pool(otherSymbol)

    const target = calcTargetInBaseToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(0.01)
      )
    calcSwapTargetAmount(suite, account, target, supply, baseSymbol, otherSymbol)
  }
  
// other ---> other
  export function supplyOtherToOther(suite:Suite,account:KeyringPair, supply:number, otherSymbol01:string, otherSymbol02:string) {
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const basePool = (suite.api.derive as any).dex.pool(otherSymbol01)
    const otherPool = (suite.api.derive as any).dex.pool(otherSymbol02)
    
    const target = calcSupplyInOtherToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(0.01)
      )
    calcSwapTargetAmount(suite, account, target, supply, otherSymbol01, otherSymbol02)
  }


  //other ---> other
  export function targetOherToOther(suite:Suite, account:KeyringPair, supply:number, otherSymbol01:string, otherSymbol02:string) {
    const exchangeFee = suite.api.consts.dex.getExchangeFee
    const basePool = (suite.api.derive as any).dex.pool(otherSymbol01)
    const otherPool = (suite.api.derive as any).dex.pool(otherSymbol02)
    
    const target = calcTargetInOtherToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(0.01)
      )
    calcSwapTargetAmount(suite, account, target, supply, otherSymbol01, otherSymbol02)
  }
  
  
  // 查询 dex 份额
  export async function queryShares(suite:Suite, address:string, currencyId:string) {
    const shares = await suite.api.query.dex.shares(
          currencyId,
          address
       )
    console.log(convertToFixed18(shares).toNumber())
  }
  