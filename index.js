/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
module.exports = function(content) {
	if(this.cacheable) this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	var exports = [];
	var keys = Object.keys(query);
	if(keys.length == 1 && typeof query[keys[0]] == "boolean") {
		exports.push("module.exports = " + keys[0]);
	} else {
		keys.forEach(function(name) {
			var mod = name;
			if(typeof query[name] == "string") {
				mod = query[name];
			}
			exports.push("exports[" + JSON.stringify(name) + "] = (" + mod + ");");
		});
	}
	return content + "\n\n/*** EXPORTS FROM exports-loader ***/\n" + exports.join("\n");
}