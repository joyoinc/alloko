var ensureString = function(v, fallback) {
    var result = v;
    if(v === "undefined" || typeof(v) === "undefined") 
        return fallback;
    return result;
};

var ensureInt = function(v, fallback) {
    var result = parseInt(v);
    if(result === NaN) 
        return fallback;
    return result;
};