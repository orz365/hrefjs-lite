(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global);
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window) {

    var SEPARATE_HASH = '#',

        // 参数分隔符，对于一个链接来讲，只可能有路径参数和hash参数两种
        SEPARATE_SEARCH = '?',

        /**
         * 分隔符 &
         * @type {string}
         */
        SEPARATE_PARAM = '&';

    /**
     * 将json转换成 &分隔的参数
     * @param json
     * @return {string} &分隔的参数
     */
    var json2param = function (json) {
        var r = [];
        for (var p in json) {
            r.push(p + '=' + json[p]);
        }
        return r.join(SEPARATE_PARAM);
    };
    /**
     * &分隔的参数转换成json对象
     * @param param
     */
    var param2json = function (param) {
        if (typeof param === 'undefined' || param.length === 0) {
            return {};
        }
        if (param.indexOf(SEPARATE_SEARCH) === 0) {
            param = param.substring(1);
        }
        var json = {};
        var r = param.split(SEPARATE_PARAM);
        for (var i = 0; i < r.length; i++) {
            var r2 = r[i].split('=');
            var key = r2[0];
            var value = r2[1];
            json[key] = value;
        }
        return json;
    };

    var location = {
        //包含块标识符，开头有一个“#”。
        hash: '',

        // 转换后hash的json参数
        hashJson: {},

        //包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号。
        host: '',
        //包含URL域名
        hostname: '',
        // 完整路径
        href: '',
        //包含页面来源的域名的标准形式
        origin: '',

        //包含URL中路径部分，开头有一个“/"。
        pathname: '',
        // 80
        port: 80,
        //包含URL对应协议 https:
        protocol: '',
        //包含URL参数，开头有一个“?”。
        search: '',
        // 转换后的参数对象
        searchJson: {},
    };
    /**
     * 分解hash值，如果含有多个#号，则第一个表示hash参数，后面的都是字符串
     * @param href 地址
     * @return {{hrefNoHash: string, hashJson: {}, hash: string}}
     * @private
     */
    var _splitHash = function (href) {
        var hash = '', hashJson = {}, hrefNoHash = ''

        // 先处理hash值
        var firstHashIndex = href.indexOf(SEPARATE_HASH),
            lastHashIndex = href.lastIndexOf(SEPARATE_HASH)

        var hash = '';

        if (firstHashIndex !== -1) {
            // href的hash值
            hash = href.substring(firstHashIndex);
            hash = hash === SEPARATE_HASH ? '' : hash;

            // 处理hash值?的参数
            var firstSearchIndex = hash.indexOf(SEPARATE_SEARCH);
            if (firstSearchIndex === -1) {
                firstSearchIndex = hash.length;
            }
            var hashPath = hash.substring(0, firstSearchIndex)
            var hashParam = hash.substring(firstSearchIndex);
            hashJson = param2json(hashParam)

        } else {
            firstHashIndex = href.length;
        }
        // 不包含hash值的路径
        var hrefNoHash = href.substring(0, firstHashIndex);

        return {
            hash: hash,
            hashPath: hashPath,
            hashJson: hashJson,
            hrefNoHash: hrefNoHash,
        };
    }
    var Hrefjs = function (href) {
        if (typeof href !== 'string') {
            return location;
        }
        // href路径的长度
        var hrefLength = href.length;

        location.href = href;

        var {hash,hashPath, hashJson, hrefNoHash} = _splitHash(href)

        var firstSearchIndex = hrefNoHash.indexOf(SEPARATE_SEARCH);
        if (firstSearchIndex === -1) {
            firstSearchIndex = hrefNoHash.length;
        }

        var hrefSPath = hrefNoHash.substring(0, firstSearchIndex);
        var search = hrefNoHash.substring(firstSearchIndex);

        var hrefPaths = hrefSPath.split('//');
        var protocol = hrefPaths[0] || 'http:';

        var hostWithPath = hrefPaths[1] || '';
        var slashIndex = hostWithPath.indexOf('/');

        if (slashIndex === -1) {
            slashIndex = hostWithPath.length;
        }
        var host = hostWithPath.substring(0, slashIndex);
        var pathname = hostWithPath.substring(slashIndex);
        var hostname = host.split(':')[0] || '';
        var port = host.split(':')[1] || '';

        // Location.hash
        location.hash = hash;
        /**
         * @deprecated
         */
        location.hashPath = hashPath;
        // Location.hashJson
        // location.hashJson = hashJson;
        location.hashSearch = json2param(hashJson)==''?'':'?'+json2param(hashJson);
        location.hashSearchJson = hashJson
        // Location.search
        location.search = search;
        // Location.protocol
        location.protocol = protocol;
        // Location.host
        location.host = host;
        location.pathname = pathname;
        location.hostname = hostname;
        location.port = port;

        location.searchJson = param2json(search);

        return location;
    };

    /**
     * 将解析的location参数，反编译回url
     * 参数根据json来编译，可改变json值来增加或减少参数
     * @param location
     */
    var revert = function (location){
        var protocal = location.protocol,
            hostname = location.hostname,
            port = location.port,
            pathname = location.pathname,
            search = json2param(location.searchJson)==''?'':'?'+json2param(location.searchJson),
            hashPath = location.hashPath,
            hashSearch = json2param(location.hashSearchJson)==''?'':'?'+json2param(location.hashSearchJson)

        return protocal + '//' + hostname + ':' + port + pathname + search + hashPath + hashSearch
    }

    Hrefjs.json2param = json2param;
    Hrefjs.param2json = param2json;
    Hrefjs.revert = revert;

    window.Hrefjs = Hrefjs;

    return Hrefjs;
});