import { Suite } from "../suite";
import { Fixed18 } from "@acala-network/app-util";

interface Config {
    asset: string;
    requiredRatio: number;
    stabilityFee: number;
    liquidationPenalty: number;
    liquidationRatio: number;
    maximunTotalDebitValue: number;
}

const DefaultLoanConfigs: Config[] = [
    {
        asset: 'DOT',
        requiredRatio: 1.2,
        stabilityFee: 0.1 / (365 * 24 * 60 * 60 / 4),
        liquidationPenalty: 0.2,
        liquidationRatio: 1.5,
        maximunTotalDebitValue: 1 * 10 ** 9
    },
    {
        asset: 'LDOT',
        requiredRatio: 1.2,
        stabilityFee: 0.1 / (365 * 24 * 60 * 60 / 4),
        liquidationPenalty: 0.2,
        liquidationRatio: 1.5,
        maximunTotalDebitValue: 1 * 10 ** 9
    },
    {
        asset: 'LDOT',
        requiredRatio: 1.2,
        stabilityFee: 0.1 / (365 * 24 * 60 * 60 / 4),
        liquidationPenalty: 0.2,
        liquidationRatio: 1.5,
        maximunTotalDebitValue: 1 * 10 ** 9
    },
    {
        asset: 'XBTC',
        requiredRatio: 1.2,
        stabilityFee: 0.1 / (365 * 24 * 60 * 60 / 4),
        liquidationPenalty: 0.2,
        liquidationRatio: 1.5,
        maximunTotalDebitValue: 1 * 10 ** 9
    },
    {
        asset: 'RENBTC',
        requiredRatio: 1.2,
        stabilityFee: 0.1 / (365 * 24 * 60 * 60 / 4),
        liquidationPenalty: 0.2,
        liquidationRatio: 1.5,
        maximunTotalDebitValue: 1 * 10 ** 9
    }
]

export function setupLoans (suite: Suite, config: Config[] = DefaultLoanConfigs) {
    return suite.send(
        suite.sudo,
        suite.batchWrapper(config.map((config) => {
            return suite.api.tx.cdpEngine.setCollateralParams(
                config.asset,
                { newValue: Fixed18.fromNatural(config.stabilityFee).innerToString() },
                { newValue: Fixed18.fromNatural(config.liquidationRatio).innerToString() },
                { newValue: Fixed18.fromNatural(config.liquidationPenalty).innerToString() },
                { newValue: Fixed18.fromNatural(config.requiredRatio).innerToString() },
                { newValue: Fixed18.fromNatural(config.maximunTotalDebitValue).innerToString() }
            );
        })).map(suite.sudoWarpper)
    );
}