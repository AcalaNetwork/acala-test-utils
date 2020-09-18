import { KeyringPair } from "@polkadot/keyring/types";
import { Fixed18, USDToDebit, convertToFixed18 } from "@acala-network/app-util";

import { Suite } from "../suite";

export async function createLoans(
  suite: Suite,
  account: KeyringPair,
  asset: string,
  deposit: number,
  borrow: number
) {
  const debitExchange = await suite.api.query.cdpEngine.debitExchangeRate(asset);
  const defaultDebitExchange = suite.api.consts.cdpEngine.defaultDebitExchangeRate;

  return suite.send(
    account,
    suite.api.tx.honzon.adjustLoan(
      asset,
      Fixed18.fromNatural(deposit).innerToString(),
      USDToDebit(
        Fixed18.fromNatural(borrow),
        convertToFixed18(debitExchange.isEmpty ? defaultDebitExchange : debitExchange),
        Fixed18.fromNatural(1)
      ).innerToString()
    )
  );
}
