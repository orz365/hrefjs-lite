(function(global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global);
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window) {

    var SEPARATE_HASH = '#';

    // 参数分隔符，对于一个链接来讲，只可能有路径参数和hash参数两种
    var SEPARATE_SEARCH = '?';

    /**
     * 分隔符 &
     * @type {string}
     */
    var SEPARATE_PARAM = '&';

    /**
     * 将json转换成 &分隔的参数
     * @param json
     * @return {string} &分隔的参数
     */
    var json2param = function(json) {
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
    var param2json = function(param) {
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
    var Hrefjs = function(href) {
        if (typeof href !== 'string') {
            return location;
        }
        // href路径的长度
        var hrefLength = href.length;

        location.href = href;

        var firstHashIndex = href.indexOf(SEPARATE_HASH);

        var hash = '';
        if (firstHashIndex !== -1) {
            // href的hash值
            hash = href.substring(firstHashIndex);
            hash = hash === SEPARATE_HASH ? '' : hash;
        } else {
            firstHashIndex = hrefLength;
        }

        // 不包含hash值的路径
        var hrefNoHash = href.substring(0, firstHashIndex);
        var firstSearchIndex = hrefNoHash.indexOf(SEPARATE_SEARCH);
        if (firstSearchIndex !== -1) {

        } else {
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
    Hrefjs.json2param = json2param;
    Hrefjs.param2json = param2json;

    window.Hrefjs = Hrefjs;

    return Hrefjs;
});