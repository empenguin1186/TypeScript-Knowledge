declare type Default = {
    "name": string;
    "age": number;
    [k: string]: any;
};
declare type Hoge = Default & {
    "hoge": string;
};
declare type Fuga = Default & {
    "fuga": string;
};
declare const arr: (Hoge | Fuga)[];
declare const res1: (Hoge | Fuga)[];
declare const res2: Hoge[];
