import {SwapBaseToOtherTest, SwapOtherToBaseTest} from "./dex_template";

// 正常兑换
async function targetSwapBaseToOtherTest_01() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//  当比例为 10000：1 的时候  提供 10000 个 兑换得到的数量
async function targetSwapBaseToOtherTest_02() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 10000;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 1：10000 的时候  提供 10个兑换得到的数量
async function targetSwapBaseToOtherTest_03() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 1;
    const amount = 10;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 1：1 的时候  提供 10000 个兑换得到的数量
async function targetSwapBaseToOtherTest_04() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 1;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 1：1 的时候  提供 0 个兑换得到的数量
async function targetSwapBaseToOtherTest_05() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 1;
    const amount = 0;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 1：1 的时候  提供 1.999999999999999999 个兑换得到的数量
async function targetSwapBaseToOtherTest_06() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 1;
    const amount = 1.999999999999999999;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 1：1 的时候  提供 0.000000000000000001 个兑换得到的数量
async function targetSwapBaseToOtherTest_07() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 1;
    const amount = 0.000000000000000001;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}


// 当比例为 10000：1 的时候  提供 1 个兑换得到的数量
async function targetSwapBaseToOtherTest_08() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 10000;
    const amount = 1;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 10000：1 的时候  提供 0.5 个兑换得到的数量
async function targetSwapBaseToOtherTest_09() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 100000;
    const amount = 0.5;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 当比例为 10000：1 的时候  提供 0.005 个兑换得到的数量
async function targetSwapBaseToOtherTest_10() {
    const swapType = "target"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 100000;
    const amount = 0.005;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 正常兑换
async function supplySwapBaseToOtherTest_01() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 5000;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// 全部兑换 ，兑换不出
async function supplySwapBaseToOtherTest_02() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 10000;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function supplySwapBaseToOtherTest_03() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 1;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function supplySwapBaseToOtherTest_04() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 10000;
    const amount = 1;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function supplySwapBaseToOtherTest_05() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 1;
    const amount = 1;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function supplySwapBaseToOtherTest_06() {
    const swapType = "supply"
    const otherTOBase = 2
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 0;
    await SwapBaseToOtherTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}