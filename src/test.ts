let hoge: any = "hello"

let fuga: number = (<string>hoge).length // <type>変数 でダウンキャスト可能
let piyo: number = (hoge as string).length // 変数 as 型 でダウンキャスト可能 

console.log(fuga)
console.log(piyo)