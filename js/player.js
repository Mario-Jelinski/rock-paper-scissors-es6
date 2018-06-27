/*global module */

module.exports = class Player {
    constructor() {
        this._name = '';
        this._score = 0;
    }

    get score() {
        return this._score;
    }

    get name() {
        return this._name;
    }

    set score(score) {
        this._score = score;
    }   

    set name(name) {
        this._name = name;
    } 
}