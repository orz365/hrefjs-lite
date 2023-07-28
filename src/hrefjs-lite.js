const
/**
 * hash的分隔符
 */
  SEPARATE_HASH = '#'
/**
 * 参数分隔符，对于一个链接来讲，只可能有路径参数和hash参数两种
 */
const SEPARATE_SEARCH = '?'
/**
 * 分隔符 &
 * @type {string}
 */
const SEPARATE_PARAM = '&'

/**
 * 将json转换成 &分隔的参数
 * @param json
 * @return {string} &分隔的参数
 */
const json2param = function(json) {
  const r = []
  for (const p in json) {
    r.push(p + '=' + json[p])
  }
  return r.join(SEPARATE_PARAM)
}
/**
 * &分隔的参数转换成json对象
 * @param param
 */
const param2json = function(param) {
  if (typeof param === 'undefined' || param.length === 0) {
    return {}
  }
  if (param.indexOf(SEPARATE_SEARCH) === 0) {
    param = param.substring(1)
  }
  const json = {}
  const r = param.split(SEPARATE_PARAM)
  for (let i = 0; i < r.length; i++) {
    const r2 = r[i].split('=')
    const key = r2[0]
    const value = r2[1]
    json[key] = value
  }
  return json
}

const location = {
  // 包含块标识符，开头有一个“#”。
  hash: '',

  // 转换后hash的json参数
  hashJson: {},

  // 包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号。
  host: '',
  // 包含URL域名
  hostname: '',
  // 完整路径
  href: '',
  // 包含页面来源的域名的标准形式
  origin: '',

  // 包含URL中路径部分，开头有一个“/"。
  pathname: '',
  // 80
  port: 80,
  // 包含URL对应协议 https:
  protocol: '',
  // 包含URL参数，开头有一个“?”。
  search: '',
  // 转换后的参数对象
  searchJson: {}
}
/**
 * 分解hash值，如果含有多个#号，则第一个表示hash参数，后面的都是字符串
 * @param href 地址
 * @return {{hrefNoHash: string, hashJson: {}, hash: string}}
 * @private
 */
const _splitHash = function(href) {
  let hash = ''
  let hashJson = {}
  let hrefNoHash = ''
  let hashPath = ''

  // 先处理hash值
  let firstHashIndex = href.indexOf(SEPARATE_HASH)

  if (firstHashIndex !== -1) {
    // href的hash值
    hash = href.substring(firstHashIndex)
    hash = hash === SEPARATE_HASH ? '' : hash

    // 处理hash值?的参数
    let firstSearchIndex = hash.indexOf(SEPARATE_SEARCH)
    if (firstSearchIndex === -1) {
      firstSearchIndex = hash.length
    }
    hashPath = hash.substring(0, firstSearchIndex)
    const hashParam = hash.substring(firstSearchIndex)
    hashJson = param2json(hashParam)
  } else {
    firstHashIndex = href.length
  }
  // 不包含hash值的路径
  hrefNoHash = href.substring(0, firstHashIndex)

  return {
    hash,
    hashPath,
    hashJson,
    hrefNoHash
  }
}
const Hrefjs = function(href) {
  if (typeof href !== 'string') {
    return location
  }
  location.href = href

  const { hash, hashPath, hashJson, hrefNoHash } = _splitHash(href)

  let firstSearchIndex = hrefNoHash.indexOf(SEPARATE_SEARCH)
  if (firstSearchIndex === -1) {
    firstSearchIndex = hrefNoHash.length
  }

  const hrefSPath = hrefNoHash.substring(0, firstSearchIndex)
  const search = hrefNoHash.substring(firstSearchIndex)

  const hrefPaths = hrefSPath.split('//')
  const protocol = hrefPaths[0] || 'http:'

  const hostWithPath = hrefPaths[1] || ''
  let slashIndex = hostWithPath.indexOf('/')

  if (slashIndex === -1) {
    slashIndex = hostWithPath.length
  }
  const host = hostWithPath.substring(0, slashIndex)
  const pathname = hostWithPath.substring(slashIndex)
  const hostname = host.split(':')[0] || ''
  const port = host.split(':')[1] || ''

  // Location.hash
  location.hash = hash
  /**
   * @deprecated
   */
  location.hashPath = hashPath
  // Location.hashJson
  // location.hashJson = hashJson;
  location.hashSearch = json2param(hashJson) === '' ? '' : '?' + json2param(hashJson)
  location.hashSearchJson = hashJson
  // Location.search
  location.search = search
  // Location.protocol
  location.protocol = protocol
  // Location.host
  location.host = host
  location.pathname = pathname
  location.hostname = hostname
  location.port = port

  location.searchJson = param2json(search)

  return location
}

/**
 * 将解析的location参数，反编译回url
 * 参数根据json来编译，可改变json值来增加或减少参数
 * @param location
 */
const revert = function(location) {
  const protocal = location.protocol
  const hostname = location.hostname
  const port = location.port
  const pathname = location.pathname
  const search = json2param(location.searchJson) === '' ? '' : '?' + json2param(location.searchJson)
  const hashPath = location.hashPath
  const hashSearch = json2param(location.hashSearchJson) === '' ? '' : '?' + json2param(location.hashSearchJson)

  const portStr = port === '' ? '' : ':' + port

  return protocal + '//' + hostname + portStr + pathname + search + hashPath + hashSearch
}

Hrefjs.json2param = json2param
Hrefjs.param2json = param2json
Hrefjs.revert = revert

module.exports = Hrefjs
