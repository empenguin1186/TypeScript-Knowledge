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


