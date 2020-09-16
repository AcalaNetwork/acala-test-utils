import fs from 'fs';
import path from 'path';

import { createAccountFromMnemonic } from './createAccount';
import { ensureCacheDir } from './cache';

export function loadAccountsFromCache () {
    const cachePath = ensureCacheDir();

    try {
        const cachedAccount = fs.readFileSync(path.resolve(cachePath, 'accounts.json'), { encoding: 'utf-8' });
        return (JSON.parse(cachedAccount) as string[]).map(createAccountFromMnemonic);
    } catch (e) {
        return []
    }
}

export function saveAccountsToCache (mnemonics: string[]) {
    if (!Array.isArray(mnemonics)) throw new Error('saveAccountsToCache need array params');

    const cachePath = ensureCacheDir();

    fs.writeFileSync(
        path.resolve(cachePath, 'accounts.json'),
        JSON.stringify(mnemonics, undefined, 4),
        { encoding: 'utf-8' }
    );
}