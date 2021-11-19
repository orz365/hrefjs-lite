# hrefjs-lite
根据提供的href地址链接，解析出location结构数据，
参数与json互转

### 安装
```bash
npm i hrefjs-lite
```

### 使用
```js
const hrefjs = require('hrefjs-lite')
var location = hrefjs('https://www.cssjs.cn?name=wilder#/fly?a=10')

// 返回结果
{
  hash: '#/fly?a=10',
  hashJson: { a: '10' },
  host: 'www.cssjs.cn',
  hostname: 'www.cssjs.cn',
  href: 'https://www.cssjs.cn?name=wilder#/fly?a=10',
  origin: '',
  pathname: '',
  port: '',
  protocol: 'https:',
  search: '?name=wilder',
  searchJson: { name: 'wilder' }
}
```

```js
const hrefjs = require('hrefjs-lite')
var json = {
    a: 10,
    b: 20
}
var param = hrefjs.json2param(json)
// a=10&b=20

param = 'a=10&b=20'
json = hrefjs.param2json(param)   
//{ a: '10', b: '20' }
```