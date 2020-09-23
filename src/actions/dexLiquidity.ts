import { Fixed18, calcTargetInOtherToBase, calcTargetInBaseToOther,convertToFixed18 ,calcSupplyInOtherToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther } from "@acala-network/app-util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Suite } from "../suite";
// import { feedPrices } from "../actions/feedPrices";


// 查询流动性池子
export async function queryLuidityPool(suite:Suite,currencyId:string) {
    const pool = await suite.api.query.dex.liquidityPool(
      currencyId
    )
    const pooList = [convertToFixed18((pool as any)[0]).toNumber(), convertToFixed18((pool as any)[1]).toNumber()]
    console.log("queryLuidityPool：\n" + JSON.stringify({currencyId: currencyId, pool: pooList}))
    return pooList
  }

export function dexAddLiquidity(suite:Suite, account: KeyringPair, asset: string, otherSupply:number , baseSupply:number){
    const tx = suite.api.tx.dex.addLiquidity(
        asset,
        Fixed18.fromNatural(otherSupply).innerToString(),
        Fixed18.fromNatural(baseSupply).innerToString()
    )
    console.log("dexAddLiquidity: \n" + JSON.stringify({"account": account.address, "asset": asset, "otherSupply": Fixed18.fromNatural(otherSupply).innerToString(), "baseSupply": Fixed18.fromNatural(baseSupply).innerToString()}))
    return suite.send(account, tx)
}


export async function calcSwapAmount(suite:Suite, account: KeyringPair, supply:any, supplySymbol:string, target: any, targetSymbol:string){
    const tx = suite.api.tx.dex.swapCurrency(
        supplySymbol,
        Fixed18.fromNatural(supply).innerToString(),
        targetSymbol,
        Fixed18.fromNatural(target).innerToString()
      )
    await suite.send(account, tx)
    return {supply: Fixed18.fromNatural(supply).toNumber(), supplySymbol:supplySymbol, target: Fixed18.fromNatural(target).toNumber(), targetSymbol: targetSymbol}
}


export async function swapAmount(swapType:string, direction:number, suite:Suite, account: KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, supply:number, supplySymbol:string, targetSymbol:string) {
    console.log(swapType, direction)
    const swapStatus = swapType == "target"
    if (swapStatus){
      switch(direction){
        case 1:
          return await targetOtherToBase(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
        case 2:
          return await targetBaseToOther(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
        case 3:
          return await targetOherToOther(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
      }
    }else{
      switch(direction){
        case 1:
          return await supplyOtherToBase(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
        case 2:
          return await supplyBaseToOther(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
        case 3:
          return await supplyOtherToOther(suite, account, exchangeFee, slippage, supply, supplySymbol, targetSymbol)
    
      }

    }
    
}

// other -=-> base
export async function supplyOtherToBase(suite:Suite, account: KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, target:number, supplySymbol:string, targetSymbol:string){
    const pool = await(suite.api.derive as any).dex.pool(supplySymbol)
    const supply = calcSupplyInOtherToBase(
        convertToFixed18(target),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(slippage) 
    )
    // console.log((1 - 0.05) * 10000 * 10000 / (10000 - target / (1 - 0.001)) - 10000)
    // console.log(calcSwapSupplyAmount(target, 10000, 10000, convertToFixed18(0.001), convertToFixed18(0.05)))
    // console.log(target, convertToFixed18(pool.other).toNumber(), convertToFixed18(pool.base).toNumber(), supply.toNumber())
    console.log("supplyOtherToBase: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": convertToFixed18(supply).toNumber(), "supplySymbol":supplySymbol, "targetSymbol": targetSymbol}))
    return calcSwapAmount(suite, account, convertToFixed18(supply).toNumber(), supplySymbol, convertToFixed18(target).toNumber(), targetSymbol) 

}

// other -=-> base
export async function targetOtherToBase(suite:Suite, account: KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, supply:number, supplySymbol:string, targetSymbol:string){
    const pool = await (suite.api.derive as any).dex.pool(supplySymbol)
    const target = calcTargetInOtherToBase(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
    )
    console.log("targetOtherToBase: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": supply, "supplySymbol":supplySymbol, "target":Fixed18.fromNatural(target as any).toNumber(), "targetSymbol": targetSymbol}))
    return calcSwapAmount(suite, account, supply, supplySymbol, target, targetSymbol)
}

//base ---> other
export async function supplyBaseToOther(suite:Suite, account:KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, target:number, supplySymbol:string, targetSymbol:string){
    const pool = await(suite.api.derive as any).dex.pool(supplySymbol)
    // 想换amount个 aca，需要提供的 ausd 数量
    const supply = calcSupplyInBaseToOther(
        convertToFixed18(target),
        {"other":convertToFixed18(pool.other),
        "base":convertToFixed18(pool.base)},
        convertToFixed18(exchangeFee),
        convertToFixed18(slippage)
        )
    console.log("supplyBaseToOther: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": convertToFixed18(supply).toNumber(), "supplySymbol":supplySymbol, "targetSymbol": targetSymbol}))
    return calcSwapAmount(suite, account, supply, targetSymbol, target, supplySymbol)
}

