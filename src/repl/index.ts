import rpel from 'repl';

import { Suite } from '../suite';
import * as actions from '../actions';

async function main () {
    const suite = new Suite();
    const localWS = 'ws://127.0.0.1:9944'
    await suite.connect(localWS);

    const local = rpel.start('acala repl ->');

    // set suite to global
    local.context.suite = suite;

    // set scripts to global
    local.context.actions = actions;
};

main();
