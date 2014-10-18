(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";
exports.assertRank = assertRank;
exports.rank = rank;
exports.rankCheck = rankCheck;
exports.equalCheck = equalCheck;

var RankToken = function() {
  var RankToken = function RankToken(base, assert, equal) {
    this.base = base
    this.assert = assert
    this.equal = equal

    this.is = this.is.bind(this)
    this.isEqual = this.isEqual.bind(this)
  };

  Object.defineProperties(RankToken.prototype, {
    is: {
      writable: true,
      value: function(value) { return this.assert(this.base, value) }
    },

    isEqual: {
      writable: true,
      value: function(value) { return this.equal(this.base, value) }
    }
  });

  return RankToken;
}();

exports.RankToken = RankToken;
function assertRank (base) {

  return new RankToken(base, rankCheck, equalCheck)
}

function rank (value) {
  // minimal assertions to detect all native ES5 types

  return [
    (typeof value === 'boolean')|0,
    (typeof value === 'number')|0,
    (typeof value === 'string')|0,
    (typeof value === 'function')|0,

    (value === void 0)|0,
    (value === null)|0,
    (value === value)|0,  // 0 if NaN

    (value instanceof Array)|0,
    (value instanceof RegExp)|0,
    (value instanceof Date)|0,
    (value instanceof Error)|0,

  ].join('')
}

function rankCheck (val0, val1) { return !!(rank(val0) === rank(val1)) }
function equalCheck (val0, val1) { return !!(val0 === val1) }

},{}],2:[function(require,module,exports){
"use strict";
exports.test = test;
var assertRank = require('./assertRank').assertRank;
var assert = require('./index').assert;
var define = require('./index').define;


var isArray = assertRank([]).is;


var NoPrimitiveType = function() {
  var NoPrimitiveType = function NoPrimitiveType() {};
  return NoPrimitiveType;
}();

function testTypes () {
  function fn0 () {}

  function fn1 (value, base) {
    return typeof value === 'object'
  }

  function fn2 (value, base) {
    return typeof value === 'string'
  }

  function fn3 (value, base) {
    return isArray(value)
  }

  var A0, A1, A2

  console.log('*** assert(null).is(SomeFunc) ***')
  A0 = [true, 10, 'a', null, {}, function() {}, [],]
  A1 = [ fn0, fn1, fn2, fn3, ]
  A2 = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, true, false],
    [false, true, false, false],
    [false, true, false, false],
    [true, false, false, false],
    [false, true, false, true],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(SomeFunc).is(null) ***')
  A0 = [ fn0, fn1, fn2 ]
  A1 = [true, 10, 'a', null, {}, function() {}, []]
  A2 = [
    [false, false, false, false, false, true, false],
    [false, false, false, true, true, false, true ],
    [false, false, true, false, false, false, false ],
    [false, false, false, false, false, false, true ],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(null).is(assert(null)) ***')
  A0 = [true, 10, 'a', null, {}, function() {}, [], 'b']
  A1 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(function() {}), assert([]), assert('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, false, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(assert(null)).is(null) ***')
  A0 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(function() {}), assert([]), assert('b')]
  A1 = [true, 10, 'a', null, {}, function() {}, [], 'b']
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, false, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(assert(null)).is(assert(null)) ***')
  A0 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(function() {}), assert([]), assert('b')]
  A1 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(function() {}), assert([]), assert('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, false, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** self reference test ***')
  testAssertions(typeList, typeList, makeKeyTable(), assert)

}

function testStruct () {
  var A0, A1, A2;


  console.log('\n\n--- testing struct ---\n\n');
  console.log('*** assert(assert(null)).is(assert(null)) ***');

  A0 = [{k3: true, $k1: 'v1',  _k2: 'v2', s: {}, s0: [], s1: NaN, }, assert(10), 'a', assert(null), assert({}), assert(function() {}), assert([]), assert('b')];
  // A0 = [{}, assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  // A1 = [{}, assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  A1 = [{$k1: 'v1',  _k2: 'v2', k3: true, s: {}, s1: NaN, s0: [], }, assert(10), 'a', null, assert({}), assert(function() {}), assert([]), assert('b')];
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, false, false, false, false, false, true],
  ];
  console.log('testing strucs 0');
  testAssertions(A0, A1, A2, assert);

  var ty = assert.ctor();

  for (var _iterator = A0[Symbol.iterator](), _step; !(_step = _iterator.next()).done; ) {
    var val0 = _step.value;
    ty.define(val0, ty.assert(val0).assert);
  }

  console.log('testing strucs 1');
  testAssertions(A0, A1, A2, ty.assert);
}

