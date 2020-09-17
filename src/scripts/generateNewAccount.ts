import { createRandomAccount } from "../utils";

export function generateRandomAccount () {
    return createRandomAccount({}, 'sr25519');
}