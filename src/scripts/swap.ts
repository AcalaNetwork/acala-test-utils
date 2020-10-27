import { Suite } from "../suite";
import { Keyring } from '@polkadot/api';

(async () => {
    const suite = new Suite();
    const localWS = "wss://node-6714447553211260928.rz.onfinality.io/ws"
    await suite.connect(localWS);

    const account = new Keyring({ type: 'sr25519' }).addFromMnemonic('century capable result senior risk repeat behave tape tennis hurt whisper panda');

    console.log('connect success');

    
    const acaausdPool = await suite.api.query.dex.liquidityPool([{ token: 'ACA' }, { token: 'AUSD' }]);

    // @ts-ignore
    console.log(`aca: ${acaausdPool[0].toString()}, ausd: ${acaausdPool[1].toString()}`);

    await suite.send(account, suite.api.tx.dex.swapWithExactTarget([{token: 'ACA' }, { token: 'AUSD' }], '1000000000000000000', '200000000000000000'));

    const newAcaausdPool = await suite.api.query.dex.liquidityPool([{ token: 'ACA' }, { token: 'AUSD' }]);

    // @ts-ignore
    console.log(`aca: ${newAcaausdPool[0].toString()}, ausd: ${newAcaausdPool[1].toString()}`);

})();
