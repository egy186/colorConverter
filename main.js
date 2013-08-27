(function () {
    queryParam = {};
    queryParam.get = function (thisParam) {
        if (!location.search) {
            return null;
        }
        var queryObj = {},
            tmp,
            query = location.search.substring(1).split(/&/g);
        for (var i = 0; i < query.length; i++) {
            tmp = query[i].split('=');
            queryObj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
        }
        if (thisParam) {
            return queryObj[thisParam]
        }
        return queryObj;
    }
    queryParam.set = function (paramObj) { }
})();
