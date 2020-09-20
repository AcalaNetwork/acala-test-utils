import { Fixed18 , calcSwapTargetAmount, calcSwapSupplyAmount, convertToFixed18} from '@acala-network/app-util'
import { ApiPromise } from '@polkadot/api';
import * as dexServer from '../scripts/dexAddLiquidity'
import { updateBalances } from '../scripts/updateBalances'
import { Suite } from "../suite";
import { createRandomAccount } from '../utils/createAccount'
import { add, assignWith } from 'lodash';
import * as queryBalance from '../utils/queryBalance'

const suite = new Suite()


async function testSwapTarget() {
  await suite.connect("ws://192.168.145.131:9944");
  await suite.isReady();
  
  const fee = convertToFixed18(suite.api.consts.dex.getExchangeFee)
  const slippage = convertToFixed18(0.01)

  const supplyPool = 10000;
  const targetPool = 10000;
  const supply = 10000;
  const received = 4950;

  const account = createRandomAccount()[0]
  const addAccount = createRandomAccount()[0]
  // 多余
  await updateBalances(suite, account.address, {"ACA":20000})
  await updateBalances(suite, account.address, {"AUSD":20000})

  await updateBalances(suite, addAccount.address, {"ACA":20000})
  await updateBalances(suite, addAccount.address, {"AUSD":20000})

  //添加流动性
  await dexServer.dexAddLiquidity(suite, addAccount, "ACA", 10000, 10000)
  // 兑换 10000 个 AUSD 出来
  await dexServer.targetOtherToBase(suite, account, fee, slippage, 10000, "ACA", "AUSD")

  const acaBalance = await queryBalance.querySystemBalance(suite,account.address)
  const ausdBalance = await queryBalance.queryTokenBalance(suite, account.address, "AUSD")
  if ( parseInt(ausdBalance.toFixed()) - 10000 == received){
    console.log("case successful")
  } else{
    console.log("case failed")
  }
  console.log(calcSwapTargetAmount(supply, supplyPool, targetPool, fee, slippage))
//   expect(calcSwapTargetAmount(supply, supplyPool, targetPool, fee)).toEqual(received);
}

testSwapTarget()

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
