const hrefjs = require('./src/href');
var location = hrefjs('https://www.jetbrains.com/shop/eform/opensource/confirmation?email=orz365%40163.com&c=%22%22%27.df#/sdfssd?a=b')

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