var objNull = Object.create(null);
objNull.hi$ = NaN;
objNull.$hi = '$world';

var typeList = [
  0, 1, 2, 3, 0, 1, 2, true, false, true, false,
  Math.PI, Math.E, Math.PI, 2.34, Math.E,
  null, null, undefined, void 0, NaN, NaN,
  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,

  [], [{}], {}, NaN, NaN, objNull, Object.create(null), function place (){}, function(){},
  new Error, new Date, new RegExp, new Error, new Date, /regexp/,

  'string', 'another', 'string',
];


var ss = [
  {k3: true, $k1: 'v1',  _k2: 'v2', s: {}, s0: [], s1: NaN, },
  {$k1: 'v1',  _k2: 'v2', k3: true, s: {}, s1: NaN, s0: [], },
];

var c = 23;
var structList = [];
while (--c) {
  structList.push(ss[0])
  structList.push(ss[1])
}

function makeKeyTable () {
  return [
  /* 00: 0 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 01: 1 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 02: 2 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 03: 3 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 04: 0 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 05: 1 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 06: 2 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 07: true */    [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 08: false */   [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 09: true */    [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 10: false */   [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 11: Math.PI */ [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 12: Math.E */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 13: Math.PI */ [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 14: 2.34 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 15: Math.E */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 16: null */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 17: null */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 18: undefined */ [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 19: void 0 */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 20: NaN */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 21: NaN */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 22: Number.NEGATIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 23: Number.POSITIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 24: Number.NEGATIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 25: Number.POSITIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 26: [] */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 27: [{}] */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 28: {} */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 29: NaN */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 30: NaN */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 31: Object.create(null) */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 32: Object.create(null) */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 33: function place (){} */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false,],
  /* 34: function(){} */           [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false,],
  /* 35: new Error */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false,],
  /* 36: new Date */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false,],
  /* 37: new RegExp */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false,],
  /* 38: new Error */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false,],
  /* 39: new Date  */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false,],
  /* 40: new RegExp */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false,],
  /* 41: 'string' */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true,],
  /* 42: 'another' */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false,],
  /* 43: 'string' */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true,],
  ]
}

function testAssertions (listA, listB, keyTable, assert) {
  var errCounter = 0
  var counter = 0
  var t0 = new Date

  listA.forEach(function(val0, key0) {

    try { val0|0 }
    catch (e) { val0 = new NoPrimitiveType }

    var token = assert(val0)
    listB.forEach(function(val1, key1) {
      var expectedAns = keyTable[key0][key1]

      if (expectedAns === 0) { return }

      try { val1|0 }
      catch (e) { val1 = new NoPrimitiveType }

      counter++
      var isMatch = token.is(val1)
      var msg = ['Expected assert(', val0, ').is(', val1, ') === ', expectedAns, ' but got ', isMatch, ' (', key0, ', ', key1, ')'].join('')

      if (isMatch !== expectedAns) {
        console.log(msg, '\n val0:', assert(val0), '\n val1:', assert(val1))
        errCounter++
      }
    })
  })

  if (errCounter === 0) {
    console.log("matched all " + counter + " assertion tests")
  }
  else {
    console.log("" + errCounter + " test failed out of " + listA.length * listB.length )
  }

  var t1 = new Date
    var testMsg = "\n  it took " + (t1 - t0) + " ms to complete all  " + counter + " test at an avg of " + (listA.length * listB.length/(t1 - t0) | 0) + " assertions/ms\n  "
  console.log(testMsg)
}

