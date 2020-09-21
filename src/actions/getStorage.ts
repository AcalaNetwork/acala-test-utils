import { Suite } from "../suite";
import { from } from "rxjs";
import { mergeMap, map, reduce } from "rxjs/operators";

export async function getStorage (suite: Suite, modules?: string[]) {
    const prefixs: string[] = [];

    const _modules = modules ? modules : Object.keys(suite.api.query);

   _modules.map(item => {
        const module = suite.api.query[item];

        Object.keys(module).map((key) => {
            prefixs.push(suite.api.query[item][key].keyPrefix());
        });
    });

    const result: Record<string, string> = {};

    return from(prefixs).pipe(
        mergeMap((prefix: string) => {
            return from(suite.api.rpc.state.getPairs(prefix)).pipe(
                mergeMap((pair) => {
                    console.log(pair.length);
                    return from(pair.map(i => i[0]));
                }),
                mergeMap((i) => {
                    console.log(`getting ${i.toString()}`);
                    return from(suite.api.rpc.state.getStorage(i)).pipe(
                        map((value) => ([i.toString(), (value as any).toString()]))
                    );
                }, 100),
            )
        }, 100),
        reduce((acc, value) => {
            acc[value[0]] = value[1];

            return acc;
        }, result)
    ).toPromise();
}