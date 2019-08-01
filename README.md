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