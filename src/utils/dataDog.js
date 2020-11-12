const {promisify} = require('util')
let FixedPointNumber = require("@acala-network/sdk-core")
let dogapi = require("dogapi");
let Suite = require("../suite")
require('dotenv').config()

let localWS = process.env.LOCAL_WS

let suite = new Suite.Suite()

let eventNameList = ["cdpEngine:LiquidateUnsafeCDP", "dex:Swap", "loans:PositionUpdated"]

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

    num = list[len-1][1]

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


async function getEvents(suite) {
    await suite.connect(localWS)
    await suite.isReady()
    suite.api.query.system.events(events => {
        events.forEach(async record => {
            const {event, phase} = record;
            const types = event.typeDef;
            const eventName = `${event.section}:${event.method}`
            const eventNamePhase = `${event.section}:${event.method}::(phase=${phase.toString()})`;
            console.log(eventName)
            // console.log(eventNamePhase)
            if (eventNameList.includes(eventName)) {
                console.log(event.data.toString())
                let nowTime = await suite.api.query.timestamp.now()
                if (eventName === "dex:Swap") {
                    let eventName = `${event.section}_${event.method}.count`
                    let now = parseInt(new Date().getTime() / 1000);
                    let from = now - 3600 * 12;
                    let num = await queryDataDog(from, now, `${eventName}{*}`)
                    await sendCountLog(eventName, num + 1)
                }
                if (eventName === "cdpEngine:LiquidateUnsafeCDP") {
                    let eventName = `${event.section}_${event.method}.metric`
                    // 清算数量
                    let num = FixedPointNumber.FixedPointNumber.fromInner(JSON.parse(event.data.toString())[3]).toNumber()
                    await sendDataTimeLog(nowTime.toNumber() / 1000, eventName, num)
                }
                if (eventName === "loans:PositionUpdated"){
                    let token = JSON.parse(event.data.toString())[1].Token
                    // let amount = FixedPointNumber.FixedPointNumber.fromInner(JSON.parse(event.data.toString())[2]).toNumber()
                    // console.log(token, amount)

                    let res = await suite.api.query.loans.totalPositions({Token:token})
                    let collateral = FixedPointNumber.FixedPointNumber.fromInner(res.collateral.toString()).toNumber()
                    console.log(collateral)

                    let eventName = `${event.section}_${event.method}_${token}.metric`

                    await sendDataTimeLog(nowTime.toNumber() / 1000, eventName, collateral)
                }
            }
        });
    });
}

// async function main() {
//     let now = parseInt(new Date().getTime() / 1000);
//     let then = now - 3600; // one hour ago
//     let num = await queryDataDog(then, now, "dex_Swap.count{*}")
// }

getEvents(suite)