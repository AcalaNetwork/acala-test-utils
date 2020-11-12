import {Suite} from "../../suite";
import Keyring from "@polkadot/keyring";
import {FixedPointNumber} from "@acala-network/sdk-core";
import {querySystemBalance, queryTokenBalance} from "../../utils/queryBalance";
import {getDexFee, swapIn, swapOut} from "../../actions/dexLiquidity";
import * as dotenv from "dotenv"
dotenv.config()

async function main() {
    const suite = new Suite()

    const localWS = process.env.LOCAL_WS
    const key = process.env.ADDRESS_KEY

    function address() {
        const keyring = new Keyring({type: 'sr25519'});
        return keyring.addFromUri(`${key}`)
    }

    await suite.connect(localWS);
    await suite.isReady();
    // 交易手续费
    const fee = await getDexFee(suite)
    console.log(
        `当前操作地址：${address().address}`
    )

    console.log(FixedPointNumber.fromInner(await querySystemBalance(suite, address().address)).toNumber())
    await swapOut(suite, address(), "ACA", "AUSD", new FixedPointNumber(1), fee)
    await swapIn(suite, address(), "ACA", "AUSD", new FixedPointNumber(1), fee)
    console.log("操作成功")
    console.log(FixedPointNumber.fromInner(await querySystemBalance(suite, address().address)).toNumber())

    console.log(FixedPointNumber.fromInner(await queryTokenBalance(suite, address().address, "AUSD")).toNumber())
    await swapOut(suite, address(), "AUSD", "ACA", new FixedPointNumber(1), fee)
    await swapIn(suite, address(), "AUSD", "ACA", new FixedPointNumber(1), fee)
    console.log("操作成功")
    console.log(FixedPointNumber.fromInner(await queryTokenBalance(suite, address().address, "AUSD")).toNumber())

    console.log(FixedPointNumber.fromInner(await querySystemBalance(suite, address().address)).toNumber())
    console.log(FixedPointNumber.fromInner(await queryTokenBalance(suite, address().address, "DOT")).toNumber())
    await swapIn(suite, address(), "DOT", "ACA", new FixedPointNumber(1), fee)
    await swapOut(suite, address(), "DOT", "ACA", new FixedPointNumber(1), fee)
    console.log("操作成功")
    console.log(FixedPointNumber.fromInner(await querySystemBalance(suite, address().address)).toNumber())
    console.log(FixedPointNumber.fromInner(await queryTokenBalance(suite, address().address, "DOT")).toNumber())


}

main()