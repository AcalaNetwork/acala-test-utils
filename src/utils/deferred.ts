export class Deferred<T> {
    public promise!: Promise<T>;
    public resolve!: (value?: T | Promise<T>) => void;
    public reject!: (error?: any) => void;

    constructor () {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}