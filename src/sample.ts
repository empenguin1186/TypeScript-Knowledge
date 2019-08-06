export class User {

    constructor(private name: string) {
        this.name = name
    }

    hoge() {
        console.log("Hello, I am " + this.name)
    }
}