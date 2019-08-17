# 開発環境と設定

## ts.config について

### 生成コマンド
```Shell
tsc --init
```

生成された `ts.config` の内容は以下の通り
```JSON
{
  "compilerOptions": {
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "strict": true,                           /* Enable all strict type-checking options. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
  }
}
```

### ts.config の内容
"strict"フィールドを`true`にするとコンパイル時に厳密な型チェックが行われる

`"strict": true` と以下の設定は同等
```JSON
"noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
"strictNullChecks": true,              /* Enable strict null checks. */
"strictFunctionTypes": true,           /* Enable strict checking of function types. */
"strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
"strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
"noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
"alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */
```

型チェックの厳密性を緩めたいときはこれらの個別の値を`false`にすることで可能となる。例えば、`"noImplicitAny": false` とすると`Any`型に関しては指定することなくコンパイルが成功する。  

以下のコードは最初に`nullable`に`null`を代入している。このときnullableの型は null 型と推論されるので、続けて string 型を代入しようとすると型チェックに引っかかりエラーとなる。エラーを防ぐには`ts.config`に`"strictNullChecks": false`を追加する  

```typescript
export function test() {
    let nullable = null
    nullable = 'string'
    return 'test'
}
```

### 出力先を指定するには

`src`ディレクトリにTSのコードを配置して、新しく作成する`dist`ディレクトリにコンパイルで生成されたJSコードを配置するように設定してみる

```Shell
.
├── README.md
├── src
│   ├── sample.ts
│   └── test.ts
├── test.js
└── tsconfig.json
```

出力先を指定するには`ts.config`を編集する

```JSON
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist", // 出力先の設定
  },
  "include": [
    "src/**/*"  // コンパイル対象となるコードが存在するディレクトリ
  ]
}
```

`tsc`コマンドを実行すると新しく`dist`ディレクトリが生成され、JSコードが存在している。
```Shell
$ tsc
$ tree
.
├── README.md
├── dist
│   ├── sample.js
│   └── test.js
├── src
│   ├── sample.ts
│   └── test.ts
└── tsconfig.json
```

### 型宣言ファイル(.d.ts)の出力

`test.ts`の型宣言ファイル(.d.ts)を作成する
```TypeScript
export function test1() {
    return 'test1'
}

export function test2() {
    return { value: 'test2' }
}
```

tsconfig.json の`compilerOptions.declaration`を`true`にすると型宣言ファイルが出力される
```JSON
{
  "compilerOptions": {
    "declaration": true,
    ...
  }
}
```

作成された`test.d.ts`は以下の通り
```TypeScript
export declare function test1(): string;
export declare function test2(): {
    value: string;
};
```

### JavaScript ファイルをビルドに含む

JavaScript ファイルをビルドに含みたい場合は tsconfig.json を以下のように設定する
```JSON
{
  "compilerOptions": {
    ...
    "allowJs": true,                       /* Allow javascript files to be compiled. */
    "checkJs": true,                       /* Report errors in .js files. */
    ...
```

ここで気をつけたいのが、`declaration`を true にしていると以下のようなメッセージが出力され、ビルドが失敗する。

```shell
Option 'allowJs' cannot be specified with option 'declaration'.
```
おそらくこれはJSファイルをTSにインポートすると型推論ができなくなるためであると考えられる。
なので`allowJS`と`checkJS`は基本的に無効で問題ない。既存のプロダクトをTSに移行したいときはこれらを有効にする

sample.js
```JS
export let sampleText = 'sampleText'
export function sampleFunction() {
    return true
}
```

test.ts
```TypeScript
import { sampleText, sampleFunction } from './sample'
const a = sampleFunction()
const b = sampleText
```

