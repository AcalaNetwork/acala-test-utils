import { WsProvider, ApiPromise, Keyring } from '@polkadot/api';
import { options } from '@acala-network/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoIsReady } from '@polkadot/util-crypto';
import { SubmittableExtrinsic } from '@polkadot/api/types';

type KeyringPairType = 'mnemonic' | 'seed' | 'uri';

export class Suite {
    public api!: ApiPromise;
    public sudo!: KeyringPair;

    async connect (endpoint: string) {
        await cryptoIsReady();

        const provider = new WsProvider(endpoint);
        this.api = await ApiPromise.create(options({ provider }));
        this.log('connect to acala');
    }

    async isReady () {
        return this.api.isReady;
    }

    private async waitConncetedWrapper (fn: any) {
        await this.api.connect;

        return fn;
    }

    async importSudo (type: KeyringPairType, data: string) {
        const fnMap: Record<KeyringPairType, string> = {
            'mnemonic': 'addFromMnemonic',
            'seed': 'addFromSeed',
            'uri': 'addFromUri'
        };

        if (!Object.keys(fnMap).includes(type)) {
            console.error(`importSudo error: con't found ${type}`);
        }

        const keyring = new Keyring({ type: 'sr25519' });

        this.sudo = (keyring as any)[fnMap[type]](data);
    }

    sudoWarpper (tx: SubmittableExtrinsic<'promise'>): SubmittableExtrinsic<'promise'> {
        return this.api.tx.sudo.sudo(tx);
    }

    batchWrapper (txs: SubmittableExtrinsic<'promise'>[]) {
        return this.api.tx.utility.batch(txs);
    }

    send (account: KeyringPair, tx: SubmittableExtrinsic<'promise'>): Record<'isInBlock' | 'isFinalize' | 'isError', Promise<boolean>> {
        const isInBlock = Promise
        const isFinalize = Promise
        const isError = Promise

        tx.signAndSend(account, (result) => {
            if (result.isInBlock) {
                isInBlock.resolve(true);
            }

            if (result.isFinalized) {
                isFinalize.resolve(true);
            }

            if (result.isError) {
                isError.resolve(true);
            }
        }).catch((e) => {
            throw e;
        });

        return {
            isInBlock: isInBlock as any as Promise<boolean>,
            isFinalize: isFinalize as any as Promise<boolean>,
            isError: isError as any as Promise<boolean>
        };
    }

    log (content: string) {
        console.log(content);
    }
}