import { Fixed18 , calcSwapTargetAmount, calcSwapSupplyAmount, convertToFixed18} from '@acala-network/app-util'
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dexServer from '../actions/dexLiquidity'
import { updateBalances } from '../actions/updateBalances'
import { Suite } from "../suite";
import { createRandomAccount } from '../utils/createAccount'
import { add, assignWith } from 'lodash';
import * as queryBalance from '../utils/queryBalance'

const suite = new Suite()

async function SwapTargetTest(swapType:string, direction:number, supplyPool: number, targetPool:number, supply:number) {
  await suite.connect("ws://192.168.145.131:9944");
  await suite.isReady();
  // 获取交易手续费
  const fee = convertToFixed18(suite.api.consts.dex.getExchangeFee)
  // 滑点
  const slippage = convertToFixed18(0.01)
  // 前端数据计算
  const received = swapType == "target" ? calcSwapTargetAmount(supply, supplyPool, targetPool, fee, slippage) : calcSwapSupplyAmount(supply, supplyPool, targetPool, fee, slippage)
  // const received = calcSwapTargetAmount(supply, supplyPool, targetPool, fee, slippage)
  const account = createRandomAccount()[0]
  const addAccount = createRandomAccount()[0]

  await updateBalances(suite, account.address, {"ACA":20000})
  await updateBalances(suite, account.address, {"AUSD":20000})

  await updateBalances(suite, addAccount.address, {"ACA":20000})
  await updateBalances(suite, addAccount.address, {"AUSD":20000})

  //添加流动性
  await dexServer.dexAddLiquidity(suite, addAccount, "ACA", supplyPool, targetPool)
  await dexServer.queryLuidityPool(suite, "ACA")
  // 兑换 10000 个 AUSD 出来
  await dexServer.swapAmount(swapType, direction, suite, account, fee, slippage, supply, "ACA", "AUSD")

  console.log("address info: \n" +  JSON.stringify({address: account.address, ACA: 20000, AUSD:20000}))
  console.log("case data: " + "\n" + JSON.stringify({"supplyPool": supplyPool, "targetPool": targetPool, "supply": supply}))
  console.log("Balance after exchange: ")

  // 当前余额
  const acaBalance = await queryBalance.querySystemBalance(suite,account.address)
  const ausdBalance = await queryBalance.queryTokenBalance(suite, account.address, "AUSD")

  const expected = 20000 + received
  const actual = parseInt(ausdBalance.toFixed())
  if (expected == actual){
    console.log("case successful")
  }
  else{
    console.log("case failed, expected：" + expected + " actual: " + actual)
  }
  console.log("实际兑换得到的值：" + (actual - 20000))
  console.log("calcSwapTargetAmount 应得到的值：" + calcSwapTargetAmount(supply, supplyPool, targetPool, fee, slippage))
  const res = "target" ? (1 - slippage.toNumber()) * (1 - fee.toNumber()) * (targetPool - (supplyPool * targetPool) / (supplyPool + supply)) : (1 - slippage.toNumber()) * targetPool * supplyPool / (targetPool - supply / (1 -  fee.toNumber())) - supplyPool
  console.log("dex 计算公式应得到的值果：" + res)
  await dexServer.queryLuidityPool(suite, "ACA")
}

//swap target amount should work
async function SwapTargetTest_01() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 10000;
  const targetPool = 10000;
  const supply = 10000;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}

//should return 0 when target pool is 1
async function SwapTargetTest_02() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 10000;
  const targetPool = 1;
  const supply = 10000;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}

//should return 0 when supply pool is too big
async function SwapTargetTest_03() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 9901;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}

//should no fees when target amount is too small
async function SwapTargetTest_04() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 9900;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}


async function SwapTargetTest_05() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 1;
  const targetPool = 100;
  const supply = 9900;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}

