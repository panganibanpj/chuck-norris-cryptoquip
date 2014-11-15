/*
	Make sure you've run:
		npm install
		bower install

	Dev build: grunt DEV --keep_console
		Watches ./app

	Release build: grunt RELEASE
		Bower install

	--keep_console is optional

*/
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	var keep_console = grunt.option('keep_console');


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		bower: {
			install: {
				options: {
					targetDir : './app/components',
					cleanBowerDir : false,
					install: false
				}
			}
		},
		clean: {
			main: [
				'./dist'
			],
			dist: [
				'./dist/assets/css'
			]
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: './app',
					src: [
						'./**'
					],
					dest: './dist',
					filter: 'isFile'
				}]
			}
		},

		useminPrepare: {
			html: './app/index.html',
			options: {
				flow: {
					html: {
						steps: {
							js: [
								'uglifyjs'
							],
							css: [
								'cssmin'
							]
						},
						post: {}
					}
				},
				root: './',
				dest: './dist'
			}
		},
		usemin: {
			html: './dist/index.html'
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: true,
				compress: {
					drop_console: !keep_console
				},
				sourceMap: true
			}
		},

		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			sourcemaps: {
				src: [
					'./dist/*.map'
				]
			},
			assets: {
				src: [
					'./dist/*.min.js',
					'./dist/*.min.css'
				]
			}
		},
		userev: {
			options: {
				hash: /(\.[a-f0-9]{8})\.[a-z]+$/,
			},
			sourcemaps: {
				src: [
					'./dist/*.min.css',
					'./dist/*.min.js',
					'./dist/*.map'
				],
				options: {
					patterns: {
						'Linking versioned source maps': /sourceMappingURL=([a-z0-9.]*\.map)/
					}
				}
			}
		},

		watch: {
			all: {
				files: [
					'./app/**'
				],
				tasks: [
					'default'
				],
				options: {
					nospawn: true
				}
			}
		}
	});


	grunt.registerTask('productionalize', [ //Minification and cache bust
		'useminPrepare'
		,'uglify:generated'
		,'cssmin:generated'
		,'filerev:sourcemaps'
		,'userev'
		,'filerev:assets'
		,'usemin'
		,'clean:dist'
	]);
	grunt.registerTask('default', [
		'bower'
		,'clean:main'
		,'copy'
	]);

	grunt.registerTask('DEV', [
		'default'
		,'watch'
	]);
	grunt.registerTask('RELEASE', [
		'default'
		,'productionalize'
	]);
};
