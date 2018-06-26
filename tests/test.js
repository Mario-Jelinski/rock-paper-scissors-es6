let assert = require('assert');
let Solver = require('../js/solver');

describe('solver', function() {
  let solver = new Solver;
  before(function() {
    solver.init();
  });
  
  it('compare should return Tie (0)', function() {  
    assert.equal(0, solver.compare('paper', 'paper'));
  });
  it('Player 1 should win', function() {
    assert.equal(1, solver.compare('scissors', 'paper'));
  });
  it('Player 2 should win', function() {
    assert.equal(2, solver.compare('rock', 'paper'));
  });
  it('Player 2 should win', function() {
    assert.equal(2, solver.compare('spock', 'lizard'));
  });
});
