import rpel from 'repl';

import { Suite } from '../suite';
import * as actions from '../actions';

async function main () {
    const suite = new Suite();

    await suite.connect('ws://localhost:9944');

    const local = rpel.start('acala repl ->');

    // set suite to global
    local.context.suite = suite;

    // set scripts to global
    local.context.actions = actions;
};

main();