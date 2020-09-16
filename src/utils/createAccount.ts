import { mnemonicGenerate } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { KeypairType } from '@polkadot/util-crypto/types';
import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';

// create random account
export function createRandomAccount (meta: KeyringPair$Meta = {}, type?: KeypairType): [KeyringPair, string] {
    const mnemonic = mnemonicGenerate();
    const keyring = new Keyring();

    const account = keyring.addFromMnemonic(mnemonic, meta, type);

    return [account, mnemonic];
};

export function createAccountFromMnemonic (mnemonic: string) {
    const keyring = new Keyring();

    return keyring.addFromMnemonic(mnemonic);
}