### ライブラリの型定義を利用する
npm でライブラリをインストールしたときに型定義が存在しないライブラリが存在する。ライブラリによっては[DefinitelyTyped](https://definitelytyped.org/) で配信されているものもある。

各ライブラリをコンパイル対象にするかどうかの設定は２種類存在し、 tsconfig.json で以下のように定義する。

```JSON
{
  "compilerOptions": {
    "typeRoots": ["./hoge"], // hoge ディレクトリ以下に含まれるパッケージのみを対象とする
    "types": ["node", "lodash"], // ./node_modules/@types/node, ./node_modules/@types/lodash を対象とする
    ...
```
ちなみにデフォルトでは node_modules/@types に含まれる全パッケージがコンパイル対象となる

### Build Mode
ビルド時に参照する tsconfig.json を指定することが可能

カレントディレクトリの tsconfig.json を参照
```
tsc -b
```

src/tsconfig.json の tsconfig.json を参照
```
tsc -b src 
```

src/tsconfig.client.json を参照
```
tsc -b src/tsconfig.client.json
```

## tsconfig.json　詳細

| プロパティ | 概要 |
|----------|------|
| exclude | ビルド対象から除外するファイルを指定する |
| include | ビルド対象に含めるファイルを指定する。exclude よりかは弱い設定 |
| files | ビルド対象に含めるファイルを指定する。exclude よりかは強い設定 |
| extends | 継承する設定ファイルを指定する |
| references | 参照するプロジェクトを指定する |
| compilerOptions | ビルドに関する設定を記述 | 

### include, exclude, files について

例として`node_modules`と`src`ディレクトリ配下をビルド対象にするが、`.test.ts`という命名規則が成り立っているファイルに関してはビルド対象としない場合は以下のように設定する

```JSON
{
  "include" : [
    "node_modules",
    "src/**/*"
  ],
  "exclude" : [
    "**/*.test.ts"
  ]
}
```

ファイル指定時に使用する特殊文字の意味は以下の通り

| 文字の種類 | 意味 |
|:----------:|------|
| * | 0文字以上の文字に一致する(ディレクトリ区切り文字を除く) |
| ** | 任意のディレクトリに再帰的に一致する |
| ? | 任意の1文字に一致する(ディレクトリ区切り文字を除く) |

### extends について

継承のスコープとしてはトップレベルフィールド単位ではなく各フィールド単位となる。例えば継承元の tsconfig で `allowJs` が `true` になっていたら継承先の tsconfig で `allowJs`の値を書き換えない限り継承元の値である `true` が適用される

# TypeScript の基礎

## 意図しない NaN (Not-a-Number)を防ぐ
JS はメソッドの引数の型チェックを行わないので意図しない型のデータが引数として渡され結果 NaN が返ってくる可能性があった。TS ではそれを防ぐためにメソッド宣言時に型を指定することができる

## 基本の型

### [Tips] let と var と const の違い
| 修飾子 | 値の再代入 | スコープを分けることかできるか |
|:------:|:------:|:------:|
| var | 可能 | 不可能 |
| let | 可能 | 可能 |
| const | 不可能 | 可能 |

```ts
var a = 'a'
let b = 'b'
const c = 'c'

// 変数のスコープを分けることはできるか
if (a === 'a') {
    var a = 'A'
    let b = 'B'
    const c = 'C'
    console.log(a) // A
    console.log(b) // B
    console.log(c) // C
}

console.log(a) // A
console.log(b) // b
console.log(c) // c

// 値の再代入はできるか
a = 'AA'
b = 'BB'
console.log(a) // AA
console.log(b) // BB
// c = 'CC' [Error] Cannot assign to 'c' because it is a constant.
```

### number

`number`型は 10, 16, 2, 8進数をサポート
```ts
let decimal: number = 255;
let hex: number = 0xfff;
let binary: number = 0b0000;
let octal: number = 0o123;
```

### string

バッククォートで囲むことで他の変数の値を使用できる
```ts
let color = "red";
color = 'green';
let myColor: string = `my hear is ${color}`
console.log(myColor) // my hear is green
```

### array

2つの記法がある
```ts
let array1: number[] = [1, 2, 3]
let array2: Array<number> = [1, 2, 3]
```

### tuple

変数のセットを表す。例えば、`number`と`string`の変数をセットに持ちたい場合は以下のように記述する
```ts
let hoge: [string, number];

// 変数をセットする場合順番には気をつける
hoge = ["string", 10]; // OK
hoge = [10, "string"] // [Error] Type 'string' is not assignable to type 'number'.

// 既知のインデックスにアクセスすると宣言時に指定された型で使用できる
let fuga: string;
fuga = hoge[0].substr(1); // OK
fuga = hoge[1].substr(1); // [Error] Property 'substr' does not exist on type 'number'.
```

既知のインデックス以外にアクセスするとデータ型は宣言時に指定された全ての型(今回は number と string)を合わせたもの(Union Types)となる ... はずだが以下のコードをコンパイルしようとしたらエラーが発生した

```ts
let hoge: [string, number];

// 変数をセットする場合順番には気をつける
hoge = ["string", 10]; // OK
hoge = [10, "string"] // [Error] Type 'string' is not assignable to type 'number'.
hoge[3] = "aaaaaa";
console.log(hoge[7].toString());
// hoge[4] = true;
```

```shell
tsc
src/test.ts:14:1 - error TS2322: Type '"global"' is not assignable to type 'undefined'.

14 hoge[3] = "global";
   ~~~~~~~

src/test.ts:14:6 - error TS2493: Tuple type '[string, number]' of length '2' has no element at index '3'.

14 hoge[3] = "global";
        ~

src/test.ts:15:13 - error TS2532: Object is possibly 'undefined'.

15 console.log(hoge[7].toString());
               ~~~~~~~

src/test.ts:15:18 - error TS2493: Tuple type '[string, number]' of length '2' has no element at index '7'.

15 console.log(hoge[7].toString());
                    ~


Found 4 errors.

╭ ─ ○  kodaira@MBP-15JAS-323(2019/08/01 08:56:09):~/Desktop/ts-knowledge (master)
╰ ─ ○  tsc
src/test.ts:14:1 - error TS2322: Type '"aaaaaa"' is not assignable to type 'undefined'.

14 hoge[3] = "aaaaaa";
   ~~~~~~~

src/test.ts:14:6 - error TS2493: Tuple type '[string, number]' of length '2' has no element at index '3'.

14 hoge[3] = "aaaaaa";
        ~

src/test.ts:15:13 - error TS2532: Object is possibly 'undefined'.

15 console.log(hoge[7].toString());
               ~~~~~~~

src/test.ts:15:18 - error TS2493: Tuple type '[string, number]' of length '2' has no element at index '7'.

15 console.log(hoge[7].toString());
                    ~


Found 4 errors.
```

### any
データの型が不明な場合に使用できるが、TS の恩恵を受けられないのでできるかぎり使用しないのが望ましい

```ts
let hoge: any = 0;
hoge = "fuga";
hoge = false;
```

### unknown

`any` と異なる点としては値の利用について厳密であり、`any` だとコンパイルが通るようなコード(ランタイムエラーは発生する)でも `unknown` で定義するとコンパイルエラーが発生する
```ts
const a: number[] = ['1'] // [Compile Error] Type 'string' is not assignable to type 'number'.
const b: any[] = ['1'] // OK
const c: unknown[] = ['1'] // OK

a[0].toFixed(1) // OK 
b[0].toFixed(1) // [Runtime Error] b[0].toFixed is not a function
c[0].toFixed(1) // [Compile Error] Object is of type 'unknown'.
```

### void
`void` が付与された変数は `undefined` か `null` しか代入することができない

### null / undefined
`null` と `undefined` は全ての型のサブタイプであり、あらゆる変数に代入することが可能である。
しかし、tsconfig.json で `"strictNullChecks": true` を指定すると `null` および `undefined` は `void` もしくは `null` は null 型, undefined は undefined型 にしか代入することができなくなる 

### never
発生し得ないデータ型を表す. 戻り値を得られないメソッドを定義する場合はこの型を使用する
```ts
function throwError(msg: string): never {
  throw new Error(msg);
}
```
void と何が違うのか?
https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a

### object
非プリミティブ型を表す型。プリミティブ型は `number`, `string`, `boolean`, `symbol`, `null`, `undefined` の6つ

```ts
let hoge: {}
let fuga: object

// 括弧を使って({}) を使って object 型を指定することもできるが、その場合プリミティブ型を代入してもエラーが発生しない
hoge = true // OK
hoge = 0 // OK

fuga = false // [Error] Type 'false' is not assignable to type 'object'.
fuga = 1 // [Error] Type '1' is not assignable to type 'object'.
```

## 高度な型

### Intersection Types

`&` で複数の Type を統合することができる
```ts
type Horse = {
    tail: Tail
    run: () => void
}

type Bird = {
    wing: Wing
    fly: () => void
}

type Pegasus = Horse & Bird
```

プリミティブ型も Intersection Types で統合することができるが、その時の型は全て `never` となる

### Union Types

複数の型のうちどれか1つであるということを示すために `Union Types` を使用する
```ts
let hoge: boolean | string
let fuga: (number | string)[] // array型も可能
let piyo: string | null // 応用して null 許容型も作成可能

hoge = true // OK
hoge = 'hello' // OK

console.log(hoge)
```

### Literal Types

ここでは `String Literal` を例に挙げる
```ts
let hoge: "ONE"

hoge = "ONE" // OK
hoge.toLowerCase() // String Literal Types は string のサブタイプであるのでメソッドを流用できる

let fuga: "ONE" | "TWO" | "THREE" // 複数指定も可能
fuga = "ONE"
fuga = "THREE"
```

この他にも `Numeric Literal Types`, `Boolean Literal Types` が存在するが、使い方としては一緒

## typeof, keyof

### typeof

定義済みの型を取得する時には`typeof`を使用する
```ts
let hoge: string = "a"
let fuga: typeof hoge // 型推論のタイミングでのみ使用可
fuga = "b"
console.log(fuga)
```

### keyof

プロパティの名称を取得するのに使用する
```ts
type Hoge = {
    foo: string
    bar: string
    baz: string
}

let key: keyof Hoge // String Literal Types で定義可能
key = "baz"

const Fuga = {
    0: 0,
    1: 1
}

let keyNumber: keyof typeof Fuga // String Literal Types 以外で定義したい場合は typeof と併用する
keyNumber = 1
```

### アサーションによるダウンキャスト

ダウンキャストを行う場合は以下のように記述
```ts
let hoge: any = "hello"

let fuga: number = (<string>hoge).length // <type>変数 でダウンキャスト可能
let piyo: number = (hoge as string).length // 変数 as 型 でダウンキャスト可能 

console.log(fuga)
console.log(piyo)
```

### クラスについて
すでに知っている内容だったので省略

### Enum について
すでに知っている内容だったので省略

# 型推論

## const/let の型推論

ここで改めて var, let, const の違いについて触れておく

| 修飾子 | 値の再代入 | スコープを分けることかできるか |
|:------:|:------:|:------:|
| var | 可能 | 不可能 |
| let | 可能 | 可能 |
| const | 不可能 | 可能 |

let, var は値の再代入が可能であるので型推論の結果は最初に代入された値の型となる。しかし const は値の再代入が不可能なので、型推論の結果は Literal Types となる

```ts
let hoge = "string" // string 型
var fuga = 1 // number 型
const piyo = "hello" // "hello"型
```

### Widening Literal Types
const で型推論された結果 Literal Types となったものは `Widening Literal Types` と呼ばれ、別の値から参照すると Literal Types ではなくなる

```ts
const hoge = "hello" // "hello" 型
let fuga = hoge // string 型となる
```
したがって Literal Types を使い回す場合は厳格な型指定が必要である

## Array / Tupple の型推論

### Array の型推論

Arrayに含める変数の型を固定したい場合は`as`を使用する

```ts
let hoge = [0 as 0, 1 as 1];

hoge.push(0);
// hoge.push(2); [Compile Error] Argument of type '2' is not assignable to parameter of type '0 | 1'.

const fuga: 0 = 0
const piyo: 1 = 1

const array = [fuga, piyo]

array.push(1)
// array.push(2) [Compile Error] Argument of type '2' is not assignable to parameter of type '0 | 1'.
```

Array型の型推論で各インデックスの型が`string`であった場合には以下のような関数を使用することができる
```ts
let hoge = ["foo", "bar", "baz"]

let fuga = hoge.map(item => item.toUpperCase())
console.log(fuga)

let piyo = hoge.reduce((prev, next) => `${prev} ${next}`)
console.log(piyo)
```

### Tuppleの型推論

```ts
let hoge = [false, 1] as [boolean, number]
let fuga = [1, true, 'foo'] as [number, boolean, string]

const v1 = fuga[0]
const v2 = fuga[1]
// 範囲外の要素は参照できず CE となる
// const v3 = fuga[3] Compile Error] Tuple type '[number, boolean, string]' of length '3' has no element at index '3'.

// 要素の追加は可能 (型は最初に定義されたものに限定される。fugaは(number | boolean | string)のUnionTypesしか追加できない)
fuga.push(1)
fuga.push('bar')
// fuga.push([1,2]) [Compile Error] Argument of type 'number[]' is not assignable to parameter of type 'string | number | boolean'.
// Type 'number[]' is not assignable to type 'string'.
```

## Objectの型推論
省略

## 関数の返り値の推論

関数の返り値についても型推論が可能
```ts
// 型推論使用
function hoge(value1: number, value2: number) {
    return `${value1 * value2}`
}

// 関数定義の際に返り値の型も定義
function fuga(value1: number, value2: number): string {
    return `${value1 * value2}`
}

console.log(hoge(3,2))
console.log(fuga(3,2))
```

返り値の型が複数存在する場合は`Union Types` が使用される
```ts
// (number | null) 型が推論される
function checkNull(value: number) {
    if (value < 0 || value > 100) return null
    return value
}

// 特定の値しか返さない関数に関しては Literal Union Types が推論される
function retrunResponse(value: ("A" | "B" | "C")) {
    switch(value) {
        case "A":
            return "Yes"
        case "B":
            return "No"
        default:
            return "So, So"
    }
}
```

型定義ファイルの出力は以下の通り
```ts
declare function checkNull(value: number): number | null;
declare function retrunResponse(value: ("A" | "B" | "C")): "Yes" | "No" | "So, So";
```

## Promise の型定義 (要復習)

非同期処理を行う `Promise`に関しては何も設定していないと型定義は`Promise<unknown>`となるが、関数宣言時に厳密な型定義が可能である
```ts

// 例１
function setTimer(time: number): Promise<string> {
    return new Promise(resolve => {
        setTimeout(()=> resolve(`${time}ms taken`), time)
    })
}

/*　例2
function setTimer(time: number): Promise<string> {
    return new Promise<string>(resolve => {
        setTimeout(()=> resolve(`${time}ms taken`), time)
    })
}
*/

function hoge(value: number): void {
    console.log("hoge")
}

// await で使用した場合も型定義が受け継がれる
async function fuga() {
    const foo = await setTimer(1000)
    return foo
}

setTimer(1000).then(console.log)
// setTimer(1000).then(res => hoge(res)) [Comile Error] Argument of type 'string' is not assignable to parameter of type 'number'.
fuga()
```

型定義ファイル
```ts
declare function setTimer(time: number): Promise<string>;
declare function hoge(value: number): void;
declare function fuga(): Promise<string>;
```

### [Todo] Promise関数の概要について学ぶ

### [Tips] await/async
`async`はJSで非同期処理を行う機能であり、`await`は`async`関数内で使用する、一部の処理が終わるまで以降の処理を行わないようにするための機能である。  
[async/await 入門（JavaScript） - Qiita](https://qiita.com/soarflat/items/1a9613e023200bbebcb3)  
[JavaScriptは如何にしてAsync/Awaitを獲得したのか Qiita版 - Qiita](https://web.archive.org/web/20170905115052/http://qiita.com/gaogao_9/items/5417d01b4641357900c7)  

```ts
function hoge<T>(value: T): Promise<T> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, 1000);
    })
}

async function fuga(): Promise<string> {
    return `${await hoge("foo")}  ${await hoge("bar")}  ${await hoge("baz")}`
}

async function piyo(): Promise<number> {
    return await hoge(10) * await hoge(20) + await hoge(5)
}

fuga().then(console.log)
piyo().then(console.log)
```

実行結果
```shell
205
foo  bar  baz
```

## import 構文の型推論
`import`　については`import`先のファイルで再度型推論が行われる。

## dynamic import
`dynamic import` とは JS で使用できるモジュールを関数のように読み込める機能のことである。従来の`import` はコードのトップレベルでしか使用できなかったが、`dynamic import`は任意のタイミングで`import`が可能である。これにより、FEでは必要なモジュールのみを読み込んでおき、必要に応じて追加のモジュールを読み込むことが可能となり、ページの初期表示時の処理負荷を軽減できる。  

実装例
```ts
import('./sample').then(module => {
    const user = new module.User("Tom")
    user.hoge()
})

// オブジェクト単位のインポートも可能
import('./sample').then(( {User} ) => {
    const user = new User("Bob")
    user.hoge()
})
```

【参考文献】：[Chrome、Safari、Firefoxで使えるJavaScriptのdynamic import（動的読み込み） - Qiita](https://qiita.com/tonkotsuboy_com/items/f672de5fdd402be6f065)

## JSON の型推論

TSではJSONファイルを外部モジュールとしてインポートし、定義内容を型推論することが可能。この機能を有効にするには`tsconfig.json`の以下のフィールドを`true`にする

```JSON
...
"compilerOptions": {
  ...
  "esModuleInterop": true,
  "resolveJsonModule": true,
  ...
}
```

JSONファイルの内容を型推論する方法は以下の通り
user.json
```JSON
{
    "user_name": "hoge",
    "age": 24,
    "array": [
        "foo",
        "bar",
        "baz"
    ],
    "isMale": true
}
```

```ts
import UserJson from './user.json'
type Hoge = typeof UserJson
```

# TypeScript の型安全

## 制約による型安全 

### Nullable 型

関数の引数にnullが代入されることを許容する場合は以下のように記述することで、事前にエラーを検知できる
```ts
function getFormattedValue(value: number|null): string {
    if (value === null) return '---pt'
    return `${value.toFixed(1)} pt` // 上のif文によりvalueがnullである可能性は0であるため、CEは発生しない
}
console.log(getFormattedValue(null))
```

### Optional型
知っているので省略  
関数の引数の付与を任意にできる機能。これを使用すると自動的に`undefined`とのUnionTypesとなる

### デフォルト値
知っているので省略  
関数の引数にデフォルト値をつけることができる。デフォルト値を設定している引数はOptionalにしている場合は`undefined`は付与されない

### オブジェクトの型安全
省略

### 読み込み専用プロパティ

3種類の方法によってクラスのプロパティを読み込み専用にすることが可能
```ts
type User = {
    readonly age: number
    name: string
}

const hoge: User = {
    age: 24,
    name: "Taro"
}

// インスタンスの全てのプロパティを read-only にする
const fuga: Readonly<User> = {
    age: 32,
    name: "Bob"
}

console.log(hoge.age)
// hoge.age = 24 [CE] Cannot assign to 'age' because it is a read-only property.

// fuga.name = "Alice" [CE] Cannot assign to 'age' because it is a read-only property.

// Object.freeze による read-only 処理
const piyo = Object.freeze(hoge)
// piyo.age = 34
// piyo.name = "Tom"
```

## 抽象度による型安全

### アップキャスト・ダウンキャスト

ダウンキャスト(抽象型 -> 詳細型)したい場合はアサーションを使用する
```ts
const hoge = {
    foo: "aaaa" as "aaaa"
    bar: "bbbb" as "bbbb"
}
```

アップキャスト(詳細型 -> 抽象型)を使用する場合は型推論に頼った方がいい場合もある

### オブジェクトに新しいプロパティを追加する

あるオブジェクトに対して動的にプロパティを追加したい場合は**インデックスシグネチャ**を使用する
```ts
type Hoge = {
    foo: string
    [key: string]: number|string // インデックスシグネチャ
}

const fuga: Hoge = {
    foo: "Bob",
    bar: 24
}
```
この時注意したいのがインデックスシグネチャの型はトップレベルプロパティと互換性を持っていなければならない。

```ts
type Literal = 'one' | 'two' | 'few' | 'entirely'

type Hoge = {
    foo: string
    bar: { [k: string]: Literal | undefined }
}

const foo: Hoge = {
    foo: "aaa",
    bar: {
        aaa: "one",
        bbb: 'two'
    }
}

const x = foo.bar['aaa']
const y = foo.bar['ccc']
```
インデックスシグネチャの型をundefinedとのUnionTypesとすることで存在しないプロパティにアクセスした場合でもコンパイル時にundefined型が推論される  

また、プロパティ名も String Literal を使用して制限することが可能
```ts
type Property = "p1" | "p2" | "p3"
type Value =  'one' | 'two' | 'few' | 'entirely'

type Hoge = {
    foo: string
    bar: { [K in Property]? : Value } 
}

const foo: Hoge = {
    foo: "aaa",
    bar: {
        p1: "one",
        p2: "two"
    }
}

const x = foo.bar['p1']
```

ただしこの機能は`tsconfig.json`の以下のフィールドを`true`にしておく必要がある
```JSON
"compilerOptions": {
    "strict": true, 
    "noImplicitAny": true, 
}
```

インスタンスのメンバを関数のみやPromiseのみ制限することも可能
```ts
interface Fs {
    [k: string]: Function
}

const hoge: Fs = {
    foo: () => "foo",
    bar: async () => {}
}

interface Promises {
    [k: string]: () => Promise<any>
}

const fuga: Promises = {
    foo: async () => {}
}
``` 

### const assertion

const によってアサーションの部分を簡略化できる
```ts
// 省略しない記法
const tuple1 = [true, "foo"] as [true, "foo"]

// 省略された記法
const tuple1 = [true, "foo"] as const
```

### Widening Literal Types 抑止

`as const`を使用すると**Widening Literal Typesを無効化**することが可能

```ts
const hoge = "A" as const
let fuga = hoge // declare let fuga: "A";

function piyo() {
    return "piyo" as const
}

function hogehoge() {
    return "hogehoge"
}

let foo = piyo() // declare let foo: "piyo";
let bar = hogehoge() // declare let bar: string;
```

### 危険な型の付与

戻り値の型を緩いものにしてしまうと予期しないバグが発生する可能性があるので、その場合は型推論に任せた方が良い。以下の例は実行時例外が発生するケースである

```ts
function hoge(): any {
    console.log("hoge")
}

let message: string = hoge()
console.log(message.toLowerCase()) // TypeError: Cannot read property 'toLowerCase' of undefined
```

これは関数の戻り値が`any`としていたために発生した事象である。したがって適切な型を指定するか、TSの型推論に任せるかすることでコンパイル時にエラーに気づくことができる

```ts
function hoge() {
    console.log("hoge")
}

let message: string = hoge() // Type 'void' is not assignable to type 'string'.ts(2322)

console.log(message.toLowerCase())
```

### Non-null assertion

`!`修飾子を使用することで変数の`null`や`undefined`である可能性を排除することができるが、当然実行時例外が投げられることがある。
```ts
function hoge(name?: string) {
    console.log(`Hello ${name!.toUpperCase()}`)
}
hoge() // TypeError: Cannot read property 'toUpperCase' of undefined
```

### double assertion

number -> any -> string とキャストを行うことであたかも number 型の変数で string 型で定義されているメソッドを使用できるかに思えるが、当然実行時例外が発生する
```ts
const hoge = 0 as any as string
console.log(hoge.toUpperCase())
```

## 絞り込みによる型安全

### typeof type guards
省略

### in type guards

```ts
type Hoge = {
    "name": string
    "age": number
}

let foo: Hoge = {
    "name": "aaaa",
    "age": 23
}

if ("name" in foo) {
    console.log("name field exists")
}
```

### instanceof type guards
省略

### タグ付き Union Types
省略

### ユーザ定義 type guards

関数の引数の型を呼ばれた後に変更することができる機能。以下の例では`isHoge`の関数が呼ばれた後に引数の型は`Hoge`となり、`isFuga`が呼ばれた後に引数の型は`Fuga`となる
```ts
type Default = {
    "name": string
    "age": number
    [k: string]: any
}

type Hoge = Default & {"hoge": string}
type Fuga = Default & {"fuga": string}

function isHoge(value: Hoge | Fuga): value is Hoge {
    return value.hoge !== undefined
}

function isFuga(value: Hoge | Fuga): value is Fuga {
    return value.fuga !== undefined
}

function getType(value: any) {
    if (isHoge(value)) {
        console.log(value.hoge)
        return value
    } else if (isFuga(value)) {
        console.log(value.fuga)
        return value
    } else {
        console.log("Others")
        return value
    }
}

const v1 = getType({"name": "aaa", "age": 23, "hoge": "aaaa"})
const v2 = getType({"name": "aaa", "age": 23, "fuga": "bbbb"})
```

実行結果
```shell
aaaa
bbbb
```

### Array.filter で型を絞り込む

Arrayオブジェクトの`filter`関数で要素の絞り込みを行う際に、要素の型も絞り込みを行う場合は以下のように記述する

```ts
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
```

型定義ファイル
```ts
declare const arr: (Hoge | Fuga)[];
declare const res1: (Hoge | Fuga)[];
declare const res2: Hoge[];
```

# TypeScript の型システム

## 型の互換性

### 互換性の基礎

#### 互換性のあるデータ
サブタイプの型にスーパータイプのデータを代入することができない。たとえ互換性が存在する2つの型があったとしても、抽象度の高い型のデータを抽象度の低い型のデータに代入は不可能である。(例: string型のデータの String Literal Types への代入)  

#### any 型について
any 型にはどんなデータも代入できるので予期しない箇所で実行時例外が発生する

#### unknown 型について
unknown 型に入れられるデータも基本的にはany と同じでなんでも入れられるが、unknown 型のデータを別のデータに代入することはできない。

```ts
let a1: unknown = false
let a2: string = a1 // [Compile Error] Type 'unknown' is not assignable to type 'string'.
let a3: string = a1 as string // アサーションを使用するとコンパイルは通る
```

#### 互換性のないアサーション
互換性のないアサーションを行なった場合は CE が発生する。しかし、`{}`によるアサーションを行うとどんなデータでも代入することができる

```ts
let hoge = "var" as {}
```

### {} 型の互換性
プリミティブ型は{}型のサブタイプと言える?  


```ts
let hoge = {foo: "aaa"}
let fuga = {foo: 1}

// プロパティが異なるデータ型である場合、代入に失敗する
hoge = fuga // [Compile Error] '{ foo: number; }' is not assignable to type '{ foo: string; }'. Types of property 'foo' are incompatible.

// 異なるフィールドをもつ変数への代入は失敗する
let piyo = {var: "ccc"}
hoge = piyo  // [Compile Error] Property 'foo' is missing in type '{ var: string; }' but required in type '{ foo: string; }'.

// フィールドが追加されている変数の代入は成功するが、逆は失敗する
let hogehoge = {foo: "ddd", var: "eee"}
hoge = hogehoge
hogehoge = hoge // [Compile Error] Property 'var' is missing in type '{ foo: string; }' but required in type '{ foo: string; var: string; }'.

let piyopiyo = {}

piyopiyo = hogehoge
```

### 関数型の互換性

引数名は関係なく、どちらかの関数の引数がもう片方の関数の引数を部分的に満たしているか否かで互換性があるかどうかが決定される。
```ts
let hoge = (a: string) => "foo"
let fuga = (b: string, c: number) => "bar"

fuga = hoge // 引数が多い関数から少ない関数への代入は可能
hoge = fuga // [Compile Error] Type '(b: string, c: number) => string' is not assignable to type '(a: string) => string'.
```

### クラスの互換性

互換性があるかどうかのチェックはインスタンスメンバに対してのみ行われる。静的メンバとコンストラクはチェックの対象外。
```ts
class Class1 {
    static baz: boolean = false
    foo: string
    constructor(foo: string) {
        this.foo = foo
    }
}

class Class2 {
    foo: string
    bar: number
    constructor(foo: string, bar: number) {
        this.foo = foo
        this.bar = bar
    }

    get(foo: string){}
}

let hoge = new Class1("aaa")
let fuga = new Class2("bbb", 4)
hoge = fuga
console.log(hoge.foo)
```

## 宣言の結合
TS には宣言方法や種別によって振り分けられる以下の3つのグループが存在しており、それらを総称して*宣言空間*と呼ぶ。  
- Value
- Type
- Namespace

### Value
変数や関数の型が Value に該当する。変数や関数間で名前に重複が存在した場合、CE となる

```ts
let hoge = "foo"
let hoge = (a: string) => "fuga" // [Compile Error] Cannot redeclare block-scoped variable 'hoge'.ts(2451)
```

### Type

interface や type alias を宣言する場合はこのグループに属する。interface は追記による拡張が可能であるが、type alias は不可能
```ts
interface Hoge {
    foo: string
}

interface Hoge {
    bar: string
}

type Fuga = {
    foo: string
}

type Fuga = { // Duplicate identifier 'Fuga'.ts(2300)
    bar: string
}
```

### Namespace

Namespaceはドットで繋げて値を宣言することが可能
```ts
interface Hoge {
    foo: string
}
namespace Hoge {
    export interface Fuga {
        foo: string
    }
}

const hoge: Hoge = {
    foo: "aaaa"
}

const fuga: Hoge.Fuga = {
    foo: "bbb"
}
```

### interfaceの結合

以下のように同じメンバ名で異なるデータ型は結合不可能
```ts
interface Hoge {
    foo: string
}

interface Hoge {
    foo: number
}
```
また、メソッドに関しては同じメソッド名でも引数が異なるデータ型である場合はオーバーロードが行われる

### namespaceの結合
結合時に export されていない宣言は参照できない

```ts
namespace Hoge {
    interface A {
        foo: "one" | "two"
    }
    export interface Fuga {
        bar: string
        baz: A
    }
}

namespace Hoge {
    export interface Piyo extends Fuga {
        bar: "aaa"
        baz: A // [Compile Error] Property 'baz' of exported interface has or is using private name 'A'.ts(4033)
    }
}

// 結合によるメンバー追加は可能
namespace Hoge {
    export interface Fuga {
        barbar: "aaaaa"
    }
    export interface Hogehoge extends Fuga {
        bar: "bbb"
    }
}
```

# TypeScript の高度な型

## Generics

### 変数の Generics
基本的な使い方は以下の通り
```ts
interface Hoge<T> {
    foo: T
}

const v1: Hoge<string>  = {
    foo: "aaa"
}

const v2: Hoge<number> = {
    foo: 1
}

// デフォルトで使用する型を設定することが可能
interface Fuga<T = string>　{
    bar: T
}

const v3: Fuga = {
    bar: "bbb"
}

// extends で制限をかけることが可能
interface Piyo<T extends string> {
    baz: T
}

const v4: Piyo<string> = {
    baz: "ccc"
}

const v5: Piyo<number> = { // [Compile Error] Type 'number' does not satisfy the constraint 'string'.ts(2344)
    baz: 1
}
```

### 関数の Generics

```ts
function hoge<T>(input: T): T {
    return input
}

// 関数の Generics に関しては関数使用時に<>で型を宣言しなくてもよい
const v1 = hoge("foo")
const v2 = hoge(2)
const v3 = hoge(true)
const v4 = hoge(null)

// アサーションによる明示的な型の指定
const v5 = hoge(true as boolean | null)
const v6 = hoge<string | null>(null)

const fuga = <T>(input: T) => ({ result: input })
const v7 = fuga(1)

// extends による制約
interface Hoge {
    foo: number
}

function func<T extends Hoge>(input: T) {
    return { result: input.foo.toFixed() }
}

const v8 = func({ foo: 1 })
const v9 = func({ foo: 1, bar: "aaa"})
const v10 = func({ bar: "bbb"}) // [Compile Error] Argument of type '{ bar: string; }' is not assignable to parameter of type 'Hoge'.
```

### 複数の Generics

```ts
// 複数の Generics
function hoge<T, K extends keyof T>(input: T, prop: K) {
    return input[prop]
}

const input = {
    foo: "one",
    bar: false,
    baz: 2
}

const v1 = hoge(input, "foo")
const v2 = hoge(input, "aaa") // [Compile Error] Argument of type '"aaa"' is not assignable to parameter of type '"foo" | "bar" | "baz"'.ts(2345)
```

### クラスの Generics

```ts
// プリミティブ型の Genericsを使用する場合
class Hoge<T extends string> {
    name: T
    constructor(name: T) {
        this.name = name
    }
}

const v1 = new Hoge("foo")

// オブジェクトの Genericsを使用する場合
interface Fuga {
    foo: string,
    bar: number,
    baz: boolean
}

class Piyo<T extends Fuga> {
    foo: T['foo']
    bar: T['bar']
    baz: T['baz']

    constructor(val: T) {
        this.foo = val.foo
        this.bar = val.bar
        this.baz = val.baz
    }
}

const v2 = new Piyo({
    foo: "aaa",
    bar: 1,
    baz: false
})
```

## Conditional Types

### 型の条件分岐

三項演算子を使用することで型推論のタイミングで任意の型を返却することができる。

```ts
type Hoge<T> = T extends string ? true : false

let foo: Hoge<string>
let bar: Hoge<1>

foo = true
bar = false
foo = false // Type 'true' is not assignable to type 'false'.ts(2322)
bar = true // Type 'true' is not assignable to type 'false'.ts(2322)
```

Mapped Types　(複数のジェネリクス) でも使用することが可能
```ts
interface Hoge {
    foo: string
    bar: number
    baz: boolean
}

type Fuga<T, U> = {
    [K in keyof T]: T[K] extends U ? true : false
}

type a = Fuga<Hoge, string>
type b = Fuga<Hoge, number>
type c = Fuga<Hoge, boolean>

let d: a = {
    foo: false, // Type 'false' is not assignable to type 'true'.ts(2322)
    bar: false,
    baz: false
}
```

### 条件に適合した型を抽出する

よくわからなかった。
```ts
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
```

### 条件分岐で得られる制約