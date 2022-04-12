const hrefjs = require('./dist/hrefjs-lite.min');
var location = hrefjs('https://www.cssjs.cn/tt/bb?name=wilder#/fly?a=10&a=20')

location.searchJson.name = 'Tome'
console.log(location)
console.log(hrefjs.revert(location))