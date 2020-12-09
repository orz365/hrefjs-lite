# hrefjs
根据提供的href地址链接，解析出location结构数据，
参数与json互转

### 安装
```bash
npm i hrefjs
```

### 使用
```js
const hrefjs = require('hrefjs')
var location = hrefjs('https://www.cssjs.cn')

// 返回结果
{ 
  hash: '',
  host: 'www.cssjs.cn',
  hostname: 'www.cssjs.cn',
  href: 'https://www.cssjs.cn',
  origin: '',
  pathname: '',
  port: '',
  protocol: 'https:',
  search: '' 
}
```

```js
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