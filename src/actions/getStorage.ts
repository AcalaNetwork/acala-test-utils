import { Suite } from "../suite";
import { from } from "rxjs";
import { mergeMap, map, reduce } from "rxjs/operators";

export async function getStorage (suite: Suite) {
    const prefixs: string[] = [];

    Object.keys(suite.api.query).map(item => {
        const modules = suite.api.query[item];

        Object.keys(modules).map((key) => {
            prefixs.push(suite.api.query[item][key].keyPrefix());
        })
    });

    const result: Record<string, string> = {};

    return from(prefixs).pipe(
        mergeMap((prefix: string) => {
            return from(suite.api.rpc.state.getPairs(prefix));
        }, 100),
        mergeMap((pair) => {
            return from(pair.map(i => i[0]));
        }),
        mergeMap((i) => {
            return from(suite.api.rpc.state.getStorage(i)).pipe(
                map((value) => ([i.toString(), (value as any).toString()]))
            );
        }),
        reduce((acc, value) => {
            acc[value[0]] = value[1];

            return acc;
        }, result)
    ).toPromise();
}