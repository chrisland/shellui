module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
	    options: {
	      separator: ';',
	      banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n/*! build <%= grunt.template.today("yyyy-mm-dd_HH:MM") %> */\n/*! author Christian Marienfeld - http://chrisland.com */\n'
	    },
	    dist: {
	      src: [ //'source/js/jquery-2.0.3.min.js',
	      		// 'source/js/jquery-ui-1.10.3.custom.min.js',
		  		 //'source/assets/jquery.cl.spinner/jquery.cl.spinner.js',
		  		 //'source/assets/jquery.cl.unit/jquery.cl.unit.js',
		  		 //'source/assets/spectrum/spectrum.js',
		  		 //'source/js/cssjson.js',
		  		 //'source/assets/codemirror-3.20/lib/codemirror.js',
		  		 //'source/assets/codemirror-3.20/mode/css/css.js',
		  		 //'source/assets/codemirror-3.20/mode/javascript/javascript.js',
		  		 //'source/assets/codemirror-3.20/mode/htmlmixed/htmlmixed.js',
		  		 //'source/assets/codemirror-3.20/mode/xml/xml.js',
		  		 'source/js/app.js'
		  ],
	      dest: 'source/shellui.min.js',
	    },
	},
	cssmin: {
	  add_banner: {
	    options: {
	      banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n/*! build <%= grunt.template.today("yyyy-mm-dd_HH:MM") %> */\n/*! author Christian Marienfeld - http://chrisland.com */\n'
	    },
	    files: {
	      'source/style/style.min.css': [
	      	'source/style/style.css'
	      	//'source/style/normal/ui-lightness/jquery-ui-1.10.3.custom.min.css',
	      	//'source/assets/jpicker/jPicker.css',
	      	//'source/assets/spectrum/spectrum.css',
	      	//'source/assets/codemirror-3.20/lib/codemirror.css',
	      	//'source/assets/codemirror-3.20/theme/paraiso-light.css'
	      ]
	    }
	  }
	},
	nodewebkit: {
		options: {
			version: '0.9.2',
			app_name: '<%= pkg.name %>',
			app_version: '<%= pkg.version %>',
			build_dir: './release', // Where the build version of my node-webkit app is saved
			mac: true, // We want to build it for mac
			win: false, // We want to build it for win
			linux32: false, // We don't need linux32
			linux64: false, // We don't need linux64
			mac_icns: 'icon.icns',
			credits: 'credits.html'
		},
		src: ['./source/**/*'] // Your node-wekit app
	},
	watch: {
	  scripts: {
	    files: ['source/*.html','source/js/*.js','source/lib/*.js','source/style/*.css','source/templates/*'],
	    tasks: ['default'],
	    options: {
	      spawn: false,
	    }
	  }
	},
	open : {
	    default : {
	      path: './release/releases/ShellUi/mac/ShellUi.app'
	    }
	}
  });
  
  
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  //grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-watch');
  
  
  // Default task(s).
  grunt.registerTask('default', ['concat','cssmin','nodewebkit','open']);

};