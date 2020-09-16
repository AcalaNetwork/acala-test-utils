import { program } from 'commander';

const VERSION = '0.0.1';

program.version(VERSION);

async function run() {
    console.log('test');
}

async function main() {
  program
    .command('run')
    .action(run);
  await program.parseAsync(process.argv);
}

main();