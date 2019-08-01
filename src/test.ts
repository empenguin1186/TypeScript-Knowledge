let hoge: {}
let fuga: object

// 括弧を使って({}) を使って object 型を指定することもできるが、その場合プリミティブ型を代入してもエラーが発生しない
hoge = true // OK
hoge = 0 // OK

fuga = false // Error
fuga = 1 // Error