type Default = {
    "name": string
    "age": number
    [k: string]: any
}

type Hoge = Default & {"hoge": string}
type Fuga = Default & {"fuga": string}

const arr: (Hoge | Fuga)[] = [
    {"name": "aaa", "age": 23, "hoge": "aaaa"},
    {"name": "aaa", "age": 23, "fuga": "bbbb"}
]

const res1 = arr.filter(e => "hoge" in e)
const res2 = arr.filter(
    (e: Hoge|Fuga): e is Hoge => "hoge" in e
)