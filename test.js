import Hrefjs from './src/hrefjs-lite2.js'

const url = 'https://www.cssjs.cn:92/tt/bb/#/fly?a=10&a=20&a=30'
const location = new Hrefjs(url)

console.log(url)
console.log(location.toString())
