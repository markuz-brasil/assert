
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



