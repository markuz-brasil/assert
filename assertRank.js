
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
