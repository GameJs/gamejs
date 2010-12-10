exports.resourceHref_macro = function(tag) {
   var appId = tag.parameters[0];
   var path = tag.parameters[1] || '';
   return ('../resources/' + appId + '/' + path).replace(/\/+/g, '/');
};

exports.mainScriptHref_macro = function(tag) {
   var appId = tag.parameters[0];
   return ['../lib/gamejs/apps', appId, 'main.js'].join('/').replace(/\/+/g, '/');
};