async function SwapTargetTest_06() {
  const swapType = "target"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 0;
  await SwapTargetTest("target", otherTOBase, supplyPool, targetPool, supply)
}

// supply Test
async function SwapSupplyTest_01() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 10000;
  const targetPool = 10000;
  const supply = 10000;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}

//should return 0 when target pool is 1
async function SwapSupplyTest_02() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 10000;
  const targetPool = 1;
  const supply = 10000;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}

//should return 0 when supply pool is too big
async function SwapSupplyTest_03() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 9901;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}

//should no fees when target amount is too small
async function SwapSupplyTest_04() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 9900;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}


async function SwapSupplyTest_05() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 1;
  const targetPool = 100;
  const supply = 9900;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}

async function SwapSupplyTest_06() {
  const swapType = "supply"
  const otherTOBase = 1
  // 准备数据
  const supplyPool = 100;
  const targetPool = 100;
  const supply = 0;
  await SwapTargetTest(swapType, otherTOBase, supplyPool, targetPool, supply)
}




SwapSupplyTest_01().catch(console.error).finally(() => process.exit());

// describe('calcault target amount',() => {

//   const fee = Fixed18.fromRational(1, 100);

//   beforeEach(async()=>{
//     process.env.NODE_ENV = 'development';
    
//     await suite.connect("ws://192.168.145.131:9944");
//     await suite.isReady();

//   })

//   test('swap target amount should work', async() => {
//     const supplyPool = 10000;
//     const targetPool = 10000;
//     const supply = 10000;
//     const received = 4950;

//     const account = createRandomAccount()[0]
    
//     await updateBalances(suite, account.address, {"ACA":10000})
//     await updateBalances(suite, account.address, {"AUSD":10000})

//     await dexServer.targetOtherToBase(suite, account, 10000, "ACA", "AUSD")

//     const acaBalance = await queryBalance.querySystemBalance(suite,account.address)
//     const ausdBalance = await queryBalance.queryTokenBalance(suite, account.address, "AUSD")

//     expect(calcSwapTargetAmount(supply, supplyPool, targetPool, fee)).toEqual(received);
//   });

//   test('should return 0 when target pool is 1', () => {
//     const supplyPool = 10000;
//     const targetPool = 1;
//     const supply = 10000;
//     const received = 0;
//     expect(calcSwapTargetAmount(supply, supplyPool, targetPool, fee)).toEqual(received);
//   });

//   test('should return 0 when supply pool is too big', () => {
//     const supplyPool = 100;
//     const targetPool = 100;
//     const supply = 9901;
//     const received = 0;
//     expect(calcSwapTargetAmount(supply, supplyPool, targetPool, fee)).toEqual(received);
//   });

//   test('should no fees when target amount is too small', () => {
//     const supplyPool = 100;
//     const targetPool = 100;
//     const supply = 9900;
//     const received = 99;
//     expect(calcSwapTargetAmount(supply, supplyPool, targetPool, fee)).toEqual(received);
//   });
// });

// describe('calcult supply amount', () => {
//   const fee = Fixed18.fromRational(1, 100);

//   test('swap supply amount should work', () => {
//     const supplyPool = 10000;
//     const targetPool = 10000;
//     const target = 4950;
//     const received = 10000;
//     expect(calcSwapSupplyAmount(target, supplyPool, targetPool, fee)).toEqual(received);
//   });

//   test('should return 0 when target amount is 0', () => {
//     const supplyPool = 10000;
//     const targetPool = 10000;
//     const target = 0;
//     const received = 0;
//     expect(calcSwapSupplyAmount(target, supplyPool, targetPool, fee)).toEqual(received);
//   });

//   test('should return 0 when target amount is too big', () => {
//     const supplyPool = 10000;
//     const targetPool = 10000;
//     const target = 10000;
//     const received = 0;
//     expect(calcSwapSupplyAmount(target, supplyPool, targetPool, fee)).toEqual(received);
//   });
// });
