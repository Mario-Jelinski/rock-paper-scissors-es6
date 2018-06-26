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
	uglifyjs -c -m -o public/js/game.js js/game.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o public/js/computer.js js/computer.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o public/js/player.js js/player.js --source-map "root='/',url='$(@F).map'"
	uglifyjs -c -m -o public/js/solver.js js/solver.js --source-map "root='/',url='$(@F).map'"

clean:
	rm -vrf public/js
	rm -vf css/*

test:
	mocha -R min -C tests/*
