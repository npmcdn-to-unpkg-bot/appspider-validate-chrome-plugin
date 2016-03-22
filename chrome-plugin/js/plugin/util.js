/**
 * Created by nbugash on 3/8/16.
 */
if (appspider === undefined) {
    var appspider = {};
}
appspider.util = {
    convertHeaderStringToJSON: function (headerString) {
        var headerArray = headerString.split('\r\n');
        var headers = {};
        for (var i = 0; i < headerArray.length; i++) {
            if (headerArray[i].toUpperCase().match(/(^GET|^POST|^PUT|^DELETE)/)) {
                var requestArray = headerArray[i].split(' ');
                headers.REQUEST = {
                    method: requestArray[0],
                    uri: requestArray[1],
                    version: requestArray[2]
                };
            } else if (headerArray[i].indexOf(':') > -1) {
                var a = headerArray[i].split(':');
                var header_name = a[0].trim();
                switch (header_name) {
                    case 'Referer':
                        headers.Referer = a.slice(1).join(':').trim();
                        break;
                    case 'Cookie':
                        var cookiearray = a[a.length - 1].split(';');
                        var cookies = [];
                        for (var x = 0; x < cookiearray.length; x++) {
                            if (cookiearray[x].indexOf('=') > -1) {
                                var array = cookiearray[x].split('=');
                                var key = array[0].trim();
                                var value = array[array.length - 1].trim();
                                cookies.push({
                                    key: key,
                                    value: value
                                });
                            }
                        }
                        headers.Cookie = cookies;
                        break;
                    default:
                        headers[header_name] = a[a.length - 1].trim();
                        break;
                }
            }
        }
        return headers;
    },
    convertJSONToString: function (jsonObj) {
        if (jsonObj === undefined) {
            return false;
        }
        var str = '';
        if (jsonObj.REQUEST) {
            str = jsonObj.REQUEST.method + ' ' + jsonObj.REQUEST.uri + ' ' + jsonObj.REQUEST.version + '\r\n';
        }
        for (var key in jsonObj) {
            switch (key) {
                case 'REQUEST':
                    break; //skip
                case 'Cookie':
                    if (Array.isArray(jsonObj[key])) {
                        str += key + ": { \r\n\t";
                        for (var index in jsonObj[key]) {
                            str += jsonObj[key][index].key + ": " + jsonObj[key][index].value + ", \r\n\t";
                        }
                        str += "} \r\n";
                    }
                    break;
                default:
                    if (typeof jsonObj[key] === 'object') {
                        str += key + ': ' + AppSpider.util.convertJSONToString(jsonObj[key]);
                    } else {
                        str += key + ': ' + jsonObj[key].trim() + '\r\n';
                    }
                    break;
            }
        }
        return str;
    }
};