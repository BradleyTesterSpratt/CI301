build:
	browserify libs/browserify.js -o libs/bundle.js
	http-server