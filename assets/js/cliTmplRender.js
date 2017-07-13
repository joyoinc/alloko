
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
        $(elemRenderTo).after(html);
    }); 
};