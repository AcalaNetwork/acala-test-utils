import { Fixed18 } from "@acala-network/app-util";

import { Suite } from "../suite";

type Prices  = Record<string, number>;

export function feedPrices(suite: Suite, prices: Prices = { ACA: 20, DOT: 6, XBTC: 100000, RENBTC: 100000 } ) {
  const _prices = Object.keys(prices).map((key) => {
    return [key, Fixed18.fromNatural(prices[key]).innerToString()];
  });

  return suite.send(
    suite.sudo,
    suite.sudoWarpper(suite.api.tx.acalaOracle.feedValues(_prices))
  );
}
