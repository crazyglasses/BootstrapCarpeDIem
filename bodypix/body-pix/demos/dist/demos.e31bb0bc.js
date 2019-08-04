// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js":[function(require,module,exports) {
var process = require("process");
var global = arguments[3];
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backend = qe;
exports.buffer = zr;
exports.customGrad = kn;
exports.deprecationWarn = Ae;
exports.disableDeprecationWarnings = ke;
exports.dispose = Me;
exports.disposeVariables = Te;
exports.enableDebugMode = Ne;
exports.enableProdMode = Se;
exports.fill = $n;
exports.findBackend = ze;
exports.findBackendFactory = Ve;
exports.getBackend = We;
exports.grad = En;
exports.grads = Rn;
exports.keep = Fe;
exports.linspace = jn;
exports.memory = De;
exports.nextFrame = Xh;
exports.ones = qn;
exports.op = Tn;
exports.print = Vr;
exports.profile = _e;
exports.range = Kn;
exports.ready = Le;
exports.registerBackend = Ge;
exports.removeBackend = Ue;
exports.scalar = Pn;
exports.setBackend = Pe;
exports.setPlatform = He;
exports.tensor = Bn;
exports.tensor1d = Ln;
exports.tensor2d = Wn;
exports.tensor3d = Un;
exports.tensor4d = zn;
exports.tensor5d = Vn;
exports.tensor6d = Gn;
exports.tidy = Oe;
exports.time = Be;
exports.valueAndGrad = In;
exports.valueAndGrads = Sn;
exports.variableGrads = Nn;
exports.zeros = Hn;
exports.leakyRelu = exports.isNaN = exports.isInf = exports.isFinite = exports.irfft = exports.io = exports.image = exports.imag = exports.ifft = exports.hannWindow = exports.hammingWindow = exports.greaterStrict = exports.greaterEqualStrict = exports.greaterEqual = exports.greater = exports.gatherND = exports.gather = exports.fused = exports.frame = exports.floorDiv = exports.floor = exports.fft = exports.eye = exports.expm1 = exports.expandDims = exports.exp = exports.erf = exports.equalStrict = exports.equal = exports.environment = exports.elu = exports.dropout = exports.dot = exports.divStrict = exports.div = exports.depthwiseConv2d = exports.depthToSpace = exports.cumsum = exports.cosh = exports.cos = exports.conv3d = exports.conv2dTranspose = exports.conv2dDerFilter = exports.conv2d = exports.conv1d = exports.concat4d = exports.concat3d = exports.concat2d = exports.concat1d = exports.concat = exports.complex = exports.clone = exports.clipByValue = exports.ceil = exports.cast = exports.browser = exports.batchToSpaceND = exports.batchNormalization4d = exports.batchNormalization3d = exports.batchNormalization2d = exports.batchNormalization = exports.batchNorm4d = exports.batchNorm3d = exports.batchNorm2d = exports.batchNorm = exports.basicLSTMCell = exports.backend_util = exports.avgPool = exports.atanh = exports.atan2 = exports.atan = exports.asinh = exports.asin = exports.argMin = exports.argMax = exports.any = exports.all = exports.addStrict = exports.addN = exports.add = exports.acosh = exports.acos = exports.abs = exports.Variable = exports.TensorBuffer = exports.Tensor = exports.SGDOptimizer = exports.Reduction = exports.Rank = exports.RMSPropOptimizer = exports.Optimizer = exports.MomentumOptimizer = exports.KernelBackend = exports.Environment = exports.ENV = exports.DataStorage = exports.AdamaxOptimizer = exports.AdamOptimizer = exports.AdagradOptimizer = exports.AdadeltaOptimizer = void 0;
exports.tanh = exports.tan = exports.sum = exports.subStrict = exports.sub = exports.stridedSlice = exports.step = exports.stack = exports.squeeze = exports.squaredDifferenceStrict = exports.squaredDifference = exports.square = exports.sqrt = exports.split = exports.spectral = exports.sparseToDense = exports.spaceToBatchND = exports.softplus = exports.softmax = exports.slice4d = exports.slice3d = exports.slice2d = exports.slice1d = exports.slice = exports.sinh = exports.sin = exports.signal = exports.sign = exports.sigmoid = exports.setdiff1dAsync = exports.serialization = exports.separableConv2d = exports.selu = exports.scatterND = exports.rsqrt = exports.round = exports.rfft = exports.reverse4d = exports.reverse3d = exports.reverse2d = exports.reverse1d = exports.reverse = exports.reshape = exports.relu = exports.reciprocal = exports.real = exports.randomUniform = exports.randomNormal = exports.rand = exports.prod = exports.prelu = exports.powStrict = exports.pow = exports.pool = exports.pad4d = exports.pad3d = exports.pad2d = exports.pad1d = exports.pad = exports.outerProduct = exports.onesLike = exports.oneHot = exports.notEqualStrict = exports.notEqual = exports.norm = exports.neg = exports.multinomial = exports.multiRNNCell = exports.mulStrict = exports.mul = exports.movingAverage = exports.moments = exports.modStrict = exports.mod = exports.minimumStrict = exports.minimum = exports.min = exports.mean = exports.maximumStrict = exports.maximum = exports.maxPool = exports.max = exports.math = exports.matMul = exports.losses = exports.logicalXor = exports.logicalOr = exports.logicalNot = exports.logicalAnd = exports.logSumExp = exports.logSoftmax = exports.logSigmoid = exports.log1p = exports.log = exports.localResponseNormalization = exports.linalg = exports.lessStrict = exports.lessEqualStrict = exports.lessEqual = exports.less = void 0;
exports.zerosLike = exports.whereAsync = exports.where = exports.webgl = exports.version_core = exports.variable = exports.util = exports.unstack = exports.unsortedSegmentSum = exports.truncatedNormal = exports.transpose = exports.train = exports.topk = exports.tile = exports.test_util = exports.tensor_util = void 0;

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var t = function (e, n) {
  return (t = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (t, e) {
    t.__proto__ = e;
  } || function (t, e) {
    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
  })(e, n);
};

function e(e, n) {
  function r() {
    this.constructor = e;
  }

  t(e, n), e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
}

var n = function () {
  return (n = Object.assign || function (t) {
    for (var e, n = 1, r = arguments.length; n < r; n++) for (var o in e = arguments[n]) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);

    return t;
  }).apply(this, arguments);
};

function r(t, e, n, r) {
  return new (n || (n = Promise))(function (o, a) {
    function i(t) {
      try {
        u(r.next(t));
      } catch (t) {
        a(t);
      }
    }

    function s(t) {
      try {
        u(r.throw(t));
      } catch (t) {
        a(t);
      }
    }

    function u(t) {
      t.done ? o(t.value) : new n(function (e) {
        e(t.value);
      }).then(i, s);
    }

    u((r = r.apply(t, e || [])).next());
  });
}

function o(t, e) {
  var n,
      r,
      o,
      a,
      i = {
    label: 0,
    sent: function () {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return a = {
    next: s(0),
    throw: s(1),
    return: s(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function () {
    return this;
  }), a;

  function s(a) {
    return function (s) {
      return function (a) {
        if (n) throw new TypeError("Generator is already executing.");

        for (; i;) try {
          if (n = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, a[1])).done) return o;

          switch (r = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;

            case 4:
              return i.label++, {
                value: a[1],
                done: !1
              };

            case 5:
              i.label++, r = a[1], a = [0];
              continue;

            case 7:
              a = i.ops.pop(), i.trys.pop();
              continue;

            default:
              if (!(o = (o = i.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                i = 0;
                continue;
              }

              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                i.label = a[1];
                break;
              }

              if (6 === a[0] && i.label < o[1]) {
                i.label = o[1], o = a;
                break;
              }

              if (o && i.label < o[2]) {
                i.label = o[2], i.ops.push(a);
                break;
              }

              o[2] && i.ops.pop(), i.trys.pop();
              continue;
          }

          a = e.call(t, i);
        } catch (t) {
          a = [6, t], r = 0;
        } finally {
          n = o = 0;
        }

        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([a, s]);
    };
  }
}

var a,
    i = function () {
  function t(t) {
    this.global = t, this.flags = {}, this.flagRegistry = {}, this.urlFlags = {}, this.populateURLFlags();
  }

  return t.prototype.setPlatform = function (t, e) {
    null != this.platform && console.warn("Platform " + this.platformName + " has already been set. Overwriting the platform with " + e + "."), this.platformName = t, this.platform = e;
  }, t.prototype.registerFlag = function (t, e, n) {
    if (this.flagRegistry[t] = {
      evaluationFn: e,
      setHook: n
    }, null != this.urlFlags[t]) {
      var r = this.urlFlags[t];
      console.warn("Setting feature override from URL " + t + ": " + r + "."), this.set(t, r);
    }
  }, t.prototype.get = function (t) {
    return t in this.flags ? this.flags[t] : (this.flags[t] = this.evaluateFlag(t), this.flags[t]);
  }, t.prototype.getNumber = function (t) {
    return this.get(t);
  }, t.prototype.getBool = function (t) {
    return this.get(t);
  }, t.prototype.getFlags = function () {
    return this.flags;
  }, Object.defineProperty(t.prototype, "features", {
    get: function () {
      return this.flags;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.set = function (t, e) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot set flag " + t + " as it has not been registered.");
    this.flags[t] = e, null != this.flagRegistry[t].setHook && this.flagRegistry[t].setHook(e);
  }, t.prototype.evaluateFlag = function (t) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot evaluate flag '" + t + "': no evaluation function found.");
    return this.flagRegistry[t].evaluationFn();
  }, t.prototype.setFlags = function (t) {
    this.flags = Object.assign({}, t);
  }, t.prototype.reset = function () {
    this.flags = {}, this.urlFlags = {}, this.populateURLFlags();
  }, t.prototype.populateURLFlags = function () {
    var t = this;

    if (void 0 !== this.global && void 0 !== this.global.location && void 0 !== this.global.location.search) {
      var e = s(this.global.location.search);
      if ("tfjsflags" in e) e.tfjsflags.split(",").forEach(function (e) {
        var n = e.split(":"),
            r = n[0],
            o = n[1];

        t.urlFlags[r] = function (t, e) {
          if ("true" === (e = e.toLowerCase()) || "false" === e) return "true" === e;
          if ("" + +e === e) return +e;
          throw new Error("Could not parse value flag value " + e + " for flag " + t + ".");
        }(r, o);
      });
    }
  }, t;
}();

exports.Environment = i;
exports.ENV = a;

function s(t) {
  var e = {};
  return t.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, function (t) {
    for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];

    return function (t, e, n) {
      t[decodeURIComponent(e)] = decodeURIComponent(n || "");
    }(e, n[0], n[1]), n.join("=");
  }), e;
}

function u(t) {
  exports.ENV = a = t;
}

var l = Object.freeze({
  Environment: i,
  getQueryParams: s,

  get ENV() {
    return a;
  },

  setEnvironmentGlobal: u
});
exports.environment = l;

function c(t) {
  for (var e = t.length, n = 0, r = 0; e > 0;) r = Math.random() * e | 0, n = t[--e], t[e] = t[r], t[r] = n;
}

function h(t, e, n) {
  return Math.max(t, Math.min(e, n));
}

function p(t) {
  return t % 2 == 0 ? t : t + 1;
}

function f(t) {
  for (var e = 0, n = 0; n < t.length; n++) e += t[n];

  return e;
}

function d(t, e) {
  if (!t) throw new Error("string" == typeof e ? e : e());
}

function v(t, e, n) {
  void 0 === n && (n = ""), d(x(t, e), function () {
    return n + " Shapes " + t + " and " + e + " must match";
  });
}

function m(t) {
  d(null != t, function () {
    return "The input to the tensor constructor must be a non-null value.";
  });
}

function g(t, e) {
  if (void 0 === e && (e = []), null == e && (e = []), Array.isArray(t) || M(t)) for (var n = 0; n < t.length; ++n) g(t[n], e);else e.push(t);
  return e;
}

function y(t) {
  if (0 === t.length) return 1;

  for (var e = t[0], n = 1; n < t.length; n++) e *= t[n];

  return e;
}

function x(t, e) {
  if (t === e) return !0;
  if (null == t || null == e) return !1;
  if (t.length !== e.length) return !1;

  for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;

  return !0;
}

function w(t) {
  return t % 1 == 0;
}

function b(t) {
  if (null != Math.tanh) return Math.tanh(t);
  if (t === 1 / 0) return 1;
  if (t === -1 / 0) return -1;
  var e = Math.exp(2 * t);
  return (e - 1) / (e + 1);
}

function C(t) {
  var e = Math.ceil(Math.sqrt(t));
  return [e, Math.ceil(t / e)];
}

function E(t, e) {
  return e <= t.length ? t : t + " ".repeat(e - t.length);
}

function R(t, e, n) {
  return void 0 === e && (e = function (t) {
    return 0;
  }), new Promise(function (r, o) {
    var a = 0,
        i = function () {
      if (t()) r();else {
        var s = e(++a);
        null != n && a >= n ? o() : setTimeout(i, s);
      }
    };

    i();
  });
}

function I(t, e) {
  for (var n = 1, r = -1, o = 0; o < t.length; ++o) if (t[o] >= 0) n *= t[o];else if (-1 === t[o]) {
    if (-1 !== r) throw Error("Shapes can only have 1 implicit size. Found -1 at dim " + r + " and dim " + o);
    r = o;
  } else if (t[o] < 0) throw Error("Shapes can not be < 0. Found " + t[o] + " at dim " + o);

  if (-1 === r) {
    if (e > 0 && e !== n) throw Error("Size(" + e + ") must match the product of shape " + t);
    return t;
  }

  if (0 === n) throw Error("Cannot infer the missing size in [" + t + "] when there are 0 elements");
  if (e % n != 0) throw Error("The implicit shape can't be a fractional number. Got " + e + " / " + n);
  var a = t.slice();
  return a[r] = e / n, a;
}

function S(t, e) {
  var n = e.length;
  return d((t = null == t ? e.map(function (t, e) {
    return e;
  }) : [].concat(t)).every(function (t) {
    return t >= -n && t < n;
  }), function () {
    return "All values in axis param must be in range [-" + n + ", " + n + ") but got axis " + t;
  }), d(t.every(function (t) {
    return w(t);
  }), function () {
    return "All values in axis param must be integers but got axis " + t;
  }), t.map(function (t) {
    return t < 0 ? n + t : t;
  });
}

function N(t, e) {
  for (var n = [], r = [], o = null == e ? null : S(e, t).sort(), a = 0, i = 0; i < t.length; ++i) {
    if (null != o) {
      if (o[a] === i && 1 !== t[i]) throw new Error("Can't squeeze axis " + i + " since its dim '" + t[i] + "' is not 1");
      (null == o[a] || o[a] > i) && 1 === t[i] && (n.push(t[i]), r.push(i)), o[a] <= i && a++;
    }

    1 !== t[i] && (n.push(t[i]), r.push(i));
  }

  return {
    newShape: n,
    keptDims: r
  };
}

function k(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else {
    if ("bool" !== t) throw new Error("Unknown data type " + t);
    n = new Uint8Array(e);
  }
  return n;
}

function A(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else if ("bool" === t) n = new Uint8Array(e);else {
    if ("string" !== t) throw new Error("Unknown data type " + t);
    n = new Array(e);
  }
  return n;
}

function T(t, e, n) {
  if ("float32" === e) for (var r = 0; r < t.length; r++) {
    var o = t[r];
    if (isNaN(o) || !isFinite(o)) throw Error("The result of the '" + n + "' is " + o + ".");
  }
}

function D(t, e) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    if (isNaN(r) || !isFinite(r)) throw Error("A tensor of type " + e + " being uploaded contains " + r + ".");
  }
}

function _(t) {
  return "bool" === t || "complex64" === t || "float32" === t || "int32" === t || "string" === t;
}

function O(t, e) {
  return "complex64" !== e && ("float32" !== e || "complex64" === t) && ("int32" !== e || "float32" === t || "complex64" === t) && ("bool" !== e || "bool" !== t);
}

function M(t) {
  return t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array;
}

function F(t) {
  if ("float32" === t || "int32" === t) return 4;
  if ("complex64" === t) return 8;
  if ("bool" === t) return 1;
  throw new Error("Unknown dtype " + t);
}

function B(t) {
  if (null == t) return 0;
  var e = 0;
  return t.forEach(function (t) {
    return e += 2 * t.length;
  }), e;
}

function P(t) {
  return "string" == typeof t || t instanceof String;
}

function L(t) {
  return "boolean" == typeof t;
}

function W(t) {
  return "number" == typeof t;
}

function U(t) {
  return Array.isArray(t) ? U(t[0]) : t instanceof Float32Array ? "float32" : t instanceof Int32Array || t instanceof Uint8Array ? "int32" : W(t) ? "float32" : P(t) ? "string" : L(t) ? "bool" : "float32";
}

function z(t) {
  return !!(t && t.constructor && t.call && t.apply);
}

function V(t, e) {
  for (var n = e; n < t; ++n) if (t % n == 0) return n;

  return t;
}

function G(t) {
  var e = t.length;
  if (e < 2) return [];
  var n = new Array(e - 1);
  n[e - 2] = t[e - 1];

  for (var r = e - 3; r >= 0; --r) n[r] = n[r + 1] * t[r + 1];

  return n;
}

function q(t, e, n) {
  if ("string" === e) throw new Error("Cannot convert a string[] to a TypedArray");
  if (Array.isArray(t) && (t = g(t)), n && D(t, e), function (t, e) {
    return t instanceof Float32Array && "float32" === e || t instanceof Int32Array && "int32" === e || t instanceof Uint8Array && "bool" === e;
  }(t, e)) return t;
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);

  if ("bool" === e) {
    for (var r = new Uint8Array(t.length), o = 0; o < r.length; ++o) 0 !== Math.round(t[o]) && (r[o] = 1);

    return r;
  }

  throw new Error("Unknown data type " + e);
}

function H(t, e) {
  if (0 === t.length) return e[0];
  var n = t.reduce(function (t, e) {
    return t * e;
  });
  if (0 === n) return [];
  if (n !== e.length) throw new Error("[" + t + "] does not match the input size.");
  return function t(e, n, r) {
    var o = new Array();
    if (1 === n.length) for (var a = n[0], i = 0; i < a; i++) o[i] = r[e + i];else {
      a = n[0];
      var s = n.slice(1),
          u = s.reduce(function (t, e) {
        return t * e;
      });

      for (i = 0; i < a; i++) o[i] = t(e + i * u, s, r);
    }
    return o;
  }(0, t, e);
}

function $(t, e) {
  for (var n = j(t, e), r = 0; r < n.length; r++) n[r] = 1;

  return n;
}

function j(t, e) {
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);
  if ("bool" === e) return new Uint8Array(t);
  throw new Error("Unknown data type " + e);
}

function K() {
  if ("undefined" != typeof performance) return performance.now();

  if ("undefined" != typeof process) {
    var t = process.hrtime();
    return 1e3 * t[0] + t[1] / 1e6;
  }

  throw new Error("Cannot measure time in this environment. You should run tf.js in the browser or in Node.js");
}

function X(t) {
  t.forEach(function (e) {
    d(Number.isInteger(e) && e >= 0, function () {
      return "Tensor must have a shape comprised of positive integers but got shape [" + t + "].";
    });
  });
}

function Y(t, e) {
  return a.platform.fetch(t, e);
}

var Q = Object.freeze({
  shuffle: c,
  clamp: h,
  nearestLargerEven: p,
  sum: f,
  randUniform: function (t, e) {
    var n = Math.random();
    return e * n + (1 - n) * t;
  },
  distSquared: function (t, e) {
    for (var n = 0, r = 0; r < t.length; r++) {
      var o = Number(t[r]) - Number(e[r]);
      n += o * o;
    }

    return n;
  },
  assert: d,
  assertShapesMatch: v,
  assertNonNull: m,
  flatten: g,
  sizeFromShape: y,
  isScalarShape: function (t) {
    return 0 === t.length;
  },
  arraysEqual: x,
  isInt: w,
  tanh: b,
  sizeToSquarishShape: C,
  createShuffledIndices: function (t) {
    for (var e = new Uint32Array(t), n = 0; n < t; ++n) e[n] = n;

    return c(e), e;
  },
  rightPad: E,
  repeatedTry: R,
  inferFromImplicitShape: I,
  parseAxisParam: S,
  squeezeShape: N,
  getTypedArrayFromDType: k,
  getArrayFromDType: A,
  checkComputationForErrors: T,
  checkConversionForErrors: D,
  isValidDtype: _,
  hasEncodingLoss: O,
  isTypedArray: M,
  bytesPerElement: F,
  bytesFromStringArray: B,
  isString: P,
  isBoolean: L,
  isNumber: W,
  inferDtype: U,
  isFunction: z,
  nearestDivisor: V,
  computeStrides: G,
  toTypedArray: q,
  toNestedArray: H,
  makeOnesTypedArray: $,
  makeZerosTypedArray: j,
  now: K,
  assertNonNegativeIntegerDimensions: X,
  fetch: Y
}),
    J = function () {
  function t(t, e) {
    this.backendTimer = t, this.logger = e, null == e && (this.logger = new Z());
  }

  return t.prototype.profileKernel = function (t, e) {
    var n,
        r = this,
        o = this.backendTimer.time(function () {
      n = e();
    });
    return (Array.isArray(n) ? n : [n]).forEach(function (e) {
      var n = e.dataSync();
      T(n, e.dtype, t), o.then(function (o) {
        var a = "";
        null != o.getExtraProfileInfo && (a = o.getExtraProfileInfo()), r.logger.logKernelProfile(t, e, n, o.kernelMs, a);
      });
    }), n;
  }, t;
}(),
    Z = function () {
  function t() {}

  return t.prototype.logKernelProfile = function (t, e, n, r, o) {
    var a = E(r + "ms", 9),
        i = E(t, 25),
        s = e.rank,
        u = e.size,
        l = E(e.shape.toString(), 14);
    console.log("%c" + i + "\t%c" + a + "\t%c" + s + "D " + l + "\t%c" + u + "\t%c" + o, "font-weight:bold", "color:red", "color:blue", "color: orange", "color: green");
  }, t;
}(),
    tt = 20,
    et = 3,
    nt = 7;

exports.util = Q;

function rt(t, e, n, r) {
  var o = G(e),
      a = function (t, e, n, r) {
    var o = y(e),
        a = r[r.length - 1],
        i = new Array(a).fill(0),
        s = e.length,
        u = "complex64" === n ? it(t) : t;
    if (s > 1) for (var l = 0; l < o / a; l++) for (var c = l * a, h = 0; h < a; h++) i[h] = Math.max(i[h], ot(u[c + h], 0, n).length);
    return i;
  }(t, e, n, o),
      i = e.length,
      s = function t(e, n, r, o, a, i) {
    void 0 === i && (i = !0);
    var s = "complex64" === r ? 2 : 1;
    var u = n[0];
    var l = n.length;

    if (0 === l) {
      if ("complex64" === r) {
        var c = it(e);
        return [ot(c[0], 0, r)];
      }

      return "bool" === r ? [at(e[0])] : [e[0].toString()];
    }

    if (1 === l) {
      if (u > tt) {
        var h = et * s,
            p = Array.from(e.slice(0, h)),
            f = Array.from(e.slice(u - et * s, u));
        return "complex64" === r && (p = it(p), f = it(f)), ["[" + p.map(function (t, e) {
          return ot(t, a[e], r);
        }).join(", ") + ", ..., " + f.map(function (t, e) {
          return ot(t, a[u - et + e], r);
        }).join(", ") + "]"];
      }

      var d = "complex64" === r ? it(e) : Array.from(e);
      return ["[" + d.map(function (t, e) {
        return ot(t, a[e], r);
      }).join(", ") + "]"];
    }

    var v = n.slice(1);
    var m = o.slice(1);
    var g = o[0] * s;
    var y = [];

    if (u > tt) {
      for (var x = 0; x < et; x++) {
        var w = x * g,
            b = w + g;
        y.push.apply(y, t(e.slice(w, b), v, r, m, a, !1));
      }

      y.push("...");

      for (var x = u - et; x < u; x++) {
        var w = x * g,
            b = w + g;
        y.push.apply(y, t(e.slice(w, b), v, r, m, a, x === u - 1));
      }
    } else for (var x = 0; x < u; x++) {
      var w = x * g,
          b = w + g;
      y.push.apply(y, t(e.slice(w, b), v, r, m, a, x === u - 1));
    }

    var C = 2 === l ? "," : "";
    y[0] = "[" + y[0] + C;

    for (var x = 1; x < y.length - 1; x++) y[x] = " " + y[x] + C;

    var E = ",\n";

    for (var x = 2; x < l; x++) E += "\n";

    y[y.length - 1] = " " + y[y.length - 1] + "]" + (i ? "" : E);
    return y;
  }(t, e, n, o, a),
      u = ["Tensor"];

  return r && (u.push("  dtype: " + n), u.push("  rank: " + i), u.push("  shape: [" + e + "]"), u.push("  values:")), u.push(s.map(function (t) {
    return "    " + t;
  }).join("\n")), u.join("\n");
}

function ot(t, e, n) {
  return E(Array.isArray(t) ? parseFloat(t[0].toFixed(nt)) + " + " + parseFloat(t[1].toFixed(nt)) + "j" : P(t) ? "'" + t + "'" : "bool" === n ? at(t) : parseFloat(t.toFixed(nt)).toString(), e);
}

function at(t) {
  return 0 === t ? "false" : "true";
}

function it(t) {
  for (var e = [], n = 0; n < t.length; n += 2) e.push([t[n], t[n + 1]]);

  return e;
}

var st = function () {
  function t(t, e, n) {
    var r = this;

    if (this.dtype = e, this.shape = t.slice(), this.size = y(t), null != n) {
      var o = n.length;
      d(o === this.size, function () {
        return "Length of values '" + o + "' does not match the size inferred by the shape '" + r.size + "'.";
      });
    }

    if ("complex64" === e) throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");
    this.values = n || A(e, this.size), this.strides = G(t);
  }

  return t.prototype.set = function (t) {
    for (var e = this, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];

    0 === n.length && (n = [0]), d(n.length === this.rank, function () {
      return "The number of provided coordinates (" + n.length + ") must match the rank (" + e.rank + ")";
    });
    var o = this.locToIndex(n);
    this.values[o] = t;
  }, t.prototype.get = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    0 === t.length && (t = [0]);

    for (var n = 0, r = 0, o = t; r < o.length; r++) {
      var a = o[r];

      if (a < 0 || a >= this.shape[n]) {
        var i = "Requested out of range element at " + t + ".   Buffer shape=" + this.shape;
        throw new Error(i);
      }

      n++;
    }

    for (var s = t[t.length - 1], u = 0; u < t.length - 1; ++u) s += this.strides[u] * t[u];

    return this.values[s];
  }, t.prototype.locToIndex = function (t) {
    if (0 === this.rank) return 0;
    if (1 === this.rank) return t[0];

    for (var e = t[t.length - 1], n = 0; n < t.length - 1; ++n) e += this.strides[n] * t[n];

    return e;
  }, t.prototype.indexToLoc = function (t) {
    if (0 === this.rank) return [];
    if (1 === this.rank) return [t];

    for (var e = new Array(this.shape.length), n = 0; n < e.length - 1; ++n) e[n] = Math.floor(t / this.strides[n]), t -= e[n] * this.strides[n];

    return e[e.length - 1] = t, e;
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.toTensor = function () {
    return ht.make(this.shape, {
      values: this.values
    }, this.dtype);
  }, t;
}(),
    ut = null,
    lt = null,
    ct = null;

exports.TensorBuffer = st;

var ht = function () {
  function t(t, e, n, r, o) {
    this.kept = !1, this.isDisposedInternal = !1, this.shape = t.slice(), this.dtype = e || "float32", this.size = y(t), this.strides = G(t), this.dataId = null != r ? r : {}, this.id = ut().nextTensorId(), this.rankType = this.rank < 5 ? this.rank.toString() : "higher", ut().registerTensor(this, o), null != n && ut().write(o, this.dataId, n);
  }

  return t.make = function (e, n, r, o) {
    return new t(e, r, n.values, n.dataId, o);
  }, t.prototype.flatten = function () {
    return this.throwIfDisposed(), this.as1D();
  }, t.prototype.asScalar = function () {
    return this.throwIfDisposed(), d(1 === this.size, function () {
      return "The array must have only 1 element.";
    }), this.reshape([]);
  }, t.prototype.as1D = function () {
    return this.throwIfDisposed(), this.reshape([this.size]);
  }, t.prototype.as2D = function (t, e) {
    return this.throwIfDisposed(), this.reshape([t, e]);
  }, t.prototype.as3D = function (t, e, n) {
    return this.throwIfDisposed(), this.reshape([t, e, n]);
  }, t.prototype.as4D = function (t, e, n, r) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r]);
  }, t.prototype.as5D = function (t, e, n, r, o) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r, o]);
  }, t.prototype.asType = function (t) {
    return this.throwIfDisposed(), lt.cast(this, t);
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.buffer = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, lt.buffer(this.shape, this.dtype, t)];
        }
      });
    });
  }, t.prototype.bufferSync = function () {
    return lt.buffer(this.shape, this.dtype, this.dataSync());
  }, t.prototype.array = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, H(this.shape, t)];
        }
      });
    });
  }, t.prototype.arraySync = function () {
    return H(this.shape, this.dataSync());
  }, t.prototype.data = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        return this.throwIfDisposed(), [2, ut().read(this.dataId)];
      });
    });
  }, t.prototype.dataSync = function () {
    return this.throwIfDisposed(), ut().readSync(this.dataId);
  }, t.prototype.dispose = function () {
    this.isDisposed || (ut().disposeTensor(this), this.isDisposedInternal = !0);
  }, Object.defineProperty(t.prototype, "isDisposed", {
    get: function () {
      return this.isDisposedInternal;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.throwIfDisposed = function () {
    if (this.isDisposed) throw new Error("Tensor is disposed.");
  }, t.prototype.toFloat = function () {
    return this.asType("float32");
  }, t.prototype.toInt = function () {
    return this.asType("int32");
  }, t.prototype.toBool = function () {
    return this.asType("bool");
  }, t.prototype.print = function (t) {
    return void 0 === t && (t = !1), lt.print(this, t);
  }, t.prototype.reshape = function (t) {
    return this.throwIfDisposed(), lt.reshape(this, t);
  }, t.prototype.reshapeAs = function (t) {
    return this.throwIfDisposed(), this.reshape(t.shape);
  }, t.prototype.expandDims = function (t) {
    return void 0 === t && (t = 0), lt.expandDims(this, t);
  }, t.prototype.cumsum = function (t, e, n) {
    return void 0 === t && (t = 0), void 0 === e && (e = !1), void 0 === n && (n = !1), lt.cumsum(this, t, e, n);
  }, t.prototype.squeeze = function (t) {
    return this.throwIfDisposed(), lt.squeeze(this, t);
  }, t.prototype.clone = function () {
    return this.throwIfDisposed(), lt.clone(this);
  }, t.prototype.oneHot = function (t, e, n) {
    return this.throwIfDisposed(), lt.oneHot(this, t, e, n);
  }, t.prototype.toString = function (t) {
    return void 0 === t && (t = !1), rt(this.dataSync(), this.shape, this.dtype, t);
  }, t.prototype.tile = function (t) {
    return this.throwIfDisposed(), lt.tile(this, t);
  }, t.prototype.gather = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), lt.gather(this, t, e);
  }, t.prototype.matMul = function (t, e, n) {
    return void 0 === e && (e = !1), void 0 === n && (n = !1), this.throwIfDisposed(), lt.matMul(this, t, e, n);
  }, t.prototype.dot = function (t) {
    return this.throwIfDisposed(), lt.dot(this, t);
  }, t.prototype.norm = function (t, e, n) {
    return void 0 === t && (t = "euclidean"), void 0 === e && (e = null), void 0 === n && (n = !1), this.throwIfDisposed(), lt.norm(this, t, e, n);
  }, t.prototype.slice = function (t, e) {
    return this.throwIfDisposed(), lt.slice(this, t, e);
  }, t.prototype.reverse = function (t) {
    return this.throwIfDisposed(), lt.reverse(this, t);
  }, t.prototype.concat = function (e, n) {
    return void 0 === n && (n = 0), this.throwIfDisposed(), e instanceof t && (e = [e]), lt.concat([this].concat(e), n);
  }, t.prototype.split = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), lt.split(this, t, e);
  }, t.prototype.stack = function (t, e) {
    return void 0 === e && (e = 0), lt.stack([this, t], e);
  }, t.prototype.unstack = function (t) {
    return void 0 === t && (t = 0), lt.unstack(this, t);
  }, t.prototype.pad = function (t, e) {
    return void 0 === e && (e = 0), lt.pad(this, t, e);
  }, t.prototype.batchNormalization = function (t, e, n, r, o) {
    return void 0 === n && (n = .001), ct("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon"), this.batchNorm(t, e, o, r, n);
  }, t.prototype.batchNorm = function (t, e, n, r, o) {
    return void 0 === o && (o = .001), this.throwIfDisposed(), lt.batchNorm(this, t, e, n, r, o);
  }, t.prototype.all = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.all(this, t, e);
  }, t.prototype.any = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.any(this, t, e);
  }, t.prototype.logSumExp = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.logSumExp(this, t, e);
  }, t.prototype.sum = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.sum(this, t, e);
  }, t.prototype.prod = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.prod(this, t, e);
  }, t.prototype.mean = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.mean(this, t, e);
  }, t.prototype.min = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.min(this, t, e);
  }, t.prototype.max = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), lt.max(this, t, e);
  }, t.prototype.argMin = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), lt.argMin(this, t);
  }, t.prototype.argMax = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), lt.argMax(this, t);
  }, t.prototype.cast = function (t) {
    return this.throwIfDisposed(), lt.cast(this, t);
  }, t.prototype.add = function (t) {
    return this.throwIfDisposed(), lt.add(this, t);
  }, t.prototype.addStrict = function (t) {
    return this.throwIfDisposed(), lt.addStrict(this, t);
  }, t.prototype.atan2 = function (t) {
    return this.throwIfDisposed(), lt.atan2(this, t);
  }, t.prototype.sub = function (t) {
    return this.throwIfDisposed(), lt.sub(this, t);
  }, t.prototype.subStrict = function (t) {
    return this.throwIfDisposed(), lt.subStrict(this, t);
  }, t.prototype.pow = function (t) {
    return this.throwIfDisposed(), lt.pow(this, t);
  }, t.prototype.powStrict = function (t) {
    return this.throwIfDisposed(), lt.powStrict(this, t);
  }, t.prototype.mul = function (t) {
    return this.throwIfDisposed(), lt.mul(this, t);
  }, t.prototype.mulStrict = function (t) {
    return this.throwIfDisposed(), lt.mulStrict(this, t);
  }, t.prototype.div = function (t) {
    return this.throwIfDisposed(), lt.div(this, t);
  }, t.prototype.floorDiv = function (t) {
    return this.throwIfDisposed(), lt.floorDiv(this, t);
  }, t.prototype.divStrict = function (t) {
    return this.throwIfDisposed(), lt.divStrict(this, t);
  }, t.prototype.minimum = function (t) {
    return this.throwIfDisposed(), lt.minimum(this, t);
  }, t.prototype.minimumStrict = function (t) {
    return this.throwIfDisposed(), lt.minimumStrict(this, t);
  }, t.prototype.maximum = function (t) {
    return this.throwIfDisposed(), lt.maximum(this, t);
  }, t.prototype.maximumStrict = function (t) {
    return this.throwIfDisposed(), lt.maximumStrict(this, t);
  }, t.prototype.mod = function (t) {
    return this.throwIfDisposed(), lt.mod(this, t);
  }, t.prototype.modStrict = function (t) {
    return this.throwIfDisposed(), lt.modStrict(this, t);
  }, t.prototype.squaredDifference = function (t) {
    return this.throwIfDisposed(), lt.squaredDifference(this, t);
  }, t.prototype.squaredDifferenceStrict = function (t) {
    return this.throwIfDisposed(), lt.squaredDifferenceStrict(this, t);
  }, t.prototype.transpose = function (t) {
    return this.throwIfDisposed(), lt.transpose(this, t);
  }, t.prototype.notEqual = function (t) {
    return this.throwIfDisposed(), lt.notEqual(this, t);
  }, t.prototype.notEqualStrict = function (t) {
    return this.throwIfDisposed(), lt.notEqualStrict(this, t);
  }, t.prototype.less = function (t) {
    return this.throwIfDisposed(), lt.less(this, t);
  }, t.prototype.lessStrict = function (t) {
    return this.throwIfDisposed(), lt.lessStrict(this, t);
  }, t.prototype.equal = function (t) {
    return this.throwIfDisposed(), lt.equal(this, t);
  }, t.prototype.equalStrict = function (t) {
    return this.throwIfDisposed(), lt.equalStrict(this, t);
  }, t.prototype.lessEqual = function (t) {
    return this.throwIfDisposed(), lt.lessEqual(this, t);
  }, t.prototype.lessEqualStrict = function (t) {
    return this.throwIfDisposed(), lt.lessEqualStrict(this, t);
  }, t.prototype.greater = function (t) {
    return this.throwIfDisposed(), lt.greater(this, t);
  }, t.prototype.greaterStrict = function (t) {
    return this.throwIfDisposed(), lt.greaterStrict(this, t);
  }, t.prototype.greaterEqual = function (t) {
    return this.throwIfDisposed(), lt.greaterEqual(this, t);
  }, t.prototype.greaterEqualStrict = function (t) {
    return this.throwIfDisposed(), lt.greaterEqualStrict(this, t);
  }, t.prototype.logicalAnd = function (t) {
    return this.throwIfDisposed(), lt.logicalAnd(this, t);
  }, t.prototype.logicalOr = function (t) {
    return this.throwIfDisposed(), lt.logicalOr(this, t);
  }, t.prototype.logicalNot = function () {
    return this.throwIfDisposed(), lt.logicalNot(this);
  }, t.prototype.logicalXor = function (t) {
    return this.throwIfDisposed(), lt.logicalXor(this, t);
  }, t.prototype.where = function (t, e) {
    return this.throwIfDisposed(), lt.where(t, this, e);
  }, t.prototype.neg = function () {
    return this.throwIfDisposed(), lt.neg(this);
  }, t.prototype.ceil = function () {
    return this.throwIfDisposed(), lt.ceil(this);
  }, t.prototype.floor = function () {
    return this.throwIfDisposed(), lt.floor(this);
  }, t.prototype.sign = function () {
    return this.throwIfDisposed(), lt.sign(this);
  }, t.prototype.isNaN = function () {
    return this.throwIfDisposed(), lt.isNaN(this);
  }, t.prototype.isInf = function () {
    return this.throwIfDisposed(), lt.isInf(this);
  }, t.prototype.isFinite = function () {
    return this.throwIfDisposed(), lt.isFinite(this);
  }, t.prototype.exp = function () {
    return this.throwIfDisposed(), lt.exp(this);
  }, t.prototype.expm1 = function () {
    return this.throwIfDisposed(), lt.expm1(this);
  }, t.prototype.log = function () {
    return this.throwIfDisposed(), lt.log(this);
  }, t.prototype.log1p = function () {
    return this.throwIfDisposed(), lt.log1p(this);
  }, t.prototype.sqrt = function () {
    return this.throwIfDisposed(), lt.sqrt(this);
  }, t.prototype.rsqrt = function () {
    return this.throwIfDisposed(), lt.rsqrt(this);
  }, t.prototype.square = function () {
    return this.throwIfDisposed(), lt.square(this);
  }, t.prototype.reciprocal = function () {
    return this.throwIfDisposed(), lt.reciprocal(this);
  }, t.prototype.abs = function () {
    return this.throwIfDisposed(), lt.abs(this);
  }, t.prototype.clipByValue = function (t, e) {
    return this.throwIfDisposed(), lt.clipByValue(this, t, e);
  }, t.prototype.relu = function () {
    return this.throwIfDisposed(), lt.relu(this);
  }, t.prototype.elu = function () {
    return this.throwIfDisposed(), lt.elu(this);
  }, t.prototype.selu = function () {
    return this.throwIfDisposed(), lt.selu(this);
  }, t.prototype.leakyRelu = function (t) {
    return void 0 === t && (t = .2), this.throwIfDisposed(), lt.leakyRelu(this, t);
  }, t.prototype.prelu = function (t) {
    return this.throwIfDisposed(), lt.prelu(this, t);
  }, t.prototype.sigmoid = function () {
    return this.throwIfDisposed(), lt.sigmoid(this);
  }, t.prototype.logSigmoid = function () {
    return this.throwIfDisposed(), lt.logSigmoid(this);
  }, t.prototype.softplus = function () {
    return this.throwIfDisposed(), lt.softplus(this);
  }, t.prototype.zerosLike = function () {
    return this.throwIfDisposed(), lt.zerosLike(this);
  }, t.prototype.onesLike = function () {
    return this.throwIfDisposed(), lt.onesLike(this);
  }, t.prototype.sin = function () {
    return this.throwIfDisposed(), lt.sin(this);
  }, t.prototype.cos = function () {
    return this.throwIfDisposed(), lt.cos(this);
  }, t.prototype.tan = function () {
    return this.throwIfDisposed(), lt.tan(this);
  }, t.prototype.asin = function () {
    return this.throwIfDisposed(), lt.asin(this);
  }, t.prototype.acos = function () {
    return this.throwIfDisposed(), lt.acos(this);
  }, t.prototype.atan = function () {
    return this.throwIfDisposed(), lt.atan(this);
  }, t.prototype.sinh = function () {
    return this.throwIfDisposed(), lt.sinh(this);
  }, t.prototype.cosh = function () {
    return this.throwIfDisposed(), lt.cosh(this);
  }, t.prototype.tanh = function () {
    return this.throwIfDisposed(), lt.tanh(this);
  }, t.prototype.asinh = function () {
    return this.throwIfDisposed(), lt.asinh(this);
  }, t.prototype.acosh = function () {
    return this.throwIfDisposed(), lt.acosh(this);
  }, t.prototype.atanh = function () {
    return this.throwIfDisposed(), lt.atanh(this);
  }, t.prototype.erf = function () {
    return this.throwIfDisposed(), lt.erf(this);
  }, t.prototype.round = function () {
    return this.throwIfDisposed(), lt.round(this);
  }, t.prototype.step = function (t) {
    return void 0 === t && (t = 0), this.throwIfDisposed(), lt.step(this, t);
  }, t.prototype.softmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), lt.softmax(this, t);
  }, t.prototype.logSoftmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), lt.logSoftmax(this, t);
  }, t.prototype.resizeBilinear = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), lt.image.resizeBilinear(this, t, e);
  }, t.prototype.resizeNearestNeighbor = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), lt.image.resizeNearestNeighbor(this, t, e);
  }, t.prototype.conv1d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NWC"), void 0 === o && (o = 1), this.throwIfDisposed(), lt.conv1d(this, t, e, n, r, o, a);
  }, t.prototype.conv2d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), lt.conv2d(this, t, e, n, r, o, a);
  }, t.prototype.conv2dTranspose = function (t, e, n, r, o) {
    return this.throwIfDisposed(), lt.conv2dTranspose(this, t, e, n, r, o);
  }, t.prototype.depthwiseConv2D = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), lt.depthwiseConv2d(this, t, e, n, r, o, a);
  }, t.prototype.separableConv2d = function (t, e, n, r, o, a) {
    return void 0 === o && (o = [1, 1]), void 0 === a && (a = "NHWC"), this.throwIfDisposed(), lt.separableConv2d(this, t, e, n, r, o, a);
  }, t.prototype.avgPool = function (t, e, n, r) {
    return this.throwIfDisposed(), lt.avgPool(this, t, e, n, r);
  }, t.prototype.maxPool = function (t, e, n, r) {
    return this.throwIfDisposed(), lt.maxPool(this, t, e, n, r);
  }, t.prototype.localResponseNormalization = function (t, e, n, r) {
    return void 0 === t && (t = 5), void 0 === e && (e = 1), void 0 === n && (n = 1), void 0 === r && (r = .5), lt.localResponseNormalization(this, t, e, n, r);
  }, t.prototype.pool = function (t, e, n, r, o) {
    return this.throwIfDisposed(), lt.pool(this, t, e, n, r, o);
  }, t.prototype.variable = function (t, e, n) {
    return void 0 === t && (t = !0), this.throwIfDisposed(), pt.variable(this, t, e, n);
  }, t.prototype.unsortedSegmentSum = function (t, e) {
    return this.throwIfDisposed(), lt.unsortedSegmentSum(this, t, e);
  }, t.prototype.batchToSpaceND = function (t, e) {
    return this.throwIfDisposed(), lt.batchToSpaceND(this, t, e);
  }, t.prototype.spaceToBatchND = function (t, e) {
    return this.throwIfDisposed(), lt.spaceToBatchND(this, t, e);
  }, t.prototype.topk = function (t, e) {
    return void 0 === t && (t = 1), void 0 === e && (e = !0), this.throwIfDisposed(), lt.topk(this, t, e);
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s) {
    return void 0 === r && (r = 0), void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), this.throwIfDisposed(), lt.stridedSlice(this, t, e, n, r, o, a, i, s);
  }, t.prototype.depthToSpace = function (t, e) {
    return this.throwIfDisposed(), lt.depthToSpace(this, t, e);
  }, t.prototype.fft = function () {
    return this.throwIfDisposed(), lt.spectral.fft(this);
  }, t.prototype.ifft = function () {
    return this.throwIfDisposed(), lt.spectral.ifft(this);
  }, t.prototype.rfft = function () {
    return this.throwIfDisposed(), lt.spectral.rfft(this);
  }, t.prototype.irfft = function () {
    return this.throwIfDisposed(), lt.spectral.irfft(this);
  }, t;
}();

exports.Tensor = ht;
Object.defineProperty(ht, Symbol.hasInstance, {
  value: function (t) {
    return !!t && null != t.dataId && null != t.shape && null != t.dtype;
  }
});

var pt = function (t) {
  function n(e, n, r) {
    void 0 === n && (n = !0);
    var o = t.call(this, e.shape, e.dtype, null, e.dataId) || this;
    o.trainable = n, o.name = r, null == o.name && (o.name = ut().nextVariableId().toString());

    try {
      ut().registerVariable(o);
    } catch (t) {
      throw ut().disposeTensor(o), t;
    }

    return o;
  }

  return e(n, t), n.variable = function (t, e, r, o) {
    return void 0 === e && (e = !0), null != o && o !== t.dtype && (t = t.asType(o)), new n(t, e, r);
  }, n.prototype.assign = function (t) {
    if (t.dtype !== this.dtype) throw new Error("dtype of the new value (" + t.dtype + ") and previous value (" + this.dtype + ") must match");
    if (!x(t.shape, this.shape)) throw new Error("shape of the new value (" + t.shape + ") and previous value (" + this.shape + ") must match");
    ut().disposeTensor(this), this.dataId = t.dataId, ut().registerTensor(this);
  }, n.prototype.dispose = function () {
    ut().disposeVariable(this), this.isDisposedInternal = !0;
  }, n;
}(ht);

exports.Variable = pt;
Object.defineProperty(pt, Symbol.hasInstance, {
  value: function (t) {
    return t instanceof ht && null != t.assign && t.assign instanceof Function;
  }
});
var ft,
    dt,
    vt,
    mt,
    gt,
    yt = pt.variable;
exports.variable = yt;
exports.Rank = ft;
!function (t) {
  t.R0 = "R0", t.R1 = "R1", t.R2 = "R2", t.R3 = "R3", t.R4 = "R4", t.R5 = "R5", t.R6 = "R6";
}(ft || (exports.Rank = ft = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "int32", t.complex64 = "complex64";
}(dt || (dt = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "bool", t.complex64 = "complex64";
}(vt || (vt = {})), function (t) {
  t.float32 = "float32", t.int32 = "float32", t.bool = "float32", t.complex64 = "complex64";
}(mt || (mt = {})), function (t) {
  t.float32 = "complex64", t.int32 = "complex64", t.bool = "complex64", t.complex64 = "complex64";
}(gt || (gt = {}));
var xt = {
  float32: mt,
  int32: dt,
  bool: vt,
  complex64: gt
};

function wt(t, e) {
  if ("string" === t || "string" === e) {
    if ("string" === t && "string" === e) return "string";
    throw new Error("Can not upcast " + t + " with " + e);
  }

  return xt[t][e];
}

function bt(t) {
  return wt(t, "int32");
}

function Ct(t, e) {
  if (t.dtype === e.dtype) return [t, e];
  var n = wt(t.dtype, e.dtype);
  return [t.cast(n), e.cast(n)];
}

function Et(t, e) {
  d(t.dtype === e.dtype, function () {
    return "The dtypes of the first(" + t.dtype + ") and second(" + e.dtype + ") input must match";
  });
}

function Rt(t) {
  var e = [];
  return function t(e, n, r) {
    if (null == e) return;
    if (e instanceof ht) return void n.push(e);
    if (o = e, !Array.isArray(o) && "object" != typeof o) return;
    var o;
    var a = e;

    for (var i in a) {
      var s = a[i];
      r.has(s) || (r.add(s), t(s, n, r));
    }
  }(t, e, new Set()), e;
}

var It,
    St = Object.freeze({
  makeTypesMatch: Ct,
  assertTypesMatch: Et,
  isTensorInList: function (t, e) {
    for (var n = 0; n < e.length; n++) if (e[n].id === t.id) return !0;

    return !1;
  },
  getTensorsInContainer: Rt
}),
    Nt = function () {
  function t() {
    this.registeredVariables = {}, this.nextTapeNodeId = 0, this.numBytes = 0, this.numTensors = 0, this.numStringTensors = 0, this.numDataBuffers = 0, this.gradientDepth = 0, this.kernelDepth = 0, this.scopeStack = [], this.nextScopeId = 0, this.tensorInfo = new WeakMap(), this.profiling = !1, this.activeProfile = {
      newBytes: 0,
      newTensors: 0,
      peakBytes: 0,
      kernels: [],
      result: null
    };
  }

  return t.prototype.dispose = function () {
    for (var t in this.registeredVariables) this.registeredVariables[t].dispose();
  }, t;
}(),
    kt = function () {
  function t(t) {
    this.ENV = t, this.registry = {}, this.registryFactory = {}, this.pendingBackendInitId = 0, this.state = new Nt();
  }

  return t.prototype.ready = function () {
    return r(this, void 0, void 0, function () {
      var t, e, n;
      return o(this, function (r) {
        switch (r.label) {
          case 0:
            if (null != this.pendingBackendInit) return [2, this.pendingBackendInit.then(function () {})];
            if (null != this.backendInstance) return [2];
            t = this.getSortedBackends(), e = 0, r.label = 1;

          case 1:
            return e < t.length ? (n = t[e], [4, this.initializeBackend(n).success]) : [3, 4];

          case 2:
            if (r.sent()) return this.setBackend(n), [2];
            r.label = 3;

          case 3:
            return e++, [3, 1];

          case 4:
            throw new Error("Could not initialize any backends, all backend initializations failed.");
        }
      });
    });
  }, Object.defineProperty(t.prototype, "backend", {
    get: function () {
      if (null != this.pendingBackendInit) throw new Error("Backend '" + this.backendName + "' has not yet been initialized. Make sure to await tf.ready() before calling other methods");

      if (null == this.backendInstance) {
        var t = this.initializeBackendsAndReturnBest(),
            e = t.name;
        if (t.asyncInit) throw new Error("The highest priority backend '" + e + "' has not yet been initialized. Make sure to await tf.ready() before calling other methods");
        this.setBackend(e);
      }

      return this.backendInstance;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.backendNames = function () {
    return Object.keys(this.registryFactory);
  }, t.prototype.findBackend = function (t) {
    if (!(t in this.registry)) {
      if (!(t in this.registryFactory)) return null;
      if (this.initializeBackend(t).asyncInit) return null;
    }

    return this.registry[t];
  }, t.prototype.findBackendFactory = function (t) {
    return t in this.registryFactory ? this.registryFactory[t].factory : null;
  }, t.prototype.registerBackend = function (t, e, n) {
    return void 0 === n && (n = 1), t in this.registryFactory ? (console.warn(t + " backend was already registered. Reusing existing backend factory."), !1) : (this.registryFactory[t] = {
      factory: e,
      priority: n
    }, !0);
  }, t.prototype.setBackend = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (null == this.registryFactory[t]) throw new Error("Backend name '" + t + "' not found in registry");
            return this.backendName = t, null != this.registry[t] ? [3, 4] : (this.backendInstance = null, e = this.initializeBackend(t), n = e.success, e.asyncInit ? [4, n] : [3, 2]);

          case 1:
            return r = o.sent(), [3, 3];

          case 2:
            r = n, o.label = 3;

          case 3:
            if (!r) return [2, !1];
            o.label = 4;

          case 4:
            return this.backendInstance = this.registry[t], this.profiler = new J(this.backendInstance), [2, !0];
        }
      });
    });
  }, t.prototype.initializeBackend = function (t) {
    var e = this,
        n = At.registryFactory[t];
    if (null == n) throw new Error("Cannot initialize backend " + t + ", no registration found.");

    try {
      var r = n.factory();

      if (Promise.resolve(r) === r) {
        var o = ++this.pendingBackendInitId,
            a = r.then(function (n) {
          return !(o < e.pendingBackendInitId) && (e.registry[t] = n, e.pendingBackendInit = null, !0);
        }).catch(function (n) {
          return !(o < e.pendingBackendInitId) && (e.pendingBackendInit = null, console.warn("Initialization of backend " + t + " failed"), console.warn(n.stack || n.message), !1);
        });
        return this.pendingBackendInit = a, {
          success: a,
          asyncInit: !0
        };
      }

      return this.registry[t] = r, {
        success: !0,
        asyncInit: !1
      };
    } catch (e) {
      return console.warn("Initialization of backend " + t + " failed"), console.warn(e.stack || e.message), {
        success: !1,
        asyncInit: !1
      };
    }
  }, t.prototype.removeBackend = function (t) {
    if (!(t in this.registryFactory)) throw new Error(t + " backend not found in registry");
    this.backendName === t && null != this.pendingBackendInit && this.pendingBackendInitId++, t in this.registry && (this.registry[t].dispose(), delete this.registry[t]), delete this.registryFactory[t], this.backendName === t && (this.pendingBackendInit = null, this.backendName = null, this.backendInstance = null);
  }, t.prototype.getSortedBackends = function () {
    var t = this;
    if (0 === Object.keys(this.registryFactory).length) throw new Error("No backend found in registry.");
    return Object.keys(this.registryFactory).sort(function (e, n) {
      return t.registryFactory[n].priority - t.registryFactory[e].priority;
    });
  }, t.prototype.initializeBackendsAndReturnBest = function () {
    for (var t = this.getSortedBackends(), e = 0; e < t.length; e++) {
      var n = t[e],
          r = this.initializeBackend(n),
          o = r.success,
          a = r.asyncInit;
      if (a || o) return {
        name: n,
        asyncInit: a
      };
    }

    throw new Error("Could not initialize any backends, all backend initializations failed.");
  }, t.prototype.moveData = function (t, e) {
    this.write(t, e, this.readSync(e));
  }, t.prototype.tidy = function (t, e) {
    var n,
        r = this,
        o = null;

    if (null == e) {
      if ("function" != typeof t) throw new Error("Please provide a function to tidy()");
      e = t;
    } else {
      if ("string" != typeof t && !(t instanceof String)) throw new Error("When calling with two arguments, the first argument to tidy() must be a string");
      if ("function" != typeof e) throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");
      o = t;
    }

    return this.scopedRun(function () {
      return r.startScope(o);
    }, function () {
      return r.endScope(n);
    }, function () {
      return (n = e()) instanceof Promise && console.error("Cannot return a Promise inside of tidy."), n;
    });
  }, t.prototype.scopedRun = function (t, e, n) {
    t();

    try {
      var r = n();
      return e(), r;
    } catch (t) {
      throw e(), t;
    }
  }, t.prototype.nextTensorId = function () {
    return t.nextTensorId++;
  }, t.prototype.nextVariableId = function () {
    return t.nextVariableId++;
  }, t.prototype.clone = function (t) {
    var e = ht.make(t.shape, {
      dataId: t.dataId
    }, t.dtype);
    return this.addTapeNode([t], e, function (t) {
      return [t.toFloat()];
    }), e;
  }, t.prototype.runKernel = function (t, e, n) {
    var r,
        o = this,
        a = [],
        i = this.isTapeOn(),
        s = null != this.state.activeScope ? this.state.activeScope.name : "",
        u = function (t) {
      i && (a = t.map(function (t) {
        return o.keep(o.clone(t));
      }));
    },
        l = this.state.numBytes,
        c = this.state.numTensors;

    if (this.scopedRun(function () {
      return o.state.kernelDepth++;
    }, function () {
      return o.state.kernelDepth--;
    }, function () {
      r = o.ENV.getBool("DEBUG") ? o.profiler.profileKernel(s, function () {
        return t(o.backend, u);
      }) : t(o.backend, u);
    }), i) {
      var h = {
        id: this.state.nextTapeNodeId++,
        name: s,
        inputs: e,
        outputs: Array.isArray(r) ? r : [r],
        saved: a
      };
      null != n && (h.gradient = function (t) {
        return n(t, a);
      }), this.state.activeTape.push(h);
    }

    return this.state.profiling && this.state.activeProfile.kernels.push({
      name: s,
      bytesAdded: this.state.numBytes - l,
      totalBytesSnapshot: this.state.numBytes,
      tensorsAdded: this.state.numTensors - c,
      totalTensorsSnapshot: this.state.numTensors,
      inputShapes: Object.keys(e).map(function (t) {
        return e[t].shape;
      }),
      outputShape: Array.isArray(r) ? r.map(function (t) {
        return t.shape;
      }) : r.shape
    }), r;
  }, t.prototype.registerTensor = function (t, e) {
    var n = this.state.tensorInfo.has(t.dataId) ? this.state.tensorInfo.get(t.dataId).refCount : 0;

    if (this.state.numTensors++, "string" === t.dtype && this.state.numStringTensors++, 0 === n) {
      this.state.numDataBuffers++;
      var r = 0;
      "complex64" !== t.dtype && "string" !== t.dtype && (r = t.size * F(t.dtype)), this.state.tensorInfo.set(t.dataId, {
        backend: null != e ? e : this.backend,
        dtype: t.dtype,
        shape: t.shape,
        bytes: r,
        refCount: 0
      }), this.state.numBytes += r, null != e ? e.register(t.dataId, t.shape, t.dtype) : this.backend.register(t.dataId, t.shape, t.dtype);
    }

    this.state.tensorInfo.get(t.dataId).refCount++, t instanceof pt || this.track(t);
  }, t.prototype.registerVariable = function (t) {
    if (null != this.state.registeredVariables[t.name]) throw new Error("Variable with name " + t.name + " was already registered");
    this.state.registeredVariables[t.name] = t;
  }, t.prototype.disposeTensor = function (t) {
    if (this.state.tensorInfo.has(t.dataId)) {
      this.state.numTensors--, "string" === t.dtype && this.state.numStringTensors--;
      var e = this.state.tensorInfo.get(t.dataId);
      e.refCount <= 1 ? ("complex64" !== t.dtype && (this.state.numBytes -= e.bytes), this.state.numDataBuffers--, e.backend.disposeData(t.dataId), this.state.tensorInfo.delete(t.dataId)) : this.state.tensorInfo.get(t.dataId).refCount--;
    }
  }, t.prototype.disposeVariables = function () {
    for (var t in this.state.registeredVariables) {
      var e = this.state.registeredVariables[t];
      this.disposeVariable(e);
    }
  }, t.prototype.disposeVariable = function (t) {
    this.disposeTensor(t), null != this.state.registeredVariables[t.name] && delete this.state.registeredVariables[t.name];
  }, t.prototype.memory = function () {
    var t = this.backend.memory();
    return t.numTensors = this.state.numTensors, t.numDataBuffers = this.state.numDataBuffers, t.numBytes = this.state.numBytes, this.state.numStringTensors > 0 && (t.unreliable = !0, null == t.reasons && (t.reasons = []), t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")), t;
  }, t.prototype.profile = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n;
      return o(this, function (r) {
        return this.state.profiling = !0, e = this.state.numBytes, n = this.state.numTensors, this.state.activeProfile.kernels = [], this.state.activeProfile.result = t(), this.state.profiling = !1, this.state.activeProfile.peakBytes = Math.max.apply(Math, this.state.activeProfile.kernels.map(function (t) {
          return t.totalBytesSnapshot;
        })), this.state.activeProfile.newBytes = this.state.numBytes - e, this.state.activeProfile.newTensors = this.state.numTensors - n, [2, this.state.activeProfile];
      });
    });
  }, t.prototype.isTapeOn = function () {
    return this.state.gradientDepth > 0 && 0 === this.state.kernelDepth;
  }, t.prototype.addTapeNode = function (t, e, n) {
    var r = {};
    t.forEach(function (t, e) {
      r[e] = t;
    });
    var o = {
      id: this.state.nextTapeNodeId++,
      name: this.state.activeScope.name,
      inputs: r,
      outputs: [e],
      gradient: function (t) {
        var e = n(t),
            r = {};
        return e.forEach(function (t, e) {
          r[e] = function () {
            return t;
          };
        }), r;
      }
    };
    this.state.activeTape.push(o);
  }, t.prototype.keep = function (t) {
    return t.kept = !0, t;
  }, t.prototype.startTape = function () {
    0 === this.state.gradientDepth && (this.state.activeTape = []), this.state.gradientDepth++;
  }, t.prototype.endTape = function () {
    this.state.gradientDepth--;
  }, t.prototype.startScope = function (t) {
    var e = {
      track: [],
      name: "unnamed scope",
      id: this.state.nextScopeId++
    };
    t && (e.name = t), this.state.scopeStack.push(e), this.state.activeScope = e;
  }, t.prototype.endScope = function (t) {
    for (var e = this, n = Rt(t), r = new Set(n.map(function (t) {
      return t.id;
    })), o = 0; o < this.state.activeScope.track.length; o++) {
      var a = this.state.activeScope.track[o];
      a.kept || r.has(a.id) || a.dispose();
    }

    var i = this.state.scopeStack.pop();
    this.state.activeScope = 0 === this.state.scopeStack.length ? null : this.state.scopeStack[this.state.scopeStack.length - 1], n.forEach(function (t) {
      t.kept || t.scopeId !== i.id || e.track(t);
    });
  }, t.prototype.gradients = function (t, e, n, r) {
    var o = this;
    if (void 0 === r && (r = !1), d(e.length > 0, function () {
      return "gradients() received an empty list of xs.";
    }), null != n && "float32" !== n.dtype) throw new Error("dy must have 'float32' dtype, but has '" + n.dtype + "'");
    var a = this.scopedRun(function () {
      return o.startTape();
    }, function () {
      return o.endTape();
    }, function () {
      return o.tidy("forward", t);
    });
    d(a instanceof ht, function () {
      return "The result y returned by f() must be a tensor.";
    });

    var i = function (t, e, n) {
      for (var r = {}, o = {}, a = 0; a < e.length; a++) r[e[a].id] = !0;

      for (a = 0; a < t.length; a++) {
        var i = (d = t[a]).inputs;

        for (var s in i) {
          for (var u = i[s], l = !1, c = 0; c < e.length; c++) if (r[u.id]) {
            d.outputs.forEach(function (t) {
              return r[t.id] = !0;
            }), l = !0, o[d.id] = !0;
            break;
          }

          if (l) break;
        }
      }

      var h = {};
      h[n.id] = !0;
      var p = {};

      for (a = t.length - 1; a >= 0; a--) for (i = (d = t[a]).inputs, c = 0; c < d.outputs.length; c++) if (h[d.outputs[c].id]) {
        for (var s in i) h[i[s].id] = !0, p[d.id] = !0;

        break;
      }

      var f = [];

      for (a = 0; a < t.length; a++) {
        var d;

        if (o[(d = t[a]).id] && p[d.id]) {
          var v = {};

          for (var s in d.inputs) {
            var m = d.inputs[s];
            r[m.id] && (v[s] = m);
          }

          var g = Object.assign({}, d);
          g.inputs = v, g.outputs = d.outputs, f.push(g);
        }
      }

      return f;
    }(this.state.activeTape, e, a);

    if (!r && 0 === i.length && e.length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");
    return this.tidy("backward", function () {
      var t,
          r,
          s = {};
      s[a.id] = null == n ? (t = a.shape, r = $(y(t), "float32"), ht.make(t, {
        values: r
      })) : n, function (t, e, n) {
        for (var r = function (r) {
          var o = e[r],
              a = [];
          if (o.outputs.forEach(function (e) {
            var n = t[e.id];
            if (null != n) a.push(n);else {
              var r = ht.make(e.shape, {
                values: j(e.size, e.dtype)
              }, e.dtype);
              a.push(r);
            }
          }), null == o.gradient) throw new Error("Cannot compute gradient: gradient function not found for " + o.name + ".");

          var i = o.gradient(1 === o.outputs.length ? a[0] : a),
              s = function (e) {
            if (!(e in i)) throw new Error("Cannot backprop through input " + e + ". Available gradients found: " + Object.keys(i) + ".");
            var r = n(function () {
              return i[e]();
            });
            if ("float32" !== r.dtype) throw new Error("Error in gradient for op " + o.name + ". The gradient of input " + e + " must have 'float32' dtype, but has '" + r.dtype + "'");
            var a = o.inputs[e];
            if (!x(r.shape, a.shape)) throw new Error("Error in gradient for op " + o.name + ". The gradient of input '" + e + "' has shape '" + r.shape + "', which does not match the shape of the input '" + a.shape + "'");
            if (null == t[a.id]) t[a.id] = r;else {
              var s = t[a.id];
              t[a.id] = s.add(r), s.dispose();
            }
          };

          for (var u in o.inputs) s(u);
        }, o = e.length - 1; o >= 0; o--) r(o);
      }(s, i, function (t) {
        return o.tidy(t);
      });
      var u = e.map(function (t) {
        return s[t.id];
      });
      return 0 === o.state.gradientDepth && (o.state.activeTape.forEach(function (t) {
        for (var e in t.saved) t.saved[e].dispose();
      }), o.state.activeTape = null), {
        value: a,
        grads: u
      };
    });
  }, t.prototype.customGrad = function (t) {
    var e = this;
    return d(z(t), function () {
      return "The f passed in customGrad(f) must be a function.";
    }), function () {
      for (var n, r = [], o = 0; o < arguments.length; o++) r[o] = arguments[o];

      d(r.every(function (t) {
        return t instanceof ht;
      }), function () {
        return "The args passed in customGrad(f)(x1, x2,...) must all be tensors";
      });
      var a = {};
      return r.forEach(function (t, e) {
        a[e] = t;
      }), e.runKernel(function (e, o) {
        return d((n = t.apply(void 0, r.concat([o]))).value instanceof ht, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.value` is a tensor";
        }), d(z(n.gradFunc), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.";
        }), n.value;
      }, a, function (t, e) {
        var o = n.gradFunc(t, e),
            a = Array.isArray(o) ? o : [o];
        d(a.length === r.length, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).";
        }), d(a.every(function (t) {
          return t instanceof ht;
        }), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.";
        });
        var i = {};
        return a.forEach(function (t, e) {
          i[e] = function () {
            return t;
          };
        }), i;
      });
    };
  }, t.prototype.write = function (t, e, n) {
    var r = this.state.tensorInfo.get(e),
        o = r.backend;

    if (t = t || this.backend, "string" === r.dtype) {
      var a = B(n);
      this.state.numBytes += a - r.bytes, r.bytes = a;
    }

    t !== o && (o.disposeData(e), r.backend = t, t.register(e, r.shape, r.dtype)), t.write(e, n);
  }, t.prototype.readSync = function (t) {
    return this.state.tensorInfo.get(t).backend.readSync(t);
  }, t.prototype.read = function (t) {
    return this.state.tensorInfo.get(t).backend.read(t);
  }, t.prototype.fromPixels = function (t, e) {
    return this.backend.fromPixels(t, e);
  }, t.prototype.time = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n;
      return o(this, function (r) {
        switch (r.label) {
          case 0:
            return e = K(), [4, this.backend.time(t)];

          case 1:
            return (n = r.sent()).wallMs = K() - e, [2, n];
        }
      });
    });
  }, t.prototype.track = function (t) {
    return null != this.state.activeScope && (t.scopeId = this.state.activeScope.id, this.state.activeScope.track.push(t)), t;
  }, Object.defineProperty(t.prototype, "registeredVariables", {
    get: function () {
      return this.state.registeredVariables;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.reset = function () {
    for (var t in this.pendingBackendInitId++, this.state.dispose(), this.ENV.reset(), this.state = new Nt(), this.registry) this.registry[t].dispose(), delete this.registry[t];

    this.backendName = null, this.backendInstance = null, this.pendingBackendInit = null;
  }, t.nextTensorId = 0, t.nextVariableId = 0, t;
}();

exports.tensor_util = St;

var At = function () {
  var t = function () {
    if (null == It) {
      var t = void 0;
      if ("undefined" != typeof window) t = window;else if ("undefined" != typeof global) t = global;else {
        if ("undefined" == typeof process) throw new Error("Could not find a global object");
        t = process;
      }
      It = t;
    }

    return It;
  }();

  if (null == t._tfengine) {
    var e = new i(t);
    t._tfengine = new kt(e);
  }

  return u(t._tfengine.ENV), ut = function () {
    return t._tfengine;
  }, t._tfengine;
}();

function Tt() {
  return "undefined" != typeof window;
}

a.registerFlag("DEBUG", function () {
  return !1;
}, function (t) {
  t && console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.");
}), a.registerFlag("IS_BROWSER", function () {
  return Tt();
}), a.registerFlag("IS_NODE", function () {
  return "undefined" != typeof process && void 0 !== process.versions && void 0 !== process.versions.node;
}), a.registerFlag("IS_CHROME", function () {
  return "undefined" != typeof navigator && null != navigator && null != navigator.userAgent && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}), a.registerFlag("PROD", function () {
  return !1;
}), a.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY", function () {
  return !a.getBool("PROD");
}), a.registerFlag("DEPRECATION_WARNINGS_ENABLED", function () {
  return !0;
}), a.registerFlag("IS_TEST", function () {
  return !1;
});
var Dt = {},
    _t = {
  alpha: !1,
  antialias: !1,
  premultipliedAlpha: !1,
  preserveDrawingBuffer: !1,
  depth: !1,
  stencil: !1,
  failIfMajorPerformanceCaveat: !0
};

function Ot(t, e) {
  Dt[t] = e;
}

function Mt(t) {
  t in Dt || (Dt[t] = function (t) {
    if (1 !== t && 2 !== t) throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");
    var e = document.createElement("canvas");
    if (e.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(), delete Dt[t];
    }, !1), 1 === t) return e.getContext("webgl", _t) || e.getContext("experimental-webgl", _t);
    return e.getContext("webgl2", _t);
  }(t));
  var e = Dt[t];
  return e.isContextLost() ? (delete Dt[t], Mt(t)) : (e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SAMPLE_COVERAGE), e.enable(e.SCISSOR_TEST), e.enable(e.CULL_FACE), e.cullFace(e.BACK), Dt[t]);
}

function Ft(t, e, n) {
  var r = n();
  return e && function (t) {
    var e = t.getError();
    if (e !== t.NO_ERROR) throw new Error("WebGL Error: " + Wt(t, e));
  }(t), r;
}

var Bt = 5.96e-8,
    Pt = 65504;

function Lt(t) {
  return !!(a.getBool("WEBGL_RENDER_FLOAT32_ENABLED") || 0 === t || Bt < Math.abs(t) && Math.abs(t) < Pt);
}

function Wt(t, e) {
  switch (e) {
    case t.NO_ERROR:
      return "NO_ERROR";

    case t.INVALID_ENUM:
      return "INVALID_ENUM";

    case t.INVALID_VALUE:
      return "INVALID_VALUE";

    case t.INVALID_OPERATION:
      return "INVALID_OPERATION";

    case t.INVALID_FRAMEBUFFER_OPERATION:
      return "INVALID_FRAMEBUFFER_OPERATION";

    case t.OUT_OF_MEMORY:
      return "OUT_OF_MEMORY";

    case t.CONTEXT_LOST_WEBGL:
      return "CONTEXT_LOST_WEBGL";

    default:
      return "Unknown error code " + e;
  }
}

function Ut(t, e, n) {
  return le(t, e, function () {
    return t.getExtension(n);
  }, 'Extension "' + n + '" not supported on this browser.');
}

function zt(t, e, n) {
  var r = le(t, e, function () {
    return t.createShader(t.VERTEX_SHADER);
  }, "Unable to create vertex WebGLShader.");
  if (Ft(t, e, function () {
    return t.shaderSource(r, n);
  }), Ft(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw console.log(t.getShaderInfoLog(r)), new Error("Failed to compile vertex shader.");
  return r;
}

function Vt(t, e, n) {
  var r = le(t, e, function () {
    return t.createShader(t.FRAGMENT_SHADER);
  }, "Unable to create fragment WebGLShader.");
  if (Ft(t, e, function () {
    return t.shaderSource(r, n);
  }), Ft(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw function (t, e) {
    var n = Ht.exec(e);
    if (null == n) return console.log("Couldn't parse line number in error: " + e), void console.log(t);

    for (var r = +n[1], o = t.split("\n"), a = o.length.toString().length + 2, i = o.map(function (t, e) {
      return E((e + 1).toString(), a) + t;
    }), s = 0, u = 0; u < i.length; u++) s = Math.max(i[u].length, s);

    var l = i.slice(0, r - 1),
        c = i.slice(r - 1, r),
        h = i.slice(r);
    console.log(l.join("\n")), console.log(e.split("\n")[0]), console.log("%c " + E(c[0], s), "border:1px solid red; background-color:#e3d2d2; color:#a61717"), console.log(h.join("\n"));
  }(n, t.getShaderInfoLog(r)), new Error("Failed to compile fragment shader.");
  return r;
}

var Gt,
    qt,
    Ht = /ERROR: [0-9]+:([0-9]+):/g;

function $t(t, e) {
  return le(t, e, function () {
    return t.createProgram();
  }, "Unable to create WebGLProgram.");
}

function jt(t, e, n) {
  if (Ft(t, e, function () {
    return t.linkProgram(n);
  }), !1 === t.getProgramParameter(n, t.LINK_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Failed to link vertex and fragment shaders.");
}

function Kt(t, e, n) {
  if (Ft(t, e, function () {
    return t.validateProgram(n);
  }), !1 === t.getProgramParameter(n, t.VALIDATE_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Shader program validation failed.");
}

function Xt(t, e, n) {
  var r = le(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Ft(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), Ft(t, e, function () {
    return t.bufferData(t.ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function Yt(t, e, n) {
  var r = le(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Ft(t, e, function () {
    return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, r);
  }), Ft(t, e, function () {
    return t.bufferData(t.ELEMENT_ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function Qt(t, e) {
  return le(t, e, function () {
    return t.createTexture();
  }, "Unable to create WebGLTexture.");
}

function Jt(t, e) {
  var n = a.getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (t <= 0 || e <= 0) {
    var r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " is invalid.");
  }

  if (t > n || e > n) {
    r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " greater than WebGL maximum on this browser / GPU " + ("[" + n + "x" + n + "]") + ".");
  }
}

function Zt(t, e) {
  return le(t, e, function () {
    return t.createFramebuffer();
  }, "Unable to create WebGLFramebuffer.");
}

function te(t, e, n, r, o, a, i, s) {
  var u = t.getAttribLocation(n, r);
  return -1 !== u && (Ft(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, o);
  }), Ft(t, e, function () {
    return t.vertexAttribPointer(u, a, t.FLOAT, !1, i, s);
  }), Ft(t, e, function () {
    return t.enableVertexAttribArray(u);
  }), !0);
}

function ee(t, e, n, r) {
  ce(t, r), Ft(t, e, function () {
    return t.activeTexture(t.TEXTURE0 + r);
  }), Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  });
}

function ne(t, e, n, r) {
  return le(t, e, function () {
    return t.getUniformLocation(n, r);
  }, 'uniform "' + r + '" not present in program.');
}

function re(t, e, n) {
  return t.getUniformLocation(e, n);
}

function oe(t, e, n, r, o, a) {
  Ft(t, e, function () {
    return ee(t, e, r, a);
  }), Ft(t, e, function () {
    return t.uniform1i(o, a);
  });
}

function ae(t, e, n, r) {
  Ft(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, r);
  }), Ft(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
  });
}

function ie(t, e, n) {
  Ft(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, n);
  }), Ft(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, null, 0);
  });
}

function se(t) {
  var e = t.checkFramebufferStatus(t.FRAMEBUFFER);
  if (e !== t.FRAMEBUFFER_COMPLETE) throw new Error("Error binding framebuffer: " + ue(t, e));
}

function ue(t, e) {
  switch (e) {
    case t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      return "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";

    case t.FRAMEBUFFER_UNSUPPORTED:
      return "FRAMEBUFFER_UNSUPPORTED";

    default:
      return "unknown error " + e;
  }
}

function le(t, e, n, r) {
  var o = Ft(t, e, function () {
    return n();
  });
  if (null == o) throw new Error(r);
  return o;
}

function ce(t, e) {
  var n = t.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1,
      r = e + t.TEXTURE0;
  if (r < t.TEXTURE0 || r > n) throw new Error("textureUnit must be in " + ("[gl.TEXTURE0, gl.TEXTURE" + n + "]") + ".");
}

function he(t, e) {
  return void 0 === e && (e = 2), y(t.slice(0, t.length - e));
}

function pe(t) {
  if (0 === t.length) throw Error("Cannot get rows and columns of an empty shape array.");
  return [t.length > 1 ? t[t.length - 2] : 1, t[t.length - 1]];
}

function fe(t, e) {
  var n;
  void 0 === e && (e = !1);
  var r = a.getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (e && (r *= 2, 1 === (t = t.map(function (e, n) {
    return n >= t.length - 2 ? p(t[n]) : t[n];
  })).length && (t = [2, t[0]])), 2 !== t.length) {
    var o = N(t);
    t = o.newShape;
  }

  var i = y(t);
  if (t.length <= 1 && i <= r) return [1, i];
  if (2 === t.length && t[0] <= r && t[1] <= r) return t;
  if (3 === t.length && t[0] * t[1] <= r && t[2] <= r) return [t[0] * t[1], t[2]];
  if (3 === t.length && t[0] <= r && t[1] * t[2] <= r) return [t[0], t[1] * t[2]];
  if (4 === t.length && t[0] * t[1] * t[2] <= r && t[3] <= r) return [t[0] * t[1] * t[2], t[3]];
  if (4 === t.length && t[0] <= r && t[1] * t[2] * t[3] <= r) return [t[0], t[1] * t[2] * t[3]];

  if (e) {
    var s = he(t),
        u = 2,
        l = 2;
    return t.length && (u = (n = pe(t))[0], l = n[1]), C(i = s * (u / 2) * (l / 2)).map(function (t) {
      return 2 * t;
    });
  }

  return C(i);
}

function de(t) {
  return t % 2 == 0;
}

function ve(t, e) {
  if (x(t = t.slice(-2), e = e.slice(-2))) return !0;
  if (!t.length || !e.length) return !0;
  if (0 === t[0] || 0 === t[1] || 0 === e[0] || 0 === e[1]) return !0;

  if (t.length !== e.length) {
    var n = t.slice(-1)[0],
        r = e.slice(-1)[0];
    if (n === r) return !0;
    if (de(n) && de(r) && (1 === t[0] || 1 === e[0])) return !0;
  }

  return t[1] === e[1] && de(t[0]) && de(e[0]);
}

function me(t) {
  if (null == Gt) {
    var e = Mt(t);
    Gt = e.getParameter(e.MAX_TEXTURE_SIZE);
  }

  return Gt;
}

function ge(t) {
  if (null == qt) {
    var e = Mt(t);
    qt = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
  }

  return Math.min(16, qt);
}

function ye(t) {
  if (0 === t) return 0;
  var e = Mt(t);
  return xe(e, "EXT_disjoint_timer_query_webgl2") && 2 === t ? 2 : xe(e, "EXT_disjoint_timer_query") ? 1 : 0;
}

function xe(t, e) {
  return null != t.getExtension(e);
}

function we(t) {
  try {
    if (null != Mt(t)) return !0;
  } catch (t) {
    return !1;
  }

  return !1;
}

function be(t) {
  if (0 === t) return !1;
  var e = Mt(t);

  if (1 === t) {
    if (!xe(e, "OES_texture_float")) return !1;
  } else if (!xe(e, "EXT_color_buffer_float")) return !1;

  return Ee(e, t);
}

function Ce(t) {
  if (0 === t) return !1;
  var e = Mt(t);

  if (1 === t) {
    if (!xe(e, "OES_texture_float")) return !1;
    if (!xe(e, "WEBGL_color_buffer_float")) return !1;
  } else if (!xe(e, "EXT_color_buffer_float")) return !1;

  return Ee(e, t);
}

function Ee(t, e) {
  var n = t.createFramebuffer(),
      r = t.createTexture();
  t.bindTexture(t.TEXTURE_2D, r);
  var o = 2 === e ? t.RGBA32F : t.RGBA;
  t.texImage2D(t.TEXTURE_2D, 0, o, 1, 1, 0, t.RGBA, t.FLOAT, null), t.bindFramebuffer(t.FRAMEBUFFER, n), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, r, 0);
  var a = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE;
  return t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteTexture(r), t.deleteFramebuffer(n), a;
}

function Re(t) {
  return 2 === t && null != Mt(t).fenceSync;
}

var Ie = Object.freeze({
  callAndCheck: Ft,
  canBeRepresented: Lt,
  getWebGLErrorMessage: Wt,
  getExtensionOrThrow: Ut,
  createVertexShader: zt,
  createFragmentShader: Vt,
  createProgram: $t,
  linkProgram: jt,
  validateProgram: Kt,
  createStaticVertexBuffer: Xt,
  createStaticIndexBuffer: Yt,
  getNumChannels: function () {
    return 2 === a.getNumber("WEBGL_VERSION") ? 1 : 4;
  },
  createTexture: Qt,
  validateTextureSize: Jt,
  createFramebuffer: Zt,
  bindVertexBufferToProgramAttribute: te,
  bindTextureUnit: ee,
  unbindTextureUnit: function (t, e, n) {
    ce(t, n), Ft(t, e, function () {
      return t.activeTexture(t.TEXTURE0 + n);
    }), Ft(t, e, function () {
      return t.bindTexture(t.TEXTURE_2D, null);
    });
  },
  getProgramUniformLocationOrThrow: ne,
  getProgramUniformLocation: re,
  bindTextureToProgramUniformSampler: oe,
  bindCanvasToFramebuffer: function (t, e) {
    Ft(t, e, function () {
      return t.bindFramebuffer(t.FRAMEBUFFER, null);
    }), Ft(t, e, function () {
      return t.viewport(0, 0, t.canvas.width, t.canvas.height);
    }), Ft(t, e, function () {
      return t.scissor(0, 0, t.canvas.width, t.canvas.height);
    });
  },
  bindColorTextureToFramebuffer: ae,
  unbindColorTextureFromFramebuffer: ie,
  validateFramebuffer: se,
  getFramebufferErrorMessage: ue,
  getBatchDim: he,
  getRowsCols: pe,
  getTextureShapeFromLogicalShape: fe,
  isReshapeFree: ve,

  get MAX_TEXTURE_SIZE() {
    return Gt;
  },

  get MAX_TEXTURES_IN_SHADER() {
    return qt;
  },

  getWebGLMaxTextureSize: me,
  getMaxTexturesInShader: ge,
  getWebGLDisjointQueryTimerVersion: ye,
  isWebGLVersionEnabled: we,
  isRenderToFloatTextureEnabled: be,
  isDownloadFloatTextureEnabled: Ce,
  isWebGLFenceEnabled: Re
});

function Se() {
  a.set("PROD", !0);
}

function Ne() {
  a.set("DEBUG", !0);
}

function ke() {
  a.set("DEPRECATION_WARNINGS_ENABLED", !1), console.warn("TensorFlow.js deprecation warnings have been disabled.");
}

function Ae(t) {
  a.getBool("DEPRECATION_WARNINGS_ENABLED") && console.warn(t + " You can disable deprecation warnings with tf.disableDeprecationWarnings().");
}

function Te() {
  At.disposeVariables();
}

function De() {
  return At.memory();
}

function _e(t) {
  return At.profile(t);
}

function Oe(t, e) {
  return At.tidy(t, e);
}

function Me(t) {
  Rt(t).forEach(function (t) {
    return t.dispose();
  });
}

function Fe(t) {
  return At.keep(t);
}

function Be(t) {
  return At.time(t);
}

function Pe(t) {
  return At.setBackend(t);
}

function Le() {
  return At.ready();
}

function We() {
  return At.backendName;
}

function Ue(t) {
  At.removeBackend(t);
}

function ze(t) {
  return At.findBackend(t);
}

function Ve(t) {
  return At.findBackendFactory(t);
}

function Ge(t, e, n) {
  return void 0 === n && (n = 1), At.registerBackend(t, e, n);
}

function qe() {
  return At.backend;
}

function He(t, e) {
  a.setPlatform(t, e);
}

function $e() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

  a.getBool("IS_TEST") || console.warn.apply(console, t);
}

function je(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  if (r) (o = o.concat(e.slice(0))).push(t[0] / n), o = o.concat(t.slice(1));else {
    o = o.concat(t[0]);

    for (var a = e.length, i = 0; i < a; ++i) o = o.concat([t[i + 1] / e[i], e[i]]);

    o = o.concat(t.slice(a + 1));
  }
  return o;
}

function Ke(t, e, n) {
  void 0 === n && (n = !0);
  var r = [];

  if (n) {
    r.push(e);

    for (var o = e + 1; o < t; ++o) o <= 2 * e ? (r.push(o), r.push(o - (e + 1))) : r.push(o);
  } else {
    var a = [],
        i = [];

    for (o = 1; o < t; ++o) o >= 2 * e + 1 || o % 2 == 1 ? i.push(o) : a.push(o);

    r.push.apply(r, a), r.push(0), r.push.apply(r, i);
  }

  return r;
}

function Xe(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  r ? o.push(t[0] / n) : o.push(t[0] * n);

  for (var a = 1; a < t.length; ++a) a <= e.length ? r ? o.push(e[a - 1] * t[a]) : o.push(t[a] / e[a - 1]) : o.push(t[a]);

  return o;
}

function Ye(t, e) {
  for (var n = [0], r = 0; r < e; ++r) n.push(t[r][0]);

  return n;
}

function Qe(t, e, n) {
  for (var r = t.slice(0, 1), o = 0; o < n; ++o) r.push(t[o + 1] - e[o][0] - e[o][1]);

  return r;
}

function Je(t, e) {
  for (var n = 0; n < t.length; ++n) if (t[t.length - n - 1] !== e - 1 - n) return !1;

  return !0;
}

function Ze(t, e, n) {
  for (var r = t.length + e.length, o = [], a = 0, i = 0, s = 0; s < r; s++) -1 === n.indexOf(s) ? o.push(t[a++]) : o.push(e[i++]);

  return o;
}

function tn(t, e) {
  for (var n = [], r = t.length, o = 0; o < r; o++) -1 === e.indexOf(o) && n.push(t[o]);

  return [n, e.map(function (e) {
    return t[e];
  })];
}

function en(t, e) {
  return Ze(t, e.map(function (t) {
    return 1;
  }), e);
}

function nn(t, e, n) {
  d(Je(e, n), function () {
    return t + " supports only inner-most axes for now. Got axes " + e + " and rank-" + n + " input.";
  });
}

function rn(t, e) {
  if (Je(t, e)) return null;

  for (var n = [], r = 0; r < e; ++r) -1 === t.indexOf(r) && n.push(r);

  return t.forEach(function (t) {
    return n.push(t);
  }), n;
}

function on(t) {
  return t.map(function (t, e) {
    return [e, t];
  }).sort(function (t, e) {
    return t[1] - e[1];
  }).map(function (t) {
    return t[0];
  });
}

function an(t, e) {
  for (var n = [], r = e - t; r < e; ++r) n.push(r);

  return n;
}

function sn(t, e) {
  var n = t[0].length;
  t.forEach(function (t, e) {
    d(t.length === n, function () {
      return "Error in concat" + n + "D: rank of tensors[" + e + "] must be the same as the rank of the rest (" + n + ")";
    });
  }), d(e >= 0 && e < n, function () {
    return "Error in concat" + n + "D: axis must be between 0 and " + (n - 1) + ".";
  });
  var r = t[0];
  t.forEach(function (t, o) {
    for (var a = 0; a < n; a++) d(a === e || t[a] === r[a], function () {
      return "Error in concat" + n + "D: Shape of tensors[" + o + "] (" + t + ") does not match the shape of the rest (" + r + ") along the non-concatenated axis " + o + ".";
    });
  });
}

function un(t, e) {
  for (var n = t[0].slice(), r = 1; r < t.length; r++) n[e] += t[r][e];

  return n;
}

function ln(t, e) {
  if (t.rank < 1) throw new Error("tf.gatherND() expects the input to be rank 1 or higher, but the rank was " + t.rank + ".");
  if (e.rank < 1) throw new Error("tf.gatherND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if ("int32" !== e.dtype) throw new Error("tf.gatherND() expects the indices to be int32 type, but the dtype was " + e.dtype + ".");
  if (e.shape[e.rank - 1] > t.rank) throw new Error("index innermost dimension length must be <= tensor rank; saw: " + e.shape[e.rank - 1] + " vs. " + t.rank);
  if (0 === t.size) throw new Error("Requested more than 0 entries, but input is empty. Input shape: " + t.shape + ".");

  for (var n = e.shape, r = n[n.length - 1], o = 1, a = 0; a < n.length - 1; ++a) o *= n[a];

  var i = t.shape,
      s = n.slice();
  s.pop();
  var u = 1;

  for (a = r; a < t.rank; ++a) u *= i[a], s.push(i[a]);

  var l = G(t.shape).map(function (t) {
    return t / u;
  }).concat([1]).slice(0, r);
  return [s, o, u, l];
}

a.registerFlag("HAS_WEBGL", function () {
  return a.getNumber("WEBGL_VERSION") > 0;
}), a.registerFlag("WEBGL_VERSION", function () {
  return we(2) ? 2 : we(1) ? 1 : 0;
}), a.registerFlag("WEBGL_BUFFER_SUPPORTED", function () {
  return 2 === a.get("WEBGL_VERSION");
}), a.registerFlag("WEBGL_CPU_FORWARD", function () {
  return !0;
}), a.registerFlag("WEBGL_PACK", function () {
  return a.getBool("HAS_WEBGL");
}), a.registerFlag("WEBGL_PACK_NORMALIZATION", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_CLIP", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_DEPTHWISECONV", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_BINARY_OPERATIONS", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_PACK_REDUCE", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_LAZILY_UNPACK", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_CONV_IM2COL", function () {
  return a.getBool("WEBGL_PACK");
}), a.registerFlag("WEBGL_MAX_TEXTURE_SIZE", function () {
  return me(a.getNumber("WEBGL_VERSION"));
}), a.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER", function () {
  return ge(a.getNumber("WEBGL_VERSION"));
}), a.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION", function () {
  var t = a.getNumber("WEBGL_VERSION");
  return 0 === t ? 0 : ye(t);
}), a.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE", function () {
  return a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 && (t = navigator.userAgent || navigator.vendor || window.opera, !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))));
  var t;
}), a.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED", function () {
  return be(a.getNumber("WEBGL_VERSION"));
}), a.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED", function () {
  return Ce(a.getNumber("WEBGL_VERSION"));
}), a.registerFlag("WEBGL_FENCE_API_ENABLED", function () {
  return Re(a.getNumber("WEBGL_VERSION"));
}), a.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM", function () {
  return a.getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? 4 : 0;
}), ct = Ae;
var cn = 30;

function hn(t) {
  return t <= cn ? t : V(t, Math.floor(Math.sqrt(t)));
}

function pn(t, e, n) {
  if (e.rank < 1) throw new Error("tf.scatterND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if (t.rank < 1) throw new Error("tf.scatterND() expects the updates to be rank 1 or higher, but the rank was " + t.rank + ".");
  if ("int32" !== e.dtype) throw new Error("The dtype of 'indices' should be int32, but got dtype: " + e.dtype);
  if (n.length < 1) throw new Error("Output rank must be greater or equal to 1, but got shape: " + n);

  if (0 === n.length) {
    if (0 === e.size) throw new Error("Indices specified for empty output. indices shape: " + e.shape);
    if (0 === t.size) throw new Error("Updates specified for empty output. updates shape: " + t.shape);
  }

  !function (t, e, n) {
    var r = e.rank > 1 ? e.shape[e.rank - 1] : 1,
        o = e.rank > 1 ? e.rank - 1 : 1,
        a = "Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: " + n.shape + ", indices.shape: " + e.shape + ", shape: " + t + ", sliceDim: " + r + ", and batchDim: " + o + ".";
    if (n.rank < o) throw new Error(a + " update.rank < " + o + ". ");
    if (t.length < r + (n.rank - o)) throw new Error(a + " Output shape length < " + (r + (n.rank - o)));
    if (n.rank !== o + t.length - r) throw new Error(a + " update.rank != " + (o + t.length - r));

    for (var i = 0; i < o; ++i) if (n.shape[i] !== e.shape[i]) throw new Error(a + " updates.shape[" + i + "] (" + n.shape[i] + ") != indices.shape[" + i + "] (" + e.shape[i] + ").");

    for (i = 0; i < n.rank - o; ++i) if (n.shape[i + o] !== t[i + r]) throw new Error(a + " updates.shape[" + (i + o) + "] (" + n.shape[i + o] + ") != shape[" + (i + o) + "] (" + t[i + o] + ")");
  }(n, e, t);
}

function fn(t, e, n) {
  for (var r = e.rank > 1 ? e.shape[e.rank - 1] : 1, o = n.length, a = 1, i = r; i < o; ++i) a *= n[i];

  var s = r < 1 ? 1 : r;
  return {
    sliceRank: r,
    numUpdates: e.size / s,
    sliceSize: a,
    strides: G(n.slice(0, r)).concat([1]),
    outputSize: y(n)
  };
}

function dn(t, e, n, r, o, a, i, s, u) {
  if (void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), void 0 === u && (u = 0), 0 !== i) throw new Error("ellipsis mask is not yet supported");
  if (0 !== s) throw new Error("new axis mask is not yet supported");

  for (var l = [], c = [], h = [], p = 0; p < t.length; p++) l[p] = vn(o, e, r, t, p), c[p] = mn(a, n, r, t, p), u & 1 << p && (c[p] = l[p] + 1, h.push(p));

  var f = new Array(t.length).fill(0);
  return f = f.map(function (t, e) {
    for (var n = 0, o = r[e] || 1, a = l[e]; !(o > 0 ? a >= c[e] : a <= c[e]); a += o) n += 1;

    return n;
  }), [l, f, h];
}

function vn(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = h(0, a, s - 1);
}

function mn(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = i > 0 ? h(0, a, s) : h(-1, a, s - 1);
}

function gn(t, e, n) {
  for (var r = n.length, o = 0; o < n.length; o++) if (n[o] > 1) {
    r = o;
    break;
  }

  for (o = r + 1; o < n.length; o++) if (e[o] > 0 || n[o] !== t[o]) return !1;

  return !0;
}

function yn(t, e) {
  for (var n = t.length > 0 ? t[t.length - 1] : 1, r = 0; r < t.length - 1; r++) n += t[r] * e[r];

  return n;
}

function xn(t) {
  var e = t;
  if (M(t)) return [t.length];
  if (!Array.isArray(t)) return [];

  for (var n = []; Array.isArray(e) || M(e);) n.push(e.length), e = e[0];

  return Array.isArray(t) && a.getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY") && function t(e, n, r) {
    r = r || [];
    if (!Array.isArray(e) && !M(e)) return void d(0 === n.length, function () {
      return "Element arr[" + r.join("][") + "] is a primitive, but should be an array/TypedArray of " + n[0] + " elements";
    });
    d(n.length > 0, function () {
      return "Element arr[" + r.join("][") + "] should be a primitive, but is an array of " + e.length + " elements";
    });
    d(e.length === n[0], function () {
      return "Element arr[" + r.join("][") + "] should have " + n[0] + " elements, but has " + e.length + " elements";
    });
    var o = n.slice(1);

    for (var a = 0; a < e.length; ++a) t(e[a], o, r.concat(a));
  }(t, n, []), n;
}

function wn(t, e, n, r) {
  if (null != t && ("numeric" !== t && t !== e || "numeric" === t && "string" === e)) throw new Error("Argument '" + n + "' passed to '" + r + "' must be " + t + " tensor, but got " + e + " tensor");
}

function bn(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), t instanceof ht) return wn(r, t.dtype, e, n), t;
  var o = U(t);

  if ("string" !== o && ["bool", "int32", "float32"].indexOf(r) >= 0 && (o = r), wn(r, o, e, n), null == t || !M(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) {
    var i = null == t ? "null" : t.constructor.name;
    throw new Error("Argument '" + e + "' passed to '" + n + "' must be a Tensor or TensorLike, but got '" + i + "'");
  }

  var s = xn(t);
  M(t) || Array.isArray(t) || (t = [t]);
  var u = "string" !== o ? q(t, o, a.getBool("DEBUG")) : g(t);
  return ht.make(s, {
    values: u
  }, o);
}

function Cn(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), !Array.isArray(t)) throw new Error("Argument " + e + " passed to " + n + " must be a `Tensor[]` or `TensorLike[]`");
  return t.map(function (t, r) {
    return bn(t, e + "[" + r + "]", n);
  }, r);
}

function En(t) {
  return d(z(t), function () {
    return "The f passed in grad(f) must be a function";
  }), function (e, n) {
    var r = bn(e, "x", "tf.grad", null),
        o = null != n ? bn(n, "dy", "tf.grad") : null;
    return At.tidy(function () {
      var e = At.gradients(function () {
        return t(r);
      }, [r], o),
          n = e.value,
          a = e.grads;
      return null != o && v(n.shape, o.shape, "The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"), An(a), a[0];
    });
  };
}

function Rn(t) {
  return d(z(t), function () {
    return "The f passed in grads(f) must be a function";
  }), function (e, n) {
    d(Array.isArray(e), function () {
      return "The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s";
    });
    var r = Cn(e, "args", "tf.grads", null),
        o = null != n ? bn(n, "dy", "tf.grads") : null;
    return At.tidy(function () {
      var e = At.gradients(function () {
        return t.apply(void 0, r);
      }, r, o),
          n = e.value,
          a = e.grads;
      return null != o && v(n.shape, o.shape, "The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), An(a), a;
    });
  };
}

function In(t) {
  return d(z(t), function () {
    return "The f passed in valueAndGrad(f) must be a function";
  }), function (e, n) {
    d(e instanceof ht, function () {
      return "The x passed in valueAndGrad(f)(x) must be a tensor";
    }), d(null == n || n instanceof ht, function () {
      return "The dy passed in valueAndGrad(f)(x, dy) must be a tensor";
    });
    var r = At.gradients(function () {
      return t(e);
    }, [e], n),
        o = r.grads,
        a = r.value;
    return An(o), {
      grad: o[0],
      value: a
    };
  };
}

function Sn(t) {
  return d(z(t), function () {
    return "The f passed in valueAndGrads(f) must be a function";
  }), function (e, n) {
    d(Array.isArray(e) && e.every(function (t) {
      return t instanceof ht;
    }), function () {
      return "The args passed in valueAndGrads(f)(args) must be array of tensors";
    }), d(null == n || n instanceof ht, function () {
      return "The dy passed in valueAndGrads(f)(args, dy) must be a tensor";
    });
    var r = At.gradients(function () {
      return t.apply(void 0, e);
    }, e, n);
    return null != n && v(r.value.shape, n.shape, "The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), An(r.grads), r;
  };
}

function Nn(t, e) {
  d(z(t), function () {
    return "The f passed in variableGrads(f) must be a function";
  }), d(null == e || Array.isArray(e) && e.every(function (t) {
    return t instanceof pt;
  }), function () {
    return "The varList passed in variableGrads(f, varList) must be an array of variables";
  });
  var n = null != e;
  if (!n) for (var r in e = [], At.registeredVariables) e.push(At.registeredVariables[r]);
  var o = n ? e.filter(function (t) {
    return !t.trainable;
  }) : null,
      a = e.length;
  d((e = e.filter(function (t) {
    return t.trainable;
  })).length > 0, function () {
    return "variableGrads() expects at least one of the input variables to be trainable, but none of the " + a + " variables is trainable.";
  });
  var i = At.gradients(t, e, null, !0),
      s = i.value,
      u = i.grads;
  d(u.some(function (t) {
    return null != t;
  }), function () {
    return "Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().";
  }), d(0 === s.rank, function () {
    return "The f passed in variableGrads(f) must return a scalar, but it returned a rank-" + s.rank + " tensor";
  });
  var l = {};
  return e.forEach(function (t, e) {
    null != u[e] && (l[t.name] = u[e]);
  }), null != o && o.forEach(function (t) {
    return l[t.name] = null;
  }), {
    value: s,
    grads: l
  };
}

function kn(t) {
  return At.customGrad(t);
}

function An(t) {
  if (t.filter(function (t) {
    return null == t;
  }).length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
}

function Tn(t) {
  var e = Object.keys(t);
  if (1 !== e.length) throw new Error("Please provide an object with a single key (operation name) mapping to a function. Got an object with " + e.length + " keys.");
  var n = e[0],
      r = t[n];
  n.endsWith("_") && (n = n.substring(0, n.length - 1));

  var o = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    At.startScope(n);

    try {
      var o = r.apply(void 0, t);
      return o instanceof Promise && console.error("Cannot return a Promise inside of tidy."), At.endScope(o), o;
    } catch (t) {
      throw At.endScope(null), t;
    }
  };

  return Object.defineProperty(o, "name", {
    value: n,
    configurable: !0
  }), o;
}

var Dn = Tn({
  softmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = bn(t, "logits", "softmax");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and dim was " + e);
    return kn(function (t, n) {
      var r = t.logSumExp([e], !0),
          o = t.toFloat().sub(r).exp();
      return n([o]), {
        value: o,
        gradFunc: function (t, n) {
          var r = n[0],
              o = t.mul(r);
          return o.sub(o.sum([e], !0).mul(r));
        }
      };
    })(n);
  }
}),
    _n = Tn({
  logSoftmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = bn(t, "logits", "logSoftmax");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Log Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and axis was " + e);
    return kn(function (t, n) {
      var r = t.max(e, !0),
          o = t.sub(r),
          a = o.toFloat().sub(o.exp().sum(e, !0).log());
      return n([a]), {
        value: a,
        gradFunc: function (t, n) {
          var r = n[0].exp();
          return t.sub(t.sum(e, !0).mul(r));
        }
      };
    })(n);
  }
});

exports.logSoftmax = _n;
exports.softmax = Dn;
var On = Tn({
  complex_: function (t, e) {
    var n = bn(t, "real", "complex"),
        r = bn(e, "imag", "complex");
    return v(n.shape, r.shape, "real and imag shapes, " + n.shape + " and " + r.shape + ", must match in call to tf.complex()."), At.runKernel(function (t) {
      return t.complex(n, r);
    }, {
      $real: n,
      $imag: r
    });
  }
}),
    Mn = Tn({
  real_: function (t) {
    var e = bn(t, "input", "real");
    return At.runKernel(function (t) {
      return t.real(e);
    }, {
      $input: e
    });
  }
}),
    Fn = Tn({
  imag_: function (t) {
    var e = bn(t, "input", "imag");
    return At.runKernel(function (t) {
      return t.imag(e);
    }, {
      $input: e
    });
  }
});
exports.imag = Fn;
exports.real = Mn;
exports.complex = On;

function Bn(t, e, n) {
  if (null == n && (n = U(t)), "complex64" === n) throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");
  if (!M(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");
  var r = xn(t);

  if (null != e) {
    X(e);
    var o = y(e),
        i = y(r);
    d(o === i, function () {
      return "Based on the provided shape, [" + e + "], the tensor should have " + o + " values but has " + i;
    });

    for (var s = 0; s < r.length; ++s) {
      var u = r[s],
          l = s !== r.length - 1 || u !== y(e.slice(s));
      d(r[s] === e[s] || !l, function () {
        return "Error creating a new Tensor. Inferred shape (" + r + ") does not match the provided shape (" + e + "). ";
      });
    }
  }

  return M(t) || Array.isArray(t) || (t = [t]), e = e || r, t = "string" !== n ? q(t, n, a.getBool("DEBUG")) : g(t), ht.make(e, {
    values: t
  }, n);
}

function Pn(t, e) {
  if ((M(t) || Array.isArray(t)) && "complex64" !== e) throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");
  return Bn(t, [], e);
}

function Ln(t, e) {
  m(t);
  var n = xn(t);
  if (1 !== n.length) throw new Error("tensor1d() requires values to be a flat/TypedArray");
  return Bn(t, n, e);
}

function Wn(t, e, n) {
  if (m(t), null != e && 2 !== e.length) throw new Error("tensor2d() requires shape to have two numbers");
  var r = xn(t);
  if (2 !== r.length && 1 !== r.length) throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");
  return Bn(t, e = e || r, n);
}

function Un(t, e, n) {
  if (m(t), null != e && 3 !== e.length) throw new Error("tensor3d() requires shape to have three numbers");
  var r = xn(t);
  if (3 !== r.length && 1 !== r.length) throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");
  return Bn(t, e = e || r, n);
}

function zn(t, e, n) {
  if (m(t), null != e && 4 !== e.length) throw new Error("tensor4d() requires shape to have four numbers");
  var r = xn(t);
  if (4 !== r.length && 1 !== r.length) throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");
  return Bn(t, e = e || r, n);
}

function Vn(t, e, n) {
  if (m(t), null != e && 5 !== e.length) throw new Error("tensor5d() requires shape to have five numbers");
  var r = xn(t);
  if (5 !== r.length && 1 !== r.length) throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");
  return Bn(t, e = e || r, n);
}

function Gn(t, e, n) {
  if (m(t), null != e && 6 !== e.length) throw new Error("tensor6d() requires shape to have six numbers");
  var r = xn(t);
  if (6 !== r.length && 1 !== r.length) throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");
  return Bn(t, e = e || r, n);
}

function qn(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = qn(t, "float32"),
        r = Hn(t, "float32");
    return On(n, r);
  }

  var o = $(y(t), e);
  return ht.make(t, {
    values: o
  }, e);
}

function Hn(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = Hn(t, "float32"),
        r = Hn(t, "float32");
    return On(n, r);
  }

  var o = j(y(t), e);
  return ht.make(t, {
    values: o
  }, e);
}

function $n(t, e, n) {
  return At.runKernel(function (r) {
    return r.fill(t, e, n);
  }, {});
}

function jn(t, e, n) {
  if (n <= 0) throw new Error("The number of values should be positive.");
  return At.runKernel(function (r) {
    return r.linspace(t, e, n);
  }, {});
}

function Kn(t, e, n, r) {
  if (void 0 === n && (n = 1), void 0 === r && (r = "float32"), 0 === n) throw new Error("Cannot have a step of zero");
  if (t === e || t < e && n < 0 || e < t && n > 1) return Hn([0], r);
  var o = j(Math.abs(Math.ceil((e - t) / n)), r);
  e < t && 1 === n && (n = -1), o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + n;

  return Ln(o, r);
}

var Xn = Tn({
  onesLike_: function (t) {
    var e = bn(t, "x", "onesLike");

    if ("complex64" === e.dtype) {
      var n = Xn(Mn(e)),
          r = Yn(Fn(e));
      return On(n, r);
    }

    return At.runKernel(function (t) {
      return t.onesLike(e);
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Yn = Tn({
  zerosLike_: function (t) {
    var e = bn(t, "x", "zerosLike");
    return At.runKernel(function (t) {
      return t.zerosLike(e);
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Qn = function () {
  function t(t, e) {
    this.backend = t, this.dataMover = e, this.data = new WeakMap();
  }

  return t.prototype.get = function (t) {
    return this.data.has(t) || this.dataMover.moveData(this.backend, t), this.data.get(t);
  }, t.prototype.set = function (t, e) {
    this.data.set(t, e);
  }, t.prototype.has = function (t) {
    return this.data.has(t);
  }, t.prototype.delete = function (t) {
    return this.data.delete(t);
  }, t;
}(),
    Jn = function () {
  function t() {}

  return t.prototype.time = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.read = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.readSync = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.disposeData = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.write = function (t, e) {
    throw new Error("Not yet implemented.");
  }, t.prototype.fromPixels = function (t, e) {
    throw new Error("Not yet implemented.");
  }, t.prototype.register = function (t, e, n) {
    throw new Error("Not yet implemented.");
  }, t.prototype.memory = function () {
    throw new Error("Not yet implemented.");
  }, t.prototype.floatPrecision = function () {
    throw new Error("Not yet implemented");
  }, t.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.fusedBatchMatMul = function (t, e, n, r, o, a) {
    throw new Error("Not yet implemented");
  }, t.prototype.slice = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s, u) {
    throw new Error("Not yet implemented");
  }, t.prototype.unstack = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.reverse = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.concat = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.neg = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.add = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.addN = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.subtract = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.multiply = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.realDivide = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.floorDiv = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.sum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.prod = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.argMin = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.argMax = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.equal = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.notEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.less = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.lessEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.greater = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.greaterEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalNot = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalAnd = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalOr = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.where = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.select = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.topk = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.min = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.minimum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.mod = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.max = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.maximum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.all = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.any = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.squaredDifference = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.ceil = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.floor = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.round = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sign = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isNaN = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isInf = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isFinite = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.pow = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.exp = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.expm1 = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.log = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.log1p = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sqrt = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.rsqrt = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.square = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.reciprocal = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.relu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.prelu = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.elu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.eluDer = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.selu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.int = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.clip = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.abs = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.complexAbs = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sigmoid = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.softplus = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sin = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cos = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.tan = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.asin = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.acos = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atan = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atan2 = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.sinh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cosh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.tanh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.asinh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.acosh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atanh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.erf = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.step = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv2d = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3d = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPool = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPool = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.reshape = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.cast = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.tile = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.pad = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.transpose = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.gather = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.gatherND = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.scatterND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.batchNormalization = function (t, e, n, r, o, a) {
    throw new Error("Not yet implemented");
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    throw new Error("Not yet implemented");
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    throw new Error("Not yet implemented");
  }, t.prototype.multinomial = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.oneHot = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.cumsum = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    throw new Error("Not yet implemented");
  }, t.prototype.fft = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.ifft = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.complex = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.real = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.imag = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthToSpace = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.split = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.fill = function (t, e, n) {
    throw new Error("Not yet implemented.");
  }, t.prototype.onesLike = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.zerosLike = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.linspace = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.dispose = function () {
    throw new Error("Not yet implemented");
  }, t;
}();

exports.KernelBackend = Jn;
exports.DataStorage = Qn;
exports.zerosLike = Yn;
exports.onesLike = Xn;

function Zn(t, e) {
  for (var n = t.length, r = [], o = 0; o < n; o++) {
    var a = n - 1 - o,
        i = t[a] || 1;
    (e[e.length - 1 - o] || 1) > 1 && 1 === i && r.unshift(a);
  }

  return r;
}

function tr(t, e) {
  for (var n = [], r = 0; r < e.length; r++) {
    var o = t[t.length - r - 1],
        a = e.length - r - 1,
        i = e[a];
    (null == o || 1 === o && i > 1) && n.unshift(a);
  }

  return n;
}

function er(t, e) {
  for (var n = [], r = Math.max(t.length, e.length), o = 0; o < r; o++) {
    var a = t[t.length - o - 1];
    null == a && (a = 1);
    var i = e[e.length - o - 1];
    if (null == i && (i = 1), 1 === a) n.unshift(i);else if (1 === i) n.unshift(a);else {
      if (a !== i) throw Error("Operands could not be broadcast together with shapes " + t + " and " + e + ".");
      n.unshift(a);
    }
  }

  return n;
}

function nr(t, e, n, r, o, a, i) {
  void 0 === i && (i = "channelsLast");
  var s,
      u = ir(e),
      l = u[0],
      c = u[1];
  if ("channelsLast" === i) s = [l, c, t[3], t[3]];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    s = [l, c, t[1], t[1]];
  }
  return rr(t, s, n, r, o, a, !1, i);
}

function rr(t, e, n, r, o, a, i, s) {
  void 0 === i && (i = !1), void 0 === s && (s = "channelsLast");
  var u = [-1, -1, -1, -1],
      l = u[0],
      c = u[1],
      h = u[2],
      p = u[3];
  if ("channelsLast" === s) l = t[0], c = t[1], h = t[2], p = t[3];else {
    if ("channelsFirst" !== s) throw new Error("Unknown dataFormat " + s);
    l = t[0], p = t[1], c = t[2], h = t[3];
  }

  var f,
      v = e[0],
      m = e[1],
      g = e[3],
      y = ir(n),
      x = y[0],
      b = y[1],
      C = ir(r),
      E = C[0],
      R = C[1],
      I = ur(v, E),
      S = ur(m, R),
      N = function (t, e, n, r, o, a, i, s) {
    var u, l, c;

    if ("number" == typeof t) {
      var h = 0 === t ? "VALID" : "NUMBER";
      u = {
        top: t,
        bottom: t,
        left: t,
        right: t,
        type: h
      };

      var p = function (t, e, n, r, o, a) {
        null == o && (o = ar(t, e, r));
        var i = t[0],
            s = t[1],
            u = lr((i - e + 2 * o) / r + 1, a);
        d(w(u), function () {
          return "The output # of rows (" + u + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var l = lr((s - e + 2 * o) / r + 1, a);
        return d(w(l), function () {
          return "The output # of columns (" + l + ") must be an integer. Change the stride and/or zero pad parameters";
        }), [u, l, n];
      }([e, n, 1], a, 1, r, t, s);

      l = p[0], c = p[1];
    } else if ("same" === t) {
      l = Math.ceil(e / r), c = Math.ceil(n / o);
      var f = Math.max(0, (l - 1) * r + a - e),
          v = Math.max(0, (c - 1) * o + i - n),
          m = Math.floor(f / 2),
          g = f - m,
          y = Math.floor(v / 2),
          x = v - y;
      u = {
        top: m,
        bottom: g,
        left: y,
        right: x,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      u = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        type: "VALID"
      }, l = Math.ceil((e - a + 1) / r), c = Math.ceil((n - i + 1) / o);
    }

    return {
      padInfo: u,
      outHeight: l,
      outWidth: c
    };
  }(o, c, h, x, b, I, S, a),
      k = N.padInfo,
      A = N.outHeight,
      T = N.outWidth,
      D = i ? g * p : g;

  return "channelsFirst" === s ? f = [l, D, A, T] : "channelsLast" === s && (f = [l, A, T, D]), {
    batchSize: l,
    dataFormat: s,
    inHeight: c,
    inWidth: h,
    inChannels: p,
    outHeight: A,
    outWidth: T,
    outChannels: D,
    padInfo: k,
    strideHeight: x,
    strideWidth: b,
    filterHeight: v,
    filterWidth: m,
    effectiveFilterHeight: I,
    effectiveFilterWidth: S,
    dilationHeight: E,
    dilationWidth: R,
    inShape: t,
    outShape: f,
    filterShape: e
  };
}

function or(t, e, n, r, o, a, i) {
  void 0 === a && (a = !1), void 0 === i && (i = "channelsLast");
  var s = [-1, -1, -1, -1, -1],
      u = s[0],
      l = s[1],
      c = s[2],
      h = s[3],
      p = s[4];
  if ("channelsLast" === i) u = t[0], l = t[1], c = t[2], h = t[3], p = t[4];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    u = t[0], p = t[1], l = t[2], c = t[3], h = t[4];
  }

  var f,
      d = e[0],
      v = e[1],
      m = e[2],
      g = e[4],
      y = sr(n),
      x = y[0],
      w = y[1],
      b = y[2],
      C = sr(r),
      E = C[0],
      R = C[1],
      I = C[2],
      S = function (t, e, n, r, o, a, i, s, u, l) {
    var c, h, p, f;

    if ("same" === t) {
      h = Math.ceil(e / o), p = Math.ceil(n / a), f = Math.ceil(r / i);
      var d = (h - 1) * o + s - e,
          v = (p - 1) * a + u - n,
          m = (f - 1) * i + l - r,
          g = Math.floor(d / 2),
          y = d - g,
          x = Math.floor(v / 2),
          w = v - x,
          b = Math.floor(m / 2),
          C = m - b;
      c = {
        top: x,
        bottom: w,
        left: b,
        right: C,
        front: g,
        back: y,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      c = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        front: 0,
        back: 0,
        type: "VALID"
      }, h = Math.ceil((e - s + 1) / o), p = Math.ceil((n - u + 1) / a), f = Math.ceil((r - l + 1) / i);
    }

    return {
      padInfo: c,
      outDepth: h,
      outHeight: p,
      outWidth: f
    };
  }(o, l, c, h, x, w, b, ur(d, E), ur(v, R), ur(m, I)),
      N = S.padInfo,
      k = S.outDepth,
      A = S.outHeight,
      T = S.outWidth,
      D = a ? g * p : g;

  return "channelsFirst" === i ? f = [u, D, k, A, T] : "channelsLast" === i && (f = [u, k, A, T, D]), {
    batchSize: u,
    dataFormat: i,
    inDepth: l,
    inHeight: c,
    inWidth: h,
    inChannels: p,
    outDepth: k,
    outHeight: A,
    outWidth: T,
    outChannels: D,
    padInfo: N,
    strideDepth: x,
    strideHeight: w,
    strideWidth: b,
    filterDepth: d,
    filterHeight: v,
    filterWidth: m,
    dilationDepth: E,
    dilationHeight: R,
    dilationWidth: I,
    inShape: t,
    outShape: f,
    filterShape: e
  };
}

function ar(t, e, n, r) {
  void 0 === r && (r = 1);
  var o = ur(e, r);
  return Math.floor((t[0] * (n - 1) - n + o) / 2);
}

function ir(t) {
  return "number" == typeof t ? [t, t] : t;
}

function sr(t) {
  return "number" == typeof t ? [t, t, t] : t;
}

function ur(t, e) {
  return e <= 1 ? t : t + (t - 1) * (e - 1);
}

function lr(t, e) {
  if (!e) return t;

  switch (e) {
    case "round":
      return Math.round(t);

    case "ceil":
      return Math.ceil(t);

    case "floor":
      return Math.floor(t);

    default:
      throw new Error("Unknown roundingMode " + e);
  }
}

function cr(t) {
  var e = ir(t),
      n = e[0],
      r = e[1];
  return 1 === n && 1 === r;
}

function hr(t, e) {
  return cr(t) || cr(e);
}

function pr(t, e, n) {
  if ("complex64" === e) {
    if ("complex64" === t.dtype) return t.clone();
    var r = Hn(t.shape),
        o = t.toFloat(),
        a = n.complex(o, r);
    return r.dispose(), o.dispose(), a;
  }

  if (!O(t.dtype, e)) return ht.make(t.shape, {
    dataId: t.dataId
  }, e);

  if ("complex64" === t.dtype) {
    var i = n.real(t);
    a = i.cast(e);
    return i.dispose(), a;
  }

  if ("int32" === e) return n.int(t);

  if ("bool" === e) {
    var s = Pn(0, t.dtype);
    a = n.notEqual(t, s);
    return s.dispose(), a;
  }

  throw new Error("Error in Cast: failed to cast " + t.dtype + " to " + e);
}

function fr(t, e) {
  return ht.make(e, {
    dataId: t.dataId
  }, t.dtype);
}

function dr(t, e, n) {
  var r = (e - t) / (n - 1),
      o = j(n, "float32");
  o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + r;

  return Ln(o, "float32");
}

var vr = Object.freeze({
  castTensor: pr,
  reshapeTensor: fr,
  linspaceImpl: dr,
  upcastType: wt,
  axesAreInnerMostDims: Je,
  combineLocations: Ze,
  computeOutAndReduceShapes: tn,
  expandShapeToKeepDim: en,
  assertAxesAreInnerMostDims: nn,
  getAxesPermutation: rn,
  getUndoAxesPermutation: on,
  getInnerMostAxes: an,
  getBroadcastDims: Zn,
  getReductionAxes: tr,
  assertAndGetBroadcastShape: er,
  assertParamsConsistent: sn,
  computeOutShape: un,
  computePool2DInfo: nr,
  computeConv2DInfo: rr,
  computeConv3DInfo: or,
  computeDefaultPad: ar,
  tupleValuesAreOne: cr,
  eitherStridesOrDilationsAreOne: hr
});
exports.backend_util = vr;

function mr(t, e) {
  if (t.length !== e.length) throw new Error("Cannot merge real and imag arrays of different lengths. real:" + t.length + ", imag: " + e.length + ".");

  for (var n = new Float32Array(2 * t.length), r = 0; r < n.length; r += 2) n[r] = t[r / 2], n[r + 1] = e[r / 2];

  return n;
}

function gr(t, e) {
  return {
    real: t[2 * e],
    imag: t[2 * e + 1]
  };
}

function yr(t, e, n, r) {
  t[2 * r] = e, t[2 * r + 1] = n;
}

function xr(t, e, n) {
  var r = (n ? 2 : -2) * Math.PI * (t / e);
  return {
    real: Math.cos(r),
    imag: Math.sin(r)
  };
}

function wr(t, e, n, r, o) {
  for (var a = Array.from(e).map(function (t, e) {
    return {
      score: t,
      boxIndex: e
    };
  }).filter(function (t) {
    return t.score > o;
  }).sort(function (t, e) {
    return e.score - t.score;
  }), i = [], s = 0; s < a.length; s++) {
    var u = a[s],
        l = u.score,
        c = u.boxIndex;
    if (l < o) break;

    for (var h = !1, p = i.length - 1; p >= 0; --p) {
      if (br(t, c, i[p]) >= r) {
        h = !0;
        break;
      }
    }

    if (!h && (i.push(c), i.length >= n)) break;
  }

  return Ln(i, "int32");
}

function br(t, e, n) {
  var r = t.subarray(4 * e, 4 * e + 4),
      o = t.subarray(4 * n, 4 * n + 4),
      a = Math.min(r[0], r[2]),
      i = Math.min(r[1], r[3]),
      s = Math.max(r[0], r[2]),
      u = Math.max(r[1], r[3]),
      l = Math.min(o[0], o[2]),
      c = Math.min(o[1], o[3]),
      h = Math.max(o[0], o[2]),
      p = Math.max(o[1], o[3]),
      f = (s - a) * (u - i),
      d = (h - l) * (p - c);
  if (f <= 0 || d <= 0) return 0;
  var v = Math.max(a, l),
      m = Math.max(i, c),
      g = Math.min(s, h),
      y = Math.min(u, p),
      x = Math.max(g - v, 0) * Math.max(y - m, 0);
  return x / (f + d - x);
}

function Cr(t, e, n) {
  var r = new Array(t.rank).fill(0),
      o = t.shape.slice();
  return e.map(function (e) {
    o[n] = e;
    var a = t.slice(r, o);
    return r[n] += e, a;
  });
}

function Er(t, e, n, r, o) {
  for (var a = e[e.length - 1], i = [t.length / a, a], s = i[0], u = i[1], l = k(n, s * r), c = k("int32", s * r), h = 0; h < s; h++) {
    for (var p = h * u, f = t.subarray(p, p + u), d = [], v = 0; v < f.length; v++) d.push({
      value: f[v],
      index: v
    });

    d.sort(function (t, e) {
      return e.value - t.value;
    });
    var m = h * r,
        g = l.subarray(m, m + r),
        y = c.subarray(m, m + r);

    for (v = 0; v < r; v++) g[v] = d[v].value, y[v] = d[v].index;
  }

  var x = e.slice();
  return x[x.length - 1] = r, [Bn(l, x, n), Bn(c, x, "int32")];
}

var Rr = Tn({
  concat_: function (t, e) {
    void 0 === e && (e = 0), d(t.length >= 1, function () {
      return "Pass at least one tensor to concat";
    });
    var n = Cn(t, "tensors", "concat");
    e = S(e, n[0].shape)[0];
    var r = un(n.map(function (t) {
      return t.shape;
    }), e);
    if (0 === y(r)) return Bn([], r);
    if (1 === (n = n.filter(function (t) {
      return t.size > 0;
    })).length) return n[0];
    var o = n.map(function (t) {
      return t.shape;
    });
    sn(o, e);
    var a = n;
    return At.runKernel(function (t) {
      return t.concat(n, e);
    }, a, function (t) {
      var n = o.map(function (t) {
        return t[e];
      });
      return Ar(t, n, e).map(function (t) {
        return function () {
          return t;
        };
      });
    });
  }
}),
    Ir = Tn({
  concat1d_: function (t) {
    return Rr(t, 0);
  }
}),
    Sr = Tn({
  concat2d_: function (t, e) {
    return Rr(t, e);
  }
}),
    Nr = Tn({
  concat3d_: function (t, e) {
    return Rr(t, e);
  }
}),
    kr = Tn({
  concat4d_: function (t, e) {
    return Rr(t, e);
  }
}),
    Ar = Tn({
  split_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r,
        o = bn(t, "x", "split");
    return n = S(n, o.shape)[0], "number" == typeof e ? (d(o.shape[n] % e == 0, function () {
      return "Number of splits must evenly divide the axis.";
    }), r = new Array(e).fill(o.shape[n] / e)) : (d(o.shape[n] === e.reduce(function (t, e) {
      return t + e;
    }), function () {
      return "The sum of sizes must match the size of the axis dimension.";
    }), r = e), At.runKernel(function (t) {
      return t.split(o, r, n);
    }, {
      $x: o
    }, function (t) {
      return {
        $x: function () {
          return Rr(t, n);
        }
      };
    });
  }
});
exports.split = Ar;
exports.concat4d = kr;
exports.concat3d = Nr;
exports.concat2d = Sr;
exports.concat1d = Ir;
exports.concat = Rr;
"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;

function Tr(t, e) {
  return t(e = {
    exports: {}
  }, e.exports), e.exports;
}

var Dr = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e,
          n = this,
          r = (e = 4022871197, function (t) {
        t = t.toString();

        for (var n = 0; n < t.length; n++) {
          var r = .02519603282416938 * (e += t.charCodeAt(n));
          r -= e = r >>> 0, e = (r *= e) >>> 0, e += 4294967296 * (r -= e);
        }

        return 2.3283064365386963e-10 * (e >>> 0);
      });
      n.next = function () {
        var t = 2091639 * n.s0 + 2.3283064365386963e-10 * n.c;
        return n.s0 = n.s1, n.s1 = n.s2, n.s2 = t - (n.c = 0 | t);
      }, n.c = 1, n.s0 = r(" "), n.s1 = r(" "), n.s2 = r(" "), n.s0 -= r(t), n.s0 < 0 && (n.s0 += 1), n.s1 -= r(t), n.s1 < 0 && (n.s1 += 1), n.s2 -= r(t), n.s2 < 0 && (n.s2 += 1), r = null;
    }

    function o(t, e) {
      return e.c = t.c, e.s0 = t.s0, e.s1 = t.s1, e.s2 = t.s2, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = n.next;
      return i.int32 = function () {
        return 4294967296 * n.next() | 0;
      }, i.double = function () {
        return i() + 1.1102230246251565e-16 * (2097152 * i() | 0);
      }, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.alea = a;
  }(0, t, !1);
}),
    _r = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.next = function () {
        var t = e.x ^ e.x << 11;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w ^= e.w >>> 19 ^ t ^ t >>> 8;
      }, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor128 = a;
  }(0, t, !1);
}),
    Or = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.x ^ e.x >>> 2;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w = e.v, (e.d = e.d + 362437 | 0) + (e.v = e.v ^ e.v << 4 ^ t ^ t << 1) | 0;
      }, e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.v = 0, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), r == n.length && (e.d = e.x << 10 ^ e.x >>> 4), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e.v = t.v, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorwow = a;
  }(0, t, !1);
}),
    Mr = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.x,
            o = e.i;
        return t = r[o], n = (t ^= t >>> 7) ^ t << 24, n ^= (t = r[o + 1 & 7]) ^ t >>> 10, n ^= (t = r[o + 3 & 7]) ^ t >>> 3, n ^= (t = r[o + 4 & 7]) ^ t << 7, t = r[o + 7 & 7], n ^= (t ^= t << 13) ^ t << 9, r[o] = n, e.i = o + 1 & 7, n;
      }, function (t, e) {
        var n,
            r = [];
        if (e === (0 | e)) r[0] = e;else for (e = "" + e, n = 0; n < e.length; ++n) r[7 & n] = r[7 & n] << 15 ^ e.charCodeAt(n) + r[n + 1 & 7] << 13;

        for (; r.length < 8;) r.push(0);

        for (n = 0; n < 8 && 0 === r[n]; ++n);

        for (8 == n ? r[7] = -1 : r[n], t.x = r, t.i = 0, n = 256; n > 0; --n) t.next();
      }(e, t);
    }

    function o(t, e) {
      return e.x = t.x.slice(), e.i = t.i, e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.x && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorshift7 = a;
  }(0, t, !1);
}),
    Fr = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.w,
            o = e.X,
            a = e.i;
        return e.w = r = r + 1640531527 | 0, n = o[a + 34 & 127], t = o[a = a + 1 & 127], n ^= n << 13, t ^= t << 17, n ^= n >>> 15, t ^= t >>> 12, n = o[a] = n ^ t, e.i = a, n + (r ^ r >>> 16) | 0;
      }, function (t, e) {
        var n,
            r,
            o,
            a,
            i,
            s = [],
            u = 128;

        for (e === (0 | e) ? (r = e, e = null) : (e += "\0", r = 0, u = Math.max(u, e.length)), o = 0, a = -32; a < u; ++a) e && (r ^= e.charCodeAt((a + 32) % e.length)), 0 === a && (i = r), r ^= r << 10, r ^= r >>> 15, r ^= r << 4, r ^= r >>> 13, a >= 0 && (i = i + 1640531527 | 0, o = 0 == (n = s[127 & a] ^= r + i) ? o + 1 : 0);

        for (o >= 128 && (s[127 & (e && e.length || 0)] = -1), o = 127, a = 512; a > 0; --a) r = s[o + 34 & 127], n = s[o = o + 1 & 127], r ^= r << 13, n ^= n << 17, r ^= r >>> 15, n ^= n >>> 12, s[o] = r ^ n;

        t.w = i, t.X = s, t.i = o;
      }(e, t);
    }

    function o(t, e) {
      return e.i = t.i, e.w = t.w, e.X = t.X.slice(), e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.X && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor4096 = a;
  }(0, t, !1);
}),
    Br = Tr(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.b,
            n = e.c,
            r = e.d,
            o = e.a;
        return t = t << 25 ^ t >>> 7 ^ n, n = n - r | 0, r = r << 24 ^ r >>> 8 ^ o, o = o - t | 0, e.b = t = t << 20 ^ t >>> 12 ^ n, e.c = n = n - r | 0, e.d = r << 16 ^ n >>> 16 ^ o, e.a = o - t | 0;
      }, e.a = 0, e.b = 0, e.c = -1640531527, e.d = 1367130551, t === Math.floor(t) ? (e.a = t / 4294967296 | 0, e.b = 0 | t) : n += t;

      for (var r = 0; r < n.length + 20; r++) e.b ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.a = t.a, e.b = t.b, e.c = t.c, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.tychei = a;
  }(0, t, !1);
}),
    Pr = Tr(function (t) {
  !function (e, n) {
    var r,
        o = this,
        a = 256,
        i = 6,
        s = "random",
        u = n.pow(a, i),
        l = n.pow(2, 52),
        c = 2 * l,
        h = a - 1;

    function p(t, h, p) {
      var g = [],
          y = v(function t(e, n) {
        var r,
            o = [],
            a = typeof e;
        if (n && "object" == a) for (r in e) try {
          o.push(t(e[r], n - 1));
        } catch (t) {}
        return o.length ? o : "string" == a ? e : e + "\0";
      }((h = 1 == h ? {
        entropy: !0
      } : h || {}).entropy ? [t, m(e)] : null == t ? function () {
        try {
          var t;
          return r && (t = r.randomBytes) ? t = t(a) : (t = new Uint8Array(a), (o.crypto || o.msCrypto).getRandomValues(t)), m(t);
        } catch (t) {
          var n = o.navigator,
              i = n && n.plugins;
          return [+new Date(), o, i, o.screen, m(e)];
        }
      }() : t, 3), g),
          x = new f(g),
          w = function () {
        for (var t = x.g(i), e = u, n = 0; t < l;) t = (t + n) * a, e *= a, n = x.g(1);

        for (; t >= c;) t /= 2, e /= 2, n >>>= 1;

        return (t + n) / e;
      };

      return w.int32 = function () {
        return 0 | x.g(4);
      }, w.quick = function () {
        return x.g(4) / 4294967296;
      }, w.double = w, v(m(x.S), e), (h.pass || p || function (t, e, r, o) {
        return o && (o.S && d(o, x), t.state = function () {
          return d(x, {});
        }), r ? (n[s] = t, e) : t;
      })(w, y, "global" in h ? h.global : this == n, h.state);
    }

    function f(t) {
      var e,
          n = t.length,
          r = this,
          o = 0,
          i = r.i = r.j = 0,
          s = r.S = [];

      for (n || (t = [n++]); o < a;) s[o] = o++;

      for (o = 0; o < a; o++) s[o] = s[i = h & i + t[o % n] + (e = s[o])], s[i] = e;

      (r.g = function (t) {
        for (var e, n = 0, o = r.i, i = r.j, s = r.S; t--;) e = s[o = h & o + 1], n = n * a + s[h & (s[o] = s[i = h & i + e]) + (s[i] = e)];

        return r.i = o, r.j = i, n;
      })(a);
    }

    function d(t, e) {
      return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e;
    }

    function v(t, e) {
      for (var n, r = t + "", o = 0; o < r.length;) e[h & o] = h & (n ^= 19 * e[h & o]) + r.charCodeAt(o++);

      return m(e);
    }

    function m(t) {
      return String.fromCharCode.apply(0, t);
    }

    if (n["seed" + s] = p, v(n.random(), e), t.exports) {
      t.exports = p;

      try {
        r = require("crypto");
      } catch (t) {}
    }
  }([], Math);
});

Pr.alea = Dr, Pr.xor128 = _r, Pr.xorwow = Or, Pr.xorshift7 = Mr, Pr.xor4096 = Fr, Pr.tychei = Br;

var Lr = Pr.alea,
    Wr = function () {
  function t(t, e, n, r, o) {
    this.mean = t, this.stdDev = e, this.dtype = n, this.nextVal = NaN, this.truncated = r, this.truncated && (this.upper = this.mean + 2 * this.stdDev, this.lower = this.mean - 2 * this.stdDev);
    var a = o || Math.random();
    this.random = Lr(a.toString());
  }

  return t.prototype.nextValue = function () {
    if (!isNaN(this.nextVal)) {
      var t = this.nextVal;
      return this.nextVal = NaN, t;
    }

    for (var e, n, r = !1; !r;) {
      var o = void 0,
          a = void 0,
          i = void 0;

      do {
        i = (o = 2 * this.random() - 1) * o + (a = 2 * this.random() - 1) * a;
      } while (i >= 1 || 0 === i);

      var s = Math.sqrt(-2 * Math.log(i) / i);
      e = this.mean + this.stdDev * o * s, n = this.mean + this.stdDev * a * s, this.truncated && !this.isValidTruncated(e) || (r = !0);
    }

    return this.truncated && !this.isValidTruncated(n) || (this.nextVal = this.convertValue(n)), this.convertValue(e);
  }, t.prototype.convertValue = function (t) {
    return null == this.dtype || "float32" === this.dtype ? t : Math.round(t);
  }, t.prototype.isValidTruncated = function (t) {
    return t <= this.upper && t >= this.lower;
  }, t;
}(),
    Ur = function () {
  function t(t, e, n, r) {
    void 0 === t && (t = 0), void 0 === e && (e = 1), void 0 === r && (r = Math.random());
    var o = this;
    if (this.canReturnFloat = function () {
      return null == o.dtype || "float32" === o.dtype;
    }, this.min = t, this.range = e - t, this.dtype = n, !this.canReturnFloat() && this.range <= 1) throw new Error("The difference between " + t + " - " + e + " <= 1 and dtype is not float");
    this.random = Lr(r.toString());
  }

  return t.prototype.convertValue = function (t) {
    return this.canReturnFloat() ? t : Math.round(t);
  }, t.prototype.nextValue = function () {
    return this.convertValue(this.min + this.range * this.random());
  }, t;
}();

function zr(t, e, n) {
  return void 0 === e && (e = "float32"), e = e || "float32", X(t), new st(t, e, n);
}

function Vr(t, e) {
  void 0 === e && (e = !1), console.log(t.toString(e));
}

var Gr = Tn({
  batchToSpaceND_: function (t, e, n) {
    var r = bn(t, "x", "batchToSpaceND"),
        o = e.reduce(function (t, e) {
      return t * e;
    });
    return d(r.rank >= 1 + e.length, function () {
      return "input rank is " + r.rank + " but should be > than blockShape.length " + e.length;
    }), d(n.length === e.length, function () {
      return "crops.length is " + n.length + " but should be equal to blockShape.length  " + e.length;
    }), d(r.shape[0] % o == 0, function () {
      return "input tensor batch is " + r.shape[0] + " but is not divisible by the product of the elements of blockShape " + e.join(" * ") + " === " + o;
    }), At.runKernel(function (t) {
      return t.batchToSpaceND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.spaceToBatchND(e, n);
        }
      };
    });
  }
}),
    qr = Tn({
  cast_: function (t, e) {
    var n = bn(t, "x", "cast");
    if (!_(e)) throw new Error("Failed to cast to unknown dtype " + e);
    if ("string" === e && "string" !== n.dtype || "string" !== e && "string" === n.dtype) throw new Error("Only strings can be casted to strings");
    return At.runKernel(function (t) {
      return t.cast(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.clone();
        }
      };
    });
  }
}),
    Hr = Tn({
  clone_: function (t) {
    var e = bn(t, "x", "clone", null);
    return At.runKernel(function (t) {
      return ht.make(e.shape, {
        dataId: e.dataId
      }, e.dtype);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return t.toFloat();
        }
      };
    });
  }
}),
    $r = Tn({
  cumsum_: function (t, e, n, r) {
    void 0 === e && (e = 0), void 0 === n && (n = !1), void 0 === r && (r = !1);
    var o = bn(t, "x", "cumsum"),
        a = rn([e |= 0], o.rank),
        i = o;
    null != a && (i = o.transpose(a));
    var s = an(1, o.rank)[0],
        u = At.runKernel(function (t) {
      return t.cumsum(i, s, n, r);
    }, {
      permutedX: i
    }, function (t) {
      return {
        permutedX: function () {
          return t.cumsum(e, n, !r);
        }
      };
    });
    return null != a && (u = u.transpose(a)), u;
  }
}),
    jr = Tn({
  depthToSpace_: function (t, e, n) {
    void 0 === n && (n = "NHWC");
    var r = bn(t, "x", "depthToSpace"),
        o = "NHWC" === n ? r.shape[1] : r.shape[2],
        a = "NHWC" === n ? r.shape[2] : r.shape[3],
        i = "NHWC" === n ? r.shape[3] : r.shape[1];
    return d(o * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + o + " and " + e + "  for depthToSpace with input shape\n      " + r.shape;
    }), d(a * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + a + " and " + e + " for depthToSpace with input shape\n          " + r.shape;
    }), d(i % (e * e) == 0, function () {
      return "Dimension size must be evenly divisible by " + e * e + " but is " + i + " for depthToSpace with input shape " + r.shape;
    }), At.runKernel(function (t) {
      return t.depthToSpace(r, e, n);
    }, {
      $x: r
    });
  }
}),
    Kr = Tn({
  expandDims_: function (t, e) {
    void 0 === e && (e = 0);
    var n = bn(t, "x", "expandDims");
    d(e <= n.rank, function () {
      return "Axis must be <= rank of the tensor";
    });
    var r = n.shape.slice();
    return e < 0 && (d(-(n.rank + 1) <= e, function () {
      return "Axis must be in the interval [" + -(n.rank + 1) + ", " + n.rank + "]";
    }), e = n.rank + e + 1), r.splice(e, 0, 1), io(n, r);
  }
}),
    Xr = Tn({
  eye_: function (t, e, n, r) {
    void 0 === r && (r = "float32"), null == e && (e = t);

    for (var o = zr([t, e], r), a = t <= e ? t : e, i = 0; i < a; ++i) o.set(1, i, i);

    var s = o.toTensor().as2D(t, e);
    if (null == n) return s;
    if (1 === n.length) return co(Kr(s, 0), [n[0], 1, 1]);
    if (2 === n.length) return co(Kr(Kr(s, 0), 0), [n[0], n[1], 1, 1]);
    if (3 === n.length) return co(Kr(Kr(Kr(s, 0), 0), 0), [n[0], n[1], n[2], 1, 1]);
    throw new Error("eye() currently supports only 1D and 2D batchShapes, but received " + n.length + "D.");
  }
}),
    Yr = Tn({
  multinomial_: function (t, e, n, r) {
    void 0 === r && (r = !1);
    var o = bn(t, "logits", "multinomial"),
        a = o.size,
        i = o.rank;
    if (a < 2) throw new Error("Error in multinomial: you need at least 2 outcomes, but got " + a + ".");
    if (i > 2) throw new Error("Rank of probabilities must be 1 or 2, but is " + i);
    n = n || Math.random();
    var s = 1 === i ? o.as2D(1, -1) : o,
        u = At.runKernel(function (t) {
      return t.multinomial(s, r, e, n);
    }, {
      logits2D: s
    });
    return 1 === i ? u.as1D() : u;
  }
}),
    Qr = Tn({
  oneHot_: function (t, e, n, r) {
    if (void 0 === n && (n = 1), void 0 === r && (r = 0), e < 2) throw new Error("Error in oneHot: depth must be >=2, but it is " + e);
    var o = bn(t, "indices", "oneHot", "int32"),
        a = o.shape.concat([e]);
    return o = o.flatten(), At.runKernel(function (t) {
      return t.oneHot(o, e, n, r);
    }, {
      $indices: o
    }, function (t) {
      return {
        $indices: function () {
          return Hn(o.shape, "float32");
        }
      };
    }).reshape(a);
  }
}),
    Jr = Tn({
  pad_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = bn(t, "x", "pad");
    if (0 === r.rank) throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");
    var o = e.map(function (t) {
      return t[0];
    });
    return At.runKernel(function (t) {
      return t.pad(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.slice(o, r.shape);
        }
      };
    });
  }
}),
    Zr = Tn({
  pad1d_: function (t, e, n) {
    return void 0 === n && (n = 0), d(2 === e.length, function () {
      return "Invalid number of paddings. Must be length of 2.";
    }), Jr(t, [e], n);
  }
}),
    to = Tn({
  pad2d_: function (t, e, n) {
    return void 0 === n && (n = 0), d(2 === e.length && 2 === e[0].length && 2 === e[1].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Jr(t, e, n);
  }
}),
    eo = Tn({
  pad3d_: function (t, e, n) {
    return void 0 === n && (n = 0), d(3 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Jr(t, e, n);
  }
}),
    no = Tn({
  pad4d_: function (t, e, n) {
    return void 0 === n && (n = 0), d(4 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length && 2 === e[3].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Jr(t, e, n);
  }
}),
    ro = Tn({
  rand_: function (t, e, n) {
    var r = y(t),
        o = null;
    if (null == n || "float32" === n) o = new Float32Array(r);else if ("int32" === n) o = new Int32Array(r);else {
      if ("bool" !== n) throw new Error("Unknown data type " + n);
      o = new Uint8Array(r);
    }

    for (var a = 0; a < r; a++) o[a] = e();

    return ht.make(t, {
      values: o
    }, n);
  }
}),
    oo = Tn({
  randomNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type " + r);

    for (var a = new Wr(e, n, r, !1, o), i = zr(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
}),
    ao = Tn({
  randomUniform_: function (t, e, n, r, o) {
    void 0 === e && (e = 0), void 0 === n && (n = 1), void 0 === r && (r = "float32");

    for (var a = zr(t, r), i = new Ur(e, n, null, o), s = 0; s < a.values.length; s++) a.values[s] = i.nextValue();

    return a.toTensor();
  }
}),
    io = Tn({
  reshape_: function (t, e) {
    var n = bn(t, "x", "reshape", null);
    return e = I(e, n.size), d(n.size === y(e), function () {
      return "new shape and old shape must have the same number of elements.";
    }), At.runKernel(function (t) {
      return t.reshape(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.reshape(n.shape);
        }
      };
    });
  }
}),
    so = Tn({
  spaceToBatchND_: function (t, e, n) {
    var r = bn(t, "x", "spaceToBatchND");
    return d(r.rank >= 1 + e.length, function () {
      return "input rank " + r.rank + " should be > than [blockShape] " + e.length;
    }), d(n.length === e.length, function () {
      return "paddings.shape[0] " + n.length + " must be equal to [blockShape] " + e.length;
    }), d(r.shape.reduce(function (t, r, o) {
      return o > 0 && o <= e.length ? t && (r + n[o - 1][0] + n[o - 1][1]) % e[o - 1] == 0 : t;
    }, !0), function () {
      return "input spatial dimensions " + r.shape.slice(1) + " with paddings " + n.toString() + " must be divisible by blockShapes " + e.toString();
    }), At.runKernel(function (t) {
      return t.spaceToBatchND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.batchToSpaceND(e, n);
        }
      };
    });
  }
}),
    uo = Tn({
  squeeze_: function (t, e) {
    var n = bn(t, "x", "squeeze");
    return io(n, N(n.shape, e).newShape);
  }
}),
    lo = Tn({
  stack_: function (t, e) {
    void 0 === e && (e = 0);
    var n = Cn(t, "tensors", "stack");
    if (d(n.length >= 1, function () {
      return "Pass at least one tensor to tf.stack";
    }), 1 === n.length) return n[0].expandDims(e);
    var r = n[0].rank,
        o = n[0].shape,
        a = n[0].dtype;
    d(e <= r, function () {
      return "Axis must be <= rank of the tensor";
    }), n.forEach(function (t) {
      v(o, t.shape, "All tensors passed to stack must have matching shapes");
    }), n.forEach(function (t) {
      d(a === t.dtype, function () {
        return "All tensors passed to stack must have matching dtypes";
      });
    });
    var i = n.map(function (t) {
      return t.expandDims(e);
    });
    return Rr(i, e);
  }
}),
    co = Tn({
  tile_: function (t, e) {
    var n = bn(t, "x", "tile");
    return d(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of reps " + e + ".";
    }), At.runKernel(function (t, r) {
      var o = t.tile(n, e);
      return r([n]), o;
    }, {
      $x: n
    }, function (t, n) {
      var r = n[0];
      return {
        $x: function () {
          var n = Yn(r);
          if (1 === r.rank) for (var o = 0; o < e[0]; ++o) n = n.add(t.slice([o * r.shape[0]], [r.shape[0]]));else if (2 === r.rank) for (o = 0; o < e[0]; ++o) for (var a = 0; a < e[1]; ++a) n = n.add(t.slice([o * r.shape[0], a * r.shape[1]], [r.shape[0], r.shape[1]]));else if (3 === r.rank) for (o = 0; o < e[0]; ++o) for (a = 0; a < e[1]; ++a) for (var i = 0; i < e[2]; ++i) n = n.add(t.slice([o * r.shape[0], a * r.shape[1], i * r.shape[2]], [r.shape[0], r.shape[1], r.shape[2]]));else {
            if (4 !== r.rank) throw new Error("Gradient for tile operation is not implemented for rank-" + r.rank + " tensors yet.");

            for (o = 0; o < e[0]; ++o) for (a = 0; a < e[1]; ++a) for (i = 0; i < e[2]; ++i) for (var s = 0; s < e[3]; ++s) n = n.add(t.slice([o * r.shape[0], a * r.shape[1], i * r.shape[2], s * r.shape[3]], [r.shape[0], r.shape[1], r.shape[2], r.shape[3]]));
          }
          return n;
        }
      };
    });
  }
}),
    ho = Tn({
  truncatedNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type " + r);

    for (var a = new Wr(e, n, r, !0, o), i = zr(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
}),
    po = Tn({
  unstack_: function (t, e) {
    void 0 === e && (e = 0), e = e || 0;
    var n = bn(t, "x", "unstack");
    return d(e >= -n.shape.length && e < n.shape.length, function () {
      return "Axis = " + e + " is not in [-" + n.shape.length + ", " + n.shape.length + ")";
    }), e < 0 && (e += n.shape.length), At.runKernel(function (t) {
      return t.unstack(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return lo(t, e);
        }
      };
    });
  }
}),
    fo = function (t, e) {
  return r(this, void 0, void 0, function () {
    var n, r, a, i, s, u, l, c, h, p;
    return o(this, function (o) {
      switch (o.label) {
        case 0:
          return n = bn(t, "x", "setdiff1d"), r = bn(e, "y", "setdiff1d"), d(n.dtype === r.dtype, function () {
            return "x and y should have the same dtype, but got x (" + n.dtype + ") and y (" + r.dtype + ").";
          }), d(1 === n.rank, function () {
            return "x should be 1D tensor, but got x (" + n.shape + ").";
          }), d(1 === r.rank, function () {
            return "y should be 1D tensor, but got y (" + r.shape + ").";
          }), [4, n.data()];

        case 1:
          return a = o.sent(), [4, r.data()];

        case 2:
          for (i = o.sent(), s = new Set(i), u = 0, h = 0; h < a.length; h++) s.has(a[h]) || u++;

          for (l = new st([u], n.dtype), c = new st([u], "int32"), h = 0, p = 0; h < a.length; h++) s.has(a[h]) || (l.values[p] = a[h], c.values[p] = h, p++);

          return [2, [l.toTensor(), c.toTensor()]];
      }
    });
  });
};

exports.setdiff1dAsync = fo;
exports.unstack = po;
exports.truncatedNormal = ho;
exports.tile = co;
exports.stack = lo;
exports.squeeze = uo;
exports.spaceToBatchND = so;
exports.reshape = io;
exports.randomUniform = ao;
exports.randomNormal = oo;
exports.rand = ro;
exports.pad4d = no;
exports.pad3d = eo;
exports.pad2d = to;
exports.pad1d = Zr;
exports.pad = Jr;
exports.oneHot = Qr;
exports.multinomial = Yr;
exports.eye = Xr;
exports.expandDims = Kr;
exports.depthToSpace = jr;
exports.cumsum = $r;
exports.clone = Hr;
exports.cast = qr;
exports.batchToSpaceND = Gr;

function vo(t, e) {
  for (var n = [], r = 0; r < e.length; r++) e[r] && n.push(r);

  var o = zr(t, "int32"),
      a = zr([n.length, t.length], "int32");

  for (r = 0; r < n.length; r++) {
    var i = o.indexToLoc(n[r]),
        s = r * t.length;
    a.values.set(i, s);
  }

  return a.toTensor();
}

var mo = function () {
  return function (t, e) {
    this.outputShape = [], this.outputShape = t, this.variableNames = e.map(function (t, e) {
      return "T" + e;
    });
    var n = [];
    this.variableNames.forEach(function (t) {
      n.push("float v" + t + " = get" + t + "AtOutCoords();");
    });
    var r = this.variableNames.map(function (t) {
      return "v" + t;
    }).join(" + ");
    this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        float result = " + r + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    go = function () {
  return function (t, e) {
    this.outputShape = [], this.usesPackedTextures = !0, this.outputShape = t, this.variableNames = e.map(function (t, e) {
      return "T" + e;
    });
    var n = [];
    this.variableNames.forEach(function (t) {
      n.push("vec4 v" + t + " = get" + t + "AtOutCoords();");
    });
    var r = this.variableNames.map(function (t) {
      return "v" + t;
    }).join(" + ");
    this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        vec4 result = " + r + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    yo = function () {
  return function (t, e, n) {
    this.variableNames = ["A"];
    var r = t.windowSize,
        o = t.batchSize,
        a = t.inSize,
        i = Math.ceil(a / r);
    n || this.variableNames.push("bestIndicesA"), this.outputShape = [o, i];
    var s = "max" === e ? ">" : "<",
        u = n ? "inOffset + i;" : "round(getBestIndicesA(batch, inOffset + i));";
    this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + r + ";\n\n        int bestIndex = inOffset;\n        float bestValue = getA(batch, bestIndex);\n\n        for (int i = 0; i < " + r + "; i++) {\n          int inIdx = " + u + ";\n          float candidate = getA(batch, inIdx);\n          if (candidate " + s + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
  };
}();

function xo(t, e) {
  return ["x", "y", "z", "w", "u", "v"].slice(0, e).map(function (e) {
    return t + "." + e;
  });
}

function wo(t, e) {
  return 1 === e ? [t] : xo(t, e);
}

function bo() {
  var t, e, n, r, o, i, s, u, l, c;
  return 2 === a.getNumber("WEBGL_VERSION") ? (t = "#version 300 es", e = "in", n = "out", r = "in", o = "texture", i = "outputColor", s = "out vec4 outputColor;", u = "\n      bool isnan_custom(float val) {\n        return (val > 0. || val < 0. || val == 0.) ? false : true;\n      }\n    ", l = "\n      const float INFINITY = uintBitsToFloat(uint(0x7f800000));\n    ", c = "\n      #define round(value) newRound(value)\n      int newRound(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 newRound(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    ") : (t = "", e = "attribute", n = "varying", r = "varying", o = "texture2D", i = "gl_FragColor", s = "", u = "\n      bool isnan_custom(float val) {\n        return (val > 0. || val < 1. || val == 0.) ? false : true;\n      }\n    ", l = "\n      uniform float INFINITY;\n\n      bool isinf(float val) {\n        return abs(val) == INFINITY;\n      }\n      bvec4 isinf(vec4 val) {\n        return equal(abs(val), vec4(INFINITY));\n      }\n    ", c = "\n      int round(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 round(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    "), {
    version: t,
    attribute: e,
    varyingVs: n,
    varyingFs: r,
    texture2D: o,
    output: i,
    defineOutput: s,
    defineSpecialNaN: u,
    defineSpecialInf: l,
    defineRound: c
  };
}

function Co(t, e, n) {
  void 0 === n && (n = "index");
  var r = G(e);
  return r.map(function (e, o) {
    return "int " + t[o] + " = " + n + " / " + e + "; " + (o === r.length - 1 ? "int " + t[o + 1] + " = " + n + " - " + t[o] + " * " + e : "index -= " + t[o] + " * " + e) + ";";
  }).join("");
}

function Eo(t) {
  return 1 === t.length ? "" + t[0] : "vec" + t.length + "(" + t.join(",") + ")";
}

function Ro(t) {
  return "\n  int getFlatIndex(ivec3 coords) {\n    return round(" + function (t, e) {
    if (t.length !== e.length) throw new Error("Vectors to be dotted must be of the same length -got " + t.length + " and " + e.length);

    for (var n = [], r = Math.floor(t.length / 4), o = t.length % 4, a = 0; a < r; a++) {
      var i = t.slice(4 * a, 4 * a + 4),
          s = e.slice(4 * a, 4 * a + 4);
      n.push(Eo(i) + ", " + Eo(s));
    }

    0 !== o && (i = t.slice(4 * r), s = e.slice(4 * r), 1 === i.length && (i = i.map(function (t) {
      return "float(" + t + ")";
    }), s = s.map(function (t) {
      return "float(" + t + ")";
    })), n.push(Eo(i) + ", " + Eo(s)));
    return n.map(function (t, e) {
      return "dot(" + t + ")";
    }).join("+");
  }(["coords.x", "coords.y", "coords.z"], G(t).map(function (t) {
    return t.toString();
  }).concat(["1."])) + ");\n  }\n";
}

function Io(t, e, n, r) {
  var o = [];
  t.forEach(function (t) {
    var e = y(t.shapeInfo.logicalShape);
    t.shapeInfo.isUniform ? o.push("uniform float " + t.name + (e > 1 ? "[" + e + "]" : "") + ";") : (o.push("uniform sampler2D " + t.name + ";"), o.push("uniform int offset" + t.name + ";"));
  });

  var a,
      i,
      s = o.join("\n"),
      u = t.map(function (t) {
    return function (t, e, n) {
      void 0 === n && (n = !1);
      var r = "";
      r += n ? No(t) : So(t);
      var o = t.shapeInfo.logicalShape,
          a = e.logicalShape;
      o.length <= a.length && (r += n ? function (t, e) {
        var n,
            r = t.name,
            o = r.charAt(0).toUpperCase() + r.slice(1),
            a = "get" + o + "AtOutCoords",
            i = t.shapeInfo.logicalShape.length,
            s = e.logicalShape.length,
            u = Zn(t.shapeInfo.logicalShape, e.logicalShape),
            l = Mo(s),
            c = s - i,
            h = ["x", "y", "z", "w", "u", "v"];
        n = 0 === i ? "" : s < 2 && u.length >= 1 ? "coords = 0;" : u.map(function (t) {
          return "coords." + h[t + c] + " = 0;";
        }).join("\n");
        var p = "";
        p = s < 2 && i > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + h[e + c];
        }).join(", ");
        var f = "return outputValue;",
            d = 1 === y(t.shapeInfo.logicalShape),
            v = 1 === y(e.logicalShape);

        if (1 !== i || d || v) {
          if (d && !v) f = 1 === s ? "\n        return vec4(outputValue.x, outputValue.x, 0., 0.);\n      " : "\n        return vec4(outputValue.x);\n      ";else if (u.length) {
            var m = i - 2,
                g = i - 1;
            u.indexOf(m) > -1 && u.indexOf(g) > -1 ? f = "return vec4(outputValue.x);" : u.indexOf(m) > -1 ? f = "return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);" : u.indexOf(g) > -1 && (f = "return vec4(outputValue.xx, outputValue.zz);");
          }
        } else f = "\n      return vec4(outputValue.xy, outputValue.xy);\n    ";

        return "\n    vec4 " + a + "() {\n      " + l + " coords = getOutputCoords();\n      " + n + "\n      vec4 outputValue = get" + o + "(" + p + ");\n      " + f + "\n    }\n  ";
      }(t, e) : function (t, e) {
        var n = t.name,
            r = n.charAt(0).toUpperCase() + n.slice(1),
            o = "get" + r + "AtOutCoords",
            a = e.texShape,
            i = t.shapeInfo.texShape,
            s = t.shapeInfo.logicalShape.length,
            u = e.logicalShape.length;
        if (!t.shapeInfo.isUniform && s === u && null == t.shapeInfo.flatOffset && x(i, a)) return "\n      float " + o + "() {\n        return sampleTexture(" + n + ", resultUV);\n      }\n    ";
        var l,
            c = Mo(u),
            h = Zn(t.shapeInfo.logicalShape, e.logicalShape),
            p = u - s,
            f = ["x", "y", "z", "w", "u", "v"];
        l = 0 === s ? "" : u < 2 && h.length >= 1 ? "coords = 0;" : h.map(function (t) {
          return "coords." + f[t + p] + " = 0;";
        }).join("\n");
        var d = "";
        d = u < 2 && s > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + f[e + p];
        }).join(", ");
        return "\n    float " + o + "() {\n      " + c + " coords = getOutputCoords();\n      " + l + "\n      return get" + r + "(" + d + ");\n    }\n  ";
      }(t, e));
      return r;
    }(t, e, r);
  }).join("\n"),
      l = e.texShape,
      c = bo(),
      h = function (t) {
    return "\n    float sampleTexture(sampler2D textureSampler, vec2 uv) {\n      return " + t.texture2D + "(textureSampler, uv).r;\n    }\n  ";
  }(c),
      p = function (t) {
    return t.version + "\n    precision highp float;\n    precision highp int;\n    precision highp sampler2D;\n    " + t.varyingFs + " vec2 resultUV;\n    " + t.defineOutput + "\n    const vec2 halfCR = vec2(0.5, 0.5);\n\n    struct ivec5\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n    };\n\n    struct ivec6\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n      int v;\n    };\n\n    uniform float NAN;\n    #define isnan(value) isnan_custom(value)\n    " + t.defineSpecialNaN + "\n    bvec4 isnan_custom(vec4 val) {\n      return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));\n    }\n\n    " + t.defineSpecialInf + "\n    " + t.defineRound + "\n\n    int imod(int x, int y) {\n      return x - y * (x / y);\n    }\n\n    int idiv(int a, int b, float sign) {\n      int res = a / b;\n      int mod = imod(a, b);\n      if (sign < 0. && mod != 0) {\n        res -= 1;\n      }\n      return res;\n    }\n\n    //Based on the work of Dave Hoskins\n    //https://www.shadertoy.com/view/4djSRW\n    #define HASHSCALE1 443.8975\n    float random(float seed){\n      vec2 p = resultUV * seed;\n      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n      p3 += dot(p3, p3.yzx + 19.19);\n      return fract((p3.x + p3.y) * p3.z);\n    }\n\n    " + ko + "\n    " + Ao + "\n    " + To + "\n  ";
  }(c);

  return e.isPacked ? (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (1 === n[0]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.x * " + n[1] + ".0);\n      }\n    ";
          if (1 === n[1]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.y * " + n[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      return resTexRC.x * " + n[1] + " + resTexRC.y;\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (x(t, e)) return "\n      ivec2 getOutputCoords() {\n        return 2 * ivec2(resultUV.yx * vec2(" + n[0] + ", " + n[1] + "));\n      }\n    ";
          var r = Math.ceil(t[1] / 2);
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = t, r = e, o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)], a = Math.ceil(n[2] / 2), i = a * Math.ceil(n[1] / 2), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + o[0] + ", " + o[1] + "));\n      int index = resTexRC.x * " + o[1] + " + resTexRC.y;\n\n      int b = index / " + i + ";\n      index -= b * " + i + ";\n\n      int r = 2 * (index / " + a + ");\n      int c = imod(index, " + a + ") * 2;\n\n      return ivec3(b, r, c);\n    }\n  ";

      default:
        return function (t, e) {
          for (var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)], r = Math.ceil(t[t.length - 1] / 2), o = r * Math.ceil(t[t.length - 2] / 2), a = o, i = "", s = "b, r, c", u = 2; u < t.length - 1; u++) a *= t[t.length - u - 1], i = "\n      int b" + u + " = index / " + a + ";\n      index -= b" + u + " * " + a + ";\n    " + i, s = "b" + u + ", " + s;

          return "\n    ivec" + t.length + " getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n\n      " + i + "\n\n      int b = index / " + o + ";\n      index -= b * " + o + ";\n\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec" + t.length + "(" + s + ");\n    }\n  ";
        }(t, e);
    }

    var n, r, o, a, i;
  }(e.logicalShape, l), i = function (t) {
    return "\n    void setOutput(vec4 val) {\n      " + t.output + " = val;\n    }\n  ";
  }(c)) : (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          if (1 === e[0]) return "\n      int getOutputCoords() {\n        return int(resultUV.x * " + e[1] + ".0);\n      }\n    ";
          if (1 === e[1]) return "\n      int getOutputCoords() {\n        return int(resultUV.y * " + e[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      return resTexRC.x * " + e[1] + " + resTexRC.y;\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          if (x(t, e)) return "\n      ivec2 getOutputCoords() {\n        return ivec2(resultUV.yx * vec2(" + e[0] + ", " + e[1] + "));\n      }\n    ";
          if (1 === t[1]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(index, 0);\n      }\n    ";
          if (1 === t[0]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(0, index);\n      }\n    ";
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      int r = index / " + t[1] + ";\n      int c = index - r * " + t[1] + ";\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = e, r = Co(["r", "c", "d"], t), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      " + r + "\n      return ivec3(r, c, d);\n    }\n  ";

      case 4:
        return function (t, e) {
          var n = Co(["r", "c", "d", "d2"], t);
          return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      " + n + "\n      return ivec4(r, c, d, d2);\n    }\n  ";
        }(t, e);

      case 5:
        return function (t, e) {
          var n = Co(["r", "c", "d", "d2", "d3"], t);
          return "\n    ivec5 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx * vec2(" + e[0] + ",\n                             " + e[1] + "));\n\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec5 outShape = ivec5(r, c, d, d2, d3);\n      return outShape;\n    }\n  ";
        }(t, e);

      case 6:
        return function (t, e) {
          var n = Co(["r", "c", "d", "d2", "d3", "d4"], t);
          return "\n    ivec6 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec6 result = ivec6(r, c, d, d2, d3, d4);\n      return result;\n    }\n  ";
        }(t, e);

      default:
        throw new Error(t.length + "-D output sampling is not yet supported");
    }

    var n, r;
  }(e.logicalShape, l), i = function (t) {
    return "\n    void setOutput(float val) {\n      " + t.output + " = vec4(val, 0, 0, 0);\n    }\n  ";
  }(c)), r && (p += Do), [p, h, i, s, a, u, n].join("\n");
}

function So(t) {
  var e = t.shapeInfo.logicalShape;

  switch (e.length) {
    case 0:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "float " + n + "() {return " + e + ";}";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === o && 1 === a) return "\n      float " + n + "() {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";

        var i = t.shapeInfo.texShape,
            s = i[0],
            u = i[1],
            l = _o(e);

        return "\n    float " + n + "() {\n      vec2 uv = uvFromFlat(" + s + ", " + u + ", " + l + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "\n      float " + n + "(int index) {\n        " + Oo(t) + "\n      }\n    ";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === a && 1 === o) return "\n      float " + n + "(int index) {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";

        var i = _o(e);

        if (1 === a) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2(0.5, (float(index + " + i + ") + 0.5) / " + o + ".0);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        if (1 === o) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2((float(index + " + i + ") + 0.5) / " + a + ".0, 0.5);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        return "\n    float " + n + "(int index) {\n      vec2 uv = uvFromFlat(" + o + ", " + a + ", index + " + i + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape;

        if (null != o && x(e, o)) {
          var a = o[0],
              i = o[1];
          return "\n    float " + r + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        }

        var s = N(e),
            u = s.newShape,
            l = s.keptDims,
            c = u;

        if (c.length < e.length) {
          var h = Fo(t, c);
          return "\n      " + So(h) + "\n      float " + r + "(int row, int col) {\n        return " + r + "(" + Bo(["row", "col"], l) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col) {\n        int index = round(dot(vec2(row, col), vec2(" + e[1] + ", 1)));\n        " + Oo(t) + "\n      }\n    ";

        var p = o[0],
            f = o[1],
            d = _o(n);

        if (1 === f) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + d + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2(0.5, (index + 0.5) / " + p + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        if (1 === p) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + d + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2((index + 0.5) / " + f + ".0, 0.5);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        return "\n  float " + r + "(int row, int col) {\n    // Explicitly use integer operations as dot() only works on floats.\n    int index = row * " + e[1] + " + col + " + d + ";\n    vec2 uv = uvFromFlat(" + p + ", " + f + ", index);\n    return sampleTexture(" + n + ", uv);\n  }\n";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[1] * e[2],
            a = e[2],
            i = N(e),
            s = i.newShape,
            u = i.keptDims,
            l = s;

        if (l.length < e.length) {
          var c = Fo(t, l);
          return "\n        " + So(c) + "\n        float " + r + "(int row, int col, int depth) {\n          return " + r + "(" + Bo(["row", "col", "depth"], u) + ");\n        }\n      ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth) {\n        int index = round(dot(vec3(row, col, depth),\n                          vec3(" + o + ", " + a + ", 1)));\n        " + Oo(t) + "\n      }\n    ";
        var h = t.shapeInfo.texShape,
            p = h[0],
            f = h[1],
            d = t.shapeInfo.flatOffset;
        if (f === o && null == d) return "\n        float " + r + "(int row, int col, int depth) {\n          float texR = float(row);\n          float texC = dot(vec2(col, depth), vec2(" + a + ", 1));\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + f + ".0, " + p + ".0);\n          return sampleTexture(" + n + ", uv);\n        }\n      ";
        if (f === a && null == d) return "\n    float " + r + "(int row, int col, int depth) {\n      float texR = dot(vec2(row, col), vec2(" + e[1] + ", 1));\n      float texC = float(depth);\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + f + ".0, " + p + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";

        var v = _o(n);

        return "\n      float " + r + "(int row, int col, int depth) {\n        // Explicitly use integer operations as dot() only works on floats.\n        int index = row * " + o + " + col * " + a + " + depth + " + v + ";\n        vec2 uv = uvFromFlat(" + p + ", " + f + ", index);\n        return sampleTexture(" + n + ", uv);\n      }\n  ";
      }(t);

    case 4:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[3],
            a = e[2] * o,
            i = e[1] * a,
            s = N(e),
            u = s.newShape,
            l = s.keptDims;

        if (u.length < e.length) {
          var c = Fo(t, u);
          return "\n      " + So(c) + "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        return " + r + "(" + Bo(["row", "col", "depth", "depth2"], l) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        int index = round(dot(vec4(row, col, depth, depth2),\n                          vec4(" + i + ", " + a + ", " + o + ", 1)));\n        " + Oo(t) + "\n      }\n    ";
        var h = t.shapeInfo.flatOffset,
            p = t.shapeInfo.texShape,
            f = p[0],
            d = p[1];
        if (d === i && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = float(row);\n        float texC =\n            dot(vec3(col, depth, depth2),\n                vec3(" + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + d + ".0, " + f + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (d === o && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = dot(vec3(row, col, depth),\n                         vec3(" + e[1] * e[2] + ", " + e[2] + ", 1));\n        float texC = float(depth2);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + d + ".0, " + f + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";

        var v = _o(n);

        return "\n    float " + r + "(int row, int col, int depth, int depth2) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + i + " + col * " + a + " +\n          depth * " + o + " + depth2;\n      vec2 uv = uvFromFlat(" + f + ", " + d + ", index + " + v + ");\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 5:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[4],
            a = e[3] * o,
            i = e[2] * a,
            s = e[1] * i,
            u = N(e),
            l = u.newShape,
            c = u.keptDims;

        if (l.length < e.length) {
          var h = Fo(t, l);
          return "\n      " + So(h) + "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        return " + r + "(" + Bo(["row", "col", "depth", "depth2", "depth3"], c) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float index = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + s + ", " + i + ", " + a + ", " + o + ")) +\n          depth3;\n        " + Oo(t) + "\n      }\n    ";
        var p = t.shapeInfo.flatOffset,
            f = t.shapeInfo.texShape,
            d = f[0],
            v = f[1];
        if (v === s && null == p) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n                         vec4(" + i + ", " + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + v + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (v === o && null == p) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float texR = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] + ",\n               " + e[2] * e[3] + ", " + e[3] + ", 1));\n        int texC = depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + v + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";

        var m = _o(n);

        return "\n    float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + s + " + col * " + i + " + depth * " + a + " +\n          depth2 * " + o + " + depth3 + " + m + ";\n      vec2 uv = uvFromFlat(" + d + ", " + v + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 6:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = N(e),
            a = o.newShape,
            i = o.keptDims;

        if (a.length < e.length) {
          var s = Fo(t, a);
          return "\n      " + So(s) + "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        return " + r + "(" + Bo(["row", "col", "depth", "depth2", "depth3", "depth4"], i) + ");\n      }\n    ";
        }

        var u = e[5],
            l = e[4] * u,
            c = e[3] * l,
            h = e[2] * c,
            p = e[1] * h;
        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n        int index = round(dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + p + ", " + h + ", " + c + ", " + l + ")) +\n          dot(\n            vec2(depth3, depth4),\n            vec2(" + u + ", 1)));\n        " + Oo(t) + "\n      }\n    ";
        var f = t.shapeInfo.flatOffset,
            d = t.shapeInfo.texShape,
            v = d[0],
            m = d[1];
        if (m === p && null == f) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n          vec4(" + h + ", " + c + ", " + l + ", " + u + ")) +\n               float(depth4);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + m + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (m === u && null == f) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        float texR = dot(vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] * e[4] + ",\n               " + e[2] * e[3] * e[4] + ",\n               " + e[3] * e[4] + ",\n               " + e[4] + ")) + float(depth3);\n        int texC = depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + m + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";

        var g = _o(n);

        return "\n    float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + p + " + col * " + h + " + depth * " + c + " +\n          depth2 * " + l + " + depth3 * " + u + " + depth4 + " + g + ";\n      vec2 uv = uvFromFlat(" + v + ", " + m + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      throw new Error(e.length + "-D input sampling is not yet supported");
  }
}

function No(t) {
  var e, n, r;

  switch (t.shapeInfo.logicalShape.length) {
    case 0:
      return e = t.name, n = "get" + e.charAt(0).toUpperCase() + e.slice(1), r = bo(), "\n    vec4 " + n + "() {\n      return " + r.texture2D + "(" + e + ", halfCR);\n    }\n  ";

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1),
            r = t.shapeInfo.texShape,
            o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)],
            a = bo();
        return "\n    vec4 " + n + "(int index) {\n      vec2 uv = packedUVfrom1D(\n        " + o[0] + ", " + o[1] + ", index);\n      return " + a.texture2D + "(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = o[0],
            i = o[1],
            s = bo();
        if (null != o && x(e, o)) return "\n      vec4 " + r + "(int row, int col) {\n        vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n\n        return " + s.texture2D + "(" + n + ", uv);\n      }\n    ";
        var u = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)],
            l = Math.ceil(e[1] / 2);
        return "\n    vec4 " + r + "(int row, int col) {\n      vec2 uv = packedUVfrom2D(" + l + ", " + u[0] + ", " + u[1] + ", row, col);\n      return " + s.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)];

        if (1 === e[0]) {
          var i = e.slice(1),
              s = Fo(t, i);
          return "\n        " + No(s) + "\n        vec4 " + r + "(int b, int row, int col) {\n          return " + r + "(" + Bo(["b", "row", "col"], [1, 2]) + ");\n        }\n      ";
        }

        var u = a[0],
            l = a[1],
            c = Math.ceil(e[2] / 2),
            h = c * Math.ceil(e[1] / 2),
            p = bo();
        return "\n    vec4 " + r + "(int b, int row, int col) {\n      vec2 uv = packedUVfrom3D(\n        " + u + ", " + l + ", " + h + ", " + c + ", b, row, col);\n      return " + p.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      return function (t) {
        for (var e = t.shapeInfo.logicalShape, n = e.length, r = t.name, o = "get" + r.charAt(0).toUpperCase() + r.slice(1), a = t.shapeInfo.texShape, i = [Math.ceil(a[0] / 2), Math.ceil(a[1] / 2)], s = i[0], u = i[1], l = Math.ceil(e[n - 1] / 2), c = l * Math.ceil(e[n - 2] / 2), h = "int b, int row, int col", p = "b * " + c + " + (row / 2) * " + l + " + (col / 2)", f = 2; f < n - 1; f++) h = "int b" + f + ", " + h, c *= e[n - f - 1], p = "b" + f + " * " + c + " + " + p;

        var d = bo();
        return "\n    vec4 " + o + "(" + h + ") {\n      int index = " + p + ";\n      int texR = index / " + u + ";\n      int texC = index - texR * " + u + ";\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + u + ", " + s + ");\n      return " + d.texture2D + "(" + r + ", uv);\n    }\n  ";
      }(t);
  }
}

var ko = "\nvec2 uvFromFlat(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom1D(int texNumR, int texNumC, int index) {\n  int texelIndex = index / 2;\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    Ao = "\nvec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,\n  int texNumC, int row, int col) {\n  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    To = "\nvec2 packedUVfrom3D(int texNumR, int texNumC,\n    int texelsInBatch, int texelsInLogicalRow, int b,\n    int row, int col) {\n  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    Do = "\n  float getChannel(vec4 frag, vec2 innerDims) {\n    vec2 modCoord = mod(innerDims, 2.);\n    return modCoord.x == 0. ?\n      (modCoord.y == 0. ? frag.r : frag.g) :\n      (modCoord.y == 0. ? frag.b : frag.a);\n  }\n  float getChannel(vec4 frag, int dim) {\n    float modCoord = mod(float(dim), 2.);\n    return modCoord == 0. ? frag.r : frag.g;\n  }\n";

function _o(t) {
  return "offset" + t;
}

function Oo(t) {
  var e = t.name,
      n = y(t.shapeInfo.logicalShape);
  return n < 2 ? "return " + e + ";" : "\n    for (int i = 0; i < " + n + "; i++) {\n      if (i == index) {\n        return " + e + "[i];\n      }\n    }\n  ";
}

function Mo(t) {
  if (t <= 1) return "int";
  if (2 === t) return "ivec2";
  if (3 === t) return "ivec3";
  if (4 === t) return "ivec4";
  if (5 === t) return "ivec5";
  if (6 === t) return "ivec6";
  throw Error("GPU for rank " + t + " is not yet supported");
}

function Fo(t, e) {
  var n = JSON.parse(JSON.stringify(t));
  return n.shapeInfo.logicalShape = e, n;
}

function Bo(t, e) {
  return e.map(function (e) {
    return t[e];
  }).join(", ");
}

var Po = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, d(t.length > 2, function () {
      return "Packed arg" + (n.charAt(0).toUpperCase() + n.slice(1)) + " supports only inputs with rank above 2.";
    });
    var o = t[t.length - 1],
        a = Math.ceil(o / e);
    this.outputShape = t.slice(0, -1), a > 1 && this.outputShape.push(a), r || this.variableNames.push("bestIndicesA");
    var i,
        s,
        u = this.outputShape,
        l = u.length,
        c = Mo(l),
        h = wo("coords", l);

    if (1 === a) {
      var p = Mo(s = l + 1);
      i = "\n        " + p + " sourceLocR = " + p + "(" + h.join() + ", 0);\n        ++" + h[l - 1] + ";\n        " + p + " sourceLocG = " + p + "(" + h.join() + ", 0);\n        ++" + h[l - 2] + ";\n        " + p + " sourceLocA = " + p + "(" + h.join() + ", 0);\n        --" + h[l - 1] + ";\n        " + p + " sourceLocB = " + p + "(" + h.join() + ", 0);\n        --" + h[l - 2] + ";";
    } else s = l, i = "\n        " + c + " sourceLocR = coords;\n        ++" + h[l - 1] + ";\n        " + c + " sourceLocG = coords;\n        ++" + h[l - 2] + ";\n        " + c + " sourceLocA = coords;\n        --" + h[l - 1] + ";\n        " + c + " sourceLocB = coords;\n        --" + h[l - 2] + ";";

    var f = ["x", "y", "z", "w", "u", "v"].slice(0, s),
        v = "." + f[s - 1],
        m = f.map(function (t) {
      return "int " + t;
    }),
        g = wo("sourceLocR", s - 1).concat("inIdx.r"),
        y = wo("sourceLocG", s - 1).concat("inIdx.g"),
        x = wo("sourceLocB", s - 1).concat("inIdx.b"),
        w = wo("sourceLocA", s - 1).concat("inIdx.a"),
        b = "max" === n ? "greaterThan" : "lessThan",
        C = r ? "" : "\n          inIdx = round(vec4(getBestIndicesAChannel(" + g.join() + "),\n                             getBestIndicesAChannel(" + y.join() + "),\n                             getBestIndicesAChannel(" + x.join() + "),\n                             getBestIndicesAChannel(" + w.join() + ")));",
        E = "vec4(\n            getAChannel(" + g.join() + "),\n            hasNextCol ? getAChannel(" + y.join() + ") : 0.,\n            hasNextRow ? getAChannel(" + x.join() + ") : 0.,\n            hasNextRow && hasNextCol ? getAChannel(" + w.join() + ") : 0.)",
        R = r ? "" : "\n      float getBestIndicesAChannel(" + m.join() + ") {\n        return getChannel(getBestIndicesA(" + f.join() + "),\n                                          vec2(" + f.slice(-2).join() + "));\n      }";
    this.userCode = "\n      float getAChannel(" + m.join() + ") {\n        return getChannel(getA(" + f.join() + "),\n                               vec2(" + f.slice(-2).join() + "));\n      }\n      " + R + "\n      void main() {\n        " + c + " coords = getOutputCoords();\n        bool hasNextCol = " + h[l - 1] + " < " + (u[l - 1] - 1) + ";\n        bool hasNextRow = " + h[l - 2] + " < " + (u[l - 2] - 1) + ";\n        " + i + "\n        ivec4 srcIdx = ivec4(sourceLocR" + v + ", sourceLocG" + v + ",\n          sourceLocB" + v + ", sourceLocA" + v + ") * " + e + ";\n        ivec4 inIdx = srcIdx;\n        vec4 bestIndex = vec4(inIdx);\n        vec4 bestValue = " + E + ";\n\n        for (int i = 0; i < " + e + "; i++) {\n          inIdx = srcIdx;\n          " + C + "\n          vec4 candidate = " + E + ";\n          bvec4 nan = isnan(candidate);\n          bvec4 replace = bvec4(\n            vec4(" + b + "(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));\n\n          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,\n                           replace.y  ? candidate.y : bestValue.y,\n                           replace.z  ? candidate.z : bestValue.z,\n                           replace.w  ? candidate.w : bestValue.w);\n          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));\n          srcIdx++;\n        }\n        setOutput(bestIndex);\n      }\n    ";
  };
}(),
    Lo = function () {
  return function (t) {
    this.variableNames = ["dy"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = t.dilationHeight,
        i = t.dilationWidth,
        s = t.effectiveFilterHeight,
        u = t.effectiveFilterWidth,
        l = s - 1 - t.padInfo.top,
        c = u - 1 - t.padInfo.left,
        h = 1 / (e * n);
    this.userCode = "\n      const ivec2 pads = ivec2(" + l + ", " + c + ");\n      const float avgMultiplier = float(" + h + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + s + ";\n            wR += " + a + ") {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + u + ";\n            wC+= " + i + ") {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Wo = function () {
  return function (t, e, n, r, o, a) {
    this.outputShape = [], this.variableNames = ["x", "mean", "variance"], er(t, e), er(t, n);
    var i = "0.0";
    null != r && (er(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
    var s = "1.0";
    null != o && (er(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + i + ";\n        float scale = " + s + ";\n        float inv = scale * inversesqrt(variance + float(" + a + "));\n        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));\n      }\n    ";
  };
}(),
    Uo = function () {
  return function (t, e, n, r, o, a) {
    this.usesPackedTextures = !0, this.variableNames = ["x", "mean", "variance"], er(t, e), er(t, n);
    var i = "vec4(0.0)";
    null != r && (er(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
    var s = "vec4(1.0)";
    null != o && (er(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        vec4 offset = " + i + ";\n        vec4 scale = " + s + ";\n\n        vec4 x = getXAtOutCoords();\n        vec4 mean = getMeanAtOutCoords();\n        vec4 variance = getVarianceAtOutCoords();\n\n        vec4 inv = scale * inversesqrt(variance + vec4(" + a + "));\n\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
  };
}(),
    zo = "return areal * breal - aimag * bimag;",
    Vo = "return areal * bimag + aimag * breal;",
    Go = function () {
  return function (t, e, n) {
    this.variableNames = ["AReal", "AImag", "BReal", "BImag"], this.outputShape = er(e, n), this.userCode = "\n      float binaryOpComplex(\n          float areal, float aimag, float breal, float bimag) {\n        " + t + "\n      }\n\n      void main() {\n        float areal = getARealAtOutCoords();\n        float aimag = getAImagAtOutCoords();\n        float breal = getBRealAtOutCoords();\n        float bimag = getBImagAtOutCoords();\n        setOutput(binaryOpComplex(areal, aimag, breal, bimag));\n      }\n    ";
  };
}(),
    qo = "return a + b;",
    Ho = "return a - b;",
    $o = "return a * b;",
    jo = function () {
  return function (t, e, n) {
    this.variableNames = ["A", "B"], this.outputShape = er(e, n), this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + t + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
  };
}(),
    Ko = function () {
  return function (t, e, n, r) {
    void 0 === r && (r = !1), this.variableNames = ["A", "B"], this.supportsBroadcasting = !0, this.usesPackedTextures = !0, this.outputShape = er(e, n);
    var o = this.outputShape.length,
        a = "";
    if (r) if (0 === o || 1 === y(this.outputShape)) a = "\n          result.y = 0.;\n          result.z = 0.;\n          result.w = 0.;\n        ";else if (a = "\n          " + Mo(o) + " coords = getOutputCoords();\n        ", 1 === o) a += "\n            result.y = (coords + 1) >= " + this.outputShape[0] + " ? 0. : result.y;\n            result.z = 0.;\n            result.w = 0.;\n          ";else {
      var i = wo("coords", o);
      a += "\n            bool nextRowOutOfBounds =\n              (" + i[o - 2] + " + 1) >= " + this.outputShape[o - 2] + ";\n            bool nextColOutOfBounds =\n              (" + i[o - 1] + " + 1) >= " + this.outputShape[o - 1] + ";\n            result.y = nextColOutOfBounds ? 0. : result.y;\n            result.z = nextRowOutOfBounds ? 0. : result.z;\n            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;\n          ";
    }
    this.userCode = "\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + t + "\n      }\n\n      void main() {\n        vec4 a = getAAtOutCoords();\n        vec4 b = getBAtOutCoords();\n\n        vec4 result = binaryOperation(a, b);\n        " + a + "\n\n        setOutput(result);\n      }\n    ";
  };
}(),
    Xo = function () {
  function t(t) {
    this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      uniform float min;\n      uniform float max;\n\n      void main() {\n        float value = getAAtOutCoords();\n        if (isnan(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, min, max));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "min"), n.maxLoc = r.getUniformLocationNoThrow(o, "max")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    Yo = function () {
  function t(t) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t, this.userCode = "\n      uniform float min;\n      uniform float max;\n\n      void main() {\n        vec4 value = getAAtOutCoords();\n\n        if (any(isnan(value))) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, vec4(min), vec4(max)));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "min"), n.maxLoc = r.getUniformLocationNoThrow(o, "max")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    Qo = function () {
  return function (t) {
    this.variableNames = ["real", "imag"], this.outputShape = t, this.userCode = "\n      void main() {\n        float re = abs(getRealAtOutCoords());\n        float im = abs(getImagAtOutCoords());\n        float mx = max(re, im);\n\n        // sadly the length function in glsl is not underflow-safe\n        // (at least not on Intel GPUs). So the safe solution is\n        // to ensure underflow-safety in all cases.\n        setOutput(\n          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))\n        );\n      }\n    ";
  };
}(),
    Jo = function () {
  return function (t) {
    this.outputShape = [], this.outputShape = un(t, 1), this.variableNames = t.map(function (t, e) {
      return "T" + e;
    });
    var e = new Array(t.length - 1);
    e[0] = t[0][1];

    for (var n = 1; n < e.length; n++) e[n] = e[n - 1] + t[n][1];

    var r = ["if (yC < " + e[0] + ") setOutput(getT0(yR, yC));"];

    for (n = 1; n < e.length; n++) {
      var o = e[n - 1];
      r.push("else if (yC < " + e[n] + ") setOutput(getT" + n + "(yR, yC-" + o + "));");
    }

    var a = e.length,
        i = e[e.length - 1];
    r.push("else setOutput(getT" + a + "(yR, yC-" + i + "));"), this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        " + r.join("\n        ") + "\n      }\n    ";
  };
}(),
    Zo = function () {
  return function (t, e) {
    this.usesPackedTextures = !0, this.outputShape = [], this.outputShape = un(t, e);
    var n = this.outputShape,
        r = n.length,
        o = Mo(r),
        a = wo("coords", r),
        i = ["x", "y", "z", "w", "u", "v"].slice(0, r);
    this.variableNames = t.map(function (t, e) {
      return "T" + e;
    });
    var s = new Array(t.length - 1);
    s[0] = t[0][e];

    for (var u = 1; u < s.length; u++) s[u] = s[u - 1] + t[u][e];

    var l = i[e],
        c = "vec2(" + i.slice(-2).join() + ")",
        h = i.join(),
        p = "if (" + l + " < " + s[0] + ")\n          return getChannel(getT0(" + h + "), " + c + ");";

    for (u = 1; u < s.length; u++) {
      var f = s[u - 1];
      p += "\n        else if (" + l + " < " + s[u] + ") {\n          " + l + " -= " + f + ";\n          return getChannel(getT" + u + "(" + h + "), " + c + ");\n        }";
    }

    var d = s.length;
    p += "\n        else {\n          " + l + " -= " + s[s.length - 1] + ";\n          return getChannel(getT" + d + "(" + h + "), " + c + ");\n        }", this.userCode = "\n      float getValue(" + i.map(function (t) {
      return "int " + t;
    }) + ") {\n        " + p + "\n      }\n\n      void main() {\n        " + o + " coords = getOutputCoords();\n        vec4 result = vec4(getValue(" + a + "), 0., 0., 0.);\n        if (++" + a[r - 1] + " < " + n[r - 1] + ") {\n          result.g = getValue(" + a + ");\n        }\n        if (++" + a[r - 2] + " < " + n[r - 2] + ") {\n          result.a = getValue(" + a + ");\n        }\n        if (" + a[r - 2] + " < " + n[r - 2] + " &&\n            --" + a[r - 1] + " < " + n[r - 1] + ") {\n          result.b = getValue(" + a + ");\n        }\n        setOutput(result);\n      }\n    ";
  };
}(),
    ta = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.padInfo.top,
        o = t.padInfo.left;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int d2 = coords.w;\n\n        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ea = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = e - 1 - t.padInfo.top,
        i = n - 1 - t.padInfo.left;
    this.userCode = "\n      const ivec2 pads = ivec2(" + a + ", " + i + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, d2);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    na = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideDepth,
        n = t.strideHeight,
        r = t.strideWidth,
        o = t.padInfo.front,
        a = t.padInfo.top,
        i = t.padInfo.left;
    this.userCode = "\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int wF = coords.x;\n        int wR = coords.y;\n        int wC = coords.z;\n        int d1 = coords.w;\n        int d2 = coords.u;\n\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yF = 0; yF < " + t.outDepth + "; yF++) {\n            int xF = wF + yF * " + e + " - " + o + ";\n\n            if (xF < 0 || xF >= " + t.inDepth + ") {\n              continue;\n            }\n\n            for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n              int xR = wR + yR * " + n + " - " + a + ";\n\n              if (xR < 0 || xR >= " + t.inHeight + ") {\n                continue;\n              }\n\n              for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n                int xC = wC + yC * " + r + " - " + i + ";\n\n                if (xC < 0 || xC >= " + t.inWidth + ") {\n                  continue;\n                }\n\n                float dyValue = getDy(b, yF, yR, yC, d2);\n                float xValue = getX(b, xF, xR, xC, d1);\n                dotProd += (xValue * dyValue);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ra = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterDepth,
        n = t.filterHeight,
        r = t.filterWidth,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = e - 1 - t.padInfo.front,
        u = n - 1 - t.padInfo.top,
        l = r - 1 - t.padInfo.left;
    this.userCode = "\n      const ivec3 pads = ivec3(" + s + ", " + u + ", " + l + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d1 = coords.u;\n\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyFCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + e + "; wF++) {\n          float dyF = float(dyFCorner + wF) / " + o + ".0;\n\n          if (dyF < 0.0 || dyF >= " + t.outDepth + ".0 || fract(dyF) > 0.0) {\n            continue;\n          }\n          int idyF = int(dyF);\n\n          int wFPerm = " + e + " - 1 - wF;\n\n          for (int wR = 0; wR < " + n + "; wR++) {\n            float dyR = float(dyRCorner + wR) / " + a + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n              fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            int wRPerm = " + n + " - 1 - wR;\n\n            for (int wC = 0; wC < " + r + "; wC++) {\n              float dyC = float(dyCCorner + wC) / " + i + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              int wCPerm = " + r + " - 1 - wC;\n\n              for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n                float xValue = getDy(batch, idyF, idyR, idyC, d2);\n                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    oa = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.padInfo.top,
        o = t.padInfo.left,
        a = t.outChannels / t.inChannels;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int dm = coords.w;\n        int d2 = d1 * " + a + " + dm;\n\n        float dotProd = 0.0;\n\n        // TODO: Vec4 over the batch size\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    aa = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = e - 1 - t.padInfo.top,
        i = n - 1 - t.padInfo.left,
        s = t.outChannels / t.inChannels;
    this.userCode = "\n      const ivec2 pads = ivec2(" + a + ", " + i + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        float dotProd = 0.0;\n\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            // TODO: Vec4 over the channelMul\n            for (int dm = 0; dm < " + s + "; dm++) {\n              int d2 = d1 * " + s + " + dm;\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, dm);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ia = function () {
  return function (t) {
    this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var e = t.padInfo.top,
        n = t.padInfo.left,
        r = t.strideHeight,
        o = t.strideWidth,
        a = t.dilationHeight,
        i = t.dilationWidth,
        s = t.filterHeight,
        u = t.filterWidth,
        l = 4 * Math.floor(t.inChannels / 4),
        c = t.inChannels % 4;
    this.userCode = "\n      const ivec2 strides = ivec2(" + r + ", " + o + ");\n      const ivec2 pads = ivec2(" + e + ", " + n + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d2 = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + s + "; wR++) {\n          int xR = xRCorner + wR * " + a + ";\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + u + "; wC++) {\n            int xC = xCCorner + wC * " + i + ";\n\n            if (xC < 0 || xC >= " + t.inWidth + ") {\n              continue;\n            }\n\n            for (int d1 = 0; d1 < " + l + "; d1 += 4) {\n              vec4 xValues = vec4(\n                getX(batch, xR, xC, d1),\n                getX(batch, xR, xC, d1 + 1),\n                getX(batch, xR, xC, d1 + 2),\n                getX(batch, xR, xC, d1 + 3)\n              );\n              vec4 wValues = vec4(\n                getW(wR, wC, d1, d2),\n                getW(wR, wC, d1 + 1, d2),\n                getW(wR, wC, d1 + 2, d2),\n                getW(wR, wC, d1 + 3, d2)\n              );\n\n              dotProd += dot(xValues, wValues);\n            }\n\n            if (" + (1 === c) + ") {\n              dotProd +=\n                getX(batch, xR, xC, " + l + ") *\n                getW(wR, wC, " + l + ", d2);\n            } else if (" + (2 === c) + ") {\n              vec2 xValues = vec2(\n                getX(batch, xR, xC, " + l + "),\n                getX(batch, xR, xC, " + l + " + 1)\n              );\n              vec2 wValues = vec2(\n                getW(wR, wC, " + l + ", d2),\n                getW(wR, wC, " + l + " + 1, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            } else if (" + (3 === c) + ") {\n              vec3 xValues = vec3(\n                getX(batch, xR, xC, " + l + "),\n                getX(batch, xR, xC, " + l + " + 1),\n                getX(batch, xR, xC, " + l + " + 2)\n              );\n              vec3 wValues = vec3(\n                getW(wR, wC, " + l + ", d2),\n                getW(wR, wC, " + l + " + 1, d2),\n                getW(wR, wC, " + l + " + 2, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    sa = function () {
  return function (t) {
    this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var e = t.padInfo.front,
        n = t.padInfo.top,
        r = t.padInfo.left,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = t.dilationDepth,
        u = t.dilationHeight,
        l = t.dilationWidth,
        c = t.filterDepth,
        h = t.filterHeight,
        p = t.filterWidth,
        f = 4 * Math.floor(t.inChannels / 4),
        d = t.inChannels % 4;
    this.userCode = "\n      const ivec3 strides = ivec3(" + o + ", " + a + ", " + i + ");\n      const ivec3 pads = ivec3(" + e + ", " + n + ", " + r + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d2 = coords.u;\n\n        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n        int xFCorner = xFRCCorner.x;\n        int xRCorner = xFRCCorner.y;\n        int xCCorner = xFRCCorner.z;\n\n        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get\n        // y(yF, yR, yC, d2). ? = to be determined. : = across all\n        // values in that axis.\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + c + "; wF++) {\n          int xF = xFCorner + wF * " + s + ";\n\n          if (xF < 0 || xF >= " + t.inDepth + ") {\n            continue;\n          }\n\n          for (int wR = 0; wR < " + h + "; wR++) {\n            int xR = xRCorner + wR * " + u + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + p + "; wC++) {\n              int xC = xCCorner + wC * " + l + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              for (int d1 = 0; d1 < " + f + "; d1 += 4) {\n                vec4 xValues = vec4(\n                  getX(batch, xF, xR, xC, d1),\n                  getX(batch, xF, xR, xC, d1 + 1),\n                  getX(batch, xF, xR, xC, d1 + 2),\n                  getX(batch, xF, xR, xC, d1 + 3)\n                );\n                vec4 wValues = vec4(\n                  getW(wF, wR, wC, d1, d2),\n                  getW(wF, wR, wC, d1 + 1, d2),\n                  getW(wF, wR, wC, d1 + 2, d2),\n                  getW(wF, wR, wC, d1 + 3, d2)\n                );\n\n                dotProd += dot(xValues, wValues);\n              }\n\n              if (" + (1 === d) + ") {\n                dotProd +=\n                  getX(batch, xF, xR, xC, " + f + ") *\n                  getW(wF, wR, wC, " + f + ", d2);\n              } else if (" + (2 === d) + ") {\n                vec2 xValues = vec2(\n                  getX(batch, xF, xR, xC, " + f + "),\n                  getX(batch, xF, xR, xC, " + f + " + 1)\n                );\n                vec2 wValues = vec2(\n                  getW(wF, wR, wC, " + f + ", d2),\n                  getW(wF, wR, wC, " + f + " + 1, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              } else if (" + (3 === d) + ") {\n                vec3 xValues = vec3(\n                  getX(batch, xF, xR, xC, " + f + "),\n                  getX(batch, xF, xR, xC, " + f + " + 1),\n                  getX(batch, xF, xR, xC, " + f + " + 2)\n                );\n                vec3 wValues = vec3(\n                  getW(wF, wR, wC, " + f + ", d2),\n                  getW(wF, wR, wC, " + f + " + 1, d2),\n                  getW(wF, wR, wC, " + f + " + 2, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ua = function () {
  return function (t) {
    this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var e = t.inHeight,
        n = t.inWidth,
        r = t.padInfo.top,
        o = t.padInfo.left,
        a = t.strideHeight,
        i = t.strideWidth,
        s = t.dilationHeight,
        u = t.dilationWidth,
        l = t.filterHeight,
        c = t.filterWidth,
        h = t.outChannels / t.inChannels;
    this.userCode = "\n      const ivec2 strides = ivec2(" + a + ", " + i + ");\n      const ivec2 pads = ivec2(" + r + ", " + o + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2 / " + h + ";\n        int q = d2 - d1 * " + h + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TODO(dsmilkov): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < " + l + "; wR++) {\n          int xR = xRCorner + wR * " + s + ";\n\n          if (xR < 0 || xR >= " + e + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + c + "; wC++) {\n            int xC = xCCorner + wC * " + u + ";\n\n            if (xC < 0 || xC >= " + n + ") {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    la = function () {
  return function (t) {
    this.variableNames = ["x", "W"], this.usesPackedTextures = !0, this.outputShape = t.outShape;

    for (var e = t.inHeight, n = t.inWidth, r = t.padInfo.top, o = t.padInfo.left, a = t.strideHeight, i = t.strideWidth, s = t.dilationHeight, u = t.dilationWidth, l = t.filterHeight, c = t.filterWidth, h = c, f = "int xR; int xC; int xCOffset;", d = 0; d < l; d++) for (var v = 0; v < c; v++) f += "\n          vec4 xTexelR" + d + "C" + 2 * v + " = vec4(0.);\n          vec4 wR" + d + "C" + v + " = vec4(0.);\n          vec4 xR" + d + "C" + v + " = vec4(0.);";

    for (d = 0; d < l; d++) for (var m = 0; m < h; m++) {
      if (f += "\n          xR = xRCorner + " + d * s + ";\n          xC = xCCorner + " + (v = 2 * m) * u + ";\n        ", 1 === i) {
        if (v < c && (f += o % 2 == 1 ? "\n                xCOffset = xC + 1;\n                if(xR >= 0 && xR < " + e + " && xCOffset >= 0 && xCOffset < " + n + ") {\n                  xTexelR" + d + "C" + v + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + d + "C" + v + " = vec4(0.);\n                }\n\n                xCOffset = xC + 1 - 2;\n                if(xR >= 0 && xR < " + e + " && xCOffset >= 0 && xCOffset < " + n + ") {\n                  vec4 previous = getX(batch, xR, xCOffset, d1);\n                  xR" + d + "C" + v + " = vec4(previous.zw, xTexelR" + d + "C" + v + ".xy);\n                } else {\n                  xR" + d + "C" + v + " = vec4(0, 0, xTexelR" + d + "C" + v + ".xy);\n                }\n              " : "\n                if(xR >= 0 && xR < " + e + " && xC >= 0 && xC < " + n + ") {\n                  xTexelR" + d + "C" + v + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + d + "C" + v + " = vec4(0.);\n                }\n\n                xR" + d + "C" + v + " = xTexelR" + d + "C" + v + ";\n              ", v + 1 < c)) {
          var g = o % 2 == 0 ? p(u) : u;
          u % 2 == 0 && o % 2 == 1 || u % 2 != 0 && o % 2 != 1 ? (f += "\n                  xCOffset = xC + " + o % 2 + " + " + g + ";\n\n                  if(xR >= 0 && xR < " + e + " &&\n                    xCOffset >= 0 && xCOffset < " + n + ") {\n                    xTexelR" + d + "C" + (v + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n                ", u > 1 && (f += "\n                    xCOffset -= 2;\n                    if(xR >= 0 && xR < " + e + " &&\n                      xCOffset >= 0 && xCOffset < " + n + ") {\n                      xTexelR" + d + "C" + v + " = getX(batch, xR, xCOffset, d1);\n                    } else {\n                      xTexelR" + d + "C" + v + " = vec4(0.);\n                    }\n                  "), f += "\n                  xR" + d + "C" + (v + 1) + " = vec4(\n                    xTexelR" + d + "C" + v + ".zw, xTexelR" + d + "C" + (v + 2) + ".xy);\n                ") : f += "\n                  xCOffset = xC + " + g + ";\n\n                  if(xR >= 0 && xR < " + e + " &&\n                    xCOffset >= 0 && xCOffset < " + n + ") {\n                    xTexelR" + d + "C" + (v + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n\n                  xR" + d + "C" + (v + 1) + " = xTexelR" + d + "C" + (v + 2) + ";\n                ";
        }
      } else v < c && (f += "\n              if(xR >= 0 && xR < " + e + ") {\n            ", o % 2 == 1 ? (f += "\n                xCOffset = xC + 1 - " + i + ";\n                if(xCOffset >= 0 && xCOffset < " + n + ") {\n                  xTexelR" + d + "C" + v + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + d + "C" + v + " = vec4(0.);\n                }\n\n                if(xC + 1 >= 0 && xC + 1 < " + n + ") {\n                  xTexelR" + d + "C" + (v + 2) + " = getX(batch, xR, xC + 1, d1);\n                } else {\n                  xTexelR" + d + "C" + (v + 2) + " = vec4(0.);\n                }\n\n                xR" + d + "C" + v + " = vec4(\n                  xTexelR" + d + "C" + v + ".zw, xTexelR" + d + "C" + (v + 2) + ".zw);\n              ", v + 1 < c && (f += "\n                  vec4 final = vec4(0.);\n                  xCOffset = xC + 1 + " + i + ";\n                  if(xCOffset >= 0 && xCOffset < " + n + ") {\n                    final = getX(batch, xR, xCOffset, d1);\n                  }\n                  xR" + d + "C" + (v + 1) + " = vec4(xTexelR" + d + "C" + (v + 2) + ".xy, final.xy);\n                ")) : (f += "\n                if(xC >= 0 && xC < " + n + ") {\n                  xTexelR" + d + "C" + v + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + d + "C" + v + " = vec4(0.);\n                }\n\n                xCOffset = xC + " + i + ";\n                if(xCOffset >= 0 && xCOffset < " + n + ") {\n                  xTexelR" + d + "C" + (v + 2) + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + d + "C" + (v + 2) + " = vec4(0.);\n                }\n\n                xR" + d + "C" + v + " = vec4(\n                  xTexelR" + d + "C" + v + ".xy, xTexelR" + d + "C" + (v + 2) + ".xy);\n              ", v + 1 < c && (f += "\n                  xR" + d + "C" + (v + 1) + " = vec4(\n                    xTexelR" + d + "C" + v + ".zw, xTexelR" + d + "C" + (v + 2) + ".zw);\n                ")), f += "}");

      v < c && (f += "\n            vec4 wTexelR" + d + "C" + v + " = getW(" + d + ", " + v + ", d1, q);\n            wR" + d + "C" + v + " = vec4(wTexelR" + d + "C" + v + ".xz, wTexelR" + d + "C" + v + ".xz);\n          ", v + 1 < c && (f += "\n              vec4 wTexelR" + d + "C" + (v + 1) + " = getW(" + d + ", " + (v + 1) + ", d1, q);\n              wR" + d + "C" + (v + 1) + " =\n                vec4(wTexelR" + d + "C" + (v + 1) + ".xz, wTexelR" + d + "C" + (v + 1) + ".xz);"));
    }

    for (d = 0; d < l; d++) for (v = 0; v < c; v++) f += "result += xR" + d + "C" + v + " * wR" + d + "C" + v + ";";

    this.userCode = "\n      const ivec2 strides = ivec2(" + a + ", " + i + ");\n      const ivec2 pads = ivec2(" + r + ", " + o + ");\n\n      void main() {\n\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2;\n        int q = 0;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        vec4 result = vec4(0.);\n\n        " + f + "\n\n        setOutput(result);\n      }\n    ";
  };
}(),
    ca = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["Image", "Boxes", "BoxInd"], this.outputShape = [];
    var a = t[0],
        i = t[1],
        s = t[2],
        u = t[3],
        l = e[0],
        c = n[0],
        h = n[1];
    this.outputShape = [l, c, h, u];
    var p = "bilinear" === r ? 1 : 0,
        f = [i - 1 + ".0", s - 1 + ".0"],
        d = f[0],
        v = f[1],
        m = c > 1 ? ["" + (i - 1) / (c - 1), "(y2-y1) * height_ratio", "y1*" + d + " + float(y)*(height_scale)"] : ["0.0", "0.0", "0.5 * (y1+y2) * " + d],
        g = m[0],
        y = m[1],
        x = m[2],
        w = h > 1 ? ["" + (s - 1) / (h - 1), "(x2-x1) * width_ratio", "x1*" + v + " + float(x)*(width_scale)"] : ["0.0", "0.0", "0.5 * (x1+x2) * " + v],
        b = w[0],
        C = w[1],
        E = w[2];
    this.userCode = "\n      const float height_ratio = float(" + g + ");\n      const float width_ratio = float(" + b + ");\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int y = coords[1];\n        int x = coords[2];\n        int d = coords[3];\n\n        // get box vals\n        float y1 = getBoxes(b,0);\n        float x1 = getBoxes(b,1);\n        float y2 = getBoxes(b,2);\n        float x2 = getBoxes(b,3);\n\n        // get image in batch index\n        int bInd = round(getBoxInd(b));\n        if(bInd < 0 || bInd >= " + a + ") {\n          return;\n        }\n\n        float height_scale = " + y + ";\n        float width_scale = " + C + ";\n\n        float in_y = " + x + ";\n        if( in_y < 0.0 || in_y > " + d + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n        float in_x = " + E + ";\n        if( in_x < 0.0 || in_x > " + v + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n\n        vec2 sourceFracIndexCR = vec2(in_x,in_y);\n        if(" + p + " == 1) {\n          // Compute the four integer indices.\n          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);\n          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));\n\n          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);\n          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);\n          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);\n          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);\n\n          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);\n\n          float top = topLeft + (topRight - topLeft) * fracCR.x;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;\n          float newValue = top + (bottom - top) * fracCR.y;\n          setOutput(newValue);\n        } else {\n          // Compute the coordinators of nearest neighbor point.\n          ivec2 sourceNearestCR = ivec2(floor(\n            sourceFracIndexCR + vec2(0.5,0.5)));\n          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);\n          setOutput(newValue);\n        }\n      }\n    ";
  };
}(),
    ha = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.outputShape = t;
    var r = t.length,
        o = t[t.length - 1],
        a = n ? "<" : ">";

    this.userCode = "\n      int getIndex(int i) {\n        " + (n ? "return " + o + " -i - 1;" : "return i;") + "\n      }\n\n      void main() {\n        " + Mo(r) + " coords = getOutputCoords();\n        int end = " + pa(r, "coords") + ";\n        float val = 0.0;\n        for (int i = " + o + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + a + " end) {\n            continue;\n          }\n          if (idx == end && " + e + ") {\n            continue;\n          }\n          " + pa(r, "coords") + " = idx;\n          val += getX(" + function (t, e) {
      if (1 === t) return "" + e;
      if (2 === t) return e + ".x, " + e + ".y";
      if (3 === t) return e + ".x, " + e + ".y, " + e + ".z";
      if (4 === t) return e + ".x, " + e + ".y, " + e + ".z, " + e + ".w";
      throw Error("Cumulative sum for rank " + t + " is not yet supported");
    }(r, "coords") + ");\n        }\n        setOutput(val);\n      }\n    ";
  };
}();

function pa(t, e) {
  if (1 === t) return "" + e;
  if (2 === t) return e + ".y";
  if (3 === t) return e + ".z";
  if (4 === t) return e + ".w";
  throw Error("Cumulative sum for rank " + t + " is not yet supported");
}

var fa = function () {
  function t(t, e, n) {
    this.variableNames = ["x"], this.outputShape = [], this.outputShape = t, this.blockSize = e, this.dataFormat = n, this.userCode = "\n    void main() {\n      ivec4 coords = getOutputCoords();\n      int b = coords[0];\n      int h = " + this.getHeightCoordString() + ";\n      int w = " + this.getWidthCoordString() + ";\n      int d = " + this.getDepthCoordString() + ";\n\n      int in_h = h / " + e + ";\n      int offset_h = imod(h, " + e + ");\n      int in_w = w / " + e + ";\n      int offset_w = imod(w, " + e + ");\n      int offset_d = (offset_h * " + e + " + offset_w) *\n        " + this.getOutputDepthSize() + ";\n      int in_d = d + offset_d;\n\n      float result = " + this.getInputSamplingString() + ";\n      setOutput(result);\n    }\n  ";
  }

  return t.prototype.getHeightCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[1]" : "coords[2]";
  }, t.prototype.getWidthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[2]" : "coords[3]";
  }, t.prototype.getDepthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[3]" : "coords[1]";
  }, t.prototype.getOutputDepthSize = function () {
    return "NHWC" === this.dataFormat ? this.outputShape[3] : this.outputShape[1];
  }, t.prototype.getInputSamplingString = function () {
    return "NHWC" === this.dataFormat ? "getX(b, in_h, in_w, in_d)" : "getX(b, in_d, in_h, in_w)";
  }, t;
}(),
    da = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = bo();
    this.outputShape = t, this.userCode = "\n      const float FLOAT_MAX = 1.70141184e38;\n      const float FLOAT_MIN = 1.17549435e-38;\n\n      lowp vec4 encode_float(highp float v) {\n        if (isnan(v)) {\n          return vec4(255, 255, 255, 255);\n        }\n\n        highp float av = abs(v);\n\n        if(av < FLOAT_MIN) {\n          return vec4(0.0, 0.0, 0.0, 0.0);\n        } else if(v > FLOAT_MAX) {\n          return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n        } else if(v < -FLOAT_MAX) {\n          return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n        }\n\n        highp vec4 c = vec4(0,0,0,0);\n\n        highp float e = floor(log2(av));\n        highp float m = exp2(fract(log2(av))) - 1.0;\n\n        c[2] = floor(128.0 * m);\n        m -= c[2] / 128.0;\n        c[1] = floor(32768.0 * m);\n        m -= c[1] / 32768.0;\n        c[0] = floor(8388608.0 * m);\n\n        highp float ebias = e + 127.0;\n        c[3] = floor(ebias / 2.0);\n        ebias -= c[3] * 2.0;\n        c[2] += floor(ebias) * 128.0;\n\n        c[3] += 128.0 * step(0.0, -v);\n\n        return c / 255.0;\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        " + e.output + " = encode_float(x);\n      }\n    ";
  };
}(),
    va = function () {
  return function (t, e) {
    this.variableNames = ["A"];
    var n = bo(),
        r = e[0],
        o = e[1];
    this.outputShape = t, this.userCode = "\n      " + Ro(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        int flatIndex = getFlatIndex(coords);\n        int offset = imod(flatIndex, 4);\n\n        flatIndex /= 4;\n        int r = flatIndex / " + o + ";\n        int c = imod(flatIndex, " + o + ");\n        vec2 uv = (vec2(c, r) + halfCR) / vec2(" + o + ".0, " + r + ".0);\n        vec4 values = " + n.texture2D + "(A, uv);\n\n        float result;\n\n        if(offset == 0) {\n          result = values[0];\n        } else if(offset == 1) {\n          result = values[1];\n        } else if(offset == 2) {\n          result = values[2];\n        } else {\n          result = values[3];\n        }\n\n        " + n.output + " = vec4(result, 0., 0., 0.);\n      }\n    ";
  };
}(),
    ma = function () {
  return function (t, e) {
    this.variableNames = ["A"];
    var n = bo(),
        r = e[0],
        o = e[1];
    this.outputShape = t;

    for (var a = "", i = 0; i <= 1; i++) for (var s = 0; s <= 1; s++) {
      var u = 2 * i + s;
      a += "\n          localCoords = coords;\n          if(localCoords[2] + " + s + " < " + t[2] + ") {\n            localCoords[2] += " + s + ";\n            if(localCoords[1] + " + i + " < " + t[1] + ") {\n              localCoords[1] += " + i + ";\n\n              flatIndex = getFlatIndex(localCoords);\n              offset = imod(flatIndex, 4);\n    \n              flatIndex /= 4;\n              r = flatIndex / " + o + ";\n              c = imod(flatIndex, " + o + ");\n              uv = (vec2(c, r) + halfCR) / vec2(" + o + ".0, " + r + ".0);\n              values = " + n.texture2D + "(A, uv);\n\n              if(offset == 0) {\n                result[" + u + "] = values[0];\n              } else if(offset == 1) {\n                result[" + u + "] = values[1];\n              } else if(offset == 2) {\n                result[" + u + "] = values[2];\n              } else {\n                result[" + u + "] = values[3];\n              }\n            }\n          }\n        ";
    }

    this.userCode = "\n      " + Ro(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        vec4 result = vec4(0.);\n        int flatIndex, r, c, offset;\n        ivec3 localCoords;\n        vec2 uv;\n        vec4 values;\n        \n        " + a + "\n\n        " + n.output + " = result;\n      }\n    ";
  };
}(),
    ga = "return real * expR - imag * expI;",
    ya = "return real * expI + imag * expR;",
    xa = function () {
  return function (t, e, n) {
    this.variableNames = ["real", "imag"];
    var r = e[1];
    this.outputShape = e;
    var o = n ? "2.0 * " + Math.PI : "-2.0 * " + Math.PI,
        a = n ? r + ".0" : "1.0";
    this.userCode = "\n      const float exponentMultiplier = " + o + ";\n\n      float unaryOpComplex(float real, float expR, float imag, float expI) {\n        " + t + "\n      }\n\n      float mulMatDFT(int batch, int index) {\n        float indexRatio = float(index) / float(" + r + ");\n        float exponentMultiplierTimesIndexRatio =\n            exponentMultiplier * indexRatio;\n\n        float result = 0.0;\n\n        for (int i = 0; i < " + r + "; i++) {\n          // x = (-2|2 * PI / N) * index * i;\n          float x = exponentMultiplierTimesIndexRatio * float(i);\n          float expR = cos(x);\n          float expI = sin(x);\n          float real = getReal(batch, i);\n          float imag = getImag(batch, i);\n\n          result +=\n              unaryOpComplex(real, expR, imag, expI) / " + a + ";\n        }\n\n        return result;\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        setOutput(mulMatDFT(coords[0], coords[1]));\n      }\n    ";
  };
}(),
    wa = function () {
  function t(t, e) {
    this.outputShape = [], this.variableNames = ["x"], this.outputShape = t, this.userCode = "\n      uniform float value;\n      void main() {\n        // Input can be obtained from uniform value.\n        setOutput(value);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.valueLoc && (e.valueLoc = n.getUniformLocationNoThrow(r, "value")), n.gl.uniform1f(e.valueLoc, t);
    };
  }, t;
}(),
    ba = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = bo(),
        n = t[0],
        r = t[1];
    this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + r + ".0, " + n + ".0);\n\n        vec4 values = " + e.texture2D + "(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
  };
}(),
    Ca = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = bo(),
        n = t[0],
        r = t[1];
    this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n\n        vec4 result = vec4(0.);\n\n        for(int row=0; row<=1; row++) {\n          for(int col=0; col<=1; col++) {\n            texC = coords[1] + row;\n            depth = coords[2] + col;\n\n            vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + r + ".0, " + n + ".0);\n            vec4 values = " + e.texture2D + "(A, uv);\n            float value;\n            if (depth == 0) {\n              value = values.r;\n            } else if (depth == 1) {\n              value = values.g;\n            } else if (depth == 2) {\n              value = values.b;\n            } else if (depth == 3) {\n              value = values.a;\n            }\n\n            result[row * 2 + col] = floor(value * 255.0 + 0.5);\n          }\n        }\n\n        " + e.output + " = result;\n      }\n    ";
  };
}(),
    Ea = function () {
  return function (t, e, n) {
    this.variableNames = ["A", "indices"];
    var r = t.slice();
    r[n] = e, this.outputShape = r, this.rank = r.length;

    var o = Mo(this.rank),
        a = function (t, e) {
      var n = t.length;
      if (n > 4) throw Error("Gather for rank " + n + " is not yet supported");
      if (1 === n) return "int(getIndices(resRC))";

      for (var r = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], o = [], a = 0; a < t.length; a++) a === e ? o.push("int(getIndices(" + r[a] + "))") : o.push("" + r[a]);

      return o.join();
    }(t, n);

    this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
  };
}();

var Ra,
    Ia,
    Sa = function () {
  return function (t, e, n) {
    this.sliceDim = t, this.strides = e, this.variableNames = ["x", "indices"], this.outputShape = n;
    var r = Mo(e.length),
        o = Mo(n.length),
        a = this.sliceDim > 1 ? "strides[j]" : "strides";
    this.userCode = "\n        " + r + " strides = " + r + "(" + this.strides + ");\n         void main() {\n          " + o + " coords = getOutputCoords();\n          int flattenIndex = 0;\n          for (int j = 0; j < " + this.sliceDim + "; j++) {\n            int index = round(getIndices(coords[0], j));\n            flattenIndex += index * " + a + ";\n          }\n          setOutput(getX(flattenIndex, coords[1]));\n        }\n      ";
  };
}();

function Na(t, e) {
  return [e, t];
}

function ka(t, e) {
  return t * e;
}

function Aa(t, e, n) {
  var r = function (t, e) {
    if (t % e != 0) throw new Error("unpackedSize (" + t + ") must be a multiple of " + e);
    return t / e;
  }(t.length, n);

  if (e.length < r) throw new Error("matrix length (" + e.length + ") must be >= " + r);

  for (var o = 0, a = 0; a < t.length; a += n) e[o++] = t[a];
}

function Ta(t, e) {
  return [Math.max(1, Math.ceil(e / 2)), Math.max(1, Math.ceil(t / 2))];
}

function Da(t, e) {
  var n = Ta(t, e);
  return n[0] * n[1] * 4;
}

function _a(t, e, n, r, o) {
  var a = n * r;
  if (o.length < a) throw new Error("matrix length (" + o.length + ") must be >= " + a);

  for (var i = r % 2 == 1, s = n % 2 == 1, u = Math.floor(r / 2), l = Math.floor(n / 2), c = Math.ceil(r / 2), h = c * Math.ceil(n / 2), f = p(n) * p(r), d = 0; d < e; d++) {
    for (var v = d * n * r, m = d * f, g = i ? 4 : 0, y = r + (i ? 1 : 0), x = m, w = v, b = v + r, C = 0; C < l; ++C) {
      for (var E = 0; E < u; ++E) o[w++] = t[x++], o[w++] = t[x++], o[b++] = t[x++], o[b++] = t[x++];

      x += g, w += y, b += y;
    }

    if (i) {
      x = m + 4 * (c - 1);
      var R = v + r - 1;

      for (g = 4 * c, y = 2 * r, C = 0; C < l; ++C) o[R] = t[x], o[R + r] = t[x + 2], x += g, R += y;
    }

    if (s) {
      for (x = m + 4 * (h - c), R = v + (n - 1) * r, E = 0; E < u; ++E) o[R++] = t[x++], o[R++] = t[x++], x += 2;

      i && (o[v + n * r - 1] = t[x]);
    }
  }

  return o;
}

function Oa(t, e) {
  var n = bo();
  return zt(t, e, n.version + "\n    precision highp float;\n    " + n.attribute + " vec3 clipSpacePos;\n    " + n.attribute + " vec2 uv;\n    " + n.varyingVs + " vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }");
}

function Ma(t, e) {
  return Xt(t, e, new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]));
}

function Fa(t, e) {
  return Yt(t, e, new Uint16Array([0, 1, 2, 2, 1, 3]));
}

function Ba(t, e) {
  var n,
      r,
      o,
      i,
      s,
      u,
      l,
      c,
      h = t;
  return 2 === a.getNumber("WEBGL_VERSION") ? (n = h.R32F, r = h.R16F, o = h.RGBA16F, i = h.RGBA32F, s = h.RED, u = 4, l = 1, c = h.HALF_FLOAT) : (n = t.RGBA, r = t.RGBA, o = t.RGBA, i = h.RGBA, s = t.RGBA, u = 4, l = 4, c = null != e ? e.HALF_FLOAT_OES : null), {
    internalFormatFloat: n,
    internalFormatHalfFloat: r,
    internalFormatPackedHalfFloat: o,
    internalFormatPackedFloat: i,
    textureFormatFloat: s,
    downloadTextureFormat: t.RGBA,
    downloadUnpackNumChannels: u,
    defaultNumChannels: l,
    textureTypeHalfFloat: c
  };
}

function Pa(t, e, n, r, o, a, i) {
  Jt(n, r);
  var s = Qt(t, e),
      u = t.TEXTURE_2D;
  return Ft(t, e, function () {
    return t.bindTexture(u, s);
  }), Ft(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE);
  }), Ft(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }), Ft(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MIN_FILTER, t.NEAREST);
  }), Ft(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MAG_FILTER, t.NEAREST);
  }), Ft(t, e, function () {
    return t.texImage2D(u, 0, o, n, r, 0, a, i, null);
  }), Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  }), s;
}

function La(t, e, n, r, o) {
  var a = Na(n, r);
  return Pa(t, e, a[0], a[1], o.internalFormatFloat, o.textureFormatFloat, t.FLOAT);
}

function Wa(t, e, n, r, o) {
  var a = Na(n, r);
  return Pa(t, e, a[0], a[1], o.internalFormatHalfFloat, o.textureFormatFloat, o.textureTypeHalfFloat);
}

function Ua(t, e, n, r, o) {
  var a = Na(n, r);
  return Pa(t, e, a[0], a[1], t.RGBA, t.RGBA, t.UNSIGNED_BYTE);
}

function za(t, e, n, r, o) {
  var a = Ta(n, r);
  return Pa(t, e, a[0], a[1], o.internalFormatPackedFloat, t.RGBA, t.FLOAT);
}

function Va(t, e, n, r, o) {
  var a = Ta(n, r);
  return Pa(t, e, a[0], a[1], o.internalFormatPackedHalfFloat, t.RGBA, o.textureTypeHalfFloat);
}

function Ga(t, e, n, r) {
  return Ft(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), te(t, e, n, "clipSpacePos", r, 3, 20, 0) && te(t, e, n, "uv", r, 2, 20, 12);
}

function qa(t, e, n, r, o, a, i) {
  Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  });
  var s = new Float32Array(r * o * 4);
  s.set(a), Ft(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, i.internalFormatPackedFloat, r, o, 0, t.RGBA, t.FLOAT, s);
  }), Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function Ha(t, e, n, r) {
  Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  }), r.data instanceof Uint8Array ? Ft(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, r.width, r.height, 0, t.RGBA, t.UNSIGNED_BYTE, r.data);
  }) : Ft(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r);
  }), Ft(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function $a(t, e, n, r, o) {
  var a = t.createBuffer();
  Ft(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, a);
  });
  var i = 4 * ka(n * r, o.downloadUnpackNumChannels);
  return Ft(t, e, function () {
    return t.bufferData(t.PIXEL_PACK_BUFFER, i, t.STREAM_READ);
  }), Ft(t, e, function () {
    return t.readPixels(0, 0, r, n, t.RGBA, t.FLOAT, 0);
  }), Ft(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, null);
  }), a;
}

function ja(t, e, n, r, o) {
  var a = t,
      i = new Float32Array(ka(n * r, o.downloadUnpackNumChannels));
  a.bindBuffer(a.PIXEL_PACK_BUFFER, e), a.getBufferSubData(a.PIXEL_PACK_BUFFER, 0, i), a.bindBuffer(a.PIXEL_PACK_BUFFER, null);
  var s = new Float32Array(n * r);
  return Aa(i, s, o.downloadUnpackNumChannels), s;
}

function Ka(t, e, n, r, o) {
  var a = Na(n, r),
      i = a[0],
      s = a[1],
      u = new Float32Array(ka(n * r, o.downloadUnpackNumChannels));
  Ft(t, e, function () {
    return t.readPixels(0, 0, i, s, o.downloadTextureFormat, t.FLOAT, u);
  });
  var l = new Float32Array(n * r);
  return Aa(u, l, o.downloadUnpackNumChannels), l;
}

function Xa(t, e, n, r, o) {
  var a = Na(n, r),
      i = a[0],
      s = a[1],
      u = new Uint8Array(ka(n * r, 4));
  return Ft(t, e, function () {
    return t.readPixels(0, 0, i, s, o.downloadTextureFormat, t.UNSIGNED_BYTE, u);
  }), new Float32Array(u.buffer);
}

function Ya(t, e, n, r, o, a, i, s) {
  var u = t,
      l = new Float32Array(Da(a, i));
  u.bindBuffer(u.PIXEL_PACK_BUFFER, e), u.getBufferSubData(u.PIXEL_PACK_BUFFER, 0, l), u.bindBuffer(u.PIXEL_PACK_BUFFER, null);
  var c = new Float32Array(y([n, r, o]));
  return _a(l, n, r, o, c), c;
}

function Qa(t, e, n, r, o, a, i, s) {
  var u = Ta(a, i),
      l = u[0],
      c = u[1],
      h = new Float32Array(Da(a, i));
  Ft(t, e, function () {
    return t.readPixels(0, 0, l, c, t.RGBA, t.FLOAT, h);
  });
  var p = new Float32Array(y([n, r, o]));
  return _a(h, n, r, o, p);
}

!function (t) {
  t[t.RENDER = 0] = "RENDER", t[t.UPLOAD = 1] = "UPLOAD", t[t.PIXELS = 2] = "PIXELS", t[t.DOWNLOAD = 3] = "DOWNLOAD";
}(Ra || (Ra = {})), function (t) {
  t[t.UNPACKED_FLOAT16 = 0] = "UNPACKED_FLOAT16", t[t.UNPACKED_FLOAT32 = 1] = "UNPACKED_FLOAT32", t[t.PACKED_4X1_UNSIGNED_BYTE = 2] = "PACKED_4X1_UNSIGNED_BYTE", t[t.PACKED_2X2_FLOAT32 = 3] = "PACKED_2X2_FLOAT32", t[t.PACKED_2X2_FLOAT16 = 4] = "PACKED_2X2_FLOAT16";
}(Ia || (Ia = {}));

var Ja = Object.freeze({
  createVertexShader: Oa,
  createVertexBuffer: Ma,
  createIndexBuffer: Fa,
  getTextureConfig: Ba,
  createFloat32MatrixTexture: La,
  createFloat16MatrixTexture: Wa,
  createUnsignedBytesMatrixTexture: Ua,
  createPackedMatrixTexture: za,
  createFloat16PackedMatrixTexture: Va,
  bindVertexProgramAttributeStreams: Ga,
  uploadDenseMatrixToTexture: qa,
  uploadPixelDataToTexture: Ha,
  createBufferFromOutputTexture: $a,
  downloadFloat32MatrixFromBuffer: ja,
  downloadFloat32MatrixFromOutputTexture: Ka,
  downloadByteEncodedFloatMatrixFromOutputTexture: Xa,
  downloadPackedMatrixFromBuffer: Ya,
  downloadMatrixFromPackedOutputTexture: Qa
}),
    Za = function () {
  function t(t) {
    this.outputTexture = null, this.program = null, this.disposed = !1, this.vertexAttrsAreBound = !1, this.itemsToPoll = [];
    var e = a.getNumber("WEBGL_VERSION");
    null != t ? (this.gl = t, Ot(e, t)) : this.gl = Mt(e), 1 === a.getNumber("WEBGL_VERSION") ? (this.textureFloatExtension = Ut(this.gl, this.debug, "OES_texture_float"), this.colorBufferFloatExtension = this.gl.getExtension("WEBGL_color_buffer_float"), a.getBool("WEBGL_RENDER_FLOAT32_ENABLED") || (this.textureHalfFloatExtension = Ut(this.gl, this.debug, "OES_texture_half_float"), this.colorBufferHalfFloatExtension = this.gl.getExtension("EXT_color_buffer_half_float"))) : this.colorBufferFloatExtension = Ut(this.gl, this.debug, "EXT_color_buffer_float"), this.vertexBuffer = Ma(this.gl, this.debug), this.indexBuffer = Fa(this.gl, this.debug), this.framebuffer = Zt(this.gl, this.debug), this.textureConfig = Ba(this.gl, this.textureHalfFloatExtension);
  }

  return Object.defineProperty(t.prototype, "debug", {
    get: function () {
      return a.getBool("DEBUG");
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.dispose = function () {
    var t = this;

    if (!this.disposed) {
      null != this.program && console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."), null != this.outputTexture && console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");
      var e = this.gl;
      Ft(e, this.debug, function () {
        return e.finish();
      }), Ft(e, this.debug, function () {
        return e.bindFramebuffer(e.FRAMEBUFFER, null);
      }), Ft(e, this.debug, function () {
        return e.deleteFramebuffer(t.framebuffer);
      }), Ft(e, this.debug, function () {
        return e.bindBuffer(e.ARRAY_BUFFER, null);
      }), Ft(e, this.debug, function () {
        return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
      }), Ft(e, this.debug, function () {
        return e.deleteBuffer(t.indexBuffer);
      }), this.disposed = !0;
    }
  }, t.prototype.createFloat32MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), La(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createFloat16MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), Wa(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createUnsignedBytesMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), Ua(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.uploadPixelDataToTexture = function (t, e) {
    this.throwIfDisposed(), Ha(this.gl, this.debug, t, e);
  }, t.prototype.uploadDenseMatrixToTexture = function (t, e, n, r) {
    this.throwIfDisposed(), qa(this.gl, this.debug, t, e, n, r, this.textureConfig);
  }, t.prototype.createFloat16PackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), Va(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createPackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), za(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.deleteMatrixTexture = function (t) {
    var e = this;
    this.throwIfDisposed(), this.outputTexture === t && (ie(this.gl, this.debug, this.framebuffer), this.outputTexture = null), Ft(this.gl, this.debug, function () {
      return e.gl.deleteTexture(t);
    });
  }, t.prototype.downloadFloat32MatrixFromOutputTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return Ka(r.gl, r.debug, e, n, r.textureConfig);
    });
  }, t.prototype.downloadByteEncodedFloatMatrixFromOutputTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return Xa(r.gl, r.debug, e, n, r.textureConfig);
    });
  }, t.prototype.downloadPackedMatrixFromBuffer = function (t, e, n, r, o, a) {
    return Ya(this.gl, t, e, n, r, o, a, this.textureConfig);
  }, t.prototype.downloadFloat32MatrixFromBuffer = function (t, e, n) {
    return ja(this.gl, t, e, n, this.textureConfig);
  }, t.prototype.createBufferFromTexture = function (t, e, n) {
    this.bindTextureToFrameBuffer(t);
    var r = $a(this.gl, this.debug, e, n, this.textureConfig);
    return this.unbindTextureToFrameBuffer(), r;
  }, t.prototype.createAndWaitForFence = function () {
    var t = this.createFence(this.gl);
    return this.pollFence(t);
  }, t.prototype.createFence = function (t) {
    var e,
        n,
        r = this;

    if (a.getBool("WEBGL_FENCE_API_ENABLED")) {
      var o = t,
          i = o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE, 0);
      t.flush(), n = function () {
        var t = o.clientWaitSync(i, 0, 0);
        return t === o.ALREADY_SIGNALED || t === o.CONDITION_SATISFIED;
      }, e = i;
    } else a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? (e = this.beginQuery(), this.endQuery(), n = function () {
      return r.isQueryAvailable(e, a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
    }) : n = function () {
      return !0;
    };

    return {
      query: e,
      isFencePassed: n
    };
  }, t.prototype.downloadMatrixFromPackedTexture = function (t, e, n, r, o, a) {
    var i = this;
    return this.downloadMatrixDriver(t, function () {
      return Qa(i.gl, i.debug, e, n, r, o, a, i.textureConfig);
    });
  }, t.prototype.createProgram = function (t) {
    this.throwIfDisposed();
    var e = this.gl,
        n = Vt(e, this.debug, t),
        r = Oa(e, this.debug),
        o = $t(e, this.debug);
    return Ft(e, this.debug, function () {
      return e.attachShader(o, r);
    }), Ft(e, this.debug, function () {
      return e.attachShader(o, n);
    }), jt(e, this.debug, o), this.debug && Kt(e, this.debug, o), this.vertexAttrsAreBound || (this.setProgram(o), this.vertexAttrsAreBound = Ga(e, this.debug, this.program, this.vertexBuffer)), o;
  }, t.prototype.deleteProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), t === this.program && (this.program = null), null != t && Ft(this.gl, this.debug, function () {
      return e.gl.deleteProgram(t);
    });
  }, t.prototype.setProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), this.program = t, null != this.program && this.debug && Kt(this.gl, this.debug, this.program), Ft(this.gl, this.debug, function () {
      return e.gl.useProgram(t);
    });
  }, t.prototype.getUniformLocation = function (t, e, n) {
    return void 0 === n && (n = !0), this.throwIfDisposed(), n ? ne(this.gl, this.debug, t, e) : re(this.gl, t, e);
  }, t.prototype.getAttributeLocation = function (t, e) {
    var n = this;
    return this.throwIfDisposed(), Ft(this.gl, this.debug, function () {
      return n.gl.getAttribLocation(t, e);
    });
  }, t.prototype.getUniformLocationNoThrow = function (t, e) {
    return this.throwIfDisposed(), this.gl.getUniformLocation(t, e);
  }, t.prototype.setInputMatrixTexture = function (t, e, n) {
    this.throwIfDisposed(), this.throwIfNoProgram(), oe(this.gl, this.debug, this.program, t, e, n);
  }, t.prototype.setOutputMatrixTexture = function (t, e, n) {
    this.setOutputMatrixTextureDriver(t, n, e);
  }, t.prototype.setOutputPackedMatrixTexture = function (t, e, n) {
    this.throwIfDisposed();
    var r = Ta(e, n),
        o = r[0],
        a = r[1];
    this.setOutputMatrixTextureDriver(t, o, a);
  }, t.prototype.setOutputMatrixWriteRegion = function (t, e, n, r) {
    this.setOutputMatrixWriteRegionDriver(n, t, r, e);
  }, t.prototype.setOutputPackedMatrixWriteRegion = function (t, e, n, r) {
    throw new Error("setOutputPackedMatrixWriteRegion not implemented.");
  }, t.prototype.debugValidate = function () {
    null != this.program && Kt(this.gl, this.debug, this.program), se(this.gl);
  }, t.prototype.executeProgram = function () {
    this.throwIfDisposed(), this.throwIfNoProgram();
    var t = this.gl;
    this.debug && this.debugValidate(), Ft(t, this.debug, function () {
      return t.drawElements(t.TRIANGLES, 6, t.UNSIGNED_SHORT, 0);
    });
  }, t.prototype.blockUntilAllProgramsCompleted = function () {
    var t = this;
    this.throwIfDisposed(), Ft(this.gl, this.debug, function () {
      return t.gl.finish();
    });
  }, t.prototype.getQueryTimerExtension = function () {
    return null == this.disjointQueryTimerExtension && (this.disjointQueryTimerExtension = Ut(this.gl, this.debug, 2 === a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") ? "EXT_disjoint_timer_query_webgl2" : "EXT_disjoint_timer_query")), this.disjointQueryTimerExtension;
  }, t.prototype.getQueryTimerExtensionWebGL2 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.getQueryTimerExtensionWebGL1 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.beginQuery = function () {
    if (2 === a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.gl,
          e = this.getQueryTimerExtensionWebGL2(),
          n = t.createQuery();
      return t.beginQuery(e.TIME_ELAPSED_EXT, n), n;
    }

    var r = this.getQueryTimerExtensionWebGL1(),
        o = r.createQueryEXT();
    return r.beginQueryEXT(r.TIME_ELAPSED_EXT, o), o;
  }, t.prototype.endQuery = function () {
    if (2 !== a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.getQueryTimerExtensionWebGL1();
      t.endQueryEXT(t.TIME_ELAPSED_EXT);
    } else {
      var e = this.gl,
          n = this.getQueryTimerExtensionWebGL2();
      e.endQuery(n.TIME_ELAPSED_EXT);
    }
  }, t.prototype.waitForQueryAndGetTime = function (t) {
    return r(this, void 0, void 0, function () {
      var e = this;
      return o(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, R(function () {
              return e.disposed || e.isQueryAvailable(t, a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
            })];

          case 1:
            return n.sent(), [2, this.getQueryTime(t, a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))];
        }
      });
    });
  }, t.prototype.getQueryTime = function (t, e) {
    if (0 === e) return null;

    if (2 === e) {
      var n = this.gl;
      return n.getQueryParameter(t, n.QUERY_RESULT) / 1e6;
    }

    var r = this.getQueryTimerExtensionWebGL1();
    return r.getQueryObjectEXT(t, r.QUERY_RESULT_EXT) / 1e6;
  }, t.prototype.isQueryAvailable = function (t, e) {
    if (0 === e) return !0;

    if (2 === e) {
      var n = this.gl,
          r = this.getQueryTimerExtensionWebGL2(),
          o = n.getQueryParameter(t, n.QUERY_RESULT_AVAILABLE);
      return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
    }

    o = (r = this.getQueryTimerExtensionWebGL1()).getQueryObjectEXT(t, r.QUERY_RESULT_AVAILABLE_EXT);
    return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
  }, t.prototype.pollFence = function (t) {
    var e = this;
    return new Promise(function (n) {
      e.addItemToPoll(function () {
        return t.isFencePassed();
      }, function () {
        return n();
      });
    });
  }, t.prototype.pollItems = function () {
    for (var t = function (t) {
      for (var e = 0; e < t.length; ++e) {
        var n = t[e]();
        if (!n) break;
      }

      return e - 1;
    }(this.itemsToPoll.map(function (t) {
      return t.isDoneFn;
    })), e = 0; e <= t; ++e) {
      (0, this.itemsToPoll[e].resolveFn)();
    }

    this.itemsToPoll = this.itemsToPoll.slice(t + 1);
  }, t.prototype.addItemToPoll = function (t, e) {
    var n = this;
    this.itemsToPoll.push({
      isDoneFn: t,
      resolveFn: e
    }), this.itemsToPoll.length > 1 || R(function () {
      return n.pollItems(), 0 === n.itemsToPoll.length;
    });
  }, t.prototype.bindTextureToFrameBuffer = function (t) {
    this.throwIfDisposed(), ae(this.gl, this.debug, t, this.framebuffer), this.debug && se(this.gl);
  }, t.prototype.unbindTextureToFrameBuffer = function () {
    null != this.outputTexture ? (ae(this.gl, this.debug, this.outputTexture, this.framebuffer), this.debug && se(this.gl)) : ie(this.gl, this.debug, this.framebuffer);
  }, t.prototype.downloadMatrixDriver = function (t, e) {
    this.bindTextureToFrameBuffer(t);
    var n = e();
    return this.unbindTextureToFrameBuffer(), n;
  }, t.prototype.setOutputMatrixTextureDriver = function (t, e, n) {
    this.throwIfDisposed();
    var r = this.gl;
    ae(r, this.debug, t, this.framebuffer), this.debug && se(r), this.outputTexture = t, Ft(r, this.debug, function () {
      return r.viewport(0, 0, e, n);
    }), Ft(r, this.debug, function () {
      return r.scissor(0, 0, e, n);
    });
  }, t.prototype.setOutputMatrixWriteRegionDriver = function (t, e, n, r) {
    var o = this;
    this.throwIfDisposed(), Ft(this.gl, this.debug, function () {
      return o.gl.scissor(t, e, n, r);
    });
  }, t.prototype.throwIfDisposed = function () {
    if (this.disposed) throw new Error("Attempted to use disposed GPGPUContext.");
  }, t.prototype.throwIfNoProgram = function () {
    if (null == this.program) throw new Error("No GPU program is currently set.");
  }, t;
}();

function ti(t, e) {
  if (t.length !== e.length) throw Error("Binary was compiled with " + t.length + " inputs, but was executed with " + e.length + " inputs");
  t.forEach(function (t, n) {
    var r = t.logicalShape,
        o = e[n],
        a = o.shape;
    if (!x(r, a)) throw Error("Binary was compiled with different shapes than the current args. Shapes " + r + " and " + a + " must match");

    if (!t.isUniform || !o.isUniform) {
      var i = t.texShape,
          s = o.isUniform ? null : o.texData.texShape;
      if (!x(i, s)) throw Error("Binary was compiled with different texture shapes than the current args. Shape " + i + " and " + s + " must match");
    }
  });
}

var ei = function () {
  return function (t, e, n) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;
    var r = n.filterWidth,
        o = n.inChannels,
        a = n.strideWidth,
        i = n.strideHeight,
        s = n.padInfo,
        u = n.outWidth,
        l = n.dilationWidth,
        c = n.dilationHeight,
        h = s.left,
        p = s.top,
        f = o * r,
        d = bo();
    this.userCode = "\n      void main() {\n        ivec2 rc = getOutputCoords();\n\n        vec4 result = vec4(0);\n\n        for(int row=0; row<=1; row++) {\n          for(int col=0; col<=1; col++) {\n            int blockIndex = rc.y + col;\n            int pos = rc.x + row;\n\n            if(blockIndex >= " + t[1] + " || pos >= " + t[0] + ") continue;\n\n            int offsetY = int(blockIndex / (" + u + ")) * " + i + " - " + p + ";\n            int d0 = offsetY + " + c + " * (pos / " + f + ");\n\n            if(d0 >= " + e[0] + " || d0 < 0) continue;\n\n            int offsetX = int(mod(float(blockIndex), " + u + ".) * " + a + ". - " + h + ".);\n            int d1 = offsetX + " + l + " * (int(mod(float(pos), " + f + ".) / " + o + ".));\n\n            if(d1 >= " + e[1] + " || d1 < 0) continue;\n\n            vec2 innerDims = vec2(d1, int(mod(float(pos), " + o + ".)));\n            result[row * 2 + col] = getChannel(getA(d0, int(innerDims.x),\n                                              int(innerDims.y)), innerDims);\n          }\n        }\n\n        " + d.output + " = result;\n      }\n    ";
  };
}(),
    ni = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["x"], this.outputShape = [];
    var a,
        i = e,
        s = t[3] - 1;
    this.outputShape = t;
    var u = "float(" + n + ") + float(" + r + ") * sum";
    a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n        int d = coords[3];\n        float x = getX(b, r, c, d);\n        float sum = 0.0;\n        for (int j = -" + i + "; j <= " + i + "; j++) {\n          int idx = d + j;\n          if (idx >= 0 && idx <=  " + s + ") {\n            float z = getX(b, r, c, idx);\n            sum += z * z;\n          }\n        }\n        float val = x * " + a + ";\n        setOutput(val);\n      }\n    ";
  };
}(),
    ri = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["inputImage", "outputImage", "dy"], this.outputShape = [], this.outputShape = t, this.depth = t[3], this.depthRadius = e, this.bias = n, this.alpha = r, this.beta = o, this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n\n        float result = 0.0;\n        for (int d = 0; d < " + this.depth + "; ++d) {\n          int depthBegin = int(max(0.0, float(d - " + e + ")));\n          int depthEnd = int(min(float(" + this.depth + "),\n              float(d + " + e + " + 1)));\n\n          const int MIN_DEPTH_BEGIN = 0;\n          const int MAX_DEPTH_END = " + this.depth + ";\n\n          float norm = 0.0;\n          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd) {\n              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);\n            }\n            else {\n              break;\n            }\n          }\n\n          norm = float(" + r + ") * norm + float(" + n + ");\n\n          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd){\n              float dyi = -2.0 * float(" + r + ")\n                * float(" + o + ")\n                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)\n                / norm;\n              if (k == d) {\n                dyi += pow(norm, -1.0 * " + o + ");\n              }\n              if (k == coords[3]) {\n                dyi *= getDy(b, r, c, d);\n                result += dyi;\n              }\n            }\n            else {\n              break;\n            }\n          }\n      }\n      setOutput(result);\n      }\n    ";
  };
}(),
    oi = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["x"], this.outputShape = [], this.usesPackedTextures = !0;
    var a,
        i = e,
        s = t[3] - 1;
    this.outputShape = t;
    var u = "float(" + n + ") + float(" + r + ") * sum";
    a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords.x;\n        int r = coords.y;\n        int c = coords.z;\n        int d = coords.w;\n\n        bool hasNextCol = d < " + this.outputShape[3] + ";\n        bool hasNextRow = c < " + this.outputShape[2] + ";\n\n        vec4 sum = vec4(0.);\n        vec4 xFragAtOutputCoords = getX(b, r, c, d);\n\n        vec4 xAtOutputCoords = vec4(\n          getChannel(xFragAtOutputCoords, vec2(c, d)),\n          hasNextCol ?\n            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,\n          hasNextRow ?\n            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0\n        );\n\n        int firstChannel = d - " + i + ";\n        vec2 cache = vec2(0.);\n        if(firstChannel >= 0){\n          vec4 firstChannelFrag = getX(b, r, c, firstChannel);\n          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));\n            if(hasNextRow){\n              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));\n            }\n        }\n\n        ivec2 depth = ivec2(d, d + 1);\n        for (int j = - " + i + "; j <= " + i + "; j++) {\n          ivec2 idx = depth + j;\n          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));\n          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(" + s + "));\n\n          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;\n          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;\n\n          if(depthInRange || depthPlusOneInRange){\n            vec4 z = vec4(0.);\n            vec4 xFragAtCurrentDepth;\n            z.xz = cache.xy;\n            if(depthPlusOneInRange && hasNextCol){\n              xFragAtCurrentDepth = idx.y != d ?\n                getX(b, r, c, idx.y) : xFragAtOutputCoords;\n              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));\n              if(hasNextRow){\n                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));\n              }\n            }\n            cache.xy = z.yw;\n            sum += z * z;\n          }\n        }\n        vec4 result = xAtOutputCoords * " + a + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    ai = function () {
  return function (t) {
    this.variableNames = ["dy", "maxPos"], this.outputShape = t.inShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.dilationHeight,
        o = t.effectiveFilterHeight,
        a = t.effectiveFilterWidth,
        i = o - 1 - t.padInfo.top,
        s = a - 1 - t.padInfo.left,
        u = o * a - 1;
    this.userCode = "\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + o + ";\n          wR += " + r + ") {\n          float dyR = float(dyRCorner + wR) / " + e + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + a + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + n + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + u + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + a + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ii = function () {
  return function (t, e, n, r, o, a) {
    void 0 === n && (n = !1), void 0 === r && (r = !1), void 0 === o && (o = !1), void 0 === a && (a = null), this.variableNames = ["matrixA", "matrixB"], this.usesPackedTextures = !0, this.outputShape = e;
    var i = n ? t[1] : t[2],
        s = Math.ceil(i / 2),
        u = n ? "i * 2, rc.y" : "rc.y, i * 2",
        l = r ? "rc.z, i * 2" : "i * 2, rc.z",
        c = n ? ["a.xxyy", "a.zzww"] : ["a.xxzz", "a.yyww"],
        h = r ? ["b.xzxz", "b.ywyw"] : ["b.xyxy", "b.zwzw"],
        p = "",
        f = "";
    a && (p = "vec4 activation(vec4 x) {\n        " + a + "\n      }", f = "result = activation(result);");
    var d = o ? "result += getBiasAtOutCoords();" : "";
    o && this.variableNames.push("bias"), this.userCode = "\n      " + p + "\n\n      const float sharedDimension = " + s + ".0;\n\n      vec4 dot2x2ARowBCol(ivec3 rc) {\n        vec4 result = vec4(0);\n        for (int i = 0; i < " + s + "; i++) {\n          vec4 a = getMatrixA(rc.x, " + u + ");\n          vec4 b = getMatrixB(rc.x, " + l + ");\n\n          result += (" + c[0] + " * " + h[0] + ") + (" + c[1] + " * " + h[1] + ");\n        }\n        return result;\n      }\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n        vec4 result = dot2x2ARowBCol(rc);\n\n        " + d + "\n\n        " + f + "\n\n        setOutput(result);\n      }\n    ";
  };
}(),
    si = function () {
  function t(t, e, n) {
    this.variableNames = ["probs"], this.outputShape = [t, n], this.userCode = "\n      uniform float seed;\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n\n        float r = random(seed);\n        float cdf = 0.0;\n\n        for (int i = 0; i < " + (e - 1) + "; i++) {\n          cdf += getProbs(batch, i);\n\n          if (r < cdf) {\n            setOutput(float(i));\n            return;\n          }\n        }\n\n        // If no other event happened, last event happened.\n        setOutput(float(" + (e - 1) + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.seedLoc && (e.seedLoc = n.getUniformLocation(r, "seed")), n.gl.uniform1f(e.seedLoc, t);
    };
  }, t;
}(),
    ui = function () {
  return function (t, e, n, r) {
    this.variableNames = ["indices"], this.outputShape = [t, e], this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + r + "), float(" + n + "),\n                      float(index == coords.y)));\n      }\n    ";
  };
}(),
    li = function () {
  return function (t) {
    this.variableNames = ["A"], this.isPackShader = !0, this.outputShape = t;
    var e = t.length;
    if (0 === e) this.userCode = "\n        void main() {\n          setOutput(vec4(getA(), 0., 0., 0.));\n        }\n      ";else {
      var n = wo("rc", e),
          r = Mo(e),
          o = function (t, e, n) {
        if (1 === t) return "rc > " + e[0];

        for (var r = "", o = t - 2; o < t; o++) r += n[o] + " >= " + e[o], o < t - 1 && (r += "||");

        return r;
      }(e, t, n),
          a = function (t, e, n, r) {
        if (1 === t) return "";
        var o = r.slice(-2);
        return "\n    int r = " + o[0] + ";\n    int c = " + o[1] + ";\n    int rp1 = r + 1;\n    int cp1 = c + 1;\n\n    bool cEdge = cp1 >= " + e + ";\n    bool rEdge = rp1 >= " + n + ";\n  ";
      }(e, t[t.length - 1], t[t.length - 2], n),
          i = function (t, e) {
        var n = t.length,
            r = function (t, e) {
          for (var n = [], r = 0; r <= 1; r++) for (var o = 0; o <= 1; o++) {
            for (var a = (0 === r ? "r" : "rp1") + ", " + (0 === o ? "c" : "cp1"), i = 2; i < t; i++) a = e[e.length - 1 - i] + "," + a;

            n.push(a);
          }

          return n;
        }(n, e);

        return 1 === n ? "getA(rc),\n            rc + 1 >= " + t[0] + " ? 0. : getA(rc + 1),\n            0, 0" : "getA(" + r[0] + "),\n          cEdge ? 0. : getA(" + r[1] + "),\n          rEdge ? 0. : getA(" + r[2] + "),\n          rEdge || cEdge ? 0. : getA(" + r[3] + ")";
      }(t, n);

      this.userCode = "\n        void main() {\n          " + r + " rc = getOutputCoords();\n\n          if(" + o + ") {\n            setOutput(vec4(0));\n          } else {\n            " + a + "\n\n            setOutput(vec4(" + i + "));\n          }\n        }\n      ";
    }
  };
}();

var ci = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.outputShape = e.map(function (e, n) {
      return e[0] + t[n] + e[1];
    });
    var r = t.length,
        o = Mo(r),
        a = e.map(function (t) {
      return t[0];
    }).join(","),
        i = e.map(function (e, n) {
      return e[0] + t[n];
    }).join(","),
        s = ["coords[0]", "coords[1]", "coords[2]", "coords[3]"].slice(0, r);
    this.userCode = 1 !== r ? "\n      " + o + " start = " + o + "(" + a + ");\n      " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + n + "));\n        } else {\n          " + o + " coords = outC - start;\n          setOutput(getX(" + s + "));\n        }\n      }\n    " : "\n        int start = " + a + ";\n        int end = " + i + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + n + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
  };
}(),
    hi = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.usesPackedTextures = !0, this.outputShape = e.map(function (e, n) {
      return e[0] + t[n] + e[1];
    });

    for (var r = t.length, o = Mo(r), a = e.map(function (t) {
      return t[0];
    }).join(","), i = e.map(function (e, n) {
      return e[0] + t[n];
    }).join(","), s = wo("rc", r), u = wo("source", r), l = s[r - 1] + " < " + this.outputShape[r - 1], c = 1 === r ? "source" : "vec2(" + u.slice(-2).join() + ")", h = [o + " rc = outputLoc;", s[r - 1] + " += 1;\n       if(" + l + ") {\n      ", 1 === r ? "" : "}\n       rc = outputLoc;\n       " + s[r - 2] + " += 1;\n       if(" + s[r - 2] + " < " + this.outputShape[r - 2] + ") {", 1 === r ? "" : "  " + s[r - 1] + " += 1;\n         if(" + l + ") {"], p = 1 === r ? "rc < start || rc >= end" : "any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))", f = "", d = 0, v = 1 === r ? 2 : 4; d < v; d++) f += "\n        " + h[d] + "\n        if (" + p + ") {\n          result[" + d + "] = float(" + n + ");\n        } else {\n          " + o + " source = rc - start;\n          result[" + d + "] = getChannel(getX(" + u.join() + "), " + c + ");\n        }\n      ";

    f += 1 === r ? "} " : "}}", this.userCode = "\n      const " + o + " start = " + o + "(" + a + ");\n      const " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outputLoc = getOutputCoords();\n        vec4 result = vec4(0.);\n        " + f + "\n        setOutput(result);\n      }\n    ";
  };
}(),
    pi = function () {
  return function (t, e, n) {
    if (this.variableNames = ["x"], "avg" === e && n) throw new Error("Cannot compute positions for average pool.");
    var r = t.filterWidth,
        o = t.strideHeight,
        a = t.strideWidth,
        i = t.dilationHeight,
        s = t.dilationWidth,
        u = t.effectiveFilterHeight,
        l = t.effectiveFilterWidth,
        c = t.padInfo.top,
        h = t.padInfo.left;
    this.outputShape = t.outShape;
    var p = "avg" === e,
        f = "0.0";
    if (p || (f = "-1.0 / 1e-20"), n) this.userCode = "\n        const ivec2 strides = ivec2(" + o + ", " + a + ");\n        const ivec2 pads = ivec2(" + c + ", " + h + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + u + ";\n              wR += " + i + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + l + ";\n                wC += " + s + ") {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value >= currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = wR * " + l + " + wC;\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";else {
      var d = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
      "avg" === e && (d = "avgValue / count");
      var v = 4 * Math.floor(r / 4),
          m = r % 4,
          g = "\n      if (" + p + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = max(values, minMaxValue);\n      }\n    ";
      this.userCode = "\n      const ivec2 strides = ivec2(" + o + ", " + a + ");\n      const ivec2 pads = ivec2(" + c + ", " + h + ");\n      const float initializationValue = " + f + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + t.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + f + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wR = 0; wR < " + u + ";\n            wR += " + i + ") {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + v + "; wC += 4) {\n            int xC = xCCorner + wC * " + s + ";\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              getValue(batch, xR, xC + 2 * " + s + ", d),\n              getValue(batch, xR, xC + 3 * " + s + ", d)\n            );\n\n            " + g + "\n          }\n\n          int xC = xCCorner + " + v + ";\n          if (" + (1 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n\n            " + g + "\n          } else if (" + (2 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + g + "\n          } else if (" + (3 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              getValue(batch, xR, xC + 2 * " + s + ", d),\n              initializationValue\n            );\n\n            " + g + "\n          }\n        }\n        setOutput(" + d + ");\n      }\n    ";
    }
  };
}(),
    fi = function () {
  return function (t, e) {
    this.variableNames = ["x"];
    var n = t.windowSize,
        r = t.batchSize,
        o = t.inSize,
        a = Math.ceil(o / n);
    this.outputShape = [r, a];
    var i = "0.0",
        s = "";
    "prod" === e ? i = "1.0" : "min" === e ? (i = "1.0 / 1e-20", s = "min") : "max" === e && (i = "-1.0 / 1e-20", s = "max");
    var u = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
    "sum" === e ? u = "sumValue" : "prod" === e ? u = "prodValue" : "all" === e ? u = "allValue" : "any" === e && (u = "anyValue");
    var l = 4 * Math.floor(n / 4),
        c = n % 4,
        h = "\n      if (" + ("sum" === e) + ") {\n        sumValue += dot(values, ones);\n      } else if (" + ("prod" === e) + ") {\n        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);\n        prodValue *= tmp[0] * tmp[1];\n      } else {\n        minMaxValue = " + s + "(values, minMaxValue);\n      }\n    ",
        p = "vec4";
    "all" === e ? (i = "1.0", h = "\n        bool reducedAllValue = all(values);\n        float floatedReducedAllValue = float(reducedAllValue);\n        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);\n      ", p = "bvec4") : "any" === e && (i = "0.0", h = "\n        bool reducedAnyValue = any(values);\n        float floatedReducedAnyValue = float(reducedAnyValue);\n        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);\n      ", p = "bvec4");
    var f = "";
    o % n > 0 && (f = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      "), this.userCode = "\n      const float initializationValue = " + i + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + f + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + n + ";\n\n        vec4 minMaxValue = vec4(" + i + ");\n        float prodValue = 1.0;\n        float sumValue = 0.0;\n        float allValue = 1.0;\n        float anyValue = 0.0;\n\n        for (int i = 0; i < " + l + "; i += 4) {\n          int inIdx = inOffset + i;\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + h + "\n        }\n\n        int inIdx = inOffset + " + l + ";\n        if (" + (1 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (2 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (3 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          " + h + "\n        }\n        setOutput(" + u + ");\n      }\n    ";
  };
}(),
    di = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;

    for (var n = "", r = 0; r < 4; r++) {
      var o = "thisRC = rc;";
      r % 2 == 1 && (o += "thisRC.z += 1;"), r > 1 && (o += "thisRC.y += 1;"), n += "\n        " + o + "\n        " + (r > 0 ? "if(thisRC.y < rows && thisRC.z < cols){" : "") + "\n          int flatIndex = getFlatIndex(thisRC);\n\n          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);\n          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));\n\n          result[" + r + "] =\n            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);\n        " + (r > 0 ? "}" : "") + "\n      ";
    }

    this.userCode = "\n      \n    ivec3 inputCoordsFromReshapedOutCoords(int index) {\n      " + Co(["r", "c", "d"], e) + "\n      return ivec3(r, c, d);\n    }\n  \n      " + Ro(t) + "\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n\n        vec4 result = vec4(0.);\n\n        ivec3 thisRC;\n        int rows = " + t[1] + ";\n        int cols = " + t[2] + ";\n\n        " + n + "\n\n        setOutput(result);\n      }\n    ";
  };
}();

var vi = function () {
  return function (t, e, n) {
    this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
    var r = e.shape,
        o = r[1],
        a = r[2],
        i = t.shape,
        s = i[1],
        u = i[2],
        l = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
        c = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
        h = l[0] / c[0],
        p = l[1] / c[1],
        f = 1 / h,
        d = 1 / p,
        v = 2 * Math.ceil(f) + 2,
        m = 2 * Math.ceil(d) + 2;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + p + ");\n\n        const float invHeightScale = float(" + f + ");\n        const float invWidthScale = float(" + d + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + m + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(startRLerp - float(winHeight / 2));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(startCLerp - float(winWidth / 2));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float dxR = float(dyR) * heightScale;\n            int topDxRIndex = int(floor(dxR));\n            int bottomDxRIndex = int(min(ceil(dxR), " + (o - 1) + ".0));\n            float dxRLerp = dxR - float(topDxRIndex);\n            float inverseDxRLerp = 1.0 - dxRLerp;\n\n            float dxC = float(dyC) * widthScale;\n            int leftDxCIndex = int(floor(dxC));\n            int rightDxCIndex = int(min(ceil(dxC), " + (a - 1) + ".0));\n            float dxCLerp = dxC - float(leftDxCIndex);\n            float inverseDxCLerp = 1.0 - dxCLerp;\n\n            if (r == topDxRIndex && c == leftDxCIndex) {\n              // topLeft\n              accumulator +=\n                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;\n            }\n\n            if (r == topDxRIndex && c == rightDxCIndex) {\n              // topRight\n              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == leftDxCIndex) {\n              // bottomLeft\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == rightDxCIndex) {\n              // bottomRight\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
  };
}(),
    mi = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
    this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n        ivec2 sourceCeilRC = ivec2(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);\n        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);\n        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);\n        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n        float top = topLeft + (topRight - topLeft) * fracRC.y;\n        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n        float newValue = top + (bottom - top) * fracRC.x;\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    gi = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
    this.userCode = "\n      const vec3 effectiveInputOverOutputRatioRC = vec3(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ",\n          " + u[1] / l[1] + ");\n      const vec3 inputShapeRC = vec3(" + a + ".0, " + i + ".0,\n                                     " + i + ".0);\n\n      float getAValue(int b, int r, int c, int d) {\n        return getChannel(getA(b, r, c, d), vec2(c, d));\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        // Calculate values for next column in yRC.z.\n        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);\n\n        // Fractional source index.\n        vec3 sourceFracIndexRC = vec3(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec3 sourceFloorRC = ivec3(sourceFracIndexRC);\n        ivec3 sourceCeilRC = ivec3(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n        \n        // Should we calculate next column and row elements in 2x2 packed cell.\n        bool hasNextCol = d < " + (s - 1) + "; \n        bool hasNextRow = coords.z < " + (n - 1) + ";\n\n        // In parallel, construct four corners for all four components in\n        // packed 2x2 cell.\n        vec4 topLeft = vec4(\n          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 bottomLeft = vec4(\n          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 topRight = vec4(\n          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec4 bottomRight = vec4(\n          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);\n\n        vec4 top = mix(topLeft, topRight, fracRC.yyzz);\n        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);\n        vec4 newValue = mix(top, bottom, fracRC.x);\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    yi = function () {
  return function (t, e, n) {
    this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
    var r = e.shape,
        o = r[1],
        a = r[2],
        i = t.shape,
        s = i[1],
        u = i[2],
        l = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
        c = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
        h = l[0] / c[0],
        p = l[1] / c[1],
        f = 1 / h,
        d = 1 / p,
        v = 2 * Math.ceil(f) + 2,
        m = 2 * Math.ceil(d) + 2;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + p + ");\n\n        const float invHeightScale = float(" + f + ");\n        const float invWidthScale = float(" + d + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + m + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(floor(startRLerp - float(winHeight / 2)));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(floor(startCLerp - float(winWidth / 2)));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float sourceFracRow =\n              float(" + l[0] + ") *\n                (float(dyR) / float(" + c[0] + "));\n\n            float sourceFracCol =\n                float(" + l[1] + ") *\n                  (float(dyC) / float(" + c[1] + "));\n\n            int sourceNearestRow = int(min(\n                float(int(" + o + ") - 1),\n                " + n + " ? float(round(sourceFracRow)) :\n                                  float(floor(sourceFracRow))));\n\n            int sourceNearestCol = int(min(\n                float(int(" + a + ") - 1),\n                " + n + " ? float(round(sourceFracCol)) :\n                                  float(floor(sourceFracCol))));\n\n            if (r == sourceNearestRow && c == sourceNearestCol) {\n              accumulator += getDy(b, dyR, dyC, d);\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
  };
}(),
    xi = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n],
        c = r ? "0.5" : "0.0";
    this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the coordinators of nearest neighbor point.\n        ivec2 sourceNearestRC = ivec2(\n          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + " + c + ")));\n\n        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    wi = function () {
  return function (t, e) {
    this.variableNames = ["x"];
    var n = t.length;
    if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");

    if (this.outputShape = t, 1 !== n) {
      var r = t.map(function (n, r) {
        return function (n) {
          return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - coords[" + n + "] - 1" : "coords[" + n + "]";
        }(r);
      }).join(","),
          o = Mo(n);
      this.userCode = "\n      void main() {\n        " + o + " coords = getOutputCoords();\n        setOutput(getX(" + r + "));\n      }\n    ";
    } else this.userCode = "\n        void main() {\n          int coord = getOutputCoords();\n          setOutput(getX(" + t[0] + " - coord - 1));\n        }\n      ";
  };
}(),
    bi = function () {
  return function (t, e) {
    this.variableNames = ["x"], this.usesPackedTextures = !0;
    var n = t.length;
    if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");
    this.outputShape = t;
    var r = wo("rc", n),
        o = r[n - 1] + " + 1 < " + this.outputShape[n - 1],
        a = r[n - 2] + " + 1 < " + this.outputShape[n - 2],
        i = Mo(n);

    function s(n) {
      var r = t.map(function (r, o) {
        return function (n, r) {
          return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - " + r[n] + " - 1" : "" + r[n];
        }(o, n);
      });
      return "getChannel(getX(" + r.join(",") + "), vec2(" + r.slice(-2).join(",") + "))";
    }

    this.userCode = 1 === n ? "\n        void main(){\n          int rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = getChannel(getX(" + t[0] + " - rc - 1),\n            " + t[0] + " - rc - 1);\n          if(" + o + "){\n              result.g = getChannel(getX(" + t[0] + " - (rc  + 1) - 1),\n                " + t[0] + " - (rc  + 1) - 1);\n          }\n          setOutput(result);\n        }\n      " : "\n        void main() {\n          " + i + " rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = " + function (t) {
      return s(t);
    }(r.slice()) + ";\n          if(" + o + "){\n            result.g = " + function (t) {
      return t[n - 1] = "(" + t[n - 1] + " + 1)", s(t);
    }(r.slice()) + ";\n          }\n          if(" + a + ") {\n            result.b = " + function (t) {
      return t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
    }(r.slice()) + ";\n            if(" + o + ") {\n              result.a = " + function (t) {
      return t[n - 1] = "(" + t[n - 1] + " + 1)", t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
    }(r.slice()) + ";\n            }\n          }\n          setOutput(result);\n        }\n    ";
  };
}(),
    Ci = function () {
  return function (t, e, n, r, o, a, i) {
    void 0 === i && (i = !0), this.variableNames = ["updates", "indices", "defaultValue"], this.outputShape = a;
    var s = Mo(o.length),
        u = Mo(a.length),
        l = "";
    1 === n ? l = "i" : 2 === n && (l = "i, j");
    var c = "getIndices(" + l + ")",
        h = "";
    1 === r ? h = "i" : 2 === r && (h = "i, coords[1]");
    var p = "getUpdates(" + h + ")",
        f = e > 1 ? "strides[j]" : "strides";
    this.userCode = "\n        " + s + " strides = " + s + "(" + o + ");\n\n        void main() {\n          " + u + " coords = getOutputCoords();\n          float sum = 0.0;\n          bool found = false;\n          for (int i = 0; i < " + t + "; i++) {\n            int flattenedIndex = 0;\n            for (int j = 0; j < " + e + "; j++) {\n              int index = round(" + c + ");\n              flattenedIndex += index * " + f + ";\n            }\n            if (flattenedIndex == coords[0]) {\n              sum += " + p + ";\n              found = true;\n            }\n          }\n          setOutput(mix(getDefaultValue(), sum, float(found)));\n        }\n      ";
  };
}(),
    Ei = function () {
  return function (t, e) {
    this.variableNames = ["x", "segmentIds"];
    var n = t.windowSize,
        r = t.batchSize,
        o = t.inSize,
        a = t.numSegments,
        i = a * Math.ceil(o / n);
    this.outputShape = [r, i];
    var s = 4 * Math.floor(n / 4),
        u = n % 4,
        l = "\n        sumValue += dot(values, segFilter);\n    ",
        c = "";
    o % n > 0 && (c = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      ");
    var h = "";
    o % n > 0 && (h = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return -1.0;\n        }\n      "), this.userCode = "\n      const float initializationValue = 0.0;\n\n      float getValue(int batch, int inIdx) {\n        " + c + "\n        return getX(batch, inIdx);\n      }\n\n      float getSegmentIdAtIndex(int inIdx) {\n        " + h + "\n        return getSegmentIds(inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = int(floor(float(outIdx) / float(\n          " + a + ")) * float(" + n + "));\n        int currentSeg = int(mod(float(outIdx), float(" + a + ")));\n\n        float sumValue = 0.0;\n\n        for (int i = 0; i < " + s + "; i += 4) {\n          int inIdx = inOffset + i;\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0\n          );\n\n          " + l + "\n        }\n\n        int inIdx = inOffset + " + s + ";\n        if (" + (1 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            0,\n            0,\n            0\n          );\n\n          " + l + "\n        } else if (" + (2 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n              0,\n              0\n          );\n\n          " + l + "\n        } else if (" + (3 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            0\n          );\n\n          " + l + "\n        }\n        setOutput(sumValue);\n      }\n    ";
  };
}(),
    Ri = function () {
  return function (t, e, n) {
    var r, o;
    if (this.variableNames = ["c", "a", "b"], this.outputShape = e, n > 4) throw Error("Where for rank " + n + " is not yet supported");
    if (1 === n) o = "resRC", r = "resRC";else {
      for (var a = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], i = [], s = [], u = 0; u < e.length; u++) s.push("" + a[u]), u < t && i.push("" + a[u]);

      r = i.join(), o = s.join();
    }
    var l = Mo(n);
    this.userCode = "\n      void main() {\n        " + l + " resRC = getOutputCoords();\n        float cVal = getC(" + r + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + o + "));\n        } else {\n          setOutput(getB(" + o + "));\n        }\n      }\n    ";
  };
}(),
    Ii = function () {
  function t(t) {
    this.variableNames = ["source"], this.outputShape = t, this.rank = t.length;

    var e,
        n = Mo(this.rank),
        r = "uniform int start[" + this.rank + "];",
        o = function (t) {
      if (1 === t) return "sourceLoc";
      if (t <= 6) return Si.slice(0, t).map(function (t) {
        return "sourceLoc." + t;
      }).join(",");
      throw Error("Slicing for rank " + t + " is not yet supported");
    }(this.rank);

    e = "\n        " + n + " sourceLoc;\n        " + n + " coords = getOutputCoords();\n        " + t.map(function (t, e) {
      return "sourceLoc." + Si[e] + " = start[" + e + "] + coords." + Si[e] + ";";
    }).join("\n") + "\n      ", this.userCode = "\n      " + r + "\n      void main() {\n        " + e + "\n        setOutput(getSource(" + o + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    Si = ["x", "y", "z", "w", "u", "v"];

var Ni = function () {
  function t(t) {
    this.variableNames = ["source"], this.usesPackedTextures = !0, this.outputShape = t, this.rank = t.length;
    var e = Mo(this.rank),
        n = wo("coords", this.rank),
        r = wo("sourceLoc", this.rank),
        o = 1 === this.rank ? "sourceLoc" : "vec2(" + r.slice(-2).join() + ")",
        a = "getChannel(getSource(" + r.join() + "), " + o + ")",
        i = "\n      result.x = " + a + ";\n      if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n        ++" + r[this.rank - 1] + ";\n        result.y = " + a + ";\n        --" + r[this.rank - 1] + ";\n      }\n    ",
        s = 1 === this.rank ? "" : "\n      --" + n[this.rank - 1] + ";\n      if (++" + n[this.rank - 2] + " < " + t[this.rank - 2] + ") {\n        ++" + r[this.rank - 2] + ";\n        result.z = " + a + ";\n        if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n          ++" + r[this.rank - 1] + ";\n          result.w = " + a + ";\n        }\n      }\n    ",
        u = this.rank <= 4 ? "sourceLoc = coords +\n            " + e + "(" + t.map(function (t, e) {
      return "start[" + e + "]";
    }).join() + ");" : t.map(function (t, e) {
      return r[e] + " = " + n[e] + " + start[" + e + "];";
    }).join("\n");
    this.userCode = "\n      uniform int start[" + this.rank + "];\n      void main() {\n        " + e + " coords = getOutputCoords();\n        " + e + " sourceLoc;\n        " + u + " \n        vec4 result = vec4(0.);\n        " + i + "\n        " + s + "\n        setOutput(result);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    ki = function () {
  return function (t, e, n, r) {
    this.variableNames = ["x"];
    var o = n.filter(function (t, e) {
      return -1 === r.indexOf(e);
    });
    this.outputShape = o;
    var a = n.length,
        i = Mo(n.length),
        s = Mo(o.length),
        u = "";
    if (1 === a) u = "coords * strides + begin";else {
      var l = 0;
      u = n.map(function (t, e) {
        return -1 === r.indexOf(e) ? (l++, 1 === o.length ? "coords * strides[" + e + "] + begin[" + e + "]" : "coords[" + (l - 1) + "] * strides[" + e + "] + begin[" + e + "]") : "begin[" + e + "]";
      }).join(",");
    }
    this.userCode = "\n      " + i + " begin = " + i + "(" + t + ");\n      " + i + " strides = " + i + "(" + e + ");\n\n      void main() {\n        " + s + " coords = getOutputCoords();\n        setOutput(getX(" + u + "));\n      }\n    ";
  };
}(),
    Ai = function () {
  function t(t) {
    this.gpgpu = t, this.numUsedTextures = 0, this.numFreeTextures = 0, this.freeTextures = {}, this.logEnabled = !1, this.usedTextures = {};
  }

  return t.prototype.acquireTexture = function (t, e, n) {
    var r,
        o = Ti(e, n),
        a = Di(t, o, n);

    if (a in this.freeTextures || (this.freeTextures[a] = []), a in this.usedTextures || (this.usedTextures[a] = []), this.freeTextures[a].length > 0) {
      this.numFreeTextures--, this.numUsedTextures++, this.log();
      var i = this.freeTextures[a].shift();
      return this.usedTextures[a].push(i), i;
    }

    return this.numUsedTextures++, this.log(), o === Ia.PACKED_2X2_FLOAT32 ? r = this.gpgpu.createPackedMatrixTexture(t[0], t[1]) : o === Ia.PACKED_2X2_FLOAT16 ? r = this.gpgpu.createFloat16PackedMatrixTexture(t[0], t[1]) : o === Ia.UNPACKED_FLOAT32 ? r = this.gpgpu.createFloat32MatrixTexture(t[0], t[1]) : o === Ia.UNPACKED_FLOAT16 ? r = this.gpgpu.createFloat16MatrixTexture(t[0], t[1]) : o === Ia.PACKED_4X1_UNSIGNED_BYTE && (r = this.gpgpu.createUnsignedBytesMatrixTexture(t[0], t[1])), this.usedTextures[a].push(r), r;
  }, t.prototype.releaseTexture = function (t, e, n, r) {
    if (null != this.freeTextures) {
      var o = Di(e, Ti(n, r), r);
      o in this.freeTextures || (this.freeTextures[o] = []), this.freeTextures[o].push(t), this.numFreeTextures++, this.numUsedTextures--;
      var a = this.usedTextures[o],
          i = a.indexOf(t);
      if (i < 0) throw new Error("Cannot release a texture that was never provided by this texture manager");
      a.splice(i, 1), this.log();
    }
  }, t.prototype.log = function () {
    if (this.logEnabled) {
      var t = this.numFreeTextures + this.numUsedTextures;
      console.log("Free/Used", this.numFreeTextures + " / " + this.numUsedTextures, "(" + t + ")");
    }
  }, t.prototype.getNumUsedTextures = function () {
    return this.numUsedTextures;
  }, t.prototype.getNumFreeTextures = function () {
    return this.numFreeTextures;
  }, t.prototype.dispose = function () {
    var t = this;

    if (null != this.freeTextures) {
      for (var e in this.freeTextures) this.freeTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      for (var e in this.usedTextures) this.usedTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      this.freeTextures = null, this.usedTextures = null, this.numUsedTextures = 0, this.numFreeTextures = 0;
    }
  }, t;
}();

function Ti(t, e) {
  if (t === Ra.UPLOAD) return Ia.PACKED_2X2_FLOAT32;
  if (t === Ra.RENDER || null == t) return e ? a.getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? Ia.PACKED_2X2_FLOAT32 : Ia.PACKED_2X2_FLOAT16 : a.getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? Ia.UNPACKED_FLOAT32 : Ia.UNPACKED_FLOAT16;
  if (t === Ra.DOWNLOAD || t === Ra.PIXELS) return Ia.PACKED_4X1_UNSIGNED_BYTE;
  throw new Error("Unknown logical texture type " + t);
}

function Di(t, e, n) {
  return t[0] + "_" + t[1] + "_" + e + "_" + n;
}

var _i = function () {
  return function (t, e) {
    this.variableNames = ["A"];

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[r] * e[r];

    this.outputShape = n, this.rank = n.length;

    var o = Mo(this.rank),
        a = function (t) {
      var e = t.length;
      if (e > 5) throw Error("Tile for rank " + e + " is not yet supported");
      if (1 === e) return "imod(resRC, " + t[0] + ")";

      for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u"], r = [], o = 0; o < t.length; o++) r.push("imod(" + n[o] + ", " + t[o] + ")");

      return r.join();
    }(t);

    this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
  };
}();

var Oi = function () {
  return function (t, e) {
    this.variableNames = ["A"];

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

    this.outputShape = n, this.rank = n.length;

    var o = Mo(this.rank),
        a = function (t) {
      var e = t.length;
      if (e > 6) throw Error("Transpose for rank " + e + " is not yet supported");

      for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u", "resRC.v"], r = new Array(e), o = 0; o < t.length; o++) r[t[o]] = n[o];

      return r.join();
    }(e);

    this.userCode = "\n    void main() {\n      " + o + " resRC = getOutputCoords();\n      setOutput(getA(" + a + "));\n    }\n    ";
  };
}();

var Mi = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0;

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

    if (this.outputShape = n, this.rank = n.length, this.rank > 6) throw Error("Packed transpose for rank " + this.rank + " is not yet supported.");
    var o = Mo(this.rank),
        a = xo("rc", this.rank),
        i = new Array(this.rank);

    for (r = 0; r < e.length; r++) i[e[r]] = a[r];

    var s = "vec2(" + i.slice(-2).join() + ")",
        u = "++" + a[this.rank - 1] + " < " + n[this.rank - 1],
        l = "getChannel(getA(" + i.join() + "), " + s + ")";
    this.userCode = "\n    void main() {\n      " + o + " rc = getOutputCoords();\n      vec4 result = vec4(0.);\n      result[0] = " + l + ";\n      if(" + u + ") {\n        result[1] = " + l + ";\n      }\n      --" + a[this.rank - 1] + ";\n      if(++" + a[this.rank - 2] + " < " + n[this.rank - 2] + ") {\n        result[2] = " + l + ";\n        if(" + u + ") {\n          result[3] = " + l + ";\n        }\n      }  \n      setOutput(result);\n    }\n    ";
  };
}(),
    Fi = 1.7580993408473768,
    Bi = 1.0507009873554805,
    Pi = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      float unaryOperation(float x) {\n        " + e + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
  };
}(),
    Li = "if (isnan(x)) return x;",
    Wi = "return x;",
    Ui = Li + "\n  return (x < 0.0) ? 0.0 : x;\n",
    zi = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + Fi + ";\n  float scale = " + Bi + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";

var Vi = "return exp(x);",
    Gi = Li + "\n  return sin(x);\n",
    qi = Li + "\n  return cos(x);\n",
    Hi = Li + "\n  return atan(x);\n",
    $i = Li + "\n  if (x < 1.0) return NAN;\n  return log(x + sqrt(x * x - 1.0));",
    ji = Li + "\n  if ((x < -1.0) || (x > 1.0)) return NAN;\n  return (log(1.0 + x) - log(1.0 - x)) / 2.0;",
    Ki = "return x;",
    Xi = "\n  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));\n  bvec4 isNaN = isnan(x);\n\n  result.r = isNaN.r ? x.r : result.r;\n  result.g = isNaN.g ? x.g : result.g;\n  result.b = isNaN.b ? x.b : result.b;\n  result.a = isNaN.a ? x.a : result.a;\n\n  return result;\n",
    Yi = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t, this.userCode = "\n      vec4 unaryOperation(vec4 x) {\n        " + e + "\n      }\n\n      void main() {\n        vec4 x = getAAtOutCoords();\n        vec4 y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
  };
}(),
    Qi = function () {
  return function (t) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;

    var e = t.length,
        n = wo("rc", e),
        r = Mo(e),
        o = function (t, e) {
      if (1 === t) return "rc";

      for (var n = "", r = 0; r < t; r++) n += e[r], r < t - 1 && (n += ",");

      return n;
    }(e, n),
        a = n.slice(-2),
        i = e <= 1 ? "rc" : "vec2(" + a.join(",") + ")";

    this.userCode = "\n      void main() {\n        " + r + " rc = getOutputCoords();\n        vec4 packedInput = getA(" + o + ");\n\n        setOutput(getChannel(packedInput, " + i + "));\n      }\n    ";
  };
}(),
    Ji = {};

var Zi = 600;

var ts = function () {
  function t(t) {
    if (this.gpgpu = t, this.pendingRead = new WeakMap(), this.pendingDisposal = new WeakSet(), this.dataRefCount = new WeakMap(), this.numBytesInGPU = 0, this.uploadWaitMs = 0, this.downloadWaitMs = 0, this.warnedAboutMemory = !1, this.disposed = !1, !a.getBool("HAS_WEBGL")) throw new Error("WebGL is not supported on this device");

    if (null == t) {
      var e = Mt(a.getNumber("WEBGL_VERSION"));
      this.binaryCache = (n = a.getNumber("WEBGL_VERSION")) in Ji ? Ji[n] : (Ji[n] = {}, Ji[n]), this.gpgpu = new Za(e), this.canvas = e.canvas, this.gpgpuCreatedLocally = !0;
    } else this.binaryCache = {}, this.gpgpuCreatedLocally = !1, this.canvas = t.gl.canvas;

    var n;
    this.textureManager = new Ai(this.gpgpu), this.numMBBeforeWarning = null == a.global.screen ? 1024 : a.global.screen.height * a.global.screen.width * window.devicePixelRatio * Zi / 1024 / 1024, this.texData = new Qn(this, At);
  }

  return t.prototype.register = function (t, e, n) {
    if (this.texData.has(t)) throw new Error("Data buffer is already registered");
    this.texData.set(t, {
      shape: e,
      dtype: n
    });
  }, t.prototype.fromPixels = function (t, e) {
    if (null == t) throw new Error("pixels passed to tf.browser.fromPixels() can not be null");
    var n = [t.height, t.width],
        r = [t.height, t.width, e];

    if (a.getBool("IS_BROWSER")) {
      if (!(t instanceof HTMLVideoElement || t instanceof HTMLImageElement || t instanceof HTMLCanvasElement || t instanceof ImageData || t.data instanceof Uint8Array)) throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData or {data: Uint32Array, width: number, height: number}, but was " + t.constructor.name);

      if (t instanceof HTMLVideoElement) {
        if (null == this.fromPixels2DContext) {
          if ("complete" !== document.readyState) throw new Error("The DOM is not ready yet. Please call tf.browser.fromPixels() once the DOM is ready. One way to do that is to add an event listener for `DOMContentLoaded` on the document object");
          this.fromPixels2DContext = document.createElement("canvas").getContext("2d");
        }

        this.fromPixels2DContext.canvas.width = t.width, this.fromPixels2DContext.canvas.height = t.height, this.fromPixels2DContext.drawImage(t, 0, 0, t.width, t.height), t = this.fromPixels2DContext.canvas;
      }
    }

    var o,
        i,
        s = this.makeTensorHandle(n, "int32");

    if (this.texData.get(s.dataId).usage = Ra.PIXELS, this.gpgpu.uploadPixelDataToTexture(this.getTexture(s.dataId), t), a.getBool("WEBGL_PACK")) {
      o = new Ca(r);
      var u = this.makePackedTensor(o.outputShape, s.dtype);
      i = this.compileAndRun(o, [s], u);
    } else o = new ba(r), i = this.compileAndRun(o, [s]);

    return this.disposeData(s.dataId), i;
  }, t.prototype.makeTensorHandle = function (t, e) {
    var n = {};
    return this.register(n, t, e), {
      dataId: n,
      shape: t,
      dtype: e
    };
  }, t.prototype.write = function (t, e) {
    if (null == e) throw new Error("MathBackendWebGL.write(): values can not be null");
    if (a.getBool("DEBUG")) for (var n = 0; n < e.length; n++) {
      var r = e[n];
      if (!Lt(r)) throw Error("The value " + r + " cannot be represented on this device.");
    }
    var o = this.texData.get(t);
    if ("complex64" === o.dtype) throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");
    this.releaseGPUData(t), o.usage = Ra.UPLOAD, o.values = e;
  }, t.prototype.readSync = function (t) {
    var e = this.texData.get(t),
        n = e.values,
        r = e.dtype,
        o = e.complexTensors,
        a = e.slice,
        i = e.shape;

    if (null != a) {
      var s = new Pi(i, "return x;"),
          u = this.compileAndRun(s, [{
        dataId: t,
        shape: i,
        dtype: r
      }]),
          l = this.readSync(u.dataId);
      return u.dispose(), l;
    }

    if (null != n) return this.convertAndCacheOnCPU(t);
    if ("string" === r) return n;
    var c,
        h,
        p = null != this.activeTimers;
    (p && (c = performance.now()), "complex64" === r) ? h = mr(o.real.dataSync(), o.imag.dataSync()) : h = this.getValuesFromTexture(t);
    return p && (this.downloadWaitMs += performance.now() - c), this.convertAndCacheOnCPU(t, h);
  }, t.prototype.read = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r, i, s, u, l, c, h, p, f, d, v, m, g, x, w, b, C, E, R, I, S, N, k, A, T, D;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (this.pendingRead.has(t)) return r = this.pendingRead.get(t), [2, new Promise(function (t) {
              return r.push(t);
            })];
            if (i = this.texData.get(t), s = i.texture, u = i.values, l = i.texShape, c = i.isPacked, h = i.shape, p = i.slice, f = i.dtype, d = i.complexTensors, null != p) return v = new Pi(h, "return x;"), m = this.compileAndRun(v, [{
              dataId: t,
              shape: h,
              dtype: f
            }]), g = this.read(m.dataId), m.dispose(), [2, g];
            if (null != u) return [2, this.convertAndCacheOnCPU(t)];
            if (this.pendingRead.set(t, []), !a.getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED") && 2 === a.getNumber("WEBGL_VERSION")) throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");
            return x = null, "complex64" === f ? [3, 2] : (w = l[1], b = l[0], c && (e = Ta(l[0], l[1]), w = e[0], b = e[1]), a.get("WEBGL_BUFFER_SUPPORTED") && (x = this.gpgpu.createBufferFromTexture(s, b, w)), [4, this.gpgpu.createAndWaitForFence()]);

          case 1:
            o.sent(), o.label = 2;

          case 2:
            return "complex64" !== f ? [3, 4] : [4, Promise.all([d.real.data(), d.imag.data()])];

          case 3:
            return E = o.sent(), R = E[0], I = E[1], C = mr(R, I), [3, 5];

          case 4:
            null == x ? C = this.getValuesFromTexture(t) : (S = y(h), c ? (N = he(h), k = 1, A = 1, h.length && (n = pe(h), k = n[0], A = n[1]), C = this.gpgpu.downloadPackedMatrixFromBuffer(x, N, k, A, l[0], l[1]).subarray(0, S)) : C = this.gpgpu.downloadFloat32MatrixFromBuffer(x, l[0], l[1]).subarray(0, S)), o.label = 5;

          case 5:
            return T = this.convertAndCacheOnCPU(t, C), D = this.pendingRead.get(t), this.pendingRead.delete(t), D.forEach(function (t) {
              return t(T);
            }), this.pendingDisposal.has(t) && (this.pendingDisposal.delete(t), this.disposeData(t)), [2, T];
        }
      });
    });
  }, t.prototype.getValuesFromTexture = function (t) {
    var e,
        n = this,
        r = this.texData.get(t),
        o = r.shape,
        i = r.dtype,
        s = r.texture,
        u = r.texShape,
        l = y(o);

    if (a.getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")) {
      if (this.texData.get(t).isPacked) {
        var c = he(o),
            h = 1,
            p = 1;
        return o.length && (h = (e = pe(o))[0], p = e[1]), this.gpgpu.downloadMatrixFromPackedTexture(s, c, h, p, u[0], u[1]).subarray(0, l);
      }

      return this.gpgpu.downloadFloat32MatrixFromOutputTexture(s, u[0], u[1]).subarray(0, l);
    }

    var f = this.makeTensorHandle(o, "float32");
    f.size = y(o), this.texData.get(f.dataId).usage = Ra.DOWNLOAD;
    var d = Oe(function () {
      var e = new da(o);
      return n.compileAndRun(e, [{
        shape: o,
        dtype: i,
        dataId: t
      }], f, null);
    }),
        v = this.texData.get(d.dataId),
        m = this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(v.texture, v.texShape[0], v.texShape[1]).subarray(0, l);
    return this.disposeData(f.dataId), m;
  }, t.prototype.time = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r, a, i, s, u;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return e = this.activeTimers, n = [], r = !1, null == this.programTimersStack ? (this.programTimersStack = n, r = !0) : this.activeTimers.push(n), this.activeTimers = n, t(), a = g(this.activeTimers.map(function (t) {
              return t.query;
            })).filter(function (t) {
              return null != t;
            }), i = g(this.activeTimers.map(function (t) {
              return t.name;
            })).filter(function (t) {
              return null != t;
            }), this.activeTimers = e, r && (this.programTimersStack = null), [4, Promise.all(a)];

          case 1:
            return s = o.sent(), u = {
              uploadWaitMs: this.uploadWaitMs,
              downloadWaitMs: this.downloadWaitMs,
              kernelMs: f(s),
              getExtraProfileInfo: function () {
                return s.map(function (t, e) {
                  return {
                    name: i[e],
                    ms: t
                  };
                }).map(function (t) {
                  return t.name + ": " + t.ms;
                }).join(", ");
              },
              wallMs: null
            }, this.uploadWaitMs = 0, this.downloadWaitMs = 0, [2, u];
        }
      });
    });
  }, t.prototype.memory = function () {
    return {
      unreliable: !1,
      numBytesInGPU: this.numBytesInGPU
    };
  }, t.prototype.startTimer = function () {
    return a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? this.gpgpu.beginQuery() : {
      startMs: performance.now(),
      endMs: null
    };
  }, t.prototype.endTimer = function (t) {
    return a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? (this.gpgpu.endQuery(), t) : (t.endMs = performance.now(), t);
  }, t.prototype.getQueryTime = function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        return a.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? [2, this.gpgpu.waitForQueryAndGetTime(t)] : [2, (e = t).endMs - e.startMs];
      });
    });
  }, t.prototype.disposeData = function (t) {
    if (!this.pendingDisposal.has(t)) if (this.pendingRead.has(t)) this.pendingDisposal.add(t);else if (this.texData.has(t)) {
      this.releaseGPUData(t);
      var e = this.texData.get(t).complexTensors;
      null != e && (e.real.dispose(), e.imag.dispose()), this.texData.delete(t);
    }
  }, t.prototype.releaseGPUData = function (t) {
    var e = this.texData.get(t),
        n = e.texture,
        r = e.dtype,
        o = e.texShape,
        a = e.usage,
        i = e.isPacked,
        s = e.slice,
        u = s && s.origDataId || t,
        l = this.dataRefCount.get(u);
    l > 1 ? this.dataRefCount.set(u, l - 1) : (this.dataRefCount.delete(u), null != n && (this.numBytesInGPU -= this.computeBytes(o, r), this.textureManager.releaseTexture(n, o, a, i)));
    var c = this.texData.get(t);
    c.texture = null, c.texShape = null, c.isPacked = !1, c.slice = null;
  }, t.prototype.getTexture = function (t) {
    return this.uploadToGPU(t), this.texData.get(t).texture;
  }, t.prototype.getCPUBackend = function () {
    return a.getBool("WEBGL_CPU_FORWARD") ? (null == this.cpuBackend && (this.cpuBackend = At.findBackend("cpu")), this.cpuBackend) : null;
  }, t.prototype.shouldExecuteOnCPU = function (t, e) {
    var n = this;
    return void 0 === e && (e = 128), null != this.getCPUBackend() && t.every(function (t) {
      return null == n.texData.get(t.dataId).texture && t.size < e;
    });
  }, t.prototype.getGPGPUContext = function () {
    return this.gpgpu;
  }, t.prototype.getCanvas = function () {
    return this.canvas;
  }, t.prototype.complex = function (t, e) {
    var n = this.makeOutputArray(t.shape, "complex64");
    return this.texData.get(n.dataId).complexTensors = {
      real: At.keep(t.clone()),
      imag: At.keep(e.clone())
    }, n;
  }, t.prototype.real = function (t) {
    return this.texData.get(t.dataId).complexTensors.real.clone();
  }, t.prototype.imag = function (t) {
    return this.texData.get(t.dataId).complexTensors.imag.clone();
  }, t.prototype.slice = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.slice(t, e, n);
    if (0 === y(n)) return Bn([], n, t.dtype);
    var r = this.texData.get(t.dataId).isPacked,
        o = gn(t.shape, e, n);

    if (r || !o) {
      var i = a.getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Ni(n) : new Ii(n),
          s = i.getCustomSetupFunc(e);
      return this.compileAndRun(i, [t], null, s);
    }

    return this.uploadToGPU(t.dataId), this.shallowSlice(t, e, n);
  }, t.prototype.shallowSlice = function (t, e, n) {
    var r = this.texData.get(t.dataId),
        o = ht.make(n, {}, t.dtype, this),
        a = this.texData.get(o.dataId);
    Object.assign(a, r), a.shape = n, a.dtype = t.dtype;
    var i = yn(e, t.strides);
    r.slice && (i += r.slice.flatOffset), a.slice = {
      flatOffset: i,
      origDataId: r.slice && r.slice.origDataId || t.dataId
    };
    var s = this.dataRefCount.get(a.slice.origDataId) || 1;
    return this.dataRefCount.set(a.slice.origDataId, s + 1), o;
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s, u) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.stridedSlice(t, e, n, r, o, a, i, s, u);
    var l = dn(t.shape, e, n, r, o, a, i, s, u),
        c = l[0],
        h = l[1],
        p = l[2],
        f = h.filter(function (t, e) {
      return -1 === p.indexOf(e);
    });
    if (f.some(function (t) {
      return 0 === t;
    })) return Bn([], f);
    var d = new ki(c, r, h, p);
    return this.compileAndRun(d, [t]);
  }, t.prototype.reverse = function (t, e) {
    var n = a.getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new bi(t.shape, e) : new wi(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, t.prototype.concat = function (t, e) {
    if (this.shouldExecuteOnCPU(t)) return this.cpuBackend.concat(t, e);
    if (1 === t.length) return t[0];

    if (t.length > a.getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var n = Math.floor(t.length / 2),
          r = this.concat(t.slice(0, n), e),
          o = this.concat(t.slice(n), e);
      return this.concat([r, o], e);
    }

    if (a.getBool("WEBGL_PACK_ARRAY_OPERATIONS") && t[0].rank > 1) {
      var i = new Zo(t.map(function (t) {
        return t.shape;
      }), e);
      return this.compileAndRun(i, t);
    }

    var s = un(t.map(function (t) {
      return t.shape;
    }), e),
        u = t.map(function (t) {
      return t.as2D(-1, y(t.shape.slice(e)));
    }),
        l = new Jo(u.map(function (t) {
      return t.shape;
    }));
    return this.compileAndRun(l, u).reshape(s);
  }, t.prototype.neg = function (t) {
    var e = new Pi(t.shape, "return -x;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    var o = n ? t.shape[2] : t.shape[1],
        a = r ? e.shape[1] : e.shape[2],
        i = n ? t.shape[1] : t.shape[2],
        s = t.shape[0];

    if ((1 === o || 1 === a) && i > 1e3) {
      n && (t = t.transpose([0, 2, 1])), r && (e = e.transpose([0, 2, 1]));
      var u = 1 === a ? t : t.as3D(s, i, 1),
          l = 1 === a ? 2 : 1,
          c = 1 === a ? e.as3D(s, 1, i) : e;
      return this.multiply(u, c).sum(l, !0);
    }

    var h = wt(t.dtype, e.dtype),
        p = new ii(t.shape, [s, o, a], n, r),
        f = this.makePackedTensor(p.outputShape, h);
    return this.compileAndRun(p, [t, e], f);
  }, t.prototype.fusedBatchMatMul = function (t, e, n, r, o, a) {
    var i = n ? t.shape[2] : t.shape[1],
        s = r ? e.shape[1] : e.shape[2],
        u = t.shape[0],
        l = wt(t.dtype, e.dtype),
        c = new ii(t.shape, [u, i, s], n, r, !!o, a ? function (t, e) {
      if (void 0 === e && (e = !1), "linear" === t) return e ? Ki : Wi;
      if ("relu" === t) return e ? Xi : Ui;
      throw new Error("Activation " + t + " has not been implemented for the WebGL backend.");
    }(a, !0) : null),
        h = this.makePackedTensor(c.outputShape, l),
        p = [t, e];
    return o && p.push(o), this.compileAndRun(c, p, h);
  }, t.prototype.multiply = function (t, e) {
    if ("complex64" === t.dtype) {
      var n = this.texData.get(t.dataId),
          r = this.texData.get(e.dataId),
          o = new Go(zo, t.shape, e.shape),
          i = new Go(Vo, t.shape, e.shape),
          s = [this.makeComplexComponentTensorHandle(t, n.complexTensors.real), this.makeComplexComponentTensorHandle(t, n.complexTensors.imag), this.makeComplexComponentTensorHandle(e, r.complexTensors.real), this.makeComplexComponentTensorHandle(e, r.complexTensors.imag)],
          u = this.compileAndRun(o, s),
          l = this.compileAndRun(i, s),
          c = this.complex(u, l);
      return u.dispose(), l.dispose(), c;
    }

    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.multiply(t, e);
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, $o, t.dtype);
    var h = new jo($o, t.shape, e.shape),
        p = this.makeOutputArray(h.outputShape, t.dtype);
    return this.compileAndRun(h, [t, e], p);
  }, t.prototype.batchNormalization = function (t, e, n, r, o, i) {
    var s = [t, e, n],
        u = null;
    null != i && (u = i.shape, s.push(i));
    var l = null;

    if (null != o && (l = o.shape, s.push(o)), a.getBool("WEBGL_PACK_NORMALIZATION")) {
      var c = new Uo(t.shape, e.shape, n.shape, u, l, r);
      return this.compileAndRun(c, s);
    }

    var h = new Wo(t.shape, e.shape, n.shape, u, l, r);
    return this.compileAndRun(h, s);
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    var i = a.getBool("WEBGL_PACK_NORMALIZATION") ? new oi(t.shape, e, n, r, o) : new ni(t.shape, e, n, r, o);
    return this.compileAndRun(i, [t]);
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    var s = new ri(e.shape, r, o, a, i);
    return this.compileAndRun(s, [e, n, t]);
  }, t.prototype.tile = function (t, e) {
    var n = new _i(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, t.prototype.pad = function (t, e, n) {
    var r = a.getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new hi(t.shape, e, n) : new ci(t.shape, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.transpose = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.transpose(t, e);
    var n = a.getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Mi(t.shape, e) : new Oi(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, t.prototype.gather = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.gather(t, e, n);
    var r = new Ea(t.shape, e.size, n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    d(t.rank <= 4, function () {
      return "batchToSpaceND for rank > 4 with a WebGL backend not implemented yet";
    });
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = je(t.shape, e, r),
        a = Ke(o.length, e.length),
        i = Xe(t.shape, e, r),
        s = Ye(n, e.length),
        u = Qe(i, n, e.length);
    return t.reshape(o).transpose(a).reshape(i).slice(s, u);
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    d(t.rank <= 4, function () {
      return "spaceToBatchND for rank > 4 with a WebGL backend not implemented yet";
    });
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = je(i.shape, e, r, !1),
        u = Ke(s.length, e.length, !1),
        l = Xe(i.shape, e, r, !1);
    return i.reshape(s).transpose(u).reshape(l);
  }, t.prototype.reduce = function (t, e, n) {
    var r = t.shape[0],
        o = t.shape[1],
        a = hn(o),
        i = new fi({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e),
        s = i.outputShape,
        u = s[0],
        l = s[1],
        c = this.makeOutputArray([u, l], n);
    return this.compileAndRun(i, [t], c), 1 === c.shape[1] ? c : this.reduce(c, e, n);
  }, t.prototype.argReduce = function (t, e, n) {
    void 0 === n && (n = null);
    var r = t.shape[0],
        o = t.shape[1];
    null != n && (r = n.shape[0], o = n.shape[1]);
    var a = hn(o),
        i = new yo({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e, null == n),
        s = i.outputShape,
        u = s[0],
        l = s[1],
        c = this.makeOutputArray([u, l], "int32"),
        h = [t];
    return null != n && h.push(n), this.compileAndRun(i, h, c), 1 === c.shape[1] ? c : this.argReduce(t, e, c);
  }, t.prototype.argReducePacked = function (t, e, n) {
    void 0 === n && (n = null);
    var r = null != n ? n.shape : t.shape,
        o = hn(r[r.length - 1]),
        a = new Po(r, o, e, null == n),
        i = this.makePackedTensor(a.outputShape, "int32"),
        s = null == n ? [t] : [t, n];
    return this.compileAndRun(a, s, i), i.rank === t.rank ? this.argReducePacked(t, e, i) : i;
  }, t.prototype.sum = function (t, e) {
    nn("sum", e, t.rank);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o),
        i = bt(t.dtype);
    return this.reduce(a, "sum", i).reshape(r);
  }, t.prototype.prod = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.prod(t, e);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o),
        i = bt(t.dtype);
    return this.reduce(a, "prod", i).reshape(r);
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    var r = 0,
        o = rn([r], t.rank),
        a = t;
    null != o && (a = t.transpose(o), r = an(1, t.rank)[0]);

    var i = function (t, e, n) {
      for (var r = [], o = t.length, a = 0; a < o; a++) a !== e ? r.push(t[a]) : r.push(n);

      return r;
    }(a.shape, r, n),
        s = y([a.shape[r]]),
        u = a.as2D(-1, s),
        l = bt(t.dtype),
        c = this.segOpCompute(u, "unsortedSegmentSum", e, l, n).reshape(i);

    return null != o && (c = c.transpose(on(o))), c;
  }, t.prototype.segOpCompute = function (t, e, n, r, o) {
    var a = t.shape[0],
        i = t.shape[1],
        s = function (t, e) {
      var n,
          r = !1;

      for (t <= cn ? (n = t, r = !0) : n = V(t, Math.floor(Math.sqrt(t))); !r;) n > e || n === t ? r = !0 : n = V(t, n + 1);

      return n;
    }(i, o),
        u = new Ei({
      windowSize: s,
      inSize: i,
      batchSize: a,
      numSegments: o
    }, e),
        l = u.outputShape,
        c = l[0],
        h = l[1],
        p = this.makeOutputArray([c, h], r);

    return this.compileAndRun(u, [t, n], p), p.shape[1] === o ? p : (n = Kn(0, o).tile([i / s]), this.segOpCompute(p, e, n, r, o));
  }, t.prototype.argMinMaxReduce = function (t, e, n) {
    var r = [e];

    if (nn("arg" + n.charAt(0).toUpperCase() + n.slice(1), r, t.rank), !a.getBool("WEBGL_PACK_REDUCE") || t.rank <= 2) {
      var o = tn(t.shape, r),
          i = o[0],
          s = y(o[1]),
          u = t.as2D(-1, s);
      return this.argReduce(u, n).reshape(i);
    }

    return this.argReducePacked(t, n);
  }, t.prototype.argMin = function (t, e) {
    return this.argMinMaxReduce(t, e, "min");
  }, t.prototype.argMax = function (t, e) {
    return this.argMinMaxReduce(t, e, "max");
  }, t.prototype.cumsum = function (t, e, n, r) {
    if (e !== t.rank - 1) throw new Error("WebGL cumsum shader expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);
    var o = new ha(t.shape, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.equal = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(equal(a, b));\n", "bool");
    var n = new jo("return float(a == b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.notEqual = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(notEqual(a, b));\n", "bool");
    var n = new jo("return float(a != b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.less = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.less(t, e);
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThan(a, b));\n", "bool");
    var n = new jo("return float(a < b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.lessEqual = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThanEqual(a, b));\n", "bool");
    var n = new jo("return float(a <= b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.greater = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.greater(t, e);
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThan(a, b));\n", "bool");
    var n = new jo("return float(a > b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.greaterEqual = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThanEqual(a, b));\n", "bool");
    var n = new jo("return float(a >= b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.logicalNot = function (t) {
    var e = new Pi(t.shape, "return float(!(x >= 1.0));");
    return this.compileAndRun(e, [t]);
  }, t.prototype.logicalAnd = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(\n    vec4(greaterThanEqual(a, vec4(1.0))) *\n    vec4(greaterThanEqual(b, vec4(1.0))));\n", "bool");
    var n = new jo("return float(a >= 1.0 && b >= 1.0);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.logicalOr = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return min(\n    vec4(greaterThanEqual(a, vec4(1.0))) +\n    vec4(greaterThanEqual(b, vec4(1.0))),\n    vec4(1.0));\n", "bool");
    var n = new jo("return float(a >= 1.0 || b >= 1.0);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.select = function (t, e, n) {
    var r = new Ri(t.rank, e.shape, e.rank),
        o = this.makeOutputArray(r.outputShape, wt(e.dtype, n.dtype));
    return this.compileAndRun(r, [t, e, n], o);
  }, t.prototype.where = function (t) {
    $e("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");
    var e = t.dataSync();
    return vo(t.shape, e);
  }, t.prototype.topk = function (t, e, n) {
    return Er(t.dataSync(), t.shape, t.dtype, e);
  }, t.prototype.min = function (t, e) {
    nn("min", e, t.rank);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "min", a.dtype).reshape(r);
  }, t.prototype.minimum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.minimum(t, e);
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 result = vec4(min(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new jo("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return min(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.mod = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 result = mod(a, b);\n  vec4 isNaN = vec4(equal(b, vec4(0.0)));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new jo("if (b == 0.0) return NAN;\n  return mod(a, b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.max = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.max(t, e);
    nn("max", e, t.rank);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "max", a.dtype).reshape(r);
  }, t.prototype.maximum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.maximum(t, e);
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 result = vec4(max(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new jo("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return max(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.all = function (t, e) {
    nn("all", e, t.rank);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "all", a.dtype).reshape(r);
  }, t.prototype.any = function (t, e) {
    nn("any", e, t.rank);
    var n = tn(t.shape, e),
        r = n[0],
        o = y(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "any", a.dtype).reshape(r);
  }, t.prototype.squaredDifference = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("return (a - b) * (a - b);", t.shape, e.shape) : new jo("return (a - b) * (a - b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.realDivide = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) {
      return this.packedBinaryOp(t, e, "\n  // vec4 one = vec4(equal(a, b));\n  // return one + (vec4(1.0) - one) * a / b;\n  vec4 result = a / b;\n  if(b.x == 0.0) {\n    result.x = NAN;\n  } else if(a.x == b.x) {\n    result.x = 1.;\n  }\n  if(b.y == 0.0) {\n    result.y = NAN;\n  } else if(a.y == b.y) {\n    result.y = 1.;\n  }\n  if(b.z == 0.0) {\n    result.z = NAN;\n  } else if(a.z == b.z) {\n    result.z = 1.;\n  }\n  if(b.w == 0.0) {\n    result.w = NAN;\n  } else if(a.w == b.w) {\n    result.w = 1.;\n  }\n  \n  return result;\n", "float32", !0);
    }

    var n = new jo("\nif (b == 0.0) {\n  return NAN;\n} \nif (a == b) {\n  return 1.0;\n};\nreturn a / b;", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.floorDiv = function (t, e) {
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  ivec4 ia = round(a);\n  ivec4 ib = round(b);\n  bvec4 cond = notEqual(ib, ivec4(0));\n  ivec4 result = ivec4(0);\n  vec4 s = sign(a) * sign(b);\n\n  // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n  if (cond[0]) {\n    result[0] = idiv(ia[0], ib[0], s[0]);\n  }\n  if (cond[1]) {\n    result[1] = idiv(ia[1], ib[1], s[1]);\n  }\n  if (cond[2]) {\n    result[2] = idiv(ia[2], ib[2], s[2]);\n  }\n  if (cond[3]) {\n    result[3] = idiv(ia[3], ib[3], s[3]);\n  }\n  return vec4(result);\n", "int32");
    var n = new jo("\n  float s = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  if (ib != 0) {\n    // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n    return float(idiv(ia, ib, s));\n  } else {\n    return NAN;\n  }\n", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "int32");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.add = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, qo);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.add(t, e);
    var n = wt(t.dtype, e.dtype);
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, qo, n);
    var r = new jo(qo, t.shape, e.shape),
        o = this.makeOutputArray(r.outputShape, n);
    return this.compileAndRun(r, [t, e], o);
  }, t.prototype.packedBinaryOp = function (t, e, n, r, o) {
    void 0 === o && (o = !1);
    var a = new Ko(n, t.shape, e.shape, o),
        i = this.makePackedTensor(a.outputShape, r);
    return this.compileAndRun(a, [t, e], i);
  }, t.prototype.complexSeparableBinaryOp = function (t, e, n) {
    var r = this,
        o = this.texData.get(t.dataId),
        a = this.texData.get(e.dataId),
        i = [[o.complexTensors.real, a.complexTensors.real], [o.complexTensors.imag, a.complexTensors.imag]].map(function (o) {
      var a = o[0],
          i = o[1],
          s = r.makeComplexComponentTensorHandle(t, a),
          u = r.makeComplexComponentTensorHandle(e, i),
          l = new jo(n, t.shape, e.shape),
          c = r.makeOutputArray(l.outputShape, wt(a.dtype, i.dtype));
      return r.compileAndRun(l, [s, u], c);
    }),
        s = i[0],
        u = i[1],
        l = this.complex(s, u);
    return s.dispose(), u.dispose(), l;
  }, t.prototype.makeComplexComponentTensorHandle = function (t, e) {
    return {
      dataId: e.dataId,
      dtype: e.dtype,
      shape: t.shape
    };
  }, t.prototype.addN = function (t) {
    if (1 === t.length) return t[0];

    if (t.length > a.get("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var e = Math.floor(t.length / 2),
          n = this.addN(t.slice(0, e)),
          r = this.addN(t.slice(e));
      return this.addN([n, r]);
    }

    var o = t.map(function (t) {
      return t.dtype;
    }).reduce(function (t, e) {
      return wt(t, e);
    }),
        i = t.map(function (t) {
      return t.shape;
    }),
        s = a.getBool("WEBGL_PACK"),
        u = s ? new go(t[0].shape, i) : new mo(t[0].shape, i),
        l = s ? this.makePackedTensor(u.outputShape, o) : this.makeOutputArray(u.outputShape, o);
    return this.compileAndRun(u, t, l);
  }, t.prototype.subtract = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, Ho);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.subtract(t, e);
    var n = wt(t.dtype, e.dtype);
    if (a.getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, Ho, t.dtype);
    var r = new jo(Ho, t.shape, e.shape),
        o = this.makeOutputArray(r.outputShape, n);
    return this.compileAndRun(r, [t, e], o);
  }, t.prototype.pow = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS"),
        r = n ? new Ko("\n  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.\n  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));\n  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);\n  vec4 result = multiplier * pow(abs(a), b);\n\n  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new jo("\nif(a < 0.0 && floor(b) < b){\n  return NAN;\n}\nreturn (round(mod(b, 2.0)) != 1) ?\n    pow(abs(a), b) : sign(a) * pow(abs(a), b);\n", t.shape, e.shape),
        o = wt(t.dtype, e.dtype),
        i = n ? this.makePackedTensor(r.outputShape, o) : this.makeOutputArray(r.outputShape, o);
    return this.compileAndRun(r, [t, e], i);
  }, t.prototype.ceil = function (t) {
    var e = new Pi(t.shape, "return ceil(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.floor = function (t) {
    var e = new Pi(t.shape, "return floor(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.sign = function (t) {
    var e = new Pi(t.shape, "\n  if (isnan(x)) { return 0.0; }\n  return sign(x);\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.isNaN = function (t) {
    var e = new Pi(t.shape, "return float(isnan(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.isInf = function (t) {
    var e = new Pi(t.shape, "return float(isinf(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.isFinite = function (t) {
    var e = new Pi(t.shape, "return float(!isnan(x) && !isinf(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.round = function (t) {
    var e = new Pi(t.shape, "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.exp = function (t) {
    var e;
    return e = a.getBool("WEBGL_PACK") ? new Yi(t.shape, Vi) : new Pi(t.shape, Vi), this.compileAndRun(e, [t]);
  }, t.prototype.expm1 = function (t) {
    var e = new Pi(t.shape, "return exp(x) - 1.0;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.log = function (t) {
    var e;
    return e = a.getBool("WEBGL_PACK") ? new Yi(t.shape, "\n  vec4 result = log(x);\n  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));\n  result.r = isNaN.r == 1.0 ? NAN : result.r;\n  result.g = isNaN.g == 1.0 ? NAN : result.g;\n  result.b = isNaN.b == 1.0 ? NAN : result.b;\n  result.a = isNaN.a == 1.0 ? NAN : result.a;\n\n  return result;\n") : new Pi(t.shape, "if (x < 0.0) return NAN;\n  return log(x);"), this.compileAndRun(e, [t]);
  }, t.prototype.log1p = function (t) {
    var e = new Pi(t.shape, "return log(1.0 + x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.sqrt = function (t) {
    var e = new Pi(t.shape, "return sqrt(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.rsqrt = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.rsqrt(t);
    var e = new Pi(t.shape, "return inversesqrt(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.square = function (t) {
    var e = new Pi(t.shape, "return x * x;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.reciprocal = function (t) {
    var e = new Pi(t.shape, "return 1.0 / x;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.relu = function (t) {
    var e;
    return e = a.getBool("WEBGL_PACK") ? new Yi(t.shape, Xi) : new Pi(t.shape, Ui), this.compileAndRun(e, [t]);
  }, t.prototype.prelu = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));\n  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);\n", t.shape, e.shape) : new jo("return (a < 0.) ? b * a : a;", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.elu = function (t) {
    var e = new Pi(t.shape, "return (x >= 0.0) ? x : (exp(x) - 1.0);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.eluDer = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));\n  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));\n", t.shape, e.shape) : new jo("return (b >= 1.0) ? a : a * (b + 1.0);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.selu = function (t) {
    var e = new Pi(t.shape, zi);
    return this.compileAndRun(e, [t]);
  }, t.prototype.int = function (t) {
    var e = new Pi(t.shape, "return float(int(x));"),
        n = this.makeOutputArray(e.outputShape, "int32");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.clip = function (t, e, n) {
    var r,
        o = (r = a.getBool("WEBGL_PACK_CLIP") ? new Yo(t.shape) : new Xo(t.shape)).getCustomSetupFunc(e, n);
    return this.compileAndRun(r, [t], null, o);
  }, t.prototype.abs = function (t) {
    var e = new Pi(t.shape, "return abs(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.complexAbs = function (t) {
    var e = this.texData.get(t.dataId),
        n = new Qo(t.shape),
        r = [this.makeComplexComponentTensorHandle(t, e.complexTensors.real), this.makeComplexComponentTensorHandle(t, e.complexTensors.imag)];
    return this.compileAndRun(n, r);
  }, t.prototype.sigmoid = function (t) {
    var e = new Pi(t.shape, "return 1.0 / (1.0 + exp(-1.0 * x));");
    return this.compileAndRun(e, [t]);
  }, t.prototype.softplus = function (t) {
    var e = new Pi(t.shape, "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.sin = function (t) {
    var e = new Pi(t.shape, Gi);
    return this.compileAndRun(e, [t]);
  }, t.prototype.cos = function (t) {
    var e = new Pi(t.shape, qi);
    return this.compileAndRun(e, [t]);
  }, t.prototype.tan = function (t) {
    var e = new Pi(t.shape, "return tan(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.asin = function (t) {
    var e = new Pi(t.shape, "return asin(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.acos = function (t) {
    var e = new Pi(t.shape, "return acos(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.atan = function (t) {
    var e = new Pi(t.shape, Hi);
    return this.compileAndRun(e, [t]);
  }, t.prototype.atan2 = function (t, e) {
    var n = a.getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Ko("\n  vec4 result = atan(a, b);\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new jo("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return atan(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.sinh = function (t) {
    var e = new Pi(t.shape, "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.cosh = function (t) {
    var e = new Pi(t.shape, "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.tanh = function (t) {
    var e = new Pi(t.shape, "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.asinh = function (t) {
    var e = new Pi(t.shape, "return log(x + sqrt(x * x + 1.0));");
    return this.compileAndRun(e, [t]);
  }, t.prototype.acosh = function (t) {
    var e = new Pi(t.shape, $i);
    return this.compileAndRun(e, [t]);
  }, t.prototype.atanh = function (t) {
    var e = new Pi(t.shape, ji);
    return this.compileAndRun(e, [t]);
  }, t.prototype.erf = function (t) {
    var e = new Pi(t.shape, '\n  // Error function is calculated approximately with elementary function.\n  // See "Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables", Abramowitz and Stegun.\n  float p = 0.3275911;\n  float a1 = 0.254829592;\n  float a2 = -0.284496736;\n  float a3 = 1.421413741;\n  float a4 = -1.453152027;\n  float a5 = 1.061405429;\n\n  float t = 1.0 / (1.0 + p * x);\n  return 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x);\n');
    return this.compileAndRun(e, [t]);
  }, t.prototype.step = function (t, e) {
    var n = new Pi(t.shape, function (t) {
      return void 0 === t && (t = 0), Li + "\n    return x > 0.0 ? 1.0 : float(" + t + ");\n  ";
    }(e));
    return this.compileAndRun(n, [t]);
  }, t.prototype.conv2dByMatMul = function (t, e, n) {
    var r = t.shape,
        o = this.texData.get(t.dataId),
        i = n.inChannels,
        s = r[0] * r[1] * r[2],
        u = n.outChannels,
        l = (1 === s || 1 === u) && i > 1e3,
        c = r[2] % 2 != 0 && !!o.isPacked;

    if (l || !a.getBool("WEBGL_LAZILY_UNPACK") || !a.getBool("WEBGL_PACK_BINARY_OPERATIONS") || !c) {
      var h = this.reshape(t, [1, r[0] * r[1] * r[2], n.inChannels]),
          p = this.reshape(e, [1, n.inChannels, n.outChannels]);
      return this.reshape(this.batchMatMul(h, p, !1, !1), n.outShape);
    }

    var f = ht.make([1, r[0] * r[1] * (r[2] + 1), n.inChannels], {
      dataId: t.dataId
    }, t.dtype, this),
        v = o.shape;
    o.shape = o.shape.slice(), o.shape[o.shape.length - 2]++, d(ve(o.shape, f.shape), function () {
      return "packed reshape " + o.shape + " to " + f.shape + " isn't free";
    });
    var m = this.reshape(e, [1, n.inChannels, n.outChannels]),
        g = this.batchMatMul(f, m, !1, !1),
        y = this.texData.get(g.dataId);
    return d(y.isPacked, function () {
      return "batchMatMul result is expected to be packed";
    }), o.shape = v, y.shape = n.outShape, ht.make(n.outShape, {
      dataId: g.dataId
    }, g.dtype, this);
  }, t.prototype.conv2dWithIm2Row = function (t, e, n) {
    var r = n.filterWidth,
        o = n.filterHeight,
        a = n.inChannels,
        i = n.outWidth,
        s = n.outHeight,
        u = r * o * a,
        l = s * i,
        c = [u, l],
        h = t.squeeze([0]),
        p = e.reshape([1, u, -1]),
        f = new ei(c, h.shape, n),
        d = this.compileAndRun(f, [h]).reshape([1, c[0], c[1]]),
        v = new ii(d.shape, [1, l, n.outChannels], !0, !1);
    return this.compileAndRun(v, [d, p]).reshape([1, s, i, n.outChannels]);
  }, t.prototype.conv2d = function (t, e, n) {
    if (1 === n.filterHeight && 1 === n.filterWidth && 1 === n.dilationHeight && 1 === n.dilationWidth && 1 === n.strideHeight && 1 === n.strideWidth && ("SAME" === n.padInfo.type || "VALID" === n.padInfo.type)) return this.conv2dByMatMul(t, e, n);
    if (a.getBool("WEBGL_CONV_IM2COL") && 1 === t.shape[0]) return this.conv2dWithIm2Row(t, e, n);
    var r = new ia(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    var r = new ea(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    var r = new ta(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    var r;
    return a.getBool("WEBGL_PACK_DEPTHWISECONV") && n.strideWidth <= 2 && n.outChannels / n.inChannels == 1 ? (r = new la(n), this.compileAndRun(r, [t, e], this.makePackedTensor(n.outShape, t.dtype))) : (r = new ua(n), this.compileAndRun(r, [t, e]));
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    var r = new aa(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    var r = new oa(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3d = function (t, e, n) {
    var r = new sa(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    var r = new ra(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    var r = new na(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.maxPool = function (t, e) {
    var n = new pi(e, "max", !1),
        r = this.makeOutputArray(n.outputShape, t.dtype);
    return this.compileAndRun(n, [t], r);
  }, t.prototype.avgPool = function (t, e) {
    var n = new pi(e, "avg", !1),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t], r);
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    var o = new pi(r, "max", !0),
        a = this.compileAndRun(o, [e]),
        i = new ai(r),
        s = this.makeOutputArray(i.outputShape, e.dtype),
        u = this.compileAndRun(i, [t, a], s);
    return a.dispose(), u;
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    var r = new Lo(n),
        o = this.makeOutputArray(r.outputShape, e.dtype);
    return this.compileAndRun(r, [t], o);
  }, t.prototype.cast = function (t, e) {
    return pr(t, e, this);
  }, t.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, t.prototype.reshape = function (t, e) {
    var n = this.texData.get(t.dataId);
    return !n.isPacked || ve(t.shape, e) || null !== n.texture && ve(n.shape, e) ? fr(t, e) : this.packedReshape(t, e);
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    var o = a.getBool("WEBGL_PACK_IMAGE_OPERATIONS") ? new gi(t.shape, e, n, r) : new mi(t.shape, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    var r = new vi(t, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    var o = new xi(t.shape, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    var r = new yi(t, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.multinomial = function (t, e, n, r) {
    var o = e ? t : Dn(t),
        a = o.shape[0],
        i = o.shape[1],
        s = new si(a, i, n),
        u = this.makeOutputArray(s.outputShape, "int32"),
        l = s.getCustomSetupFunc(r);
    return this.compileAndRun(s, [o], u, l);
  }, t.prototype.oneHot = function (t, e, n, r) {
    var o = new ui(t.size, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return $e("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead"), wr(t.dataSync(), e.dataSync(), n, r, o);
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    var i = new ca(t.shape, e.shape, r, o, a);
    return this.compileAndRun(i, [t, e, n]);
  }, t.prototype.depthToSpace = function (t, e, n) {
    d(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });
    var r = t.shape[0],
        o = "NHWC" === n ? t.shape[1] : t.shape[2],
        a = "NHWC" === n ? t.shape[2] : t.shape[3],
        i = "NHWC" === n ? t.shape[3] : t.shape[1],
        s = o * e,
        u = a * e,
        l = i / (e * e),
        c = new fa("NHWC" === n ? [r, s, u, l] : [r, l, s, u], e, n);
    return this.compileAndRun(c, [t]);
  }, t.prototype.split = function (t, e, n) {
    return Cr(t, e, n);
  }, t.prototype.scatterND = function (t, e, n) {
    var r = fn(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        l = [u / i, i],
        c = t.reshape([a, o]),
        h = e.reshape([a, i]);
    if (0 === u) return fr(Bn([]), n);
    var p = Pn(0),
        f = new Ci(a, o, c.rank, h.rank, s, l);
    return this.compileAndRun(f, [h, c, p]).reshape(n);
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    var o = fn(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.strides,
        u = o.outputSize,
        l = new Ci(i, a, t.rank, e.rank, s, [u, 1], !1);
    return this.compileAndRun(l, [e, t, r]).reshape(n);
  }, t.prototype.fft = function (t) {
    return this.fftImpl(t, !1);
  }, t.prototype.ifft = function (t) {
    return this.fftImpl(t, !0);
  }, t.prototype.fftImpl = function (t, e) {
    var n = this.texData.get(t.dataId),
        r = new xa(ga, t.shape, e),
        o = new xa(ya, t.shape, e),
        a = [this.makeComplexComponentTensorHandle(t, n.complexTensors.real), this.makeComplexComponentTensorHandle(t, n.complexTensors.imag)],
        i = this.compileAndRun(r, a),
        s = this.compileAndRun(o, a),
        u = this.complex(i, s).as2D(t.shape[0], t.shape[1]);
    return i.dispose(), s.dispose(), u;
  }, t.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = ln(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3],
        l = e.reshape([i, r]),
        c = t.reshape([t.size / s, s]),
        h = new Sa(r, u, [i, s]);
    return this.compileAndRun(h, [c, l]).reshape(a);
  }, t.prototype.fill = function (t, e, n) {
    if ("string" === (n = n || U(e))) {
      var r = A(n, y(t));
      return r.fill(e), ht.make(t, {
        values: r
      }, n);
    }

    var o = new wa(t, e),
        a = o.getCustomSetupFunc(e),
        i = this.makeOutputArray(t, n);
    return this.compileAndRun(o, [], i, a);
  }, t.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported under string dtype");
    return this.fill(t.shape, 1, t.dtype);
  }, t.prototype.zerosLike = function (t) {
    return this.fill(t.shape, "string" === t.dtype ? "" : 0, t.dtype);
  }, t.prototype.linspace = function (t, e, n) {
    return dr(t, e, n);
  }, t.prototype.makeOutputArray = function (t, e) {
    return ht.make(t, {}, e, this);
  }, t.prototype.makePackedTensor = function (t, e) {
    var n = ht.make(t, {}, e, this);
    return this.texData.get(n.dataId).isPacked = !0, n;
  }, t.prototype.unpackTensor = function (t) {
    var e = new Qi(t.shape);
    return this.compileAndRun(e, [t], ht.make(e.outputShape, {}, t.dtype, this));
  }, t.prototype.packTensor = function (t) {
    var e = new li(t.shape);
    return this.compileAndRun(e, [t], this.makePackedTensor(t.shape, t.dtype));
  }, t.prototype.packedReshape = function (t, e) {
    var n = t.reshape([he(t.shape)].concat(pe(t.shape))),
        r = [he(e)].concat(pe(e)),
        o = new di(r, n.shape);
    return this.compileAndRun(o, [n]).reshape(e);
  }, t.prototype.compileAndRun = function (t, e, n, r) {
    var o = this;
    if (null == n && (n = t.usesPackedTextures ? this.makePackedTensor(t.outputShape, e[0].dtype) : this.makeOutputArray(t.outputShape, e[0].dtype)), 0 === n.size) return this.texData.get(n.dataId).values = k(n.dtype, 0), n;
    var i = e.map(function (e) {
      if ("complex64" === e.dtype) throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");
      var n = o.texData.get(e.dataId);

      if (null == n.texture) {
        if (!t.usesPackedTextures && y(e.shape) <= a.getNumber("WEBGL_SIZE_UPLOAD_UNIFORM")) return {
          shape: e.shape,
          texData: null,
          isUniform: !0,
          uniformValues: n.values
        };
        t.usesPackedTextures && (n.isPacked = !0, n.shape = e.shape);
      } else if (!!n.isPacked != !!t.usesPackedTextures) e = n.isPacked ? o.unpackTensor(e) : o.packTensor(e), n = o.texData.get(e.dataId);else if (n.isPacked && !ve(n.shape, e.shape)) {
        var r = e,
            i = e.shape;
        e.shape = n.shape, e = o.packedReshape(e, i), n = o.texData.get(e.dataId), r.shape = i;
      }

      return o.uploadToGPU(e.dataId), {
        shape: e.shape,
        texData: n,
        isUniform: !1
      };
    });
    this.uploadToGPU(n.dataId);

    var s,
        u = {
      shape: n.shape,
      texData: this.texData.get(n.dataId),
      isUniform: !1
    },
        l = function (t, e, n) {
      var r = "";
      e.concat(n).forEach(function (t) {
        var e = null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0,
            n = t.isUniform ? "uniform" : t.texData.texShape;
        r += t.shape + "_" + n + "_" + e;
      });
      var o = t.userCode,
          a = t.constructor.name;
      return a += "_" + r + "_" + o;
    }(t, i, u),
        c = this.getAndSaveBinary(l, function () {
      return function (t, e, n, r) {
        var o = e.userCode,
            i = n.map(function (t, n) {
          var r = {
            logicalShape: t.shape,
            texShape: t.isUniform ? null : t.texData.texShape,
            isUniform: t.isUniform,
            isPacked: !t.isUniform && t.texData.isPacked,
            flatOffset: null
          };
          return null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0 && (r.flatOffset = t.texData.slice.flatOffset), {
            name: e.variableNames[n],
            shapeInfo: r
          };
        }),
            s = i.map(function (t) {
          return t.shapeInfo;
        }),
            u = {
          logicalShape: r.shape,
          texShape: r.texData.texShape,
          isUniform: !1,
          isPacked: r.texData.isPacked,
          flatOffset: null
        },
            l = Io(i, u, o, e.usesPackedTextures),
            c = t.createProgram(l),
            h = null,
            p = t.getUniformLocation(c, "NAN", !1);
        1 === a.getNumber("WEBGL_VERSION") && (h = t.getUniformLocation(c, "INFINITY", !1));

        for (var f = {}, d = 0; d < e.variableNames.length; d++) {
          var v = e.variableNames[d];
          f[v] = t.getUniformLocation(c, v, !1), f["offset" + v] = t.getUniformLocation(c, "offset" + v, !1);
        }

        return {
          program: e,
          source: l,
          webGLProgram: c,
          uniformLocations: f,
          inShapeInfos: s,
          outShapeInfo: u,
          infLoc: h,
          nanLoc: p
        };
      }(o.gpgpu, t, i, u);
    }),
        h = null != this.activeTimers;

    return h && (s = this.startTimer()), function (t, e, n, r, o) {
      ti(e.inShapeInfos, n), ti([e.outShapeInfo], [r]);
      var i = r.texData.texture,
          s = r.texData.texShape;
      r.texData.isPacked ? t.setOutputPackedMatrixTexture(i, s[0], s[1]) : t.setOutputMatrixTexture(i, s[0], s[1]), t.setProgram(e.webGLProgram), 1 === a.getNumber("WEBGL_VERSION") && null !== e.infLoc && t.gl.uniform1f(e.infLoc, 1 / 0), null !== e.nanLoc && t.gl.uniform1f(e.nanLoc, NaN), n.forEach(function (n, r) {
        var o = e.program.variableNames[r],
            a = e.uniformLocations[o],
            i = e.uniformLocations["offset" + o];
        if (null != a) if (n.isUniform) {
          if (y(n.shape) < 2) t.gl.uniform1f(a, n.uniformValues[0]);else {
            var s = n.uniformValues;
            s instanceof Float32Array || (s = new Float32Array(s)), t.gl.uniform1fv(a, s);
          }
        } else null != n.texData.slice && null != i && t.gl.uniform1i(i, n.texData.slice.flatOffset), t.setInputMatrixTexture(n.texData.texture, a, r);
      }), null != o && o(t, e.webGLProgram), t.executeProgram();
    }(this.gpgpu, c, i, u, r), h && (s = this.endTimer(s), this.activeTimers.push({
      name: t.constructor.name,
      query: this.getQueryTime(s)
    })), a.getBool("WEBGL_LAZILY_UNPACK") || !this.texData.get(n.dataId).isPacked || t.isPackShader ? n : this.unpackTensor(n);
  }, t.prototype.getAndSaveBinary = function (t, e) {
    return t in this.binaryCache || (this.binaryCache[t] = e()), this.binaryCache[t];
  }, t.prototype.getTextureManager = function () {
    return this.textureManager;
  }, t.prototype.dispose = function () {
    this.disposed || (this.textureManager.dispose(), this.canvas.remove(), null != this.fromPixels2DContext && this.fromPixels2DContext.canvas.remove(), this.gpgpuCreatedLocally && (this.gpgpu.program = null, this.gpgpu.dispose()), this.disposed = !0);
  }, t.prototype.floatPrecision = function () {
    var t = this;
    return null == this.floatPrecisionValue && (this.floatPrecisionValue = Oe(function () {
      var e = a.getBool("DEBUG");
      a.set("DEBUG", !1);
      var n = t.abs(Pn(1e-8)).dataSync()[0];
      return a.set("DEBUG", e), n > 0 ? 32 : 16;
    })), this.floatPrecisionValue;
  }, t.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, t.prototype.uploadToGPU = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.shape,
        o = n.dtype,
        a = n.values,
        i = n.texture,
        s = n.usage,
        u = n.isPacked;

    if (null == i) {
      var l,
          c = null != this.activeTimers;
      c && (l = performance.now());
      var h = fe(r, u);

      if (n.texShape = h, null != a) {
        var p = [1, 1, 1];
        0 === r.length || 1 === r.length && 1 === r[0] || (p = [he(r)].concat(pe(r)));
        var f = void 0,
            d = h[1],
            v = h[0];
        u ? (d = (e = Ta(h[0], h[1]))[0], v = e[1], f = new ma(p, [v, d])) : f = new va(p, [v, d]);
        var m = this.makeTensorHandle([v, d], o);
        this.texData.get(m.dataId).usage = Ra.UPLOAD, this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(m.dataId), d, v, a);
        var g = this.makeTensorHandle(f.outputShape, m.dtype);
        g.size = y(f.outputShape), this.texData.get(g.dataId).isPacked = u, this.compileAndRun(f, [m], g);
        var x = this.texData.get(g.dataId);
        n.texture = x.texture, n.texShape = x.texShape, n.isPacked = x.isPacked, n.usage = x.usage, this.disposeData(m.dataId), this.texData.delete(g.dataId), n.values = null, c && (this.uploadWaitMs += performance.now() - l);
      } else {
        var w = this.acquireTexture(h, s, o, u);
        n.texture = w;
      }
    }
  }, t.prototype.convertAndCacheOnCPU = function (t, e) {
    var n = this.texData.get(t),
        r = n.dtype;
    return this.releaseGPUData(t), null != e && (n.values = function (t, e) {
      if ("float32" === e || "complex64" === e) return t;

      if ("int32" === e || "bool" === e) {
        for (var n = "int32" === e ? new Int32Array(t.length) : new Uint8Array(t.length), r = 0; r < n.length; ++r) n[r] = Math.round(t[r]);

        return n;
      }

      throw new Error("Unknown dtype " + e);
    }(e, r)), n.values;
  }, t.prototype.acquireTexture = function (t, e, n, r) {
    if (this.numBytesInGPU += this.computeBytes(t, n), !this.warnedAboutMemory && this.numBytesInGPU > 1024 * this.numMBBeforeWarning * 1024) {
      var o = (this.numBytesInGPU / 1024 / 1024).toFixed(2);
      this.warnedAboutMemory = !0, console.warn("High memory usage in GPU: " + o + " MB, most likely due to a memory leak");
    }

    return this.textureManager.acquireTexture(t, e, r);
  }, t.prototype.computeBytes = function (t, e) {
    return t[0] * t[1] * F(e);
  }, t;
}();

Tt() && At.registerBackend("webgl", function () {
  return new ts();
}, 2);

var es = Tn({
  abs_: function (t) {
    var e = bn(t, "x", "abs");
    return "complex64" === e.dtype ? At.runKernel(function (t) {
      return t.complexAbs(e);
    }, {
      $x: e
    }) : At.runKernel(function (t, n) {
      var r = t.abs(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.toFloat().step(-1));
        }
      };
    });
  }
}),
    ns = Tn({
  acos_: function (t) {
    var e = bn(t, "x", "acos");
    return At.runKernel(function (t, n) {
      var r = t.acos(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Pn(1).sub(n.toFloat().square()).sqrt()).neg();
        }
      };
    });
  }
}),
    rs = Tn({
  acosh_: function (t) {
    var e = bn(t, "x", "acosh");
    return At.runKernel(function (t, n) {
      var r = t.acosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(n.toFloat().square().sub(1).sqrt());
        }
      };
    });
  }
}),
    os = Tn({
  asin_: function (t) {
    var e = bn(t, "x", "asin");
    return At.runKernel(function (t, n) {
      var r = t.asin(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Pn(1).sub(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    as = Tn({
  asinh_: function (t) {
    var e = bn(t, "x", "asinh");
    return At.runKernel(function (t, n) {
      var r = t.asinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Pn(1).add(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    is = Tn({
  atan_: function (t) {
    var e = bn(t, "x", "atan");
    return At.runKernel(function (t, n) {
      var r = t.atan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().square().add(1));
        }
      };
    });
  }
}),
    ss = Tn({
  atanh_: function (t) {
    var e = bn(t, "x", "atanh");
    return At.runKernel(function (t, n) {
      var r = t.atanh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(Pn(1).sub(n.toFloat().square()));
        }
      };
    });
  }
}),
    us = Tn({
  ceil_: function (t) {
    var e = bn(t, "x", "ceil");
    return At.runKernel(function (t) {
      return t.ceil(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    ls = Tn({
  clipByValue_: function (t, e, n) {
    var r = bn(t, "x", "clipByValue");
    return d(e <= n, function () {
      return "Error in clip: min (" + e + ") must be less than or equal to max (" + n + ").";
    }), At.runKernel(function (t, o) {
      var a = t.clip(r, e, n);
      return o([r]), a;
    }, {
      $x: r
    }, function (t, r) {
      var o = r[0];
      return {
        $x: function () {
          return t.where(o.greaterEqual(e).logicalAnd(o.lessEqual(n)), Yn(t));
        }
      };
    });
  }
}),
    cs = Tn({
  cos_: function (t) {
    var e = bn(t, "x", "cos");
    return At.runKernel(function (t, n) {
      var r = t.cos(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().sin().neg().mul(t);
        }
      };
    });
  }
}),
    hs = Tn({
  cosh_: function (t) {
    var e = bn(t, "x", "cosh");
    return At.runKernel(function (t, n) {
      var r = t.cosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().sinh().mulStrict(t);
        }
      };
    });
  }
}),
    ps = Tn({
  erf_: function (t) {
    var e = bn(t, "x", "erf");
    return d("int32" === e.dtype || "float32" === e.dtype, function () {
      return "Input dtype must be `int32` or `float32`.";
    }), "int32" === e.dtype && (e = e.toFloat()), At.runKernel(function (t, n) {
      var r = t.erf(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.square().neg().exp().mul(2 / Math.sqrt(Math.PI)));
        }
      };
    });
  }
}),
    fs = Tn({
  exp_: function (t) {
    var e = bn(t, "x", "exp");
    return At.runKernel(function (t, n) {
      var r = t.exp(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return t.mulStrict(e[0]);
        }
      };
    });
  }
}),
    ds = Tn({
  expm1_: function (t) {
    var e = bn(t, "x", "expm1");
    return At.runKernel(function (t, n) {
      var r = t.expm1(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.exp());
        }
      };
    });
  }
}),
    vs = Tn({
  floor_: function (t) {
    var e = bn(t, "x", "floor");
    return At.runKernel(function (t) {
      return t.floor(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    ms = Tn({
  log_: function (t) {
    var e = bn(t, "x", "log");
    return At.runKernel(function (t, n) {
      var r = t.log(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat());
        }
      };
    });
  }
}),
    gs = Tn({
  log1p_: function (t) {
    var e = bn(t, "x", "log1p");
    return At.runKernel(function (t, n) {
      var r = t.log1p(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.add(1));
        }
      };
    });
  }
}),
    ys = Tn({
  logSigmoid_: function (t) {
    var e = bn(t, "x", "logSigmoid");
    return At.runKernel(function (t, n) {
      var r = t.softplus(e.neg()).neg();
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.neg().sigmoid());
        }
      };
    });
  }
}),
    xs = Tn({
  neg_: function (t) {
    var e = bn(t, "x", "neg");
    return At.runKernel(function (t) {
      return t.neg(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return t.neg();
        }
      };
    });
  }
}),
    ws = Tn({
  reciprocal_: function (t) {
    var e = bn(t, "x", "reciprocal");
    return At.runKernel(function (t, n) {
      var r = t.reciprocal(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.square().neg());
        }
      };
    });
  }
}),
    bs = Tn({
  round_: function (t) {
    var e = bn(t, "x", "round");
    return At.runKernel(function (t) {
      return t.round(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Cs = Tn({
  rsqrt_: function (t) {
    var e = bn(t, "x", "rsqrt");
    return At.runKernel(function (t, n) {
      var r = t.rsqrt(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.pow(1.5).mul(2)).neg();
        }
      };
    });
  }
}),
    Es = Tn({
  sigmoid_: function (t) {
    var e = bn(t, "x", "sigmoid");
    return At.runKernel(function (t, n) {
      var r = t.sigmoid(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.mul(Pn(1).sub(n)));
        }
      };
    });
  }
}),
    Rs = Tn({
  sign_: function (t) {
    var e = bn(t, "x", "sign");
    return At.runKernel(function (t) {
      return t.sign(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Is = Tn({
  isNaN_: function (t) {
    var e = bn(t, "x", "isNaN");
    return At.runKernel(function (t) {
      return t.isNaN(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Ss = Tn({
  isInf_: function (t) {
    var e = bn(t, "x", "isInf");
    return At.runKernel(function (t) {
      return t.isInf(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Ns = Tn({
  isFinite_: function (t) {
    var e = bn(t, "x", "isFinite");
    return At.runKernel(function (t) {
      return t.isFinite(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    ks = Tn({
  sin_: function (t) {
    var e = bn(t, "x", "sin");
    return At.runKernel(function (t, n) {
      var r = t.sin(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().cos().mul(t);
        }
      };
    });
  }
}),
    As = Tn({
  sinh_: function (t) {
    var e = bn(t, "x", "sinh");
    return At.runKernel(function (t, n) {
      var r = t.sinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().cosh().mulStrict(t);
        }
      };
    });
  }
}),
    Ts = Tn({
  softplus_: function (t) {
    var e = bn(t, "x", "softplus");
    return At.runKernel(function (t, n) {
      var r = t.softplus(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.sigmoid());
        }
      };
    });
  }
}),
    Ds = Tn({
  sqrt_: function (t) {
    var e = bn(t, "x", "sqrt");
    return At.runKernel(function (t, n) {
      var r = t.sqrt(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().sqrt().mul(2));
        }
      };
    });
  }
}),
    _s = Tn({
  square_: function (t) {
    var e = bn(t, "x", "square");
    return At.runKernel(function (t, n) {
      return n([e]), t.square(e);
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.toFloat().mul(2));
        }
      };
    });
  }
}),
    Os = Tn({
  step_: function (t, e) {
    void 0 === e && (e = 0);
    var n = bn(t, "x", "step");
    return At.runKernel(function (t) {
      return t.step(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return Yn(t);
        }
      };
    });
  }
}),
    Ms = Tn({
  tan_: function (t) {
    var e = bn(t, "x", "tan");
    return At.runKernel(function (t, n) {
      var r = t.tan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.cos().square());
        }
      };
    });
  }
}),
    Fs = Tn({
  tanh_: function (t) {
    var e = bn(t, "x", "tanh");
    return At.runKernel(function (t, n) {
      var r = t.tanh(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Pn(1).sub(n.square()).mulStrict(t);
        }
      };
    });
  }
});

exports.tanh = Fs;
exports.tan = Ms;
exports.step = Os;
exports.square = _s;
exports.sqrt = Ds;
exports.softplus = Ts;
exports.sinh = As;
exports.sin = ks;
exports.isFinite = Ns;
exports.isInf = Ss;
exports.isNaN = Is;
exports.sign = Rs;
exports.sigmoid = Es;
exports.rsqrt = Cs;
exports.round = bs;
exports.reciprocal = ws;
exports.neg = xs;
exports.logSigmoid = ys;
exports.log1p = gs;
exports.log = ms;
exports.floor = vs;
exports.expm1 = ds;
exports.exp = fs;
exports.erf = ps;
exports.cosh = hs;
exports.cos = cs;
exports.clipByValue = ls;
exports.ceil = us;
exports.atanh = ss;
exports.atan = is;
exports.asinh = as;
exports.asin = os;
exports.acosh = rs;
exports.acos = ns;
exports.abs = es;

function Bs(t, e, n, r, o, a) {
  var i,
      s,
      u = bn(t, "x", "batchNorm"),
      l = bn(e, "mean", "batchNorm"),
      c = bn(n, "variance", "batchNorm");
  return null != o && (i = bn(o, "scale", "batchNorm")), null != r && (s = bn(r, "offset", "batchNorm")), d(2 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), d(2 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank " + l.rank + ".";
  }), d(2 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank " + c.rank + ".";
  }), null != i && d(2 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank " + i.rank + ".";
  }), null != s && d(2 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank " + s.rank + ".";
  }), Ws(u, l, c, s, i, a);
}

function Ps(t, e, n, r, o, a) {
  var i,
      s,
      u = bn(t, "x", "batchNorm"),
      l = bn(e, "mean", "batchNorm"),
      c = bn(n, "variance", "batchNorm");
  return null != o && (i = bn(o, "scale", "batchNorm")), null != r && (s = bn(r, "offset", "batchNorm")), d(3 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), d(3 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank " + l.rank + ".";
  }), d(3 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank " + c.rank + ".";
  }), null != i && d(3 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank " + i.rank + ".";
  }), null != s && d(3 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank " + s.rank + ".";
  }), Ws(u, l, c, s, i, a);
}

function Ls(t, e, n, r, o, a) {
  var i,
      s,
      u = bn(t, "x", "batchNorm"),
      l = bn(e, "mean", "batchNorm"),
      c = bn(n, "variance", "batchNorm");
  return null != o && (i = bn(o, "scale", "batchNorm")), null != r && (s = bn(r, "offset", "batchNorm")), d(4 === u.rank, function () {
    return "Error in batchNorm4D: x must be rank 4 but got rank " + u.rank + ".";
  }), d(4 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank " + l.rank + ".";
  }), d(4 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank " + c.rank + ".";
  }), null != i && d(4 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank " + i.rank + ".";
  }), null != s && d(4 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank " + s.rank + ".";
  }), Ws(u, l, c, s, i, a);
}

function Ws(t, e, n, r, o, a) {
  null == a && (a = .001);
  var i,
      s,
      u,
      l = bn(t, "x", "batchNorm"),
      c = bn(e, "mean", "batchNorm"),
      h = bn(n, "variance", "batchNorm");
  null != o && (i = bn(o, "scale", "batchNorm")), null != r && (s = bn(r, "offset", "batchNorm")), d(c.rank === h.rank, function () {
    return "Batch normalization gradient requires mean and variance to have equal ranks.";
  }), d(null == s || c.rank === s.rank, function () {
    return "Batch normalization gradient requires mean and offset to have equal ranks.";
  }), d(null == i || c.rank === i.rank, function () {
    return "Batch normalization gradient requires mean and scale to have equal ranks.";
  }), u = 0 === l.rank || 1 === l.rank ? l.as4D(1, 1, 1, l.size) : 2 === l.rank ? l.as4D(1, 1, l.shape[0], l.shape[1]) : 3 === l.rank ? l.as4D(1, l.shape[0], l.shape[1], l.shape[2]) : l;
  return At.runKernel(function (t, e) {
    var n = t.batchNormalization(u, Us(c), Us(h), a, Us(i), Us(s));
    return e([l, c, h, i]), n;
  }, {
    $x: l,
    $mean: c,
    $variance: h,
    $scale: i,
    $offset: s
  }, function (t, e) {
    var n = e[0],
        r = e[1],
        o = e[2],
        i = e[3],
        s = null == i ? Pn(1) : i,
        l = tr(r.shape, u.shape),
        c = [];

    if (1 === r.rank) {
      for (var h = 0; h < u.shape.length - 1; ++h) c.push(u.shape[h]);

      c.push(1);
    }

    var p = n.sub(r),
        f = t.mul(s),
        d = Cs(o.add(Pn(a))),
        v = d.mul(d).mul(d).mul(Pn(-.5));
    return {
      $x: function () {
        return 1 === r.rank ? t.mul(co(d.as4D(1, 1, 1, r.shape[0]), c)).mul(s).reshape(n.shape) : t.mul(d).mul(s).reshape(n.shape);
      },
      $mean: function () {
        var t = d.mul(Pn(-1)).mul(f);
        return 1 === r.rank && (t = t.sum(l)), t.reshape(r.shape);
      },
      $variance: function () {
        var t = v.mul(p).mul(f);
        return 1 === r.rank && (t = t.sum(l)), t.reshape(r.shape);
      },
      $scale: function () {
        var e = p.mul(d),
            n = t.mul(e);
        return 1 === r.rank && (n = n.sum(l)), n.reshape(r.shape);
      },
      $offset: function () {
        var e = t;
        return 1 === r.rank && (e = e.sum(l)), e.reshape(r.shape);
      }
    };
  }).reshape(l.shape);
}

function Us(t) {
  return null == t ? null : 0 === t.rank ? t.as1D() : 1 === t.rank ? t : 2 === t.rank ? t.as4D(1, 1, t.shape[0], t.shape[1]) : 3 === t.rank ? t.as4D(1, t.shape[0], t.shape[1], t.shape[2]) : t;
}

function zs() {
  Ae("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon");
}

var Vs = Tn({
  batchNormalization2d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), zs(), Bs(t, e, n, a, o, r);
  }
}),
    Gs = Tn({
  batchNormalization3d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), zs(), Ps(t, e, n, a, o, r);
  }
}),
    qs = Tn({
  batchNormalization4d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), zs(), Ls(t, e, n, a, o, r);
  }
}),
    Hs = Tn({
  batchNormalization_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), zs(), Ws(t, e, n, a, o, r);
  }
}),
    $s = Tn({
  batchNorm_: Ws
}),
    js = Tn({
  batchNorm2d_: Bs
}),
    Ks = Tn({
  batchNorm3d_: Ps
}),
    Xs = Tn({
  batchNorm4d_: Ls
});
exports.batchNorm4d = Xs;
exports.batchNorm3d = Ks;
exports.batchNorm2d = js;
exports.batchNorm = $s;
exports.batchNormalization = Hs;
exports.batchNormalization4d = qs;
exports.batchNormalization3d = Gs;
exports.batchNormalization2d = Vs;

function Ys(t, e, n, r, o, a) {
  d(t.length === e.rank, function () {
    return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
  });
  var i = t,
      s = e,
      u = !1;
  3 === e.rank && (u = !0, s = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]), i = [1, t[0], t[1], t[2]]);
  var l = i[3],
      c = s.shape[3];
  d(4 === i.length, function () {
    return "Error in conv2dDerInput: inShape must be length 4, but got length " + i.length + ".";
  }), d(4 === s.rank, function () {
    return "Error in conv2dDerInput: dy must be rank 4, but got rank " + s.rank;
  }), d(4 === n.rank, function () {
    return "Error in conv2dDerInput: filter must be rank 4, but got rank " + n.rank;
  }), d(l === n.shape[2], function () {
    return "Error in conv2dDerInput: depth of input (" + l + ") must match input depth for filter " + n.shape[2] + ".";
  }), d(c === n.shape[3], function () {
    return "Error in conv2dDerInput: depth of output (" + c + ") must match output depth for filter " + n.shape[3] + ".";
  }), null != a && d(w(o), function () {
    return "Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var h = rr(i, n.shape, r, 1, o, a),
      p = At.runKernel(function (t, e) {
    var r = t.conv2dDerInput(s, n, h);
    return e([n, s]), r;
  }, {
    dy4D: s,
    filter: n
  }, function (t, e) {
    var n = e[0],
        i = e[1];
    return {
      dy4D: function () {
        return tu(t, n, r, o, "NHWC", 1, a);
      },
      filter: function () {
        return nu(t, i, n.shape, r, o, a);
      }
    };
  });
  return u ? p.as3D(p.shape[1], p.shape[2], p.shape[3]) : p;
}

function Qs(t, e, n, r, o, a) {
  var i = t;
  3 === t.rank && (i = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
  var s = e;
  3 === s.rank && (s = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), d(4 === i.rank, function () {
    return "Error in conv2dDerFilter: input must be rank 4, but got shape " + i.shape + ".";
  }), d(4 === s.rank, function () {
    return "Error in conv2dDerFilter: dy must be rank 4, but got shape " + s.shape + ".";
  }), d(4 === n.length, function () {
    return "Error in conv2dDerFilter: filterShape must be length 4, but got " + n + ".";
  }), d(i.shape[3] === n[2], function () {
    return "Error in conv2dDerFilter: depth of input " + i.shape[3] + ") must match input depth in filter (" + n[2] + ".";
  }), d(s.shape[3] === n[3], function () {
    return "Error in conv2dDerFilter: depth of dy (" + s.shape[3] + ") must match output depth for filter (" + n[3] + ").";
  }), null != a && d(w(o), function () {
    return "Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var u = rr(i.shape, n, r, 1, o, a);
  return At.runKernel(function (t) {
    return t.conv2dDerFilter(i, s, u);
  }, {
    x4D: i,
    dy4D: s
  });
}

function Js(t) {
  var e = function (t) {
    return "number" == typeof t ? [t, t, t] : 2 === t.length ? [t[0], t[1], 1] : t;
  }(t),
      n = e[0],
      r = e[1],
      o = e[2];

  return 1 === n && 1 === r && 1 === o;
}

var Zs = Tn({
  conv1d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NWC"), void 0 === a && (a = 1);
    var s = bn(t, "x", "conv1d"),
        u = bn(e, "filter", "conv1d"),
        l = s,
        c = !1;
    2 === s.rank && (c = !0, l = s.as3D(1, s.shape[0], s.shape[1])), d(3 === l.rank, function () {
      return "Error in conv1d: input must be rank 3, but got rank " + l.rank + ".";
    }), d(3 === u.rank, function () {
      return "Error in conv1d: filter must be rank 3, but got rank " + u.rank + ".";
    }), null != i && d(w(r), function () {
      return "Error in conv1d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    }), d(l.shape[2] === u.shape[1], function () {
      return "Error in conv1d: depth of input (" + l.shape[2] + ") must match input depth for filter " + u.shape[1] + ".";
    }), d(hr(n, a), function () {
      return "Error in conv1D: Either stride or dilation must be 1. Got stride " + n + " and dilation '" + a + "'";
    }), d("NWC" === o, function () {
      return "Error in conv1d: got dataFormat of " + o + " but only NWC is currently supported.";
    });
    var h = u.as4D(1, u.shape[0], u.shape[1], u.shape[2]),
        p = l.as4D(l.shape[0], 1, l.shape[1], l.shape[2]),
        f = tu(p, h, [1, n], r, "NHWC", [1, a], i);
    return c ? f.as2D(f.shape[2], f.shape[3]) : f.as3D(f.shape[0], f.shape[2], f.shape[3]);
  }
}),
    tu = Tn({
  conv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = bn(t, "x", "conv2d"),
        u = bn(e, "filter", "conv2d"),
        l = s,
        c = !1;
    3 === s.rank && (c = !0, l = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), d(4 === l.rank, function () {
      return "Error in conv2d: input must be rank 4, but got rank " + l.rank + ".";
    }), d(4 === u.rank, function () {
      return "Error in conv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), null != i && d(w(r), function () {
      return "Error in conv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    }), d(l.shape[3] === u.shape[2], function () {
      return "Error in conv2d: depth of input (" + l.shape[3] + ") must match input depth for filter " + u.shape[2] + ".";
    }), d(hr(n, a), function () {
      return "Error in conv2D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), d("NHWC" === o, function () {
      return "Error in conv2d: got dataFormat of " + o + " but only NHWC is currently supported.";
    });
    var h = rr(l.shape, u.shape, n, a, r, i),
        p = At.runKernel(function (t, e) {
      var n = t.conv2d(l, u, h);
      return e([u, l]), n;
    }, {
      x: l,
      $filter: u
    }, function (t, e) {
      var o = e,
          i = o[0],
          s = o[1];
      return d(cr(a), function () {
        return "Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      }), {
        x: function () {
          return Ys(s.shape, t, i, n, r);
        },
        $filter: function () {
          return Qs(s, t, i.shape, n, r);
        }
      };
    });
    return c ? p.as3D(p.shape[1], p.shape[2], p.shape[3]) : p;
  }
}),
    eu = Tn({
  conv3d_: function (t, e, n, r, o, a) {
    void 0 === o && (o = "NDHWC"), void 0 === a && (a = [1, 1, 1]);
    var i = bn(t, "x", "conv3d"),
        s = bn(e, "filter", "conv3d"),
        u = i,
        l = !1;
    4 === i.rank && (l = !0, u = i.as5D(1, i.shape[0], i.shape[1], i.shape[2], i.shape[3])), d(5 === u.rank, function () {
      return "Error in conv3d: input must be rank 5, but got rank " + u.rank + ".";
    }), d(5 === s.rank, function () {
      return "Error in conv3d: filter must be rank 5, but got rank " + s.rank + ".";
    }), d(u.shape[4] === s.shape[3], function () {
      return "Error in conv3d: depth of input (" + u.shape[4] + ") must match input depth for filter " + s.shape[3] + ".";
    }), d(function (t, e) {
      return Js(t) || Js(e);
    }(n, a), function () {
      return "Error in conv3D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), d("NDHWC" === o, function () {
      return "Error in conv3d: got dataFormat of " + o + " but only NDHWC is currently supported.";
    });
    var c = or(u.shape, s.shape, n, a, r),
        h = At.runKernel(function (t, e) {
      var n = t.conv3d(u, s, c);
      return e([u, s]), n;
    }, {
      x: u,
      $filter: s
    }, function (t, e) {
      d(Js(a), function () {
        return "Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      });
      var o = e[0],
          i = e[1];
      return {
        x: function () {
          return function (t, e, n, r, o) {
            d(t.length === e.rank, function () {
              return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
            });
            var a = t,
                i = e,
                s = !1;
            4 === e.rank && (s = !0, i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3]), a = [1, t[0], t[1], t[2], t[3]]);
            var u = a[4],
                l = i.shape[4];
            d(5 === a.length, function () {
              return "Error in conv3dDerInput: inShape must be length 5, but got length " + a.length + ".";
            }), d(5 === i.rank, function () {
              return "Error in conv3dDerInput: dy must be rank 5, but got rank " + i.rank;
            }), d(5 === n.rank, function () {
              return "Error in conv3dDerInput: filter must be rank 5, but got rank " + n.rank;
            }), d(u === n.shape[3], function () {
              return "Error in conv3dDerInput: depth of input (" + u + ") must match input depth for filter " + n.shape[3] + ".";
            }), d(l === n.shape[4], function () {
              return "Error in conv3dDerInput: depth of output (" + l + ") must match output depth for filter " + n.shape[4] + ".";
            });
            var c = or(a, n.shape, r, 1, o),
                h = At.runKernel(function (t) {
              return t.conv3dDerInput(i, n, c);
            }, {
              dy5D: i
            });
            return s ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
          }(o.shape, t, i, n, r);
        },
        $filter: function () {
          return function (t, e, n, r, o) {
            var a = t;
            4 === t.rank && (a = t.as5D(1, t.shape[0], t.shape[1], t.shape[2], t.shape[3]));
            var i = e;
            4 === i.rank && (i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3])), d(5 === a.rank, function () {
              return "Error in conv3dDerFilter: input must be rank 5, but got shape " + a.shape + ".";
            }), d(5 === i.rank, function () {
              return "Error in conv3dDerFilter: dy must be rank 5, but got shape " + i.shape + ".";
            }), d(5 === n.length, function () {
              return "Error in conv3dDerFilter: filterShape must be length 5, but got " + n + ".";
            }), d(a.shape[4] === n[3], function () {
              return "Error in conv3dDerFilter: depth of input " + a.shape[4] + ") must match input depth in filter (" + n[3] + ".";
            }), d(i.shape[4] === n[4], function () {
              return "Error in conv3dDerFilter: depth of dy (" + i.shape[4] + ") must match output depth for filter (" + n[4] + ").";
            });
            var s = or(a.shape, n, r, 1, o);
            return At.runKernel(function (t) {
              return t.conv3dDerFilter(a, i, s);
            }, {
              x5D: a,
              dy5D: i
            });
          }(o, t, i.shape, n, r);
        }
      };
    });
    return l ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
  }
}),
    nu = Tn({
  conv2dDerFilter_: Qs
}),
    ru = Tn({
  depthwiseConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = bn(t, "x", "depthwiseConv2d"),
        u = bn(e, "filter", "depthwiseConv2d"),
        l = s,
        c = !1;
    3 === s.rank && (c = !0, l = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), d(4 === l.rank, function () {
      return "Error in depthwiseConv2d: input must be rank 4, but got rank " + l.rank + ".";
    }), d(4 === u.rank, function () {
      return "Error in depthwiseConv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), d(l.shape[3] === u.shape[2], function () {
      return "Error in depthwiseConv2d: number of input channels (" + l.shape[3] + ") must match the inChannels dimension in filter " + u.shape[2] + ".";
    }), null == a && (a = [1, 1]), d(hr(n, a), function () {
      return "Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), null != i && d(w(r), function () {
      return "Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    });
    var h = rr(l.shape, u.shape, n, a, r, i, !0),
        p = At.runKernel(function (t, e) {
      var n = t.depthwiseConv2D(l, u, h);
      return e([l, u]), n;
    }, {
      x: l,
      $filter: u
    }, function (t, e) {
      d(cr(a), function () {
        return "Error in gradient of depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '" + a + "'";
      });
      var n = e[0],
          r = e[1];
      return {
        x: function () {
          return function (t, e, n, r) {
            var o = e,
                a = !1;
            3 === e.rank && (a = !0, o = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]));
            var i = At.runKernel(function (t) {
              return t.depthwiseConv2DDerInput(o, n, r);
            }, {
              dy4D: o
            });
            return a ? i.as3D(i.shape[1], i.shape[2], i.shape[3]) : i;
          }(n.shape, t, r, h);
        },
        $filter: function () {
          return function (t, e, n, r) {
            var o = t;
            3 === t.rank && (o = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
            var a = e;
            return 3 === a.rank && (a = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), At.runKernel(function (t) {
              return t.depthwiseConv2DDerFilter(o, a, r);
            }, {
              x4D: o,
              dy4D: a
            });
          }(n, t, r.shape, h);
        }
      };
    });
    return c ? p.as3D(p.shape[1], p.shape[2], p.shape[3]) : p;
  }
}),
    ou = Tn({
  separableConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = [1, 1]), void 0 === i && (i = "NHWC");
    var s = bn(t, "x", "separableConv2d"),
        u = bn(e, "depthwiseFilter", "separableConv2d"),
        l = bn(n, "pointwiseFilter", "separableConv2d"),
        c = s,
        h = !1;
    if (3 === s.rank && (h = !0, c = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), "NCHW" === i) throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");
    d(4 === c.rank, function () {
      return "Error in separableConv2d: input must be rank 4, but got rank " + c.rank + ".";
    }), d(4 === u.rank, function () {
      return "Error in separableConv2d: depthwise filter must be rank 4, but got rank " + u.rank + ".";
    }), d(4 === l.rank, function () {
      return "Error in separableConv2d: pointwise filter must be rank 4, but got rank " + u.rank + ".";
    }), d(1 === l.shape[0], function () {
      return "Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got " + l.shape[0] + ".";
    }), d(1 === l.shape[1], function () {
      return "Error in separableConv2d: the second dimension of pointwise filter must be 1, but got " + l.shape[1] + ".";
    });
    var p = u.shape[2],
        f = u.shape[3];
    d(l.shape[2] === p * f, function () {
      return "Error in separableConv2d: the third dimension of pointwise filter must be " + p * f + ", but got " + l.shape[2] + ".";
    });
    var v = ru(c, u, r, o, i, a),
        m = tu(v, l, 1, "valid", i);
    return h ? m.as3D(m.shape[1], m.shape[2], m.shape[3]) : m;
  }
}),
    au = Tn({
  conv2dTranspose_: function (t, e, n, r, o, a) {
    return Ys(n, bn(t, "x", "conv2dTranspose"), bn(e, "filter", "conv2dTranspose"), r, o, a);
  }
});
exports.conv2dTranspose = au;
exports.separableConv2d = ou;
exports.depthwiseConv2d = ru;
exports.conv2dDerFilter = nu;
exports.conv3d = eu;
exports.conv2d = tu;
exports.conv1d = Zs;
var iu = Tn({
  matMul_: function (t, e, n, r) {
    var o;
    void 0 === n && (n = !1), void 0 === r && (r = !1);
    var a = bn(t, "a", "matMul"),
        i = bn(e, "b", "matMul");
    o = Ct(a, i), a = o[0], i = o[1];
    var s = n ? a.shape[a.rank - 2] : a.shape[a.rank - 1],
        u = r ? i.shape[i.rank - 1] : i.shape[i.rank - 2],
        l = n ? a.shape[a.rank - 1] : a.shape[a.rank - 2],
        c = r ? i.shape[i.rank - 2] : i.shape[i.rank - 1],
        h = a.shape.slice(0, -2),
        p = i.shape.slice(0, -2),
        f = y(h),
        v = y(p);
    d(a.rank >= 2 && i.rank >= 2 && a.rank === i.rank, function () {
      return "Error in matMul: inputs must have the same rank of at least 2, got ranks " + a.rank + " and " + i.rank + ".";
    }), d(x(h, p), function () {
      return "Error in matMul: outer dimensions (" + h + ") and (" + p + ") of Tensors with shapes " + a.shape + " and " + i.shape + " must match.";
    }), d(s === u, function () {
      return "Error in matMul: inner shapes (" + s + ") and (" + u + ") of Tensors with shapes " + a.shape + " and " + i.shape + " and transposeA=" + n + " and transposeB=" + r + " must match.";
    });
    var m = a.shape.slice(0, -2).concat([l, c]),
        g = n ? a.as3D(f, s, l) : a.as3D(f, l, s),
        w = r ? i.as3D(v, c, u) : i.as3D(v, u, c);
    return At.runKernel(function (t, e) {
      var o = t.batchMatMul(g, w, n, r);
      return e([g, w]), o;
    }, {
      $a: g,
      $b: w
    }, function (t, e) {
      var o = e,
          a = o[0],
          i = o[1];
      return n || r ? !n && r ? {
        $a: function () {
          return t.matMul(i, !1, !1);
        },
        $b: function () {
          return t.matMul(a, !0, !1);
        }
      } : n && !r ? {
        $a: function () {
          return i.matMul(t, !1, !0);
        },
        $b: function () {
          return a.matMul(t, !1, !1);
        }
      } : {
        $a: function () {
          return i.matMul(t, !0, !0);
        },
        $b: function () {
          return t.matMul(a, !0, !0);
        }
      } : {
        $a: function () {
          return t.matMul(i, !1, !0);
        },
        $b: function () {
          return a.matMul(t, !0, !1);
        }
      };
    }).reshape(m);
  }
}),
    su = Tn({
  dot_: function (t, e) {
    var n = bn(t, "t1", "dot"),
        r = bn(e, "t2", "dot");
    d(!(1 !== n.rank && 2 !== n.rank || 1 !== r.rank && 2 !== r.rank), function () {
      return "Error in dot: inputs must all be rank 1 or 2, but got ranks " + n.rank + " and " + r.rank + ".";
    });
    var o = 1 === n.rank ? n.size : n.shape[1],
        a = 1 === r.rank ? r.size : r.shape[0];
    return d(o === a, function () {
      return "Error in dot: inner dimensions of inputs must match, but got " + o + " and " + a + ".";
    }), 1 === n.rank && 1 === r.rank ? n.as2D(1, -1).matMul(r.as2D(-1, 1)).asScalar() : 1 === n.rank && 2 === r.rank ? n.as2D(1, -1).matMul(r.as2D(r.shape[0], r.shape[1])).as1D() : 2 === n.rank && 1 === r.rank ? n.matMul(r.as2D(-1, 1)).as1D() : n.matMul(r.as2D(r.shape[0], r.shape[1]));
  }
}),
    uu = Tn({
  outerProduct_: function (t, e) {
    var n = bn(t, "v1", "outerProduct"),
        r = bn(e, "v2", "outerProduct");
    return d(1 === n.rank && 1 === r.rank, function () {
      return "Error in outerProduct: inputs must be rank 1, but got ranks " + n.rank + " and " + r.rank + ".";
    }), n.as2D(-1, 1).matMul(r.as2D(1, -1));
  }
});
exports.outerProduct = uu;
exports.dot = su;
exports.matMul = iu;
var lu = Tn({
  reverse_: function (t, e) {
    var n = bn(t, "x", "reverse");
    if (0 === n.rank) return n.clone();
    var r = S(e, n.shape);
    return At.runKernel(function (t) {
      return t.reverse(n, r);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.reverse(r);
        }
      };
    }).reshapeAs(n);
  }
}),
    cu = Tn({
  reverse1d_: function (t) {
    var e = bn(t, "x", "reverse");
    return d(1 === e.rank, function () {
      return "Error in reverse1D: x must be rank 1 but got rank " + e.rank + ".";
    }), lu(e, 0);
  }
}),
    hu = Tn({
  reverse2d_: function (t, e) {
    var n = bn(t, "x", "reverse");
    return d(2 === n.rank, function () {
      return "Error in reverse2D: x must be rank 2 but got rank " + n.rank + ".";
    }), lu(n, e);
  }
}),
    pu = Tn({
  reverse3d_: function (t, e) {
    var n = bn(t, "x", "reverse");
    return d(3 === n.rank, function () {
      return "Error in reverse3D: x must be rank 3 but got rank " + n.rank + ".";
    }), lu(n, e);
  }
}),
    fu = Tn({
  reverse4d_: function (t, e) {
    var n = bn(t, "x", "reverse");
    return d(4 === n.rank, function () {
      return "Error in reverse4D: x must be rank 4 but got rank " + n.rank + ".";
    }), lu(n, e);
  }
});
exports.reverse4d = fu;
exports.reverse3d = pu;
exports.reverse2d = hu;
exports.reverse1d = cu;
exports.reverse = lu;

function du(t, e, n, r, o, a) {
  var i = bn(t, "x", "maxPool"),
      s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), null == r && (r = [1, 1]), d(4 === s.rank, function () {
    return "Error in maxPool: input must be rank 4 but got rank " + s.rank + ".";
  }), d(hr(n, r), function () {
    return "Error in maxPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  }), null != a && d(w(o), function () {
    return "Error in maxPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var l = nr(s.shape, e, n, r, o, a),
      c = At.runKernel(function (t, e) {
    var n = t.maxPool(s, l);
    return e([s, n]), n;
  }, {
    x: s
  }, function (t, a) {
    var i = a[0],
        s = a[1];
    return {
      x: function () {
        return function (t, e, n, r, o, a, i, s) {
          var u = bn(t, "dy", "maxPoolBackprop"),
              l = bn(e, "input", "maxPoolBackprop"),
              c = bn(n, "output", "maxPoolBackprop");
          d(l.rank === u.rank, function () {
            return "Rank of input (" + l.rank + ") does not match rank of dy (" + u.rank + ")";
          }), null == a && (a = [1, 1]), d(hr(o, a), function () {
            return "Error in maxPoolBackProp: Either strides or dilations must be 1. Got strides " + o + " and dilations '" + a + "'";
          }), d(4 === u.rank, function () {
            return "Error in maxPoolBackprop: dy must be rank 4 but got rank " + u.rank + ".";
          }), d(4 === l.rank, function () {
            return "Error in maxPoolBackprop: input must be rank 4 but got rank " + l.rank + ".";
          }), null != s && d(w(i), function () {
            return "Error in maxPoolBackprop: pad must be an integer when using, dimRoundingMode " + s + " but got pad " + i + ".";
          });
          var h = nr(l.shape, r, o, a, i, s);
          return At.runKernel(function (t) {
            return t.maxPoolBackprop(u, l, c, h);
          }, {
            $dy: u,
            $input: l
          });
        }(t, i, s, e, n, r, o);
      }
    };
  });
  return u ? c.as3D(c.shape[1], c.shape[2], c.shape[3]) : c;
}

function vu(t, e, n, r, o, a) {
  var i = bn(t, "x", "avgPool", "float32");
  null == r && (r = [1, 1]), d(hr(n, r), function () {
    return "Error in avgPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  });
  var s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), d(4 === s.rank, function () {
    return "Error in avgPool: x must be rank 4 but got rank " + s.rank + ".";
  }), null != a && d(w(o), function () {
    return "Error in avgPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var l = nr(s.shape, e, n, r, o, a),
      c = At.runKernel(function (t) {
    return t.avgPool(s, l);
  }, {
    x: s
  }, function (t) {
    return {
      x: function () {
        return function (t, e, n, r, o, a) {
          var i = bn(t, "dy", "avgPoolBackprop"),
              s = bn(e, "input", "avgPoolBackprop");
          d(s.rank === i.rank, function () {
            return "Rank of input (" + s.rank + ") does not match rank of dy (" + i.rank + ")";
          }), null == o && (o = [1, 1]), d(hr(r, o), function () {
            return "Error in avgPoolBackprop: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + o + "'";
          });
          var u = s,
              l = i,
              c = !1;
          3 === s.rank && (c = !0, u = s.as4D(1, s.shape[0], s.shape[1], s.shape[2]), l = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), d(4 === l.rank, function () {
            return "Error in avgPoolBackprop: dy must be rank 4 but got rank " + l.rank + ".";
          }), d(4 === u.rank, function () {
            return "Error in avgPoolBackprop: input must be rank 4 but got rank " + u.rank + ".";
          });
          var h = nr(u.shape, n, r, o, a),
              p = At.runKernel(function (t) {
            return t.avgPoolBackprop(l, u, h);
          }, {
            dy4D: l,
            input4D: u
          });
          return c ? p.as3D(p.shape[1], p.shape[2], p.shape[3]) : p;
        }(t, s, e, n, r, o);
      }
    };
  });
  return c = c.cast(i.dtype), u ? c.as3D(c.shape[1], c.shape[2], c.shape[3]) : c;
}

var mu = Tn({
  maxPool_: function (t, e, n, r, o) {
    return du(t, e, n, 1, r, o);
  }
}),
    gu = Tn({
  avgPool_: function (t, e, n, r, o) {
    return vu(t, e, n, 1, r, o);
  }
}),
    yu = Tn({
  pool_: function (t, e, n, r, o, a) {
    null == o && (o = [1, 1]), null == a && (a = 1), 0 === r && (r = "valid");
    var i = bn(t, "x", "maxPool"),
        s = i,
        u = !1;
    3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), d(hr(a, o), function () {
      return "Error in pool: Either strides or dilations must be 1. Got strides " + a + " and dilations '" + o + "'";
    });
    var l,
        c = nr(s.shape, e, a, o, r),
        h = [c.dilationHeight, c.dilationWidth];
    l = "same" === r ? function (t, e) {
      var n = t.map(function (t, n) {
        return t + (t - 1) * (e[n] - 1);
      }).map(function (t) {
        return t - 1;
      }),
          r = n.map(function (t) {
        return Math.floor(t / 2);
      }),
          o = n.map(function (t, e) {
        return t - r[e];
      });
      return n.map(function (t, e) {
        return [r[e], o[e]];
      });
    }([c.filterHeight, c.filterWidth], h) : [[0, 0], [0, 0]];

    var p = 1 === h[0] && 1 === h[1],
        f = function (t, e, n) {
      var r = n.map(function (t) {
        return t[0];
      }),
          o = n.map(function (t) {
        return t[1];
      }),
          a = t.concat(r, o),
          i = e.map(function (t, e) {
        return (t - a[e] % t) % t;
      }),
          s = o.map(function (t, e) {
        return t + i[e];
      }),
          u = e.map(function (t, e) {
        return [r[e], s[e]];
      }),
          l = e.map(function (t, e) {
        return [0, i[e]];
      });
      return [u, l];
    }([c.inHeight, c.inWidth], h, l),
        v = f[0],
        m = f[1],
        g = p ? r : "valid",
        y = p ? s : so(s, h, v),
        x = ("avg" === n ? function () {
      return vu(y, e, a, 1, g);
    } : function () {
      return du(y, e, a, 1, g);
    })(),
        w = p ? x : Gr(x, h, m);

    return u ? w.as3D(w.shape[1], w.shape[2], w.shape[3]) : w;
  }
});
exports.pool = yu;
exports.avgPool = gu;
exports.maxPool = mu;
var xu = Tn({
  slice_: function (t, e, n) {
    var r,
        o,
        a = bn(t, "x", "slice");
    if (0 === a.rank) throw new Error("Slicing scalar is not possible");
    r = "number" == typeof e ? [e].concat(new Array(a.rank - 1).fill(0)) : e.length < a.rank ? e.concat(new Array(a.rank - e.length).fill(0)) : e.slice(), o = (o = null == n ? new Array(a.rank).fill(-1) : "number" == typeof n ? [n].concat(new Array(a.rank - 1).fill(-1)) : n.length < a.rank ? n.concat(new Array(a.rank - n.length).fill(-1)) : n).map(function (t, e) {
      return t >= 0 ? t : (d(-1 === t, function () {
        return "Bad value in size";
      }), a.shape[e] - r[e]);
    }), function (t, e, n) {
      d(t.rank === e.length, function () {
        return "Error in slice" + t.rank + "D: Length of begin " + e + " must match the rank of the array (" + t.rank + ").";
      }), d(t.rank === n.length, function () {
        return "Error in slice" + t.rank + "D: Length of size " + n + " must match the rank of the array (" + t.rank + ").";
      });

      for (var r = function (r) {
        d(e[r] + n[r] <= t.shape[r], function () {
          return "Error in slice" + t.rank + "D: begin[" + r + "] + size[" + r + "] (" + (e[r] + n[r]) + ") would overflow input.shape[" + r + "] (" + t.shape[r] + ")";
        });
      }, o = 0; o < t.rank; ++o) r(o);
    }(a, r, o);
    var i = a.shape;
    return At.runKernel(function (t) {
      return t.slice(a, r, o);
    }, {
      $x: a
    }, function (t) {
      for (var e = [], n = 0; n < t.rank; n++) e.push([r[n], i[n] - r[n] - o[n]]);

      return {
        $x: function () {
          return t.pad(e);
        }
      };
    });
  }
}),
    wu = Tn({
  slice1d_: function (t, e, n) {
    var r = bn(t, "x", "slice1d");
    return d(1 === r.rank, function () {
      return "slice1d expects a rank-1 tensor, but got a rank-" + r.rank + " tensor";
    }), xu(r, [e], [n]);
  }
}),
    bu = Tn({
  slice2d_: function (t, e, n) {
    var r = bn(t, "x", "slice2d");
    return d(2 === r.rank, function () {
      return "slice2d expects a rank-2 tensor, but got a rank-" + r.rank + " tensor";
    }), xu(r, e, n);
  }
}),
    Cu = Tn({
  slice3d_: function (t, e, n) {
    var r = bn(t, "x", "slice3d");
    return d(3 === r.rank, function () {
      return "slice3d expects a rank-3 tensor, but got a rank-" + r.rank + " tensor";
    }), xu(r, e, n);
  }
}),
    Eu = Tn({
  slice4d_: function (t, e, n) {
    var r = bn(t, "x", "slice4d");
    return d(4 === r.rank, function () {
      return "slice4d expects a rank-4 tensor, but got a rank-" + r.rank + " tensor";
    }), xu(r, e, n);
  }
});
exports.slice4d = Eu;
exports.slice3d = Cu;
exports.slice2d = bu;
exports.slice1d = wu;
exports.slice = xu;

function Ru(t, e, n, r, o) {
  return e.rank < n.rank && (e = e.reshape(en(e.shape, r))), t.rank < n.rank && (t = t.reshape(en(t.shape, r))), {
    $x: function () {
      var r = t.mul(n.equal(e).cast(t.dtype));
      return null == o ? r : r.transpose(o);
    }
  };
}

var Iu = Tn({
  all_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "all", "bool"),
        o = S(e, r.shape),
        a = o,
        i = rn(a, r.rank);
    null != i && (r = r.transpose(i), a = an(a.length, r.rank));
    var s = At.runKernel(function (t) {
      return t.all(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = en(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Su = Tn({
  any_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "any", "bool"),
        o = S(e, r.shape),
        a = o,
        i = rn(a, r.rank);
    null != i && (r = r.transpose(i), a = an(a.length, r.rank));
    var s = At.runKernel(function (t) {
      return t.any(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = en(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Nu = Tn({
  argMax_: function (t, e) {
    void 0 === e && (e = 0);
    var n = bn(t, "x", "argMax");
    null == e && (e = 0);
    var r = S(e, n.shape),
        o = rn(r, n.rank);
    return null != o && (n = n.transpose(o), r = an(r.length, n.rank)), At.runKernel(function (t, e) {
      var o = t.argMax(n, r[0]);
      return e([n]), o;
    }, {
      $x: n
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Yn(n);
        }
      };
    });
  }
}),
    ku = Tn({
  argMin_: function (t, e) {
    void 0 === e && (e = 0);
    var n = bn(t, "x", "argMin");
    null == e && (e = 0);
    var r = S(e, n.shape),
        o = rn(r, n.rank);
    return null != o && (n = n.transpose(o), r = an(r.length, n.rank)), At.runKernel(function (t, e) {
      var o = t.argMin(n, r[0]);
      return e([n]), o;
    }, {
      $x: n
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Yn(n);
        }
      };
    });
  }
}),
    Au = Tn({
  logSumExp_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "logSumExp"),
        o = S(e, r.shape),
        a = r.max(o, !0),
        i = r.sub(a).exp().sum(o).log(),
        s = a.reshape(i.shape).add(i);

    if (n) {
      var u = en(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Tu = Tn({
  max_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "max"),
        o = r,
        a = S(e, r.shape),
        i = a,
        s = rn(i, r.rank);
    null != s && (r = r.transpose(s), i = an(i.length, r.rank));
    var u = At.runKernel(function (t, e) {
      var n = t.max(r, i);
      return e([o, n]), n;
    }, {
      $x: r
    }, function (t, e) {
      return Ru(t, e[1], e[0], a, s);
    });

    if (n) {
      var l = en(u.shape, a);
      u = u.reshape(l);
    }

    return u;
  }
}),
    Du = Tn({
  mean_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "mean"),
        o = S(e, r.shape),
        a = y(tn(r.shape, o)[1]);
    return kn(function (t) {
      var r = Pn(a);
      return {
        value: (r.dtype === t.dtype ? t : t.cast(r.dtype)).div(r).sum(e, n),
        gradFunc: function (e) {
          var n = t.shape.slice();
          return o.forEach(function (t) {
            n[t] = 1;
          }), e.reshape(n).mul(qn(t.shape, "float32")).div(a);
        }
      };
    })(r);
  }
}),
    _u = Tn({
  min_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "min"),
        o = r,
        a = S(e, r.shape),
        i = a,
        s = rn(i, r.rank);
    null != s && (r = r.transpose(s), i = an(i.length, r.rank));
    var u = At.runKernel(function (t, e) {
      var n = t.min(r, i);
      return e([o, n]), n;
    }, {
      $x: r
    }, function (t, e) {
      return Ru(t, e[1], e[0], a, s);
    });

    if (n) {
      var l = en(u.shape, a);
      u = u.reshape(l);
    }

    return u;
  }
}),
    Ou = Tn({
  moments_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = S(e, (t = bn(t, "x", "moments")).shape),
        o = t.mean(r, n),
        a = o.shape;
    n || (a = en(o.shape, r));
    var i = t.toFloat().sub(o.reshape(a)).square();
    return {
      mean: o,
      variance: i.mean(r, n)
    };
  }
}),
    Mu = Tn({
  sum_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "sum");
    "bool" === r.dtype && (r = r.toInt());
    var o = S(e, r.shape);
    return kn(function (t) {
      var e = rn(o, t.rank),
          r = o,
          a = t;
      null != e && (a = t.transpose(e), r = an(r.length, t.rank));
      var i = At.runKernel(function (t) {
        return t.sum(a, r);
      }, {
        permutedX: a
      });

      if (n) {
        var s = en(i.shape, o);
        i = i.reshape(s);
      }

      return {
        value: i,
        gradFunc: function (e) {
          var n = t.shape.slice();
          return o.forEach(function (t) {
            n[t] = 1;
          }), e.reshape(n).mul(qn(t.shape, "float32"));
        }
      };
    })(r);
  }
}),
    Fu = Tn({
  prod_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = bn(t, "x", "prod");
    "bool" === r.dtype && (r = r.toInt());
    var o = S(e, r.shape),
        a = rn(o, r.rank),
        i = o,
        s = r;
    null != a && (s = r.transpose(a), i = an(i.length, r.rank));
    var u = At.runKernel(function (t) {
      return t.prod(s, i);
    }, {
      permutedX: s
    });

    if (n) {
      var l = en(u.shape, o);
      u = u.reshape(l);
    }

    return u;
  }
});

exports.prod = Fu;
exports.sum = Mu;
exports.moments = Ou;
exports.min = _u;
exports.mean = Du;
exports.max = Tu;
exports.logSumExp = Au;
exports.argMin = ku;
exports.argMax = Nu;
exports.any = Su;
exports.all = Iu;
var Bu = Tn({
  equal_: function (t, e) {
    var n,
        r = bn(t, "a", "equal"),
        o = bn(e, "b", "equal");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t) {
      return t.equal(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    Pu = Tn({
  equalStrict_: function (t, e) {
    var n = bn(t, "a", "equalStrict"),
        r = bn(e, "b", "equalStrict");
    return v(n.shape, r.shape, "Error in equalStrict: "), n.equal(r);
  }
}),
    Lu = Tn({
  greater_: function (t, e) {
    var n,
        r = bn(t, "a", "greater"),
        o = bn(e, "b", "greater");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t) {
      return t.greater(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    Wu = Tn({
  greaterEqual_: function (t, e) {
    var n,
        r = bn(t, "a", "greaterEqual"),
        o = bn(e, "b", "greaterEqual");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t, e) {
      var n = t.greaterEqual(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return Yn(n);
        },
        $b: function () {
          return Yn(r);
        }
      };
    });
  }
}),
    Uu = Tn({
  greaterEqualStrict_: function (t, e) {
    var n = bn(t, "a", "greaterEqualStrict"),
        r = bn(e, "b", "greaterEqualStrict");
    return v(n.shape, r.shape, "Error in greaterEqualStrict: "), n.greaterEqual(r);
  }
}),
    zu = Tn({
  greaterStrict_: function (t, e) {
    var n = bn(t, "a", "greaterStrict"),
        r = bn(e, "b", "greaterStrict");
    return v(n.shape, r.shape, "Error in greaterStrict: "), n.greater(r);
  }
}),
    Vu = Tn({
  less_: function (t, e) {
    var n,
        r = bn(t, "a", "less"),
        o = bn(e, "b", "less");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t) {
      return t.less(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    Gu = Tn({
  lessEqual_: function (t, e) {
    var n,
        r = bn(t, "a", "lessEqual"),
        o = bn(e, "b", "lessEqual");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t) {
      return t.lessEqual(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    qu = Tn({
  lessEqualStrict_: function (t, e) {
    var n = bn(t, "a", "lessEqualStrict"),
        r = bn(e, "b", "lessEqualStrict");
    return v(n.shape, r.shape, "Error in lessEqualStrict: "), n.lessEqual(r);
  }
}),
    Hu = Tn({
  lessStrict_: function (t, e) {
    var n = bn(t, "a", "lessStrict"),
        r = bn(e, "b", "lessStrict");
    return v(n.shape, r.shape, "Error in lessStrict: "), n.less(r);
  }
}),
    $u = Tn({
  notEqual_: function (t, e) {
    var n,
        r = bn(t, "a", "notEqual"),
        o = bn(e, "b", "notEqual");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t) {
      return t.notEqual(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    ju = Tn({
  notEqualStrict_: function (t, e) {
    var n = bn(t, "a", "notEqualStrict"),
        r = bn(e, "b", "notEqualStrict");
    return v(n.shape, r.shape, "Error in notEqualStrict: "), n.notEqual(r);
  }
});
exports.notEqualStrict = ju;
exports.notEqual = $u;
exports.lessStrict = Hu;
exports.lessEqualStrict = qu;
exports.lessEqual = Gu;
exports.less = Vu;
exports.greaterStrict = zu;
exports.greaterEqualStrict = Uu;
exports.greaterEqual = Wu;
exports.greater = Lu;
exports.equalStrict = Pu;
exports.equal = Bu;
var Ku = Tn({
  add_: function (t, e) {
    var n,
        r = bn(t, "a", "add"),
        o = bn(e, "b", "add");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t) {
      return t.add(r, o);
    }, {
      $a: r,
      $b: o
    }, function (t) {
      return {
        $a: function () {
          var e = t,
              n = tr(r.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
        },
        $b: function () {
          var e = t,
              n = tr(o.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(o.shape);
        }
      };
    });
  }
}),
    Xu = Tn({
  addN_: function (t) {
    d(Array.isArray(t), function () {
      return "The argument passed to tf.addN() must be a list of tensors";
    }), d(t.length >= 1, function () {
      return "Must pass at least one tensor to tf.addN(), but got " + t.length;
    });
    var e = t.map(function (t, e) {
      return bn(t, "tensors" + e, "addN");
    }),
        n = e[0];
    e.forEach(function (t) {
      if (t.dtype !== n.dtype) throw new Error("All tensors passed to tf.addN() must have the same dtype");
    }), e.forEach(function (t) {
      if (!x(t.shape, n.shape)) throw new Error("All tensors passed to tf.addN() must have the same shape");
    });
    var r = e;
    return At.runKernel(function (t) {
      return t.addN(e);
    }, r, function (t) {
      var n = {};
      return e.forEach(function (e, r) {
        n[r] = function () {
          return t.clone();
        };
      }), n;
    });
  }
}),
    Yu = Tn({
  addStrict_: function (t, e) {
    var n = bn(t, "a", "addStrict"),
        r = bn(e, "b", "addStrict");
    return v(n.shape, r.shape, "Error in addStrict: "), n.add(r);
  }
}),
    Qu = Tn({
  atan2_: function (t, e) {
    var n,
        r = bn(t, "a", "atan2"),
        o = bn(e, "b", "atan2");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t, e) {
      var n = t.atan2(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = Ku(n.square(), r.square()),
              o = t.mul(r.div(e)),
              i = tr(n.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(n.shape);
        },
        $b: function () {
          var e = Ku(n.square(), r.square()),
              o = xs(t.mul(n.div(e))),
              i = tr(r.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(r.shape);
        }
      };
    });
  }
}),
    Ju = Tn({
  div_: function (t, e) {
    var n,
        r = bn(t, "a", "div"),
        o = bn(e, "b", "div");
    if (n = Ct(r, o), r = n[0], o = n[1], "int32" === r.dtype && "int32" === o.dtype) return tl(r, o);
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t, e) {
      var n = t.realDivide(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.div(r.toFloat()),
              o = tr(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = tr(r.shape, a);
          o.length > 0 && (e = e.sum(o).reshape(r.shape));
          var i = r.square();
          return e.div(i.toFloat()).neg();
        }
      };
    });
  }
}),
    Zu = Tn({
  divStrict_: function (t, e) {
    var n = bn(t, "a", "div"),
        r = bn(e, "b", "div");
    return v(n.shape, r.shape, "Error in divideStrict: "), n.div(r);
  }
}),
    tl = Tn({
  floorDiv_: function (t, e) {
    var n,
        r = bn(t, "a", "floorDiv"),
        o = bn(e, "b", "floorDiv");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t, e) {
      var n = t.floorDiv(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.div(r.toFloat()),
              o = tr(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = tr(r.shape, a);
          o.length > 0 && (e = e.sum(o).reshape(r.shape));
          var i = r.square();
          return e.div(i.toFloat()).neg();
        }
      };
    });
  }
}),
    el = Tn({
  maximum_: function (t, e) {
    var n,
        r = bn(t, "a", "maximum"),
        o = bn(e, "b", "maximum");
    return n = Ct(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), er(r.shape, o.shape), At.runKernel(function (t, e) {
      var n = t.maximum(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return t.mul(n.greaterEqual(r).toFloat());
        },
        $b: function () {
          return t.mul(n.less(r).toFloat());
        }
      };
    });
  }
}),
    nl = Tn({
  maximumStrict_: function (t, e) {
    var n = bn(t, "a", "maximumStrict"),
        r = bn(e, "b", "maximumStrict");
    return v(n.shape, r.shape, "Error in maximumStrict: "), n.maximum(r);
  }
}),
    rl = Tn({
  minimum_: function (t, e) {
    var n,
        r = bn(t, "a", "minimum"),
        o = bn(e, "b", "minimum");
    return n = Ct(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), er(r.shape, o.shape), At.runKernel(function (t, e) {
      var n = t.minimum(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return t.mul(n.lessEqual(r).toFloat());
        },
        $b: function () {
          return t.mul(n.greater(r).toFloat());
        }
      };
    });
  }
}),
    ol = Tn({
  minimumStrict_: function (t, e) {
    var n = bn(t, "a", "minimumStrict"),
        r = bn(e, "b", "minimumStrict");
    return v(n.shape, r.shape, "Error in minimumStrict: "), n.minimum(r);
  }
}),
    al = Tn({
  mod_: function (t, e) {
    var n,
        r = bn(t, "a", "mod"),
        o = bn(e, "b", "mod");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t, e) {
      var n = t.mod(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = tr(n.shape, a);
          return e.length > 0 ? t.sum(e).reshape(n.shape) : t;
        },
        $b: function () {
          var e = t.mul(n.div(r).floor().neg()),
              o = tr(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    });
  }
}),
    il = Tn({
  modStrict_: function (t, e) {
    var n = bn(t, "a", "modStrict"),
        r = bn(e, "b", "modStrict");
    return v(n.shape, r.shape, "Error in modStrict: "), n.mod(r);
  }
}),
    sl = Tn({
  mul_: function (t, e) {
    var n,
        r = bn(t, "a", "mul"),
        o = bn(e, "b", "mul");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t, e) {
      var n = t.multiply(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.mul(r.toFloat()),
              o = tr(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = tr(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    });
  }
}),
    ul = Tn({
  mulStrict_: function (t, e) {
    var n = bn(t, "a", "mul"),
        r = bn(e, "b", "mul");
    return v(n.shape, r.shape, "Error in multiplyStrict: "), n.mul(r);
  }
}),
    ll = Tn({
  pow_: function (t, e) {
    var n = bn(t, "base", "pow"),
        r = bn(e, "exp", "pow"),
        o = er(n.shape, r.shape);
    return t = n.cast(wt(n.dtype, r.dtype)), e = r.cast(wt(n.dtype, r.dtype)), At.runKernel(function (t, e) {
      var o = t.pow(n, r);
      return e([n, r, o]), o;
    }, {
      $base: n,
      $exp: r
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          a = e[2];
      return {
        $base: function () {
          var e = r.toFloat(),
              a = t.mul(e.mul(n.pow(e.sub(Pn(1))))),
              i = tr(n.shape, o);
          return i.length > 0 && (a = a.sum(i)), a.reshape(n.shape);
        },
        $exp: function () {
          var e = n.greater(0),
              i = n.log().where(e, Yn(n)),
              s = t.mul(a.mul(i)),
              u = tr(r.shape, o);
          return u.length > 0 && (s = s.sum(u)), s.reshape(r.shape);
        }
      };
    });
  }
}),
    cl = Tn({
  powStrict_: function (t, e) {
    return v(t.shape, e.shape, "Error in powStrict: "), t.pow(e);
  }
}),
    hl = Tn({
  squaredDifference_: function (t, e) {
    var n,
        r = bn(t, "a", "squaredDifference"),
        o = bn(e, "b", "squaredDifference");
    return n = Ct(r, o), r = n[0], o = n[1], er(r.shape, o.shape), At.runKernel(function (t, e) {
      var n = t.squaredDifference(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = Pn(2);
      return {
        $a: function () {
          return t.mul(n.sub(r).mul(o));
        },
        $b: function () {
          return t.mul(r.sub(n).mul(o));
        }
      };
    });
  }
}),
    pl = Tn({
  squaredDifferenceStrict_: function (t, e) {
    var n = bn(t, "a", "squaredDifferenceStrict"),
        r = bn(e, "b", "squaredDifferenceStrict");
    return v(n.shape, r.shape, "Error in squaredDifferenceStrict: "), n.squaredDifference(r);
  }
}),
    fl = Tn({
  sub_: function (t, e) {
    var n,
        r = bn(t, "a", "sub"),
        o = bn(e, "b", "sub");
    n = Ct(r, o), r = n[0], o = n[1];
    var a = er(r.shape, o.shape);
    return At.runKernel(function (t) {
      return t.subtract(r, o);
    }, {
      $a: r,
      $b: o
    }, function (t) {
      return {
        $a: function () {
          var e = t,
              n = tr(r.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
        },
        $b: function () {
          var e = t,
              n = tr(o.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.neg().reshape(o.shape);
        }
      };
    });
  }
}),
    dl = Tn({
  subStrict_: function (t, e) {
    var n = bn(t, "a", "subStrict"),
        r = bn(e, "b", "subStrict");
    return v(n.shape, r.shape, "Error in subStrict: "), n.sub(r);
  }
});
exports.subStrict = dl;
exports.sub = fl;
exports.squaredDifferenceStrict = pl;
exports.squaredDifference = hl;
exports.powStrict = cl;
exports.pow = ll;
exports.mulStrict = ul;
exports.mul = sl;
exports.modStrict = il;
exports.mod = al;
exports.minimumStrict = ol;
exports.minimum = rl;
exports.maximumStrict = nl;
exports.maximum = el;
exports.floorDiv = tl;
exports.divStrict = Zu;
exports.div = Ju;
exports.atan2 = Qu;
exports.addStrict = Yu;
exports.addN = Xu;
exports.add = Ku;

var vl = Tn({
  logicalAnd_: function (t, e) {
    var n = bn(t, "a", "logicalAnd", "bool"),
        r = bn(e, "b", "logicalAnd", "bool");
    return er(n.shape, r.shape), At.runKernel(function (t) {
      return t.logicalAnd(n, r);
    }, {
      $a: n,
      $b: r
    });
  }
}),
    ml = Tn({
  logicalNot_: function (t) {
    var e = bn(t, "x", "logicalNot", "bool");
    return At.runKernel(function (t) {
      return t.logicalNot(e);
    }, {
      $x: e
    });
  }
}),
    gl = Tn({
  logicalOr_: function (t, e) {
    var n = bn(t, "a", "logicalOr", "bool"),
        r = bn(e, "b", "logicalOr", "bool");
    return er(n.shape, r.shape), At.runKernel(function (t) {
      return t.logicalOr(n, r);
    }, {
      $a: n,
      $b: r
    });
  }
}),
    yl = Tn({
  logicalXor_: function (t, e) {
    var n = bn(t, "a", "logicalXor", "bool"),
        r = bn(e, "b", "logicalXor", "bool");
    return er(n.shape, r.shape), gl(t, e).logicalAnd(vl(t, e).logicalNot());
  }
}),
    xl = Tn({
  where_: function (t, e, n) {
    var r = bn(e, "a", "where"),
        o = bn(n, "b", "where"),
        a = bn(t, "condition", "where", "bool");
    return v(r.shape, o.shape, "Error in where: "), 1 === a.rank ? d(a.shape[0] === r.shape[0], function () {
      return "The first dimension of `a` must match the size of `condition`.";
    }) : v(a.shape, o.shape, "Error in where: "), At.runKernel(function (t, e) {
      var n = t.select(a, r, o);
      return e([a]), n;
    }, {
      $condition: a,
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0];
      return {
        $condition: function () {
          return Yn(n).toFloat();
        },
        $a: function () {
          return t.mul(n.cast(t.dtype));
        },
        $b: function () {
          return t.mul(n.logicalNot().cast(t.dtype));
        }
      };
    });
  }
}),
    wl = function (t) {
  return r(this, void 0, void 0, function () {
    var e, n, r;
    return o(this, function (o) {
      switch (o.label) {
        case 0:
          return [4, (e = bn(t, "condition", "whereAsync", "bool")).data()];

        case 1:
          return n = o.sent(), r = vo(e.shape, n), t !== e && e.dispose(), [2, r];
      }
    });
  });
};

exports.whereAsync = wl;
exports.where = xl;
exports.logicalXor = yl;
exports.logicalOr = gl;
exports.logicalNot = ml;
exports.logicalAnd = vl;
var bl = Tn({
  elu_: function (t) {
    var e = bn(t, "x", "elu");
    return At.runKernel(function (t, n) {
      var r = t.elu(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return At.runKernel(function (e) {
            return e.eluDer(t, n);
          }, {
            dy: t,
            y: n
          });
        }
      };
    });
  }
}),
    Cl = Tn({
  leakyRelu_: function (t, e) {
    void 0 === e && (e = .2);
    var n = bn(t, "x", "leakyRelu");
    return el(Pn(e).mul(n), n);
  }
}),
    El = Tn({
  prelu_: function (t, e) {
    var n = bn(t, "x", "prelu"),
        r = bn(e, "alpha", "prelu");
    return At.runKernel(function (t, e) {
      var o = t.prelu(n, r);
      return e([n, r]), o;
    }, {
      $x: n,
      $alpha: r
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = n.greater(0);
      return {
        $x: function () {
          return xl(o, t, t.mul(r));
        },
        $alpha: function () {
          var e = xl(o, Yn(t), t.mul(n)),
              a = tr(r.shape, t.shape);
          return a.length > 0 && (e = e.sum(a)), e.reshape(r.shape);
        }
      };
    });
  }
}),
    Rl = Tn({
  relu_: function (t) {
    var e = bn(t, "x", "relu");
    return "bool" === e.dtype ? e.toInt() : At.runKernel(function (t, n) {
      var r = t.relu(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mulStrict(n.step().toFloat());
        }
      };
    });
  }
}),
    Il = Tn({
  selu_: function (t) {
    var e = bn(t, "x", "selu");
    return At.runKernel(function (t, n) {
      var r = t.selu(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          var e = n.greater(Pn(0)),
              r = Pn(Fi),
              o = Pn(Bi),
              a = t.mul(o),
              i = t.mul(r).mul(n.toFloat().exp());
          return xl(e, a, i);
        }
      };
    });
  }
});
exports.selu = Il;
exports.relu = Rl;
exports.prelu = El;
exports.leakyRelu = Cl;
exports.elu = bl;
var Sl = Tn({
  transpose_: function (t, e) {
    var n = bn(t, "x", "transpose");
    return null == e && (e = n.shape.map(function (t, e) {
      return e;
    }).reverse()), d(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of perm " + e + ".";
    }), e.forEach(function (t) {
      d(t >= 0 && t < n.rank, function () {
        return "All entries in 'perm' must be between 0 and " + (n.rank - 1) + " but got " + e;
      });
    }), n.rank <= 1 ? n.clone() : At.runKernel(function (t) {
      return t.transpose(n, e);
    }, {
      $x: n
    }, function (t) {
      var n = on(e);
      return {
        $x: function () {
          return t.transpose(n);
        }
      };
    });
  }
});
exports.transpose = Sl;
var Nl = Tn({
  localResponseNormalization_: function (t, e, n, r, o) {
    void 0 === e && (e = 5), void 0 === n && (n = 1), void 0 === r && (r = 1), void 0 === o && (o = .5);
    var a = bn(t, "x", "localResponseNormalization");
    d(4 === a.rank || 3 === a.rank, function () {
      return "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + a.rank + ".";
    }), d(w(e), function () {
      return "Error in localResponseNormalization: depthRadius must be an integer but got depthRadius " + e + ".";
    });
    var i = a,
        s = !1;
    3 === a.rank && (s = !0, i = a.as4D(1, a.shape[0], a.shape[1], a.shape[2]));
    var u = At.runKernel(function (t, a) {
      var s = t.localResponseNormalization4D(i, e, n, r, o);
      return a([i, s]), s;
    }, {
      x4D: i
    }, function (t, a) {
      var i = a[0],
          s = a[1];
      return {
        x4D: function () {
          return At.runKernel(function (a) {
            return a.LRNGrad(t, i, s, e, n, r, o);
          }, {});
        }
      };
    });
    return s ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
});
exports.localResponseNormalization = Nl;
var kl = Tn({
  norm_: function (t, e, n, r) {
    void 0 === e && (e = "euclidean"), void 0 === n && (n = null), void 0 === r && (r = !1);

    var o = function t(e, n, r) {
      if (void 0 === r && (r = null), 0 === e.rank) return e.abs();
      if (1 !== e.rank && null === r) return t(e.reshape([-1]), n, r);

      if (1 === e.rank || "number" == typeof r || Array.isArray(r) && 1 === r.length) {
        if (1 === n) return e.abs().sum(r);
        if (n === 1 / 0) return e.abs().max(r);
        if (n === -1 / 0) return e.abs().min(r);
        if ("euclidean" === n || 2 === n) return e.abs().pow(Pn(2, "int32")).sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      if (Array.isArray(r) && 2 === r.length) {
        if (1 === n) return e.abs().sum(r[0]).max(r[1] - 1);
        if (n === 1 / 0) return e.abs().sum(r[1]).max(r[0]);
        if (n === -1 / 0) return e.abs().sum(r[1]).min(r[0]);
        if ("fro" === n || "euclidean" === n) return e.square().sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      throw new Error("Error in norm: invalid axis: " + r);
    }(t = bn(t, "x", "norm"), e, n),
        a = o.shape;

    if (r) {
      var i = S(n, t.shape);
      a = en(o.shape, i);
    }

    return o.reshape(a);
  }
});
exports.norm = kl;

function Al(t, e) {
  for (var n = [], r = t; r < e; ++r) n.push(r);

  return n;
}

function Tl(t) {
  for (var e = [], n = 0; n < t.length; ++n) for (var r = 0; r < t[n].length; ++r) e.push(t[n][r]);

  return e;
}

var Dl = Tn({
  gather_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = bn(t, "x", "gather"),
        o = bn(e, "indices", "gather", "int32");
    n = S(n, r.shape)[0];

    var a = function (t, e, n) {
      for (var r = t.shape[n], o = [], a = 1, i = 1, s = 0; s < n; s++) o.push(t.shape[s]), a *= t.shape[s];

      for (s = 0; s < e.rank; s++) o.push(e.shape[s]);

      for (s = n + 1; s < t.rank; s++) o.push(t.shape[s]), i *= t.shape[s];

      return {
        batchSize: a,
        sliceSize: i,
        dimSize: r,
        outputShape: o
      };
    }(r, o, n);

    return At.runKernel(function (t, e) {
      var a = t.gather(r, o.flatten(), n);
      return e([o]), a;
    }, {
      $x: r
    }, function (t, e) {
      var o = e[0];
      return {
        $x: function () {
          var e = r.shape,
              a = o.size,
              i = e.slice(0, n),
              s = i.length,
              u = e.slice(n, e.length).slice(1),
              l = u.length,
              c = Al(0, s),
              h = Al(s + 1, s + 1 + l),
              p = Tl([i, [a], u]),
              f = t.reshape(p),
              d = o.reshape([a]),
              v = Tl([[s], c, h]),
              m = f.transpose(v),
              g = _l(m, d, r.shape[n]),
              y = on(v);

          return g = g.transpose(y);
        }
      };
    }).reshape(a.outputShape);
  }
}),
    _l = Tn({
  unsortedSegmentSum_: function (t, e, n) {
    var r = bn(t, "x", "unsortedSegmentSum"),
        o = bn(e, "segmentIds", "unsortedSegmentSum", "int32");
    return d(w(n), function () {
      return "numSegments must be of dtype int";
    }), At.runKernel(function (t, e) {
      var a = t.unsortedSegmentSum(r, o, n);
      return e([o]), a;
    }, {
      $x: r
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return function (t, e) {
            for (var n = el(e, Yn(e)), r = Dl(t, n), o = Wu(e, Pn(0, "int32")), a = r.rank - o.rank, i = 0; i < a; ++i) o = Kr(o, i + 1);

            o = vl(o, qn(r.shape, "bool"));
            var s = Yn(r);
            return xl(o, r, s);
          }(t, n);
        }
      };
    });
  }
});

exports.unsortedSegmentSum = _l;
exports.gather = Dl;
var Ol = Tn({
  basicLSTMCell_: function (t, e, n, r, o, a) {
    var i = bn(t, "forgetBias", "basicLSTMCell"),
        s = bn(e, "lstmKernel", "basicLSTMCell"),
        u = bn(n, "lstmBias", "basicLSTMCell"),
        l = bn(r, "data", "basicLSTMCell"),
        c = bn(o, "c", "basicLSTMCell"),
        h = bn(a, "h", "basicLSTMCell"),
        p = l.concat(h, 1).matMul(s).add(u),
        f = p.shape[0],
        d = p.shape[1] / 4,
        v = [f, d],
        m = p.slice([0, 0], v),
        g = p.slice([0, d], v),
        y = p.slice([0, 2 * d], v),
        x = p.slice([0, 3 * d], v),
        w = m.sigmoid().mulStrict(g.tanh()).addStrict(c.mulStrict(i.add(y).sigmoid())),
        b = w.tanh().mulStrict(x.sigmoid());
    return [w, b];
  }
}),
    Ml = Tn({
  multiRNNCell_: function (t, e, n, r) {
    for (var o = bn(e, "data", "multiRNNCell"), a = Cn(n, "c", "multiRNNCell"), i = Cn(r, "h", "multiRNNCell"), s = o, u = [], l = 0; l < t.length; l++) {
      var c = t[l](s, a[l], i[l]);
      u.push(c[0]), u.push(c[1]), s = c[1];
    }

    var h = [],
        p = [];

    for (l = 0; l < u.length; l += 2) h.push(u[l]), p.push(u[l + 1]);

    return [h, p];
  }
});
exports.multiRNNCell = Ml;
exports.basicLSTMCell = Ol;
var Fl = Tn({
  movingAverage_: function (t, e, n, r, o) {
    void 0 === o && (o = !0);
    var a = bn(t, "v", "movingAverage"),
        i = bn(e, "x", "movingAverage"),
        s = bn(n, "decay", "movingAverage");
    Et(a, i), d(x(a.shape, i.shape), function () {
      return "Shape mismatch in v and x";
    });
    var u = Pn(1),
        l = u.sub(s),
        c = i.sub(a).mul(l);

    if (o) {
      d(null != r, function () {
        return "When using zeroDebias: true, step is required.";
      });
      var h = bn(r, "step", "movingAverage");
      c = c.div(u.sub(ll(s, h)));
    }

    return a.add(c);
  }
});
exports.movingAverage = Fl;
var Bl = Tn({
  stridedSlice_: function (t, e, n, r, o, a, i, s, u) {
    if (void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), void 0 === u && (u = 0), 0 !== i) throw new Error("ellipsis mask is not yet supported");
    if (0 !== s) throw new Error("new axis mask is not yet supported");
    var l = bn(t, "x", "stridedSlice");

    if (r.every(function (t) {
      return 1 === t;
    })) {
      var c = dn(l.shape, e, n, r, o, a, i, s, u),
          h = c[0],
          p = c[1],
          f = c[2],
          d = p.filter(function (t, e) {
        return -1 === f.indexOf(e);
      });
      return xu(l, h, p).reshape(d);
    }

    return At.runKernel(function (t) {
      return t.stridedSlice(l, e, n, r, o, a, i, s, u);
    }, {
      $x: l
    });
  }
});
exports.stridedSlice = Bl;
var Pl = Tn({
  topk_: function (t, e, n) {
    void 0 === e && (e = 1), void 0 === n && (n = !0);
    var r = bn(t, "x", "topk");
    if (0 === r.rank) throw new Error("topk() expects the input to be of rank 1 or higher");
    var o = r.shape[r.shape.length - 1];
    if (e > o) throw new Error("'k' passed to topk() must be <= the last dimension (" + o + ") but got " + e);
    var a = At.runKernel(function (t) {
      return t.topk(r, e, n);
    }, {
      $x: r
    });
    return {
      values: a[0],
      indices: a[1]
    };
  }
});
exports.topk = Pl;
var Ll = Tn({
  scatterND_: function (t, e, n) {
    var r = bn(t, "indices", "scatterND", "int32"),
        o = bn(e, "updates", "scatterND");
    return pn(o, r, n), At.runKernel(function (t) {
      return t.scatterND(r, o, n);
    }, {
      $indices: r,
      $updates: o
    });
  }
});
exports.scatterND = Ll;
var Wl = Tn({
  fft_: function (t) {
    d("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.fft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return At.runKernel(function (t) {
      return t.fft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    Ul = Tn({
  ifft_: function (t) {
    d("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.ifft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return At.runKernel(function (t) {
      return t.ifft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    zl = Tn({
  rfft_: function (t, e) {
    d("float32" === t.dtype, function () {
      return "The dtype for rfft() must be real value but got " + t.dtype;
    });
    var n,
        r = t.shape[t.shape.length - 1],
        o = t.size / r;

    if (null != e && e < r) {
      var a = t.shape.map(function (t) {
        return 0;
      }),
          i = t.shape.map(function (t) {
        return t;
      });
      i[t.shape.length - 1] = e, n = t.slice(a, i), r = e;
    } else if (null != e && e > r) {
      var s = t.shape.map(function (t) {
        return t;
      });
      s[t.shape.length - 1] = e - r, n = t.concat(Hn(s), t.shape.length - 1), r = e;
    } else n = t;

    var u = n.zerosLike(),
        l = On(n, u).as2D(o, r),
        c = Wl(l),
        h = Math.floor(r / 2) + 1,
        p = Mn(c),
        f = Fn(c),
        v = p.split([h, r - h], p.shape.length - 1),
        m = f.split([h, r - h], f.shape.length - 1),
        g = n.shape.slice();
    return g[n.shape.length - 1] = h, On(v[0], m[0]).reshape(g);
  }
}),
    Vl = Tn({
  irfft_: function (t) {
    var e = t.shape[t.shape.length - 1],
        n = t.size / e;

    if (e <= 2) {
      var r = t.as2D(n, e),
          o = Ul(r);
      return Mn(o);
    }

    var a = [n, 2 * (e - 1)],
        i = Mn(t).as2D(n, e),
        s = Fn(t).as2D(n, e),
        u = i.slice([0, 1], [n, e - 2]).reverse(1),
        l = s.slice([0, 1], [n, e - 2]).reverse(1).mul(Pn(-1)),
        c = i.concat(u, 1),
        h = s.concat(l, 1);
    return r = On(c, h).as2D(a[0], a[1]), o = Ul(r), Mn(o);
  }
}),
    Gl = Object.freeze({
  fft: Wl,
  ifft: Ul,
  rfft: zl,
  irfft: Vl
});
exports.spectral = Gl;
exports.irfft = Vl;
exports.rfft = zl;
exports.ifft = Ul;
exports.fft = Wl;
var ql = Tn({
  sparseToDense_: function (t, e, n, r) {
    void 0 === r && (r = 0);
    var o = bn(t, "sparseIndices", "sparseToDense", "int32"),
        a = bn(e, "sparseValues", "sparseToDense"),
        i = bn(r, "defaultValue", "sparseToDense", a.dtype);
    return function (t, e, n, r) {
      if ("int32" !== t.dtype) throw new Error("tf.sparseToDense() expects the indices to be int32 type, but the dtype was " + t.dtype + ".");
      if (t.rank > 2) throw new Error("sparseIndices should be a scalar, vector, or matrix, but got shape " + t.shape + ".");
      var o = t.rank > 0 ? t.shape[0] : 1,
          a = t.rank > 1 ? t.shape[1] : 1;
      if (n.length !== a) throw new Error("outputShape has incorrect number of elements:, " + n.length + ", should be: " + a + ".");
      var i = e.size;
      if (0 !== e.rank && (1 !== e.rank || i !== o)) throw new Error("sparseValues has incorrect shape " + e.shape + ", should be [] or [" + o + "]");
      if (e.dtype !== r.dtype) throw new Error("sparseValues.dtype must match defaultValues.dtype");
    }(o, a, n, i), At.runKernel(function (t) {
      return t.sparseToDense(o, a, n, i);
    }, {
      $sparseIndices: o,
      $sparseValues: a,
      $defaultValue: i
    });
  }
});
exports.sparseToDense = ql;
var Hl = Tn({
  gatherND_: function (t, e) {
    var n = bn(e, "indices", "gatherND", "int32"),
        r = bn(t, "x", "gatherND");
    return At.runKernel(function (t) {
      return t.gatherND(r, n);
    }, {
      $x: r,
      $indices: n
    });
  }
});
exports.gatherND = Hl;
var $l = Tn({
  dropout_: function (t, e, n, r) {
    if (null != n && !x(t.shape, n)) throw new Error("Non-default noise shape is not implemented yet: " + JSON.stringify(n));
    var o = ao(t.shape, 0, 1, "float32", r).greater(e);
    return o = o.div(fl(1, e)), t.mul(o);
  }
});
exports.dropout = $l;

function jl(t, e, n) {
  for (var r = 1 - t % 2, o = new Float32Array(t), a = 0; a < t; ++a) {
    var i = 2 * Math.PI * a / (t + r - 1);
    o[a] = e - n * Math.cos(i);
  }

  return Ln(o, "float32");
}

var Kl,
    Xl = Tn({
  hannWindow_: function (t) {
    return jl(t, .5, .5);
  }
}),
    Yl = Tn({
  hammingWindow_: function (t) {
    return jl(t, .54, .46);
  }
}),
    Ql = Tn({
  frame_: function (t, e, n, r, o) {
    void 0 === r && (r = !1), void 0 === o && (o = 0);

    for (var a = 0, i = []; a + e <= t.size;) i.push(xu(t, a, e)), a += n;

    if (r) {
      var s = a + e - t.size,
          u = Rr([xu(t, a, e - s), $n([s], o)]);
      i.push(u);
    }

    return 0 === i.length ? Wn([], [0, e]) : Rr(i).as2D(i.length, e);
  }
}),
    Jl = Object.freeze({
  hannWindow: Xl,
  hammingWindow: Yl,
  frame: Ql
});
exports.signal = Jl;
exports.frame = Ql;
exports.hammingWindow = Yl;
exports.hannWindow = Xl;
exports.Reduction = Kl;
!function (t) {
  t[t.NONE = 0] = "NONE", t[t.MEAN = 1] = "MEAN", t[t.SUM = 2] = "SUM", t[t.SUM_BY_NONZERO_WEIGHTS = 3] = "SUM_BY_NONZERO_WEIGHTS";
}(Kl || (exports.Reduction = Kl = {}));
var Zl = Tn({
  absoluteDifference_: function (t, e, n, r) {
    void 0 === r && (r = Kl.SUM_BY_NONZERO_WEIGHTS);
    var o = bn(t, "labels", "absoluteDifference"),
        a = bn(e, "predictions", "absoluteDifference"),
        i = null;
    null != n && (i = bn(n, "weights", "absoluteDifference")), v(o.shape, a.shape, "Error in absoluteDifference: ");
    var s = o.sub(a).abs();
    return tc(s, i, r);
  }
}),
    tc = Tn({
  computeWeightedLoss_: function (t, e, n) {
    void 0 === n && (n = Kl.SUM_BY_NONZERO_WEIGHTS);
    var r = bn(t, "losses", "computeWeightedLoss"),
        o = null;
    null != e && (o = bn(e, "weights", "computeWeightedLoss"));
    var a = null == o ? r : r.mul(o);
    if (n === Kl.NONE) return a;
    if (n === Kl.SUM) return a.sum();

    if (n === Kl.MEAN) {
      if (null == o) return a.mean();
      var i = r.size / o.size,
          s = a.sum().div(o.sum());
      return i > 1 ? s.div(Pn(i)) : s;
    }

    if (n === Kl.SUM_BY_NONZERO_WEIGHTS) {
      if (null == o) return a.sum().div(Pn(r.size));
      var u = o.mul(qn(r.shape)).notEqual(Pn(0)).sum().toFloat();
      return a.sum().div(u);
    }

    throw Error("Unknown reduction: " + n);
  }
}),
    ec = Tn({
  cosineDistance_: function (t, e, n, r, o) {
    void 0 === o && (o = Kl.SUM_BY_NONZERO_WEIGHTS);
    var a = bn(t, "labels", "cosineDistance"),
        i = bn(e, "predictions", "cosineDistance"),
        s = null;
    null != r && (s = bn(r, "weights", "cosineDistance")), v(a.shape, i.shape, "Error in cosineDistance: ");
    var u = Pn(1).sub(a.mul(i).sum(n, !0));
    return tc(u, s, o);
  }
}),
    nc = Tn({
  hingeLoss_: function (t, e, n, r) {
    void 0 === r && (r = Kl.SUM_BY_NONZERO_WEIGHTS);
    var o = bn(t, "labels", "hingeLoss"),
        a = bn(e, "predictions", "hingeLoss"),
        i = null;
    null != n && (i = bn(n, "weights", "hingeLoss")), v(o.shape, a.shape, "Error in hingeLoss: ");
    var s = Pn(1);
    o = Pn(2).mul(o).sub(s);
    var u = s.sub(o.mul(a)).relu();
    return tc(u, i, r);
  }
}),
    rc = Tn({
  huberLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1), void 0 === o && (o = Kl.SUM_BY_NONZERO_WEIGHTS);
    var a = bn(t, "labels", "huberLoss"),
        i = bn(e, "predictions", "huberLoss"),
        s = null;
    null != n && (s = bn(n, "weights", "huberLoss")), v(a.shape, i.shape, "Error in huberLoss: ");
    var u = Pn(r),
        l = i.sub(a).abs(),
        c = rl(l, u),
        h = l.sub(c),
        p = Pn(.5).mul(c.square()).add(u.mul(h));
    return tc(p, s, o);
  }
}),
    oc = Tn({
  logLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1e-7), void 0 === o && (o = Kl.SUM_BY_NONZERO_WEIGHTS);
    var a = bn(t, "labels", "logLoss"),
        i = bn(e, "predictions", "logLoss"),
        s = null;
    null != n && (s = bn(n, "weights", "logLoss")), v(a.shape, i.shape, "Error in logLoss: ");
    var u = Pn(1),
        l = Pn(r),
        c = a.mul(i.add(l).log()).neg().sub(u.sub(a).mul(u.sub(i).add(l).log()));
    return tc(c, s, o);
  }
}),
    ac = Tn({
  meanSquaredError_: function (t, e, n, r) {
    void 0 === r && (r = Kl.SUM_BY_NONZERO_WEIGHTS);
    var o = bn(t, "labels", "meanSquaredError"),
        a = bn(e, "predictions", "meanSquaredError"),
        i = null;
    null != n && (i = bn(n, "weights", "meanSquaredError")), v(o.shape, a.shape, "Error in meanSquaredError: ");
    var s = o.squaredDifference(a);
    return tc(s, i, r);
  }
}),
    ic = Tn({
  sigmoidCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Kl.SUM_BY_NONZERO_WEIGHTS);
    var a = bn(t, "multiClassLabels", "sigmoidCrossEntropy"),
        i = bn(e, "logits", "sigmoidCrossEntropy"),
        s = null;

    if (null != n && (s = bn(n, "weights", "sigmoidCrossEntropy")), v(a.shape, i.shape, "Error in sigmoidCrossEntropy: "), r > 0) {
      var u = Pn(r),
          l = Pn(1),
          c = Pn(.5);
      a = a.mul(l.sub(u)).add(c.mul(u));
    }

    var h = function (t, e) {
      var n = bn(t, "labels", "sigmoidCrossEntropyWithLogits"),
          r = bn(e, "logits", "sigmoidCrossEntropyWithLogits");
      v(n.shape, r.shape, "Error in sigmoidCrossEntropyWithLogits: ");
      var o = r.relu(),
          a = r.mul(n),
          i = r.abs().neg().exp().log1p();
      return o.sub(a).add(i);
    }(a, i);

    return tc(h, s, o);
  }
}),
    sc = Tn({
  softmaxCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Kl.SUM_BY_NONZERO_WEIGHTS);
    var a = bn(t, "onehotLabels", "softmaxCrossEntropy"),
        i = bn(e, "logits", "softmaxCrossEntropy"),
        s = null;

    if (null != n && (s = bn(n, "weights", "softmaxCrossEntropy")), v(a.shape, i.shape, "Error in softmaxCrossEntropy: "), r > 0) {
      var u = Pn(r),
          l = Pn(1),
          c = Pn(a.shape[1]);
      a = a.mul(l.sub(u)).add(u.div(c));
    }

    var h = function (t, e, n) {
      if (void 0 === n && (n = -1), -1 === n && (n = e.rank - 1), n !== e.rank - 1) throw Error("Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank " + e.rank + " and dim was " + n);
      return kn(function (t, e, r) {
        var o = e.logSumExp([n], !0),
            a = e.toFloat().sub(o);
        return r([t, a]), {
          value: a.mul(t).neg().sum([n]),
          gradFunc: function (t, e) {
            var r = e[0],
                o = e[1],
                a = en(t.shape, [n]);
            return [t.reshape(a).mul(r.toFloat().sub(o.exp())), t.reshape(a).mul(o.exp().sub(r.toFloat()))];
          }
        };
      })(t, e);
    }(a, i);

    return tc(h, s, o);
  }
}),
    uc = Object.freeze({
  get Reduction() {
    return Kl;
  },

  absoluteDifference: Zl,
  computeWeightedLoss: tc,
  cosineDistance: ec,
  hingeLoss: nc,
  huberLoss: rc,
  logLoss: oc,
  meanSquaredError: ac,
  sigmoidCrossEntropy: ic,
  softmaxCrossEntropy: sc
});
exports.losses = uc;

function lc(t, e) {
  return void 0 === e && (e = !1), At.tidy(function () {
    if (2 !== t.shape.length) throw new Error("qr2d() requires a 2D Tensor, but got a " + t.shape.length + "D Tensor.");

    for (var n = t.shape[0], r = t.shape[1], o = Xr(n), a = t.clone(), i = Wn([[1]], [1, 1]), s = i.clone(), u = n >= r ? r : n, l = function (t) {
      var e,
          u = a,
          l = s,
          c = o;
      e = At.tidy(function () {
        var e = a.slice([t, t], [n - t, 1]),
            u = e.norm(),
            l = a.slice([t, t], [1, 1]),
            c = l.sign().neg(),
            h = l.sub(c.mul(u)),
            p = e.div(h);
        s = 1 === p.shape[0] ? i.clone() : i.concat(p.slice([1, 0], [p.shape[0] - 1, p.shape[1]]), 0);
        var f = c.matMul(h).div(u).neg(),
            d = a.slice([t, 0], [n - t, r]),
            v = f.mul(s);
        a = 0 === t ? d.sub(v.matMul(s.transpose().matMul(d))) : a.slice([0, 0], [t, r]).concat(d.sub(v.matMul(s.transpose().matMul(d))), 0);
        var m = o.slice([0, t], [n, o.shape[1] - t]);
        return o = 0 === t ? m.sub(m.matMul(s).matMul(v.transpose())) : o.slice([0, 0], [n, t]).concat(m.sub(m.matMul(s).matMul(v.transpose())), 1), [s, a, o];
      }), s = e[0], a = e[1], o = e[2], Me([u, l, c]);
    }, c = 0; c < u; ++c) l(c);

    return !e && n > r && (o = o.slice([0, 0], [n, r]), a = a.slice([0, 0], [r, r])), [o, a];
  });
}

var cc = Tn({
  gramSchmidt_: function (t) {
    var e;

    if (Array.isArray(t)) {
      e = !1, d(null != t && t.length > 0, function () {
        return "Gram-Schmidt process: input must not be null, undefined, or empty";
      });

      for (var n = t[0].shape[0], r = function (e) {
        d(t[e].shape[0] === n, function () {
          return "Gram-Schmidt: Non-unique lengths found in the input vectors: (" + t[e].shape[0] + " vs. " + n + ")";
        });
      }, o = 1; o < t.length; ++o) r(o);
    } else e = !0, t = Ar(t, t.shape[0], 0).map(function (t) {
      return uo(t, [0]);
    });

    d(t.length <= t[0].shape[0], function () {
      return "Gram-Schmidt: Number of vectors (" + t.length + ") exceeds number of dimensions (" + t[0].shape[0] + ").";
    });

    var a = [],
        i = t,
        s = function (t) {
      a.push(At.tidy(function () {
        var e = i[t];
        if (t > 0) for (var n = 0; n < t; ++n) {
          var r = Mu(a[n].mulStrict(e)).mul(a[n]);
          e = e.sub(r);
        }
        return e.div(kl(e, "euclidean"));
      }));
    };

    for (o = 0; o < t.length; ++o) s(o);

    return e ? lo(a, 0) : a;
  }
}),
    hc = Tn({
  qr_: function (t, e) {
    if (void 0 === e && (e = !1), t.rank < 2) throw new Error("qr() requires input tensor to have a rank >= 2, but got rank " + t.rank);
    if (2 === t.rank) return lc(t, e);
    var n = t.shape.slice(0, t.shape.length - 2).reduce(function (t, e) {
      return t * e;
    }),
        r = po(t.reshape([n, t.shape[t.shape.length - 2], t.shape[t.shape.length - 1]]), 0),
        o = [],
        a = [];
    return r.forEach(function (t) {
      var n = lc(t, e),
          r = n[0],
          i = n[1];
      o.push(r), a.push(i);
    }), [lo(o, 0).reshape(t.shape), lo(a, 0).reshape(t.shape)];
  }
}),
    pc = Object.freeze({
  gramSchmidt: cc,
  qr: hc
});
exports.linalg = pc;

function fc(t, e, n, r, o) {
  null == r && (r = .5), null == o && (o = Number.NEGATIVE_INFINITY);
  var a = t.shape[0];
  return n = Math.min(n, a), d(0 <= r && r <= 1, function () {
    return "iouThreshold must be in [0, 1], but was '" + r + "'";
  }), d(2 === t.rank, function () {
    return "boxes must be a 2D tensor, but was of rank '" + t.rank + "'";
  }), d(4 === t.shape[1], function () {
    return "boxes must have 4 columns, but 2nd dimension was " + t.shape[1];
  }), d(1 === e.rank, function () {
    return "scores must be a 1D tensor";
  }), d(e.shape[0] === a, function () {
    return "scores has incompatible shape with boxes. Expected " + a + ", but was " + e.shape[0];
  }), {
    maxOutputSize: n,
    iouThreshold: r,
    scoreThreshold: o
  };
}

var dc = Tn({
  resizeBilinear_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = bn(t, "images", "resizeBilinear");
    d(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeBilinear: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), d(2 === e.length, function () {
      return "Error in resizeBilinear: new shape must 2D, but got shape " + e + ".";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = At.runKernel(function (t, e) {
      return e([o]), t.resizeBilinear(o, i, s, n);
    }, {
      batchImages: o
    }, function (t, e) {
      return {
        batchImages: function () {
          return At.runKernel(function (r) {
            return r.resizeBilinearBackprop(t, e[0], n);
          }, {});
        }
      };
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    vc = Tn({
  resizeNearestNeighbor_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = bn(t, "images", "resizeNearestNeighbor");
    d(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), d(2 === e.length, function () {
      return "Error in resizeNearestNeighbor: new shape must 2D, but got shape " + e + ".";
    }), d("float32" === r.dtype || "int32" === r.dtype, function () {
      return "`images` must have `int32` or `float32` as dtype";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = At.runKernel(function (t, e) {
      return e([o]), t.resizeNearestNeighbor(o, i, s, n);
    }, {
      batchImages: o
    }, function (t, e) {
      return {
        batchImages: function () {
          return At.runKernel(function (r) {
            return r.resizeNearestNeighborBackprop(t, e[0], n);
          }, {});
        }
      };
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    mc = Tn({
  nonMaxSuppression_: function (t, e, n, r, o) {
    void 0 === r && (r = .5), void 0 === o && (o = Number.NEGATIVE_INFINITY);
    var a = bn(t, "boxes", "nonMaxSuppression"),
        i = bn(e, "scores", "nonMaxSuppression"),
        s = fc(a, i, n, r, o);
    return n = s.maxOutputSize, r = s.iouThreshold, o = s.scoreThreshold, At.runKernel(function (t) {
      return t.nonMaxSuppression(a, i, n, r, o);
    }, {
      $boxes: a
    });
  }
}),
    gc = function (t, e, n, a, i) {
  return void 0 === a && (a = .5), void 0 === i && (i = Number.NEGATIVE_INFINITY), r(this, void 0, void 0, function () {
    var r, s, u, l, c, h;
    return o(this, function (o) {
      switch (o.label) {
        case 0:
          return r = bn(t, "boxes", "nonMaxSuppressionAsync"), s = bn(e, "scores", "nonMaxSuppressionAsync"), u = fc(r, s, n, a, i), n = u.maxOutputSize, a = u.iouThreshold, i = u.scoreThreshold, [4, r.data()];

        case 1:
          return l = o.sent(), [4, s.data()];

        case 2:
          return c = o.sent(), h = wr(l, c, n, a, i), r !== t && r.dispose(), s !== e && s.dispose(), [2, h];
      }
    });
  });
},
    yc = Tn({
  cropAndResize_: function (t, e, n, r, o, a) {
    var i = bn(t, "image", "cropAndResize", "float32"),
        s = bn(e, "boxes", "cropAndResize", "float32"),
        u = bn(n, "boxInd", "cropAndResize", "int32");
    o = o || "bilinear", a = a || 0;
    var l = s.shape[0];
    return d(4 === i.rank, function () {
      return "Error in cropAndResize: image must be rank 4,but got rank " + i.rank + ".";
    }), d(2 === s.rank && 4 === s.shape[1], function () {
      return "Error in cropAndResize: boxes must be have size [" + l + ",4] but had shape " + s.shape + ".";
    }), d(1 === u.rank && u.shape[0] === l, function () {
      return "Error in cropAndResize: boxInd must be have size [" + l + "] but had shape " + s.shape + ".";
    }), d(2 === r.length, function () {
      return "Error in cropAndResize: cropSize must be of length 2, but got length " + r.length + ".";
    }), d(r[0] >= 1 && r[1] >= 1, function () {
      return "cropSize must be atleast [1,1], but was " + r;
    }), d("bilinear" === o || "nearest" === o, function () {
      return "method must be bilinear or nearest, but was " + o;
    }), At.runKernel(function (t, e) {
      return t.cropAndResize(i, s, u, r, o, a);
    }, {
      $image: i,
      $boxes: s
    });
  }
}),
    xc = Object.freeze({
  resizeBilinear: dc,
  resizeNearestNeighbor: vc,
  nonMaxSuppression: mc,
  nonMaxSuppressionAsync: gc,
  cropAndResize: yc
});

exports.image = xc;
var wc = Tn({
  matMul_: function (t, e, n, r, o, a) {
    var i;
    void 0 === n && (n = !1), void 0 === r && (r = !1), void 0 === a && (a = "linear");
    var s = bn(t, "a", "fused matMul"),
        u = bn(e, "b", "fused matMul");
    i = Ct(s, u), s = i[0], u = i[1];
    var l = n ? s.shape[s.rank - 2] : s.shape[s.rank - 1],
        c = r ? u.shape[u.rank - 1] : u.shape[u.rank - 2],
        h = n ? s.shape[s.rank - 1] : s.shape[s.rank - 2],
        p = r ? u.shape[u.rank - 2] : u.shape[u.rank - 1],
        f = s.shape.slice(0, -2),
        v = u.shape.slice(0, -2),
        m = y(f),
        g = y(v);
    d(s.rank >= 2 && u.rank >= 2 && s.rank === u.rank, function () {
      return "Error in fused matMul: inputs must have the same rank of at least 2, got ranks " + s.rank + " and " + u.rank + ".";
    }), d(x(f, v), function () {
      return "Error in fused matMul: outer dimensions (" + f + ") and (" + v + ") of Tensors with shapes " + s.shape + " and " + u.shape + " must match.";
    }), d(l === c, function () {
      return "Error in fused matMul: inner shapes (" + l + ") and (" + c + ") of Tensors with shapes " + s.shape + " and " + u.shape + " and transposeA=" + n + " and transposeB=" + r + " must match.";
    });
    var w,
        b = s.shape.slice(0, -2).concat([h, p]),
        C = n ? s.as3D(m, l, h) : s.as3D(m, h, l),
        E = r ? u.as3D(g, p, c) : u.as3D(g, c, p);
    null != o && er(b, (w = Ct(w = bn(o, "bias", "fused matMul"), s)[0]).shape);
    var R = {
      $a: C,
      $b: E
    };
    return null != o && (R.$bias = w), At.runKernel(function (t, e) {
      var o = t.fusedBatchMatMul(C, E, n, r, w, a);
      return e([C, E, o]), o;
    }, R, function (t, e) {
      var i,
          s = e[0],
          u = e[1],
          l = e[2];
      if (null == a || "linear" === a) i = t;else {
        if ("relu" !== a) throw new Error("Gradient for activation " + a + " has not been implemented yet.");
        i = t.mul(l.step());
      }
      var c = {};
      return null != o && (c = {
        $bias: function () {
          var t = i,
              e = tr(w.shape, i.shape);
          return e.length > 0 && (t = t.sum(e)), t.reshape(w.shape);
        }
      }), n || r ? !n && r ? Object.assign({
        $a: function () {
          return i.matMul(u, !1, !1);
        },
        $b: function () {
          return i.matMul(s, !0, !1);
        }
      }, c) : n && !r ? Object.assign({
        $a: function () {
          return u.matMul(i, !1, !0);
        },
        $b: function () {
          return s.matMul(i, !1, !1);
        }
      }, c) : Object.assign({
        $a: function () {
          return u.matMul(i, !0, !0);
        },
        $b: function () {
          return i.matMul(s, !0, !0);
        }
      }, c) : Object.assign({
        $a: function () {
          return i.matMul(u, !1, !0);
        },
        $b: function () {
          return s.matMul(i, !0, !1);
        }
      }, c);
    }).reshape(b);
  }
}),
    bc = Object.freeze({
  matMul: wc
}),
    Cc = Object.freeze({
  image: xc,
  linalg: pc,
  losses: uc,
  spectral: Gl,
  fused: bc,
  signal: Jl,
  op: Tn,
  batchNormalization2d: Vs,
  batchNormalization3d: Gs,
  batchNormalization4d: qs,
  batchNormalization: Hs,
  batchNorm: $s,
  batchNorm2d: js,
  batchNorm3d: Ks,
  batchNorm4d: Xs,
  complex: On,
  real: Mn,
  imag: Fn,
  concat: Rr,
  concat1d: Ir,
  concat2d: Sr,
  concat3d: Nr,
  concat4d: kr,
  split: Ar,
  conv1d: Zs,
  conv2d: tu,
  conv3d: eu,
  conv2dDerFilter: nu,
  depthwiseConv2d: ru,
  separableConv2d: ou,
  conv2dTranspose: au,
  matMul: iu,
  dot: su,
  outerProduct: uu,
  reverse: lu,
  reverse1d: cu,
  reverse2d: hu,
  reverse3d: pu,
  reverse4d: fu,
  maxPool: mu,
  avgPool: gu,
  pool: yu,
  slice: xu,
  slice1d: wu,
  slice2d: bu,
  slice3d: Cu,
  slice4d: Eu,
  abs: es,
  acos: ns,
  acosh: rs,
  asin: os,
  asinh: as,
  atan: is,
  atanh: ss,
  ceil: us,
  clipByValue: ls,
  cos: cs,
  cosh: hs,
  erf: ps,
  exp: fs,
  expm1: ds,
  floor: vs,
  log: ms,
  log1p: gs,
  logSigmoid: ys,
  neg: xs,
  reciprocal: ws,
  round: bs,
  rsqrt: Cs,
  sigmoid: Es,
  sign: Rs,
  isNaN: Is,
  isInf: Ss,
  isFinite: Ns,
  sin: ks,
  sinh: As,
  softplus: Ts,
  sqrt: Ds,
  square: _s,
  step: Os,
  tan: Ms,
  tanh: Fs,
  all: Iu,
  any: Su,
  argMax: Nu,
  argMin: ku,
  logSumExp: Au,
  max: Tu,
  mean: Du,
  min: _u,
  moments: Ou,
  sum: Mu,
  prod: Fu,
  equal: Bu,
  equalStrict: Pu,
  greater: Lu,
  greaterEqual: Wu,
  greaterEqualStrict: Uu,
  greaterStrict: zu,
  less: Vu,
  lessEqual: Gu,
  lessEqualStrict: qu,
  lessStrict: Hu,
  notEqual: $u,
  notEqualStrict: ju,
  add: Ku,
  addN: Xu,
  addStrict: Yu,
  atan2: Qu,
  div: Ju,
  divStrict: Zu,
  floorDiv: tl,
  maximum: el,
  maximumStrict: nl,
  minimum: rl,
  minimumStrict: ol,
  mod: al,
  modStrict: il,
  mul: sl,
  mulStrict: ul,
  pow: ll,
  powStrict: cl,
  squaredDifference: hl,
  squaredDifferenceStrict: pl,
  sub: fl,
  subStrict: dl,
  elu: bl,
  leakyRelu: Cl,
  prelu: El,
  relu: Rl,
  selu: Il,
  logicalAnd: vl,
  logicalNot: ml,
  logicalOr: gl,
  logicalXor: yl,
  where: xl,
  whereAsync: wl,
  buffer: zr,
  print: Vr,
  batchToSpaceND: Gr,
  cast: qr,
  clone: Hr,
  cumsum: $r,
  depthToSpace: jr,
  expandDims: Kr,
  eye: Xr,
  multinomial: Yr,
  oneHot: Qr,
  pad: Jr,
  pad1d: Zr,
  pad2d: to,
  pad3d: eo,
  pad4d: no,
  rand: ro,
  randomNormal: oo,
  randomUniform: ao,
  reshape: io,
  spaceToBatchND: so,
  squeeze: uo,
  stack: lo,
  tile: co,
  truncatedNormal: ho,
  unstack: po,
  setdiff1dAsync: fo,
  fill: $n,
  linspace: jn,
  ones: qn,
  range: Kn,
  scalar: Pn,
  tensor: Bn,
  tensor1d: Ln,
  tensor2d: Wn,
  tensor3d: Un,
  tensor4d: zn,
  tensor5d: Vn,
  tensor6d: Gn,
  zeros: Hn,
  onesLike: Xn,
  zerosLike: Yn,
  transpose: Sl,
  softmax: Dn,
  logSoftmax: _n,
  localResponseNormalization: Nl,
  norm: kl,
  gather: Dl,
  unsortedSegmentSum: _l,
  basicLSTMCell: Ol,
  multiRNNCell: Ml,
  movingAverage: Fl,
  stridedSlice: Bl,
  topk: Pl,
  scatterND: Ll,
  fft: Wl,
  ifft: Ul,
  rfft: zl,
  irfft: Vl,
  sparseToDense: ql,
  gatherND: Hl,
  dropout: $l,
  hannWindow: Xl,
  hammingWindow: Yl,
  frame: Ql
});
exports.fused = bc;

var Ec = function () {
  function t() {
    this.blockSize = 48, this.firstUse = !0, a.get("IS_BROWSER") && (this.fromPixels2DContext = document.createElement("canvas").getContext("2d")), this.data = new Qn(this, At);
  }

  return t.prototype.register = function (t, e, n) {
    if (this.firstUse && (this.firstUse = !1, a.get("IS_NODE") && $e("\n============================\nHi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.\n============================\n")), this.data.has(t)) throw new Error("Data buffer is already registered");
    this.data.set(t, {
      dtype: n
    });
  }, t.prototype.write = function (t, e) {
    if (null == e) throw new Error("MathBackendCPU.write(): values can not be null");
    this.data.get(t).values = e;
  }, t.prototype.fromPixels = function (t, e) {
    if (null == t) throw new Error("pixels passed to tf.browser.fromPixels() can not be null");
    var n, r;
    if (a.get("IS_NODE") && null == t.getContext) throw new Error("When running in node, pixels must be an HTMLCanvasElement like the one returned by the `canvas` npm package");
    if (null != t.getContext) n = t.getContext("2d").getImageData(0, 0, t.width, t.height).data;else if (t instanceof ImageData || t.data instanceof Uint8Array) n = t.data;else {
      if (!(t instanceof HTMLImageElement || t instanceof HTMLVideoElement)) throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData or {data: Uint32Array, width: number, height: number}, but was " + t.constructor.name);
      if (null == this.fromPixels2DContext) throw new Error("Can't read pixels from HTMLImageElement outside the browser.");
      this.fromPixels2DContext.canvas.width = t.width, this.fromPixels2DContext.canvas.height = t.height, this.fromPixels2DContext.drawImage(t, 0, 0, t.width, t.height), n = this.fromPixels2DContext.getImageData(0, 0, t.width, t.height).data;
    }
    if (4 === e) r = new Int32Array(n);else {
      var o = t.width * t.height;
      r = new Int32Array(o * e);

      for (var i = 0; i < o; i++) for (var s = 0; s < e; ++s) r[i * e + s] = n[4 * i + s];
    }
    return Un(r, [t.height, t.width, e], "int32");
  }, t.prototype.read = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        return [2, this.readSync(t)];
      });
    });
  }, t.prototype.readSync = function (t) {
    var e = this.data.get(t),
        n = e.dtype,
        r = e.complexTensors;
    return "complex64" === n ? mr(this.readSync(r.real.dataId), this.readSync(r.imag.dataId)) : this.data.get(t).values;
  }, t.prototype.bufferSync = function (t) {
    return zr(t.shape, t.dtype, this.readSync(t.dataId));
  }, t.prototype.disposeData = function (t) {
    if (this.data.has(t)) {
      var e = this.data.get(t).complexTensors;
      null != e && (e.real.dispose(), e.imag.dispose()), this.data.delete(t);
    }
  }, t.prototype.time = function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        return e = K(), t(), [2, {
          kernelMs: K() - e
        }];
      });
    });
  }, t.prototype.memory = function () {
    return {
      unreliable: !0,
      reasons: ["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]
    };
  }, t.prototype.complex = function (t, e) {
    var n = ht.make(t.shape, {}, "complex64");
    return this.data.get(n.dataId).complexTensors = {
      real: At.keep(t.clone()),
      imag: At.keep(e.clone())
    }, n;
  }, t.prototype.real = function (t) {
    return this.data.get(t.dataId).complexTensors.real.clone();
  }, t.prototype.imag = function (t) {
    return this.data.get(t.dataId).complexTensors.imag.clone();
  }, t.prototype.assertNotComplex = function (t, e) {
    Array.isArray(t) || (t = [t]), t.forEach(function (t) {
      null != t && d("complex64" !== t.dtype, function () {
        return e + " does not support complex64 tensors.";
      });
    });
  }, t.prototype.slice = function (t, e, n) {
    if (this.assertNotComplex(t, "slice"), gn(t.shape, e, n)) {
      var r = yn(e, t.strides),
          o = y(n);
      return Bn(this.readSync(t.dataId).subarray(r, r + o), n, t.dtype);
    }

    for (var a = zr(n, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s).map(function (t, n) {
        return t + e[n];
      });
      a.values[s] = i.get.apply(i, u);
    }

    return a.toTensor();
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s, u) {
    this.assertNotComplex(t, "stridedSlice");
    var l = dn(t.shape, e, n, r, o, a, i, s, u),
        c = l[0],
        h = l[1],
        p = l[2],
        f = h.filter(function (t, e) {
      return -1 === p.indexOf(e);
    });
    if (f.some(function (t) {
      return 0 === t;
    })) return Bn([], f);

    for (var d = zr(h, t.dtype), v = this.bufferSync(t), m = 0; m < d.size; m++) {
      for (var g = d.indexToLoc(m), y = new Array(g.length), x = 0; x < y.length; x++) y[x] = g[x] * r[x] + c[x];

      d.set.apply(d, [v.get.apply(v, y)].concat(g));
    }

    return d.toTensor().reshape(f);
  }, t.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, t.prototype.reverse = function (t, e) {
    this.assertNotComplex(t, "reverse");

    for (var n = zr(t.shape, t.dtype), r = this.bufferSync(t), o = function (o) {
      var a = n.indexToLoc(o),
          i = a.slice();
      e.forEach(function (e) {
        return i[e] = t.shape[e] - 1 - i[e];
      }), n.set.apply(n, [r.get.apply(r, i)].concat(a));
    }, a = 0; a < n.size; a++) o(a);

    return n.toTensor();
  }, t.prototype.concat = function (t, e) {
    var n = this;
    this.assertNotComplex(t, "concat");
    var r = t.map(function (t) {
      var n = y(t.shape.slice(e));
      return t.as2D(-1, n);
    }),
        o = un(r.map(function (t) {
      return t.shape;
    }), 1),
        a = zr(o, t[0].dtype).values;

    if (1 === r[0].shape[0]) {
      var i = 0;
      r.forEach(function (t) {
        a.set(n.readSync(t.dataId), i), i += t.size;
      });
    } else {
      var s = 0;
      r.forEach(function (t) {
        for (var e = n.readSync(t.dataId), r = 0, i = 0; i < t.shape[0]; ++i) for (var u = i * o[1] + s, l = 0; l < t.shape[1]; ++l) a[u + l] = e[r++];

        s += t.shape[1];
      });
    }

    var u = un(t.map(function (t) {
      return t.shape;
    }), e);
    return Bn(a, u, t[0].dtype);
  }, t.prototype.neg = function (t) {
    return this.assertNotComplex(t, "neg"), this.multiply(Pn(-1), t);
  }, t.prototype.add = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t + n,
        imag: e + r
      };
    }) : this.broadcastedBinaryOp(t, e, wt(t.dtype, e.dtype), function (t, e) {
      return t + e;
    });
  }, t.prototype.addN = function (t) {
    var e = this;
    this.assertNotComplex(t, "addN");

    for (var n = t.map(function (t) {
      return e.readSync(t.dataId);
    }), r = zr(t[0].shape, t[0].dtype), o = r.values, a = 0; a < t.length; a++) for (var i = n[a], s = 0; s < o.length; s++) o[s] += i[s];

    return r.toTensor();
  }, t.prototype.subtract = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t - n,
        imag: e - r
      };
    }) : this.broadcastedBinaryOp(t, e, wt(t.dtype, e.dtype), function (t, e) {
      return t - e;
    });
  }, t.prototype.pow = function (t, e) {
    return this.assertNotComplex([t, e], "pow"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.pow(t, e);
    });
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    this.assertNotComplex([t, e], "matMul");

    for (var o = n ? t.shape[1] : t.shape[2], a = n ? t.shape[2] : t.shape[1], i = r ? e.shape[1] : e.shape[2], s = t.shape[0], u = this.readSync(t.dataId), l = this.readSync(e.dataId), c = n ? [t.strides[0], 1, t.strides[1]] : [t.strides[0], t.strides[1], 1], h = c[0], p = c[1], f = c[2], d = r ? [1, e.strides[1], e.strides[0]] : [e.strides[1], 1, e.strides[0]], v = d[0], m = d[1], g = d[2], y = a * i, x = zr([s, a, i], t.dtype), w = x.values, b = this.blockSize, C = 0; C < s; C++) for (var E = 0; E < a; E += b) for (var R = 0; R < i; R += b) for (var I = 0; I < o; I += b) for (var S = Math.min(E + b, a), N = Math.min(R + b, i), k = Math.min(I + b, o), A = E; A < S; A++) for (var T = R; T < N; T++) {
      for (var D = 0, _ = I; _ < k; _++) D += u[C * h + A * p + _ * f] * l[_ * v + T * m + C * g];

      w[C * y + (A * i + T)] += D;
    }

    return x.toTensor();
  }, t.prototype.fusedBatchMatMul = function (t, e, n, r, o, a) {
    var i = this.batchMatMul(t, e, n, r);
    return o && (i = this.add(i, o)), a && (i = function (t, e, n) {
      if ("linear" === e) return t.linear(n);
      if ("relu" === e) return t.relu(n);
      throw new Error("Activation " + e + " has not been implemented for the CPU backend.");
    }(this, a, i)), i;
  }, t.prototype.multiply = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t * n - e * r,
        imag: t * r + e * n
      };
    }) : this.broadcastedBinaryOp(t, e, wt(t.dtype, e.dtype), function (t, e) {
      return t * e;
    });
  }, t.prototype.realDivide = function (t, e) {
    this.assertNotComplex([t, e], "realDivide");
    return this.broadcastedBinaryOp(t, e, "float32", function (t, e) {
      return t / e;
    });
  }, t.prototype.floorDiv = function (t, e) {
    this.assertNotComplex([t, e], "floorDiv");
    return this.broadcastedBinaryOp(t, e, "int32", function (t, e) {
      return Math.floor(t / e);
    });
  }, t.prototype.sum = function (t, e) {
    this.assertNotComplex(t, "sum"), nn("sum", e, t.rank);

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, wt(t.dtype, "int32")), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = 0, p = 0; p < i; ++p) h += u[c + p];

      s[l] = h;
    }

    return a;
  }, t.prototype.prod = function (t, e) {
    this.assertNotComplex(t, "sum");

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, wt(t.dtype, "int32")), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = 1, p = 0; p < i; ++p) h *= u[c + p];

      s[l] = h;
    }

    return a;
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    this.assertNotComplex(t, "unsortedSegmentSum");

    for (var r = [], o = t.rank - e.rank, a = 0; a < o; ++a) e = e.expandDims(a + 1);

    for (a = 0; a < n; ++a) {
      var i = Pn(a, "int32"),
          s = Bu(i, e).asType("float32").mul(t).sum(0);
      r.push(s);
    }

    return lo(r);
  }, t.prototype.argMin = function (t, e) {
    this.assertNotComplex(t, "argMin");
    var n = [e];
    nn("argMin", n, t.rank);

    for (var r = tn(t.shape, n), o = r[0], a = r[1], i = Hn(o, "int32"), s = y(a), u = this.readSync(i.dataId), l = this.readSync(t.dataId), c = 0; c < u.length; ++c) {
      for (var h = c * s, p = l[h], f = 0, d = 0; d < s; ++d) {
        var v = l[h + d];
        v < p && (p = v, f = d);
      }

      u[c] = f;
    }

    return i;
  }, t.prototype.argMax = function (t, e) {
    this.assertNotComplex(t, "argMax");
    var n = [e];
    nn("argMax", n, t.rank);

    for (var r = tn(t.shape, n), o = r[0], a = r[1], i = Hn(o, "int32"), s = y(a), u = this.readSync(i.dataId), l = this.readSync(t.dataId), c = 0; c < u.length; ++c) {
      for (var h = c * s, p = l[h], f = 0, d = 0; d < s; ++d) {
        var v = l[h + d];
        v > p && (p = v, f = d);
      }

      u[c] = f;
    }

    return i;
  }, t.prototype.cumsum = function (t, e, n, r) {
    if (this.assertNotComplex(t, "cumsum"), e !== t.rank - 1) throw new Error("backend.cumsum in CPU expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);

    for (var o = wt(t.dtype, "int32"), a = Hn(t.shape, o), i = this.readSync(a.dataId), s = this.readSync(t.dataId), u = t.shape[t.rank - 1], l = r ? function (t, e) {
      return t + u - e - 1;
    } : function (t, e) {
      return t + e;
    }, c = 0; c < s.length; c += u) for (var h = 0; h < u; h++) {
      var p = l(c, h);
      if (0 === h) i[p] = n ? 0 : s[p];else {
        var f = l(c, h - 1);
        i[p] = n ? s[f] + i[f] : s[p] + i[f];
      }
    }

    return a;
  }, t.prototype.equal = function (t, e) {
    return this.assertNotComplex([t, e], "equal"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t === e ? 1 : 0;
    });
  }, t.prototype.notEqual = function (t, e) {
    return this.assertNotComplex([t, e], "notEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t !== e ? 1 : 0;
    });
  }, t.prototype.less = function (t, e) {
    return this.assertNotComplex([t, e], "less"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t < e ? 1 : 0;
    });
  }, t.prototype.lessEqual = function (t, e) {
    return this.assertNotComplex([t, e], "lessEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t <= e ? 1 : 0;
    });
  }, t.prototype.greater = function (t, e) {
    return this.assertNotComplex([t, e], "greater"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t > e ? 1 : 0;
    });
  }, t.prototype.greaterEqual = function (t, e) {
    return this.assertNotComplex([t, e], "greaterEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t >= e ? 1 : 0;
    });
  }, t.prototype.logicalNot = function (t) {
    this.assertNotComplex(t, "logicalNot");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) n[r] = e[r] ? 0 : 1;

    return ht.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.logicalAnd = function (t, e) {
    return this.assertNotComplex([t, e], "logicalAnd"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t && e;
    });
  }, t.prototype.logicalOr = function (t, e) {
    return this.assertNotComplex([t, e], "logicalOr"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t || e;
    });
  }, t.prototype.select = function (t, e, n) {
    this.assertNotComplex([t, e, n], "select");

    for (var r = this.readSync(t.dataId), o = this.readSync(e.dataId), a = this.readSync(n.dataId), i = Hn(e.shape, wt(e.dtype, n.dtype)), s = this.readSync(i.dataId), u = 0, l = 0 === t.rank || t.rank > 1 || 1 === e.rank ? 1 : e.shape[1], c = 0; c < r.length; c++) for (var h = 0; h < l; h++) 1 === r[c] ? s[u++] = o[c] : s[u++] = a[c];

    return i;
  }, t.prototype.where = function (t) {
    this.assertNotComplex([t], "where");
    var e = this.readSync(t.dataId);
    return vo(t.shape, e);
  }, t.prototype.topk = function (t, e, n) {
    return this.assertNotComplex(t, "topk"), Er(this.readSync(t.dataId), t.shape, t.dtype, e);
  }, t.prototype.min = function (t, e) {
    this.assertNotComplex(t, "min"), nn("min", e, t.rank);

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, t.dtype), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        f < h && (h = f);
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.minimum = function (t, e) {
    return this.assertNotComplex([t, e], "minimum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.min(t, e);
    });
  }, t.prototype.mod = function (t, e) {
    return this.assertNotComplex([t, e], "mod"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t % e;
      return t < 0 && e < 0 || t >= 0 && e >= 0 ? n : (n + e) % e;
    });
  }, t.prototype.max = function (t, e) {
    this.assertNotComplex(t, "max"), nn("max", e, t.rank);

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, t.dtype), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        f > h && (h = f);
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.maximum = function (t, e) {
    return this.assertNotComplex([t, e], "maximum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.max(t, e);
    });
  }, t.prototype.all = function (t, e) {
    this.assertNotComplex(t, "all"), nn("all", e, t.rank);

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, t.dtype), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        h = h && f;
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.any = function (t, e) {
    this.assertNotComplex(t, "any"), nn("any", e, t.rank);

    for (var n = tn(t.shape, e), r = n[0], o = n[1], a = Hn(r, t.dtype), i = y(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        h = h || f;
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.squaredDifference = function (t, e) {
    return this.assertNotComplex([t, e], "squaredDifference"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t - e;
      return n * n;
    });
  }, t.prototype.ceil = function (t) {
    this.assertNotComplex(t, "ceil");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.ceil(e[r]);

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.floor = function (t) {
    this.assertNotComplex(t, "floor");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.floor(e[r]);

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.sign = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) e[r] < 0 ? n[r] = -1 : e[r] > 0 ? n[r] = 1 : n[r] = 0;

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.isNaN = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isNaN(e[r]) && (n[r] = 1);

    return ht.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.isInf = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Math.abs(e[r]) === 1 / 0 && (n[r] = 1);

    return ht.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.isFinite = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isFinite(e[r]) && (n[r] = 1);

    return ht.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.round = function (t) {
    this.assertNotComplex(t, "round");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = Math.floor(e[r]);
      e[r] - o < .5 ? n[r] = Math.floor(e[r]) : e[r] - o > .5 ? n[r] = Math.ceil(e[r]) : n[r] = o % 2 == 0 ? o : o + 1;
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.exp = function (t) {
    this.assertNotComplex(t, "exp");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.exp(e[r]);

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.expm1 = function (t) {
    this.assertNotComplex(t, "expm1");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.expm1(e[r]);

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.log = function (t) {
    this.assertNotComplex(t, "log");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log(o);
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.log1p = function (t) {
    this.assertNotComplex(t, "log1p");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log1p(o);
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.sqrt = function (t) {
    this.assertNotComplex(t, "sqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.sqrt(o);
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.rsqrt = function (t) {
    this.assertNotComplex(t, "rsqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = 1 / Math.sqrt(o);
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.square = function (t) {
    this.assertNotComplex(t, "square");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = o * o;
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.reciprocal = function (t) {
    this.assertNotComplex(t, "reciprocal");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = 1 / e[r];

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.linear = function (t) {
    return t;
  }, t.prototype.relu = function (t) {
    this.assertNotComplex(t, "relu");

    for (var e = Hn(t.shape, t.dtype), n = this.readSync(e.dataId), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) n[o] = Math.max(0, r[o]);

    return e;
  }, t.prototype.prelu = function (t, e) {
    return this.assertNotComplex([t, e], "prelu"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return t < 0 ? e * t : t;
    });
  }, t.prototype.elu = function (t) {
    this.assertNotComplex(t, "elu");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = n[r];
      e[r] = o >= 0 ? o : Math.exp(o) - 1;
    }

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.eluDer = function (t, e) {
    this.assertNotComplex([t, e], "eluDer");

    for (var n = new Float32Array(e.size), r = this.readSync(e.dataId), o = this.readSync(t.dataId), a = 0; a < r.length; ++a) {
      var i = r[a];
      n[a] = i >= 1 ? o[a] : o[a] * (i + 1);
    }

    return ht.make(e.shape, {
      values: n
    });
  }, t.prototype.selu = function (t) {
    this.assertNotComplex(t, "selu");

    for (var e = Fi, n = Bi, r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i >= 0 ? n * i : e * (Math.exp(i) - 1);
    }

    return ht.make(t.shape, {
      values: r
    });
  }, t.prototype.clip = function (t, e, n) {
    this.assertNotComplex(t, "clip");

    for (var r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i > n ? n : i < e ? e : i;
    }

    return ht.make(t.shape, {
      values: r
    });
  }, t.prototype.abs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.abs(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.complexAbs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < t.size; ++r) {
      var o = n[2 * r],
          a = n[2 * r + 1];
      e[r] = Math.hypot(o, a);
    }

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.int = function (t) {
    this.assertNotComplex(t, "int");

    for (var e = new Int32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = n[r];

    return ht.make(t.shape, {
      values: e
    }, "int32");
  }, t.prototype.sigmoid = function (t) {
    this.assertNotComplex(t, "sigmoid");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = 1 / (1 + Math.exp(-n[r]));

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.softplus = function (t) {
    this.assertNotComplex(t, "softplus");

    for (var e = Math.log(1.1920928955078125e-7) + 2, n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o] > -e,
          i = r[o] < e,
          s = Math.exp(r[o]),
          u = void 0;
      u = i ? s : a ? r[o] : Math.log(1 + s), n[o] = u;
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.sin = function (t) {
    this.assertNotComplex(t, "sin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sin(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.cos = function (t) {
    this.assertNotComplex(t, "cos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cos(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.tan = function (t) {
    this.assertNotComplex(t, "tan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.tan(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.asin = function (t) {
    this.assertNotComplex(t, "asin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asin(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.acos = function (t) {
    this.assertNotComplex(t, "acos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acos(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.atan = function (t) {
    this.assertNotComplex(t, "atan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atan(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.atan2 = function (t, e) {
    return this.assertNotComplex([t, e], "atan2"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.atan2(t, e);
    });
  }, t.prototype.sinh = function (t) {
    this.assertNotComplex(t, "sinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sinh(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.cosh = function (t) {
    this.assertNotComplex(t, "cosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cosh(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.tanh = function (t) {
    this.assertNotComplex(t, "tanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = b(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.asinh = function (t) {
    this.assertNotComplex(t, "asinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asinh(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.acosh = function (t) {
    this.assertNotComplex(t, "acosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acosh(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.atanh = function (t) {
    this.assertNotComplex(t, "atanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atanh(n[r]);

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.erf = function (t) {
    this.assertNotComplex(t, "erf");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = n[r],
          a = 1 / (1 + .3275911 * o);
      e[r] = 1 - ((((1.061405429 * a - 1.453152027) * a + 1.421413741) * a - .284496736) * a + .254829592) * a * Math.exp(-o * o);
    }

    return ht.make(t.shape, {
      values: e
    });
  }, t.prototype.step = function (t, e) {
    void 0 === e && (e = 0), this.assertNotComplex(t, "step");

    for (var n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o];
      isNaN(a) ? n[o] = NaN : n[o] = a > 0 ? 1 : e;
    }

    return ht.make(t.shape, {
      values: n
    });
  }, t.prototype.conv2d = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2d");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, l = zr(n.outShape, t.dtype), c = this.readSync(t.dataId), h = this.readSync(e.dataId), p = l.values, f = 0; f < n.batchSize; ++f) for (var d = f * t.strides[0], v = f * l.strides[0], m = 0; m < n.outHeight; ++m) for (var g = v + m * l.strides[1], y = m * n.strideHeight - u, x = 0; x < r; x++) {
      var w = y + x * a;
      if (!(w < 0 || w >= n.inHeight)) for (var b = x * e.strides[0], C = d + w * t.strides[1], E = 0; E < n.outWidth; ++E) for (var R = g + E * n.outChannels, I = E * n.strideWidth - s, S = 0; S < o; S++) {
        var N = I + S * i;
        if (!(N < 0 || N >= n.inWidth)) for (var k = b + S * e.strides[1], A = C + N * n.inChannels, T = k, D = 0; D < n.inChannels; ++D) {
          for (var _ = c[A + D], O = 0; O < n.outChannels; ++O) p[R + O] += _ * h[T + O];

          T += n.outChannels;
        }
      }
    }

    return l.toTensor();
  }, t.prototype.conv3d = function (t, e, n) {
    for (var r = n.filterDepth, o = n.filterHeight, a = n.filterWidth, i = n.dilationDepth, s = n.dilationHeight, u = n.dilationWidth, l = n.padInfo.front, c = n.padInfo.left, h = n.padInfo.top, p = zr(n.outShape, t.dtype), f = this.readSync(t.dataId), d = this.readSync(e.dataId), v = p.values, m = 0; m < n.batchSize; ++m) for (var g = m * t.strides[0], y = m * p.strides[0], x = 0; x < n.outDepth; ++x) for (var w = y + x * p.strides[1], b = x * n.strideDepth - l, C = 0; C < r; C++) {
      var E = b + C * i;
      if (!(E < 0 || E >= n.inDepth)) for (var R = C * e.strides[0], I = g + E * t.strides[1], S = 0; S < n.outHeight; ++S) for (var N = w + S * p.strides[2], k = S * n.strideHeight - h, A = 0; A < o; A++) {
        var T = k + A * s;
        if (!(T < 0 || T >= n.inHeight)) for (var D = R + A * e.strides[1], _ = I + T * t.strides[2], O = 0; O < n.outWidth; ++O) for (var M = N + O * n.outChannels, F = O * n.strideWidth - c, B = 0; B < a; B++) {
          var P = F + B * u;
          if (!(P < 0 || P >= n.inWidth)) for (var L = D + B * e.strides[2], W = _ + P * n.inChannels, U = L, z = 0; z < n.inChannels; ++z) {
            for (var V = f[W + z], G = 0; G < n.outChannels; ++G) v[M + G] += V * d[U + G];

            U += n.outChannels;
          }
        }
      }
    }

    return p.toTensor();
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2dDerInput");

    for (var r = zr(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], l = this.readSync(t.dataId), c = t.strides, h = c[0], p = c[1], f = c[2], d = this.readSync(e.dataId), v = e.strides, m = v[0], g = v[1], y = v[2], x = n.batchSize, w = n.filterHeight, b = n.filterWidth, C = n.inChannels, E = n.inHeight, R = n.inWidth, I = n.outChannels, S = n.outHeight, N = n.outWidth, k = n.strideHeight, A = n.strideWidth, T = w - 1 - n.padInfo.top, D = b - 1 - n.padInfo.left, _ = 0; _ < x; ++_) for (var O = 0; O < C; ++O) for (var M = 0; M < E; ++M) for (var F = M - T, B = Math.max(0, Math.ceil(F / k)), P = Math.min(S, (w + F) / k), L = 0; L < R; ++L) {
      for (var W = L - D, U = Math.max(0, Math.ceil(W / A)), z = Math.min(N, (b + W) / A), V = 0, G = B; G < P; ++G) for (var q = G * k - F, H = U; H < z; ++H) for (var $ = h * _ + p * G + f * H, j = m * (w - 1 - q) + g * (b - 1 - (H * A - W)) + y * O, K = 0; K < I; ++K) {
        V += l[$ + K] * d[j + K];
      }

      o[i * _ + s * M + u * L + O] = V;
    }

    return r.toTensor();
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    for (var r = zr(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], l = a[3], c = this.readSync(t.dataId), h = t.strides, p = h[0], f = h[1], d = h[2], v = h[3], m = this.readSync(e.dataId), g = e.strides, y = g[0], x = g[1], w = g[2], b = g[3], C = n.batchSize, E = n.filterDepth, R = n.filterHeight, I = n.filterWidth, S = n.inChannels, N = n.inDepth, k = n.inHeight, A = n.inWidth, T = n.outChannels, D = n.outDepth, _ = n.outHeight, O = n.outWidth, M = n.strideDepth, F = n.strideHeight, B = n.strideWidth, P = E - 1 - n.padInfo.front, L = R - 1 - n.padInfo.top, W = I - 1 - n.padInfo.left, U = 0; U < C; ++U) for (var z = 0; z < S; ++z) for (var V = 0; V < N; ++V) for (var G = V - P, q = Math.max(0, Math.ceil(G / M)), H = Math.min(D, (E + G) / M), $ = 0; $ < k; ++$) for (var j = $ - L, K = Math.max(0, Math.ceil(j / F)), X = Math.min(_, (R + j) / F), Y = 0; Y < A; ++Y) {
      for (var Q = Y - W, J = Math.max(0, Math.ceil(Q / B)), Z = Math.min(O, (I + Q) / B), tt = 0, et = q; et < H; ++et) for (var nt = et * M - G, rt = K; rt < X; ++rt) for (var ot = rt * F - j, at = J; at < Z; ++at) for (var it = p * U + f * et + d * rt + v * at, st = y * (E - 1 - nt) + x * (R - 1 - ot) + w * (I - 1 - (at * B - Q)) + b * z, ut = 0; ut < T; ++ut) {
        tt += c[it + ut] * m[st + ut];
      }

      o[i * U + s * V + u * $ + l * Y + z] = tt;
    }

    return r.toTensor();
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2dDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = zr(n.filterShape, "float32"), u = n.padInfo.left, l = n.padInfo.top, c = this.bufferSync(t), h = this.bufferSync(e), p = 0; p < a; ++p) for (var f = Math.max(0, Math.ceil((l - p) / r)), d = Math.min(n.outHeight, (n.inHeight + l - p) / r), v = 0; v < i; ++v) for (var m = Math.max(0, Math.ceil((u - v) / o)), g = Math.min(n.outWidth, (n.inWidth + u - v) / o), y = 0; y < n.inChannels; ++y) for (var x = 0; x < n.outChannels; ++x) {
      for (var w = 0, b = 0; b < n.batchSize; ++b) for (var C = f; C < d; ++C) for (var E = p + C * r - l, R = m; R < g; ++R) {
        var I = v + R * o - u;
        w += c.get(b, E, I, y) * h.get(b, C, R, x);
      }

      s.set(w, p, v, y, x);
    }

    return s.toTensor();
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    for (var r = n.strideDepth, o = n.strideHeight, a = n.strideWidth, i = n.filterDepth, s = n.filterHeight, u = n.filterWidth, l = zr(n.filterShape, "float32"), c = l.values, h = l.strides, p = h[0], f = h[1], d = h[2], v = h[3], m = this.readSync(e.dataId), g = e.strides, y = g[0], x = g[1], w = g[2], b = g[3], C = this.readSync(t.dataId), E = t.strides, R = E[0], I = E[1], S = E[2], N = E[3], k = n.padInfo.front, A = n.padInfo.left, T = n.padInfo.top, D = 0; D < i; ++D) for (var _ = Math.max(0, Math.ceil((k - D) / r)), O = Math.min(n.outDepth, (n.inDepth + k - D) / r), M = D * p, F = 0; F < s; ++F) for (var B = Math.max(0, Math.ceil((T - F) / o)), P = Math.min(n.outHeight, (n.inHeight + T - F) / o), L = F * f + M, W = 0; W < u; ++W) for (var U = Math.max(0, Math.ceil((A - W) / a)), z = Math.min(n.outWidth, (n.inWidth + A - W) / a), V = W * d + L, G = 0; G < n.inChannels; ++G) for (var q = G * v + V, H = 0; H < n.outChannels; ++H) {
      for (var $ = 0, j = 0; j < n.batchSize; ++j) for (var K = j * R, X = j * y, Y = _; Y < O; ++Y) for (var Q = (D + Y * r - k) * I + K, J = Y * x + X, Z = B; Z < P; ++Z) for (var tt = (F + Z * o - T) * S + Q, et = Z * w + J, nt = U; nt < z; ++nt) {
        var rt = nt * b + et;
        $ += C[(W + nt * a - A) * N + tt + G] * m[rt + H];
      }

      c[q + H] = $;
    }

    return l.toTensor();
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2D");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, l = n.outChannels / n.inChannels, c = zr(n.outShape, t.dtype), h = this.readSync(t.dataId), p = this.readSync(e.dataId), f = c.values, d = 0; d < n.batchSize; ++d) for (var v = d * t.strides[0], m = d * c.strides[0], g = 0; g < n.outHeight; ++g) for (var y = m + g * c.strides[1], x = g * n.strideHeight - s, w = 0; w < r; ++w) {
      var b = x + w * a;
      if (!(b < 0 || b >= n.inHeight)) for (var C = w * e.strides[0], E = v + b * t.strides[1], R = 0; R < n.outWidth; ++R) for (var I = y + R * c.strides[2], S = R * n.strideWidth - u, N = 0; N < o; ++N) {
        var k = S + N * i;
        if (!(k < 0 || k >= n.inWidth)) for (var A = C + N * e.strides[1], T = E + k * n.inChannels, D = I, _ = A, O = 0; O < n.inChannels; ++O) {
          for (var M = h[T + O], F = 0; F < l; ++F) f[D + F] += M * p[_ + F];

          D += l, _ += l;
        }
      }
    }

    return c.toTensor();
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2DDerInput");

    for (var r = zr(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], l = this.readSync(t.dataId), c = t.strides, h = c[0], p = c[1], f = c[2], d = this.readSync(e.dataId), v = e.strides, m = v[0], g = v[1], y = v[2], x = n.batchSize, w = n.filterHeight, b = n.filterWidth, C = n.inChannels, E = n.inHeight, R = n.inWidth, I = n.outChannels, S = n.outHeight, N = n.outWidth, k = n.strideHeight, A = n.strideWidth, T = w - 1 - n.padInfo.top, D = b - 1 - n.padInfo.left, _ = I / C, O = 0; O < x; ++O) for (var M = 0; M < C; ++M) for (var F = 0; F < E; ++F) for (var B = F - T, P = Math.max(0, Math.ceil(B / k)), L = Math.min(S, (w + B) / k), W = 0; W < R; ++W) {
      for (var U = W - D, z = Math.max(0, Math.ceil(U / A)), V = Math.min(N, (b + U) / A), G = 0, q = P; q < L; ++q) for (var H = q * k - B, $ = z; $ < V; ++$) for (var j = h * O + p * q + f * $, K = m * (w - 1 - H) + g * (b - 1 - ($ * A - U)) + y * M, X = 0; X < _; ++X) {
        G += l[j + (M * _ + X)] * d[K + X];
      }

      o[i * O + s * F + u * W + M] = G;
    }

    return r.toTensor();
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2DDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = zr(n.filterShape, "float32"), u = n.padInfo.left, l = n.padInfo.top, c = n.outChannels / n.inChannels, h = this.bufferSync(t), p = this.bufferSync(e), f = 0; f < a; ++f) for (var d = Math.max(0, Math.ceil((l - f) / r)), v = Math.min(n.outHeight, (n.inHeight + l - f) / r), m = 0; m < i; ++m) for (var g = Math.max(0, Math.ceil((u - m) / o)), y = Math.min(n.outWidth, (n.inWidth + u - m) / o), x = 0; x < n.outChannels; ++x) {
      for (var w = Math.trunc(x / c), b = x % c, C = 0, E = 0; E < n.batchSize; ++E) for (var R = d; R < v; ++R) for (var I = f + R * r - l, S = g; S < y; ++S) {
        var N = m + S * o - u;
        C += h.get(E, I, N, w) * p.get(E, R, S, x);
      }

      s.set(C, f, m, w, b);
    }

    return s.toTensor();
  }, t.prototype.tile = function (t, e) {
    this.assertNotComplex(t, "tile");

    for (var n = new Array(t.rank), r = 0; r < n.length; r++) n[r] = t.shape[r] * e[r];

    var o = zr(n, t.dtype),
        a = this.bufferSync(t);

    for (r = 0; r < o.values.length; ++r) {
      for (var i = o.indexToLoc(r), s = new Array(t.rank), u = 0; u < s.length; u++) s[u] = i[u] % t.shape[u];

      var l = a.locToIndex(s);
      o.values[r] = a.values[l];
    }

    return o.toTensor();
  }, t.prototype.pad = function (t, e, n) {
    this.assertNotComplex(t, "pad");
    var r = e.map(function (e, n) {
      return e[0] + t.shape[n] + e[1];
    }),
        o = e.map(function (t) {
      return t[0];
    }),
        a = this.bufferSync(t),
        i = zr(r, t.dtype);
    0 !== n && i.values.fill(n);

    for (var s = 0; s < t.size; s++) {
      var u = a.indexToLoc(s),
          l = u.map(function (t, e) {
        return t + o[e];
      });
      i.set.apply(i, [a.get.apply(a, u)].concat(l));
    }

    return i.toTensor();
  }, t.prototype.transpose = function (t, e) {
    this.assertNotComplex(t, "transpose");

    for (var n = new Array(t.rank), r = 0; r < n.length; r++) n[r] = t.shape[e[r]];

    var o = this.readSync(t.dataId),
        a = zr(n, t.dtype),
        i = this.bufferSync(t);

    for (r = 0; r < t.size; ++r) {
      for (var s = i.indexToLoc(r), u = new Array(s.length), l = 0; l < u.length; l++) u[l] = s[e[l]];

      var c = a.locToIndex(u);
      a.values[c] = o[r];
    }

    return a.toTensor();
  }, t.prototype.gather = function (t, e, n) {
    this.assertNotComplex([t, e], "gather");
    var r = t.shape.slice(),
        o = this.readSync(e.dataId);
    r[n] = o.length;

    for (var a = zr(r, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s),
          l = u.slice();
      l[n] = o[u[n]];
      var c = i.locToIndex(l);
      a.values[s] = i.values[c];
    }

    return a.toTensor();
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    this.assertNotComplex([t], "batchToSpaceND");
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = je(t.shape, e, r),
        a = Ke(o.length, e.length),
        i = Xe(t.shape, e, r),
        s = Ye(n, e.length),
        u = Qe(i, n, e.length);
    return t.reshape(o).transpose(a).reshape(i).slice(s, u);
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    this.assertNotComplex([t], "spaceToBatchND");
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = je(i.shape, e, r, !1),
        u = Ke(s.length, e.length, !1),
        l = Xe(i.shape, e, r, !1);
    return i.reshape(s).transpose(u).reshape(l);
  }, t.prototype.pool = function (t, e, n) {
    this.assertNotComplex(t, "pool");

    for (var r = e.strideHeight, o = e.strideWidth, a = e.dilationHeight, i = e.dilationWidth, s = e.effectiveFilterHeight, u = e.effectiveFilterWidth, l = e.padInfo.top, c = e.padInfo.left, h = "max" === n ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, p = this.readSync(t.dataId), f = zr(e.outShape, t.dtype), d = f.values, v = e.outShape[1] * e.outShape[2] * e.outShape[3], m = e.outShape[2] * e.outShape[3], g = e.outShape[3], y = 0; y < e.batchSize; ++y) for (var x = y * v, w = y * t.strides[0], b = 0; b < e.inChannels; ++b) for (var C = 0; C < e.outHeight; ++C) for (var E = C * r - l, R = Math.max(0, E), I = Math.min(e.inHeight, s + E), S = x + C * m, N = 0; N < e.outWidth; ++N) {
      for (var k = N * o - c, A = Math.max(0, k), T = Math.min(e.inWidth, u + k), D = h, _ = 0, O = 0, M = R; M < I; M += a) {
        for (var F = w + M * t.strides[1], B = A; B < T; B += i) {
          var P = p[F + B * t.strides[2] + b];
          "max" === n && P > D ? D = P : "avg" === n && (_ += P, O++);
        }

        if (isNaN(D)) break;
      }

      d[S + N * g + b] = "avg" === n ? _ / O : D;
    }

    return f.toTensor();
  }, t.prototype.maxPool = function (t, e) {
    return this.pool(t, e, "max");
  }, t.prototype.maxPoolPositions = function (t, e) {
    for (var n = zr(e.outShape, "int32"), r = e.strideHeight, o = e.strideWidth, a = e.dilationHeight, i = e.dilationWidth, s = e.effectiveFilterHeight, u = e.effectiveFilterWidth, l = e.padInfo.top, c = e.padInfo.left, h = this.bufferSync(t), p = 0; p < e.batchSize; ++p) for (var f = 0; f < e.inChannels; ++f) for (var d = 0; d < e.outHeight; ++d) {
      for (var v = d * r - l, m = v; m < 0;) m += a;

      for (var g = Math.min(e.inHeight, s + v), y = 0; y < e.outWidth; ++y) {
        for (var x = y * o - c, w = x; w < 0;) w += i;

        for (var b = Math.min(e.inWidth, u + x), C = Number.NEGATIVE_INFINITY, E = -1, R = m; R < g; R += a) for (var I = R - v, S = w; S < b; S += i) {
          var N = S - x,
              k = h.get(p, R, S, f);
          k > C && (C = k, E = I * u + N);
        }

        n.set(E, p, d, y, f);
      }
    }

    return n.toTensor();
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    this.assertNotComplex([e, n], "maxPoolBackprop");

    for (var o = this.maxPoolPositions(e, r), a = r.strideHeight, i = r.strideWidth, s = r.dilationHeight, u = r.dilationWidth, l = r.effectiveFilterHeight, c = r.effectiveFilterWidth, h = c - 1 - r.padInfo.left, p = l - 1 - r.padInfo.top, f = zr(e.shape, "float32"), d = this.bufferSync(o), v = this.bufferSync(t), m = 0; m < r.batchSize; ++m) for (var g = 0; g < r.inChannels; ++g) for (var y = 0; y < r.inHeight; ++y) for (var x = 0; x < r.inWidth; ++x) {
      for (var w = y - p, b = x - h, C = 0, E = 0; E < l; E += s) {
        var R = (w + E) / a;
        if (!(R < 0 || R >= r.outHeight || Math.floor(R) !== R)) for (var I = 0; I < c; I += u) {
          var S = (b + I) / i;

          if (!(S < 0 || S >= r.outWidth || Math.floor(S) !== S)) {
            var N = l * c - 1 - d.get(m, R, S, g) === E * c + I ? 1 : 0;
            if (0 !== N) C += v.get(m, R, S, g) * N;
          }
        }
      }

      f.set(C, m, y, x, g);
    }

    return f.toTensor();
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "avgPoolBackprop");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = n.dilationHeight, u = n.dilationWidth, l = n.effectiveFilterHeight, c = n.effectiveFilterWidth, h = c - 1 - n.padInfo.left, p = l - 1 - n.padInfo.top, f = zr(e.shape, "float32"), d = 1 / (a * i), v = this.bufferSync(t), m = 0; m < n.batchSize; ++m) for (var g = 0; g < n.inChannels; ++g) for (var y = 0; y < n.inHeight; ++y) for (var x = 0; x < n.inWidth; ++x) {
      for (var w = y - p, b = x - h, C = 0, E = 0; E < l; E += s) {
        var R = (w + E) / r;
        if (!(R < 0 || R >= n.outHeight || Math.floor(R) !== R)) for (var I = 0; I < c; I += u) {
          var S = (b + I) / o;
          if (!(S < 0 || S >= n.outWidth || Math.floor(S) !== S)) C += v.get(m, R, S, g);
        }
      }

      f.set(C * d, m, y, x, g);
    }

    return f.toTensor();
  }, t.prototype.cast = function (t, e) {
    return pr(t, e, this);
  }, t.prototype.reshape = function (t, e) {
    return fr(t, e);
  }, t.prototype.avgPool = function (t, e) {
    return this.assertNotComplex(t, "avgPool"), this.pool(t, e, "avg").toFloat();
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    this.assertNotComplex(t, "resizeBilinear");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], l = this.readSync(t.dataId), c = new Float32Array(y([a, e, n, u])), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], p = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], f = 0, d = h[0] / p[0], v = h[1] / p[1], m = 0; m < a; m++) for (var g = 0; g < e; g++) for (var x = d * g, w = Math.floor(x), b = x - w, C = Math.min(i - 1, Math.ceil(x)), E = m * t.strides[0] + w * t.strides[1], R = m * t.strides[0] + C * t.strides[1], I = 0; I < n; I++) for (var S = v * I, N = Math.floor(S), k = S - N, A = Math.min(s - 1, Math.ceil(S)), T = E + N * t.strides[2], D = R + N * t.strides[2], _ = E + +A * t.strides[2], O = R + A * t.strides[2], M = 0; M < u; M++) {
      var F = l[T + M],
          B = l[D + M],
          P = F + (l[_ + M] - F) * k,
          L = P + (B + (l[O + M] - B) * k - P) * b;
      c[f++] = L;
    }

    return Bn(c, [a, e, n, u]);
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "resizeBilinearBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, l = u[1], c = u[2], h = new Float32Array(o * a * i * s), p = [n && l > 1 ? a - 1 : a, n && c > 1 ? i - 1 : i], f = [n && l > 1 ? l - 1 : l, n && c > 1 ? c - 1 : c], d = p[0] / f[0], v = p[1] / f[1], m = this.readSync(t.dataId), g = 0, y = 0; y < o; y++) for (var x = y * e.strides[0], w = 0; w < l; w++) for (var b = w * d, C = Math.floor(b), E = Math.min(Math.ceil(b), a - 1), R = x + C * e.strides[1], I = x + E * e.strides[1], S = b - C, N = 1 - S, k = 0; k < c; k++) for (var A = k * v, T = Math.floor(A), D = Math.min(Math.ceil(A), i - 1), _ = A - T, O = 1 - _, M = R + T * e.strides[2], F = R + D * e.strides[2], B = I + T * e.strides[2], P = I + D * e.strides[2], L = N * O, W = N * _, U = S * O, z = S * _, V = 0; V < s; V++) {
      var G = m[g++];
      h[M + V] += G * L, h[F + V] += G * W, h[B + V] += G * U, h[P + V] += G * z;
    }

    return zn(h, [o, i, a, s], e.dtype);
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    this.assertNotComplex(t, "resizeNearestNeighbor");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], l = this.readSync(t.dataId), c = new Float32Array(a * e * n * u), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], p = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], f = h[0] / p[0], d = h[1] / p[1], v = 0, m = 0; m < a; m++) for (var g = m * t.strides[0], y = 0; y < e; y++) for (var x = f * y, w = g + Math.min(i - 1, r ? Math.round(x) : Math.floor(x)) * t.strides[1], b = 0; b < n; b++) for (var C = d * b, E = w + Math.min(s - 1, r ? Math.round(C) : Math.floor(C)) * t.strides[2], R = 0; R < u; R++) {
      var I = l[E + R];
      c[v++] = I;
    }

    return Bn(c, [a, e, n, u], t.dtype);
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "resizeNearestNeighborBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, l = u[1], c = u[2], h = new Float32Array(o * a * i * s), p = this.readSync(t.dataId), f = [n && l > 1 ? a - 1 : a, n && c > 1 ? i - 1 : i], d = [n && l > 1 ? l - 1 : l, n && c > 1 ? c - 1 : c], v = f[0] / d[0], m = f[1] / d[1], g = 1 / v, y = 1 / m, x = 2 * Math.ceil(g) + 2, w = 2 * Math.ceil(y) + 2, b = 0; b < o; b++) for (var C = b * e.strides[0], E = 0; E < a; E++) for (var R = C + E * e.strides[1], I = Math.floor(E * g), S = Math.floor(I - x / 2), N = 0; N < i; N++) for (var k = R + N * e.strides[2], A = Math.floor(N * y), T = Math.floor(A - w / 2), D = 0; D < s; D++) {
      for (var _ = 0, O = 0; O < x; O++) {
        var M = O + S;

        if (!(M < 0 || M >= l)) {
          var F = C + M * t.strides[1],
              B = M * v;
          if (E === Math.min(a - 1, n ? Math.round(B) : Math.floor(B))) for (var P = 0; P < w; P++) {
            var L = P + T;

            if (!(L < 0 || L >= c)) {
              var W = F + L * t.strides[2],
                  U = L * m;
              N === Math.min(i - 1, n ? Math.round(U) : Math.floor(U)) && (_ += p[W + D]);
            }
          }
        }
      }

      h[k + D] = _;
    }

    return zn(h, e.shape, e.dtype);
  }, t.prototype.batchNormalization = function (t, e, n, r, o, a) {
    this.assertNotComplex([t, e, n, o, a], "batchNorm");

    for (var i = this.readSync(t.dataId), s = this.readSync(e.dataId), u = this.readSync(n.dataId), l = o ? this.readSync(o.dataId) : new Float32Array([1]), c = a ? this.readSync(a.dataId) : new Float32Array([0]), h = new Float32Array(i.length), p = c.length, f = l.length, d = u.length, v = s.length, m = 0, g = 0, y = 0, x = 0, w = 0; w < i.length; ++w) h[w] = c[m++] + (i[w] - s[g++]) * l[y++] / Math.sqrt(u[x++] + r), m >= p && (m = 0), g >= v && (g = 0), y >= f && (y = 0), x >= d && (x = 0);

    return zn(h, t.shape);
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    this.assertNotComplex(t, "localResponseNormalization4D");
    var a = t.shape[3],
        i = a - 1,
        s = this.readSync(t.dataId),
        u = t.size,
        l = new Float32Array(u);

    function c(t) {
      for (var n = t % a, r = t - n + Math.max(0, n - e), o = t - n + Math.min(n + e, i), u = 0; r <= o; r++) {
        var l = s[r];
        u += l * l;
      }

      return u;
    }

    for (var h = 0; h < u; h++) {
      var p = c(h),
          f = s[h] * Math.pow(n + r * p, -o);
      l[h] = f;
    }

    return zn(l, t.shape);
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    this.assertNotComplex(t, "LRNGrad");

    for (var s = t.shape[3], u = this.readSync(t.dataId), l = this.readSync(e.dataId), c = this.readSync(n.dataId), h = new Float32Array(t.size), p = t.size, f = 0; f < p; f++) {
      for (var d = f % s, v = f - d + Math.max(0, d - r), m = f - d + Math.min(s, d + r + 1), g = 0, y = v; y < m; y++) g += Math.pow(l[y], 2);

      g = a * g + o;

      for (y = v; y < m; y++) {
        var x = -2 * a * i * l[y] * c[f] / g;
        f === y && (x += Math.pow(g, -i)), x *= u[f], h[y] += x;
      }
    }

    return zn(h, t.shape);
  }, t.prototype.multinomial = function (t, e, n, r) {
    this.assertNotComplex(t, "multinomial");

    for (var o = e ? t : Dn(t), a = o.shape[0], i = o.shape[1], s = Hn([a, n], "int32"), u = this.readSync(s.dataId), l = this.readSync(o.dataId), c = 0; c < a; ++c) {
      var h = c * i,
          p = new Float32Array(i - 1);
      p[0] = l[h];

      for (var f = 1; f < p.length; ++f) p[f] = p[f - 1] + l[h + f];

      for (var d = Lr(r.toString()), v = c * n, m = 0; m < n; ++m) {
        var g = d();
        u[v + m] = p.length;

        for (var y = 0; y < p.length; y++) if (g < p[y]) {
          u[v + m] = y;
          break;
        }
      }
    }

    return s;
  }, t.prototype.oneHot = function (t, e, n, r) {
    this.assertNotComplex(t, "oneHot");
    var o = new Float32Array(t.size * e);
    o.fill(r);

    for (var a = this.readSync(t.dataId), i = 0; i < t.size; ++i) a[i] >= 0 && a[i] < e && (o[i * e + a[i]] = n);

    return Wn(o, [t.size, e], "int32");
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return this.assertNotComplex(t, "nonMaxSuppression"), wr(this.readSync(t.dataId), this.readSync(e.dataId), n, r, o);
  }, t.prototype.fft = function (t) {
    return this.fftBatch(t, !1);
  }, t.prototype.ifft = function (t) {
    return this.fftBatch(t, !0);
  }, t.prototype.fftBatch = function (t, e) {
    for (var n = t.shape[0], r = t.shape[1], o = zr(t.shape, "float32"), a = zr(t.shape, "float32"), i = Mn(t).as2D(n, r), s = Fn(t).as2D(n, r), u = 0; u < n; u++) for (var l = i.slice([u, 0], [1, r]), c = s.slice([u, 0], [1, r]), h = On(l, c), p = this.readSync(this.fftImpl(h, e).dataId), f = 0; f < r; f++) {
      var d = gr(p, f);
      o.values[u * r + f] = d.real, a.values[u * r + f] = d.imag;
    }

    return On(o.toTensor(), a.toTensor()).as2D(n, r);
  }, t.prototype.fftImpl = function (t, e) {
    var n = t.as1D(),
        r = n.size;

    if (this.isExponentOf2(r)) {
      var o = this.fftRadix2(n, r, e).as2D(t.shape[0], t.shape[1]);
      return e && (o = On(Mn(o).div(Pn(r)), Fn(o).div(Pn(r)))), o;
    }

    var a = this.readSync(t.dataId),
        i = function (t) {
      for (var e = new Float32Array(t.length / 2), n = new Float32Array(t.length / 2), r = 0; r < t.length; r += 2) e[r / 2] = t[r], n[r / 2] = t[r + 1];

      return {
        real: e,
        imag: n
      };
    }(this.fourierTransformByMatmul(a, r, e));

    return On(i.real, i.imag).as2D(t.shape[0], t.shape[1]);
  }, t.prototype.isExponentOf2 = function (t) {
    return 0 == (t & t - 1);
  }, t.prototype.fftRadix2 = function (t, e, n) {
    if (1 === e) return t;

    var r = this.readSync(t.dataId),
        o = e / 2,
        a = function (t) {
      for (var e = Math.ceil(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 0; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        i = On(a.real, a.imag).as1D(),
        s = function (t) {
      for (var e = Math.floor(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 2; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        u = On(s.real, s.imag).as1D();

    i = this.fftRadix2(i, o, n), u = this.fftRadix2(u, o, n);

    var l = function (t, e) {
      for (var n = new Float32Array(t / 2), r = new Float32Array(t / 2), o = 0; o < Math.ceil(t / 2); o++) {
        var a = (e ? 2 : -2) * Math.PI * (o / t);
        n[o] = Math.cos(a), r[o] = Math.sin(a);
      }

      return {
        real: n,
        imag: r
      };
    }(e, n),
        c = On(l.real, l.imag).mul(u),
        h = i.add(c),
        p = i.sub(c),
        f = Mn(h).concat(Mn(p)),
        d = Fn(h).concat(Fn(p));

    return On(f, d).as1D();
  }, t.prototype.fourierTransformByMatmul = function (t, e, n) {
    for (var r = new Float32Array(2 * e), o = 0; o < e; o++) {
      for (var a = 0, i = 0, s = 0; s < e; s++) {
        var u = xr(o * s, e, n),
            l = gr(t, s);
        a += l.real * u.real - l.imag * u.imag, i += l.real * u.imag + l.imag * u.real;
      }

      n && (a /= e, i /= e), yr(r, a, i, o);
    }

    return r;
  }, t.prototype.depthToSpace = function (t, e, n) {
    d("NHWC" === n, function () {
      return "Only NHWC dataFormat supported on CPU for depthToSpace. Got " + n;
    }), d(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });

    for (var r = t.shape[0], o = t.shape[1], a = t.shape[2], i = t.shape[3], s = o * e, u = a * e, l = i / (e * e), c = this.readSync(t.dataId), h = new Float32Array(r * s * u * l), p = 0, f = 0; f < r; ++f) for (var v = 0; v < s; ++v) for (var m = Math.floor(v / e), g = v % e, y = 0; y < u; ++y) for (var x = Math.floor(y / e), w = (g * e + y % e) * l, b = 0; b < l; ++b) {
      var C = b + w + i * (x + a * (m + o * f));
      h[p++] = c[C];
    }

    return zn(h, [r, s, u, l]);
  }, t.prototype.broadcastedBinaryOp = function (t, e, n, r) {
    var o = er(t.shape, e.shape),
        a = zr(o, n),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = Zn(t.shape, o),
        l = Zn(e.shape, o),
        c = a.values;
    if (u.length + l.length === 0) for (var h = 0; h < c.length; ++h) c[h] = r(i[h % i.length], s[h % s.length]);else {
      var p = this.bufferSync(t),
          f = this.bufferSync(e),
          d = function (n) {
        var o = a.indexToLoc(n),
            h = o.slice(-t.rank);
        u.forEach(function (t) {
          return h[t] = 0;
        });
        var d = p.locToIndex(h),
            v = o.slice(-e.rank);
        l.forEach(function (t) {
          return v[t] = 0;
        });
        var m = f.locToIndex(v);
        c[n] = r(i[d], s[m]);
      };

      for (h = 0; h < c.length; ++h) d(h);
    }
    return a.toTensor();
  }, t.prototype.broadcastedBinaryComplexOp = function (t, e, n) {
    var r = er(t.shape, e.shape),
        o = zr(r, "float32"),
        a = zr(r, "float32"),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = Zn(t.shape, r),
        l = Zn(e.shape, r),
        c = o.values,
        h = a.values;
    if (u.length + l.length === 0) for (var p = 0; p < c.length; p++) {
      var f = p % i.length,
          d = p % s.length,
          v = n(i[2 * f], i[2 * f + 1], s[2 * d], s[2 * d + 1]);
      c[p] = v.real, h[p] = v.imag;
    } else {
      var m = this.bufferSync(this.data.get(t.dataId).complexTensors.real),
          g = this.bufferSync(this.data.get(e.dataId).complexTensors.real),
          y = function (r) {
        var a = o.indexToLoc(r),
            p = a.slice(-t.rank);
        u.forEach(function (t) {
          return p[t] = 0;
        });
        var f = m.locToIndex(p),
            d = a.slice(-e.rank);
        l.forEach(function (t) {
          return d[t] = 0;
        });
        var v = g.locToIndex(d),
            y = n(i[2 * f], i[2 * f + 1], s[2 * v], s[2 * v + 1]);
        c[r] = y.real, h[r] = y.imag;
      };

      for (p = 0; p < c.length; p++) y(p);
    }
    return this.complex(o.toTensor(), a.toTensor());
  }, t.prototype.split = function (t, e, n) {
    return Cr(t, e, n);
  }, t.prototype.dispose = function () {}, t.prototype.floatPrecision = function () {
    return 32;
  }, t.prototype.epsilon = function () {
    return 1e-7;
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    for (var i = t.shape, s = i[0], u = i[1], l = i[2], c = i[3], h = e.shape[0], p = r[0], f = r[1], d = zr([h, p, f, c], t.dtype), v = this.readSync(e.dataId), m = this.readSync(n.dataId), g = this.readSync(t.dataId), y = t.strides, x = d.strides, w = 0; w < h; w++) {
      var b = 4 * w,
          C = v[b],
          E = v[b + 1],
          R = v[b + 2],
          I = v[b + 3],
          S = m[w];
      if (!(S >= s)) for (var N = p > 1 ? (R - C) * (u - 1) / (p - 1) : 0, k = f > 1 ? (I - E) * (l - 1) / (f - 1) : 0, A = 0; A < p; A++) {
        var T = p > 1 ? C * (u - 1) + A * N : .5 * (C + R) * (u - 1);
        if (T < 0 || T > u - 1) for (var D = 0; D < f; D++) for (var _ = 0; _ < c; _++) {
          var O = _ + D * x[2] + A * x[1] + w * x[0];
          d.values[O] = a;
        } else if ("bilinear" === o) {
          var M = Math.floor(T),
              F = Math.ceil(T),
              B = T - M;

          for (D = 0; D < f; D++) {
            if ((H = f > 1 ? E * (l - 1) + D * k : .5 * (E + I) * (l - 1)) < 0 || H > l - 1) for (_ = 0; _ < c; _++) {
              O = _ + D * x[2] + A * x[1] + w * x[0];
              d.values[O] = a;
            } else {
              var P = Math.floor(H),
                  L = Math.ceil(H),
                  W = H - P;

              for (_ = 0; _ < c; _++) {
                var U = g[O = _ + P * y[2] + M * y[1] + S * y[0]],
                    z = g[O = _ + L * y[2] + M * y[1] + S * y[0]],
                    V = g[O = _ + P * y[2] + F * y[1] + S * y[0]],
                    G = U + (z - U) * W,
                    q = V + (g[O = _ + L * y[2] + F * y[1] + S * y[0]] - V) * W;
                O = _ + D * x[2] + A * x[1] + w * x[0], d.values[O] = G + (q - G) * B;
              }
            }
          }
        } else for (D = 0; D < f; ++D) {
          var H;
          if ((H = f > 1 ? E * (l - 1) + D * k : .5 * (E + I) * (l - 1)) < 0 || H > l - 1) for (_ = 0; _ < c; _++) {
            O = _ + D * x[2] + A * x[1] + w * x[0];
            d.values[O] = a;
          } else {
            var $ = Math.round(H),
                j = Math.round(T);

            for (_ = 0; _ < c; _++) {
              var K = _ + $ * y[2] + j * y[1] + S * y[0],
                  X = _ + D * x[2] + A * x[1] + w * x[0];
              d.values[X] = g[K];
            }
          }
        }
      }
    }

    return d.toTensor();
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    var o = fn(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.sliceSize,
        u = o.strides,
        l = o.outputSize;
    return this.scatter(t, e, n, l, s, i, a, u, r, !1);
  }, t.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = ln(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3];
    if (0 === i) return Bn([], a, t.dtype);

    for (var l = new st([i, s], t.dtype), c = this.readSync(e.dataId), h = this.readSync(t.dataId), p = 0; p < i; p++) {
      for (var f = [], d = 0, v = 0; v < r; v++) {
        var m = c[p * r + v];
        d += m * u[v], f.push(m);
      }

      if (d < 0 || d >= t.size / s) throw new Error("Invalid indices: " + f + " does not index into " + t.shape);

      for (var g = 0; g < s; g++) l.values[p * s + g] = h[d * s + g];
    }

    return l.toTensor().reshape(a);
  }, t.prototype.scatterND = function (t, e, n) {
    var r = fn(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        l = Pn(0);
    return this.scatter(t, e, n, u, i, a, o, s, l, !0);
  }, t.prototype.fill = function (t, e, n) {
    var r = A(n = n || U(e), y(t));
    return r.fill(e), ht.make(t, {
      values: r
    }, n);
  }, t.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported for string tensors");
    return this.fill(t.shape, 1, t.dtype);
  }, t.prototype.zerosLike = function (t) {
    var e = A(t.dtype, y(t.shape));
    return ht.make(t.shape, {
      values: e
    }, t.dtype);
  }, t.prototype.linspace = function (t, e, n) {
    return dr(t, e, n);
  }, t.prototype.scatter = function (t, e, n, r, o, a, i, s, u, l) {
    var c = [r / o, o],
        h = this.readSync(t.dataId),
        p = this.readSync(e.dataId);
    if (0 === r) return Bn([], n, e.dtype);
    var f = new st(c, e.dtype);
    f.values.fill(this.readSync(u.dataId)[0]);

    for (var d = 0; d < a; d++) {
      for (var v = [], m = 0, g = 0; g < i; g++) {
        var y = h[d * i + g];
        v.push(y), m += y * s[g];
      }

      if (m < 0 || m >= r / o) throw new Error("Invalid indices: " + v + " does not index into " + n);

      for (var x = 0; x < o; x++) l ? f.values[m * o + x] += p[d * o + x] : f.values[m * o + x] = 0 === e.rank ? p[0] : p[d * o + x];
    }

    return f.toTensor().reshape(n);
  }, t;
}();

At.registerBackend("cpu", function () {
  return new Ec();
}, 1);

var Rc = function () {
  function t() {}

  return t.prototype.fetch = function (t, e) {
    return fetch(t, e);
  }, t;
}();

a.get("IS_BROWSER") && a.setPlatform("browser", new Rc());

var Ic,
    Sc = function () {
  return require("node-fetch");
},
    Nc = function () {
  function t() {}

  return t.prototype.fetch = function (t, e) {
    return null != a.global.fetch ? a.global.fetch(t, e) : (null == Ic && (Ic = Sc()), Ic(t, e));
  }, t;
}();

a.get("IS_NODE") && a.setPlatform("node", new Nc());
var kc = {
  float32: 4,
  int32: 4,
  uint16: 2,
  uint8: 1,
  bool: 1
};

function Ac(t, e) {
  for (var n = {}, r = 0, o = function (e) {
    var o = e.name,
        a = e.dtype,
        i = e.shape,
        s = y(i),
        u = void 0;

    if (("quantization" in e)) {
      var l = e.quantization;
      if ("uint8" !== l.dtype && "uint16" !== l.dtype) throw new Error("Weight " + e.name + " has unknown quantization dtype " + l.dtype + ". Supported quantization dtypes are: 'uint8' and 'uint16'.");
      var c = kc[l.dtype],
          h = t.slice(r, r + s * c),
          p = "uint8" === l.dtype ? new Uint8Array(h) : new Uint16Array(h);
      if ("float32" === a) u = Float32Array.from(p, function (t) {
        return t * l.scale + l.min;
      });else {
        if ("int32" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = Int32Array.from(p, function (t) {
          return Math.round(t * l.scale + l.min);
        });
      }
      r += s * c;
    } else {
      var f = kc[a];
      h = t.slice(r, r + s * f);
      if ("float32" === a) u = new Float32Array(h);else if ("int32" === a) u = new Int32Array(h);else {
        if ("bool" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = new Uint8Array(h);
      }
      r += s * f;
    }

    var d = void 0;
    if ("float32" === a) d = Bn(u, i, "float32");else if ("int32" === a) d = Bn(u, i, "int32");else {
      if ("bool" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
      d = Bn(u, i, "bool");
    }
    n[o] = d;
  }, a = 0, i = e; a < i.length; a++) {
    o(i[a]);
  }

  return n;
}

function Tc(t) {
  if (null === t) throw new Error("Invalid input value: " + JSON.stringify(t));
  var e = 0,
      n = [];
  t.forEach(function (t) {
    if (e += t.byteLength, n.push(t.byteLength === t.buffer.byteLength ? t : new t.constructor(t)), !(t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array)) throw new Error("Unsupported TypedArray subtype: " + t.constructor.name);
  });
  var r = new Uint8Array(e),
      o = 0;
  return n.forEach(function (t) {
    r.set(new Uint8Array(t.buffer), o), o += t.byteLength;
  }), r.buffer;
}

var Dc = "undefined" != typeof Buffer && ("undefined" == typeof Blob || "undefined" == typeof atob || "undefined" == typeof btoa);

function _c(t) {
  return Dc ? Buffer.byteLength(t) : new Blob([t]).size;
}

function Oc(t) {
  var e = 0;
  t.forEach(function (t) {
    e += t.byteLength;
  });
  var n = new Uint8Array(e),
      r = 0;
  return t.forEach(function (t) {
    n.set(new Uint8Array(t), r), r += t.byteLength;
  }), n.buffer;
}

function Mc(t) {
  for (t = t.trim(); t.endsWith("/");) t = t.slice(0, t.length - 1);

  var e = t.split("/");
  return e[e.length - 1];
}

function Fc(t) {
  if (t.modelTopology instanceof ArrayBuffer) throw new Error("Expected JSON model topology, received ArrayBuffer.");
  return {
    dateSaved: new Date(),
    modelTopologyType: "JSON",
    modelTopologyBytes: null == t.modelTopology ? 0 : _c(JSON.stringify(t.modelTopology)),
    weightSpecsBytes: null == t.weightSpecs ? 0 : _c(JSON.stringify(t.weightSpecs)),
    weightDataBytes: null == t.weightData ? 0 : t.weightData.byteLength
  };
}

var Bc = function () {
  function t() {
    this.saveRouters = [], this.loadRouters = [];
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerSaveRouter = function (e) {
    t.getInstance().saveRouters.push(e);
  }, t.registerLoadRouter = function (e) {
    t.getInstance().loadRouters.push(e);
  }, t.getSaveHandlers = function (e) {
    return t.getHandlers(e, "save");
  }, t.getLoadHandlers = function (e, n) {
    return t.getHandlers(e, "load", n);
  }, t.getHandlers = function (e, n, r) {
    var o = [];
    return ("load" === n ? t.getInstance().loadRouters : t.getInstance().saveRouters).forEach(function (t) {
      var n = t(e, r);
      null !== n && o.push(n);
    }), o;
  }, t;
}(),
    Pc = "://",
    Lc = function () {
  function t() {
    this.managers = {};
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerManager = function (e, n) {
    d(null != e, function () {
      return "scheme must not be undefined or null.";
    }), e.endsWith(Pc) && (e = e.slice(0, e.indexOf(Pc))), d(e.length > 0, function () {
      return "scheme must not be an empty string.";
    });
    var r = t.getInstance();
    d(null == r.managers[e], function () {
      return "A model store manager is already registered for scheme '" + e + "'.";
    }), r.managers[e] = n;
  }, t.getManager = function (t) {
    var e = this.getInstance().managers[t];
    if (null == e) throw new Error("Cannot find model manager for scheme '" + t + "'");
    return e;
  }, t.getSchemes = function () {
    return Object.keys(this.getInstance().managers);
  }, t;
}();

function Wc(t) {
  if (-1 === t.indexOf(Pc)) throw new Error("The url string provided does not contain a scheme. Supported schemes are: " + Lc.getSchemes().join(","));
  return {
    scheme: t.split(Pc)[0],
    path: t.split(Pc)[1]
  };
}

function Uc(t, e, n) {
  return void 0 === n && (n = !1), r(this, void 0, void 0, function () {
    var r, a, i, s, u, l, c, h, p;
    return o(this, function (o) {
      switch (o.label) {
        case 0:
          return d(t !== e, function () {
            return "Old path and new path are the same: '" + t + "'";
          }), d((r = Bc.getLoadHandlers(t)).length > 0, function () {
            return "Copying failed because no load handler is found for source URL " + t + ".";
          }), d(r.length < 2, function () {
            return "Copying failed because more than one (" + r.length + ") load handlers for source URL " + t + ".";
          }), a = r[0], d((i = Bc.getSaveHandlers(e)).length > 0, function () {
            return "Copying failed because no save handler is found for destination URL " + e + ".";
          }), d(i.length < 2, function () {
            return "Copying failed because more than one (" + r.length + ") save handlers for destination URL " + e + ".";
          }), s = i[0], u = Wc(t).scheme, l = Wc(t).path, c = u === Wc(t).scheme, [4, a.load()];

        case 1:
          return h = o.sent(), n && c ? [4, Lc.getManager(u).removeModel(l)] : [3, 3];

        case 2:
          o.sent(), o.label = 3;

        case 3:
          return [4, s.save(h)];

        case 4:
          return p = o.sent(), !n || c ? [3, 6] : [4, Lc.getManager(u).removeModel(l)];

        case 5:
          o.sent(), o.label = 6;

        case 6:
          return [2, p.modelArtifactsInfo];
      }
    });
  });
}

var zc = "models_store",
    Vc = "model_info_store";

function Gc() {
  if (!a.getBool("IS_BROWSER")) throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");
  var t = window,
      e = t.indexedDB || t.mozIndexedDB || t.webkitIndexedDB || t.msIndexedDB || t.shimIndexedDB;
  if (null == e) throw new Error("The current browser does not appear to support IndexedDB.");
  return e;
}

function qc(t) {
  var e = t.result;
  e.createObjectStore(zc, {
    keyPath: "modelPath"
  }), e.createObjectStore(Vc, {
    keyPath: "modelPath"
  });
}

var Hc = function () {
  function t(t) {
    if (this.indexedDB = Gc(), null == t || !t) throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");
    this.modelPath = t;
  }

  return t.prototype.save = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        return [2, this.databaseAction(this.modelPath, t)];
      });
    });
  }, t.prototype.load = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        return [2, this.databaseAction(this.modelPath)];
      });
    });
  }, t.prototype.databaseAction = function (t, e) {
    var n = this;
    return new Promise(function (t, r) {
      var o = n.indexedDB.open("tensorflowjs", 1);
      o.onupgradeneeded = function () {
        return qc(o);
      }, o.onsuccess = function () {
        var a = o.result;

        if (null == e) {
          var i = a.transaction(zc, "readonly"),
              s = i.objectStore(zc).get(n.modelPath);
          s.onsuccess = function () {
            if (null == s.result) return a.close(), r(new Error("Cannot find model with path '" + n.modelPath + "' in IndexedDB."));
            t(s.result.modelArtifacts);
          }, s.onerror = function (t) {
            return a.close(), r(s.error);
          }, i.oncomplete = function () {
            return a.close();
          };
        } else {
          var u,
              l = Fc(e),
              c = a.transaction(Vc, "readwrite"),
              h = c.objectStore(Vc),
              p = h.put({
            modelPath: n.modelPath,
            modelArtifactsInfo: l
          });
          p.onsuccess = function () {
            var o = (u = a.transaction(zc, "readwrite")).objectStore(zc).put({
              modelPath: n.modelPath,
              modelArtifacts: e,
              modelArtifactsInfo: l
            });
            o.onsuccess = function () {
              return t({
                modelArtifactsInfo: l
              });
            }, o.onerror = function (t) {
              var e = (h = c.objectStore(Vc)).delete(n.modelPath);
              e.onsuccess = function () {
                return a.close(), r(o.error);
              }, e.onerror = function (t) {
                return a.close(), r(o.error);
              };
            };
          }, p.onerror = function (t) {
            return a.close(), r(p.error);
          }, c.oncomplete = function () {
            null == u ? a.close() : u.oncomplete = function () {
              return a.close();
            };
          };
        }
      }, o.onerror = function (t) {
        return r(o.error);
      };
    });
  }, t.URL_SCHEME = "indexeddb://", t;
}(),
    $c = function (t) {
  return a.getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(Hc.URL_SCHEME) ? (e = t.slice(Hc.URL_SCHEME.length), new Hc(e)) : null;
  var e;
};

Bc.registerSaveRouter($c), Bc.registerLoadRouter($c);

var jc = function () {
  function t() {
    this.indexedDB = Gc();
  }

  return t.prototype.listModels = function () {
    return r(this, void 0, void 0, function () {
      var t = this;
      return o(this, function (e) {
        return [2, new Promise(function (e, n) {
          var r = t.indexedDB.open("tensorflowjs", 1);
          r.onupgradeneeded = function () {
            return qc(r);
          }, r.onsuccess = function () {
            var t = r.result,
                o = t.transaction(Vc, "readonly"),
                a = o.objectStore(Vc).getAll();
            a.onsuccess = function () {
              for (var t = {}, n = 0, r = a.result; n < r.length; n++) {
                var o = r[n];
                t[o.modelPath] = o.modelArtifactsInfo;
              }

              e(t);
            }, a.onerror = function (e) {
              return t.close(), n(a.error);
            }, o.oncomplete = function () {
              return t.close();
            };
          }, r.onerror = function (t) {
            return n(r.error);
          };
        })];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return r(this, void 0, void 0, function () {
      var e = this;
      return o(this, function (n) {
        var r;
        return t = (r = t).startsWith(Hc.URL_SCHEME) ? r.slice(Hc.URL_SCHEME.length) : r, [2, new Promise(function (n, r) {
          var o = e.indexedDB.open("tensorflowjs", 1);
          o.onupgradeneeded = function () {
            return qc(o);
          }, o.onsuccess = function () {
            var e,
                a = o.result,
                i = a.transaction(Vc, "readwrite"),
                s = i.objectStore(Vc),
                u = s.get(t);
            u.onsuccess = function () {
              if (null == u.result) return a.close(), r(new Error("Cannot find model with path '" + t + "' in IndexedDB."));

              var o = s.delete(t),
                  i = function () {
                var o = (e = a.transaction(zc, "readwrite")).objectStore(zc).delete(t);
                o.onsuccess = function () {
                  return n(u.result.modelArtifactsInfo);
                }, o.onerror = function (t) {
                  return r(u.error);
                };
              };

              o.onsuccess = i, o.onerror = function (t) {
                return i(), a.close(), r(u.error);
              };
            }, u.onerror = function (t) {
              return a.close(), r(u.error);
            }, i.oncomplete = function () {
              null == e ? a.close() : e.oncomplete = function () {
                return a.close();
              };
            };
          }, o.onerror = function (t) {
            return r(o.error);
          };
        })];
      });
    });
  }, t;
}();

if (a.getBool("IS_BROWSER")) try {
  Lc.registerManager(Hc.URL_SCHEME, new jc());
} catch (t) {}
var Kc = "/",
    Xc = "tensorflowjs_models",
    Yc = "info",
    Qc = "model_topology",
    Jc = "weight_specs",
    Zc = "weight_data",
    th = "model_metadata";

function eh(t) {
  return {
    info: [Xc, t, Yc].join(Kc),
    topology: [Xc, t, Qc].join(Kc),
    weightSpecs: [Xc, t, Jc].join(Kc),
    weightData: [Xc, t, Zc].join(Kc),
    modelMetadata: [Xc, t, th].join(Kc)
  };
}

function nh(t) {
  var e = t.split(Kc);
  if (e.length < 3) throw new Error("Invalid key format: " + t);
  return e.slice(1, e.length - 1).join(Kc);
}

var rh = function () {
  function t(t) {
    if (!a.getBool("IS_BROWSER") || void 0 === window.localStorage) throw new Error("The current environment does not support local storage.");
    if (this.LS = window.localStorage, null == t || !t) throw new Error("For local storage, modelPath must not be null, undefined or empty.");
    this.modelPath = t, this.keys = eh(this.modelPath);
  }

  return t.prototype.save = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r;
      return o(this, function (o) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        e = JSON.stringify(t.modelTopology), n = JSON.stringify(t.weightSpecs), r = Fc(t);

        try {
          return this.LS.setItem(this.keys.info, JSON.stringify(r)), this.LS.setItem(this.keys.topology, e), this.LS.setItem(this.keys.weightSpecs, n), this.LS.setItem(this.keys.weightData, (a = t.weightData, Dc ? Buffer.from(a).toString("base64") : btoa(String.fromCharCode.apply(null, new Uint8Array(a))))), this.LS.setItem(this.keys.modelMetadata, JSON.stringify({
            format: t.format,
            generatedBy: t.generatedBy,
            convertedBy: t.convertedBy
          })), [2, {
            modelArtifactsInfo: r
          }];
        } catch (t) {
          throw this.LS.removeItem(this.keys.info), this.LS.removeItem(this.keys.topology), this.LS.removeItem(this.keys.weightSpecs), this.LS.removeItem(this.keys.weightData), this.LS.removeItem(this.keys.modelMetadata), new Error("Failed to save model '" + this.modelPath + "' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=" + r.modelTopologyBytes + ", weightSpecsBytes=" + r.weightSpecsBytes + ", weightDataBytes=" + r.weightDataBytes + ".");
        }

        var a;
        return [2];
      });
    });
  }, t.prototype.load = function () {
    return r(this, void 0, void 0, function () {
      var t, e, n, r, a, i, s;
      return o(this, function (o) {
        if (null == (t = JSON.parse(this.LS.getItem(this.keys.info)))) throw new Error("In local storage, there is no model with name '" + this.modelPath + "'");
        if ("JSON" !== t.modelTopologyType) throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");
        if (e = {}, null == (n = JSON.parse(this.LS.getItem(this.keys.topology)))) throw new Error("In local storage, the topology of model '" + this.modelPath + "' is missing.");
        if (e.modelTopology = n, null == (r = JSON.parse(this.LS.getItem(this.keys.weightSpecs)))) throw new Error("In local storage, the weight specs of model '" + this.modelPath + "' are missing.");
        if (e.weightSpecs = r, null != (a = this.LS.getItem(this.keys.modelMetadata)) && (i = JSON.parse(a), e.format = i.format, e.generatedBy = i.generatedBy, e.convertedBy = i.convertedBy), null == (s = this.LS.getItem(this.keys.weightData))) throw new Error("In local storage, the binary weight values of model '" + this.modelPath + "' are missing.");
        return e.weightData = function (t) {
          if (Dc) {
            var e = Buffer.from(t, "base64");
            return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
          }

          for (var n = atob(t), r = new Uint8Array(n.length), o = 0; o < n.length; ++o) r.set([n.charCodeAt(o)], o);

          return r.buffer;
        }(s), [2, e];
      });
    });
  }, t.URL_SCHEME = "localstorage://", t;
}(),
    oh = function (t) {
  return a.getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(rh.URL_SCHEME) ? (e = t.slice(rh.URL_SCHEME.length), new rh(e)) : null;
  var e;
};

Bc.registerSaveRouter(oh), Bc.registerLoadRouter(oh);

var ah = function () {
  function t() {
    d(a.getBool("IS_BROWSER"), function () {
      return "Current environment is not a web browser";
    }), d(void 0 !== window.localStorage, function () {
      return "Current browser does not appear to support localStorage";
    }), this.LS = window.localStorage;
  }

  return t.prototype.listModels = function () {
    return r(this, void 0, void 0, function () {
      var t, e, n, r, a, i;
      return o(this, function (o) {
        for (t = {}, e = Xc + Kc, n = Kc + Yc, r = 0; r < this.LS.length; ++r) (a = this.LS.key(r)).startsWith(e) && a.endsWith(n) && (i = nh(a), t[i] = JSON.parse(this.LS.getItem(a)));

        return [2, t];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n;
      return o(this, function (r) {
        var o;
        if (t = (o = t).startsWith(rh.URL_SCHEME) ? o.slice(rh.URL_SCHEME.length) : o, e = eh(t), null == this.LS.getItem(e.info)) throw new Error("Cannot find model at path '" + t + "'");
        return n = JSON.parse(this.LS.getItem(e.info)), this.LS.removeItem(e.info), this.LS.removeItem(e.topology), this.LS.removeItem(e.weightSpecs), this.LS.removeItem(e.weightData), [2, n];
      });
    });
  }, t;
}();

if (a.getBool("IS_BROWSER")) try {
  Lc.registerManager(rh.URL_SCHEME, new ah());
} catch (t) {}
var ih = "model",
    sh = ".json",
    uh = ".weights.bin";

function lh(t) {
  return new Promise(function (t) {
    return setTimeout(t);
  }).then(t);
}

var ch = function () {
  function t(e) {
    if (!a.getBool("IS_BROWSER")) throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");
    e.startsWith(t.URL_SCHEME) && (e = e.slice(t.URL_SCHEME.length)), null != e && 0 !== e.length || (e = ih), this.modelTopologyFileName = e + sh, this.weightDataFileName = e + uh;
  }

  return t.prototype.save = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r, a, i, s;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (e = window.URL.createObjectURL(new Blob([t.weightData], {
              type: "application/octet-stream"
            })), !(t.modelTopology instanceof ArrayBuffer)) return [3, 1];
            throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");

          case 1:
            return n = [{
              paths: ["./" + this.weightDataFileName],
              weights: t.weightSpecs
            }], r = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              weightsManifest: n
            }, a = window.URL.createObjectURL(new Blob([JSON.stringify(r)], {
              type: "application/json"
            })), (i = null == this.jsonAnchor ? document.createElement("a") : this.jsonAnchor).download = this.modelTopologyFileName, i.href = a, [4, lh(function () {
              return i.dispatchEvent(new MouseEvent("click"));
            })];

          case 2:
            return o.sent(), null == t.weightData ? [3, 4] : ((s = null == this.weightDataAnchor ? document.createElement("a") : this.weightDataAnchor).download = this.weightDataFileName, s.href = e, [4, lh(function () {
              return s.dispatchEvent(new MouseEvent("click"));
            })]);

          case 3:
            o.sent(), o.label = 4;

          case 4:
            return [2, {
              modelArtifactsInfo: Fc(t)
            }];
        }
      });
    });
  }, t.URL_SCHEME = "downloads://", t;
}(),
    hh = function () {
  function t(t) {
    if (null == t || t.length < 1) throw new Error("When calling browserFiles, at least 1 file is required, but received " + t);
    this.files = t;
  }

  return t.prototype.load = function () {
    return r(this, void 0, void 0, function () {
      var t,
          e,
          n = this;
      return o(this, function (r) {
        return t = this.files[0], e = this.files.slice(1), [2, new Promise(function (r, o) {
          var a = new FileReader();
          a.onload = function (a) {
            var i = JSON.parse(a.target.result),
                s = i.modelTopology;

            if (null != s) {
              0 === e.length && r({
                modelTopology: s
              });
              var u = i.weightsManifest;

              if (null != u) {
                var l;

                try {
                  l = n.checkManifestAndWeightFiles(u, e);
                } catch (t) {
                  return void o(t);
                }

                var c = [],
                    h = [],
                    p = [];
                u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    h.push(t), p.push(null);
                  }), c.push.apply(c, t.weights);
                }), u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    var e = new FileReader();
                    e.onload = function (e) {
                      var n = e.target.result,
                          o = h.indexOf(t);
                      p[o] = n, -1 === p.indexOf(null) && r({
                        modelTopology: s,
                        weightSpecs: c,
                        weightData: Oc(p)
                      });
                    }, e.onerror = function (e) {
                      return o("Failed to weights data from file of path '" + t + "'.");
                    }, e.readAsArrayBuffer(l[t]);
                  });
                });
              } else o(new Error("weightManifest field is missing from file " + t.name));
            } else o(new Error("modelTopology field is missing from file " + t.name));
          }, a.onerror = function (e) {
            return o("Failed to read model topology and weights manifest JSON from file '" + t.name + "'. BrowserFiles supports loading Keras-style tf.Model artifacts only.");
          }, a.readAsText(t);
        })];
      });
    });
  }, t.prototype.checkManifestAndWeightFiles = function (t, e) {
    for (var n = [], r = e.map(function (t) {
      return Mc(t.name);
    }), o = {}, a = 0, i = t; a < i.length; a++) {
      i[a].paths.forEach(function (t) {
        var a = Mc(t);
        if (-1 !== n.indexOf(a)) throw new Error("Duplicate file basename found in weights manifest: '" + a + "'");
        if (n.push(a), -1 === r.indexOf(a)) throw new Error("Weight file with basename '" + a + "' is not provided.");
        o[t] = e[r.indexOf(a)];
      });
    }

    if (n.length !== e.length) throw new Error("Mismatch in the number of files in weights manifest (" + n.length + ") and the number of weight files provided (" + e.length + ").");
    return o;
  }, t;
}();

function ph(t, e, n, r) {
  !function (t) {
    d(null != t && Array.isArray(t) && t.length > 0, function () {
      return "promises must be a none empty array";
    });
  }(t), function (t, e) {
    d(t >= 0 && t <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got startFraction " + t;
    }), d(e >= 0 && e <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got endFraction " + e;
    }), d(e >= t, function () {
      return "startFraction must be no more than endFraction, but got startFraction " + t + " and endFraction " + e;
    });
  }(n = null == n ? 0 : n, r = null == r ? 1 : r);
  var o = 0;
  return Promise.all(t.map(function (a) {
    return a.then(function (a) {
      var i = n + ++o / t.length * (r - n);
      return e(i), a;
    }), a;
  }));
}

function fh(t, e) {
  return r(this, void 0, void 0, function () {
    var n, r, a, i, s, u, l, c, h;
    return o(this, function (o) {
      switch (o.label) {
        case 0:
          return null == e && (e = {}), n = null == e.fetchFunc ? Y : e.fetchFunc, r = t.map(function (t) {
            return n(t, e.requestInit);
          }), a = 0, i = .5, null != e.onProgress ? [3, 2] : [4, Promise.all(r)];

        case 1:
          return s = o.sent(), [3, 4];

        case 2:
          return [4, ph(r, e.onProgress, a, i)];

        case 3:
          s = o.sent(), o.label = 4;

        case 4:
          return u = s.map(function (t) {
            return t.arrayBuffer();
          }), l = .5, c = 1, null != e.onProgress ? [3, 6] : [4, Promise.all(u)];

        case 5:
          return h = o.sent(), [3, 8];

        case 6:
          return [4, ph(u, e.onProgress, l, c)];

        case 7:
          h = o.sent(), o.label = 8;

        case 8:
          return [2, h];
      }
    });
  });
}

function dh(t) {
  var e = this;
  return function (n, a, i) {
    return void 0 === a && (a = ""), r(e, void 0, void 0, function () {
      var e, r, s, u, l, c, h, p, f, d;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (e = n.map(function () {
              return !1;
            }), r = {}, s = null != i ? i.map(function () {
              return !1;
            }) : [], u = [], n.forEach(function (t, n) {
              var o = 0;
              t.weights.forEach(function (t) {
                var a = "quantization" in t ? t.quantization.dtype : t.dtype,
                    l = kc[a] * y(t.shape),
                    c = function () {
                  e[n] = !0, null == r[n] && (r[n] = []), r[n].push({
                    manifestEntry: t,
                    groupOffset: o,
                    sizeBytes: l
                  });
                };

                null != i ? i.forEach(function (e, n) {
                  e === t.name && (c(), s[n] = !0);
                }) : c(), u.push(t.name), o += l;
              });
            }), !s.every(function (t) {
              return t;
            })) throw l = i.filter(function (t, e) {
              return !s[e];
            }), new Error("Could not find weights in manifest with names: " + l.join(", ") + ". \nManifest JSON has weights with names: " + u.join(", ") + ".");
            return c = e.reduce(function (t, e, n) {
              return e && t.push(n), t;
            }, []), h = [], c.forEach(function (t) {
              n[t].paths.forEach(function (t) {
                var e = a + (a.endsWith("/") ? "" : "/") + t;
                h.push(e);
              });
            }), [4, t(h)];

          case 1:
            return p = o.sent(), f = {}, d = 0, c.forEach(function (t) {
              for (var e = n[t].paths.length, o = 0, a = 0; a < e; a++) o += p[d + a].byteLength;

              for (var i = new ArrayBuffer(o), s = new Uint8Array(i), u = 0, l = 0; l < e; l++) {
                var c = new Uint8Array(p[d + l]);
                s.set(c, u), u += c.byteLength;
              }

              r[t].forEach(function (t) {
                var e = Ac(i.slice(t.groupOffset, t.groupOffset + t.sizeBytes), [t.manifestEntry]);

                for (var n in e) f[n] = e[n];
              }), d += e;
            }), [2, f];
        }
      });
    });
  };
}

Bc.registerSaveRouter(function (t) {
  return a.getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(ch.URL_SCHEME) ? (e = t.slice(ch.URL_SCHEME.length), void 0 === e && (e = "model"), new ch(e)) : null;
  var e;
});

var vh = function () {
  function t(t, e) {
    if (this.DEFAULT_METHOD = "POST", null == e && (e = {}), this.weightPathPrefix = e.weightPathPrefix, this.onProgress = e.onProgress, null != e.fetchFunc ? (d("function" == typeof e.fetchFunc, function () {
      return "Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)";
    }), this.fetch = e.fetchFunc) : this.fetch = Y, d(null != t && t.length > 0, function () {
      return "URL path for http must not be null, undefined or empty.";
    }), Array.isArray(t) && d(2 === t.length, function () {
      return "URL paths for http must have a length of 2, (actual length is " + t.length + ").";
    }), this.path = t, null != e.requestInit && null != e.requestInit.body) throw new Error("requestInit is expected to have no pre-existing body, but has one.");
    this.requestInit = e.requestInit || {};
  }

  return t.prototype.save = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r, a;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");
            return (e = Object.assign({
              method: this.DEFAULT_METHOD
            }, this.requestInit)).body = new FormData(), n = [{
              paths: ["./model.weights.bin"],
              weights: t.weightSpecs
            }], r = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              weightsManifest: n
            }, e.body.append("model.json", new Blob([JSON.stringify(r)], {
              type: "application/json"
            }), "model.json"), null != t.weightData && e.body.append("model.weights.bin", new Blob([t.weightData], {
              type: "application/octet-stream"
            }), "model.weights.bin"), [4, this.fetch(this.path, e)];

          case 1:
            if ((a = o.sent()).ok) return [2, {
              modelArtifactsInfo: Fc(t),
              responses: [a]
            }];
            throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status " + a.status + ".");
        }
      });
    });
  }, t.prototype.load = function () {
    return r(this, void 0, void 0, function () {
      var t, e, n, r, a, i, s, u;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return [4, this.fetch(this.path, this.requestInit)];

          case 1:
            if (!(t = o.sent()).ok) throw new Error("Request to " + this.path + " failed with status code " + t.status + ". Please verify this URL points to the model JSON of the model to load.");
            o.label = 2;

          case 2:
            return o.trys.push([2, 4,, 5]), [4, t.json()];

          case 3:
            return e = o.sent(), [3, 5];

          case 4:
            throw o.sent(), n = "Failed to parse model JSON of response from " + this.path + ".", this.path.endsWith(".pb") ? n += " Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository." : n += " Please make sure the server is serving valid JSON for this request.", new Error(n);

          case 5:
            if (r = e.modelTopology, a = e.weightsManifest, null == r && null == a) throw new Error("The JSON from HTTP path " + this.path + " contains neither model topology or manifest for weights.");
            return null == a ? [3, 7] : [4, this.loadWeights(a)];

          case 6:
            u = o.sent(), i = u[0], s = u[1], o.label = 7;

          case 7:
            return [2, {
              modelTopology: r,
              weightSpecs: i,
              weightData: s
            }];
        }
      });
    });
  }, t.prototype.loadWeights = function (t) {
    return r(this, void 0, void 0, function () {
      var e, n, r, a, i, s, u, l, c, h, p;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            for (e = Array.isArray(this.path) ? this.path[1] : this.path, n = function (t) {
              var e = t.lastIndexOf("/"),
                  n = t.lastIndexOf("?"),
                  r = t.substring(0, e),
                  o = n > e ? t.substring(n) : "";
              return [r + "/", o];
            }(e), r = n[0], a = n[1], i = this.weightPathPrefix || r, s = [], u = 0, l = t; u < l.length; u++) c = l[u], s.push.apply(s, c.weights);

            return h = [], t.forEach(function (t) {
              t.paths.forEach(function (t) {
                h.push(i + t + a);
              });
            }), [4, fh(h, {
              requestInit: this.requestInit,
              fetchFunc: this.fetch,
              onProgress: this.onProgress
            })];

          case 1:
            return p = o.sent(), [2, [s, Oc(p)]];
        }
      });
    });
  }, t.URL_SCHEME_REGEX = /^https?:\/\//, t;
}();

function mh(t) {
  return null != t.match(vh.URL_SCHEME_REGEX);
}

var gh = function (t, e) {
  return (Array.isArray(t) ? t.every(function (t) {
    return mh(t);
  }) : mh(t)) ? yh(t, {
    onProgress: e
  }) : null;
};

function yh(t, e) {
  return new vh(t, e);
}

Bc.registerSaveRouter(gh), Bc.registerLoadRouter(gh);

var xh = function () {
  function t(t, e, n) {
    this.modelTopology = t, this.weightSpecs = e, this.weightData = n;
  }

  return t.prototype.load = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        return t = {}, null != this.modelTopology && (t = n({
          modelTopology: this.modelTopology
        }, t)), null != this.weightSpecs && this.weightSpecs.length > 0 && (t = n({
          weightSpecs: this.weightSpecs
        }, t)), null != this.weightData && this.weightData.byteLength > 0 && (t = n({
          weightData: this.weightData
        }, t)), [2, t];
      });
    });
  }, t;
}(),
    wh = function () {
  function t(t) {
    this.saveHandler = t;
  }

  return t.prototype.save = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        return [2, this.saveHandler(t)];
      });
    });
  }, t;
}();

var bh = Object.freeze({
  browserFiles: function (t) {
    return new hh(t);
  },
  browserHTTPRequest: function (t, e) {
    return yh(t, e);
  },
  concatenateArrayBuffers: Oc,
  decodeWeights: Ac,
  encodeWeights: function (t, e) {
    return r(this, void 0, void 0, function () {
      var n, r, a, i, s, u, l;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            for (n = [], r = [], a = Array.isArray(t) ? t.map(function (t) {
              return t.name;
            }) : Object.keys(t), i = 0; i < a.length; ++i) {
              if (s = a[i], "float32" !== (u = Array.isArray(t) ? t[i].tensor : t[s]).dtype && "int32" !== u.dtype && "bool" !== u.dtype) throw new Error("Unsupported dtype in weight '" + s + "': " + u.dtype);
              l = {
                name: s,
                shape: u.shape,
                dtype: u.dtype
              }, null != e && (l.group = e), n.push(l), r.push(u.data());
            }

            return [4, Promise.all(r)];

          case 1:
            return [2, {
              data: Tc(o.sent()),
              specs: n
            }];
        }
      });
    });
  },
  fromMemory: function (t, e, n) {
    return new xh(t, e, n);
  },
  getLoadHandlers: function (t, e) {
    return Bc.getLoadHandlers(t, e);
  },
  getModelArtifactsInfoForJSON: Fc,
  getSaveHandlers: function (t) {
    return Bc.getSaveHandlers(t);
  },
  http: yh,
  isHTTPScheme: mh,
  loadWeights: function (t, e, n, a) {
    return void 0 === e && (e = ""), r(this, void 0, void 0, function () {
      return o(this, function (r) {
        return [2, dh(function (t) {
          return fh(t, {
            requestInit: a
          });
        })(t, e, n)];
      });
    });
  },
  registerLoadRouter: function (t) {
    return Bc.registerLoadRouter(t);
  },
  registerSaveRouter: function (t) {
    return Bc.registerSaveRouter(t);
  },
  weightsLoaderFactory: dh,
  withSaveHandler: function (t) {
    return new wh(t);
  },
  copyModel: function (t, e) {
    return r(this, void 0, void 0, function () {
      return o(this, function (n) {
        return [2, Uc(t, e, !1)];
      });
    });
  },
  listModels: function () {
    return r(this, void 0, void 0, function () {
      var t, e, n, r, a, i, s;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            t = Lc.getSchemes(), e = {}, n = 0, r = t, o.label = 1;

          case 1:
            return n < r.length ? (a = r[n], [4, Lc.getManager(a).listModels()]) : [3, 4];

          case 2:
            for (s in i = o.sent()) e[a + Pc + s] = i[s];

            o.label = 3;

          case 3:
            return n++, [3, 1];

          case 4:
            return [2, e];
        }
      });
    });
  },
  moveModel: function (t, e) {
    return r(this, void 0, void 0, function () {
      return o(this, function (n) {
        return [2, Uc(t, e, !0)];
      });
    });
  },
  removeModel: function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        return e = Wc(t), [2, Lc.getManager(e.scheme).removeModel(e.path)];
      });
    });
  }
});
exports.io = bh;
var Ch = Tn({
  confusionMatrix_: function (t, e, n) {
    var r = bn(t, "labels", "confusionMatrix"),
        o = bn(e, "predictions", "confusionMatrix");
    d(null == n || n > 0 && Number.isInteger(n), function () {
      return "If provided, numClasses must be a positive integer, but got " + n;
    }), d(1 === r.rank, function () {
      return "Expected the rank of labels to be 1, but got " + r.rank;
    }), d(1 === o.rank, function () {
      return "Expected the rank of predictions to be 1, but got " + o.rank;
    }), d(r.shape[0] === o.shape[0], function () {
      return "Mismatch in the number of examples: " + r.shape[0] + " vs. " + o.shape[0] + ". Labels and predictions should have the same number of elements.";
    }), d(n > 0 && Number.isInteger(n), function () {
      return "numClasses is required to be a positive integer, but got " + n;
    });
    var a = Qr(r.asType("int32"), n),
        i = Qr(o.asType("int32"), n);
    return a.transpose().matMul(i).asType("int32");
  }
}),
    Eh = Object.freeze({
  confusionMatrix: Ch
});
exports.math = Eh;

var Rh = Tn({
  fromPixels_: function (t, e) {
    if (void 0 === e && (e = 3), e > 4) throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");
    return At.fromPixels(t, e);
  }
}),
    Ih = Object.freeze({
  toPixels: function (t, e) {
    return r(this, void 0, void 0, function () {
      var n, r, a, i, s, u, l, c, h, p, f, d, v, m, g, y, x, w, b, C, E, R, I;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (n = bn(t, "img", "toPixels"), t instanceof ht || (n = n.toInt()), 2 !== n.rank && 3 !== n.rank) throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + n.rank + ".");
            if (r = n.shape.slice(0, 2), a = r[0], i = r[1], (s = 2 === n.rank ? 1 : n.shape[2]) > 4 || 2 === s) throw new Error("toPixels only supports depth of size 1, 3 or 4 but got " + s);
            return [4, n.data()];

          case 1:
            return u = o.sent(), l = n.min(), c = n.max(), [4, Promise.all([l.data(), c.data()])];

          case 2:
            if (h = o.sent(), p = h[0], f = h[1], d = p[0], v = f[0], l.dispose(), c.dispose(), "float32" === n.dtype) {
              if (d < 0 || v > 1) throw new Error("Tensor values for a float32 Tensor must be in the range [0 - 1] but got range [" + d + " - " + v + "].");
            } else {
              if ("int32" !== n.dtype) throw new Error("Unsupported type for toPixels: " + n.dtype + ". Please use float32 or int32 tensors.");
              if (d < 0 || v > 255) throw new Error("Tensor values for a int32 Tensor must be in the range [0 - 255] but got range [" + d + " - " + v + "].");
            }

            for (m = "float32" === n.dtype ? 255 : 1, g = new Uint8ClampedArray(i * a * 4), y = 0; y < a * i; ++y) x = void 0, w = void 0, b = void 0, C = void 0, 1 === s ? (x = u[y] * m, w = u[y] * m, b = u[y] * m, C = 255) : 3 === s ? (x = u[3 * y] * m, w = u[3 * y + 1] * m, b = u[3 * y + 2] * m, C = 255) : 4 === s && (x = u[4 * y] * m, w = u[4 * y + 1] * m, b = u[4 * y + 2] * m, C = u[4 * y + 3] * m), g[0 + (E = 4 * y)] = Math.round(x), g[E + 1] = Math.round(w), g[E + 2] = Math.round(b), g[E + 3] = Math.round(C);

            return null != e && (e.width = i, e.height = a, R = e.getContext("2d"), I = new ImageData(g, i, a), R.putImageData(I, 0, 0)), n !== t && n.dispose(), [2, g];
        }
      });
    });
  },
  fromPixels: Rh
}),
    Sh = function () {
  function t() {}

  return t.prototype.getClassName = function () {
    return this.constructor.className;
  }, t.fromConfig = function (t, e) {
    return new t(e);
  }, t;
}(),
    Nh = function () {
  function t() {
    this.classNameMap = {};
  }

  return t.getMap = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.register = function (e) {
    t.getMap().classNameMap[e.className] = [e, e.fromConfig];
  }, t;
}();

exports.browser = Ih;

function kh(t) {
  d(null != t.className, function () {
    return "Class being registered does not have the static className property defined.";
  }), d("string" == typeof t.className, function () {
    return "className is required to be a string, but got type " + typeof t.className;
  }), d(t.className.length > 0, function () {
    return "Class being registered has an empty-string as its className, which is disallowed.";
  }), Nh.register(t);
}

var Ah = Object.freeze({
  Serializable: Sh,
  SerializationMap: Nh,
  registerClass: kh
}),
    Th = .001,
    Dh = .1;
exports.serialization = Ah;

function _h() {
  return 32 === At.backend.floatPrecision() ? Th : Dh;
}

function Oh(t, e, n) {
  var r = !0;

  if ((M(t) || M(e)) && (r = !1), M(t) && M(e) && (r = !0), r) {
    var o = t.constructor.name,
        a = e.constructor.name;
    if (o !== a) throw new Error("Arrays are of different type. Actual: " + o + ". Expected: " + a);
  }

  if (Array.isArray(t) && Array.isArray(e)) {
    var i = xn(t),
        s = xn(e);
    if (!x(i, s)) throw new Error("Arrays have different shapes. Actual: [" + i + "]. Expected: [" + s + "]");
  }

  var u = M(t) ? t : g(t),
      l = M(e) ? e : g(e);
  if (u.length !== l.length) throw new Error("Arrays have different lengths actual: " + u.length + " vs expected: " + l.length + ".\nActual:   " + u + ".\nExpected: " + l + ".");

  for (var c = 0; c < l.length; ++c) {
    var h = u[c],
        p = l[c];
    if (!n(h, p)) throw new Error("Arrays differ: actual[" + c + "] = " + h + ", expected[" + c + "] = " + p + ".\nActual:   " + u + ".\nExpected: " + l + ".");
  }
}

function Mh(t, e, n) {
  return !isFinite(t) && !isFinite(e) || !(isNaN(t) || isNaN(e) || Math.abs(t - e) > n);
}

var Fh = Object.freeze({
  TEST_EPSILON_FLOAT16: Dh,
  expectArraysClose: function (t, e, n) {
    return null == n && (n = _h()), Oh(t, e, function (t, e) {
      return Mh(t, e, n);
    });
  },
  testEpsilon: _h,
  expectPromiseToFail: function (t, e) {
    t().then(function () {
      return e.fail();
    }, function () {
      return e();
    });
  },
  expectArraysEqual: function (t, e) {
    var n = "string" == typeof e || "number" == typeof e || "boolean" == typeof e ? [e] : e;
    return P(t) || P(t[0]) || P(e) || P(e[0]) ? Oh(t, n, function (t, e) {
      return t == e;
    }) : Oh(t, e, function (t, e) {
      return Mh(t, e, 0);
    });
  },
  expectNumbersClose: function (t, e, n) {
    if (null == n && (n = _h()), !Mh(t, e, n)) throw new Error("Numbers differ: actual === " + t + ", expected === " + e);
  },
  expectValuesInRange: function (t, e, n) {
    for (var r = 0; r < t.length; r++) if (t[r] < e || t[r] > n) throw new Error("Value out of range:" + t[r] + " low: " + e + ", high: " + n);
  },
  expectArrayBuffersEqual: function (t, e) {
    expect(new Float32Array(t)).toEqual(new Float32Array(e));
  }
}),
    Bh = "1.2.1",
    Ph = Object.freeze({
  gpgpu_util: Ja,
  webgl_util: Ie,
  MathBackendWebGL: ts,
  setWebGLContext: Ot,
  GPGPUContext: Za
}),
    Lh = function (t) {
  function n() {
    return null !== t && t.apply(this, arguments) || this;
  }

  return e(n, t), n.prototype.minimize = function (t, e, n) {
    void 0 === e && (e = !1);
    var r = this.computeGradients(t, n),
        o = r.value,
        a = r.grads;

    if (null != n) {
      var i = n.map(function (t) {
        return {
          name: t.name,
          tensor: a[t.name]
        };
      });
      this.applyGradients(i);
    } else this.applyGradients(a);

    return Me(a), e ? o : (o.dispose(), null);
  }, Object.defineProperty(n.prototype, "iterations", {
    get: function () {
      return null == this.iterations_ && (this.iterations_ = 0), this.iterations_;
    },
    enumerable: !0,
    configurable: !0
  }), n.prototype.incrementIterations = function () {
    this.iterations_ = this.iterations + 1;
  }, n.prototype.computeGradients = function (t, e) {
    return Nn(t, e);
  }, n.prototype.dispose = function () {
    null != this.iterations_ && Me(this.iterations_);
  }, n.prototype.saveIterations = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        return null == this.iterations_ && (this.iterations_ = 0), [2, {
          name: "iter",
          tensor: Pn(this.iterations_, "int32")
        }];
      });
    });
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        throw new Error("getWeights() is not implemented for this optimizer yet.");
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        throw new Error("setWeights() is not implemented for this optimizer class " + this.getClassName());
      });
    });
  }, n.prototype.extractIterations = function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        switch (n.label) {
          case 0:
            return e = this, [4, t[0].tensor.data()];

          case 1:
            return e.iterations_ = n.sent()[0], [2, t.slice(1)];
        }
      });
    });
  }, n;
}(Sh);

exports.Optimizer = Lh;
exports.webgl = Ph;
exports.version_core = Bh;
exports.test_util = Fh;
Object.defineProperty(Lh, Symbol.hasInstance, {
  value: function (t) {
    return null != t.minimize && null != t.computeGradients && null != t.applyGradients;
  }
});

var Wh = function (t) {
  function n(e, n, r) {
    void 0 === r && (r = null);
    var o = t.call(this) || this;
    return o.learningRate = e, o.rho = n, o.epsilon = r, o.accumulatedGrads = [], o.accumulatedUpdates = [], null == r && (o.epsilon = At.backend.epsilon()), o;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = At.registeredVariables[n];
      null == e.accumulatedGrads[r] && (e.accumulatedGrads[r] = {
        originalName: n + "/accum_grad",
        variable: Oe(function () {
          return Yn(o).variable(!1);
        })
      }), null == e.accumulatedUpdates[r] && (e.accumulatedUpdates[r] = {
        originalName: n + "/accum_var",
        variable: Oe(function () {
          return Yn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable,
            s = e.accumulatedUpdates[r].variable;
        Oe(function () {
          var t = i.mul(e.rho).add(a.square().mul(1 - e.rho)),
              n = s.add(e.epsilon).sqrt().div(i.add(e.epsilon).sqrt()).mul(a),
              r = s.mul(e.rho).add(n.square().mul(1 - e.rho));
          i.assign(t), s.assign(r);
          var u = n.mul(-e.learningRate).add(o);
          o.assign(u);
        });
      }
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    null != this.accumulatedUpdates && (Me(this.accumulatedGrads.map(function (t) {
      return t.variable;
    })), Me(this.accumulatedUpdates.map(function (t) {
      return t.variable;
    })));
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedGrads.concat(this.accumulatedUpdates), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = t.length / 2, !1, this.accumulatedGrads = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedUpdates = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      rho: this.rho,
      epsilon: this.epsilon
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.rho, e.epsilon);
  }, n.className = "AdadeltaOptimizer", n;
}(Lh);

exports.AdadeltaOptimizer = Wh;
kh(Wh);

var Uh = function (t) {
  function n(e, n) {
    void 0 === n && (n = .1);
    var r = t.call(this) || this;
    return r.learningRate = e, r.initialAccumulatorValue = n, r.accumulatedGrads = [], r;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = At.registeredVariables[n];

      if (null == e.accumulatedGrads[r]) {
        e.accumulatedGrads[r] = {
          originalName: n + "/accumulator",
          variable: Oe(function () {
            return $n(o.shape, e.initialAccumulatorValue).variable(!1);
          })
        };
      }

      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable;
        Oe(function () {
          var t = i.add(a.square());
          i.assign(t);
          var n = a.div(t.add(At.backend.epsilon()).sqrt()).mul(-e.learningRate).add(o);
          o.assign(n);
        });
      }
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    null != this.accumulatedGrads && Me(this.accumulatedGrads.map(function (t) {
      return t.variable;
    }));
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulatedGrads.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulatedGrads = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      initialAccumulatorValue: this.initialAccumulatorValue
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.initialAccumulatorValue);
  }, n.className = "Adagrad", n;
}(Lh);

exports.AdagradOptimizer = Uh;
kh(Uh);

var zh = function (t) {
  function n(e, n, r, o) {
    void 0 === o && (o = null);
    var a = t.call(this) || this;
    return a.learningRate = e, a.beta1 = n, a.beta2 = r, a.epsilon = o, a.accumulatedFirstMoment = [], a.accumulatedSecondMoment = [], Oe(function () {
      a.accBeta1 = Pn(n).variable(), a.accBeta2 = Pn(r).variable();
    }), null == o && (a.epsilon = At.backend.epsilon()), a;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Oe(function () {
      var r = fl(1, e.accBeta1),
          o = fl(1, e.accBeta2);
      n.forEach(function (n, a) {
        var i = At.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Oe(function () {
            return Yn(i).variable(!1);
          })
        }), null == e.accumulatedSecondMoment[a] && (e.accumulatedSecondMoment[a] = {
          originalName: n + "/v",
          variable: Oe(function () {
            return Yn(i).variable(!1);
          })
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              l = e.accumulatedSecondMoment[a].variable,
              c = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = l.mul(e.beta2).add(s.square().mul(1 - e.beta2)),
              p = c.div(r),
              f = h.div(o);
          u.assign(c), l.assign(h);
          var d = p.div(f.sqrt().add(e.epsilon)).mul(-e.learningRate).add(i);
          i.assign(d);
        }
      }), e.accBeta1.assign(e.accBeta1.mul(e.beta1)), e.accBeta2.assign(e.accBeta2.mul(e.beta2));
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    this.accBeta1.dispose(), this.accBeta2.dispose(), null != this.accumulatedFirstMoment && Me(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedSecondMoment && Me(this.accumulatedSecondMoment.map(function (t) {
      return t.variable;
    }));
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedFirstMoment.concat(this.accumulatedSecondMoment), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      var e,
          n = this;
      return o(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = r.sent(), Oe(function () {
              n.accBeta1.assign(ll(n.beta1, n.iterations_ + 1)), n.accBeta2.assign(ll(n.beta2, n.iterations_ + 1));
            }), e = t.length / 2, !1, this.accumulatedFirstMoment = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedSecondMoment = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon);
  }, n.className = "Adam", n;
}(Lh);

exports.AdamOptimizer = zh;
kh(zh);

var Vh = function (t) {
  function n(e, n, r, o, a) {
    void 0 === o && (o = null), void 0 === a && (a = 0);
    var i = t.call(this) || this;
    return i.learningRate = e, i.beta1 = n, i.beta2 = r, i.epsilon = o, i.decay = a, i.accumulatedFirstMoment = [], i.accumulatedWeightedInfNorm = [], Oe(function () {
      i.iteration = Pn(0).variable(), i.accBeta1 = Pn(n).variable();
    }), null == o && (i.epsilon = At.backend.epsilon()), i;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Oe(function () {
      var r = fl(1, e.accBeta1),
          o = Ju(-e.learningRate, e.iteration.mul(e.decay).add(1));
      n.forEach(function (n, a) {
        var i = At.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Yn(i).variable(!1)
        }), null == e.accumulatedWeightedInfNorm[a] && (e.accumulatedWeightedInfNorm[a] = {
          originalName: n + "/v",
          variable: Yn(i).variable(!1)
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              l = e.accumulatedWeightedInfNorm[a].variable,
              c = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = l.mul(e.beta2),
              p = s.abs(),
              f = h.maximum(p);
          u.assign(c), l.assign(f);
          var d = o.div(r).mul(c.div(f.add(e.epsilon))).add(i);
          i.assign(d);
        }
      }), e.iteration.assign(e.iteration.add(1)), e.accBeta1.assign(e.accBeta1.mul(e.beta1));
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    this.accBeta1.dispose(), this.iteration.dispose(), null != this.accumulatedFirstMoment && Me(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedWeightedInfNorm && Me(this.accumulatedWeightedInfNorm.map(function (t) {
      return t.variable;
    }));
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        throw new Error("getWeights() is not implemented for Adamax yet.");
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        throw new Error("setWeights() is not implemented for Adamax yet.");
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon,
      decay: this.decay
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon, e.decay);
  }, n.className = "Adamax", n;
}(Lh);

exports.AdamaxOptimizer = Vh;
kh(Vh);

var Gh = function (t) {
  function n(e) {
    var n = t.call(this) || this;
    return n.learningRate = e, n.setLearningRate(e), n;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != o) {
        var a = At.registeredVariables[n];
        Oe(function () {
          var t = e.c.mul(o).add(a);
          a.assign(t);
        });
      }
    }), this.incrementIterations();
  }, n.prototype.setLearningRate = function (t) {
    this.learningRate = t, null != this.c && this.c.dispose(), this.c = Fe(Pn(-t));
  }, n.prototype.dispose = function () {
    this.c.dispose();
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()]];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            if (0 !== (t = e.sent()).length) throw new Error("SGD optimizer does not have settable weights.");
            return [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate);
  }, n.className = "SGD", n;
}(Lh);

exports.SGDOptimizer = Gh;
kh(Gh);

var qh = function (t) {
  function n(e, n, r) {
    void 0 === r && (r = !1);
    var o = t.call(this, e) || this;
    return o.learningRate = e, o.momentum = n, o.useNesterov = r, o.accumulations = [], o.m = Pn(o.momentum), o;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = At.registeredVariables[n];

      if (null == e.accumulations[r]) {
        e.accumulations[r] = {
          originalName: n + "/momentum",
          variable: Oe(function () {
            return Yn(o).variable(!1);
          })
        };
      }

      var a = e.accumulations[r].variable,
          i = Array.isArray(t) ? t[r].tensor : t[n];
      null != i && Oe(function () {
        var t,
            n = e.m.mul(a).add(i);
        t = e.useNesterov ? e.c.mul(i.add(n.mul(e.m))).add(o) : e.c.mul(n).add(o), a.assign(n), o.assign(t);
      });
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    this.m.dispose(), null != this.accumulations && Me(this.accumulations.map(function (t) {
      return t.variable;
    }));
  }, n.prototype.setMomentum = function (t) {
    this.momentum = t;
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      return o(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulations.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulations = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      momentum: this.momentum,
      useNesterov: this.useNesterov
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.momentum, e.useNesterov);
  }, n.className = "MomentumOptimizer", n;
}(Gh);

exports.MomentumOptimizer = qh;
kh(qh);

var Hh = function (t) {
  function n(e, n, r, o, a) {
    void 0 === n && (n = .9), void 0 === r && (r = 0), void 0 === o && (o = null), void 0 === a && (a = !1);
    var i = t.call(this) || this;
    return i.learningRate = e, i.decay = n, i.momentum = r, i.epsilon = o, i.accumulatedMeanSquares = [], i.accumulatedMoments = [], i.accumulatedMeanGrads = [], i.centered = a, null == o && (i.epsilon = At.backend.epsilon()), i;
  }

  return e(n, t), n.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = At.registeredVariables[n];
      null == e.accumulatedMeanSquares[r] && (e.accumulatedMeanSquares[r] = {
        originalName: n + "/rms",
        variable: Oe(function () {
          return Yn(o).variable(!1);
        })
      }), null == e.accumulatedMoments[r] && (e.accumulatedMoments[r] = {
        originalName: n + "/momentum",
        variable: Oe(function () {
          return Yn(o).variable(!1);
        })
      }), null == e.accumulatedMeanGrads[r] && e.centered && (e.accumulatedMeanGrads[r] = {
        originalName: n + "/mg",
        variable: Oe(function () {
          return Yn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedMeanSquares[r].variable,
            s = e.accumulatedMoments[r].variable;
        Oe(function () {
          var t = i.mul(e.decay).add(a.square().mul(1 - e.decay));

          if (e.centered) {
            var n = e.accumulatedMeanGrads[r].variable,
                u = n.mul(e.decay).add(a.mul(1 - e.decay)),
                l = s.mul(e.momentum).add(a.mul(e.learningRate).div(t.sub(u.square().add(e.epsilon)).sqrt()));
            i.assign(t), n.assign(u), s.assign(l);
            var c = o.sub(l);
            o.assign(c);
          } else {
            var h = i.mul(e.decay).add(a.square().mul(1 - e.decay));
            l = s.mul(e.momentum).add(a.mul(e.learningRate).div(h.add(e.epsilon).sqrt()));
            i.assign(h), s.assign(l);
            c = o.sub(l);
            o.assign(c);
          }
        });
      }
    }), this.incrementIterations();
  }, n.prototype.dispose = function () {
    null != this.accumulatedMeanSquares && Me(this.accumulatedMeanSquares.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMeanGrads && this.centered && Me(this.accumulatedMeanGrads.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMoments && Me(this.accumulatedMoments.map(function (t) {
      return t.variable;
    }));
  }, n.prototype.getWeights = function () {
    return r(this, void 0, void 0, function () {
      var t;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedMeanSquares.concat(this.accumulatedMoments), this.centered && t.push.apply(t, this.accumulatedMeanGrads), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, n.prototype.setWeights = function (t) {
    return r(this, void 0, void 0, function () {
      var e;
      return o(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = this.centered ? t.length / 3 : t.length / 2, !1, this.accumulatedMeanSquares = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedMoments = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.centered && (this.accumulatedMeanGrads = t.slice(2 * e, 3 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            })), [2];
        }
      });
    });
  }, n.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      decay: this.decay,
      momentum: this.momentum,
      epsilon: this.epsilon,
      centered: this.centered
    };
  }, n.fromConfig = function (t, e) {
    return new t(e.learningRate, e.decay, e.momentum, e.epsilon, e.centered);
  }, n.className = "RMSProp", n;
}(Lh);

exports.RMSPropOptimizer = Hh;
kh(Hh);

var $h = function () {
  function t() {}

  return t.sgd = function (t) {
    return new Gh(t);
  }, t.momentum = function (t, e, n) {
    return void 0 === n && (n = !1), new qh(t, e, n);
  }, t.rmsprop = function (t, e, n, r, o) {
    return void 0 === e && (e = .9), void 0 === n && (n = 0), void 0 === r && (r = null), void 0 === o && (o = !1), new Hh(t, e, n, r, o);
  }, t.adam = function (t, e, n, r) {
    return void 0 === t && (t = .001), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), new zh(t, e, n, r);
  }, t.adadelta = function (t, e, n) {
    return void 0 === t && (t = .001), void 0 === e && (e = .95), void 0 === n && (n = null), new Wh(t, e, n);
  }, t.adamax = function (t, e, n, r, o) {
    return void 0 === t && (t = .002), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), void 0 === o && (o = 0), new Vh(t, e, n, r, o);
  }, t.adagrad = function (t, e) {
    return void 0 === e && (e = .1), new Uh(t, e);
  }, t;
}(),
    jh = {
  sgd: $h.sgd,
  momentum: $h.momentum,
  adadelta: $h.adadelta,
  adagrad: $h.adagrad,
  rmsprop: $h.rmsprop,
  adamax: $h.adamax,
  adam: $h.adam
},
    Kh = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : "undefined" != typeof setImmediate ? setImmediate : function (t) {
  return t();
};

exports.train = jh;

function Xh() {
  return new Promise(function (t) {
    return Kh(function () {
      return t();
    });
  });
}

lt = Cc;
},{"crypto":"node_modules/parcel-bundler/src/builtins/_empty.js","node-fetch":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGraphModel = loadGraphModel;
exports.deregisterOp = deregisterOp;
exports.registerOp = registerOp;
exports.version_converter = exports.GraphModel = void 0;

var _tfjsCore = require("@tensorflow/tfjs-core");

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DataType,
    SaverDef,
    __assign = function () {
  return (__assign = Object.assign || function (e) {
    for (var t, a = 1, r = arguments.length; a < r; a++) for (var n in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);

    return e;
  }).apply(this, arguments);
};

function __awaiter(e, t, a, r) {
  return new (a || (a = Promise))(function (n, s) {
    function o(e) {
      try {
        i(r.next(e));
      } catch (e) {
        s(e);
      }
    }

    function p(e) {
      try {
        i(r.throw(e));
      } catch (e) {
        s(e);
      }
    }

    function i(e) {
      e.done ? n(e.value) : new a(function (t) {
        t(e.value);
      }).then(o, p);
    }

    i((r = r.apply(e, t || [])).next());
  });
}

function __generator(e, t) {
  var a,
      r,
      n,
      s,
      o = {
    label: 0,
    sent: function () {
      if (1 & n[0]) throw n[1];
      return n[1];
    },
    trys: [],
    ops: []
  };
  return s = {
    next: p(0),
    throw: p(1),
    return: p(2)
  }, "function" == typeof Symbol && (s[Symbol.iterator] = function () {
    return this;
  }), s;

  function p(s) {
    return function (p) {
      return function (s) {
        if (a) throw new TypeError("Generator is already executing.");

        for (; o;) try {
          if (a = 1, r && (n = 2 & s[0] ? r.return : s[0] ? r.throw || ((n = r.return) && n.call(r), 0) : r.next) && !(n = n.call(r, s[1])).done) return n;

          switch (r = 0, n && (s = [2 & s[0], n.value]), s[0]) {
            case 0:
            case 1:
              n = s;
              break;

            case 4:
              return o.label++, {
                value: s[1],
                done: !1
              };

            case 5:
              o.label++, r = s[1], s = [0];
              continue;

            case 7:
              s = o.ops.pop(), o.trys.pop();
              continue;

            default:
              if (!(n = (n = o.trys).length > 0 && n[n.length - 1]) && (6 === s[0] || 2 === s[0])) {
                o = 0;
                continue;
              }

              if (3 === s[0] && (!n || s[1] > n[0] && s[1] < n[3])) {
                o.label = s[1];
                break;
              }

              if (6 === s[0] && o.label < n[1]) {
                o.label = n[1], n = s;
                break;
              }

              if (n && o.label < n[2]) {
                o.label = n[2], o.ops.push(s);
                break;
              }

              n[2] && o.ops.pop(), o.trys.pop();
              continue;
          }

          s = t.call(e, o);
        } catch (e) {
          s = [6, e], r = 0;
        } finally {
          a = n = 0;
        }

        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([s, p]);
    };
  }
}

!function (e) {
  e[e.DT_INVALID = 0] = "DT_INVALID", e[e.DT_FLOAT = 1] = "DT_FLOAT", e[e.DT_DOUBLE = 2] = "DT_DOUBLE", e[e.DT_INT32 = 3] = "DT_INT32", e[e.DT_UINT8 = 4] = "DT_UINT8", e[e.DT_INT16 = 5] = "DT_INT16", e[e.DT_INT8 = 6] = "DT_INT8", e[e.DT_STRING = 7] = "DT_STRING", e[e.DT_COMPLEX64 = 8] = "DT_COMPLEX64", e[e.DT_INT64 = 9] = "DT_INT64", e[e.DT_BOOL = 10] = "DT_BOOL", e[e.DT_QINT8 = 11] = "DT_QINT8", e[e.DT_QUINT8 = 12] = "DT_QUINT8", e[e.DT_QINT32 = 13] = "DT_QINT32", e[e.DT_BFLOAT16 = 14] = "DT_BFLOAT16", e[e.DT_FLOAT_REF = 101] = "DT_FLOAT_REF", e[e.DT_DOUBLE_REF = 102] = "DT_DOUBLE_REF", e[e.DT_INT32_REF = 103] = "DT_INT32_REF", e[e.DT_UINT8_REF = 104] = "DT_UINT8_REF", e[e.DT_INT16_REF = 105] = "DT_INT16_REF", e[e.DT_INT8_REF = 106] = "DT_INT8_REF", e[e.DT_STRING_REF = 107] = "DT_STRING_REF", e[e.DT_COMPLEX64_REF = 108] = "DT_COMPLEX64_REF", e[e.DT_INT64_REF = 109] = "DT_INT64_REF", e[e.DT_BOOL_REF = 110] = "DT_BOOL_REF", e[e.DT_QINT8_REF = 111] = "DT_QINT8_REF", e[e.DT_QUINT8_REF = 112] = "DT_QUINT8_REF", e[e.DT_QINT32_REF = 113] = "DT_QINT32_REF", e[e.DT_BFLOAT16_REF = 114] = "DT_BFLOAT16_REF";
}(DataType || (DataType = {})), function (e) {
  !function (e) {
    e[e.LEGACY = 0] = "LEGACY", e[e.V1 = 1] = "V1", e[e.V2 = 2] = "V2";
  }(e.CheckpointFormatVersion || (e.CheckpointFormatVersion = {}));
}(SaverDef || (SaverDef = {}));
var CUSTOM_OPS = {};

function registerOp(e, t) {
  var a = {
    tfOpName: e,
    category: "custom",
    inputs: [],
    attrs: [],
    customExecutor: t
  };
  CUSTOM_OPS[e] = a;
}

function getRegisteredOp(e) {
  return CUSTOM_OPS[e];
}

function deregisterOp(e) {
  delete CUSTOM_OPS[e];
}

function getParamValue(e, t, a, r) {
  var n = t.inputParams[e];

  if (n && void 0 !== n.inputIndexStart) {
    var s = n.inputIndexStart,
        o = 0 === n.inputIndexEnd ? void 0 : void 0 === n.inputIndexEnd ? s + 1 : n.inputIndexEnd;
    if ("tensor" === n.type) return getTensor(t.inputNames[n.inputIndexStart], a, r);
    if ("tensors" === n.type) return t.inputNames.slice(s, o).map(function (e) {
      return getTensor(e, a, r);
    });
    var p = Array.prototype.slice.call(getTensor(t.inputNames.slice(s)[0], a, r).dataSync());
    return "number" === n.type ? p[0] : p;
  }

  var i = t.attrParams[e];
  return i && i.value;
}

function getTensor(e, t, a) {
  var r = parseNodeName(e),
      n = r[0],
      s = r[1],
      o = a.currentContextIds.find(function (e) {
    return !!t[getNodeNameWithContextId(n, e)];
  });
  return void 0 !== o ? t[getNodeNameWithContextId(n, o)][s] : void 0;
}

function getTensorsForCurrentContenxt(e, t, a) {
  return t[getNodeNameWithContextId(e, a.currentContextId)];
}

function getNodeNameAndIndex(e, t) {
  var a = parseNodeName(e),
      r = a[0],
      n = a[1];
  return [getNodeNameWithContextId(r, t && t.currentContextId), n];
}

function getNodeNameWithContextId(e, t) {
  return t ? e + "-" + t : e;
}

function parseNodeName(e) {
  var t = e.lastIndexOf(":");
  return -1 === t ? [e, 0] : [e.substring(0, t), Number(e.substring(t + 1))];
}

function split$1(e, t) {
  for (var a = [], r = 0; r < e.length; r += t) a.push(e.slice(r, r + t));

  return a;
}

var json = [{
  tfOpName: "Add",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AddN",
  category: "arithmetic",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "BiasAdd",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sub",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "RealDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Div",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mul",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Maximum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Minimum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Pow",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "SquaredDifference",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorMod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    arithmetic = Object.freeze({
  json: json
}),
    json$1 = [{
  tfOpName: "Abs",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan2",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ceil",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ClipByValue",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "clip_value_min",
    name: "clipValueMin",
    type: "number"
  }, {
    tfName: "clip_value_max",
    name: "clipValueMax",
    type: "number"
  }]
}, {
  tfOpName: "Cos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Cosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Elu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Exp",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Floor",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Neg",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu6",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "clipValueMin",
    name: "clipValueMin",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "clipValueMax",
    name: "clipValueMax",
    type: "number",
    defaultValue: 6
  }]
}, {
  tfOpName: "Selu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sigmoid",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Rsqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Square",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sign",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Round",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Expm1",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log1p",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Reciprocal",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Softplus",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Erf",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Prod",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axes",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LeakyRelu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: .2
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    basicMath = Object.freeze({
  json: json$1
}),
    json$2 = [{
  tfOpName: "LoopCond",
  category: "control",
  inputs: [{
    start: 0,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Switch",
  category: "control",
  inputs: [{
    start: 0,
    name: "data",
    type: "tensor"
  }, {
    start: 1,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Merge",
  category: "control",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "Enter",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "frame_name",
    name: "frameName",
    type: "string"
  }, {
    tfName: "is_constant",
    name: "isConstant",
    type: "bool"
  }]
}, {
  tfOpName: "Exit",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NextIteration",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "size",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }, {
    tfName: "dynamic_size",
    name: "dynamicSize",
    type: "bool"
  }, {
    tfName: "clear_after_read",
    name: "clearAfterRead",
    type: "bool"
  }, {
    tfName: "identical_element_shapes",
    name: "identicalElementShapes",
    type: "bool"
  }, {
    tfName: "tensor_array_name",
    name: "name",
    type: "string"
  }]
}, {
  tfOpName: "TensorArrayWriteV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayReadV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayGatherV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }]
}, {
  tfOpName: "TensorArrayScatterV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArrayConcatV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape_except0",
    name: "elementShapeExcept0",
    type: "shape",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArraySplitV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "tensor",
    type: "tensor"
  }, {
    start: 2,
    name: "lengths",
    type: "number[]"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArraySizeV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }]
}, {
  tfOpName: "TensorArrayCloseV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }]
}],
    control = Object.freeze({
  json: json$2
}),
    json$3 = [{
  tfOpName: "AvgPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Conv1D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "stride",
    name: "stride",
    type: "number"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NWC"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "dilation",
    name: "dilation",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "Conv2D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "useCudnnOnGpu",
    name: "useCudnnOnGpu",
    type: "bool"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "Conv2DBackpropInput",
  category: "convolution",
  inputs: [{
    start: 2,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 0,
    name: "outputShape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "DepthwiseConv2d",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthwiseConv2dNative",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}],
    convolution = Object.freeze({
  json: json$3
}),
    json$4 = [{
  tfOpName: "Fill",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }, {
    start: 1,
    name: "value",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "LinSpace",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "num",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "OneHot",
  category: "creation",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "depth",
    type: "number"
  }, {
    start: 2,
    name: "onValue",
    type: "number",
    defaultValue: 1
  }, {
    start: 3,
    name: "offValue",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ones",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "OnesLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "RandomUniform",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "minval",
    name: "minval",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "maxval",
    name: "maxval",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "seed",
    name: "seed",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Range",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "step",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "Tidx",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TruncatedNormal",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "means",
    name: "mean",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "stddev",
    name: "stdDev",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "seed",
    name: "seed",
    type: "number"
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Zeros",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ZerosLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}],
    creation = Object.freeze({
  json: json$4
}),
    json$5 = [{
  tfOpName: "NonMaxSuppressionV2",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }]
}, {
  tfOpName: "NonMaxSuppressionV3",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }, {
    start: 4,
    name: "scoreThreshold",
    type: "number"
  }]
}, {
  tfOpName: "Where",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ListDiff",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    dynamic = Object.freeze({
  json: json$5
}),
    json$6 = [{
  tfOpName: "TopKV2",
  category: "evaluation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "k",
    type: "number"
  }],
  attrs: [{
    tfName: "sorted",
    name: "sorted",
    type: "bool"
  }]
}],
    evaluation = Object.freeze({
  json: json$6
}),
    json$7 = [{
  tfOpName: "PlaceholderWithDefault",
  category: "graph",
  inputs: [{
    start: 0,
    name: "default",
    type: "tensor"
  }],
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Placeholder",
  category: "graph",
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Const",
  category: "graph"
}, {
  tfOpName: "Identity",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IdentityN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Snapshot",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Rank",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Size",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Shape",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "ShapeN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Print",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "data",
    type: "tensors"
  }],
  attrs: [{
    tfName: "message",
    name: "message",
    type: "string"
  }, {
    tfName: "first_n",
    name: "firstN",
    type: "number",
    notSupported: !0
  }, {
    tfName: "summarize",
    name: "summarize",
    type: "number",
    defaultValue: 3
  }]
}, {
  tfOpName: "NoOp",
  category: "graph",
  inputs: []
}, {
  tfOpName: "StopGradient",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "FakeQuantWithMinMaxVars",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "min",
    name: "min",
    type: "number"
  }, {
    tfName: "max",
    name: "max",
    type: "number"
  }]
}],
    graph = Object.freeze({
  json: json$7
}),
    json$8 = [{
  tfOpName: "ResizeBilinear",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ResizeNearestNeighbor",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "CropAndResize",
  category: "image",
  inputs: [{
    start: 0,
    name: "image",
    type: "tensor"
  }, {
    start: 1,
    name: "boxes",
    type: "tensor"
  }, {
    start: 2,
    name: "boxInd",
    type: "tensor"
  }, {
    start: 3,
    name: "cropSize",
    type: "number[]"
  }],
  attrs: [{
    tfName: "method",
    name: "method",
    type: "string"
  }, {
    tfName: "extrapolation_value",
    name: "extrapolationValue",
    type: "number"
  }]
}],
    image$1 = Object.freeze({
  json: json$8
}),
    json$9 = [{
  tfOpName: "Equal",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NotEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Greater",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "GreaterEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Less",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LessEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalAnd",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalNot",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalOr",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Select",
  category: "logical",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }, {
    start: 1,
    name: "a",
    type: "tensor"
  }, {
    start: 2,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    logical = Object.freeze({
  json: json$9
}),
    json$10 = [{
  tfOpName: "MatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "transpose_a",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "transpose_b",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "BatchMatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "adj_x",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "adj_y",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Transpose",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "perm",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    matrices = Object.freeze({
  json: json$10
}),
    json$11 = [{
  tfOpName: "FusedBatchNorm",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "FusedBatchNormV2",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "LRN",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "depth_radius",
    name: "radius",
    type: "number",
    defaultValue: 5
  }, {
    tfName: "bias",
    name: "bias",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "beta",
    name: "beta",
    type: "number",
    defaultValue: .5
  }]
}, {
  tfOpName: "Softmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "LogSoftmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !0,
    notSupported: !0
  }]
}],
    normalization = Object.freeze({
  json: json$11
}),
    json$12 = [{
  tfOpName: "Max",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Mean",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Min",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Sum",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "All",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Any",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "ArgMax",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "ArgMin",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Prod",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}],
    reduction = Object.freeze({
  json: json$12
}),
    json$13 = [{
  tfOpName: "ConcatV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: -1,
    name: "tensors",
    type: "tensors"
  }, {
    start: -1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Concat",
  category: "slice_join",
  inputs: [{
    start: 1,
    end: 0,
    name: "tensors",
    type: "tensors"
  }, {
    start: 0,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "GatherV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Gather",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "Reverse",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "dims",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "ReverseV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "Slice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "size",
    type: "number[]"
  }]
}, {
  tfOpName: "StridedSlice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "end",
    type: "number[]"
  }, {
    start: 3,
    name: "strides",
    type: "number[]"
  }],
  attrs: [{
    tfName: "begin_mask",
    name: "beginMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "end_mask",
    name: "endMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "new_axis_mask",
    name: "newAxisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "ellipsis_mask",
    name: "ellipsisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "shrink_axis_mask",
    name: "shrinkAxisMask",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Pack",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Unpack",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "num",
    name: "num",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }]
}, {
  tfOpName: "Tile",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "reps",
    type: "number[]"
  }]
}, {
  tfOpName: "Split",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    start: 1,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "num_split",
    name: "numOrSizeSplits",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "SplitV",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "numOrSizeSplits",
    type: "number[]"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "ScatterNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "values",
    type: "tensor"
  }, {
    start: 2,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "GatherNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !1,
    notSupported: !0
  }]
}],
    sliceJoin = Object.freeze({
  json: json$13
}),
    json$14 = [{
  tfOpName: "FFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "RFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "IRFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}],
    spectral = Object.freeze({
  json: json$14
}),
    json$15 = [{
  tfOpName: "Cast",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "SrcT",
    name: "sdtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "DstT",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ExpandDims",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Pad",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }],
  attrs: [{
    tfName: "constant_value",
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "PadV2",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }, {
    start: 2,
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Reshape",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "Squeeze",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    tfDeprecatedName: "squeeze_dims",
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "SpaceToBatchND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "paddings",
    type: "number[]"
  }]
}, {
  tfOpName: "BatchToSpaceND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "crops",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthToSpace",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "block_size",
    name: "blockSize",
    type: "number"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string"
  }]
}],
    transformation = Object.freeze({
  json: json$15
}),
    OperationMapper = function () {
  function e() {
    var e = [arithmetic, basicMath, control, convolution, creation, dynamic, evaluation, logical, image$1, graph, matrices, normalization, reduction, sliceJoin, spectral, transformation],
        t = [].concat.apply([], e.map(function (e) {
      return e.json;
    }));
    this.opMappers = t.reduce(function (e, t) {
      return e[t.tfOpName] = t, e;
    }, {});
  }

  return Object.defineProperty(e, "Instance", {
    get: function () {
      return this._instance || (this._instance = new this());
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.transformGraph = function (e) {
    var t = this,
        a = [],
        r = [],
        n = e.node.reduce(function (e, n) {
      return e[n.name] = t.mapNode(n), "Placeholder" === n.op && a.push(e[n.name]), "Const" === n.op && r.push(e[n.name]), e;
    }, {}),
        s = [],
        o = [],
        p = Object.keys(n);
    return p.forEach(function (e) {
      var t = n[e];
      t.inputNames.forEach(function (e) {
        var a = getNodeNameAndIndex(e)[0];
        t.inputs.push(n[a]), n[a].children.push(t);
      }), 0 === t.inputs.length && s.push(t);
    }), p.forEach(function (e) {
      var t = n[e];
      0 === t.children.length && o.push(t);
    }), {
      nodes: n,
      inputs: s,
      outputs: o,
      weights: r,
      placeholders: a
    };
  }, e.prototype.mapNode = function (e) {
    var t = getRegisteredOp(e.op) || this.opMappers[e.op] || {};
    null == e.attr && (e.attr = {});
    var a = {
      name: e.name,
      op: e.op,
      category: t.category,
      inputNames: (e.input || []).map(function (e) {
        return e.startsWith("^") ? e.substr(1) : e;
      }),
      inputs: [],
      children: [],
      inputParams: {},
      attrParams: {},
      rawAttrs: e.attr
    };
    return null != t.inputs && (a.inputParams = t.inputs.reduce(function (e, t) {
      return e[t.name] = {
        type: t.type,
        inputIndexStart: t.start,
        inputIndexEnd: t.end
      }, e;
    }, {})), null != t.attrs && (a.attrParams = t.attrs.reduce(function (t, a) {
      var r = a.type,
          n = void 0;

      switch (a.type) {
        case "string":
          void 0 === (n = getStringParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "string[]":
          void 0 === (n = getStringArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number":
          void 0 === (n = getNumberParam(e.attr, a.tfName, a.defaultValue || 0)) && a.tfDeprecatedName && (n = getNumberParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number[]":
          void 0 === (n = getNumericArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getNumericArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool":
          void 0 === (n = getBoolParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool[]":
          void 0 === (n = getBoolArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape":
          void 0 === (n = getTensorShapeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape[]":
          void 0 === (n = getTensorShapeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype":
          void 0 === (n = getDtypeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype[]":
          void 0 === (n = getDtypeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "tensor":
        case "tensors":
          break;

        default:
          throw new Error("Unsupported param type: " + a.type + " for op: " + e.op);
      }

      return t[a.name] = {
        value: n,
        type: r
      }, t;
    }, {})), a;
  }, e;
}();

function decodeBase64(e) {
  var t = _tfjsCore.ENV.global;
  if (void 0 !== t.atob) return t.atob(e);
  if ("undefined" != typeof Buffer) return new Buffer(e, "base64").toString();
  throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()");
}

function parseStringParam(e, t) {
  var a = Array.isArray(e) ? String.fromCharCode.apply(null, e) : decodeBase64(e);
  return t ? a : a.toLowerCase();
}

function getStringParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return null != n ? parseStringParam(n.s, r) : a;
}

function getBoolParam(e, t, a) {
  var r = e[t];
  return r ? r.b : a;
}

function getNumberParam(e, t, a) {
  var r = e[t] || {},
      n = null != r.i ? r.i : null != r.f ? r.f : a;
  return "number" == typeof n ? n : parseInt(n, 10);
}

function parseDtypeParam(e) {
  switch ("string" == typeof e && (e = DataType[e]), e) {
    case DataType.DT_FLOAT:
      return "float32";

    case DataType.DT_INT32:
      return "int32";

    case DataType.DT_BOOL:
      return "bool";

    case DataType.DT_DOUBLE:
      return "float32";

    case DataType.DT_STRING:
      return "string";

    default:
      return null;
  }
}

function getDtypeParam(e, t, a) {
  var r = e[t];
  return r && r.type ? parseDtypeParam(r.type) : a;
}

function getDtypeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.type ? r.list.type.map(function (e) {
    return parseDtypeParam(e);
  }) : a;
}

function parseTensorShapeParam(e) {
  if (!e.unknownRank) return null != e.dim ? e.dim.map(function (e) {
    return "number" == typeof e.size ? e.size : parseInt(e.size, 10);
  }) : [];
}

function getTensorShapeParam(e, t, a) {
  var r = e[t];
  return r && r.shape ? parseTensorShapeParam(r.shape) : a;
}

function getNumericArrayParam(e, t, a) {
  var r = e[t];
  return r ? (r.list.f && r.list.f.length ? r.list.f : r.list.i).map(function (e) {
    return "number" == typeof e ? e : parseInt(e, 10);
  }) : a;
}

function getStringArrayParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return n && n.list && n.list.s ? n.list.s.map(function (e) {
    return parseStringParam(e, r);
  }) : a;
}

function getTensorShapeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.shape ? r.list.shape.map(function (e) {
    return parseTensorShapeParam(e);
  }) : a;
}

function getBoolArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.b ? r.list.b : a;
}

var NodeValueImpl = function () {
  function e(e, t, a) {
    var r = this;
    this.node = e, this.tensorMap = t, this.context = a, this.inputs = [], this.attrs = {}, this.inputs = e.inputNames.map(function (e) {
      return r.getInput(e);
    }), null != e.rawAttrs && (this.attrs = Object.keys(e.rawAttrs).reduce(function (e, t) {
      return e[t] = r.getAttr(t), e;
    }, {}));
  }

  return e.prototype.getInput = function (e) {
    return getTensor(e, this.tensorMap, this.context);
  }, e.prototype.getAttr = function (e, t) {
    var a = this.node.rawAttrs[e];
    if (null != a.tensor) return getTensor(e, this.tensorMap, this.context);
    if (null != a.i || null != a.f) return getNumberParam(this.node.rawAttrs, e, t);
    if (null != a.s) return getStringParam(this.node.rawAttrs, e, t);
    if (null != a.b) return getBoolParam(this.node.rawAttrs, e, t);
    if (null != a.shape) return getTensorShapeParam(this.node.rawAttrs, e, t);
    if (null != a.type) return getDtypeParam(this.node.rawAttrs, e, t);

    if (null != a.list) {
      if (null != a.list.i || null != a.list.f) return getNumericArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.s) return getStringArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.shape) return getTensorShapeArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.b) return getBoolArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.type) return getDtypeArrayParam(this.node.rawAttrs, e, t);
    }

    return t;
  }, e;
}(),
    executeOp = function (e, t, a) {
  switch (e.op) {
    case "BiasAdd":
    case "Add":
      return [(0, _tfjsCore.add)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "AddN":
      return [(0, _tfjsCore.addN)(getParamValue("tensors", e, t, a))];

    case "FloorMod":
    case "Mod":
      return [(0, _tfjsCore.mod)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Mul":
      return [(0, _tfjsCore.mul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "RealDiv":
    case "Div":
      return [(0, _tfjsCore.div)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "FloorDiv":
      return [(0, _tfjsCore.floorDiv)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Sub":
      return [(0, _tfjsCore.sub)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Minimum":
      return [(0, _tfjsCore.minimum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Maximum":
      return [(0, _tfjsCore.maximum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Pow":
      return [(0, _tfjsCore.pow)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "SquaredDifference":
      return [(0, _tfjsCore.squaredDifference)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$1 = function (e, t, a) {
  switch (e.op) {
    case "Abs":
      return [(0, _tfjsCore.abs)(getParamValue("x", e, t, a))];

    case "Acos":
      return [(0, _tfjsCore.acos)(getParamValue("x", e, t, a))];

    case "Acosh":
      return [(0, _tfjsCore.acosh)(getParamValue("x", e, t, a))];

    case "Asin":
      return [(0, _tfjsCore.asin)(getParamValue("x", e, t, a))];

    case "Asinh":
      return [(0, _tfjsCore.asinh)(getParamValue("x", e, t, a))];

    case "Atan":
      return [(0, _tfjsCore.atan)(getParamValue("x", e, t, a))];

    case "Atan2":
      return [(0, _tfjsCore.atan2)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

    case "Atanh":
      return [(0, _tfjsCore.atanh)(getParamValue("x", e, t, a))];

    case "Ceil":
      return [(0, _tfjsCore.ceil)(getParamValue("x", e, t, a))];

    case "Cos":
      return [(0, _tfjsCore.cos)(getParamValue("x", e, t, a))];

    case "Cosh":
      return [(0, _tfjsCore.cosh)(getParamValue("x", e, t, a))];

    case "Elu":
      return [(0, _tfjsCore.elu)(getParamValue("x", e, t, a))];

    case "Erf":
      return [(0, _tfjsCore.erf)(getParamValue("x", e, t, a))];

    case "Exp":
      return [(0, _tfjsCore.exp)(getParamValue("x", e, t, a))];

    case "Expm1":
      return [(0, _tfjsCore.expm1)(getParamValue("x", e, t, a))];

    case "Floor":
      return [(0, _tfjsCore.floor)(getParamValue("x", e, t, a))];

    case "Log":
      return [(0, _tfjsCore.log)(getParamValue("x", e, t, a))];

    case "Log1p":
      return [(0, _tfjsCore.log1p)(getParamValue("x", e, t, a))];

    case "Neg":
      return [(0, _tfjsCore.neg)(getParamValue("x", e, t, a))];

    case "Reciprocal":
      return [(0, _tfjsCore.reciprocal)(getParamValue("x", e, t, a))];

    case "Relu":
      return [(0, _tfjsCore.relu)(getParamValue("x", e, t, a))];

    case "Round":
      return [(0, _tfjsCore.round)(getParamValue("x", e, t, a))];

    case "Selu":
      return [(0, _tfjsCore.selu)(getParamValue("x", e, t, a))];

    case "Sigmoid":
      return [(0, _tfjsCore.sigmoid)(getParamValue("x", e, t, a))];

    case "Sin":
      return [(0, _tfjsCore.sin)(getParamValue("x", e, t, a))];

    case "Sign":
      return [(0, _tfjsCore.sign)(getParamValue("x", e, t, a))];

    case "Sinh":
      return [(0, _tfjsCore.sinh)(getParamValue("x", e, t, a))];

    case "Softplus":
      return [(0, _tfjsCore.softplus)(getParamValue("x", e, t, a))];

    case "Sqrt":
      return [(0, _tfjsCore.sqrt)(getParamValue("x", e, t, a))];

    case "Square":
      return [(0, _tfjsCore.square)(getParamValue("x", e, t, a))];

    case "Tanh":
      return [(0, _tfjsCore.tanh)(getParamValue("x", e, t, a))];

    case "Tan":
      return [(0, _tfjsCore.tan)(getParamValue("x", e, t, a))];

    case "Relu6":
    case "ClipByValue":
      return [(0, _tfjsCore.clipByValue)(getParamValue("x", e, t, a), getParamValue("clipValueMin", e, t, a), getParamValue("clipValueMax", e, t, a))];

    case "Rsqrt":
      return [(0, _tfjsCore.rsqrt)(getTensor(e.inputNames[0], t, a))];

    case "Prod":
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), getParamValue("axes", e, t, a))];

    case "LeakyRelu":
      return [(0, _tfjsCore.leakyRelu)(getParamValue("x", e, t, a), getParamValue("alpha", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    TensorArray = function () {
  function e(t, a, r, n, s, o, p) {
    this.name = t, this.dtype = a, this.maxSize = r, this.elementShape = n, this.identicalElementShapes = s, this.dynamicSize = o, this.clearAfterRead = p, this.tensors = [], this.closed_ = !1, this.id = e.nextId++;
  }

  return Object.defineProperty(e.prototype, "closed", {
    get: function () {
      return this.closed_;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.clearAndClose = function () {
    this.tensors.forEach(function (e) {
      return e.tensor.dispose();
    }), this.tensors = [], this.closed_ = !0;
  }, e.prototype.size = function () {
    return this.tensors.length;
  }, e.prototype.read = function (e) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || e >= this.tensors.length) throw new Error("Tried to read from index " + e + ", but array size is: " + this.tensors.length);
    var t = this.tensors[e];
    if (t.cleared) throw new Error("TensorArray " + this.name + ": Could not read index " + e + " twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).");
    return this.clearAfterRead && (t.cleared = !0), t.read = !0, t.tensor;
  }, e.prototype.readMany = function (e) {
    var t = this;
    return e.map(function (e) {
      return t.read(e);
    });
  }, e.prototype.write = function (e, t) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || !this.dynamicSize && e >= this.maxSize) throw new Error("Tried to write to index " + e + ", but array is not resizeable and size is: " + this.maxSize);
    var a = this.tensors[e] || {};
    if (t.dtype !== this.dtype) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ",\n          because the value dtype is " + t.dtype + ", but TensorArray dtype is " + this.dtype + ".");
    if (0 !== this.size() || null != this.elementShape && 0 !== this.elementShape.length || (this.elementShape = t.shape), this.assertShapesMatchAllowUndefinedSize(this.elementShape, t.shape, "TensorArray " + this.name + ": Could not write to TensorArray index " + e + "."), a && a.read) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been read.");
    if (a && a.written) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been written.");
    a.tensor = t, a.written = !0, this.tensors[e] = a;
  }, e.prototype.writeMany = function (e, t) {
    var a = this;
    if (e.length !== t.length) throw new Error("TensorArray " + this.name + ": could not write multiple tensors,because the index size: " + e.length + " is not the same as tensors size: " + t.length + ".");
    e.forEach(function (e, r) {
      return a.write(e, t[r]);
    });
  }, e.prototype.gather = function (e, t) {
    if (t && t !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but gather requested dtype " + t);

    if (!e) {
      e = [];

      for (var a = 0; a < this.size(); a++) e.push(a);
    }

    if (0 === e.length) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));
    var r = this.readMany(e);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: "), (0, _tfjsCore.stack)(r, 0);
  }, e.prototype.concat = function (e) {
    if (e && e !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but concat requested dtype " + e);
    if (0 === this.size()) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));

    for (var t = [], a = 0; a < this.size(); a++) t.push(a);

    var r = this.readMany(t);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: tensor array shape (" + this.elementShape + ") vs first tensor shape (" + r[0].shape + ")"), (0, _tfjsCore.concat)(r, 0);
  }, e.prototype.scatter = function (e, t) {
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    if (e.length !== t.shape[0]) throw new Error("Expected len(indices) == tensor.shape[0], but saw: " + e.length + " vs. " + t.shape[0]);
    var a = Math.max.apply(Math, e);
    if (!this.dynamicSize && a >= this.maxSize) throw new Error("Max index must be < array size (" + a + "  vs. " + this.maxSize + ")");
    this.writeMany(e, (0, _tfjsCore.unstack)(t, 0));
  }, e.prototype.split = function (e, t) {
    var a = this;
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    var r = 0,
        n = e.map(function (e) {
      return r += e;
    });
    if (r !== t.shape[0]) throw new Error("Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        " + r + ", and tensor's shape is: " + t.shape);
    if (!this.dynamicSize && e.length !== this.maxSize) throw new Error("TensorArray's size is not equal to the size of lengths (" + this.maxSize + " vs. " + e.length + "), and the TensorArray is not marked as dynamically resizeable");
    var s = 0 === r ? 0 : t.size / r,
        o = [];
    (0, _tfjsCore.tidy)(function () {
      t = t.reshape([1, r, s]);

      for (var p = 0; p < e.length; ++p) {
        var i = [0, 0 === p ? 0 : n[p - 1], 0],
            u = [1, e[p], s];
        o[p] = (0, _tfjsCore.slice)(t, i, u).reshape(a.elementShape);
      }

      return o;
    });

    for (var p = [], i = 0; i < e.length; i++) p[i] = i;

    this.writeMany(p, o);
  }, e.prototype.assertShapesMatchAllowUndefinedSize = function (e, t, a) {
    void 0 === a && (a = ""), _tfjsCore.util.assert(this.shapesEqualAllowUndefinedSize(e, t), function () {
      return a + " Shapes " + e + " and " + t + " must match";
    });
  }, e.prototype.shapesEqualAllowUndefinedSize = function (e, t) {
    if (e.length !== t.length) return !1;

    for (var a = 0; a < e.length; a++) if (-1 !== e[a] && -1 !== t[a] && e[a] !== t[a]) return !1;

    return !0;
  }, e.nextId = 0, e;
}();

function executeOp$2(e, t, a) {
  return __awaiter(this, void 0, void 0, function () {
    var r, n, s, o, p, i, u, m, c, l, d, y, f, h, g, N, x, b, V, P, T, O, S, v, _, w, A, D, E, I, C, M, k, z, j;

    return __generator(this, function (F) {
      switch (F.label) {
        case 0:
          switch (e.op) {
            case "LoopCond":
              return [3, 1];

            case "Switch":
              return [3, 2];

            case "Merge":
              return [3, 4];

            case "Enter":
              return [3, 5];

            case "Exit":
              return [3, 6];

            case "NextIteration":
              return [3, 7];

            case "TensorArrayV3":
              return [3, 8];

            case "TensorArrayWriteV3":
              return [3, 9];

            case "TensorArrayReadV3":
              return [3, 10];

            case "TensorArrayGatherV3":
              return [3, 11];

            case "TensorArrayScatterV3":
              return [3, 12];

            case "TensorArrayConcatV3":
              return [3, 13];

            case "TensorArraySplitV3":
              return [3, 14];

            case "TensorArraySizeV3":
              return [3, 15];

            case "TensorArrayCloseV3":
              return [3, 16];
          }

          return [3, 17];

        case 1:
          return [2, [getParamValue("pred", e, t, a).clone()]];

        case 2:
          return r = getParamValue("pred", e, t, a), n = getParamValue("data", e, t, a), [4, r.data()];

        case 3:
          return [2, F.sent()[0] ? [void 0, n.clone()] : [n.clone(), void 0]];

        case 4:
          return [2, (s = e.inputNames.find(function (e) {
            return void 0 !== getTensor(e, t, a);
          })) ? [getTensor(s, t, a).clone()] : void 0];

        case 5:
          return o = getParamValue("frameName", e, t, a), p = getParamValue("tensor", e, t, a), a.enterFrame(o), [2, [p.clone()]];

        case 6:
          return i = getParamValue("tensor", e, t, a), a.exitFrame(), [2, [i.clone()]];

        case 7:
          return u = getParamValue("tensor", e, t, a), a.nextIteration(), [2, [u.clone()]];

        case 8:
          return m = getParamValue("size", e, t, a), c = getParamValue("dtype", e, t, a), l = getParamValue("elementShape", e, t, a), d = getParamValue("dynamicSize", e, t, a), y = getParamValue("clearAfterRead", e, t, a), f = getParamValue("identicalElementShapes", e, t, a), h = getParamValue("name", e, t, a), g = new TensorArray(h, c, m, l, f, d, y), a.addTensorArray(g), [2, [(0, _tfjsCore.scalar)(g.id), (0, _tfjsCore.scalar)(1)]];

        case 9:
          return N = getParamValue("tensorArrayId", e, t, a), x = getParamValue("index", e, t, a), b = getParamValue("tensor", e, t, a), a.getTensorArray(N).write(x, b), [2, [(0, _tfjsCore.scalar)(1)]];

        case 10:
          return V = getParamValue("tensorArrayId", e, t, a), P = getParamValue("index", e, t, a), [2, [a.getTensorArray(V).read(P)]];

        case 11:
          return T = getParamValue("tensorArrayId", e, t, a), O = getParamValue("indices", e, t, a), S = getParamValue("dtype", e, t, a), [2, [a.getTensorArray(T).gather(O, S)]];

        case 12:
          return v = getParamValue("tensorArrayId", e, t, a), _ = getParamValue("indices", e, t, a), w = getParamValue("tensor", e, t, a), a.getTensorArray(v).scatter(_, w), [2, [(0, _tfjsCore.scalar)(1)]];

        case 13:
          return A = getParamValue("tensorArrayId", e, t, a), D = a.getTensorArray(A), E = getParamValue("dtype", e, t, a), [2, [D.concat(E)]];

        case 14:
          return I = getParamValue("tensorArrayId", e, t, a), C = getParamValue("tensor", e, t, a), M = getParamValue("lengths", e, t, a), a.getTensorArray(I).split(M, C), [2, [(0, _tfjsCore.scalar)(1)]];

        case 15:
          return k = getParamValue("tensorArrayId", e, t, a), z = a.getTensorArray(k), [2, [(0, _tfjsCore.scalar)(z.size(), "int32")]];

        case 16:
          return j = getParamValue("tensorArrayId", e, t, a), a.getTensorArray(j).clearAndClose(), [2, []];

        case 17:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
}

var executeOp$3 = function (e, t, a) {
  switch (e.op) {
    case "Conv1D":
      var r = getParamValue("stride", e, t, a),
          n = getParamValue("pad", e, t, a),
          s = getParamValue("dataFormat", e, t, a).toUpperCase(),
          o = getParamValue("dilation", e, t, a);
      return [(0, _tfjsCore.conv1d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), r, n, s, o)];

    case "Conv2D":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase();
      var p = getParamValue("dilations", e, t, a);
      return [(0, _tfjsCore.conv2d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), [r[1], r[2]], n, s, [p[1], p[2]])];

    case "Conv2DBackpropInput":
    case "Conv2dTranspose":
      var i = getParamValue("outputShape", e, t, a);
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a);
      return [(0, _tfjsCore.conv2dTranspose)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), i, [r[1], r[2]], n)];

    case "DepthwiseConv2dNative":
    case "DepthwiseConv2d":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), p = getParamValue("dilations", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthwiseConv2d)(getParamValue("input", e, t, a), getParamValue("filter", e, t, a), [r[1], r[2]], n, s, [p[1], p[2]])];

    case "AvgPool":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a);
      var u = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.avgPool)(getParamValue("x", e, t, a), [u[1], u[2]], [r[1], r[2]], n)];

    case "MaxPool":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), u = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.maxPool)(getParamValue("x", e, t, a), [u[1], u[2]], [r[1], r[2]], n)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$4 = function (e, t, a) {
  switch (e.op) {
    case "Fill":
      var r = getParamValue("shape", e, t, a),
          n = getParamValue("dtype", e, t, a),
          s = getParamValue("value", e, t, a);
      return [(0, _tfjsCore.fill)(r, s, n)];

    case "LinSpace":
      var o = getParamValue("start", e, t, a),
          p = getParamValue("stop", e, t, a),
          i = getParamValue("num", e, t, a);
      return [(0, _tfjsCore.linspace)(o, p, i)];

    case "OneHot":
      var u = getParamValue("indices", e, t, a),
          m = getParamValue("depth", e, t, a),
          c = getParamValue("onValue", e, t, a),
          l = getParamValue("offValue", e, t, a);
      return [(0, _tfjsCore.oneHot)(u, m, c, l)];

    case "Ones":
      return [(0, _tfjsCore.ones)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "OnesLike":
      return [(0, _tfjsCore.onesLike)(getParamValue("x", e, t, a))];

    case "RandomUniform":
      return [(0, _tfjsCore.randomUniform)(getParamValue("shape", e, t, a), getParamValue("minval", e, t, a), getParamValue("maxval", e, t, a), getParamValue("dtype", e, t, a))];

    case "Range":
      o = getParamValue("start", e, t, a);
      var d = getParamValue("stop", e, t, a),
          y = getParamValue("step", e, t, a);
      return [(0, _tfjsCore.range)(o, d, y, getParamValue("dtype", e, t, a))];

    case "TruncatedNormal":
      r = getParamValue("shape", e, t, a);
      var f = getParamValue("mean", e, t, a),
          h = getParamValue("stdDev", e, t, a),
          g = getParamValue("seed", e, t, a);
      return [(0, _tfjsCore.truncatedNormal)(r, f, h, getParamValue("dtype", e, t, a), g)];

    case "Zeros":
      return [(0, _tfjsCore.zeros)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "ZerosLike":
      return [(0, _tfjsCore.zerosLike)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
};

function executeOp$5(e, t, a) {
  return __awaiter(this, void 0, void 0, function () {
    var r, n, s, o, p;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          switch (e.op) {
            case "NonMaxSuppressionV3":
            case "NonMaxSuppressionV2":
              return [3, 1];

            case "Where":
              return [3, 3];

            case "ListDiff":
              return [3, 5];
          }

          return [3, 7];

        case 1:
          return r = getParamValue("boxes", e, t, a), n = getParamValue("scores", e, t, a), s = getParamValue("maxOutputSize", e, t, a), o = getParamValue("iouThreshold", e, t, a), p = getParamValue("scoreThreshold", e, t, a), [4, _tfjsCore.image.nonMaxSuppressionAsync(r, n, s, o, p)];

        case 2:
          return [2, [i.sent()]];

        case 3:
          return [4, (0, _tfjsCore.whereAsync)(getParamValue("condition", e, t, a))];

        case 4:
          return [2, [i.sent()]];

        case 5:
          return [4, (0, _tfjsCore.setdiff1dAsync)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

        case 6:
          return [2, i.sent()];

        case 7:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
}

var executeOp$6 = function (e, t, a) {
  switch (e.op) {
    case "TopKV2":
      var r = getParamValue("x", e, t, a),
          n = getParamValue("k", e, t, a),
          s = getParamValue("sorted", e, t, a),
          o = (0, _tfjsCore.topk)(r, n, s);
      return [o.values, o.indices];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$7 = function (e, t, a) {
  switch (e.op) {
    case "Const":
      return t[e.name];

    case "PlaceholderWithDefault":
      var r = getParamValue("default", e, t, a);
      return [getTensor(e.name, t, a) || r];

    case "Placeholder":
      return [getTensor(e.name, t, a)];

    case "Identity":
    case "StopGradient":
    case "FakeQuantWithMinMaxVars":
      return [getParamValue("x", e, t, a).clone()];

    case "IdentityN":
      return getParamValue("x", e, t, a).map(function (e) {
        return e.clone();
      });

    case "Snapshot":
      return [getParamValue("x", e, t, a).clone()];

    case "Shape":
      return [(0, _tfjsCore.tensor1d)(getParamValue("x", e, t, a).shape, "int32")];

    case "ShapeN":
      return getParamValue("x", e, t, a).map(function (e) {
        return (0, _tfjsCore.tensor1d)(e.shape);
      });

    case "Size":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).size, "int32")];

    case "Rank":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).rank, "int32")];

    case "NoOp":
      return [];

    case "Print":
      var n = getParamValue("x", e, t, a),
          s = getParamValue("data", e, t, a),
          o = getParamValue("message", e, t, a),
          p = getParamValue("summarize", e, t, a);
      console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."), console.log(o);

      for (var i = 0; i < s.length; i++) console.log(Array.prototype.slice.call(s[i].dataSync()).slice(0, p));

      return [n];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$8 = function (e, t, a) {
  switch (e.op) {
    case "ResizeBilinear":
      var r = getParamValue("images", e, t, a),
          n = getParamValue("size", e, t, a),
          s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeBilinear(r, [n[0], n[1]], s)];

    case "ResizeNearestNeighbor":
      r = getParamValue("images", e, t, a), n = getParamValue("size", e, t, a), s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeNearestNeighbor(r, [n[0], n[1]], s)];

    case "CropAndResize":
      var o = getParamValue("image", e, t, a),
          p = getParamValue("boxes", e, t, a),
          i = getParamValue("boxInd", e, t, a),
          u = getParamValue("cropSize", e, t, a),
          m = getParamValue("method", e, t, a),
          c = getParamValue("extrapolationValue", e, t, a);
      return [_tfjsCore.image.cropAndResize(o, p, i, u, m, c)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$9 = function (e, t, a) {
  switch (e.op) {
    case "Equal":
      return [(0, _tfjsCore.equal)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "NotEqual":
      return [(0, _tfjsCore.notEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Greater":
      return [(0, _tfjsCore.greater)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "GreaterEqual":
      return [(0, _tfjsCore.greaterEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Less":
      return [(0, _tfjsCore.less)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LessEqual":
      return [(0, _tfjsCore.lessEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalAnd":
      return [(0, _tfjsCore.logicalAnd)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalNot":
      return [(0, _tfjsCore.logicalNot)(getParamValue("a", e, t, a))];

    case "LogicalOr":
      return [(0, _tfjsCore.logicalOr)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Select":
      return [(0, _tfjsCore.where)(getParamValue("condition", e, t, a), getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$10 = function (e, t, a) {
  switch (e.op) {
    case "BatchMatMul":
    case "MatMul":
      return [(0, _tfjsCore.matMul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a), getParamValue("transposeA", e, t, a), getParamValue("transposeB", e, t, a))];

    case "Transpose":
      return [(0, _tfjsCore.transpose)(getParamValue("x", e, t, a), getParamValue("perm", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$11 = function (e, t, a) {
  switch (e.op) {
    case "FusedBatchNorm":
    case "FusedBatchNormV2":
      return [(0, _tfjsCore.batchNorm)(getParamValue("x", e, t, a), getParamValue("mean", e, t, a), getParamValue("variance", e, t, a), getParamValue("offset", e, t, a), getParamValue("scale", e, t, a), getParamValue("epsilon", e, t, a))];

    case "LRN":
      return [(0, _tfjsCore.localResponseNormalization)(getParamValue("x", e, t, a), getParamValue("radius", e, t, a), getParamValue("bias", e, t, a), getParamValue("alpha", e, t, a), getParamValue("beta", e, t, a))];

    case "Softmax":
      return [(0, _tfjsCore.softmax)(getParamValue("x", e, t, a))];

    case "LogSoftmax":
      return [(0, _tfjsCore.logSoftmax)(getParamValue("x", e, t, a))];

    case "SparseToDense":
      return [(0, _tfjsCore.sparseToDense)(getParamValue("sparseIndices", e, t, a), getParamValue("outputShape", e, t, a), getParamValue("sparseValues", e, t, a), getParamValue("defaultValue", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$12 = function (e, t, a) {
  switch (e.op) {
    case "Max":
      var r = getParamValue("axis", e, t, a),
          n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.max)(getParamValue("x", e, t, a), r, n)];

    case "Mean":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.mean)(getParamValue("x", e, t, a), r, n)];

    case "Min":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.min)(getParamValue("x", e, t, a), r, n)];

    case "Sum":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.sum)(getParamValue("x", e, t, a), r, n)];

    case "All":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.all)(getParamValue("x", e, t, a), r, n)];

    case "Any":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.any)(getParamValue("x", e, t, a), r, n)];

    case "ArgMax":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMax)(getParamValue("x", e, t, a), r)];

    case "ArgMin":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMin)(getParamValue("x", e, t, a), r)];

    case "Prod":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), r, n)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$13 = function (e, t, a) {
  switch (e.op) {
    case "ConcatV2":
    case "Concat":
      var r = getParamValue("axis", e, t, a),
          n = getParamValue("tensors", e, t, a);
      return [(0, _tfjsCore.concat)(n, r)];

    case "GatherV2":
    case "Gather":
      r = getParamValue("axis", e, t, a);
      var s = getParamValue("x", e, t, a),
          o = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gather)(s, o.asType("int32"), r)];

    case "ReverseV2":
    case "Reverse":
      r = getParamValue("axis", e, t, a), s = getParamValue("x", e, t, a);
      return [(0, _tfjsCore.reverse)(s, r)];

    case "Slice":
      var p = getParamValue("begin", e, t, a),
          i = getParamValue("size", e, t, a);
      return [(0, _tfjsCore.slice)(getParamValue("x", e, t, a), p, i)];

    case "StridedSlice":
      p = getParamValue("begin", e, t, a);
      var u = getParamValue("end", e, t, a),
          m = getParamValue("strides", e, t, a),
          c = getParamValue("beginMask", e, t, a),
          l = getParamValue("endMask", e, t, a),
          d = getParamValue("ellipsisMask", e, t, a),
          y = getParamValue("newAxisMask", e, t, a),
          f = getParamValue("shrinkAxisMask", e, t, a),
          h = getParamValue("x", e, t, a);
      if (1 === p.length && h.shape.length > 1) for (var g = 1; g < h.shape.length; g++) p.push(0), u.push(h.shape[g]), m.push(m[0]);
      return [(0, _tfjsCore.stridedSlice)(h, p, u, m, c, l, d, y, f)];

    case "Pack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensors", e, t, a),
            s = n[0].shape,
            o = n[0].squeeze().shape,
            p = n.map(function (e) {
          var t = _tfjsCore.util.arraysEqual(e.shape, s);

          if (!t && !_tfjsCore.util.arraysEqual(e.squeeze().shape, o)) throw new Error("the input tensors shape does not match");
          return t ? e : e.reshape(s);
        });
        return [(0, _tfjsCore.stack)(p, r)];
      });

    case "Unpack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensor", e, t, a);
        return (0, _tfjsCore.unstack)(n, r);
      });

    case "Tile":
      var N = getParamValue("reps", e, t, a);
      return [(0, _tfjsCore.tile)(getParamValue("x", e, t, a), N)];

    case "Split":
    case "SplitV":
      r = getParamValue("axis", e, t, a);
      var x = getParamValue("numOrSizeSplits", e, t, a);
      return (0, _tfjsCore.split)(getParamValue("x", e, t, a), x, r);

    case "ScatterNd":
      o = getParamValue("indices", e, t, a);
      var b = getParamValue("values", e, t, a),
          V = getParamValue("shape", e, t, a);
      return [(0, _tfjsCore.scatterND)(o, b, V)];

    case "GatherNd":
      var P = getParamValue("x", e, t, a);
      o = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gatherND)(P, o)];

    case "SparseToDense":
      o = getParamValue("sparseIndices", e, t, a), V = getParamValue("outputShape", e, t, a);
      var T = getParamValue("sparseValues", e, t, a),
          O = getParamValue("defaultValue", e, t, a);
      return [(0, _tfjsCore.sparseToDense)(o, T, V, T.dtype === O.dtype ? O : O.asType(T.dtype))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$14 = function (e, t, a) {
  switch (e.op) {
    case "FFT":
      return [(0, _tfjsCore.fft)(getParamValue("x", e, t, a))];

    case "IFFT":
      return [(0, _tfjsCore.ifft)(getParamValue("x", e, t, a))];

    case "RFFT":
      return [(0, _tfjsCore.rfft)(getParamValue("x", e, t, a))];

    case "IRFFT":
      return [(0, _tfjsCore.irfft)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$15 = function (e, t, a) {
  switch (e.op) {
    case "Cast":
      return [(0, _tfjsCore.cast)(getParamValue("x", e, t, a), getParamValue("dtype", e, t, a))];

    case "ExpandDims":
      var r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.expandDims)(getParamValue("x", e, t, a), r)];

    case "Squeeze":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.squeeze)(getParamValue("x", e, t, a), r)];

    case "Reshape":
      return [(0, _tfjsCore.reshape)(getParamValue("x", e, t, a), getParamValue("shape", e, t, a))];

    case "PadV2":
    case "Pad":
      return [(0, _tfjsCore.pad)(getParamValue("x", e, t, a), split$1(getParamValue("padding", e, t, a), 2), getParamValue("constantValue", e, t, a))];

    case "SpaceToBatchND":
      var n = getParamValue("blockShape", e, t, a),
          s = split$1(getParamValue("paddings", e, t, a), 2);
      return [(0, _tfjsCore.spaceToBatchND)(getParamValue("x", e, t, a), n, s)];

    case "BatchToSpaceND":
      n = getParamValue("blockShape", e, t, a);
      var o = split$1(getParamValue("crops", e, t, a), 2);
      return [(0, _tfjsCore.batchToSpaceND)(getParamValue("x", e, t, a), n, o)];

    case "DepthToSpace":
      var p = getParamValue("blockSize", e, t, a),
          i = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthToSpace)(getParamValue("x", e, t, a), p, i)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
};

function executeOp$16(e, t, a) {
  var r = function (e, t, a) {
    switch (e.category) {
      case "arithmetic":
        return executeOp(e, t, a);

      case "basic_math":
        return executeOp$1(e, t, a);

      case "control":
        return executeOp$2(e, t, a);

      case "convolution":
        return executeOp$3(e, t, a);

      case "creation":
        return executeOp$4(e, t, a);

      case "dynamic":
        return executeOp$5(e, t, a);

      case "evaluation":
        return executeOp$6(e, t, a);

      case "image":
        return executeOp$8(e, t, a);

      case "graph":
        return executeOp$7(e, t, a);

      case "logical":
        return executeOp$9(e, t, a);

      case "matrices":
        return executeOp$10(e, t, a);

      case "normalization":
        return executeOp$11(e, t, a);

      case "reduction":
        return executeOp$12(e, t, a);

      case "slice_join":
        return executeOp$13(e, t, a);

      case "spectral":
        return executeOp$14(e, t, a);

      case "transformation":
        return executeOp$15(e, t, a);

      case "custom":
        var r = getRegisteredOp(e.op);
        if (r && r.customExecutor) return r.customExecutor(new NodeValueImpl(e, t, a));
        throw TypeError("Custom op " + e.op + " is not registered.");

      default:
        throw TypeError("Unknown op '" + e.op + "'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()");
    }
  }(e, t, a);

  return r instanceof Promise ? r.then(function (e) {
    return [].concat(e);
  }) : [].concat(r);
}

var ExecutionContext = function () {
  function e(e, t) {
    this.weightMap = e, this.tensorArrayMap = t, this.rootContext = {
      id: 0,
      frameName: "",
      iterationId: 0
    }, this.contexts = [this.rootContext], this.lastId = 0, this.generateCurrentContextIds();
  }

  return e.prototype.newFrame = function (e, t) {
    return {
      id: e,
      frameName: t,
      iterationId: 0
    };
  }, Object.defineProperty(e.prototype, "currentContext", {
    get: function () {
      return this.contexts;
    },
    set: function (e) {
      this.contexts !== e && (this.contexts = e, this.generateCurrentContextIds());
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextId", {
    get: function () {
      return this._currentContextIds[0];
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextIds", {
    get: function () {
      return this._currentContextIds;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.generateCurrentContextIds = function () {
    for (var e = [], t = 0; t < this.contexts.length - 1; t++) {
      var a = this.contexts.slice(0, this.contexts.length - t);
      e.push(this.contextIdforContexts(a));
    }

    e.push(""), this._currentContextIds = e;
  }, e.prototype.contextIdforContexts = function (e) {
    return e ? e.map(function (e) {
      return 0 === e.id && 0 === e.iterationId ? "" : e.frameName + "-" + e.iterationId;
    }).join("/") : "";
  }, e.prototype.enterFrame = function (e) {
    this.contexts && (this.lastId++, this.contexts = this.contexts.slice(), this.contexts.push(this.newFrame(this.lastId, e)), this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)));
  }, e.prototype.exitFrame = function () {
    if (!(this.contexts && this.contexts.length > 1)) throw new Error("Cannot exit frame, the context is empty");
    this.contexts = this.contexts.slice(), this.contexts.splice(-1), this.currentContextIds.shift();
  }, e.prototype.nextIteration = function () {
    if (!(this.contexts && this.contexts.length > 0)) throw new Error("Cannot increase frame iteration, the context is empty");
    this.contexts = this.contexts.slice(), this.lastId++;
    var e = Object.assign({}, this.contexts[this.contexts.length - 1]);
    e.iterationId += 1, e.id = this.lastId, this.contexts.splice(-1, 1, e), this._currentContextIds.splice(0, 1, this.contextIdforContexts(this.contexts));
  }, e.prototype.getWeight = function (e) {
    return this.weightMap[e];
  }, e.prototype.addTensorArray = function (e) {
    this.tensorArrayMap[e.id] = e;
  }, e.prototype.getTensorArray = function (e) {
    return this.tensorArrayMap[e];
  }, e;
}();

function getExecutionSubgraph(e, t, a) {
  for (var r = new Set(), n = [], s = null, o = null, p = new Set(), i = t.slice(); i.length > 0;) {
    var u = i.pop();
    (isControlFlow(u) || isDynamicShape(u)) && null == s && (o = (s = u).children.map(function (e) {
      return e.name;
    }).filter(function (e) {
      return r.has(e);
    })), r.add(u.name), null == a[u.name] && null == e[u.name] && (0 !== u.inputs.length ? u.inputs.forEach(function (e) {
      p.has(e.name) || (p.add(e.name), i.push(e));
    }) : n.push(u.name));
  }

  return {
    inputs: e,
    outputs: t,
    usedNodes: r,
    missingInputs: n,
    dynamicNode: s,
    syncInputs: o
  };
}

function getNodesInTopologicalOrder(e, t, a) {
  var r = a.usedNodes,
      n = a.inputs,
      s = [];
  Object.keys(n).map(function (t) {
    return e.nodes[t];
  }).forEach(function (e) {
    r.has(e.name) && s.push(e);
  }), e.weights.forEach(function (e) {
    r.has(e.name) && s.push(e);
  });

  for (var o = new Set(), p = []; s.length > 0;) {
    var i = s.pop();
    o.add(i.name), t[i.name] || p.push(i), i.children.forEach(function (e) {
      !o.has(e.name) && r.has(e.name) && e.inputs.every(function (e) {
        return o.has(e.name);
      }) && s.push(e);
    });
  }

  return p;
}

var CONTROL_FLOW_OPS = ["Switch", "Merge", "Enter", "Exit", "NextIteration"],
    DYNAMIC_SHAPE_OPS = ["NonMaxSuppressionV2", "NonMaxSuppressionV3", "Where"];

function isControlFlow(e) {
  return CONTROL_FLOW_OPS.indexOf(e.op) >= 0;
}

function isDynamicShape(e) {
  return DYNAMIC_SHAPE_OPS.indexOf(e.op) >= 0;
}

var GraphExecutor = function () {
  function e(e) {
    this.graph = e, this.compiledMap = new Map(), this._weightMap = {}, this.SEPERATOR = ",", this.placeholders = e.placeholders, this._outputs = e.outputs;
  }

  return Object.defineProperty(e.prototype, "weightMap", {
    get: function () {
      return this._weightMap;
    },
    set: function (e) {
      var t = Object.keys(e).map(function (t) {
        return e[t].map(function (e) {
          return e.id;
        });
      });
      this.weightIds = [].concat.apply([], t), this._weightMap = e;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this.placeholders.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this._outputs.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this.placeholders.map(function (e) {
        return e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this.outputs.map(function (e) {
        return e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.getCompilationKey = function (e, t) {
    var a = e.map(function (e) {
      return e.name;
    }).sort(),
        r = t.map(function (e) {
      return e.name;
    }).sort();
    return a.join(this.SEPERATOR) + "--" + r.join(this.SEPERATOR);
  }, e.prototype.compile = function (e, t) {
    var a = getExecutionSubgraph(e, t, this.weightMap),
        r = a.missingInputs,
        n = a.dynamicNode,
        s = a.syncInputs;
    if (null != n) throw new Error("This execution contains the node '" + n.name + "', which has the dynamic op '" + n.op + "'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [" + s + "]");

    if (r.length > 0) {
      var o = t.map(function (e) {
        return e.name;
      }),
          p = Object.keys(e);
      throw new Error("Cannot compute the outputs [" + o + "] from the provided inputs [" + p + "]. Missing the following inputs: [" + r + "]");
    }

    return getNodesInTopologicalOrder(this.graph, this.weightMap, a);
  }, e.prototype.execute = function (e, t) {
    var a = this,
        r = Object.keys(e).sort();
    this.checkInputs(e), this.checkInputShapeAndType(e), this.checkOutputs(t);
    var n = r.map(function (e) {
      return a.graph.nodes[e];
    }),
        s = t.map(function (e) {
      return a.graph.nodes[parseNodeName(e)[0]];
    }),
        o = this.getCompilationKey(n, s),
        p = this.compiledMap.get(o);
    null == p && (p = this.compile(e, s), this.compiledMap.set(o, p));
    var i = {};
    return (0, _tfjsCore.tidy)(function () {
      var r = new ExecutionContext(a._weightMap, i),
          n = __assign({}, a.weightMap);

      Object.keys(e).forEach(function (t) {
        n[t] = [e[t]];
      });

      for (var s = a.getFrozenTensorIds(n), o = {}, u = 0; u < p.length; u++) {
        var m = p[u];

        if (!n[m.name]) {
          var c = executeOp$16(m, n, r);
          if (c instanceof Promise) throw new Error("The execution of the op '" + m.op + "' returned a promise. Please use model.executeAsync() instead.");
          n[m.name] = c, a.checkTensorForDisposal(m.name, m, n, r, s, t, o);
        }
      }

      return t.map(function (e) {
        return getTensor(e, n, r);
      });
    });
  }, e.prototype.getFrozenTensorIds = function (e) {
    var t = [].concat.apply([], Object.keys(e).map(function (t) {
      return e[t];
    }).map(function (e) {
      return e.map(function (e) {
        return e.id;
      });
    }));
    return new Set(t);
  }, e.prototype.checkTensorForDisposal = function (e, t, a, r, n, s, o) {
    "control" !== t.category && -1 === s.indexOf(e) && (a[e].forEach(function (e) {
      null != e && (o[e.id] = (o[e.id] || 0) + t.children.length);
    }), t.inputs.forEach(function (e) {
      if ("control" !== e.category) {
        var t = getTensorsForCurrentContenxt(e.name, a, r);
        null != t && t.forEach(function (e) {
          if (e && !n.has(e.id)) {
            var t = o[e.id];
            1 === t ? (e.dispose(), delete o[e.id]) : null != t && o[e.id]--;
          }
        });
      }
    }));
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a,
          r,
          n,
          s,
          o,
          p,
          i = this;
      return __generator(this, function (u) {
        switch (u.label) {
          case 0:
            return this.checkInputs(e), this.checkInputShapeAndType(e), a = {}, r = new ExecutionContext(this._weightMap, a), [4, this.executeWithControlFlow(e, r, t)];

          case 1:
            return n = u.sent(), s = t.map(function (e) {
              return getTensor(e, n, r);
            }), o = new Set(s.map(function (e) {
              return e.id;
            })), p = new Set(Object.keys(e).map(function (t) {
              return e[t].id;
            })), Object.keys(n).forEach(function (e) {
              n[e].forEach(function (e) {
                !e || e.isDisposed || o.has(e.id) || p.has(e.id) || -1 !== i.weightIds.indexOf(e.id) || e.dispose();
              });
            }), [2, s];
        }
      });
    });
  }, e.prototype.executeWithControlFlow = function (e, t, a) {
    return __awaiter(this, void 0, void 0, function () {
      var r,
          n,
          s,
          o,
          p,
          i,
          u,
          m,
          c,
          l,
          d,
          y,
          f,
          h,
          g,
          N,
          x = this;
      return __generator(this, function (b) {
        switch (b.label) {
          case 0:
            r = Object.keys(e), n = r.map(function (e) {
              return x.graph.nodes[e];
            }), s = a.map(function (e) {
              return x.graph.nodes[parseNodeName(e)[0]];
            }), o = getExecutionSubgraph(e, s, this.weightMap), p = o.usedNodes, i = o.missingInputs, u = o.dynamicNode, m = o.syncInputs, c = n.concat(this.graph.weights).map(function (e) {
              return {
                node: e,
                contexts: t.currentContext
              };
            }), l = __assign({}, this.weightMap), Object.keys(e).forEach(function (t) {
              l[t] = [e[t]];
            }), d = {}, y = this.getFrozenTensorIds(l), f = {}, b.label = 1;

          case 1:
            return c.length > 0 ? (h = this.processStack(n, c, t, l, f, y, a, d, p), [4, Promise.all(h)]) : [3, 3];

          case 2:
            return b.sent(), [3, 1];

          case 3:
            if (null == u && console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead."), (g = s.filter(function (e) {
              return !isControlFlow(e) && !getTensor(e.name, l, t);
            }).map(function (e) {
              return e.name;
            })).length > 0) throw N = "", null != u && (N = "Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [" + m + "]"), new Error("Cannot compute the outputs [" + g + "] from the provided inputs [" + r + "]. Consider providing the following inputs: [" + i + "]. " + N);
            return [2, l];
        }
      });
    });
  }, e.prototype.processStack = function (e, t, a, r, n, s, o, p, i) {
    for (var u = this, m = [], c = function () {
      var c = t.pop();
      a.currentContext = c.contexts;
      var d = "";

      if ("Enter" === c.node.op && getParamValue("isConstant", c.node, r, a) && (d = getNodeNameAndIndex(c.node.name, a)[0]), -1 === e.indexOf(c.node)) {
        var y = executeOp$16(c.node, r, a);
        d || (d = getNodeNameAndIndex(c.node.name, a)[0]);
        var f = a.currentContext;
        y instanceof Promise ? m.push(y.then(function (e) {
          return r[d] = e, a.currentContext = f, u.checkTensorForDisposal(d, c.node, r, a, s, o, p), u.processChildNodes(c.node, t, a, r, n, i), e;
        })) : (r[d] = y, l.checkTensorForDisposal(d, c.node, r, a, s, o, p), l.processChildNodes(c.node, t, a, r, n, i));
      } else l.processChildNodes(c.node, t, a, r, n, i);
    }, l = this; t.length > 0;) c();

    return m;
  }, e.prototype.processChildNodes = function (e, t, a, r, n, s) {
    e.children.forEach(function (e) {
      var o = getNodeNameAndIndex(e.name, a)[0];
      !n[o] && s.has(e.name) && ("Merge" === e.op ? e.inputNames.some(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })) : e.inputNames.every(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })));
    });
  }, e.prototype.dispose = function () {
    var e = this;
    Object.keys(this.weightMap).forEach(function (t) {
      return e.weightMap[t].forEach(function (e) {
        return e.dispose();
      });
    });
  }, e.prototype.checkInputShapeAndType = function (e) {
    var t = this;
    Object.keys(e).forEach(function (a) {
      var r = e[a],
          n = t.graph.nodes[a];

      if (n.attrParams.shape && n.attrParams.shape.value) {
        var s = n.attrParams.shape.value,
            o = s.length === r.shape.length && r.shape.every(function (e, t) {
          return -1 === s[t] || s[t] === e;
        });

        _tfjsCore.util.assert(o, function () {
          return "The shape of dict['" + n.name + "'] provided in model.execute(dict) must be [" + s + "], but was [" + r.shape + "]";
        });
      }

      n.attrParams.dtype && n.attrParams.dtype.value && _tfjsCore.util.assert(r.dtype === n.attrParams.dtype.value, function () {
        return "The dtype of dict['" + n.name + "'] provided in model.execute(dict) must be " + n.attrParams.dtype.value + ", but was " + r.dtype;
      });
    });
  }, e.prototype.checkInputs = function (e) {
    var t = this,
        a = Object.keys(e).filter(function (e) {
      return !t.graph.nodes[e];
    });
    if (a.length > 0) throw new Error("The dict provided in model.execute(dict) has keys: [" + a + "] that are not part of graph");
  }, e.prototype.checkOutputs = function (e) {
    var t = this;
    e.forEach(function (e) {
      var a = parseNodeName(e)[0];
      if (!t.graph.nodes[a]) throw new Error("The output '" + e + "' is not found in the graph");
    });
  }, e;
}(),
    TFHUB_SEARCH_PARAM = "?tfjs-format=file",
    DEFAULT_MODEL_NAME = "model.json",
    GraphModel = function () {
  function e(e, t) {
    void 0 === t && (t = {}), this.modelUrl = e, this.loadOptions = t, this.version = "n/a", null == t && (this.loadOptions = {});
  }

  return Object.defineProperty(e.prototype, "modelVersion", {
    get: function () {
      return this.version;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this.executor.inputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this.executor.outputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this.executor.inputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this.executor.outputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "weights", {
    get: function () {
      return this.executor.weightMap;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.findIOHandler = function () {
    var e = this.modelUrl;
    if (null != e.load) this.handler = e;else if (null != this.loadOptions.requestInit) this.handler = _tfjsCore.io.browserHTTPRequest(e, this.loadOptions);else {
      var t = _tfjsCore.io.getLoadHandlers(e, this.loadOptions.onProgress);

      if (0 === t.length) t.push(_tfjsCore.io.browserHTTPRequest(e, this.loadOptions));else if (t.length > 1) throw new Error("Found more than one (" + t.length + ") load handlers for URL '" + [e] + "'");
      this.handler = t[0];
    }
  }, e.prototype.load = function () {
    return __awaiter(this, void 0, void 0, function () {
      var e, t, a;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            if (this.findIOHandler(), null == this.handler.load) throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");
            return [4, this.handler.load()];

          case 1:
            return e = r.sent(), t = e.modelTopology, this.version = t.versions.producer + "." + t.versions.minConsumer, a = _tfjsCore.io.decodeWeights(e.weightData, e.weightSpecs), this.executor = new GraphExecutor(OperationMapper.Instance.transformGraph(t)), this.executor.weightMap = this.convertTensorMapToTensorsMap(a), [2, !0];
        }
      });
    });
  }, e.prototype.predict = function (e, t) {
    return this.execute(e, this.outputNodes);
  }, e.prototype.normalizeInputs = function (e) {
    if (!(e instanceof _tfjsCore.Tensor || Array.isArray(e))) return e;
    if ((e = Array.isArray(e) ? e : [e]).length !== this.inputNodes.length) throw new Error("Input tensor count mismatch,the graph model has " + this.inputNodes.length + " placeholders, while there are " + e.length + " input tensors.");
    return this.inputNodes.reduce(function (t, a, r) {
      return t[a] = e[r], t;
    }, {});
  }, e.prototype.normalizeOutputs = function (e) {
    return e = e || this.outputNodes, Array.isArray(e) ? e : [e];
  }, e.prototype.execute = function (e, t) {
    e = this.normalizeInputs(e), t = this.normalizeOutputs(t);
    var a = this.executor.execute(e, t);
    return a.length > 1 ? a : a[0];
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            return e = this.normalizeInputs(e), t = this.normalizeOutputs(t), [4, this.executor.executeAsync(e, t)];

          case 1:
            return [2, (a = r.sent()).length > 1 ? a : a[0]];
        }
      });
    });
  }, e.prototype.convertTensorMapToTensorsMap = function (e) {
    return Object.keys(e).reduce(function (t, a) {
      return t[a] = [e[a]], t;
    }, {});
  }, e.prototype.dispose = function () {
    this.executor.dispose();
  }, e;
}();

exports.GraphModel = GraphModel;

function loadGraphModel(e, t) {
  return void 0 === t && (t = {}), __awaiter(this, void 0, void 0, function () {
    var a;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (null == e) throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");
          return null == t && (t = {}), t.fromTFHub && null == e.load && (e.endsWith("/") || (e += "/"), e = "" + e + DEFAULT_MODEL_NAME + TFHUB_SEARCH_PARAM), [4, (a = new GraphModel(e, t)).load()];

        case 1:
          return r.sent(), [2, a];
      }
    });
  });
}

var version = "1.2.1";
exports.version_converter = version;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow-models/body-pix/dist/body-pix.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.decodePartSegmentation = decodePartSegmentation;
exports.toMask = toMask;
exports.drawBokehEffect = drawBokehEffect;
exports.drawMask = drawMask;
exports.drawPixelatedMask = drawPixelatedMask;
exports.toColoredPartImageData = toColoredPartImageData;
exports.toMaskImageData = toMaskImageData;
exports.resizeAndPadTo = resizeAndPadTo;
exports.scaleAndCropToInputTensorShape = scaleAndCropToInputTensorShape;
exports.partChannels = exports.checkpoints = exports.BodyPix = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-core"));

var _tfjsConverter = require("@tensorflow/tfjs-converter");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
    * @license
    * Copyright 2019 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */
function __awaiter(e, t, r, a) {
  return new (r || (r = Promise))(function (n, o) {
    function i(e) {
      try {
        d(a.next(e));
      } catch (e) {
        o(e);
      }
    }

    function s(e) {
      try {
        d(a.throw(e));
      } catch (e) {
        o(e);
      }
    }

    function d(e) {
      e.done ? n(e.value) : new r(function (t) {
        t(e.value);
      }).then(i, s);
    }

    d((a = a.apply(e, t || [])).next());
  });
}

function __generator(e, t) {
  var r,
      a,
      n,
      o,
      i = {
    label: 0,
    sent: function () {
      if (1 & n[0]) throw n[1];
      return n[1];
    },
    trys: [],
    ops: []
  };
  return o = {
    next: s(0),
    throw: s(1),
    return: s(2)
  }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
    return this;
  }), o;

  function s(o) {
    return function (s) {
      return function (o) {
        if (r) throw new TypeError("Generator is already executing.");

        for (; i;) try {
          if (r = 1, a && (n = 2 & o[0] ? a.return : o[0] ? a.throw || ((n = a.return) && n.call(a), 0) : a.next) && !(n = n.call(a, o[1])).done) return n;

          switch (a = 0, n && (o = [2 & o[0], n.value]), o[0]) {
            case 0:
            case 1:
              n = o;
              break;

            case 4:
              return i.label++, {
                value: o[1],
                done: !1
              };

            case 5:
              i.label++, a = o[1], o = [0];
              continue;

            case 7:
              o = i.ops.pop(), i.trys.pop();
              continue;

            default:
              if (!(n = (n = i.trys).length > 0 && n[n.length - 1]) && (6 === o[0] || 2 === o[0])) {
                i = 0;
                continue;
              }

              if (3 === o[0] && (!n || o[1] > n[0] && o[1] < n[3])) {
                i.label = o[1];
                break;
              }

              if (6 === o[0] && i.label < n[1]) {
                i.label = n[1], n = o;
                break;
              }

              if (n && i.label < n[2]) {
                i.label = n[2], i.ops.push(o);
                break;
              }

              n[2] && i.ops.pop(), i.trys.pop();
              continue;
          }

          o = t.call(e, i);
        } catch (e) {
          o = [6, e], a = 0;
        } finally {
          r = n = 0;
        }

        if (5 & o[0]) throw o[1];
        return {
          value: o[0] ? o[1] : void 0,
          done: !0
        };
      }([o, s]);
    };
  }
}

var mobileNet100Architecture = [["conv2d", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1]],
    mobileNet75Architecture = [["conv2d", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1]],
    mobileNet50Architecture = [["conv2d", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 2], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1], ["separableConv", 1]],
    mobileNet25Architecture = mobileNet50Architecture,
    VALID_OUTPUT_STRIDES = [8, 16, 32];

function assertValidOutputStride(e) {
  tf.util.assert("number" == typeof e, function () {
    return "outputStride is not a number";
  }), tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(e) >= 0, function () {
    return "outputStride of " + e + " is invalid. It must be either 8, 16, or 32";
  });
}

var mobileNetArchitectures = {
  100: mobileNet100Architecture,
  75: mobileNet75Architecture,
  50: mobileNet50Architecture,
  25: mobileNet25Architecture
};

function toOutputStridedLayers(e, t) {
  var r = 1,
      a = 1;
  return e.map(function (e, n) {
    var o,
        i,
        s = e[0],
        d = e[1];
    return r === t ? (o = 1, i = a, a *= d) : (o = d, i = 1, r *= d), {
      blockId: n,
      convType: s,
      stride: o,
      rate: i,
      outputStride: r
    };
  });
}

var MobileNet = function () {
  function e(e, t) {
    this.PREPROCESS_DIVISOR = (0, tf.scalar)(127.5), this.ONE = (0, tf.scalar)(1), this.modelWeights = e, this.convolutionDefinitions = t;
  }

  return e.prototype.predict = function (e, t) {
    var r = this,
        a = (0, tf.div)(e.toFloat(), this.PREPROCESS_DIVISOR),
        n = (0, tf.sub)(a, this.ONE);
    return toOutputStridedLayers(this.convolutionDefinitions, t).reduce(function (e, t) {
      var a = t.blockId,
          n = t.stride,
          o = t.convType,
          i = t.rate;
      if ("conv2d" === o) return r.conv(e, n, a);
      if ("separableConv" === o) return r.separableConv(e, n, a, i);
      throw Error("Unknown conv type of " + o);
    }, n);
  }, e.prototype.convToOutput = function (e, t) {
    return e.conv2d(this.weights(t), 1, "same").add(this.convBias(t, !1));
  }, e.prototype.conv = function (e, t, r) {
    var a = this.weights("Conv2d_" + String(r));
    return e.conv2d(a, t, "same").add(this.convBias("Conv2d_" + String(r))).clipByValue(0, 6);
  }, e.prototype.separableConv = function (e, t, r, a) {
    void 0 === a && (a = 1);
    var n = "Conv2d_" + String(r) + "_depthwise",
        o = "Conv2d_" + String(r) + "_pointwise";
    return e.depthwiseConv2D(this.depthwiseWeights(n), t, "same", "NHWC", a).add(this.depthwiseBias(n)).clipByValue(0, 6).conv2d(this.weights(o), [1, 1], "same").add(this.convBias(o)).clipByValue(0, 6);
  }, e.prototype.weights = function (e) {
    return this.modelWeights.weights(e);
  }, e.prototype.convBias = function (e, t) {
    return void 0 === t && (t = !0), this.modelWeights.convBias(e, t);
  }, e.prototype.depthwiseBias = function (e) {
    return this.modelWeights.depthwiseBias(e);
  }, e.prototype.depthwiseWeights = function (e) {
    return this.modelWeights.depthwiseWeights(e);
  }, e.prototype.dispose = function () {
    this.modelWeights.dispose();
  }, e;
}(),
    BASE_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/",
    checkpoints = {
  1: {
    url: BASE_URL + "posenet_mobilenet_100_partmap/",
    architecture: mobileNetArchitectures[100]
  },
  .75: {
    url: BASE_URL + "posenet_mobilenet_075_partmap/",
    architecture: mobileNetArchitectures[75]
  },
  .5: {
    url: BASE_URL + "posenet_mobilenet_050_partmap/",
    architecture: mobileNetArchitectures[50]
  },
  .25: {
    url: BASE_URL + "posenet_mobilenet_025_partmap/",
    architecture: mobileNetArchitectures[25]
  }
};

exports.checkpoints = checkpoints;

function toFlattenedOneHotPartMap(e) {
  var t = e.shape[2],
      r = e.argMax(2).reshape([-1]);
  return (0, tf.oneHot)(r, t);
}

function clipByMask2d(e, t) {
  return e.mul(t);
}

function toMask(e, t) {
  return (0, tf.tidy)(function () {
    return e.greater((0, tf.scalar)(t)).toInt();
  });
}

function decodePartSegmentation(e, t) {
  var r = t.shape,
      a = r[0],
      n = r[1],
      o = r[2];
  return (0, tf.tidy)(function () {
    var r = toFlattenedOneHotPartMap(t),
        i = (0, tf.range)(0, o, 1, "int32").expandDims(1);
    return clipByMask2d(r.matMul(i).toInt().reshape([a, n]).add((0, tf.scalar)(1, "int32")), e).sub((0, tf.scalar)(1, "int32"));
  });
}

var ModelWeights = function () {
  function e(e) {
    this.graphModel = e;
  }

  return e.prototype.weights = function (e) {
    return this.getVariable("MobilenetV1/" + e + "/weights");
  }, e.prototype.convBias = function (e, t) {
    return void 0 === t && (t = !0), this.getVariable("MobilenetV1/" + e + "/Conv2D_bias");
  }, e.prototype.depthwiseBias = function (e) {
    return this.getVariable("MobilenetV1/" + e + "/depthwise_bias");
  }, e.prototype.depthwiseWeights = function (e) {
    return this.getVariable("MobilenetV1/" + e + "/depthwise_weights");
  }, e.prototype.getVariable = function (e) {
    return this.graphModel.weights["" + e][0];
  }, e.prototype.dispose = function () {
    this.graphModel.dispose();
  }, e;
}();

function toInputTensor(e) {
  return e instanceof tf.Tensor ? e : tf.browser.fromPixels(e);
}

function resizeAndPadTo(e, t, r) {
  var a = t[0],
      n = t[1];
  void 0 === r && (r = !1);
  var o,
      i,
      s,
      d,
      u,
      l,
      c = e.shape,
      p = c[0],
      h = c[1] / p;

  if (h > n / a) {
    o = n;
    var f = a - (i = Math.ceil(o / h));
    s = 0, d = 0, u = Math.floor(f / 2), l = a - (i + u);
  } else {
    i = a;
    var v = n - (o = Math.ceil(a * h));
    s = Math.floor(v / 2), d = n - (o + s), u = 0, l = 0;
  }

  return {
    resizedAndPadded: (0, tf.tidy)(function () {
      var t;
      return t = r ? e.reverse(1).resizeBilinear([i, o]) : e.resizeBilinear([i, o]), (0, tf.pad3d)(t, [[u, l], [s, d], [0, 0]]);
    }),
    paddedBy: [[u, l], [s, d]]
  };
}

function scaleAndCropToInputTensorShape(e, t, r, a) {
  var n = t[0],
      o = t[1],
      i = r[0],
      s = r[1],
      d = a[0],
      u = d[0],
      l = d[1],
      c = a[1],
      p = c[0],
      h = c[1];
  return (0, tf.tidy)(function () {
    return removePaddingAndResizeBack(e.resizeBilinear([i, s], !0), [n, o], [[u, l], [p, h]]);
  });
}

function removePaddingAndResizeBack(e, t, r) {
  var a = t[0],
      n = t[1],
      o = r[0],
      i = o[0],
      s = o[1],
      d = r[1],
      u = d[0],
      l = d[1],
      c = e.shape,
      p = c[0],
      h = c[1],
      f = p - (i + s),
      v = h - (u + l);
  return (0, tf.tidy)(function () {
    return (0, tf.slice3d)(e, [i, u, 0], [f, v, e.shape[2]]).resizeBilinear([a, n], !0);
  });
}

var _this = void 0,
    segmentationModelImageDimensions = [353, 257],
    BodyPix = function () {
  function e(e) {
    this.mobileNet = e;
  }

  return e.prototype.predictForSegmentation = function (e, t) {
    var r = this;
    return void 0 === t && (t = 16), assertValidOutputStride(t), (0, tf.tidy)(function () {
      var a = r.mobileNet.predict(e, t);
      return r.mobileNet.convToOutput(a, "segment_2").sigmoid();
    });
  }, e.prototype.predictForPartMap = function (e, t) {
    var r = this;
    return void 0 === t && (t = 16), assertValidOutputStride(t), (0, tf.tidy)(function () {
      var a = r.mobileNet.predict(e, t),
          n = r.mobileNet.convToOutput(a, "segment_2"),
          o = r.mobileNet.convToOutput(a, "part_heatmap_2");
      return {
        segmentScores: n.sigmoid(),
        partHeatmapScores: o.sigmoid()
      };
    });
  }, e.prototype.estimatePersonSegmentationActivation = function (e, t, r) {
    var a = this;
    return void 0 === t && (t = 16), void 0 === r && (r = .5), assertValidOutputStride(t), (0, tf.tidy)(function () {
      var n = toInputTensor(e),
          o = resizeAndPadTo(n, segmentationModelImageDimensions),
          i = o.resizedAndPadded,
          s = o.paddedBy,
          d = a.predictForSegmentation(i, t),
          u = i.shape,
          l = u[0],
          c = u[1],
          p = n.shape;
      return toMask(scaleAndCropToInputTensorShape(d, [p[0], p[1]], [l, c], s).squeeze(), r);
    });
  }, e.prototype.estimatePersonSegmentation = function (e, t, r) {
    return void 0 === t && (t = 16), void 0 === r && (r = .5), __awaiter(this, void 0, void 0, function () {
      var a, n, o, i, s;
      return __generator(this, function (d) {
        switch (d.label) {
          case 0:
            return a = this.estimatePersonSegmentationActivation(e, t, r), n = a.shape, o = n[0], i = n[1], [4, a.data()];

          case 1:
            return s = d.sent(), a.dispose(), [2, {
              height: o,
              width: i,
              data: s
            }];
        }
      });
    });
  }, e.prototype.estimatePartSegmentationActivation = function (e, t, r) {
    var a = this;
    return void 0 === t && (t = 16), void 0 === r && (r = .5), assertValidOutputStride(t), (0, tf.tidy)(function () {
      var n = toInputTensor(e),
          o = resizeAndPadTo(n, segmentationModelImageDimensions),
          i = o.resizedAndPadded,
          s = o.paddedBy,
          d = a.predictForPartMap(i, t),
          u = d.segmentScores,
          l = d.partHeatmapScores,
          c = i.shape,
          p = c[0],
          h = c[1],
          f = n.shape,
          v = f[0],
          m = f[1],
          g = scaleAndCropToInputTensorShape(u, [v, m], [p, h], s),
          b = scaleAndCropToInputTensorShape(l, [v, m], [p, h], s);
      return decodePartSegmentation(toMask(g.squeeze(), r), b);
    });
  }, e.prototype.estimatePartSegmentation = function (e, t, r) {
    return void 0 === t && (t = 16), void 0 === r && (r = .5), __awaiter(this, void 0, void 0, function () {
      var a, n, o, i, s;
      return __generator(this, function (d) {
        switch (d.label) {
          case 0:
            return a = this.estimatePartSegmentationActivation(e, t, r), n = a.shape, o = n[0], i = n[1], [4, a.data()];

          case 1:
            return s = d.sent(), a.dispose(), [2, {
              height: o,
              width: i,
              data: s
            }];
        }
      });
    });
  }, e.prototype.dispose = function () {
    this.mobileNet.dispose();
  }, e;
}();

exports.BodyPix = BodyPix;

function load(e) {
  return void 0 === e && (e = .75), __awaiter(this, void 0, void 0, function () {
    var t, r;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (null == tf) throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this model.");
          return t = Object.keys(checkpoints), tf.util.assert("number" == typeof e, function () {
            return "got multiplier type of " + typeof e + " when it should be a number.";
          }), tf.util.assert(t.indexOf(e.toString()) >= 0, function () {
            return "invalid multiplier value of " + e + ".  No checkpoint exists for that multiplier. Must be one of " + t.join(",") + ".";
          }), [4, mobilenetLoader.load(e)];

        case 1:
          return r = a.sent(), [2, new BodyPix(r)];
      }
    });
  });
}

var mobilenetLoader = {
  load: function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var t, r, a, n;
      return __generator(this, function (o) {
        switch (o.label) {
          case 0:
            return t = checkpoints[e], r = t.url, [4, (0, _tfjsConverter.loadGraphModel)(r + "model.json")];

          case 1:
            return a = o.sent(), n = new ModelWeights(a), [2, new MobileNet(n, t.architecture)];
        }
      });
    });
  }
};

function cpuBlur(e, t, r) {
  for (var a = e.getContext("2d"), n = 0, o = 1 / (2 * Math.PI * 5 * 5), i = r < 3 ? 1 : 2, s = -r; s <= r; s += i) for (var d = -r; d <= r; d += i) {
    n += o * Math.exp(-(d * d + s * s) / 50);
  }

  for (s = -r; s <= r; s += i) for (d = -r; d <= r; d += i) a.globalAlpha = o * Math.exp(-(d * d + s * s) / 50) / n * r, a.drawImage(t, d, s);

  a.globalAlpha = 1;
}

var offScreenCanvases = {};

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function assertSameDimensions(e, t, r, a) {
  var n = e.width,
      o = e.height,
      i = t.width,
      s = t.height;
  if (n !== i || o !== s) throw new Error("error: dimensions must match. " + r + " has dimensions " + n + "x" + o + ", " + a + " has dimensions " + i + "x" + s);
}

function flipCanvasHorizontal(e) {
  var t = e.getContext("2d");
  t.scale(-1, 1), t.translate(-e.width, 0);
}

function drawWithCompositing(e, t, r) {
  e.globalCompositeOperation = r, e.drawImage(t, 0, 0);
}

function createOffScreenCanvas() {
  return document.createElement("canvas");
}

function ensureOffscreenCanvasCreated(e) {
  return offScreenCanvases[e] || (offScreenCanvases[e] = createOffScreenCanvas()), offScreenCanvases[e];
}

function drawAndBlurImageOnCanvas(e, t, r) {
  var a = e.height,
      n = e.width,
      o = r.getContext("2d");
  r.width = n, r.height = a, o.clearRect(0, 0, n, a), o.save(), isSafari() ? cpuBlur(r, e, t) : (o.filter = "blur(" + t + "px)", o.drawImage(e, 0, 0, n, a)), o.restore();
}

function drawAndBlurImageOnOffScreenCanvas(e, t, r) {
  var a = ensureOffscreenCanvasCreated(r);
  return 0 === t ? renderImageToCanvas(e, a) : drawAndBlurImageOnCanvas(e, t, a), a;
  //return drawAndBlurImageOnCanvas(e, t, a),a;
}

function renderImageToCanvas(e, t) {
  var r = e.width,
      a = e.height;
  t.width = r, t.height = a, t.getContext("2d").drawImage(e, 0, 0, r, a);
}

function renderImageDataToCanvas(e, t) {
  t.width = e.width, t.height = e.height, t.getContext("2d").putImageData(e, 0, 0);
}

function renderImageDataToOffScreenCanvas(e, t) {
  var r = ensureOffscreenCanvasCreated(t);
  return renderImageDataToCanvas(e, r), r;
}

var flag = 1;

function toMaskImageData(e, t) {
  void 0 === t && (t = !0);

  for (var r = e.width, a = e.height, n = e.data, o = new Uint8ClampedArray(r * a * 4), i = 0; i < a * r; ++i) {
    var s = 255 * (t ? 1 - n[i] : n[i]),
        d = 4 * i;
    o[d + 0] = 0, o[d + 1] = 0, o[d + 2] = 0, o[d + 3] = Math.round(s);
  }

  return new ImageData(o, r, a);
}

function toColoredPartImageData(e, t) {
  for (var r = e.width, a = e.height, n = e.data, o = new Uint8ClampedArray(r * a * 4), i = 0; i < a * r; ++i) {
    var s = Math.round(n[i]),
        d = 4 * i;
    if (-1 === s) o[d + 0] = 255, o[d + 1] = 255, o[d + 2] = 255, o[d + 3] = 255;else {
      var u = t[s];
      if (!u) throw new Error("No color could be found for part id " + s);
      o[d + 0] = u[0], o[d + 1] = u[1], o[d + 2] = u[2], o[d + 3] = 255;
    }
  }

  return new ImageData(o, r, a);
}

var CANVAS_NAMES = {
  blurred: "blurred",
  blurredMask: "blurred-mask",
  mask: "mask",
  lowresPartMask: "lowres-part-mask"
};

/*function drawMask(e, t, r, a, n, o) {
  void 0 === a && (a = .7), void 0 === n && (n = 0), void 0 === o && (o = !1), assertSameDimensions(t, r, "image", "mask");
  var i = drawAndBlurImageOnOffScreenCanvas(renderImageDataToOffScreenCanvas(r, CANVAS_NAMES.mask), n, CANVAS_NAMES.blurredMask);
  e.width = i.width, e.height = i.height;
  var s = e.getContext("2d");
  s.save(), o && flipCanvasHorizontal(e), s.drawImage(t, 0, 0);//, s.globalAlpha = a, s.drawImage(i, 0, 0);
  if(flag){
    runStreaming();
    flag = 0;
  }
  s.restore();
  updateOutputOrig();
}*/


function drawMask(canvas, image, maskImage, maskOpacity, maskBlurAmount, flipHorizontal) {
  if (maskOpacity === void 0) { maskOpacity = 0.7; }
  if (maskBlurAmount === void 0) { maskBlurAmount = 0; }
  if (flipHorizontal === void 0) { flipHorizontal = false; }
  assertSameDimensions(image, maskImage, 'image', 'mask');
  var mask = renderImageDataToOffScreenCanvas(maskImage, CANVAS_NAMES.mask);
  var blurredMask = drawAndBlurImageOnOffScreenCanvas(mask, maskBlurAmount, CANVAS_NAMES.blurredMask);
  canvas.width = blurredMask.width;
  canvas.height = blurredMask.height;
  
  var ctx = canvas.getContext('2d');
  ctx.save();
  if (!flipHorizontal) {
      flipCanvasHorizontal(canvas);
  }
  ctx.drawImage(image, 0, 0);

  ctx.globalAlpha = maskOpacity;

  ctx.drawImage(mask, 0, 0);

  var imageDraw = ctx.getImageData(0,0,canvas.width,canvas.height);
  var pixData = imageDraw.data;

  var maskData = maskImage.data;

  for (var i = 0; i < canvas.height * canvas.width; ++i) {
    var j = i*4;
    //console.log(maskData[j+3]);
    if(maskData[j+3] == 255){
      pixData[j+3] = 0;
    }
  }

  ctx.putImageData(imageDraw, 0, 0);

  if(flag){
    runStreaming();
    flag = 0;
  }
  
  //ctx.globalAlpha = maskOpacity;
  //ctx.drawImage(blurredMask, 0, 0);
  ctx.restore();
}

function drawPixelatedMask(e, t, r, a, n, o, i) {
  void 0 === a && (a = .7), void 0 === n && (n = 0), void 0 === o && (o = !1), void 0 === i && (i = 10), assertSameDimensions(t, r, "image", "mask");
  var s = drawAndBlurImageOnOffScreenCanvas(renderImageDataToOffScreenCanvas(r, CANVAS_NAMES.mask), n, CANVAS_NAMES.blurredMask);
  e.width = s.width, e.height = s.height;
  var d = e.getContext("2d");
  d.save(), o && flipCanvasHorizontal(e);
  var u = ensureOffscreenCanvasCreated(CANVAS_NAMES.lowresPartMask),
      l = u.getContext("2d");
  u.width = s.width * (1 / i), u.height = s.height * (1 / i), l.drawImage(s, 0, 0, s.width, s.height, 0, 0, u.width, u.height), d.imageSmoothingEnabled = !1, d.drawImage(u, 0, 0, u.width, u.height, 0, 0, e.width, e.height);

  for (var c = 0; c < u.width; c++) d.beginPath(), d.strokeStyle = "#ffffff", d.moveTo(i * c, 0), d.lineTo(i * c, e.height), d.stroke();

  for (c = 0; c < u.height; c++) d.beginPath(), d.strokeStyle = "#ffffff", d.moveTo(0, i * c), d.lineTo(e.width, i * c), d.stroke();

  d.globalAlpha = 1 - a, d.drawImage(t, 0, 0), d.restore();
}

function createPersonMask(e, t) {
  var r = renderImageDataToOffScreenCanvas(toMaskImageData(e, !1), CANVAS_NAMES.mask);
  return 0 === t ? r : drawAndBlurImageOnOffScreenCanvas(r, t, CANVAS_NAMES.blurredMask);
}

function drawBokehEffect(e, t, r, a, n, o) {
  void 0 === a && (a = 3), void 0 === n && (n = 3), void 0 === o && (o = !1), assertSameDimensions(t, r, "image", "segmentation");
  var i = drawAndBlurImageOnOffScreenCanvas(t, a, CANVAS_NAMES.blurred),
      s = createPersonMask(r, n),
      d = e.getContext("2d");
  d.save(), o && flipCanvasHorizontal(e), d.drawImage(t, 0, 0), drawWithCompositing(d, s, "destination-in"), drawWithCompositing(d, i, "destination-over"), d.restore();
}

var partChannels = ["leftFace", "rightFace", "rightUpperLegFront", "rightLowerLegBack", "rightUpperLegBack", "leftLowerLegFront", "leftUpperLegFront", "leftUpperLegBack", "leftLowerLegBack", "rightFeet", "rightLowerLegFront", "leftFeet", "torsoFront", "torsoBack", "rightUpperArmFront", "rightUpperArmBack", "rightLowerArmBack", "leftLowerArmFront", "leftUpperArmFront", "leftUpperArmBack", "leftLowerArmBack", "rightHand", "rightLowerArmFront", "leftHand"];
exports.partChannels = partChannels;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","@tensorflow/tfjs-converter":"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js"}],"node_modules/dat.gui/build/dat.gui.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GUI = exports.gui = exports.dom = exports.controllers = exports.color = void 0;

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function ___$insertStyle(css) {
  if (!css) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();

  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);

  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);

    while (str.length < 6) {
      str = '0' + str;
    }

    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }

  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);

      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }

      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }

    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;

      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;

      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }

      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);

      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }

    isNaN.toString = function () {
      return _isNaN.toString();
    };

    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};
var INTERPRETATIONS = [{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
}, {
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }

        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;

var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);

        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;

    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h /= 6;

    if (h < 0) {
      h += 1;
    }

    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }

    this.__state.a = this.__state.a || 1;
  }

  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();

function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }

      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }

      this.__state[component] = v;
    }
  });
}

function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }

      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }

      this.__state[component] = v;
    }
  });
}

Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};

Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });

  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};

Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }

    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }

  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;

      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }

      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }

  var match = val.match(CSS_VALUE_PIXELS);

  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }

  return 0;
}

var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;

    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }

    if (Common.isUndefined(vertical)) {
      vertical = true;
    }

    elem.style.position = 'absolute';

    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }

    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];

    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }

    var evt = document.createEvent(className);

    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }

      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }

      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }

    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }

    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }

    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);

      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }

    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);

        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }

    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = {
      left: 0,
      top: 0
    };

    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }

    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);

  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);

    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));

    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');

    _this2.__checkbox.setAttribute('type', 'checkbox');

    function onChange() {
      _this.setValue(!_this.__prev);
    }

    dom.bind(_this2.__checkbox, 'change', onChange, false);

    _this2.domElement.appendChild(_this2.__checkbox);

    _this2.updateDisplay();

    return _this2;
  }

  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');

        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }

      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);

  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);

    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));

    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');

    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }

    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);

      _this.__select.appendChild(opt);
    });

    _this2.updateDisplay();

    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;

      _this.setValue(desiredValue);
    });

    _this2.domElement.appendChild(_this2.__select);

    return _this2;
  }

  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);

  function StringController(object, property) {
    classCallCheck(this, StringController);

    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));

    var _this = _this2;

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }

      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();

  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }

  return 0;
}

var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);

  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);

    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));

    var _params = params || {};

    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;

    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }

    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }

  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;

      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }

      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }

      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);

  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);

    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));

    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;

    function onChange() {
      var attempted = parseFloat(_this.__input.value);

      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onBlur() {
      onFinish();
    }

    function onMouseDrag(e) {
      var diff = prevY - e.clientY;

      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prevY = e.clientY;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);

  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);

    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, {
      min: min,
      max: max,
      step: step
    }));

    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');

    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }

    function onMouseDrag(e) {
      e.preventDefault();

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }

      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }

    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.updateDisplay();

    _this2.__background.appendChild(_this2.__foreground);

    _this2.domElement.appendChild(_this2.__background);

    return _this2;
  }

  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);

      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);

  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);

    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));

    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();

      _this.fire();

      return false;
    });
    dom.addClass(_this2.__button, 'button');

    _this2.domElement.appendChild(_this2.__button);

    return _this2;
  }

  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }

      this.getValue().call(this.object);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);

  function ColorController(object, property) {
    classCallCheck(this, ColorController);

    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));

    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);

    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }

    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }

    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }

    function onBlur() {
      var i = interpret(this.value);

      if (i !== false) {
        _this.__color.__state = i;

        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    _this2.__saturation_field.appendChild(valueField);

    _this2.__selector.appendChild(_this2.__field_knob);

    _this2.__selector.appendChild(_this2.__saturation_field);

    _this2.__selector.appendChild(_this2.__hue_field);

    _this2.__hue_field.appendChild(_this2.__hue_knob);

    _this2.domElement.appendChild(_this2.__input);

    _this2.domElement.appendChild(_this2.__selector);

    _this2.updateDisplay();

    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__saturation_field.getBoundingClientRect();

      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__hue_field.getBoundingClientRect();

      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;

      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    return _this2;
  }

  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());

      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);

        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }

      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;

      var _flip = 255 - flip;

      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);

var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}

function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];

    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];

  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }

  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }

      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }

    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, {
        min: arguments[2],
        max: arguments[3],
        step: arguments[4]
      });
    }

    return new NumberControllerBox(object, property, {
      min: arguments[2],
      max: arguments[3]
    });
  }

  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }

  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }

  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }

  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}

var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;

    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }

  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;

      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;

      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };

      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();

var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];

var GUI = function GUI(pars) {
  var _this = this;

  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });

  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = {
      preset: DEFAULT_DEFAULT_PRESET_NAME
    };
  }

  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }

  params.resizable = Common.isUndefined(params.parent) && params.resizable;

  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }

  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }

        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }

        setPresetSelectIndex(this);

        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;

        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;

        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }

        this.onResize();

        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;

          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }

          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });

  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);

    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }

    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);

    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }

    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }

    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);

    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };

    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);

    if (!params.closed) {
      this.closed = false;
    }
  }

  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }

      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }

    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }

  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };

  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();

  if (params.resizable) {
    addResizeHandle(this);
  }

  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };

  this.saveToLocalStorageIfPossible = saveToLocalStorage;

  function resetWidth() {
    var root = _this.getRoot();

    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }

  if (!params.parent) {
    resetWidth();
  }
};

GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};

GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';

GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};

dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype, {
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);

    this.__controllers.splice(this.__controllers.indexOf(controller), 1);

    var _this = this;

    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }

    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }

    var _this = this;

    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }

    var newGuiParams = {
      name: name,
      parent: this
    };
    newGuiParams.autoPlace = this.autoPlace;

    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }

    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);

    delete this.__folders[folder.name];

    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }

    removeListeners(folder);

    var _this = this;

    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();

    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });

      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }

    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }

    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }

    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }

    var _this = this;

    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }

      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });

    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;

    while (gui.parent) {
      gui = gui.parent;
    }

    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;

    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;

      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }

      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }

    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }

    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }

    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }

      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });

    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;

    this.__listening.push(controller);

    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});

function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');

  if (newDom) {
    li.appendChild(newDom);
  }

  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }

  gui.onResize();
  return li;
}

function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);

  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}

function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];

  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}

function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }

      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);

      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);

      return controller;
    }
  });

  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, {
      min: controller.__min,
      max: controller.__max,
      step: controller.__step
    });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];

      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();

        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });

        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }

      return returned;
    };

    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }

  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }

    return val;
  }, controller.setValue);
}

function recallSavedValue(gui, controller) {
  var root = gui.getRoot();

  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);

  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];

    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }

    controllerMap[controller.property] = controller;

    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;

      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }

      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}

function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }

  var controller = void 0;

  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }

  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }

  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);

  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }

  augmentController(gui, li, controller);

  gui.__controllers.push(controller);

  return controller;
}

function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}

function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;

  gui.__preset_select.appendChild(opt);

  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}

function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}

function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');

  gui.__ul.insertBefore(div, gui.__ul.firstChild);

  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');

  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }

  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }

    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);

  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';

    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }

    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }

  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');

    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}

function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });

  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }

  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }

  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }

  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}

function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';

  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }

  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}

function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}

function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}

function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }

  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
exports.color = color;
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
exports.controllers = controllers;
var dom$1 = {
  dom: dom
};
exports.dom = dom$1;
var gui = {
  GUI: GUI
};
exports.gui = gui;
var GUI$1 = GUI;
exports.GUI = GUI$1;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};
var _default = index;
exports.default = _default;
},{}],"node_modules/stats.js/build/stats.min.js":[function(require,module,exports) {
var define;
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}],"part_color_scales.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spectral = exports.warm = exports.rainbow = void 0;

/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// color schemes generated using d3-scale-chromatic:
// https://github.com/d3/d3-scale-chromatic
const rainbow = [[110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167], [238, 67, 149], [255, 78, 125], [255, 94, 99], [255, 115, 75], [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64], [175, 240, 91], [135, 245, 87], [96, 247, 96], [64, 243, 115], [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213], [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195]];
exports.rainbow = rainbow;
const warm = [[110, 64, 170], [106, 72, 183], [100, 81, 196], [92, 91, 206], [84, 101, 214], [75, 113, 221], [66, 125, 224], [56, 138, 226], [48, 150, 224], [40, 163, 220], [33, 176, 214], [29, 188, 205], [26, 199, 194], [26, 210, 182], [28, 219, 169], [33, 227, 155], [41, 234, 141], [51, 240, 128], [64, 243, 116], [79, 246, 105], [96, 247, 97], [115, 246, 91], [134, 245, 88], [155, 243, 88]];
exports.warm = warm;
const spectral = [[158, 1, 66], [181, 26, 71], [202, 50, 74], [219, 73, 74], [232, 94, 73], [242, 117, 75], [248, 142, 83], [251, 167, 96], [253, 190, 112], [254, 210, 129], [254, 227, 149], [254, 240, 166], [251, 248, 176], [243, 249, 172], [231, 245, 163], [213, 238, 159], [190, 229, 160], [164, 218, 163], [137, 207, 165], [110, 192, 168], [86, 173, 174], [70, 150, 179], [67, 127, 180], [77, 103, 173]];
exports.spectral = spectral;
},{}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindPage = bindPage;

var bodyPix = _interopRequireWildcard(require("@tensorflow-models/body-pix"));

var _dat = _interopRequireDefault(require("dat.gui"));

var _stats = _interopRequireDefault(require("stats.js"));

var partColorScales = _interopRequireWildcard(require("./part_color_scales"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const stats = new _stats.default();
const state = {
  video: null,
  stream: null,
  net: null,
  videoConstraints: {},
  changingCamera: false,
  changingArchitecture: false
};

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function getVideoInputs() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices() not supported.');
    return [];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  return videoDevices;
}

function stopExistingVideoCapture() {
  if (state.video && state.video.srcObject) {
    state.video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    state.video.srcObject = null;
  }
}

async function getDeviceIdForLabel(cameraLabel) {
  const videoInputs = await getVideoInputs();

  for (let i = 0; i < videoInputs.length; i++) {
    const videoInput = videoInputs[i];

    if (videoInput.label === cameraLabel) {
      return videoInput.deviceId;
    }
  }

  return null;
} // on mobile, facing mode is the preferred way to select a camera.
// Here we use the camera label to determine if its the environment or
// user facing camera


function getFacingMode(cameraLabel) {
  if (!cameraLabel) {
    return 'user';
  }

  if (cameraLabel.toLowerCase().includes('back')) {
    return 'environment';
  } else {
    return 'user';
  }
}

async function getConstraints(cameraLabel) {
  let deviceId;
  let facingMode;

  if (cameraLabel) {
    deviceId = await getDeviceIdForLabel(cameraLabel); // on mobile, use the facing mode based on the camera.

    facingMode = isMobile() ? getFacingMode(cameraLabel) : null;
  }

  ;
  return {
    deviceId,
    facingMode
  };
}
/**
 * Loads a the camera to be used in the demo
 *
 */


async function setupCamera(cameraLabel) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const videoElement = document.getElementById('video');
  stopExistingVideoCapture();
  const videoConstraints = await getConstraints(cameraLabel);
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': videoConstraints
  });
  videoElement.srcObject = stream;
  return new Promise(resolve => {
    videoElement.onloadedmetadata = () => {
      videoElement.width = videoElement.videoWidth;
      videoElement.height = videoElement.videoHeight;
      resolve(videoElement);
    };
  });
}

async function loadVideo(cameraLabel) {
  try {
    state.video = await setupCamera(cameraLabel);
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' + 'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  state.video.play();
}

const guiState = {
  estimate: 'segmentation',
  camera: null,
  flipHorizontal: true,
  input: {
    mobileNetArchitecture: isMobile() ? '0.50' : '0.75',
    outputStride: 16
  },
  segmentation: {
    segmentationThreshold: 0.5,
    effect: 'mask',
    maskBackground: true,
    opacity: 0.7,
    backgroundBlurAmount: 3,
    maskBlurAmount: 0,
    edgeBlurAmount: 3
  },
  partMap: {
    colorScale: 'rainbow',
    segmentationThreshold: 0.5,
    applyPixelation: false,
    opacity: 0.9
  },
  showFps: false//!isMobile()
};

function toCameraOptions(cameras) {
  const result = {
    default: null
  };
  cameras.forEach(camera => {
    result[camera.label] = camera.label;
  });
  return result;
}
/**
 * Sets up dat.gui controller on the top-right of the window
 */


function setupGui(cameras) {
  const gui = new _dat.default.GUI({
    width: 300
  });
  gui.add(guiState, 'camera', toCameraOptions(cameras)).onChange(async function (cameraLabel) {
    state.changingCamera = true;
    await loadVideo(cameraLabel);
    state.changingCamera = false;
  });
  gui.add(guiState, 'flipHorizontal'); // Architecture: there are a few BodyPix models varying in size and
  // accuracy. 1.00 is the largest, but will be the slowest. 0.25 is the
  // fastest, but least accurate.

  gui.add(guiState.input, 'mobileNetArchitecture', ['1.00', '0.75', '0.50', '0.25']).onChange(async function (architecture) {
    state.changingArchitecture = true; // Important to purge variables and free
    // up GPU memory

    state.net.dispose(); // Load the PoseNet model weights for
    // either the 0.50, 0.75, 1.00, or 1.01
    // version

    state.net = await bodyPix.load(+architecture);
    state.changingArchitecture = false;
  }); // Output stride:  Internally, this parameter affects the height and width
  // of the layers in the neural network. The lower the value of the output
  // stride the higher the accuracy but slower the speed, the higher the value
  // the faster the speed but lower the accuracy.

  gui.add(guiState.input, 'outputStride', [8, 16, 32]);
  const estimateController = gui.add(guiState, 'estimate', ['segmentation', 'partmap']);
  let segmentation = gui.addFolder('Segmentation');
  segmentation.add(guiState.segmentation, 'segmentationThreshold', 0.0, 1.0);
  const segmentationEffectController = segmentation.add(guiState.segmentation, 'effect', ['mask', 'bokeh']);
  segmentation.open();
  let darknessLevel;
  let bokehBlurAmount;
  let edgeBlurAmount;
  let maskBlurAmount;
  let maskBackground;
  segmentationEffectController.onChange(function (effectType) {
    if (effectType === 'mask') {
      if (bokehBlurAmount) {
        bokehBlurAmount.remove();
      }

      if (edgeBlurAmount) {
        edgeBlurAmount.remove();
      }

      darknessLevel = segmentation.add(guiState.segmentation, 'opacity', 0.0, 1.0);
      maskBlurAmount = segmentation.add(guiState.segmentation, 'maskBlurAmount').min(0).max(20).step(1);
      maskBackground = segmentation.add(guiState.segmentation, 'maskBackground');
    } else if (effectType === 'bokeh') {
      if (darknessLevel) {
        darknessLevel.remove();
      }

      if (maskBlurAmount) {
        maskBlurAmount.remove();
      }

      if (maskBackground) {
        maskBackground.remove();
      }

      bokehBlurAmount = segmentation.add(guiState.segmentation, 'backgroundBlurAmount').min(1).max(20).step(1);
      edgeBlurAmount = segmentation.add(guiState.segmentation, 'edgeBlurAmount').min(0).max(20).step(1);
    }
  }); // manually set the effect so that the options are shown.

  segmentationEffectController.setValue(guiState.segmentation.effect);
  let partMap = gui.addFolder('Part Map');
  partMap.add(guiState.partMap, 'segmentationThreshold', 0.0, 1.0);
  partMap.add(guiState.partMap, 'applyPixelation');
  partMap.add(guiState.partMap, 'opacity', 0.0, 1.0);
  partMap.add(guiState.partMap, 'colorScale', Object.keys(partColorScales)).onChange(colorScale => {
    setShownPartColorScales(colorScale);
  });
  setShownPartColorScales(guiState.partMap.colorScale);
  estimateController.onChange(function (estimationType) {
    if (estimationType === 'segmentation') {
      segmentation.open();
      partMap.close();
      document.getElementById('colors').style.display = 'none';
    } else {
      segmentation.close();
      partMap.open();
      document.getElementById('colors').style.display = 'inline-block';
    }
  });
  gui.add(guiState, 'showFps').onChange(showFps => {
    if (showFps) {
      document.body.appendChild(stats.dom);
    } else {
      document.body.removeChild(stats.dom);
    }
  });
}

function setShownPartColorScales(colorScale) {
  const colors = document.getElementById('colors');
  colors.innerHTML = '';
  const partColors = partColorScales[colorScale];
  const partNames = bodyPix.partChannels;

  for (let i = 0; i < partColors.length; i++) {
    const partColor = partColors[i];
    const child = document.createElement('li');
    child.innerHTML = `
        <div class='color' style='background-color:rgb(${partColor[0]},${partColor[1]},${partColor[2]})' ></div>
        ${partNames[i]}`;
    colors.appendChild(child);
  }
}
/**
 * Sets up a frames per second panel on the top-left of the window
 */


function setupFPS() {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  if (guiState.showFps) {
    document.body.appendChild(stats.dom);
  }
}
/**
 * Feeds an image to BodyPix to estimate segmentation - this is where the
 * magic happens. This function loops with a requestAnimationFrame method.
 */


function segmentBodyInRealTime() {
  const canvas = document.getElementById('output'); // since images are being fed from a webcam

  async function bodySegmentationFrame() {
    // if changing the model or the camera, wait a second for it to complete
    // then try again.
    if (state.changingArchitecture || state.changingCamera) {
      setTimeout(bodySegmentationFrame, 1000);
      return;
    } // Begin monitoring code for frames per second


    stats.begin(); // Scale an image down to a certain factor. Too large of an image will
    // slow down the GPU

    const outputStride = +guiState.input.outputStride;
    const flipHorizontally = guiState.flipHorizontal;

    switch (guiState.estimate) {
      case 'segmentation':
        const personSegmentation = await state.net.estimatePersonSegmentation(state.video, outputStride, guiState.segmentation.segmentationThreshold);

        switch (guiState.segmentation.effect) {
          case 'mask':
            const mask = bodyPix.toMaskImageData(personSegmentation, guiState.segmentation.maskBackground);
            bodyPix.drawMask(canvas, state.video, mask, guiState.segmentation.opacity, guiState.segmentation.maskBlurAmount, flipHorizontally);
            break;

          case 'bokeh':
            bodyPix.drawBokehEffect(canvas, state.video, personSegmentation, +guiState.segmentation.backgroundBlurAmount, guiState.segmentation.edgeBlurAmount, flipHorizontally);
            break;
        }

        break;

      case 'partmap':
        const partSegmentation = await state.net.estimatePartSegmentation(state.video, outputStride, guiState.partMap.segmentationThreshold);
        const coloredPartImageData = bodyPix.toColoredPartImageData(partSegmentation, partColorScales[guiState.partMap.colorScale]);
        const maskBlurAmount = 0;

        if (guiState.partMap.applyPixelation) {
          const pixelCellWidth = 10.0;
          bodyPix.drawPixelatedMask(canvas, video, coloredPartImageData, guiState.partMap.opacity, maskBlurAmount, flipHorizontally, pixelCellWidth);
        } else {
          bodyPix.drawMask(canvas, video, coloredPartImageData, guiState.opacity, maskBlurAmount, flipHorizontally);
        }

        break;

      default:
        break;
    } // End monitoring code for frames per second


    stats.end();
    requestAnimationFrame(bodySegmentationFrame);
  }

  bodySegmentationFrame();
}
/**
 * Kicks off the demo.
 */


async function bindPage() {
  // Load the BodyPix model weights with architecture 0.75
  state.net = await bodyPix.load(+guiState.input.mobileNetArchitecture);
  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'inline-block';
  await loadVideo();
  let cameras = await getVideoInputs();
  setupFPS();
  setupGui(cameras);
  segmentBodyInRealTime();
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // kick off the demo

bindPage();
},{"@tensorflow-models/body-pix":"node_modules/@tensorflow-models/body-pix/dist/body-pix.esm.js","dat.gui":"node_modules/dat.gui/build/dat.gui.module.js","stats.js":"node_modules/stats.js/build/stats.min.js","./part_color_scales":"part_color_scales.js"}]},{},["index.js"], null)
//# sourceMappingURL=/demos.e31bb0bc.js.map