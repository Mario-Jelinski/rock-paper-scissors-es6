(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*global Player */

var Computer = function Computer() {
    Player.call(this);
    this.names = ['Amiga', 'Atari', 'Z80'];
};

Computer.prototype = (0, _create2.default)(Player.prototype);

Computer.prototype.createName = function () {
    var number = Math.floor(Math.random() * 3);
    this.name = this.names[number];
};

Computer.prototype.calculateChoice = function (length) {
    return Math.floor(Math.random() * length);
};

},{"babel-runtime/core-js/object/create":5}],2:[function(require,module,exports){
"use strict";

/*global Player, Computer, Solver, module */
var Game = function Game() {

    this.config = {
        game_start: "game-start",
        radio_button: "game-mode",
        radio_choice: "choice",
        result_box: "result-box",
        game_result: "game-result",
        game_score: "game-score",
        mode_button: "switch-mode",
        extended_mode: "extended-mode",
        choices_box: "choices-box"
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
};

Game.prototype = {
    init: function init() {
        this.player = new Player();
        this.computer1 = new Computer();
        this.computer2 = new Computer();
        this.solver = new Solver();
        this.solver.init();

        this.computer1.setName('Computer 1');
        this.computer2.setName('Computer 2');

        this.result_box1 = document.getElementById(this.config.result_box + '1');
        this.result_box2 = document.getElementById(this.config.result_box + '2');

        this.initImageElements();
        var game_button_elem = document.getElementById(this.config.game_start);
        game_button_elem.addEventListener("click", this.handler.start.bind(this), false);

        var mode_button_elem = document.getElementById(this.config.mode_button);
        mode_button_elem.addEventListener("click", this.handler.toggleChoices.bind(this), false);

        var game_modes_buttons = document.querySelectorAll('input[name="' + this.config.radio_button + '"]');

        for (var i = 0; i < game_modes_buttons.length; i++) {
            game_modes_buttons[i].addEventListener("change", this.handler.toggleMode.bind(this), false);
        }
    },
    initImageElements: function initImageElements() {
        this.imgArray[0] = '<img src="img/rock.jpg">';
        this.imgArray[1] = '<img src="img/paper.jpg">';
        this.imgArray[2] = '<img src="img/scissors.jpg">';
        this.imgArray[3] = '<img src="img/lizard.jpg">';
        this.imgArray[4] = '<img src="img/spock.jpg">';
    },
    handler: {
        start: function start() {
            if (!this.isRunning) {
                this.isRunning = true;
                document.getElementById(this.config.game_result).innerHTML = '';
                this.gameMode = document.querySelector('input[name="' + this.config.radio_button + '"]:checked').value;
                this.intervalID = setInterval(this.run.bind(this), 100);
            }
        },
        toggleChoices: function toggleChoices() {
            var display = 'none';
            if (this.maxChoices == 3) {
                this.maxChoices = 5;
                display = 'inline';
            } else {
                this.maxChoices = 3;
            }

            var extended_buttons = document.getElementsByClassName(this.config.extended_mode);
            for (var i = 0; i < extended_buttons.length; i++) {
                extended_buttons[i].style.display = display;
            }
        },
        toggleMode: function toggleMode() {
            var display = 'none';
            if (this.gameMode == 'p-vs-c') {
                this.gameMode = 'c_vs_c';
            } else {
                this.gameMode = 'p-vs-c';
                display = 'block';
            }
            document.getElementById(this.config.game_score).innerHTML = '';
            document.getElementById(this.config.game_result).innerHTML = '';
            document.getElementById(this.config.choices_box).style.display = display;
            this.player.setScore(0);
            this.computer1.setScore(0);
            this.computer2.setScore(0);
        }
    },
    setRandomPics: function setRandomPics() {
        var number1 = Math.floor(Math.random() * this.maxChoices);
        var number2 = Math.floor(Math.random() * this.maxChoices);
        this.result_box1.innerHTML = this.imgArray[number1];
        this.result_box2.innerHTML = this.imgArray[number2];
    },
    printResult: function printResult(result) {
        var message = '';
        var score1 = 0;
        var score2 = 0;

        if (this.gameMode == 'p-vs-c') {
            if (result == 0) message = 'Tie';else if (result == 1) {
                this.player.setScore(this.player.getScore() + 1);
                message = 'You won';
            } else {
                this.computer2.setScore(this.computer2.getScore() + 1);
                message = 'You lost';
            }
            score1 = this.player.getScore();
            score2 = this.computer2.getScore();
        } else {
            if (result == 0) message = 'Tie';else {
                var name = '';
                if (result == 1) {
                    this.computer1.setScore(this.computer1.getScore() + 1);
                    name = this.computer1.getName();
                } else {
                    this.computer2.setScore(this.computer2.getScore() + 1);
                    name = this.computer2.getName();
                }
                message = name + ' won';
            }

            score1 = this.computer1.getScore();
            score2 = this.computer2.getScore();
        }

        document.getElementById(this.config.game_result).innerHTML = message;
        document.getElementById(this.config.game_score).innerHTML = score1 + ' : ' + score2;
    },
    findIndex: function findIndex(choice) {
        for (var i = 0; i < this.choices.length; i++) {
            if (this.choices[i] == choice) return i;
        }
        return 0;
    },
    run: function run() {
        if (this.framecounter == 30) {
            this.isRunning = false;
            this.framecounter = 0;
            clearInterval(this.intervalID);
            var choice = null;
            if (this.gameMode == 'p-vs-c') choice = document.querySelector('input[name="' + this.config.radio_choice + '"]:checked').value;else choice = this.choices[this.computer1.calculateChoice(this.maxChoices)];

            var choice2 = this.choices[this.computer2.calculateChoice(this.maxChoices)];
            var result = this.solver.compare(choice, choice2);
            this.result_box1.innerHTML = this.imgArray[this.findIndex(choice)];
            this.result_box2.innerHTML = this.imgArray[this.findIndex(choice2)];
            this.printResult(result);
        } else {
            this.setRandomPics();
            this.framecounter++;
        }
    }
};

if (typeof module !== 'undefined') {
    module.exports = Game;
}

},{}],3:[function(require,module,exports){
"use strict";

var Player = function Player() {

    this.score = 0;
    this.name = "Player";
};

Player.prototype = {
    setScore: function setScore(score) {
        this.score = score;
    },
    getScore: function getScore() {
        return this.score;
    },
    setName: function setName(name) {
        this.name = name;
    },
    getName: function getName() {
        return this.name;
    }
};

},{}],4:[function(require,module,exports){
"use strict";

/*global module */
var Solver = function Solver() {

    this.choices = ["rock", "spock", "paper", "lizard", "scissors"];
    this.map = {};
};

Solver.prototype = {
    init: function init() {
        var self = this;
        this.choices.forEach(function (choice, i) {
            self.map[choice] = {};
            for (var j = 0, half = (self.choices.length - 1) / 2; j < self.choices.length; j++) {
                var opposition = (i + j) % self.choices.length;
                if (!j) self.map[choice][choice] = "0"; // tie
                else if (j <= half) self.map[choice][self.choices[opposition]] = 2; //player 2
                    else self.map[choice][self.choices[opposition]] = 1; //player 1
            }
        });
    },
    compare: function compare(choice1, choice2) {
        return (this.map[choice1] || {})[choice2] || -1;
    }
};

if (typeof module !== 'undefined') {
    module.exports = Solver;
}

},{}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":6}],6:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":11,"../../modules/es6.object.create":41}],7:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],8:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":25}],9:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":35,"./_to-iobject":37,"./_to-length":38}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],11:[function(require,module,exports){
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],12:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":7}],13:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":19,"./_is-object":25}],16:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],17:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":11,"./_ctx":12,"./_global":19,"./_has":20,"./_hide":21}],18:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],20:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],21:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":28,"./_property-desc":32}],22:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":19}],23:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],24:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":10}],25:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],26:[function(require,module,exports){
module.exports = true;

},{}],27:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":8,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":22,"./_object-dps":29,"./_shared-key":33}],28:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":8,"./_descriptors":14,"./_ie8-dom-define":23,"./_to-primitive":39}],29:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":8,"./_descriptors":14,"./_object-dp":28,"./_object-keys":31}],30:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":9,"./_has":20,"./_shared-key":33,"./_to-iobject":37}],31:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":30}],32:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],33:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":34,"./_uid":40}],34:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":11,"./_global":19,"./_library":26}],35:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":36}],36:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],37:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":24}],38:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":36}],39:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":25}],40:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],41:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":17,"./_object-create":27}]},{},[2,1,3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wdXRlci5qcyIsImpzL2dhbWUuanMiLCJqcy9wbGF5ZXIuanMiLCJqcy9zb2x2ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWFic29sdXRlLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7QUFFQSxJQUFJLFdBQVcsU0FBWCxRQUFXLEdBQVk7QUFDdkIsV0FBTyxJQUFQLENBQVksSUFBWjtBQUNBLFNBQUssS0FBTCxHQUFhLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsS0FBbkIsQ0FBYjtBQUNILENBSEQ7O0FBTUEsU0FBUyxTQUFULEdBQXFCLHNCQUFjLE9BQU8sU0FBckIsQ0FBckI7O0FBR0EsU0FBUyxTQUFULENBQW1CLFVBQW5CLEdBQWlDLFlBQVk7QUFDdEMsUUFBSSxTQUFTLEtBQUssS0FBTCxDQUFZLEtBQUssTUFBTCxLQUFnQixDQUE1QixDQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFaO0FBQ04sQ0FIRDs7QUFLQSxTQUFTLFNBQVQsQ0FBbUIsZUFBbkIsR0FBcUMsVUFBVSxNQUFWLEVBQWtCO0FBQ25ELFdBQU8sS0FBSyxLQUFMLENBQVksS0FBSyxNQUFMLEtBQWdCLE1BQTVCLENBQVA7QUFDSCxDQUZEOzs7OztBQ2hCQTtBQUNBLElBQUksT0FBTyxTQUFQLElBQU8sR0FBWTs7QUFFbkIsU0FBSyxNQUFMLEdBQWM7QUFDVixvQkFBZSxZQURMO0FBRVYsc0JBQWdCLFdBRk47QUFHVixzQkFBZ0IsUUFITjtBQUlWLG9CQUFnQixZQUpOO0FBS1YscUJB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qZ2xvYmFsIFBsYXllciAqL1xuXG52YXIgQ29tcHV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgUGxheWVyLmNhbGwodGhpcyk7ICAgIFxuICAgIHRoaXMubmFtZXMgPSBbJ0FtaWdhJywgJ0F0YXJpJywgJ1o4MCddO1xufTtcblxuXG5Db21wdXRlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBsYXllci5wcm90b3R5cGUpO1xuXG5cbkNvbXB1dGVyLnByb3RvdHlwZS5jcmVhdGVOYW1lID0gIGZ1bmN0aW9uICgpIHtcbiAgICAgICBsZXQgbnVtYmVyID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDMpKTtcbiAgICAgICB0aGlzLm5hbWUgPSB0aGlzLm5hbWVzW251bWJlcl07XG59O1xuXG5Db21wdXRlci5wcm90b3R5cGUuY2FsY3VsYXRlQ2hvaWNlID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogbGVuZ3RoKSk7XG59O1xuIiwiLypnbG9iYWwgUGxheWVyLCBDb21wdXRlciwgU29sdmVyLCBtb2R1bGUgKi9cbnZhciBHYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICBnYW1lX3N0YXJ0OiAgICBcImdhbWUtc3RhcnRcIixcbiAgICAgICAgcmFkaW9fYnV0dG9uOiAgIFwiZ2FtZS1tb2RlXCIsXG4gICAgICAgIHJhZGlvX2Nob2ljZTogICBcImNob2ljZVwiLFxuICAgICAgICByZXN1bHRfYm94OiAgICAgXCJyZXN1bHQtYm94XCIsXG4gICAgICAgIGdhbWVfcmVzdWx0OiAgICBcImdhbWUtcmVzdWx0XCIsXG4gICAgICAgIGdhbWVfc2NvcmU6ICAgIFwiZ2FtZS1zY29yZVwiLFxuICAgICAgICBtb2RlX2J1dHRvbjogICAgXCJzd2l0Y2gtbW9kZVwiLFxuICAgICAgICBleHRlbmRlZF9tb2RlOiAgXCJleHRlbmRlZC1tb2RlXCIsXG4gICAgICAgIGNob2ljZXNfYm94OiAgICBcImNob2ljZXMtYm94XCJcbiAgICB9O1xuXG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY29tcHV0ZXIxID0gbnVsbDtcbiAgICB0aGlzLmNvbXB1dGVyMiA9IG51bGw7XG5cbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuc29sdmVyID0gbnVsbDtcbiAgICB0aGlzLmZyYW1lY291bnRlciA9IDA7XG4gICAgdGhpcy5pbnRlcnZhbElEID0gbnVsbDtcbiAgICBcbiAgICB0aGlzLnJlc3VsdF9ib3gxID0gbnVsbDtcbiAgICB0aGlzLnJlc3VsdF9ib3gyID0gbnVsbDtcbiAgICB0aGlzLmltZ0FycmF5ID0gW107XG4gICAgdGhpcy5jaG9pY2VzID0gW1wicm9ja1wiLCBcInBhcGVyXCIsIFwic2Npc3NvcnNcIiwgXCJsaXphcmRcIiwgXCJzcG9ja1wiXTtcbiAgICB0aGlzLmdhbWVNb2RlID0gXCJwLXZzLWNcIjtcbiAgICB0aGlzLm1heENob2ljZXMgPSAzO1xufTtcblxuR2FtZS5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXI7XG4gICAgICAgIHRoaXMuY29tcHV0ZXIxID0gbmV3IENvbXB1dGVyO1xuICAgICAgICB0aGlzLmNvbXB1dGVyMiA9IG5ldyBDb21wdXRlcjtcbiAgICAgICAgdGhpcy5zb2x2ZXIgPSBuZXcgU29sdmVyO1xuICAgICAgICB0aGlzLnNvbHZlci5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5jb21wdXRlcjEuc2V0TmFtZSgnQ29tcHV0ZXIgMScpO1xuICAgICAgICB0aGlzLmNvbXB1dGVyMi5zZXROYW1lKCdDb21wdXRlciAyJyk7XG5cbiAgICAgICAgdGhpcy5yZXN1bHRfYm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29uZmlnLnJlc3VsdF9ib3ggKyAnMScpO1xuICAgICAgICB0aGlzLnJlc3VsdF9ib3gyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcucmVzdWx0X2JveCArICcyJyk7XG5cbiAgICAgICAgdGhpcy5pbml0SW1hZ2VFbGVtZW50cygpO1xuICAgICAgICBsZXQgZ2FtZV9idXR0b25fZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29uZmlnLmdhbWVfc3RhcnQpO1xuICAgICAgICBnYW1lX2J1dHRvbl9lbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhhbmRsZXIuc3RhcnQuYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgIGxldCBtb2RlX2J1dHRvbl9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcubW9kZV9idXR0b24pO1xuICAgICAgICBtb2RlX2J1dHRvbl9lbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhhbmRsZXIudG9nZ2xlQ2hvaWNlcy5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgbGV0IGdhbWVfbW9kZXNfYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCInICsgdGhpcy5jb25maWcucmFkaW9fYnV0dG9uICsgJ1wiXScpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lX21vZGVzX2J1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdhbWVfbW9kZXNfYnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMuaGFuZGxlci50b2dnbGVNb2RlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCAgICBcbiAgICBpbml0SW1hZ2VFbGVtZW50czogZnVuY3Rpb24gKCkgeyAgICBcbiAgICAgICAgdGhpcy5pbWdBcnJheVswXSA9ICc8aW1nIHNyYz1cImltZy9yb2NrLmpwZ1wiPic7XG4gICAgICAgIHRoaXMuaW1nQXJyYXlbMV0gPSAnPGltZyBzcmM9XCJpbWcvcGFwZXIuanBnXCI+JztcbiAgICAgICAgdGhpcy5pbWdBcnJheVsyXSA9ICc8aW1nIHNyYz1cImltZy9zY2lzc29ycy5qcGdcIj4nO1xuICAgICAgICB0aGlzLmltZ0FycmF5WzNdID0gJzxpbWcgc3JjPVwiaW1nL2xpemFyZC5qcGdcIj4nO1xuICAgICAgICB0aGlzLmltZ0FycmF5WzRdID0gJzxpbWcgc3JjPVwiaW1nL3Nwb2NrLmpwZ1wiPic7XG4gICAgfSxcbiAgICBoYW5kbGVyOiB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZighdGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcuZ2FtZV9yZXN1bHQpLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU1vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiJyArIHRoaXMuY29uZmlnLnJhZGlvX2J1dHRvbiArICdcIl06Y2hlY2tlZCcpLnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKHRoaXMucnVuLmJpbmQodGhpcyksIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZUNob2ljZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBkaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgaWYodGhpcy5tYXhDaG9pY2VzID09IDMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1heENob2ljZXMgPSA1O1xuICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnaW5saW5lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWF4Q2hvaWNlcyA9IDM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBleHRlbmRlZF9idXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLmNvbmZpZy5leHRlbmRlZF9tb2RlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5kZWRfYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGV4dGVuZGVkX2J1dHRvbnNbaV0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBpZih0aGlzLmdhbWVNb2RlID09ICdwLXZzLWMnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lTW9kZSA9ICdjX3ZzX2MnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lTW9kZSA9ICdwLXZzLWMnO1xuICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcuZ2FtZV9zY29yZSkuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbmZpZy5nYW1lX3Jlc3VsdCkuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbmZpZy5jaG9pY2VzX2JveCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5zZXRTY29yZSgwKTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZXIxLnNldFNjb3JlKDApO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlcjIuc2V0U2NvcmUoMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFJhbmRvbVBpY3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbnVtYmVyMSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiB0aGlzLm1heENob2ljZXMpKTtcbiAgICAgICAgbGV0IG51bWJlcjIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogdGhpcy5tYXhDaG9pY2VzKSk7XG4gICAgICAgIHRoaXMucmVzdWx0X2JveDEuaW5uZXJIVE1MID0gdGhpcy5pbWdBcnJheVtudW1iZXIxXTtcbiAgICAgICAgdGhpcy5yZXN1bHRfYm94Mi5pbm5lckhUTUwgPSB0aGlzLmltZ0FycmF5W251bWJlcjJdO1xuICAgIH0sXG4gICAgcHJpbnRSZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSAnJztcbiAgICAgICAgbGV0IHNjb3JlMSA9IDA7XG4gICAgICAgIGxldCBzY29yZTIgPSAwO1xuXG4gICAgICAgIGlmKHRoaXMuZ2FtZU1vZGUgPT0gJ3AtdnMtYycpIHtcbiAgICAgICAgICAgIGlmKHJlc3VsdCA9PSAwKSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJ1RpZSc7XG4gICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQgPT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnNldFNjb3JlKHRoaXMucGxheWVyLmdldFNjb3JlKCkgKyAxKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJ1lvdSB3b24nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlcjIuc2V0U2NvcmUodGhpcy5jb21wdXRlcjIuZ2V0U2NvcmUoKSArIDEpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAnWW91IGxvc3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NvcmUxID0gdGhpcy5wbGF5ZXIuZ2V0U2NvcmUoKTtcbiAgICAgICAgICAgIHNjb3JlMiA9IHRoaXMuY29tcHV0ZXIyLmdldFNjb3JlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihyZXN1bHQgPT0gMClcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJ1RpZSc7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXIxLnNldFNjb3JlKHRoaXMuY29tcHV0ZXIxLmdldFNjb3JlKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHRoaXMuY29tcHV0ZXIxLmdldE5hbWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXIyLnNldFNjb3JlKHRoaXMuY29tcHV0ZXIyLmdldFNjb3JlKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHRoaXMuY29tcHV0ZXIyLmdldE5hbWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IG5hbWUgKyAnIHdvbic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3JlMSA9IHRoaXMuY29tcHV0ZXIxLmdldFNjb3JlKCk7XG4gICAgICAgICAgICBzY29yZTIgPSB0aGlzLmNvbXB1dGVyMi5nZXRTY29yZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbmZpZy5nYW1lX3Jlc3VsdCkuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcuZ2FtZV9zY29yZSkuaW5uZXJIVE1MID0gc2NvcmUxICsgJyA6ICcgKyBzY29yZTI7XG4gICAgfSxcbiAgICBmaW5kSW5kZXg6IGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNob2ljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMuY2hvaWNlc1tpXSA9PSBjaG9pY2UpICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBydW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5mcmFtZWNvdW50ZXIgPT0gMzApIHtcbiAgICAgICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZyYW1lY291bnRlciA9IDA7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJRCk7XG4gICAgICAgICAgICBsZXQgY2hvaWNlID0gbnVsbDtcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZU1vZGUgPT0gJ3AtdnMtYycpXG4gICAgICAgICAgICAgICAgY2hvaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIicgKyB0aGlzLmNvbmZpZy5yYWRpb19jaG9pY2UgKyAnXCJdOmNoZWNrZWQnKS52YWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjaG9pY2UgPSB0aGlzLmNob2ljZXNbdGhpcy5jb21wdXRlcjEuY2FsY3VsYXRlQ2hvaWNlKHRoaXMubWF4Q2hvaWNlcyldO1xuXG4gICAgICAgICAgICBsZXQgY2hvaWNlMiA9IHRoaXMuY2hvaWNlc1t0aGlzLmNvbXB1dGVyMi5jYWxjdWxhdGVDaG9pY2UodGhpcy5tYXhDaG9pY2VzKV07ICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnNvbHZlci5jb21wYXJlKGNob2ljZSwgY2hvaWNlMik7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnJlc3VsdF9ib3gxLmlubmVySFRNTCA9IHRoaXMuaW1nQXJyYXlbdGhpcy5maW5kSW5kZXgoY2hvaWNlKV07XG4gICAgICAgICAgICB0aGlzLnJlc3VsdF9ib3gyLmlubmVySFRNTCA9IHRoaXMuaW1nQXJyYXlbdGhpcy5maW5kSW5kZXgoY2hvaWNlMildO1xuICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdChyZXN1bHQpO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0UmFuZG9tUGljcygpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZWNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5pZiAodHlwZW9mIChtb2R1bGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gR2FtZTtcbn1cbiIsInZhciBQbGF5ZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLm5hbWUgPSBcIlBsYXllclwiO1xufTtcblxuUGxheWVyLnByb3RvdHlwZSA9IHtcbiAgICBzZXRTY29yZTogZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBzY29yZTtcbiAgICB9LFxuICAgIGdldFNjb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3JlO1xuICAgIH0sXG4gICAgc2V0TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9LFxuICAgIGdldE5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG59OyIsIi8qZ2xvYmFsIG1vZHVsZSAqL1xudmFyIFNvbHZlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHRoaXMuY2hvaWNlcyA9IFtcInJvY2tcIiwgXCJzcG9ja1wiLCBcInBhcGVyXCIsIFwibGl6YXJkXCIsIFwic2Npc3NvcnNcIl07XG4gICAgdGhpcy5tYXAgPSB7fTtcbiAgICAgICAgXG59O1xuXG5Tb2x2ZXIucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzOyAgICAgICAgXG4gICAgICAgIHRoaXMuY2hvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNob2ljZSwgaSkge1xuICAgICAgICAgICAgc2VsZi5tYXBbY2hvaWNlXSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGhhbGYgPSAoc2VsZi5jaG9pY2VzLmxlbmd0aC0xKS8yOyBqIDwgc2VsZi5jaG9pY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wcG9zaXRpb24gPSAoaStqKSVzZWxmLmNob2ljZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgaWYgKCFqKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFtjaG9pY2VdW2Nob2ljZV0gPSBcIjBcIiAgLy8gdGllXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaiA8PSBoYWxmKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFtjaG9pY2VdW3NlbGYuY2hvaWNlc1tvcHBvc2l0aW9uXV0gPSAyOyAvL3BsYXllciAyXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFtjaG9pY2VdW3NlbGYuY2hvaWNlc1tvcHBvc2l0aW9uXV0gPSAxOyAvL3BsYXllciAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAgICAgICAgXG4gICAgfSxcbiAgICBjb21wYXJlOiBmdW5jdGlvbihjaG9pY2UxLCBjaG9pY2UyKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5tYXBbY2hvaWNlMV0gfHwge30pW2Nob2ljZTJdIHx8IC0xO1xuICAgIH1cbn07XG5cbmlmICh0eXBlb2YgKG1vZHVsZSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTb2x2ZXI7XG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGUoUCwgRCkge1xuICByZXR1cm4gJE9iamVjdC5jcmVhdGUoUCwgRCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjcnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBoYXMoZXhwb3J0cywga2V5KSkgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IGNyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpIH0pO1xuIl19
