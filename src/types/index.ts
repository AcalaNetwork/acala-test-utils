import { SubmittableExtrinsic } from "@polkadot/api/types";

export type TokenPair = Record<string, number>;

export type SendResult = Record<'isInBlock' | 'isFinalize', Promise<boolean>>;

export type SendParams = SubmittableExtrinsic<'promise'> | SubmittableExtrinsic<'promise'>;