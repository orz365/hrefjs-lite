const hrefjs = require('./src/href');
var location = hrefjs(
    'https://github.com/MikeMcl/bignumber.js/blob/master/bignumber.js');
console.log(location);

var json = {
    a: 10,
    b: 20
};
var param = hrefjs.json2param(json);

parma = 'a=10&b=20';
json = hrefjs.param2json(param);
console.log(json);