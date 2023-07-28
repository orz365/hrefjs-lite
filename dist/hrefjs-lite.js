(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Hrefjs = factory());
})(this, (function () { 'use strict';

  /**
   * 将json转换成 &分隔的参数
   * @param json
   * @return {string} &分隔的参数
   */
  const json2param = function(json) {
    const r = [];
    for (const p in json) {
      if (Array.isArray(json[p])) {
        json[p].forEach(value => {
          r.push(`${p}=${value}`);
        });
      } else {
        r.push(p + '=' + json[p]);
      }
    }
    return r.join('&')
  };
  /**
   * &分隔的参数转换成json对象
   * @param param
  */
  const param2json = function(param) {
    const searchParams = {};
    if (param) {
      const queries = param.split('&');
      queries.forEach(function(query) {
        const pair = query.split('=');
        const name = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        if (!searchParams[name]) {
          searchParams[name] = value;
        } else if (Array.isArray(searchParams[name])) {
          searchParams[name].push(value);
        } else {
          searchParams[name] = [searchParams[name], value];
        }
      });
    }
    return searchParams
  };

  const revert = function(location) {
    const protocal = location.protocol;
    const hostname = location.hostname;
    const port = location.port;
    const pathname = location.pathname;
    const search = json2param(location.searchParams) === '' ? '' : '?' + json2param(location.searchParams);
    const hashPath = location.hashPath;
    const hashSearch = json2param(location.hashSearchParams) === '' ? '' : '?' + json2param(location.hashSearchParams);
    const portStr = port === '' ? '' : ':' + port;
    return protocal + '//' + hostname + portStr + pathname + search + '#' + hashPath + hashSearch
  };

  var urlUtils = {
    revert,
    json2param,
    param2json
  };

  /*
  这个正则表达式用于解析URL，将URL分解为协议、用户名、密码、主机名、端口号、路径、查询参数和哈希等各个部分。下面逐个说明各个部分的含义：

  - `^([^:]+):\/\/`：匹配URL中的协议部分，其中`[^:]+`表示匹配除了冒号以外的任意字符，`\/\/`表示匹配双斜杠。

  - `(?:([^@]+)@)?`：匹配URL中的用户名和密码部分，其中`(?:...)`表示非捕获分组，`[^@]+`表示匹配除了@符号以外的任意字符，`@`表示匹配@符号。由于用户名和密码之间用冒号分隔，因此这个正则表达式并没有直接匹配冒号，而是将整个用户名和密码部分作为一个可选的非捕获分组。

  - `([^:/?#]+)`：匹配URL中的主机名部分，其中`[^:/?#]+`表示匹配除了冒号、斜杠、问号和井号以外的任意字符，这里用来匹配主机名。

  - `(?::(\d+))?`：匹配URL中的端口号部分，其中`(?::...)`表示一个可选的非捕获分组，`(\d+)`表示匹配一个或多个数字。

  - `([^?#]*)`：匹配URL中的路径部分，其中`[^?#]*`表示匹配除了问号和井号以外的任意字符，这里用来匹配路径。

  - `(?:\?([^#]*))?`：匹配URL中的查询参数部分，其中`\?`表示匹配问号，`(?:...)`表示一个可选的非捕获分组，`[^#]*`表示匹配除了井号以外的任意字符，这里用来匹配查询参数。需要注意的是，查询参数可能出现多个相同的参数名，因此在后续解析过程中需要特别处理。

  - `(?:#(.*))?`：匹配URL中的哈希部分，其中`\#`表示匹配井号，`(?:...)`表示一个可选的非捕获分组，`.*`表示匹配任意字符，这里用来匹配哈希。需要注意的是，哈希部分不会被发送到服务器，它通常用于标记文档中的特定部分，或者用于客户端跳转。
  综上所述，这个正则表达式用于将URL分解为各个部分，并将其封装在一个JavaScript对象中返回。需要注意的是，这个正则表达式只能解析标准的URL格式，对于一些非标准格式的URL可能无法正确解析。
  */

  function Hrefjs(url) {
    const pattern = /^(.+)\/\/(?:([^@]+)@)?([^:/?#]+)(?::(\d+))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
    const matches = url.match(pattern);
    console.log(matches);
    const location = {
      protocol: matches[1],
      username: matches[2] ? matches[2].split(':')[0] : undefined,
      password: matches[2] ? matches[2].split(':')[1] : undefined,
      hostname: matches[3],
      port: matches[4] || '',
      pathname: matches[5],
      search: matches[6] || '',
      hash: matches[7] || ''
    };

    // 处理search
    location.searchParams = urlUtils.param2json(location.search);

    // 处理hash
    if (location.hash) {
      const hashPathSearch = location.hash.split('?');
      const hashPath = hashPathSearch[0];
      const hashSearch = hashPathSearch[1];

      location.hashPath = hashPath;
      location.hashSearch = hashSearch;
      if (hashSearch) {
        location.hashSearchParams = urlUtils.param2json(hashSearch);
      }
    }

    location.toString = function() {
      return urlUtils.revert(this)
    };

    return location
  }

  Hrefjs.json2param = urlUtils.json2param;
  Hrefjs.param2json = urlUtils.param2json;

  return Hrefjs;

}));