function runPerf() {
  console.log('--- perf ---');

  // making the test array twice as long. Ah how I whish spread array support
  var typeL = [];
  var structL = [];
  typeList.forEach(function(v, k) {
    typeL[k] = v
    typeL[typeList.length + k] = v
  });

  structList.forEach(function(v, k) {
    structL[k] = v
    structL[structList.length + k] = v
  });

  // JIT warm up
  var t0 = new Date();
  var ty = assert.ctor();

  perf(assertRank, typeL);
  perf(assertRank, typeL);
  console.log('start');
  console.log('\n\n:: "native" typed assert (stateless)::', typeL.length * typeL.length,'times \n\n', perf(assertRank, typeL), '\n');

  // JIT warm up
  perf(assert, typeL);
  perf(assert, typeL);
  console.log('start');
  console.log('\n\n:: undefined typed assert (stateless)::', typeL.length * typeL.length ,'times \n\n', perf(assert, typeL), '\n');

  for (var _iterator2 = typeL[Symbol.iterator](), _step2; !(_step2 = _iterator2.next()).done; ) {
    var val0 = _step2.value;
    define(val0);
  }

  // JIT warm up
  perf(assert, typeL);
  perf(assert, typeL);
  console.log('start');
  console.log('\n\n:: defined typed assert (statefull)::', typeL.length * typeL.length ,'times \n\n', perf(assert, typeL), '\n');

  for (var _iterator3 = typeL[Symbol.iterator](), _step3; !(_step3 = _iterator3.next()).done; ) {
    var val0 = _step3.value;
    ty.define(val0,  function typeTest (value, base) {
      return true
    });
  }

  perf(ty.assert, typeL);
  perf(ty.assert, typeL);
  console.log('start');
  console.log('\n\n:: defined typed fake assert (statefull)::', typeL.length * typeL.length ,'times \n\n', perf(ty.assert, typeL), '\n');

  console.log('######## structs #######');

  // JIT warm up
  perf(assert, structL);
  perf(assert, structL);
  console.log('start');
  console.log('\n\n:: undefined struct assert (stateless)::', structL.length * structL.length ,'times \n\n', perf(assert, structL), '\n');


  for (var _iterator4 = structL[Symbol.iterator](), _step4; !(_step4 = _iterator4.next()).done; ) {
    var val0 = _step4.value;
    define(val0);
  }

  // JIT warm up
  perf(assert, structL);
  perf(assert, structL);
  console.log('start');
  console.log('\n\n:: defined struct assert (statefull)::', structL.length * structL.length ,'times \n\n', perf(assert, structL), '\n');

  for (var _iterator5 = structL[Symbol.iterator](), _step5; !(_step5 = _iterator5.next()).done; ) {
    var val0 = _step5.value;
    ty.define(val0, function structTest (value, base) {
      return true
    });
  }

  // JIT warm up
  perf(ty.assert, structL);
  perf(ty.assert, structL);
  console.log('start');
  // for (var item of storageType.values()) {
  //   console.log(item)
  // }
  console.log('\n\n:: defined struct fake assert (statefull)::', structL.length * structL.length ,'times \n\n', perf(ty.assert, structL), '\n');
}

function perf (assert, list) {
  var res = [], t0, t1
  // preping the cached assertion array
  var isItList = list.map(function(v0) {
    return assert(v0).is.bind(assert(v0))
  })


  t0 = new Date
  for (var k0 in list) {
    for (var isIt in isItList) {
      assert(list[k0]).is(list[k0])
    }
  }
  t1 = new Date
  res.push("  dynamic assertion speed: " + ((list.length * list.length)/(t1 - t0) | 0) + " assertions/ms")

  t0 = new Date
  for (var k0 in list) {
    for (var k1 in isItList) {
      isItList[k1](list[k0]) // almost twice as fast as non cached version
    }
  }
  t1 = new Date
  res.push("    cached assertion speed: " + ((list.length * list.length)/(t1 - t0) | 0) + " assertions/ms")

  var store =  new Map
  list.forEach(function(v) {
    store.set(v, assert(v))
  })

  t0 = new Date
  for (var k0 in list) {
    for (var k1 in list) {
      if (store.has(list[k0])) {
        store.get(list[k0]).is(list[k1])
      }
    }
  }
  t1 = new Date
  res.push("map-cached assertion speed: " + ((list.length * list.length)/(t1 - t0) | 0) + " assertions/ms")

  return res.join('\n')
}


function test () {
  testTypes()
  runPerf()
  testStruct()
}

