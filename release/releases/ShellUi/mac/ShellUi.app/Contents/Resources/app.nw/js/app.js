process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});


var gui = require('nw.gui');
var win = gui.Window.get();
	
if ( process.platform == 'darwin') {

	// ### MAC ONLY
	
	
	var menubar = new gui.Menu({ type: 'menubar' });
	win.menu = menubar;
	
	
	var debug = new gui.Menu();
	
	debug.append(new gui.MenuItem({ label: 'Show', click: function () {
		win.showDevTools();
	}}));
	
	win.menu.append(new gui.MenuItem({ label: 'Devtools', submenu: debug}));
} 


window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var GLOB_LIB_render = require('./lib/render.js');
var GLOB_jq = require('jquery');
var GLOB_low = require('lowdb');
//var GLOB_shelljs = require('shelljs');
var _db_btn = GLOB_low('btn.json');

var GLOB_process = require('child_process');


var showList = function () {
	
	var obj = {};
	obj.list = _db_btn('list').value();

	//console.log(obj);
	if (obj.list.length < 1) {
		editList();
		
	} else {
		GLOB_LIB_render.render('templates/list.html', obj, GLOB_jq('#main-left'), function (dom) {
			GLOB_jq('#toolbar-save').hide();
			GLOB_jq('#toolbar-edit').show();			
		});
	}
};


var editList = function () {

	var obj = {};
	obj.list = _db_btn('list').value();

	//console.log(obj);
	GLOB_LIB_render.render('templates/edit.html', obj, GLOB_jq('#main-left'), function (dom) {
		GLOB_jq('#toolbar-edit').hide();
		GLOB_jq('#toolbar-save').show();
	});
};

var events = function () {


	GLOB_jq('#main').on('click, focus', 'input.dir',function (e) {
		var dom = GLOB_jq(e.currentTarget);
		GLOB_jq('#fileDialog').off('change').on('change', function (e){
			dom.val( GLOB_jq('#fileDialog').val() ).blur();
		}).trigger('click'); 
	});
	
	GLOB_jq('#main').on('click', '.shellbutton',function (e) {
		//console.log('click shell');
		
		var dom = GLOB_jq(e.currentTarget);
		
		GLOB_jq('#main-right').find('.live').text('working...');
		GLOB_jq('#main-right').find('.error').text('').hide();
		GLOB_jq('#main-right').find('.output').text('');
		GLOB_jq('#main-right').find('.code').text('').hide();
		
		
		var exec = GLOB_jq(e.currentTarget).data('exec');
		var dir = GLOB_jq(e.currentTarget).data('dir');
		
		
		
		
		if (exec) {
			
			dom.addClass('spinner');
			//console.log('exec-dir',exec, dir);
			//GLOB_process.spawn('cd '+dir)
			//GLOB_shelljs.cd(dir);
			
			var output = '';
			cmd(exec, dir,function (data) {
				GLOB_jq('#main-right').find('.live').text(data);
				output = output+data+'\n';
				GLOB_jq('#main-right').find('.output').text(output);
			}, function (data) {
				GLOB_jq('#main-right').find('.error').text(data).show();
				dom.removeClass('spinner');
				GLOB_jq('#toolbar-console').trigger('click');
				
			}, function (code) {
				GLOB_jq('#main-right').find('.code').text(code).show();
				GLOB_jq('#main-right').find('.output').text(output);
				

				dom.removeClass('spinner');
			});
				

		/*
	
			GLOB_shelljs.exec(exec, {async:true}, function(code, output) {
			  console.log('Exit code:', code);
			  console.log('Program output:', output);
			  GLOB_jq('#main-right').find('.output').text(output);
			  GLOB_jq('#main-right').find('.code').text(code);
			});
*/


		}
	});
	
	
	GLOB_jq('#toolbar-console').on('click', function (e) {
		//gui.Window.width = 500;
		var win = gui.Window.get();
		
		if ( GLOB_jq(e.currentTarget).hasClass('open') ) {
			win.width = 200;
			GLOB_jq(e.currentTarget).removeClass('open');
			GLOB_jq('#main-right').hide();
		} else {
			win.width = 500;
			GLOB_jq(e.currentTarget).addClass('open');
			GLOB_jq('#main-right').show();
		}
		
		
	});
	
	
	GLOB_jq('#toolbar-edit').on('click', function () {
		editList();
	});
	
	GLOB_jq('#toolbar-save').on('click', function () {
		var newObj = [];
		GLOB_jq('#page-edit-list .item').each(function (i,k) {
			var title = GLOB_jq(k).find('.title').val();
			if (title == '') {
				GLOB_jq(k).find('.title').addClass('required');
				return false;
			} else {
				GLOB_jq(k).find('.title').removeClass('required');
			}
			var exec = GLOB_jq(k).find('.exec').val();
			if (exec == '') {
				GLOB_jq(k).find('.exec').addClass('required');
				return false;
			} else {
				GLOB_jq(k).find('.exec').removeClass('required');
			}
			var dir = GLOB_jq(k).find('.dir').val();
			if (dir == '') {
				GLOB_jq(k).find('.dir').addClass('required');
				return false;
			} else {
				GLOB_jq(k).find('.dir').removeClass('required');
			}
			
			if (title && exec && dir) {
				newObj.push({'title':title, 'exec':exec, 'dir':dir});
			}
		});
		
		_db_btn.object.list = newObj;
		_db_btn.save();
		showList();
	});
};



var cmd = function (exec, dir, live, error, close) {
	
	//var fs = require('fs');
	//var ls = GLOB_process.spawn(exec);
	
	const
	fs = require('fs'),
	process = require('child_process');
	
	if (dir) {
		var ls = process.spawn(exec, false, {cwd: dir});
	} else {
		var ls = process.spawn(exec);
	}
	
	
	
	ls.stdout.on('data', function (data) {
	  //console.log('stdout: ' + data);
	  	
	  //GLOB_jq('#main-right').find('.live').text(data);
	  //output += data;
	  //GLOB_jq('#main-right').find('.output').text(output);
	  if (live) {
		  live(data);
	  }

	});
	
	ls.stderr.on('data', function (data) {
	  //console.log('stderr: ' + data);
	  //GLOB_jq('#main-right').find('.error').text(data).show();
	  if (error) {
		  error(data);
	  }
	});
	
	ls.on('close', function (code) {
	  //console.log('child process exited with code ' + code);
	  //GLOB_jq('#main-right').find('.code').text(code);
	  //GLOB_jq('#main-right').find('.output').text(output);
	  if (close) {
		  close(code);
	  }
	});
	
};



var init = function () {
	
	events();
	showList();
};
init();



