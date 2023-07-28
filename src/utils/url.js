
/**
 * 将json转换成 &分隔的参数
 * @param json
 * @return {string} &分隔的参数
 */
const json2param = function(json) {
  const r = []
  for (const p in json) {
    if (Array.isArray(json[p])) {
      json[p].forEach(value => {
        r.push(`${p}=${value}`)
      })
    } else {
      r.push(p + '=' + json[p])
    }
  }
  return r.join('&')
}
/**
 * &分隔的参数转换成json对象
 * @param param
*/
const param2json = function(param) {
  const searchParams = {}
  if (param) {
    const queries = param.split('&')
    queries.forEach(function(query) {
      const pair = query.split('=')
      const name = decodeURIComponent(pair[0])
      const value = decodeURIComponent(pair[1])
      if (!searchParams[name]) {
        searchParams[name] = value
      } else if (Array.isArray(searchParams[name])) {
        searchParams[name].push(value)
      } else {
        searchParams[name] = [searchParams[name], value]
      }
    })
  }
  return searchParams
}

/**
 * 将json地址转成实际地址
 * @param {object} location
 * @returns url地址
 */
const revert = function(location) {
  const protocal = location.protocol
  const hostname = location.hostname
  const port = location.port
  const pathname = location.pathname
  const search = json2param(location.searchParams) === '' ? '' : '?' + json2param(location.searchParams)
  const hashPath = location.hashPath
  const hashSearch = json2param(location.hashSearchParams) === '' ? '' : '?' + json2param(location.hashSearchParams)
  const portStr = port === '' ? '' : ':' + port
  return protocal + '//' + hostname + portStr + pathname + search + '#' + hashPath + hashSearch
}

export default {
  revert,
  json2param,
  param2json
}