//base ---> other
export async function targetBaseToOther(suite:Suite, account:KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, supply:number, supplySymbol:string, targetSymbol:string) {
    const pool = await(suite.api.derive as any).dex.pool(supplySymbol)
    // 提供amount 能换到的 aca 数量 
    const target = calcTargetInBaseToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(pool.other),
      "base":convertToFixed18(pool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
      )
    console.log("targetBaseToOther: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": supply, "supplySymbol":supplySymbol, "targetSymbol": targetSymbol}))
    return calcSwapAmount(suite, account, supply, targetSymbol, target, supplySymbol)
  }
  
// other ---> other
  export async function supplyOtherToOther(suite:Suite,account:KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, target:number, supplySymbol:string, targetSymbol:string) {
    const basePool = await(suite.api.derive as any).dex.pool(supplySymbol)
    const otherPool = await(suite.api.derive as any).dex.pool(targetSymbol)
    
    const supply = calcSupplyInOtherToOther(
      convertToFixed18(target),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
      )
    console.log("supplyOtherToOther: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": supply, "supplySymbol":supplySymbol, "targetSymbol": targetSymbol}))
 
    return calcSwapAmount(suite, account, convertToFixed18(supply).toNumber() , supplySymbol , convertToFixed18(target).toNumber(), targetSymbol)
  }


  //other ---> other
  export async function targetOherToOther(suite:Suite, account:KeyringPair, exchangeFee:Fixed18, slippage: Fixed18, supply:number, supplySymbol:string, targetSymbol:string) {
    const basePool = await(suite.api.derive as any).dex.pool(supplySymbol)
    const otherPool = await(suite.api.derive as any).dex.pool(targetSymbol)
    
    const target = calcTargetInOtherToOther(
      convertToFixed18(supply),
      {"other":convertToFixed18(basePool.other), "base":convertToFixed18(basePool.base)},
      {"other":convertToFixed18(otherPool.other), "base":convertToFixed18(otherPool.base)},
      convertToFixed18(exchangeFee),
      convertToFixed18(slippage)
      )
    console.log("targetOherToOther: \n" + JSON.stringify({"account": account.address, "exchangeFee": convertToFixed18(exchangeFee).toString(), "slippage": convertToFixed18(slippage).toString(), "supply": supply, "supplySymbol":supplySymbol, "targetSymbol": targetSymbol}))
 
    return calcSwapAmount(suite, account, convertToFixed18(supply).toNumber(), supplySymbol, convertToFixed18(target).toNumber(), targetSymbol)
  }
  
  
  // 查询 dex 份额
  export async function queryShares(suite:Suite, address:string, currencyId:string) {
    const shares = await suite.api.query.dex.shares(
          currencyId,
          address
       )
    console.log(convertToFixed18(shares).toNumber())
  }
  