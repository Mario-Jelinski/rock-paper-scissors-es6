/*global module */

class Solver {
    constructor() {
        this.choices = ["rock", "spock", "paper", "lizard", "scissors"];
        this.map = {};
    }

    init() {
        let self = this;        
        this.choices.forEach(function(choice, i) {
            self.map[choice] = {};
            for (let j = 0, half = (self.choices.length-1)/2; j < self.choices.length; j++) {
                let opposition = (i+j)%self.choices.length
                if (!j)
                    self.map[choice][choice] = "0"  // tie
                else if (j <= half)
                    self.map[choice][self.choices[opposition]] = 2; //player 2
                else
                    self.map[choice][self.choices[opposition]] = 1; //player 1
            }
        });        
    }
    compare(choice1, choice2) {
        return (this.map[choice1] || {})[choice2] || -1;
    }
}


if (typeof (module) !== 'undefined') {
    module.exports = Solver;
}

