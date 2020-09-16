import { range } from "lodash";
import { Fixed18 } from "@acala-network/app-util";
import { KeyringPair } from "@polkadot/keyring/types";
import * as utils from "./utils";

import { Suite } from "./suite";
import {
  saveAccountsToCache,
  loadAccountsFromCache,
} from "./utils/importAccount";
import { createRandomAccount } from "./utils";

async function main() {
  const suite = new Suite();

  console.log("start connect to acala");
  await suite.connect("ws://localhost:9944");

  await suite.isReady();

  suite.importSudo("uri", "//Alice");

  let accounts: KeyringPair[];

  accounts = loadAccountsFromCache();

  if (accounts.length === 0) {
    const temp = range(0, 100).map(
      createRandomAccount.bind(undefined, {}, "sr25519")
    );

    saveAccountsToCache(temp.map((i) => i[1]));

    accounts = temp.map((i) => i[0]);
  }

  console.log("load accounts success");

  const updateAcaBalances = suite.batchWrapper(
    accounts.map((account) =>
      suite.api.tx.currencies.updateBalance(
        account.address,
        "ACA",
        Fixed18.fromNatural(10000).innerToString()
      )
    )
  );

  try {
    const result = suite.send(suite.sudo, suite.sudoWarpper(updateAcaBalances));

    await result.isFinalize;
  } catch (e) {
    console.log(e);
  }

  const updateDotBalances = suite.batchWrapper(
    accounts.map((account) =>
      suite.api.tx.currencies.updateBalance(
        account.address,
        "DOT",
        Fixed18.fromNatural(10000).innerToString()
      )
    )
  );

  try {
    const result = suite.send(suite.sudo, suite.sudoWarpper(updateDotBalances));

    await result.isFinalize;
  } catch (e) {
    console.log(e);
  }

  // update position
  await Promise.all(
    accounts.map((account) => {
      const tx = suite.api.tx.honzon.adjustLoan(
        "DOT",
        Fixed18.fromNatural(1).innerToString(),
        "0"
      );

      return suite.send(account, tx).isFinalize;
    })
  );

  console.log("update position success");
}

main();
