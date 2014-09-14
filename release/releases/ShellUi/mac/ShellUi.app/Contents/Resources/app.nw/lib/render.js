
var GLOB_jq = require('jquery');
var GLOB_fs  = require('fs');
var GLOB_swing  = require('swig');


/* ##########################################################################

RENDER
*/

var render = function (templatepath, variables, dom, callback, method) {
	GLOB_fs.readFile(templatepath, "utf-8", function (err, data) {
		if (err) { throw err; return false; }
		if (data) {
			//console.log(variables);
			//GLOB_swing.setDefaults({ autoescape: true });
			var temp = GLOB_swing.render(data, {locals:variables});
			//console.log(temp);
			if (dom) {
				var jq_dom = GLOB_jq(dom);
				if (jq_dom.length > 0) {
					if (method == 'append') {
						jq_dom.append(temp);
					} else {
						jq_dom.html(temp);
					}
					if (callback) {
						callback(jq_dom);
					}
				}
			}
		}
	});
};
module.exports.render = render;




/* ##########################################################################

GET RENDER
*/

var renderSync = function (templatepath, variables, autoescape) {
	var html = GLOB_fs.readFileSync(templatepath, "utf-8");
	//console.log(html);
	if (html) {
		GLOB_swing.setDefaults({ autoescape: false });
		return GLOB_swing.render(html, {locals:variables});
	}
	return false;
	
};
module.exports.renderSync = renderSync;








