build:
	npm install
	browserify libs/browserify.js -o libs/bundle.js
	http-server

test:
	npm install
	npm test