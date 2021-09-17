const hrefjs = require('./src/href');
var location = hrefjs('https://www.cssjs.cn/test/?a=222#/?a=b')
console.log(location)
var json = {
    a: 10,
    b: 20
};
var param = hrefjs.json2param(json);

param = '?a=10&b=20';
json = hrefjs.param2json(param);
console.log(json);