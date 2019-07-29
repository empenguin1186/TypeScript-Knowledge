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



