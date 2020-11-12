let queryLuidityPool = require("../actions/dexLiquidity")
const {promisify} = require('util')
let FixedPointNumber = require("@acala-network/sdk-core")
let dogapi = require("dogapi");
let Suite = require("../suite")
require('dotenv').config()

let localWS = process.env.LOCAL_WS

let suite = new Suite.Suite()

let symbol = ["DOT", "LDOT", "XBTC", "RENBTC", "ACA"]
let base = "AUSD"

let options = {
    api_key: process.env.DATADOG_API_KEY,
    app_key: process.env.DATADOG_APP_KEY
};

dogapi.initialize(options);


async function queryDataDog(from, to, query) {
    const queryDogApi = promisify(dogapi.metric.query)
    const result = await queryDogApi(from, to, query)
    let num

    let len = result.series[0].length
    let list = result.series[0].pointlist
    console.log(list)

    num = list[len - 1][1]

    console.log(parseInt(num))
    return parseInt(num)
}

async function sendDataTimeLog(nowTime, events, number) {
    dogapi.metric.send(events, [[nowTime, number]], function (err, results) {
        console.log("nowTime:" + nowTime);
        console.log("number:" + number);
        console.log("events:" + events);
        console.dir(results);
    });
}

async function sendCountLog(events, number) {
    dogapi.metric.send(events, number, function (err, results) {
        console.log("number:" + number);
        console.log("events:" + events);
        console.dir(results);
    })
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    await suite.connect(localWS)
    await suite.isReady()
    while (true) {
        for (let i = 0; i < symbol.length; i++) {
            let symbolPool = await queryLuidityPool.queryLuidityPool(suite, symbol[i], base)
            let price = FixedPointNumber.FixedPointNumber.fromInner(symbolPool[1]).div(FixedPointNumber.FixedPointNumber.fromInner(symbolPool[0]))
            console.log(price.toNumber())
            let eventName = `${symbol[i]}_price.metric`
            await sendDataTimeLog(parseInt(new Date().getTime() / 1000), eventName, price.toNumber())
        }
        await delay(3000)
    }
}


main()
