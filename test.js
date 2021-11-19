const hrefjs = require('./src/href');
var location = hrefjs('https://www.cssjs.cn?name=wilder#/fly?a=10')

console.log(location)
var json = location.searchJson

console.log(decodeURIComponent(json.c))
var json = {
    a: 10,
    b: 20
};
var param = hrefjs.json2param(json);

json = hrefjs.param2json(param);
console.log(json);