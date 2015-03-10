module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	var keep_console = grunt.option('keep_console');


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			main: [
				'./dist'
			],
			dist: [
				'./dist/common/common.css',
				'./dist/*/',
				'!./dist/assets/'
			]
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: './src',
						src: [
							'./index.html',
							'./common/**',
							'./assets/**'
						],
						dest: './dist',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: './src/app',
						src: './main.js',
						dest: './dist',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: './bower_components/requirejs/',
						src: './require.js',
						dest: './dist',
						filter: 'isFile'
					}
				]
			},
			dev: {
				files: [{
					expand: true,
					cwd: './src',
					src: [
						'./app/**',
						'!./app/main.js'
					],
					dest: './dist',
					filter: 'isFile'
				}]
			}
		},

		sass: {
			main: {
				options: {
					style: 'nested',
					sourcemap: 'none'
				},
				files: [{
					expand: true,
					cwd: './src',
					src: [
						"./common/common.scss",
						"./app/*/*.scss"
					],
					dest: "./dist",
					ext: '.css'
				}]
			}
		},
		requirejs: {
			main: {
				options: {
					baseUrl: './src',
					name: './app/main',
					mainConfigFile: './src/app/main.js',
					paths: {
						'angular': '../bower_components/angular/angular.min',
						'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
						'angular-ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
						'text': '../bower_components/requirejs-text/text'
					},
					optimize: 'uglify2',
					uglify2: {
						compress: {
							drop_console: !keep_console
						}
					},
					// generateSourceMaps: true,
					preserveLicenseComments: false,
					out: './dist/main.js'
				}
			},
			dev: {
				options: {
					baseUrl: './src',
					name: './app/main',
					mainConfigFile: './src/app/main.js',
					optimize: 'none',
					out: './dist/main.js'
				}
			}
		},
		useminPrepare: {
			html: './dist/index.html',
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
				// banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: true,
				compress: {
					drop_console: !keep_console
				}
				// ,sourceMap: true
			}
		},

		watch: {
			all: {
				files: [
					'./app/**'
				],
				tasks: [
					'start'
					,'localDeploy'
				],
				options: {
					nospawn: true
				}
			}
		}
	});


	grunt.registerTask('productionalize', [ //Minification and cache bust
		'requirejs:main'
		,'useminPrepare'
		,'cssmin:generated'
		,'usemin'
		,'clean:dist'
	]);
	grunt.registerTask('start', [
		'clean:main'
		,'copy:main'
		,'sass'
	]);
	grunt.registerTask('default', [
		'start'
		,'copy:dev'
		// ,'requirejs:dev'
	]);
	grunt.registerTask('RELEASE', [
		'start'
		,'productionalize'
		,'clean:dist'
	]);
};
