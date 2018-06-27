SHELL := /bin/bash
export PATH := node_modules/.bin/:$(PATH)

.PHONY: clean styles all

.SUFFIXES:

.PRECIOUS: public/js/%.js

all:

styles: 
	lessc --clean-css less/styles.less css/styles.css

build:
	eslint js/game.js js/computer.js js/player.js js/solver.js
	mkdir -p public/js
	browserify -o public/js/game.js js/game.js --debug --transform [ babelify --presets [ es2017 ] --plugins [ babel-plugin-transform-runtime babel-plugin-transform-async-to-generator ] ] --plugin browserify-derequire
	uglifyjs -c -m -o js/game.js public/js/game_es6.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o js/computer.js public/js/computer.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o js/player.js public/js/player.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o js/solver.js public/js/solver.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o public/js/game.js public/js/game.js --source-map "root='/',url='$(@F).map'"

clean:
	rm -vrf public/js
	rm -vf css/*

test:
	mocha -R min -C tests/*
