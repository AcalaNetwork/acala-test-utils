import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import { chunk } from "lodash";
import { options } from "@acala-network/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { cryptoIsReady } from "@polkadot/util-crypto";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ITuple } from "@polkadot/types/types";
import { DispatchError } from "@polkadot/types/interfaces";

import { Deferred } from "./utils/deferred";

type KeyringPairType = "mnemonic" | "seed" | "uri";

export class Suite {
  public api!: ApiPromise;
  public sudo: KeyringPair;
  private maxBatchTxNum = 100;

  constructor() {
    // use alice for the default sudo account
    this.importSudo("uri", "//Alice");

    this.sudoWarpper = this.sudoWarpper.bind(this);
    this.batchWrapper = this.batchWrapper.bind(this);
    this.send = this.send.bind(this);
  }
  // config
  setMaxBatchTxNum(value: number) {
    this.maxBatchTxNum = value;
  }

  async connect(endpoint: string) {
    await cryptoIsReady();

    const provider = new WsProvider(endpoint);
    this.api = await ApiPromise.create(options({ provider }));
    this.log("connect to acala");
  }

  async isReady() {
    return this.api.isReady;
  }

  private async waitConncetedWrapper(fn: any) {
    await this.api.connect;

    return fn;
  }

  async importSudo(type: KeyringPairType, data: string) {
    const fnMap: Record<KeyringPairType, string> = {
      mnemonic: "addFromMnemonic",
      seed: "addFromSeed",
      uri: "addFromUri",
    };

    if (!Object.keys(fnMap).includes(type)) {
      console.error(`importSudo error: con't found ${type}`);
    }

    const keyring = new Keyring({ type: "sr25519" });

    this.sudo = (keyring as any)[fnMap[type]](data);
  }

  sudoWarpper(
    tx: SubmittableExtrinsic<"promise">
  ): SubmittableExtrinsic<"promise"> {
    return this.api.tx.sudo.sudo(tx as SubmittableExtrinsic<"promise">);
  }

  batchWrapper(
    txs: SubmittableExtrinsic<"promise">[]
  ): SubmittableExtrinsic<"promise">[] {
    if (txs.length <= this.maxBatchTxNum) {
      return [this.api.tx.utility.batch(txs)];
    }

    return chunk(txs, this.maxBatchTxNum).map(
      (data) => this.batchWrapper(data)[0] as SubmittableExtrinsic<"promise">
    );
  }

  send(
    account: KeyringPair,
    tx: SubmittableExtrinsic<"promise">[]
  ): Promise<boolean>;
  send(
    account: KeyringPair,
    tx: SubmittableExtrinsic<"promise">
  ): Promise<boolean>;

  send(
    account: KeyringPair,
    tx: SubmittableExtrinsic<"promise"> | SubmittableExtrinsic<"promise">[]
  ): Promise<boolean> {
    if (Array.isArray(tx)) {
      return (async () => {
        for (const i of tx) {
          const temp = this.singleSend(account, i);

          await temp;
        }

        return true;
      })();
    }

    return this.singleSend(account, tx as SubmittableExtrinsic<"promise">);
  }

  singleSend(
    account: KeyringPair,
    tx: SubmittableExtrinsic<"promise">
  ): Promise<boolean> {
    const isFinalize = new Deferred<boolean>();

    tx.signAndSend(account, (result) => {
      if (result.isFinalized) {
        isFinalize.resolve(true);
      }

      if (result.isError) {
        const errorEvent = result.events
          .filter((event) => !event)
          .filter(({ event: { data, section, method } }) => {
            return section === "system" && method === "ExtrinsicFailed";
          });

        let errorMsg = "";
        if (errorEvent.length) {
          const [dispatchError] = (errorEvent[0].event
            .data as unknown) as ITuple<[DispatchError]>;

          if (dispatchError.isModule) {
            try {
              const mod = dispatchError.asModule;
              const error = this.api.registry.findMetaError(
                new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
              );

              errorMsg = `${error.section}.${error.name}`;
            } catch (error) {
              errorMsg = "unkonwn error";
            }
          } else {
            errorMsg = "unkonwn error";
          }
        }

        isFinalize.reject(errorMsg);
      }
    });

    return isFinalize.promise;
  }

  log(content: string) {
    console.log(content);
  }
}
