"use strict";
const arr = [
    { "name": "aaa", "age": 23, "hoge": "aaaa" },
    { "name": "aaa", "age": 23, "fuga": "bbbb" }
];
const res1 = arr.filter(e => "hoge" in e);
const res2 = arr.filter((e) => "hoge" in e);
