import {SwapOtherToOtherTest} from "./dex_template";

// other 正常兑换
async function targetSwapOtherToOtherTest_01() {
    const swapType = "target"
    const otherTOBase = 3
    const supplySymobl = "ACA"
    const targetSymbol = "DOT"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 5000;
    await SwapOtherToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// other 正常兑换
async function targetSwapOtherToOtherTest_02() {
    const swapType = "target"
    const otherTOBase = 3
    const supplySymobl = "ACA"
    const targetSymbol = "DOT"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 10000;
    await SwapOtherToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// other 兑换过小
async function targetSwapOtherToOtherTest_03() {
    const swapType = "target"
    const otherTOBase = 3
    const supplySymobl = "ACA"
    const targetSymbol = "DOT"
    // 准备数据
    const supplyPool = 100000;
    const targetPool = 100000;
    const amount = 0.05;
    await SwapOtherToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// other 池子小的时候 兑换数量大
async function targetSwapOtherToOtherTest_04() {
    const swapType = "target"
    const otherTOBase = 3
    const supplySymobl = "ACA"
    const targetSymbol = "DOT"
    // 准备数据
    const supplyPool = 10;
    const targetPool = 10;
    const amount = 10000;
    await SwapOtherToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

targetSwapOtherToOtherTest_04().catch(console.error).finally(() => process.exit());
