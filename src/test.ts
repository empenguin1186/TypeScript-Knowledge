interface Hoge {
    foo: string
    bar: number
    baz: () => string
    foofoo: () => Promise<number>
}

type Fuga<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

type Piyo = Pick<Hoge, Fuga<Hoge, string>>
type HogeHoge = Pick<Hoge, Fuga<Hoge, number>>
type FugaFuga = Pick<Hoge, Fuga<Hoge, Function>>
type PiyoPiyo = Pick<Hoge, Fuga<Hoge, Promise<any>>>