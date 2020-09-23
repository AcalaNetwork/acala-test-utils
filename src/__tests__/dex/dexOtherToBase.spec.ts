import { SwapOtherToBaseTest } from './dex_template'


//swap target amount should work
async function targetSwapOtherToBaseTest_01() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should return 0 when target pool is 1
async function targetSwapOtherToBaseTest_02() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 1;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should return 0 when supply pool is too big
async function targetSwapOtherToBaseTest_03() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 9901;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should no fees when target amount is too small
async function targetSwapOtherToBaseTest_04() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 9900;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}


async function targetSwapOtherToBaseTest_05() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 100;
    const amount = 9900;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function targetSwapOtherToBaseTest_06() {
    const swapType = "target"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 0;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

// supply Test
async function supplySwapOtherToBaseTest_01() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 10000;
    const amount = 4950;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should return 0 when target pool is 1
async function supplySwapOtherToBaseTest_02() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 10000;
    const targetPool = 1;
    const amount = 10000;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should return 0 when supply pool is too big
async function supplySwapOtherToBaseTest_03() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 9901;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

//should no fees when target amount is too small
async function supplySwapOtherToBaseTest_04() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 9900;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}


async function supplySwapOtherToBaseTest_05() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 1;
    const targetPool = 100;
    const amount = 9900;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}

async function supplySwapOtherToBaseTest_06() {
    const swapType = "supply"
    const otherTOBase = 1
    const supplySymobl = "ACA"
    const targetSymbol = "AUSD"
    // 准备数据
    const supplyPool = 100;
    const targetPool = 100;
    const amount = 0;
    await SwapOtherToBaseTest(swapType, otherTOBase, supplyPool, targetPool, amount, supplySymobl, targetSymbol)
}
