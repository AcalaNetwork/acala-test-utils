import { Fixed18 } from "@acala-network/app-util";

import { Suite } from "../suite";

export function feedPrices(suite: Suite) {
  const prices: Record<string, string> = {
    ACA: Fixed18.fromNatural(20).innerToString(),
    DOT: Fixed18.fromNatural(6).innerToString(),
    XBTC: Fixed18.fromNatural(10000).innerToString(),
    RENBTC: Fixed18.fromNatural(10000).innerToString(),
  };

  return suite.send(
    suite.sudo,
    suite.api.tx.acalaOracle.feedValues(
      Object.keys(prices).map((i) => [i, prices[i]])
    )
  );
}
