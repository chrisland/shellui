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
		for (var i = 0; i < obj.list.length; i++) {
			if (obj.list[i].dir) {
				var split = obj.list[i].dir.split('/');
				obj.list[i].dirread = '../'+split[split.length-1]
			}
		}
		//console.log(obj);
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
		
		dom.find('.notif').removeClass('done');
		dom.find('.notif').removeClass('error');
		
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
			
			var notifdom = dom.find('.notif');
			
			var counter = 0,
		     cDisplay = document.getElementById("counter");
		     format = function(t) {
		         var minutes = Math.floor(t/600),
		             seconds = Math.floor( (t/10) % 60),
		             mili = Math.floor(t % 10);
		         minutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
		         seconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
		         mili = (mili < 10) ? "0"+mili : mili;
		         notifdom.text(minutes + ":" + seconds + ":" + mili);
		     };
		    var timer = setInterval(function() {
		       counter++;
		       format(counter);
		    },100);
		    
		    
		    
			GLOB_jq('#footer').text('Working...');
			
			var output = '';
			cmd(exec, dir,function (data) {
				/*
data += '';
				data = data.replace('[4m','');
				data = data.replace('[24m','');
				data = data.replace('[32m','');
				data = data.replace('[39m','');
	
*/
				
				
				data = data.replace(/"(.*?)"/gi, "<span class='syntax_blue'>$1</span>");
				
				data = data.replace(/\[4m(.*?)\[24m/gi, "<span class='syntax_underline'>$1</span>");
				data = data.replace(/\[32m(.*?)\[39m/gi, "<span class='syntax_green'>$1</span>");
				
				GLOB_jq('#main-right').find('.live').html(data);
				
				var str = data.substr(0,35);
				GLOB_jq('#footer').html(str+'...');
				
				output = output+data+'<br>';
				GLOB_jq('#main-right').find('.output').html(output);
				
				//var hljs = require('highlight.js');
				//hljs.highlightBlock(GLOB_jq('#main-right').find('.output').get(0));
				//hljs.initHighlighting();
				
			}, function (data) {
				GLOB_jq('#main-right').find('.error').text(data).show();
				dom.removeClass('spinner');
				//GLOB_jq('#toolbar-console').trigger('click');
				dom.find('.notif').addClass('error');
				GLOB_jq('#main-right').find('.live').text('');
				clearInterval ( timer );
				GLOB_jq('#footer').text('Error!');
			}, function (code) {
				GLOB_jq('#main-right').find('.code').text(code).show();
				
				GLOB_jq('#main-right').find('.output').html(output);
				
				dom.find('.notif').addClass('done');
				dom.removeClass('spinner');
				clearInterval ( timer );
				GLOB_jq('#footer').text('Done!');
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
	
	
	GLOB_jq('#toolbar-console, #footer').on('click', function (e) {
		//gui.Window.width = 500;
		var win = gui.Window.get();
		
		if ( GLOB_jq(e.currentTarget).hasClass('open') ) {
			win.width = 250;
			GLOB_jq(e.currentTarget).removeClass('open');
			GLOB_jq('#main-right').hide();
		} else {
			win.width = 650;
			GLOB_jq(e.currentTarget).addClass('open');
			GLOB_jq('#main-right').show();
		}
		
		
	});
	
	
	GLOB_jq('#toolbar-edit').on('click', function () {
		editList();
	});
	
	GLOB_jq('#toolbar-save').on('click', function () {
		var newObj = [];
		var kill = false;
		GLOB_jq('#page-edit-list .item').each(function (i,k) {
			var title = GLOB_jq(k).find('.title').val();
			var exec = GLOB_jq(k).find('.exec').val();
			
			if (!GLOB_jq(k).hasClass('new')) {
				
			
				if (!title || title == '') {
					GLOB_jq(k).find('.title').addClass('required');
					kill = true;
					//return false;
				} else {
					GLOB_jq(k).find('.title').removeClass('required');
				}
			
			
				if (!exec || exec == '') {
					GLOB_jq(k).find('.exec').addClass('required');
					kill = true;
				} else {
					GLOB_jq(k).find('.exec').removeClass('required');
				}
			}
			var dir = GLOB_jq(k).find('.dir').val();

			if (title && exec) {
				newObj.push({'title':title, 'exec':exec, 'dir':dir});
			}
		});
		if (!kill) {
			_db_btn.object.list = newObj;
			_db_btn.save();
			showList();
		}
		
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
	
	
	ls.stdout.setEncoding('utf8').on('data', function (data) {
	  //console.log('stdout: ' + data);
	  	
	  //GLOB_jq('#main-right').find('.live').text(data);
	  //output += data;
	  //GLOB_jq('#main-right').find('.output').text(output);
	  if (live) {
		  live(data);
	  }

	});
	
	ls.stderr.setEncoding('utf8').on('data', function (data) {
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



