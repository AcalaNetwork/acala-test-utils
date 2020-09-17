import rpel from 'repl';
import { Suite } from '../suite';
import * as scripts from '../scripts';
import { cryptoIsReady, cryptoWaitReady } from "@polkadot/util-crypto";

async function main () {
    await cryptoWaitReady();

    const suite = new Suite();

    await suite.connect('ws://localhost:9944');

    const local = rpel.start('acala rpel ->');

    // set suite to global
    local.context.suite = suite;

    // set scripts to global
    local.context.helpers = scripts;
};

main();