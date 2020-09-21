import { Fixed18, calcTargetInOtherToBase, calcTargetInBaseToOther,convertToFixed18 ,calcSupplyInOtherToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther} from "@acala-network/app-util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Suite } from "../suite";
// import { feedPrices } from "../actions/feedPrices";


// 查询流动性池子
export async function queryLuidityPool(suite:Suite,currencyId:string) {
    const pool = await suite.api.query.dex.liquidityPool(
      currencyId
    )
    const pooList = [convertToFixed18((pool as any)[0]).toNumber(), convertToFixed18((pool as any)[1]).toNumber()]
    console.log(pooList)
    return pooList
  }

export function dexAddLiquidity(suite:Suite, account: KeyringPair, asset: string, otherSupply:number , baseSupply:number){
    const tx = suite.api.tx.dex.addLiquidity(
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
export async function supplytOtherToBase(suite:Suite, account: KeyringPair, exchangeFee:number, slippage: number, supply:number, otherSymbol:string, baseSymbol:string){
    const pool = await(suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcSupplyInOtherToBase(
        convertToFixed18(supply),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(slippage) 
    )
    return calcSwapTargetAmount(suite, account, target, supply, otherSymbol, baseSymbol) 

}

// other -=-> base
export async function targetOtherToBase(suite:Suite, account: KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, supply:number, otherSymbol:string, baseSymbol:string){
    const pool = await (suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcTargetInOtherToBase(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
    )
    return calcSwapTargetAmount(suite, account, target, supply, otherSymbol, baseSymbol)
}

//base ---> other
export async function supplyBaseToOther(suite:Suite, account:KeyringPair, exchangeFee:number, slippage: number, supply:number, baseSymbol:string, otherSymbol:string){
    const pool = await(suite.api.derive as any).dex.pool(otherSymbol)
    const target = calcSupplyInBaseToOther(
        convertToFixed18(supply),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(slippage)
        )
    calcSwapTargetAmount(suite, account, target, supply, baseSymbol, otherSymbol)
}

//base ---> other
export async function targetBaseToOther(suite:Suite, account:KeyringPair, exchangeFee:number, slippage: number, supply:number, baseSymbol:string, otherSymbol:string) {
    const pool = await(suite.api.derive as any).dex.pool(otherSymbol)

    const target = calcTargetInBaseToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
      )
    calcSwapTargetAmount(suite, account, target, supply, baseSymbol, otherSymbol)
  }
  
// other ---> other
  export async function supplyOtherToOther(suite:Suite,account:KeyringPair, exchangeFee:number, slippage: number, supply:number, otherSymbol01:string, otherSymbol02:string) {
    const basePool = await(suite.api.derive as any).dex.pool(otherSymbol01)
    const otherPool = await(suite.api.derive as any).dex.pool(otherSymbol02)
    
    const target = calcSupplyInOtherToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
      )
    calcSwapTargetAmount(suite, account, target, supply, otherSymbol01, otherSymbol02)
  }


  //other ---> other
  export async function targetOherToOther(suite:Suite, account:KeyringPair, exchangeFee:number, slippage: number, supply:number, otherSymbol01:string, otherSymbol02:string) {
    const basePool = await(suite.api.derive as any).dex.pool(otherSymbol01)
    const otherPool = await(suite.api.derive as any).dex.pool(otherSymbol02)
    
    const target = calcTargetInOtherToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
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
  