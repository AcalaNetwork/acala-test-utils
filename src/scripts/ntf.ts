import { Suite } from "../suite";
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from "@polkadot/util-crypto";

(async () => {
    const suite = new Suite();
    const localWS = "wss://node-6714447553211260928.rz.onfinality.io/ws"

    await suite.connect(localWS);

    await cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromMnemonic(process.argv[2]);

    console.log(account.address);

    await suite.send(
        account, suite.api.tx.nft.createClass(
            suite.api.createType('CID' as any, 'Mandala Halloween'),
            suite.api.createType('Properties' as any, [])
        )
    );

    console.log('create success');
})();
