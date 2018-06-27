/*global Player, Computer, Solver, module */
/* exported Player, Computer, Solver */

let Player = require('./player.js');
let Computer = require('./computer.js');
let Solver = require('./solver.js');

class Game {    
    constructor() {
        this.config = {
            game_start:    "game-start",
            radio_button:   "game-mode",
            radio_choice:   "choice",
            result_box:     "result-box",
            game_result:    "game-result",
            game_score:    "game-score",
            mode_button:    "switch-mode",
            extended_mode:  "extended-mode",
            choices_box:    "choices-box"
        };

        this.player = null;
        this.computer1 = null;
        this.computer2 = null;

        this.isRunning = false;
        this.solver = null;
        this.framecounter = 0;
        this.intervalID = null;
        
        this.result_box1 = null;
        this.result_box2 = null;
        this.imgArray = [];
        this.choices = ["rock", "paper", "scissors", "lizard", "spock"];
        this.gameMode = "p-vs-c";
        this.maxChoices = 3;
    }

    init() {
        this.player = new Player;
        this.computer1 = new Computer;
        this.computer2 = new Computer;
        this.solver = new Solver;
        this.solver.init();

        this.computer1.name = 'Computer 1';
        this.computer2.name = 'Computer 2';

        this.result_box1 = document.getElementById(this.config.result_box + '1');
        this.result_box2 = document.getElementById(this.config.result_box + '2');

        this.initImageElements();
        let game_button_elem = document.getElementById(this.config.game_start);
        game_button_elem.addEventListener("click", this.start.bind(this), false);

        let mode_button_elem = document.getElementById(this.config.mode_button);
        mode_button_elem.addEventListener("click", this.toggleChoices.bind(this), false);

        let game_modes_buttons = document.querySelectorAll('input[name="' + this.config.radio_button + '"]');
        
        for (let i = 0; i < game_modes_buttons.length; i++) {
            game_modes_buttons[i].addEventListener("change", this.toggleMode.bind(this), false);
        }
        
    }  
    initImageElements() {    
        this.imgArray[0] = '<img src="img/rock.jpg">';
        this.imgArray[1] = '<img src="img/paper.jpg">';
        this.imgArray[2] = '<img src="img/scissors.jpg">';
        this.imgArray[3] = '<img src="img/lizard.jpg">';
        this.imgArray[4] = '<img src="img/spock.jpg">';
    }

        start () {
            if(!this.isRunning) {
                this.isRunning = true;
                document.getElementById(this.config.game_result).innerHTML = '';
                this.gameMode = document.querySelector('input[name="' + this.config.radio_button + '"]:checked').value;
                this.intervalID = setInterval(this.run.bind(this), 100);
            }
        }
        toggleChoices() {
            let display = 'none';
            if(this.maxChoices == 3) {
                this.maxChoices = 5;
                display = 'inline';
            }
            else {
                this.maxChoices = 3;
            }

            let extended_buttons = document.getElementsByClassName(this.config.extended_mode);
            for (let i = 0; i < extended_buttons.length; i++) {
                extended_buttons[i].style.display = display;
            }
        }
        toggleMode() {
            let display = 'none';
            if(this.gameMode == 'p-vs-c') {
                this.gameMode = 'c_vs_c';
            }
            else {
                this.gameMode = 'p-vs-c';
                display = 'block';
            }
            document.getElementById(this.config.game_score).innerHTML = '';
            document.getElementById(this.config.game_result).innerHTML = '';
            document.getElementById(this.config.choices_box).style.display = display;
            this.player.score = 0;
            this.computer1.score = 0;
            this.computer2.score = 0;
        }
    
    setRandomPics () {
        let number1 = Math.floor((Math.random() * this.maxChoices));
        let number2 = Math.floor((Math.random() * this.maxChoices));
        this.result_box1.innerHTML = this.imgArray[number1];
        this.result_box2.innerHTML = this.imgArray[number2];
    }
    printResult(result) {
        let message = '';
        let score1 = 0;
        let score2 = 0;

        if(this.gameMode == 'p-vs-c') {
            if(result == 0)                
                message = 'Tie';
            else if (result == 1) {
                this.player.score = this.player.score + 1;
                message = 'You won';
            }
            else {
                this.computer2.score = this.computer2.score + 1;
                message = 'You lost';
            }
            score1 = this.player.score;
            score2 = this.computer2.score;
        }
        else {
            if(result == 0)
                message = 'Tie';
            else {
                let name = '';
                if(result == 1) {
                    this.computer1.score = this.computer1.score + 1;
                    name = this.computer1.name;
                }
                else {
                    this.computer2.score = this.computer2.score + 1;
                    name = this.computer2.name;
                }
                message = name + ' won';
            }

            score1 = this.computer1.score;
            score2 = this.computer2.score;
        }
        
        document.getElementById(this.config.game_result).innerHTML = message;
        document.getElementById(this.config.game_score).innerHTML = score1 + ' : ' + score2;
    }
    findIndex(choice) {
        for (let i = 0; i < this.choices.length; i++) {
            if(this.choices[i] == choice)            
                return i;
        }
        return 0;
    }
    run() {
        if (this.framecounter == 30) {
            this.isRunning = false;
            this.framecounter = 0;
            clearInterval(this.intervalID);
            let choice = null;
            if(this.gameMode == 'p-vs-c')
                choice = document.querySelector('input[name="' + this.config.radio_choice + '"]:checked').value;
            else
                choice = this.choices[this.computer1.calculateChoice(this.maxChoices)];

            let choice2 = this.choices[this.computer2.calculateChoice(this.maxChoices)];           
            let result = this.solver.compare(choice, choice2);            
            this.result_box1.innerHTML = this.imgArray[this.findIndex(choice)];
            this.result_box2.innerHTML = this.imgArray[this.findIndex(choice2)];
            this.printResult(result);
        } 
        else {            
            this.setRandomPics();
            this.framecounter++;
        }
    }
}

let game = new Game();
game.init();