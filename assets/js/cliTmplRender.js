
var cli_render = function(elemRenderTo, data, templateName, render_cb) {
    render_cb(elemRenderTo, cli_render_bind(data, templateName));
};

var cli_render_bind = function(data, templateName) {
    return this['JST'][`assets/templates/${templateName}.html`](data);
}

var cli_render_in = function(elemRenderTo, data, templateName) {
    cli_render(elemRenderTo, data, templateName, function(elemRenderTo, html) {
        $(elemRenderTo).append(html);
    });    
};

var cli_render_out = function(elemRenderTo, data, templateName) {
    cli_render(elemRenderTo, data, templateName, function(elemRenderTo, html) {
        $(elemRenderTo).before(html);
    }); 
};



// misc
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var getUrlParameters = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i,
        result = {};

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        result[sParameterName[0]] = sParameterName[1];
    }
    return result;
};

var getUrlWithoutQueryString = function getUrlWithoutQueryString(url) {
  var question_pos =  url.indexOf("?");
  return question_pos == -1 ? url : url.substring(0, question_pos);
}