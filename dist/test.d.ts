interface Hoge {
    foo: string;
    bar: number;
    baz: () => string;
    foofoo: () => Promise<number>;
}
declare type Fuga<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
declare type Piyo = Pick<Hoge, Fuga<Hoge, string>>;
declare type HogeHoge = Pick<Hoge, Fuga<Hoge, number>>;
declare type FugaFuga = Pick<Hoge, Fuga<Hoge, Function>>;
declare type PiyoPiyo = Pick<Hoge, Fuga<Hoge, Promise<any>>>;