test();

},{"./assertRank":1,"./index":3}],3:[function(require,module,exports){

"use strict";
exports.rank = rank;

var TypeToken = function() {
  var TypeToken = function TypeToken(type, assertFunc, equalFunc) {
    if (!(this instanceof TypeToken)) { return new TypeToken(type, assertFunc, equalFunc) }
    if (isFunction(type) && !isFunction(assertFunc)) { assertFunc = type }

    this.base = type
    this.assert = isFunction(assertFunc) ? assertFunc : defaultAssert
    this.equal = isFunction(equalFunc) ? equalFunc : defaultEqual

    this.is = defaultIs.bind(this)
    this.isnt = defaultIsnt.bind(this)
    this.isEqual = defaultIsEqual.bind(this)
  };

  return TypeToken;
}();

exports.TypeToken = TypeToken;
function rank (value) {
  // minimal set of assertions to detect all native ES5 types
  return [
    (value === value)|0,  // 0 if NaN
    (value === void 0)|0,
    (value === null)|0,

    (typeof value === 'boolean')|0,
    (typeof value === 'number')|0,
    (typeof value === 'string')|0,
    (typeof value === 'function')|0,

    (value instanceof Array)|0,
    (value instanceof RegExp)|0,
    (value instanceof Date)|0,
    (value instanceof Error)|0,

  ].join('')
}

function ctor (storage) {
  if (this instanceof ctor) { return ctor(storage) }
  var ctx = {storage: (storage instanceof Map) ? storage : new Map}

  return {
    assert: assertToken.bind(ctx),
    define: defineToken.bind(ctx),
    storage: ctx.storage,
  }
}

var _ref = ctor();
var assert = _ref.assert;
var define = _ref.define;
var storage = _ref.storage;
exports.assert = assert;
exports.define = define;
exports.storage = storage;

assert.define = define;
assert.storage = storage;
assert.TypeToken;
assert.ctor = ctor;

function isFunction (item) { return typeof item === 'function' }
function isObject (item) { return typeof item === 'object' && item !== null }
function isString(item) { return typeof item === 'string' }
var isArray = Array.isArray;

function defaultIs (value) { return !!this.assert(value, this.base) }
function defaultIsnt (value) { return !this.assert(value, this.base) }
function defaultIsEqual (value) { return !!this.equal(value, this.base) }
function defaultEqual (value, base) { return value === base }

function defineToken(type, assertFunc, equalFunc) {
  if (equalFunc === undefined)
    equalFunc = defaultEqual;

  if (assertFunc === undefined)
    assertFunc = defaultAssert;

  if (type instanceof TypeToken) { return type }
  if (this.storage.has(type)) { return this.storage.get(type)}

  var token = new TypeToken(type, assertFunc, equalFunc);
  this.storage.set(type, Object.freeze(token));
  return token;
}

function assertToken (base) {
  if (base instanceof TypeToken) { return base }
  if (this.storage.has(base)) { return this.storage.get(base) }

  return new TypeToken(base, defaultAssert, defaultEqual)
}

function defaultAssert (value, base) {
  var isValid, baseIs, valueIs
  if (value === base) { return true }

  if (base instanceof TypeToken) { baseIs = base.is; base = base.base }
  if (value instanceof TypeToken) { valueIs = value.is; value = value.base }
  if (value === base) { return true }

  if (isString(value) && isString(base) && value !== '' && base !== '') {
    return value === base
  }

  if (isArray(value) && value.length) {
    if (listAssert(value, base) === true) { return true}
    isValid = false
  }

  if (isArray(base) && base.length) {
    if (listAssert(base, value) === true) { return true}
    isValid = false
  }

  if (!isArray(value) && isObject(value) && Object.keys(value).length && !(value instanceof TypeToken)) {
    if (structAssert(value, base) === true) { return true }
    isValid = false
  }

  if (!isArray(base) && isObject(base) && Object.keys(base).length && !(base instanceof TypeToken)) {
    if (structAssert(base, value) === true) { return true }
    isValid = false
  }

  if (isValid === false) { return false }

  if (isFunction(valueIs)) {
    isValid = valueIs(base)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(value)) {
    isValid = value(base)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(baseIs)) {
    isValid = baseIs(value)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(base)) {
    isValid = base(value)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  return rank(base) === rank(value)
}

function listAssert (typeList, value) {
  for (var item in typeList) {
    if (assert(value).is(typeList[item]) === true) {
      return true
    }
  }

  if (isArray(value)) {
    for (var item in value) {
      if (assert(value[item]).is(typeList) === true) {
        return true
      }
    }
  }
  return false
}

function structAssert (typeStruct, value) {
  if (!isObject(typeStruct) || !isObject(value)) { return false }

  for (var item in typeStruct) {
    if (assert(value[item]).is(typeStruct[item]) === false) {
      return false
    }
  }

  return true
}




},{}]},{},[2])