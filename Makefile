init:
	npm install

build:
	browserify libs/browserify.js -o libs/bundle.js
	http-server

test:
	npm test