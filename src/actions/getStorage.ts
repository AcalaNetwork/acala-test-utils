// @ts-nocheck
import { Suite } from "../suite";
import { from, BehaviorSubject } from "rxjs";
import { mergeMap, map, reduce, filter, of } from "rxjs/operators";

const PAGE_SIZE_KEYS = 1000;

export async function retrieveMapKeys (suite: Suite, headKey: string) {
    let keys: any[] = [];
    let next = true; 
    let startKey;

    while (next) {
        const result = await suite.api.rpc.state.getKeysPaged.apply(this, startKey ? [headKey, PAGE_SIZE_KEYS, startKey] : [headKey, PAGE_SIZE_KEYS]) ;

        if (result) {
            if (result.length === PAGE_SIZE_KEYS) {
                startKey = result[PAGE_SIZE_KEYS - 1].toHex();
            } else {
                next = false;
            }
        }

        keys = keys.concat(result.map(item => item.toHex()));
    }

    return keys;
}


export async function getStorage (suite: Suite, modules?: string[], keys?: string[]) {
    const prefixs: string[] = [];

    const _modules = modules ? modules : Object.keys(suite.api.query);

    _modules.map(item => {
        const module = suite.api.query[item];

        (keys ? keys : Object.keys(module)).map((key) => {
            prefixs.push(suite.api.query[item][key].keyPrefix());
        });
    });

    const result: Record<string, string> = {};

    return from(prefixs).pipe(
        mergeMap((prefix: string) => {
            return from(retrieveMapKeys(suite, prefix)).pipe(
                mergeMap(i => from(i)),
                mergeMap((i) => {
                    console.log(`getting ${i.toString()}`);
                    return from(suite.api.rpc.state.getStorage(i)).pipe(
                        map((value) => ([i.toString(), (value as any).toString()]))
                    );
                }, 100),
            )
        }, 100),
        reduce((acc, value) => {
            if (value[1]) {
                acc[value[0]] = value[1];
            }

            return acc;
        }, result)
    ).toPromise();
}