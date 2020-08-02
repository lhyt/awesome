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
})({"TNS6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getCache = exports._getSetter = exports._missingPlugin = exports._round = exports._roundModifier = exports._config = exports._ticker = exports._plugins = exports._checkPlugin = exports._replaceRandom = exports._colorStringFilter = exports._sortPropTweensByPriority = exports._forEachName = exports._removeLinkedListItem = exports._setDefaults = exports._relExp = exports._renderComplexString = exports._isUndefined = exports._isString = exports._numWithUnitExp = exports._numExp = exports._getProperty = exports.shuffle = exports.interpolate = exports.unitize = exports.pipe = exports.mapRange = exports.toArray = exports.splitColor = exports.clamp = exports.getUnit = exports.normalize = exports.snap = exports.random = exports.distribute = exports.wrapYoyo = exports.wrap = exports.Circ = exports.Expo = exports.Sine = exports.Bounce = exports.SteppedEase = exports.Back = exports.Elastic = exports.Strong = exports.Quint = exports.Quart = exports.Cubic = exports.Quad = exports.Linear = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.default = exports.gsap = exports.PropTween = exports.TweenLite = exports.TweenMax = exports.Tween = exports.TimelineLite = exports.TimelineMax = exports.Timeline = exports.Animation = exports.GSCache = void 0;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.3.4
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_parenthesesExp = /\(([^()]+)\)/i,
    //finds the string between parentheses.
_relExp = /[+-]=-?[\.\d]+/,
    _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;

  if (!_isObject(target) && !_isFunction(target)) {
    targets = [targets];
  }

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property) {
  var currentValue = target[property];
  return _isFunction(currentValue) ? target[property]() : _isUndefined(currentValue) && target.getAttribute(property) || currentValue;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _parseVars = function _parseVars(params, type, parent) {
  //reads the arguments passed to one of the key methods and figures out if the user is defining things with the OLD/legacy syntax where the duration is the 2nd parameter, and then it adjusts things accordingly and spits back the corrected vars object (with the duration added if necessary, as well as runBackwards or startAt or immediateRender). type 0 = to()/staggerTo(), 1 = from()/staggerFrom(), 2 = fromTo()/staggerFromTo()
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars;

  if (isLegacy) {
    vars.duration = params[1];
  }

  vars.parent = parent;

  if (type) {
    irVars = vars;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);

    if (type < 2) {
      vars.runBackwards = 1;
    } else {
      vars.startAt = params[varsIndex - 1]; // "from" vars
    }
  }

  return vars;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  _lazyTweens.length && _lazyRender();
  animation.render(time, suppressEvents, force);
  _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
  for (var p in defaults) {
    if (!(p in obj) && p !== "duration" && p !== "ease") {
      obj[p] = defaults[p];
    }
  }
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
    child.parent.remove(child);
  }

  child._act = 0;
},
    _uncache = function _uncache(animation) {
  var a = animation;

  while (a) {
    a._dirty = 1;
    a = a.parent;
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || child._initted && !child._dur) {
    //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _round(position + child._delay);
  child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  timeline._recent = child;
  skipChecks || _postAddChecks(timeline, child);
  return timeline;
},
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
},
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
  _initTween(tween, totalTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [totalTime, suppressEvents];
    return 1;
  }
},
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && prevRatio && !tween._start && tween._zTime > _tinyNum && !tween._dp._lock || tween._ts < 0 || tween._dp._ts < 0 ? 0 : 1,
      // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0. Also, if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0.
  repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    // in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    prevIteration = _animationCycle(tween._tTime, repeatDelay);

    if (iteration !== prevIteration) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }

  if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
    // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
    return;
  }

  if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    suppressEvents || _callback(tween, "onStart");
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);

      if (!suppressEvents) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (!child._dur && child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (!child._dur && child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache) {
  var repeat = animation._repeat,
      dur = _round(duration) || 0;
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat);

  if (animation._time > dur) {
    animation._time = dur;
    animation._tTime = Math.min(animation._tTime, animation._tDur);
  }

  !skipUncache && _uncache(animation.parent);
  animation.parent && _setEnd(animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    i = position.charAt(0);

    if (i === "<" || i === ">") {
      return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
    }

    i = position.indexOf("=");

    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }

    offset = +(position.charAt(i - 1) + position.substr(i + 1));
    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value) {
  return (value + "").substr((parseFloat(value) + "").length);
},
    clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, leaveStrings) {
  return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()

  return function (raw) {
    return Math.floor(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total || 0;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + ((value - inMin) / inRange * outRange || 0);
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      params,
      scope;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  return params ? callback.apply(scope, params) : callback.call(scope);
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  if (animation.progress() < 1) {
    _callback(animation, "onInterrupt");
  }

  return animation;
},
    _quickTween,
    _createPlugin = function _createPlugin(config) {
  config = !config.name && config["default"] || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  var name = config.name,
      isFunc = _isFunction(config),
      Plugin = name && !isFunc && config.init ? function () {
    this._props = [];
  } : config,
      //in case someone passes in an object that's not a plugin, like CustomEase
  instanceDefaults = {
    init: _emptyFunc,
    render: _renderPropTweens,
    add: _addPropTween,
    kill: _killPropTweensOf,
    modifier: _addPluginModifier,
    rawVars: 0
  },
      statics = {
    targetTest: 0,
    get: 0,
    getSetter: _getSetter,
    aliases: {},
    register: 0
  };

  _wake();

  if (config !== Plugin) {
    if (_plugins[name]) {
      return;
    }

    _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


    _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


    _plugins[Plugin.prop = name] = Plugin;

    if (config.targetTest) {
      _harnessPlugins.push(Plugin);

      _reservedProps[name] = 1;
    }

    name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
  }

  _addGlobal(name, Plugin);

  if (config.register) {
    config.register(gsap, Plugin, PropTween);
  }
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    _hue = function _hue(h, m1, m2) {
  h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length === 4) {
        //for shorthand like #9F0
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b;
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;

        if (a.length > 3) {
          a[3] *= 1; //cast as number
        }

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch;

    if (elapsed > _lagThreshold) {
      _startTime += elapsed - _adjustedLag;
    }

    _lastUpdate += elapsed;
    _self.time = (_lastUpdate - _startTime) / 1000;
    overlap = _self.time - _nextTime;

    if (overlap > 0 || manual) {
      _self.frame++;
      _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
      dispatch = 1;
    }

    manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

    dispatch && _listeners.forEach(function (l) {
      return l(_self.time, elapsed, _self.frame, v);
    });
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _raf = _win.requestAnimationFrame;
        }

        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    },
    fps: function fps(_fps) {
      _gap = 1 / (_fps || 240);
      _nextTime = _self.time + _gap;
    },
    add: function add(callback) {
      _listeners.indexOf(callback) < 0 && _listeners.push(callback);

      _wake();
    },
    remove: function remove(callback) {
      var i;
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1);
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
_propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
  var child = timeline._first,
      ease;

  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }

    child = child._next;
  }
},
    _parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


exports._ticker = _ticker;
exports._colorStringFilter = _colorStringFilter;
exports.splitColor = splitColor;
exports.interpolate = interpolate;
exports.mapRange = mapRange;
exports._replaceRandom = _replaceRandom;
exports.wrapYoyo = wrapYoyo;
exports.wrap = wrap;
exports.normalize = normalize;
exports.unitize = unitize;
exports.pipe = pipe;
exports.random = random;
exports.snap = snap;
exports._roundModifier = _roundModifier;
exports.distribute = distribute;
exports.shuffle = shuffle;
exports.toArray = toArray;
exports.clamp = clamp;
exports.getUnit = getUnit;
exports._removeLinkedListItem = _removeLinkedListItem;
exports._setDefaults = _setDefaults;
exports._round = _round;
exports._forEachName = _forEachName;
exports._getProperty = _getProperty;
exports._getCache = _getCache;
exports._plugins = _plugins;
exports._missingPlugin = _missingPlugin;
exports._relExp = _relExp;
exports._numWithUnitExp = _numWithUnitExp;
exports._numExp = _numExp;
exports._isUndefined = _isUndefined;
exports._isString = _isString;
exports._config = _config;

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */


exports.GSCache = GSCache;

var Animation = /*#__PURE__*/function () {
  function Animation(vars, time) {
    var parent = vars.parent || _globalTimeline;
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat || 0) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = 1;

    _setDuration(this, +vars.duration, 1);

    this.data = vars.data;
    _tickerActive || _ticker.wake();
    parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
    vars.reversed && this.reverse();
    vars.paused && this.paused(true);
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this.parent || this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      // if (!parent._dp && parent._time === parent._dur) { // if a root timeline completes...and then a while later one of its children resumes, we must shoot the playhead forward to where it should be raw-wise, otherwise the child will jump to the end. Down side: this assumes it's using the _ticker.time as a reference.
      // 	parent._time = _ticker.time - parent._start;
      // }
      this._start = _round(parent._time - (this._ts > 0 ? _totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - _totalTime) / -this._ts));

      _setEnd(this);

      parent._dirty || _uncache(parent); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted) {
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause

      _lazySafeRender(this, _totalTime, suppressEvents);
    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;

  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }

    if (this._rts === value) {
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    return _recacheAncestors(this.totalTime(_clamp(0, this._tDur, tTime), true));
  };

  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }

    if (this._ps !== value) {
      this._ps = value;

      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();

        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detatched parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  } // globalTime(rawTime) {
  // 	let animation = this,
  // 		time = arguments.length ? rawTime : animation.rawTime();
  // 	while (animation) {
  // 		time = animation._start + time / (animation._ts || 1);
  // 		animation = animation.parent;
  // 	}
  // 	return time;
  // }
  ;

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      this._rDelay = value;
      return _onUpdateTotalDuration(this);
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };

  _proto.play = function play(from, suppressEvents) {
    if (from != null) {
      this.seek(from, suppressEvents);
    }

    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    if (from != null) {
      this.seek(from || this.totalDuration(), suppressEvents);
    }

    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    if (atTime != null) {
      this.seek(atTime, suppressEvents);
    }

    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      if (!!value !== this.reversed()) {
        this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.
      }

      return this;
    }

    return this._rts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive(hasStarted) {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && (this._initted || !hasStarted) && parent.isActive(hasStarted) && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;

        if (params) {
          vars[type + "Params"] = params;
        }

        if (type === "onUpdate") {
          this._onUpdate = callback;
        }
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

exports.Animation = Animation;

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, time) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars, time) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (time > dur || tDur === tTime) {
          time = dur;
        }

        iteration = ~~(tTime / cycleDuration);

        if (iteration && iteration === tTime / cycleDuration) {
          time = dur;
          iteration--;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://greensock.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);

          if (iteration < prevIteration) {
            rewinding = !rewinding;
          }

          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;

          if (!suppressEvents && this.parent) {
            _callback(this, "onRepeat");
          }

          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime !== this._time || prevPaused !== !this._ts) {
            return this;
          }

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur + 0.0001 : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.


          _propagateYoyoEase(this, isYoyo);
        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
      }

      if (!prevTime && time && !suppressEvents) {
        _callback(this, "onStart");
      }

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    if (!_isNumber(position)) {
      position = _parsePosition(this, position);
    }

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return _uncache(this);
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this.parent && !this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive(onlyActive === "started"))) {
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  };

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        tween = Tween.to(tl, _setDefaults(vars, {
      ease: "none",
      lazy: false,
      time: endTime,
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        var duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
        tween._dur !== duration && _setDuration(tween, duration).render(tween._time, true, true);
        _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
      }
    }));

    return tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate() {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate();
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._time = this._tTime = this._pTime = 0;

    if (includeLabels) {
      this.labels = {};
    }

    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        end,
        start,
        parent;

    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }

        end = _setEnd(child);

        if (end > max && child._ts) {
          max = end;
        }

        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        child || _ticker.sleep();
      }
    }
  };

  return Timeline;
}(Animation);

exports.TimelineLite = exports.TimelineMax = exports.Timeline = Timeline;

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
    }
  }

  if (parsedStart !== end) {
    if (!isNaN(parsedStart + end)) {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  if (_isFunction(vars)) {
    vars = _parseFuncOrString(vars, tween, index, target, targets);
  }

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_initTween = function _initTween(tween, time) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
      autoOverwrite = tween._overwrite === "auto",
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  if (!tl) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    cleanVars = _copyExcluding(vars, _reservedProps);
    prevStartAt && prevStartAt.render(-1, true).kill();

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate,
        onUpdateParams: onUpdateParams,
        callbackScope: callbackScope,
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      if (immediateRender) {
        if (time > 0) {
          !autoRevert && (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
        } else if (dur) {
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (prevStartAt) {
        !autoRevert && (tween._startAt = 0);
      } else {
        time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})

        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

        _removeFromParent(tween._startAt = Tween.set(targets, p));

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    tween._pt = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        plugin.priority && (hasPriority = 1);
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, "started"); //Also make sure the overwriting doesn't overwrite THIS tween!!!


        _overwritingTween = 0;
      }

      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }

    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  tween._onUpdate = onUpdate;
  tween._initted = !!tween.parent; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
    _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


exports._checkPlugin = _checkPlugin;

var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, time, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      time.duration = vars;
      vars = time;
      time = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        scrollTrigger = _this3$vars.scrollTrigger,
        yoyoEase = _this3$vars.yoyoEase,
        parent = _this3.parent,
        parsedTargets = (_isArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {}
      });
      tl.kill();
      tl.parent = _assertThisInitialized(_this3);

      if (keyframes) {
        _setDefaults(tl.vars.defaults, {
          ease: "none"
        });

        keyframes.forEach(function (frame) {
          return tl.to(parsedTargets, frame, ">");
        });
      } else {
        l = parsedTargets.length;
        staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = {};

          for (p in vars) {
            if (_staggerPropsToSkip.indexOf(p) < 0) {
              copy[p] = vars[p];
            }
          }

          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
        }

        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    parent && _postAddChecks(parent, _assertThisInitialized(_this3));

    if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay)); //in case delay is negative

    }

    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;
        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (time > dur || tDur === tTime) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          time = dur;
        }

        iteration = ~~(tTime / cycleDuration);

        if (iteration && iteration === tTime / cycleDuration) {
          time = dur;
          iteration--;
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          return this;
        }

        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted) {
        if (_attemptInitTween(this, time, force, suppressEvents)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }

        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      time && !prevTime && !suppressEvents && _callback(this, "onStart");
      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        if (totalTime < 0 && this._startAt) {
          this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        }

        _callback(this, "onUpdate");
      }

      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate() {
    this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate();
    return _Animation2.prototype.invalidate.call(this);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = 0;

      if (this.parent) {
        return _interrupt(this);
      }
    }

    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweenng, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return new Tween(targets, _parseVars(arguments, 1));
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return new Tween(targets, _parseVars(arguments, 2));
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

exports.TweenLite = exports.TweenMax = exports.Tween = Tween;

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property) {
      pt.modifier(modifier, tween, target);
    }

    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


exports._sortPropTweensByPriority = _sortPropTweensByPriority;
exports._renderComplexString = _renderComplexString;
exports._getSetter = _getSetter;

var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks


exports.PropTween = PropTween;

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    if (_isString(target)) {
      //in case selector text or an array is passed in
      target = toArray(target)[0];
    }

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    if (unit === "native") {
      unit = "";
    }

    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        p = cache.harness && (cache.harness.aliases || {})[property] || property,
        // in case it's an alias, like "rotate" for "rotation".
    setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);

    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    if (value && value.ease) {
      value.ease = _parseEase(value.ease, _defaults.ease);
    }

    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref) {
    var name = _ref.name,
        effect = _ref.effect,
        plugins = _ref.plugins,
        defaults = _ref.defaults,
        extendTimeline = _ref.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt;

    for (p in vars) {
      pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
      pt && (pt.op = p); //this.add(target, "setAttribute", (target.getAttribute((p in target.dataset ? (p = "data-" + p) : p)) || 0) + "", vars[p], index, targets, 0, 0, p);

      this._props.push(p);
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i]);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.


exports.default = exports.gsap = gsap;
Tween.version = Timeline.version = gsap.version = "3.3.4";
_coreReady = 1;

if (_windowExists()) {
  _wake();
}

var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
exports.Circ = Circ;
exports.Expo = Expo;
exports.Sine = Sine;
exports.Bounce = Bounce;
exports.SteppedEase = SteppedEase;
exports.Back = Back;
exports.Elastic = Elastic;
exports.Strong = Strong;
exports.Quint = Quint;
exports.Quart = Quart;
exports.Cubic = Cubic;
exports.Quad = Quad;
exports.Linear = Linear;
exports.Power4 = Power4;
exports.Power3 = Power3;
exports.Power2 = Power2;
exports.Power1 = Power1;
exports.Power0 = Power0;
},{}],"bp4Z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrefix = exports._createElement = exports._getBBox = exports.default = exports.CSSPlugin = void 0;

var _gsapCore = require("./gsap-core.js");

/*!
 * CSSPlugin 3.3.4
 * https://greensock.com
 *
 * Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _win,
    _doc,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _tempDivStyler,
    _recentSetterPlugin,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum = 1e8,
    _capsExp = /([A-Z])/g,
    _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
},
    _renderCSSProp = function _renderCSSProp(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
},
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
_renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
},
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
},
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
},
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
  return target.style[property] = value;
},
    _setterCSSProp = function _setterCSSProp(target, property, value) {
  return target.style.setProperty(property, value);
},
    _setterTransform = function _setterTransform(target, property, value) {
  return target._gsap[property] = value;
},
    _setterScale = function _setterScale(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
},
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
},
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
},
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _supports3D,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
},
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
  var e = element || _tempDiv,
      s = e.style,
      i = 5;

  if (property in s && !preferPrefix) {
    return property;
  }

  property = property.charAt(0).toUpperCase() + property.substr(1);

  while (i-- && !(_prefixes[i] + property in s)) {}

  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
},
    _initCore = function _initCore() {
  if (_windowExists() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _tempDivStyler = _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _checkPropPrefix(_transformOriginProp);
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

    _supports3D = !!_checkPropPrefix("perspective");
    _pluginInitted = 1;
  }
},
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
  //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
  var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;

  _docElement.appendChild(svg);

  svg.appendChild(this);
  this.style.display = "block";

  if (swapIfPossible) {
    try {
      bbox = this.getBBox();
      this._gsapBBox = this.getBBox; //store the original

      this.getBBox = _getBBoxHack;
    } catch (e) {}
  } else if (this._gsapBBox) {
    bbox = this._gsapBBox();
  }

  if (oldParent) {
    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }
  }

  _docElement.removeChild(svg);

  this.style.cssText = oldCSS;
  return bbox;
},
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
  var i = attributesArray.length;

  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
},
    _getBBox = function _getBBox(target) {
  var bounds;

  try {
    bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
  } catch (error) {
    bounds = _getBBoxHack.call(target, true);
  }

  bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
},
    _isSVG = function _isSVG(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
},
    //reports if the element is an SVG on which getBBox() actually works
_removeProperty = function _removeProperty(target, property) {
  if (property) {
    var style = target.style;

    if (property in _transformProps) {
      property = _transformProp;
    }

    if (style.removeProperty) {
      if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
        //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
        property = "-" + property;
      }

      style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
      style.removeAttribute(property);
    }
  }
},
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;

  plugin._props.push(property);

  return pt;
},
    _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
},
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
_convertToUnit = function _convertToUnit(target, property, value, unit) {
  var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
  style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;

  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }

  curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);

  if (toPercent && (_transformProps[property] || ~property.indexOf("adius"))) {
    //transforms and borderRadius are relative to the size of the element itself!
    return (0, _gsapCore._round)(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
  }

  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }

  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }

  cache = parent._gsap;

  if (cache && toPercent && cache.width && horizontal && cache.time === _gsapCore._ticker.time) {
    return (0, _gsapCore._round)(curValue / cache.width * amount);
  } else {
    (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
    parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

    parent.appendChild(_tempDiv);
    px = _tempDiv[measureProperty];
    parent.removeChild(_tempDiv);
    style.position = "absolute";

    if (horizontal && toPercent) {
      cache = (0, _gsapCore._getCache)(parent);
      cache.time = _gsapCore._ticker.time;
      cache.width = parent[measureProperty];
    }
  }

  return (0, _gsapCore._round)(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
},
    _get = function _get(target, property, unit, uncache) {
  var value;

  if (!_pluginInitted) {
    _initCore();
  }

  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];

    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }

  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];

    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0, _gsapCore._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
    }
  }

  return unit && !~(value + "").indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
},
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
  //note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  if (!start || start === "none") {
    // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://greensock.com/forums/topic/18310-clippath-doesnt-work-on-ios/
    var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);

    if (s && s !== start) {
      prop = p;
      start = s;
    }
  }

  var pt = new _gsapCore.PropTween(this._pt, target.style, prop, 0, 1, _gsapCore._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      relative,
      endValues;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (end === "auto") {
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    target.style[prop] = start;
  }

  a = [start, end];
  (0, _gsapCore._colorStringFilter)(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

  start = a[0];
  end = a[1];
  startValues = start.match(_gsapCore._numWithUnitExp) || [];
  endValues = end.match(_gsapCore._numWithUnitExp) || [];

  if (endValues.length) {
    while (result = _gsapCore._numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }

      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _gsapCore._numWithUnitExp.lastIndex - endUnit.length;

        if (!endUnit) {
          //if something like "perspective:300" is passed in and we must add a unit to the end
          endUnit = endUnit || _gsapCore._config.units[prop] || startUnit;

          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }

        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        } //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.


        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: relative ? relative * endNum : endNum - startNum,
          m: color && color < 4 ? Math.round : 0
        };
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }

  if (_gsapCore._relExp.test(end)) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
},
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
  var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";

  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    //the user provided them in the wrong order, so flip them
    value = x;
    x = y;
    y = value;
  }

  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
},
    _renderClearProps = function _renderClearProps(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;

    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;

      while (--i > -1) {
        prop = props[i];

        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }

        _removeProperty(target, prop);
      }
    }

    if (clearTransforms) {
      _removeProperty(target, _transformProp);

      if (cache) {
        cache.svg && target.removeAttribute("transform");

        _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.


        cache.uncache = 1;
      }
    }
  }
},
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
_specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;

      plugin._props.push(property);

      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */

},

/*
 * --------------------------------------------------------------------------------------
 * TRANSFORMS
 * --------------------------------------------------------------------------------------
 */
_identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
},
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
  var matrixString = _getComputedProperty(target, _transformProp);

  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsapCore._numExp).map(_gsapCore._round);
},
    _getMatrix = function _getMatrix(target, force2D) {
  var cache = target._gsap || (0, _gsapCore._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;

  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;

    if (!parent || !target.offsetParent) {
      // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375
      addedToDOM = 1; //flag

      nextSibling = target.nextSibling;

      _docElement.appendChild(target); //we must add it to the DOM in order to get values properly

    }

    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");

    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }

  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
},
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;

  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }

  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }

  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }

  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
},
    _parseTransform = function _parseTransform(target, uncache) {
  var cache = target._gsap || new _gsapCore.GSCache(target);

  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }

  var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  matrix = _getMatrix(target, cache.svg);

  if (cache.svg) {
    t1 = !cache.uncache && target.getAttribute("data-svg-origin");

    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }

  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;

  if (matrix !== _identity2DMatrix) {
    a = matrix[0]; //a11

    b = matrix[1]; //a21

    c = matrix[2]; //a31

    d = matrix[3]; //a41

    x = a12 = matrix[4];
    y = a22 = matrix[5]; //2D matrix

    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));

      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      } //3D matrix

    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG; //rotationX

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      } //rotationY


      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      } //rotationZ


      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }

      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }

      scaleX = (0, _gsapCore._round)(Math.sqrt(a * a + b * b + c * c));
      scaleY = (0, _gsapCore._round)(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }

    if (cache.svg) {
      //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }

  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }

  cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
  cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
  cache.z = z + px;
  cache.scaleX = (0, _gsapCore._round)(scaleX);
  cache.scaleY = (0, _gsapCore._round)(scaleY);
  cache.rotation = (0, _gsapCore._round)(rotation) + deg;
  cache.rotationX = (0, _gsapCore._round)(rotationX) + deg;
  cache.rotationY = (0, _gsapCore._round)(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;

  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }

  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _gsapCore._config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
},
    _firstTwoOnly = function _firstTwoOnly(value) {
  return (value = value.split(" "))[0] + " " + value[1];
},
    //for handling transformOrigin values, stripping out the 3rd dimension
_addPxTranslate = function _addPxTranslate(target, start, value) {
  var unit = (0, _gsapCore.getUnit)(start);
  return (0, _gsapCore._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
},
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;

  _renderCSSTransforms(ratio, cache);
},
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
  var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)


  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;

    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }

  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }

  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }

  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }

  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }

  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }

  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }

  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }

  target.style[_transformProp] = transforms || "translate(0, 0)";
},
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
  var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;

  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);

  if (skewY) {
    //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }

  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;

    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;

      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }

    a11 = (0, _gsapCore._round)(a11);
    a21 = (0, _gsapCore._round)(a21);
    a12 = (0, _gsapCore._round)(a12);
    a22 = (0, _gsapCore._round)(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }

  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }

  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = (0, _gsapCore._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = (0, _gsapCore._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }

  if (xPercent || yPercent) {
    //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
    temp = target.getBBox();
    tx = (0, _gsapCore._round)(tx + xPercent / 100 * temp.width);
    ty = (0, _gsapCore._round)(ty + yPercent / 100 * temp.height);
  }

  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);

  if (forceCSS) {
    //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the  transform attribute changes!)
    target.style[_transformProp] = temp;
  }
},
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
  var cap = 360,
      isString = (0, _gsapCore._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = relative ? endNum * relative : endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;

  if (isString) {
    direction = endValue.split("_")[1];

    if (direction === "short") {
      change %= cap;

      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }

    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }

  plugin._pt = pt = new _gsapCore.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";

  plugin._props.push(property);

  return pt;
},
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
  //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
  var style = _tempDivStyler.style,
      startCache = target._gsap,
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
  style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;"; //%-based translations will fail unless we set the width/height to match the original target (and padding/borders can affect it)

  style[_transformProp] = transforms;

  _doc.body.appendChild(_tempDivStyler);

  endCache = _parseTransform(_tempDivStyler, 1);

  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];

    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
      startUnit = (0, _gsapCore.getUnit)(startValue);
      endUnit = (0, _gsapCore.getUnit)(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new _gsapCore.PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;

      plugin._props.push(p);
    }
  }

  _doc.body.removeChild(_tempDivStyler);
}; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.


exports._getBBox = _getBBox;
exports.checkPrefix = _checkPropPrefix;
exports._createElement = _createElement;
(0, _gsapCore._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
    return index < 2 ? name + side : "border" + side + name;
  });

  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;

    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }

    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
        style = target.style,
        startValue,
        endValue,
        endNum,
        startNum,
        type,
        specialProp,
        p,
        startUnit,
        endUnit,
        relative,
        isTransformRelated,
        transformPropTween,
        cache,
        smooth,
        hasPriority;

    if (!_pluginInitted) {
      _initCore();
    }

    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }

      endValue = vars[p];

      if (_gsapCore._plugins[p] && (0, _gsapCore._checkPlugin)(p, vars, tween, index, target, targets)) {
        //plugins
        continue;
      }

      type = typeof endValue;
      specialProp = _specialProps[p];

      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }

      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0, _gsapCore._replaceRandom)(endValue);
      }

      if (specialProp) {
        if (specialProp(this, target, p, endValue, tween)) {
          hasPriority = 1;
        }
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
      } else {
        startValue = _get(target, p);
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);

        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }

            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }

          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];

            if (~p.indexOf(",")) {
              p = p.split(",")[0];
            }
          }
        }

        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform || _parseTransform(target); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsapCore.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }

          if (p === "scale") {
            this._pt = new _gsapCore.PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              if (endUnit !== cache.zOrigin) {
                _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
              }

              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }

            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);

            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);

            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }

        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (endValue + "").substr((endNum + "").length) || (p in _gsapCore._config.units ? _gsapCore._config.units[p] : startUnit);

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, p, startValue, endUnit);
          }

          this._pt = new _gsapCore.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;

          if (startUnit !== endUnit) {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, target[p], endValue, index, targets);
          } else {
            (0, _gsapCore._missingPlugin)(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, endValue);
        }

        props.push(p);
      }
    }

    if (hasPriority) {
      (0, _gsapCore._sortPropTweensByPriority)(this);
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0, _gsapCore._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0, _gsapCore._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
exports.default = exports.CSSPlugin = CSSPlugin;
_gsapCore.gsap.utils.checkPrefix = _checkPropPrefix;

(function (positionAndScale, rotation, others, aliases) {
  var all = (0, _gsapCore._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });
  (0, _gsapCore._forEachName)(rotation, function (name) {
    _gsapCore._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  (0, _gsapCore._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

(0, _gsapCore._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsapCore._config.units[name] = "px";
});

_gsapCore.gsap.registerPlugin(CSSPlugin);
},{"./gsap-core.js":"TNS6"}],"TpQl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Power0", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power0;
  }
});
Object.defineProperty(exports, "Power1", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power1;
  }
});
Object.defineProperty(exports, "Power2", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power2;
  }
});
Object.defineProperty(exports, "Power3", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power3;
  }
});
Object.defineProperty(exports, "Power4", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power4;
  }
});
Object.defineProperty(exports, "Linear", {
  enumerable: true,
  get: function () {
    return _gsapCore.Linear;
  }
});
Object.defineProperty(exports, "Quad", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quad;
  }
});
Object.defineProperty(exports, "Cubic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Cubic;
  }
});
Object.defineProperty(exports, "Quart", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quart;
  }
});
Object.defineProperty(exports, "Quint", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quint;
  }
});
Object.defineProperty(exports, "Strong", {
  enumerable: true,
  get: function () {
    return _gsapCore.Strong;
  }
});
Object.defineProperty(exports, "Elastic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Elastic;
  }
});
Object.defineProperty(exports, "Back", {
  enumerable: true,
  get: function () {
    return _gsapCore.Back;
  }
});
Object.defineProperty(exports, "SteppedEase", {
  enumerable: true,
  get: function () {
    return _gsapCore.SteppedEase;
  }
});
Object.defineProperty(exports, "Bounce", {
  enumerable: true,
  get: function () {
    return _gsapCore.Bounce;
  }
});
Object.defineProperty(exports, "Sine", {
  enumerable: true,
  get: function () {
    return _gsapCore.Sine;
  }
});
Object.defineProperty(exports, "Expo", {
  enumerable: true,
  get: function () {
    return _gsapCore.Expo;
  }
});
Object.defineProperty(exports, "Circ", {
  enumerable: true,
  get: function () {
    return _gsapCore.Circ;
  }
});
Object.defineProperty(exports, "TweenLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TweenLite;
  }
});
Object.defineProperty(exports, "TimelineLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineLite;
  }
});
Object.defineProperty(exports, "TimelineMax", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineMax;
  }
});
Object.defineProperty(exports, "CSSPlugin", {
  enumerable: true,
  get: function () {
    return _CSSPlugin.CSSPlugin;
  }
});
exports.TweenMax = exports.default = exports.gsap = void 0;

var _gsapCore = require("./gsap-core.js");

var _CSSPlugin = require("./CSSPlugin.js");

var gsapWithCSS = _gsapCore.gsap.registerPlugin(_CSSPlugin.CSSPlugin) || _gsapCore.gsap,
    // to protect from tree shaking
TweenMaxWithCSS = gsapWithCSS.core.Tween;

exports.TweenMax = TweenMaxWithCSS;
exports.default = exports.gsap = gsapWithCSS;
},{"./gsap-core.js":"TNS6","./CSSPlugin.js":"bp4Z"}],"MgTz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMousePos = exports.clamp = exports.lerp = exports.map = void 0;

// Map number x from range [a, b] to [c, d]
var map = function map(x, a, b, c, d) {
  return (x - a) * (d - c) / (b - a) + c;
}; // Linear interpolation


exports.map = map;

var lerp = function lerp(a, b, n) {
  return (1 - n) * a + n * b;
};

exports.lerp = lerp;

var clamp = function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}; // Gets the mouse position


exports.clamp = clamp;

var getMousePos = function getMousePos(e) {
  var posx = 0;
  var posy = 0;
  if (!e) e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  };
};

exports.getMousePos = getMousePos;
},{}],"LMRJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = require("gsap");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Track the mouse position
var mouse = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', function (ev) {
  return mouse = (0, _utils.getMousePos)(ev);
});

var Cursor = /*#__PURE__*/function () {
  function Cursor(el) {
    var _this = this;

    _classCallCheck(this, Cursor);

    this.DOM = {
      el: el
    };
    this.DOM.el.style.opacity = 0;
    this.bounds = this.DOM.el.getBoundingClientRect();
    this.renderedStyles = {
      tx: {
        previous: 0,
        current: 0,
        amt: 0.2
      },
      ty: {
        previous: 0,
        current: 0,
        amt: 0.2
      }
    };

    this.onMouseMoveEv = function () {
      _this.renderedStyles.tx.previous = _this.renderedStyles.tx.current = mouse.x - _this.bounds.width / 2;
      _this.renderedStyles.ty.previous = _this.renderedStyles.ty.previous = mouse.y - _this.bounds.height / 2;

      _gsap.gsap.to(_this.DOM.el, {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      });

      requestAnimationFrame(function () {
        return _this.render();
      });
      window.removeEventListener('mousemove', _this.onMouseMoveEv);
    };

    window.addEventListener('mousemove', this.onMouseMoveEv);
  }

  _createClass(Cursor, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      this.renderedStyles['tx'].current = mouse.x - this.bounds.width / 2;
      this.renderedStyles['ty'].current = mouse.y - this.bounds.height / 2;

      for (var key in this.renderedStyles) {
        this.renderedStyles[key].previous = (0, _utils.lerp)(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
      }

      this.DOM.el.style.transform = "translateX(".concat(this.renderedStyles['tx'].previous, "px) translateY(").concat(this.renderedStyles['ty'].previous, "px)");
      requestAnimationFrame(function () {
        return _this2.render();
      });
    }
  }]);

  return Cursor;
}();

exports.default = Cursor;
},{"gsap":"TpQl","./utils":"MgTz"}],"BQvw":[function(require,module,exports) {
var define;
var global = arguments[3];
/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));

},{}],"lc7f":[function(require,module,exports) {
var define;
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EvEmitter
    );
  }

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
function makeArray( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  var queryElem = elem;
  if ( typeof elem == 'string' ) {
    queryElem = document.querySelectorAll( elem );
  }
  // bail if bad element
  if ( !queryElem ) {
    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
    return;
  }

  this.elements = makeArray( queryElem );
  this.options = extend( {}, this.options );
  // shift arguments if no options set
  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( this.check.bind( this ) );
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  // check for non-zero, non-undefined naturalWidth
  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
  return this.img.complete && this.img.naturalWidth;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});

},{"ev-emitter":"BQvw"}],"BeZ8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloader = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var imagesLoaded = require('imagesloaded');

var body = document.body;

var preloader = function preloader(selector) {
  return new Promise(function (resolve) {
    var imgwrap = document.createElement('div');
    imgwrap.style.visibility = 'hidden';
    body.appendChild(imgwrap);

    _toConsumableArray(document.querySelectorAll(selector)).forEach(function (el) {
      var imgEl = document.createElement('img');
      imgEl.style.width = 0;
      imgEl.src = el.dataset.img;
      imgEl.className = 'preload';
      imgwrap.appendChild(imgEl);
    });

    imagesLoaded(document.querySelectorAll('.preload'), function () {
      imgwrap.parentNode.removeChild(imgwrap);
      body.classList.remove('loading');
      resolve();
    });
  });
};

exports.preloader = preloader;
},{"imagesloaded":"lc7f"}],"ez7q":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* locomotive-scroll v3.5.4 | MIT License | https://github.com/locomotivemtl/locomotive-scroll */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var defaults = {
  el: document,
  elMobile: document,
  name: 'scroll',
  offset: [0, 0],
  repeat: false,
  smooth: false,
  smoothMobile: false,
  direction: 'vertical',
  lerp: 0.1,
  "class": 'is-inview',
  scrollbarClass: 'c-scrollbar',
  scrollingClass: 'has-scroll-scrolling',
  draggingClass: 'has-scroll-dragging',
  smoothClass: 'has-scroll-smooth',
  initClass: 'has-scroll-init',
  getSpeed: false,
  getDirection: false,
  multiplier: 1,
  firefoxMultiplier: 50,
  touchMultiplier: 2,
  scrollFromAnywhere: false
};

var _default = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    Object.assign(this, defaults, options);
    this.namespace = 'locomotive';
    this.html = document.documentElement;
    this.windowHeight = window.innerHeight;
    this.windowMiddle = this.windowHeight / 2;
    this.els = [];
    this.listeners = {};
    this.hasScrollTicking = false;
    this.hasCallEventSet = false;
    this.checkScroll = this.checkScroll.bind(this);
    this.checkResize = this.checkResize.bind(this);
    this.checkEvent = this.checkEvent.bind(this);
    this.instance = {
      scroll: {
        x: 0,
        y: 0
      },
      limit: this.html.offsetHeight
    };

    if (this.getDirection) {
      this.instance.direction = null;
    }

    if (this.getDirection) {
      this.instance.speed = 0;
    }

    this.html.classList.add(this.initClass);
    window.addEventListener('resize', this.checkResize, false);
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      this.initEvents();
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      this.dispatchScroll();
    }
  }, {
    key: "checkResize",
    value: function checkResize() {
      var _this = this;

      if (!this.resizeTick) {
        this.resizeTick = true;
        requestAnimationFrame(function () {
          _this.resize();

          _this.resizeTick = false;
        });
      }
    }
  }, {
    key: "resize",
    value: function resize() {}
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;

      this.scrollToEls = this.el.querySelectorAll("[data-".concat(this.name, "-to]"));
      this.setScrollTo = this.setScrollTo.bind(this);
      this.scrollToEls.forEach(function (el) {
        el.addEventListener('click', _this2.setScrollTo, false);
      });
    }
  }, {
    key: "setScrollTo",
    value: function setScrollTo(event) {
      event.preventDefault();
      this.scrollTo(event.currentTarget.getAttribute("data-".concat(this.name, "-href")) || event.currentTarget.getAttribute('href'), event.currentTarget.getAttribute("data-".concat(this.name, "-offset")));
    }
  }, {
    key: "addElements",
    value: function addElements() {}
  }, {
    key: "detectElements",
    value: function detectElements(hasCallEventSet) {
      var _this3 = this;

      var scrollTop = this.instance.scroll.y;
      var scrollBottom = scrollTop + this.windowHeight;
      this.els.forEach(function (el, i) {
        if (el && (!el.inView || hasCallEventSet)) {
          if (scrollBottom >= el.top && scrollTop < el.bottom) {
            _this3.setInView(el, i);
          }
        }

        if (el && el.inView) {
          if (scrollBottom < el.top || scrollTop > el.bottom) {
            _this3.setOutOfView(el, i);
          }
        }
      });
      this.els = this.els.filter(function (current, i) {
        return current !== null;
      });
      this.hasScrollTicking = false;
    }
  }, {
    key: "setInView",
    value: function setInView(current, i) {
      this.els[i].inView = true;
      current.el.classList.add(current["class"]);

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'enter');

        if (!current.repeat) {
          this.els[i].call = false;
        }
      }

      if (!current.repeat && !current.speed && !current.sticky) {
        if (!current.call || current.call && this.hasCallEventSet) {
          this.els[i] = null;
        }
      }
    }
  }, {
    key: "setOutOfView",
    value: function setOutOfView(current, i) {
      if (current.repeat || current.speed !== undefined) {
        this.els[i].inView = false;
      }

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'exit');
      }

      if (current.repeat) {
        current.el.classList.remove(current["class"]);
      }
    }
  }, {
    key: "dispatchCall",
    value: function dispatchCall(current, way) {
      this.callWay = way;
      this.callValue = current.call.split(',').map(function (item) {
        return item.trim();
      });
      this.callObj = current;
      if (this.callValue.length == 1) this.callValue = this.callValue[0];
      var callEvent = new Event(this.namespace + 'call');
      this.el.dispatchEvent(callEvent);
    }
  }, {
    key: "dispatchScroll",
    value: function dispatchScroll() {
      var scrollEvent = new Event(this.namespace + 'scroll');
      this.el.dispatchEvent(scrollEvent);
    }
  }, {
    key: "setEvents",
    value: function setEvents(event, func) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }

      var list = this.listeners[event];
      list.push(func);

      if (list.length === 1) {
        this.el.addEventListener(this.namespace + event, this.checkEvent, false);
      }

      if (event === 'call') {
        this.hasCallEventSet = true;
        this.detectElements(true);
      }
    }
  }, {
    key: "unsetEvents",
    value: function unsetEvents(event, func) {
      if (!this.listeners[event]) return;
      var list = this.listeners[event];
      var index = list.indexOf(func);
      if (index < 0) return;
      list.splice(index, 1);

      if (list.index === 0) {
        this.el.removeEventListener(this.namespace + event, this.checkEvent, false);
      }
    }
  }, {
    key: "checkEvent",
    value: function checkEvent(event) {
      var _this4 = this;

      var name = event.type.replace(this.namespace, '');
      var list = this.listeners[name];
      if (!list || list.length === 0) return;
      list.forEach(function (func) {
        switch (name) {
          case 'scroll':
            return func(_this4.instance);

          case 'call':
            return func(_this4.callValue, _this4.callWay, _this4.callObj);

          default:
            return func();
        }
      });
    }
  }, {
    key: "startScroll",
    value: function startScroll() {}
  }, {
    key: "stopScroll",
    value: function stopScroll() {}
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance.scroll = {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;

      window.removeEventListener('resize', this.checkResize, false);
      Object.keys(this.listeners).forEach(function (event) {
        _this5.el.removeEventListener(_this5.namespace + event, _this5.checkEvent, false);
      });
      this.listeners = {};
      this.scrollToEls.forEach(function (el) {
        el.removeEventListener('click', _this5.setScrollTo, false);
      });
    }
  }]);

  return _default;
}();

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var smoothscroll = createCommonjsModule(function (module, exports) {
  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
  (function () {
    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document; // return if scroll behavior is supported and polyfill is not forced

      if ('scrollBehavior' in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
        return;
      } // globals


      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468; // object gathering original scroll methods

      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      }; // define timing method

      var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;
      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */

      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }
      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */


      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */

      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }
      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */


      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }
      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */


      function shouldBailOut(firstArg) {
        if (firstArg === null || typeof firstArg !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        } // throw error when behavior is not supported


        throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
      }
      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }
      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
        return overflowValue === 'auto' || overflowValue === 'scroll';
      }
      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
        return isScrollableY || isScrollableX;
      }
      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */


      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }

        return el;
      }
      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */


      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME; // avoid elapsed times higher than one

        elapsed = elapsed > 1 ? 1 : elapsed; // apply easing to elapsed time

        value = ease(elapsed);
        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;
        context.method.call(context.scrollable, currentX, currentY); // scroll more if we have not reached our destination

        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }
      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */


      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now(); // define scroll context

        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        } // scroll looping over a frame


        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      } // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo


      w.scroll = w.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : w.scrollX || w.pageXOffset, // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : w.scrollY || w.pageYOffset);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        smoothScroll.call(w, d.body, arguments[0].left !== undefined ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== undefined ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
      }; // w.scrollBy


      w.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : 0, arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : 0);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
      }; // Element.prototype.scroll and Element.prototype.scrollTo


      Element.prototype.scroll = Element.prototype.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }

          original.elementScroll.call(this, // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined ? ~~arguments[0].left : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft, // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined ? ~~arguments[0].top : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop);
          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top; // LET THE SMOOTHNESS BEGIN!

        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
      }; // Element.prototype.scrollBy


      Element.prototype.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(this, arguments[0].left !== undefined ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      }; // Element.prototype.scrollIntoView


      Element.prototype.scrollIntoView = function () {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top); // reveal parent in viewport unless is fixed

          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    {
      // commonjs
      module.exports = {
        polyfill: polyfill
      };
    }
  })();
});
var smoothscroll_1 = smoothscroll.polyfill;

var _default$1 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    window.addEventListener('scroll', _this.checkScroll, false);
    smoothscroll.polyfill();
    return _this;
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      this.instance.scroll.y = window.pageYOffset;
      this.addElements();
      this.detectElements();

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this2 = this;

      _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

      if (this.getDirection) {
        this.addDirection();
      }

      if (this.getSpeed) {
        this.addSpeed();
        this.timestamp = Date.now();
      }

      this.instance.scroll.y = window.pageYOffset;

      if (this.els.length) {
        if (!this.hasScrollTicking) {
          requestAnimationFrame(function () {
            _this2.detectElements();
          });
          this.hasScrollTicking = true;
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (window.pageYOffset > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (window.pageYOffset < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (window.pageYOffset != this.instance.scroll.y) {
        this.instance.speed = (window.pageYOffset - this.instance.scroll.y) / (Date.now() - this.timestamp);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.els.length) {
        this.windowHeight = window.innerHeight;
        this.updateElements();
      }
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this3 = this;

      this.els = [];
      var els = this.el.querySelectorAll('[data-' + this.name + ']');
      els.forEach(function (el, id) {
        var cl = el.dataset[_this3.name + 'Class'] || _this3["class"];

        var top = el.getBoundingClientRect().top + _this3.instance.scroll.y;

        var bottom = top + el.offsetHeight;
        var offset = typeof el.dataset[_this3.name + 'Offset'] === 'string' ? el.dataset[_this3.name + 'Offset'].split(',') : _this3.offset;
        var repeat = el.dataset[_this3.name + 'Repeat'];
        var call = el.dataset[_this3.name + 'Call'];

        if (repeat == 'false') {
          repeat = false;
        } else if (repeat != undefined) {
          repeat = true;
        } else {
          repeat = _this3.repeat;
        }

        var relativeOffset = _this3.getRelativeOffset(offset);

        var mappedEl = {
          el: el,
          id: id,
          "class": cl,
          top: top + relativeOffset[0],
          bottom: bottom - relativeOffset[1],
          offset: offset,
          repeat: repeat,
          inView: el.classList.contains(cl) ? true : false,
          call: call
        };

        _this3.els.push(mappedEl);
      });
    }
  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      this.els.forEach(function (el, i) {
        var top = el.el.getBoundingClientRect().top + _this4.instance.scroll.y;

        var bottom = top + el.el.offsetHeight;

        var relativeOffset = _this4.getRelativeOffset(el.offset);

        _this4.els[i].top = top + relativeOffset[0];
        _this4.els[i].bottom = bottom - relativeOffset[1];
      });
      this.hasScrollTicking = false;
    }
  }, {
    key: "getRelativeOffset",
    value: function getRelativeOffset(offset) {
      var relativeOffset = [0, 0];

      if (offset) {
        for (var i = 0; i < offset.length; i++) {
          if (typeof offset[i] == 'string') {
            if (offset[i].includes('%')) {
              relativeOffset[i] = parseInt(offset[i].replace('%', '') * this.windowHeight / 100);
            } else {
              relativeOffset[i] = parseInt(offset[i]);
            }
          } else {
            relativeOffset[i] = offset[i];
          }
        }
      }

      return relativeOffset;
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          targetOption {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          offsetOption {int} - An absolute vertical scroll value to reach, or an offset to apply on top of given `target` or `sourceElem`'s target
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(targetOption, offsetOption, duration, easing, disableLerp, callback) {
      // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)
      var target;
      var offset = offsetOption ? parseInt(offsetOption) : 0;

      if (typeof targetOption === 'string') {
        // Selector or boundaries
        if (targetOption === 'top') {
          target = this.html;
        } else if (targetOption === 'bottom') {
          target = this.html.offsetHeight - window.innerHeight;
        } else {
          target = document.querySelector(targetOption); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof targetOption === 'number') {
        // Absolute coordinate
        target = parseInt(targetOption);
      } else if (targetOption && targetOption.tagName) {
        // DOM Element
        target = targetOption;
      } else {
        console.warn('`targetOption` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        offset = target.getBoundingClientRect().top + offset + this.instance.scroll.y;
      } else {
        offset = target + offset;
      }

      if (callback) {
        offset = offset.toFixed();

        var onScroll = function onScroll() {
          if (window.pageYOffset.toFixed() === offset) {
            window.removeEventListener('scroll', onScroll);
            callback();
          }
        };

        window.addEventListener('scroll', onScroll);
      }

      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.addElements();
      this.detectElements();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      window.removeEventListener('scroll', this.checkScroll, false);
    }
  }]);

  return _default;
}(_default);
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */


var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

function E() {// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });
    return this;
  },
  once: function (name, callback, ctx) {
    var self = this;

    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }

    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },
  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
      }
    } // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910


    liveEvents.length ? e[name] = liveEvents : delete e[name];
    return this;
  }
};
var tinyEmitter = E;
var lethargy = createCommonjsModule(function (module, exports) {
  // Generated by CoffeeScript 1.9.2
  (function () {
    var root;
    root = exports !== null ? exports : this;

    root.Lethargy = function () {
      function Lethargy(stability, sensitivity, tolerance, delay) {
        this.stability = stability != null ? Math.abs(stability) : 8;
        this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
        this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
        this.delay = delay != null ? delay : 150;

        this.lastUpDeltas = function () {
          var i, ref, results;
          results = [];

          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }

          return results;
        }.call(this);

        this.lastDownDeltas = function () {
          var i, ref, results;
          results = [];

          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }

          return results;
        }.call(this);

        this.deltasTimestamp = function () {
          var i, ref, results;
          results = [];

          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }

          return results;
        }.call(this);
      }

      Lethargy.prototype.check = function (e) {
        var lastDelta;
        e = e.originalEvent || e;

        if (e.wheelDelta != null) {
          lastDelta = e.wheelDelta;
        } else if (e.deltaY != null) {
          lastDelta = e.deltaY * -40;
        } else if (e.detail != null || e.detail === 0) {
          lastDelta = e.detail * -40;
        }

        this.deltasTimestamp.push(Date.now());
        this.deltasTimestamp.shift();

        if (lastDelta > 0) {
          this.lastUpDeltas.push(lastDelta);
          this.lastUpDeltas.shift();
          return this.isInertia(1);
        } else {
          this.lastDownDeltas.push(lastDelta);
          this.lastDownDeltas.shift();
          return this.isInertia(-1);
        }
      };

      Lethargy.prototype.isInertia = function (direction) {
        var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
        lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;

        if (lastDeltas[0] === null) {
          return direction;
        }

        if (this.deltasTimestamp[this.stability * 2 - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[this.stability * 2 - 1]) {
          return false;
        }

        lastDeltasOld = lastDeltas.slice(0, this.stability);
        lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
        oldSum = lastDeltasOld.reduce(function (t, s) {
          return t + s;
        });
        newSum = lastDeltasNew.reduce(function (t, s) {
          return t + s;
        });
        oldAverage = oldSum / lastDeltasOld.length;
        newAverage = newSum / lastDeltasNew.length;

        if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && this.sensitivity < Math.abs(newAverage)) {
          return direction;
        } else {
          return false;
        }
      };

      Lethargy.prototype.showLastUpDeltas = function () {
        return this.lastUpDeltas;
      };

      Lethargy.prototype.showLastDownDeltas = function () {
        return this.lastDownDeltas;
      };

      return Lethargy;
    }();
  }).call(commonjsGlobal);
});

var support = function getSupport() {
  return {
    hasWheelEvent: 'onwheel' in document,
    hasMouseWheelEvent: 'onmousewheel' in document,
    hasTouch: 'ontouchstart' in window || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch,
    hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
    hasPointer: !!window.navigator.msPointerEnabled,
    hasKeyDown: 'onkeydown' in document,
    isFirefox: navigator.userAgent.indexOf('Firefox') > -1
  };
}();

var toString = Object.prototype.toString,
    hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var bindallStandalone = function (object) {
  if (!object) return console.warn('bindAll requires at least one argument.');
  var functions = Array.prototype.slice.call(arguments, 1);

  if (functions.length === 0) {
    for (var method in object) {
      if (hasOwnProperty$1.call(object, method)) {
        if (typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
          functions.push(method);
        }
      }
    }
  }

  for (var i = 0; i < functions.length; i++) {
    var f = functions[i];
    object[f] = bind(object[f], object);
  }
};
/*
    Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
    bindAll is only needed for events binding so no need to make slow fixes for constructor
    or partial application.
*/


function bind(func, context) {
  return function () {
    return func.apply(context, arguments);
  };
}

var Lethargy = lethargy.Lethargy;
var EVT_ID = 'virtualscroll';
var src = VirtualScroll;
var keyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32
};

function VirtualScroll(options) {
  bindallStandalone(this, '_onWheel', '_onMouseWheel', '_onTouchStart', '_onTouchMove', '_onKeyDown');
  this.el = window;

  if (options && options.el) {
    this.el = options.el;
    delete options.el;
  }

  this.options = objectAssign({
    mouseMultiplier: 1,
    touchMultiplier: 2,
    firefoxMultiplier: 15,
    keyStep: 120,
    preventTouch: false,
    unpreventTouchClass: 'vs-touchmove-allowed',
    limitInertia: false,
    useKeyboard: true,
    useTouch: true
  }, options);
  if (this.options.limitInertia) this._lethargy = new Lethargy();
  this._emitter = new tinyEmitter();
  this._event = {
    y: 0,
    x: 0,
    deltaX: 0,
    deltaY: 0
  };
  this.touchStartX = null;
  this.touchStartY = null;
  this.bodyTouchAction = null;

  if (this.options.passive !== undefined) {
    this.listenerOptions = {
      passive: this.options.passive
    };
  }
}

VirtualScroll.prototype._notify = function (e) {
  var evt = this._event;
  evt.x += evt.deltaX;
  evt.y += evt.deltaY;

  this._emitter.emit(EVT_ID, {
    x: evt.x,
    y: evt.y,
    deltaX: evt.deltaX,
    deltaY: evt.deltaY,
    originalEvent: e
  });
};

VirtualScroll.prototype._onWheel = function (e) {
  var options = this.options;
  if (this._lethargy && this._lethargy.check(e) === false) return;
  var evt = this._event; // In Chrome and in Firefox (at least the new one)

  evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1; // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
  // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes

  if (support.isFirefox && e.deltaMode == 1) {
    evt.deltaX *= options.firefoxMultiplier;
    evt.deltaY *= options.firefoxMultiplier;
  }

  evt.deltaX *= options.mouseMultiplier;
  evt.deltaY *= options.mouseMultiplier;

  this._notify(e);
};

VirtualScroll.prototype._onMouseWheel = function (e) {
  if (this.options.limitInertia && this._lethargy.check(e) === false) return;
  var evt = this._event; // In Safari, IE and in Chrome if 'wheel' isn't defined

  evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
  evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;

  this._notify(e);
};

VirtualScroll.prototype._onTouchStart = function (e) {
  var t = e.targetTouches ? e.targetTouches[0] : e;
  this.touchStartX = t.pageX;
  this.touchStartY = t.pageY;
};

VirtualScroll.prototype._onTouchMove = function (e) {
  var options = this.options;

  if (options.preventTouch && !e.target.classList.contains(options.unpreventTouchClass)) {
    e.preventDefault();
  }

  var evt = this._event;
  var t = e.targetTouches ? e.targetTouches[0] : e;
  evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
  evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;
  this.touchStartX = t.pageX;
  this.touchStartY = t.pageY;

  this._notify(e);
};

VirtualScroll.prototype._onKeyDown = function (e) {
  var evt = this._event;
  evt.deltaX = evt.deltaY = 0;
  var windowHeight = window.innerHeight - 40;

  switch (e.keyCode) {
    case keyCodes.LEFT:
    case keyCodes.UP:
      evt.deltaY = this.options.keyStep;
      break;

    case keyCodes.RIGHT:
    case keyCodes.DOWN:
      evt.deltaY = -this.options.keyStep;
      break;

    case e.shiftKey:
      evt.deltaY = windowHeight;
      break;

    case keyCodes.SPACE:
      evt.deltaY = -windowHeight;
      break;

    default:
      return;
  }

  this._notify(e);
};

VirtualScroll.prototype._bind = function () {
  if (support.hasWheelEvent) this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
  if (support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);

  if (support.hasTouch && this.options.useTouch) {
    this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
    this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
  }

  if (support.hasPointer && support.hasTouchWin) {
    this.bodyTouchAction = document.body.style.msTouchAction;
    document.body.style.msTouchAction = 'none';
    this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
    this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
  }

  if (support.hasKeyDown && this.options.useKeyboard) document.addEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype._unbind = function () {
  if (support.hasWheelEvent) this.el.removeEventListener('wheel', this._onWheel);
  if (support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this._onMouseWheel);

  if (support.hasTouch) {
    this.el.removeEventListener('touchstart', this._onTouchStart);
    this.el.removeEventListener('touchmove', this._onTouchMove);
  }

  if (support.hasPointer && support.hasTouchWin) {
    document.body.style.msTouchAction = this.bodyTouchAction;
    this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
    this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
  }

  if (support.hasKeyDown && this.options.useKeyboard) document.removeEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype.on = function (cb, ctx) {
  this._emitter.on(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (events && events[EVT_ID] && events[EVT_ID].length === 1) this._bind();
};

VirtualScroll.prototype.off = function (cb, ctx) {
  this._emitter.off(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind();
};

VirtualScroll.prototype.reset = function () {
  var evt = this._event;
  evt.x = 0;
  evt.y = 0;
};

VirtualScroll.prototype.destroy = function () {
  this._emitter.off();

  this._unbind();
};

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function getTranslate(el) {
  var translate = {};
  if (!window.getComputedStyle) return;
  var style = getComputedStyle(el);
  var transform = style.transform || style.webkitTransform || style.mozTransform;
  var mat = transform.match(/^matrix3d\((.+)\)$/);

  if (mat) {
    translate.x = mat ? parseFloat(mat[1].split(', ')[12]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[13]) : 0;
  } else {
    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
  }

  return translate;
}
/**
 * Returns an array containing all the parent nodes of the given node
 * @param  {object} node
 * @return {array} parent nodes
 */


function getParents(elem) {
  // Set up a parent array
  var parents = []; // Push each parent element to the array

  for (; elem && elem !== document; elem = elem.parentNode) {
    parents.push(elem);
  } // Return our parent array


  return parents;
} // https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
// These values are established by empiricism with tests (tradeoff: performance VS precision)


var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
var float32ArraySupported = typeof Float32Array === 'function';

function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

function C(aA1) {
  return 3.0 * aA1;
} // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.


function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
} // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.


function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX,
      currentT,
      i = 0;

  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;

    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

  return currentT;
}

function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);

    if (currentSlope === 0.0) {
      return aGuessT;
    }

    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }

  return aGuessT;
}

function LinearEasing(x) {
  return x;
}

var src$1 = function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  } // Precompute samples table


  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }

    --currentSample; // Interpolate to provide an initial guess for t

    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;
    var initialSlope = getSlope(guessForT, mX1, mX2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing(x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }

    if (x === 1) {
      return 1;
    }

    return calcBezier(getTForX(x), mY1, mY2);
  };
};

var keyCodes$1 = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  TAB: 9,
  PAGEUP: 33,
  PAGEDOWN: 34,
  HOME: 36,
  END: 35
};

var _default$2 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual';
    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    if (_this.inertia) _this.lerp = _this.inertia * 0.1;
    _this.isScrolling = false;
    _this.isDraggingScrollbar = false;
    _this.isTicking = false;
    _this.hasScrollTicking = false;
    _this.parallaxElements = [];
    _this.stop = false;
    _this.checkKey = _this.checkKey.bind(_assertThisInitialized(_this));
    window.addEventListener('keydown', _this.checkKey, false);
    return _this;
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.html.classList.add(this.smoothClass);
      this.instance = _objectSpread2({
        delta: {
          x: 0,
          y: 0
        }
      }, this.instance);
      this.vs = new src({
        el: this.scrollFromAnywhere ? document : this.el,
        mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.4,
        firefoxMultiplier: this.firefoxMultiplier,
        touchMultiplier: this.touchMultiplier,
        useKeyboard: false,
        passive: true
      });
      this.vs.on(function (e) {
        if (_this2.stop) {
          return;
        }

        if (!_this2.isTicking && !_this2.isDraggingScrollbar) {
          requestAnimationFrame(function () {
            _this2.updateDelta(e);

            if (!_this2.isScrolling) _this2.startScrolling();
          });
          _this2.isTicking = true;
        }

        _this2.isTicking = false;
      });
      this.setScrollLimit();
      this.initScrollBar();
      this.addSections();
      this.addElements();
      this.detectElements();
      this.transformElements(true, true);
      this.checkScroll(true);

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "setScrollLimit",
    value: function setScrollLimit() {
      this.instance.limit = this.el.offsetHeight - this.windowHeight;
    }
  }, {
    key: "startScrolling",
    value: function startScrolling() {
      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "stopScrolling",
    value: function stopScrolling() {
      if (this.scrollToRaf) {
        cancelAnimationFrame(this.scrollToRaf);
        this.scrollToRaf = null;
      }

      this.isScrolling = false;
      this.instance.scroll.y = Math.round(this.instance.scroll.y);
      this.html.classList.remove(this.scrollingClass);
    }
  }, {
    key: "checkKey",
    value: function checkKey(e) {
      var _this3 = this;

      if (this.stop) {
        // If we are stopped, we don't want any scroll to occur because of a keypress
        // Prevent tab to scroll to activeElement
        if (e.keyCode == keyCodes$1.TAB) {
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0;
          });
        }

        return;
      }

      switch (e.keyCode) {
        case keyCodes$1.TAB:
          // Do not remove the RAF
          // It allows to override the browser's native scrollTo, which is essential
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0; // Request scrollTo on the focusedElement, putting it at the center of the screen

            _this3.scrollTo(document.activeElement, -window.innerHeight / 2);
          });
          break;

        case keyCodes$1.UP:
          this.instance.delta.y -= 240;
          break;

        case keyCodes$1.DOWN:
          this.instance.delta.y += 240;
          break;

        case keyCodes$1.PAGEUP:
          this.instance.delta.y -= window.innerHeight;
          break;

        case keyCodes$1.PAGEDOWN:
          this.instance.delta.y += window.innerHeight;
          break;

        case keyCodes$1.HOME:
          this.instance.delta.y -= this.instance.limit;
          break;

        case keyCodes$1.END:
          this.instance.delta.y += this.instance.limit;
          break;

        case keyCodes$1.SPACE:
          if (!(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement)) {
            if (e.shiftKey) {
              this.instance.delta.y -= window.innerHeight;
            } else {
              this.instance.delta.y += window.innerHeight;
            }
          }

          break;

        default:
          return;
      }

      if (this.instance.delta.y < 0) this.instance.delta.y = 0;
      if (this.instance.delta.y > this.instance.limit) this.instance.delta.y = this.instance.limit;
      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this4 = this;

      var forced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (forced || this.isScrolling || this.isDraggingScrollbar) {
        if (!this.hasScrollTicking) {
          requestAnimationFrame(function () {
            return _this4.checkScroll();
          });
          this.hasScrollTicking = true;
        }

        this.updateScroll();
        var distance = Math.abs(this.instance.delta.y - this.instance.scroll.y);

        if (!this.animatingScroll && (distance < 0.5 && this.instance.delta.y != 0 || distance < 0.5 && this.instance.delta.y == 0)) {
          this.stopScrolling();
        }

        for (var i = this.sections.length - 1; i >= 0; i--) {
          if (this.sections[i].persistent || this.instance.scroll.y > this.sections[i].offset && this.instance.scroll.y < this.sections[i].limit) {
            this.transform(this.sections[i].el, 0, -this.instance.scroll.y);

            if (!this.sections[i].inView) {
              this.sections[i].inView = true;
              this.sections[i].el.style.opacity = 1;
              this.sections[i].el.style.pointerEvents = 'all';
              this.sections[i].el.setAttribute("data-".concat(this.name, "-section-inview"), '');
            }
          } else {
            if (this.sections[i].inView) {
              this.sections[i].inView = false;
              this.sections[i].el.style.opacity = 0;
              this.sections[i].el.style.pointerEvents = 'none';
              this.sections[i].el.removeAttribute("data-".concat(this.name, "-section-inview"));
            }

            this.transform(this.sections[i].el, 0, 0);
          }
        }

        if (this.getDirection) {
          this.addDirection();
        }

        if (this.getSpeed) {
          this.addSpeed();
          this.timestamp = Date.now();
        }

        this.detectElements();
        this.transformElements();
        var scrollBarTranslation = this.instance.scroll.y / this.instance.limit * this.scrollBarLimit;
        this.transform(this.scrollbarThumb, 0, scrollBarTranslation);

        _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

        this.hasScrollTicking = false;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.windowHeight = window.innerHeight;
      this.windowMiddle = this.windowHeight / 2;
      this.update();
    }
  }, {
    key: "updateDelta",
    value: function updateDelta(e) {
      this.instance.delta.y -= e.deltaY * this.multiplier;
      if (this.instance.delta.y < 0) this.instance.delta.y = 0;
      if (this.instance.delta.y > this.instance.limit) this.instance.delta.y = this.instance.limit;
    }
  }, {
    key: "updateScroll",
    value: function updateScroll(e) {
      if (this.isScrolling || this.isDraggingScrollbar) {
        this.instance.scroll.y = lerp(this.instance.scroll.y, this.instance.delta.y, this.lerp);
      } else {
        if (this.instance.scroll.y > this.instance.limit) {
          this.setScroll(this.instance.scroll.x, this.instance.limit);
        } else if (this.instance.scroll.y < 0) {
          this.setScroll(this.instance.scroll.x, 0);
        } else {
          this.setScroll(this.instance.scroll.x, this.instance.delta.y);
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (this.instance.delta.y > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (this.instance.delta.y < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (this.instance.delta.y != this.instance.scroll.y) {
        this.instance.speed = (this.instance.delta.y - this.instance.scroll.y) / Math.max(1, Date.now() - this.timestamp);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "initScrollBar",
    value: function initScrollBar() {
      this.scrollbar = document.createElement('span');
      this.scrollbarThumb = document.createElement('span');
      this.scrollbar.classList.add("".concat(this.scrollbarClass));
      this.scrollbarThumb.classList.add("".concat(this.scrollbarClass, "_thumb"));
      this.scrollbar.append(this.scrollbarThumb);
      document.body.append(this.scrollbar); // Scrollbar Events

      this.getScrollBar = this.getScrollBar.bind(this);
      this.releaseScrollBar = this.releaseScrollBar.bind(this);
      this.moveScrollBar = this.moveScrollBar.bind(this);
      this.scrollbarThumb.addEventListener('mousedown', this.getScrollBar);
      window.addEventListener('mouseup', this.releaseScrollBar);
      window.addEventListener('mousemove', this.moveScrollBar); // Set scrollbar values

      if (this.instance.limit + this.windowHeight <= this.windowHeight) {
        return;
      }

      this.scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
      this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit + this.scrollbarHeight), "px");
      this.scrollBarLimit = this.scrollbarHeight - this.scrollbarThumb.getBoundingClientRect().height;
    }
  }, {
    key: "reinitScrollBar",
    value: function reinitScrollBar() {
      if (this.instance.limit + this.windowHeight <= this.windowHeight) {
        return;
      }

      this.scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
      this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit + this.scrollbarHeight), "px");
      this.scrollBarLimit = this.scrollbarHeight - this.scrollbarThumb.getBoundingClientRect().height;
    }
  }, {
    key: "destroyScrollBar",
    value: function destroyScrollBar() {
      this.scrollbarThumb.removeEventListener('mousedown', this.getScrollBar);
      window.removeEventListener('mouseup', this.releaseScrollBar);
      window.removeEventListener('mousemove', this.moveScrollBar);
      this.scrollbar.remove();
    }
  }, {
    key: "getScrollBar",
    value: function getScrollBar(e) {
      this.isDraggingScrollbar = true;
      this.checkScroll();
      this.html.classList.remove(this.scrollingClass);
      this.html.classList.add(this.draggingClass);
    }
  }, {
    key: "releaseScrollBar",
    value: function releaseScrollBar(e) {
      this.isDraggingScrollbar = false;
      this.html.classList.add(this.scrollingClass);
      this.html.classList.remove(this.draggingClass);
    }
  }, {
    key: "moveScrollBar",
    value: function moveScrollBar(e) {
      var _this5 = this;

      if (!this.isTicking && this.isDraggingScrollbar) {
        requestAnimationFrame(function () {
          var y = e.clientY * 100 / _this5.scrollbarHeight * _this5.instance.limit / 100;

          if (y > 0 && y < _this5.instance.limit) {
            _this5.instance.delta.y = y;
          }
        });
        this.isTicking = true;
      }

      this.isTicking = false;
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this6 = this;

      this.els = [];
      this.parallaxElements = [];
      this.sections.forEach(function (section, y) {
        var els = _this6.sections[y].el.querySelectorAll("[data-".concat(_this6.name, "]"));

        els.forEach(function (el, id) {
          var cl = el.dataset[_this6.name + 'Class'] || _this6["class"];
          var top;
          var repeat = el.dataset[_this6.name + 'Repeat'];
          var call = el.dataset[_this6.name + 'Call'];
          var position = el.dataset[_this6.name + 'Position'];
          var delay = el.dataset[_this6.name + 'Delay'];
          var direction = el.dataset[_this6.name + 'Direction'];
          var sticky = typeof el.dataset[_this6.name + 'Sticky'] === 'string';
          var speed = el.dataset[_this6.name + 'Speed'] ? parseFloat(el.dataset[_this6.name + 'Speed']) / 10 : false;
          var offset = typeof el.dataset[_this6.name + 'Offset'] === 'string' ? el.dataset[_this6.name + 'Offset'].split(',') : _this6.offset;
          var target = el.dataset[_this6.name + 'Target'];
          var targetEl;

          if (target !== undefined) {
            targetEl = document.querySelector("".concat(target));
          } else {
            targetEl = el;
          }

          if (!_this6.sections[y].inView) {
            top = targetEl.getBoundingClientRect().top - getTranslate(_this6.sections[y].el).y - getTranslate(targetEl).y;
          } else {
            top = targetEl.getBoundingClientRect().top + _this6.instance.scroll.y - getTranslate(targetEl).y;
          }

          var bottom = top + targetEl.offsetHeight;
          var middle = (bottom - top) / 2 + top;

          if (sticky) {
            var elTop = el.getBoundingClientRect().top;
            var elDistance = elTop - top;
            top += window.innerHeight;
            bottom = elTop + targetEl.offsetHeight - el.offsetHeight - elDistance;
            middle = (bottom - top) / 2 + top;
          }

          if (repeat == 'false') {
            repeat = false;
          } else if (repeat != undefined) {
            repeat = true;
          } else {
            repeat = _this6.repeat;
          }

          var relativeOffset = [0, 0];

          if (offset) {
            for (var i = 0; i < offset.length; i++) {
              if (typeof offset[i] == 'string') {
                if (offset[i].includes('%')) {
                  relativeOffset[i] = parseInt(offset[i].replace('%', '') * _this6.windowHeight / 100);
                } else {
                  relativeOffset[i] = parseInt(offset[i]);
                }
              } else {
                relativeOffset[i] = offset[i];
              }
            }
          }

          var mappedEl = {
            el: el,
            id: id,
            "class": cl,
            top: top + relativeOffset[0],
            middle: middle,
            bottom: bottom - relativeOffset[1],
            offset: offset,
            repeat: repeat,
            inView: el.classList.contains(cl) ? true : false,
            call: call,
            speed: speed,
            delay: delay,
            position: position,
            target: targetEl,
            direction: direction,
            sticky: sticky
          };

          _this6.els.push(mappedEl);

          if (speed !== false || sticky) {
            _this6.parallaxElements.push(mappedEl);
          }
        });
      });
    }
  }, {
    key: "addSections",
    value: function addSections() {
      var _this7 = this;

      this.sections = [];
      var sections = this.el.querySelectorAll("[data-".concat(this.name, "-section]"));

      if (sections.length === 0) {
        sections = [this.el];
      }

      sections.forEach(function (section, i) {
        var offset = section.getBoundingClientRect().top - window.innerHeight * 1.5 - getTranslate(section).y;
        var limit = offset + section.getBoundingClientRect().height + window.innerHeight * 2;
        var persistent = typeof section.dataset[_this7.name + 'Persistent'] === 'string';
        var mappedSection = {
          el: section,
          offset: offset,
          limit: limit,
          inView: false,
          persistent: persistent
        };
        _this7.sections[i] = mappedSection;
      });
    }
  }, {
    key: "transform",
    value: function transform(element, x, y, delay) {
      var transform;

      if (!delay) {
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(x, ",").concat(y, ",0,1)");
      } else {
        var start = getTranslate(element);
        var lerpX = lerp(start.x, x, delay);
        var lerpY = lerp(start.y, y, delay);
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(lerpX, ",").concat(lerpY, ",0,1)");
      }

      element.style.webkitTransform = transform;
      element.style.msTransform = transform;
      element.style.transform = transform;
    }
  }, {
    key: "transformElements",
    value: function transformElements(isForced) {
      var _this8 = this;

      var setAllElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var scrollBottom = this.instance.scroll.y + this.windowHeight;
      var scrollMiddle = this.instance.scroll.y + this.windowMiddle;
      this.parallaxElements.forEach(function (current, i) {
        var transformDistance = false;

        if (isForced) {
          transformDistance = 0;
        }

        if (current.inView || setAllElements) {
          switch (current.position) {
            case 'top':
              transformDistance = _this8.instance.scroll.y * -current.speed;
              break;

            case 'elementTop':
              transformDistance = (scrollBottom - current.top) * -current.speed;
              break;

            case 'bottom':
              transformDistance = (_this8.instance.limit - scrollBottom + _this8.windowHeight) * current.speed;
              break;

            default:
              transformDistance = (scrollMiddle - current.middle) * -current.speed;
              break;
          }
        }

        if (current.sticky) {
          if (current.inView) {
            transformDistance = _this8.instance.scroll.y - current.top + window.innerHeight;
          } else {
            if (_this8.instance.scroll.y < current.top - window.innerHeight && _this8.instance.scroll.y < current.top - window.innerHeight / 2) {
              transformDistance = 0;
            } else if (_this8.instance.scroll.y > current.bottom && _this8.instance.scroll.y > current.bottom + 100) {
              transformDistance = current.bottom - current.top + window.innerHeight;
            } else {
              transformDistance = false;
            }
          }
        }

        if (transformDistance !== false) {
          if (current.direction === 'horizontal') {
            _this8.transform(current.el, transformDistance, 0, isForced ? false : current.delay);
          } else {
            _this8.transform(current.el, 0, transformDistance, isForced ? false : current.delay);
          }
        }
      });
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          targetOption {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          offsetOption {int} - An offset to apply on top of given `target` or `sourceElem`'s target
     *          duration {int} - Duration of the scroll animation in milliseconds
     *          easing {array} - An array of 4 floats between 0 and 1 defining the bezier curve for the animation's easing. See http://greweb.me/bezier-easing-editor/example/
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(targetOption, offsetOption) {
      var _this9 = this;

      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
      var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [0.25, 0.00, 0.35, 1.00];
      var disableLerp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var callback = arguments.length > 5 ? arguments[5] : undefined; // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)

      var target;
      var offset = offsetOption ? parseInt(offsetOption) : 0;
      easing = src$1.apply(void 0, _toConsumableArray(easing));

      if (typeof targetOption === 'string') {
        // Selector or boundaries
        if (targetOption === 'top') {
          target = 0;
        } else if (targetOption === 'bottom') {
          target = this.instance.limit;
        } else {
          target = document.querySelector(targetOption); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof targetOption === 'number') {
        // Absolute coordinate
        target = parseInt(targetOption);
      } else if (targetOption && targetOption.tagName) {
        // DOM Element
        target = targetOption;
      } else {
        console.warn('`targetOption` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        // Verify the given target belongs to this scroll scope
        var targetInScope = getParents(target).includes(this.el);

        if (!targetInScope) {
          // If the target isn't inside our main element, abort any action
          return;
        } // Get target offset from top


        var targetBCR = target.getBoundingClientRect();
        var offsetTop = targetBCR.top; // Try and find the target's parent section

        var targetParents = getParents(target);
        var parentSection = targetParents.find(function (candidate) {
          return _this9.sections.find(function (section) {
            return section.el == candidate;
          });
        });
        var parentSectionOffset = 0;

        if (parentSection) {
          parentSectionOffset = getTranslate(parentSection).y; // We got a parent section, store it's current offset to remove it later
        } // Final value of scroll destination : offsetTop + (optional offset given in options) - (parent's section translate)


        offset = offsetTop + offset - parentSectionOffset;
      } else {
        offset = target + offset;
      } // Actual scrollto
      // ==========================================================================
      // Setup


      var scrollStart = parseFloat(this.instance.delta.y);
      var scrollTarget = Math.max(0, Math.min(offset, this.instance.limit)); // Make sure our target is in the scroll boundaries

      var scrollDiff = scrollTarget - scrollStart;

      var render = function render(p) {
        if (disableLerp) _this9.setScroll(_this9.instance.delta.x, scrollStart + scrollDiff * p);else _this9.instance.delta.y = scrollStart + scrollDiff * p;
      }; // Prepare the scroll


      this.animatingScroll = true; // This boolean allows to prevent `checkScroll()` from calling `stopScrolling` when the animation is slow (i.e. at the beginning of an EaseIn)

      this.stopScrolling(); // Stop any movement, allows to kill any other `scrollTo` still happening

      this.startScrolling(); // Restart the scroll
      // Start the animation loop

      var start = Date.now();

      var loop = function loop() {
        var p = (Date.now() - start) / duration; // Animation progress

        if (p > 1) {
          // Animation ends
          render(1);
          _this9.animatingScroll = false;
          if (duration == 0) _this9.update();
          if (callback) callback();
        } else {
          _this9.scrollToRaf = requestAnimationFrame(loop);
          render(easing(p));
        }
      };

      loop();
    }
  }, {
    key: "update",
    value: function update() {
      this.setScrollLimit();
      this.addSections();
      this.addElements();
      this.detectElements();
      this.updateScroll();
      this.transformElements(true);
      this.reinitScrollBar();
      this.checkScroll(true);
    }
  }, {
    key: "startScroll",
    value: function startScroll() {
      this.stop = false;
    }
  }, {
    key: "stopScroll",
    value: function stopScroll() {
      this.stop = true;
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance = _objectSpread2({}, this.instance, {
        scroll: {
          x: x,
          y: y
        },
        delta: {
          x: x,
          y: y
        },
        speed: 0
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      this.stopScrolling();
      this.html.classList.remove(this.smoothClass);
      this.vs.destroy();
      this.destroyScrollBar();
      window.removeEventListener('keydown', this.checkKey, false);
    }
  }]);

  return _default;
}(_default);

var _default$3 = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    this.options = options;
    Object.assign(this, defaults, options);
    this.init();
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      if (!this.smoothMobile) {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      }

      if (this.smooth === true && !this.isMobile) {
        this.scroll = new _default$2(this.options);
      } else {
        this.scroll = new _default$1(this.options);
      }

      this.scroll.init();

      if (window.location.hash) {
        // Get the hash without the '#' and find the matching element
        var id = window.location.hash.slice(1, window.location.hash.length);
        var target = document.getElementById(id); // If found, scroll to the element

        if (target) this.scroll.scrollTo(target);
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.scroll.update();
    }
  }, {
    key: "start",
    value: function start() {
      this.scroll.startScroll();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scroll.stopScroll();
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(target, offset, duration, easing, disableLerp, callback) {
      // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)
      this.scroll.scrollTo(target, offset, duration, easing, disableLerp, callback);
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.scroll.setScroll(x, y);
    }
  }, {
    key: "on",
    value: function on(event, func) {
      this.scroll.setEvents(event, func);
    }
  }, {
    key: "off",
    value: function off(event, func) {
      this.scroll.unsetEvents(event, func);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.scroll.destroy();
    }
  }]);

  return _default;
}();

var _default2 = _default$3;
exports.default = _default2;
},{}],"i4z2":[function(require,module,exports) {
module.exports = "10.5e22fdc3.jpg";
},{}],"NJSX":[function(require,module,exports) {
module.exports = "1.dc197a9a.jpg";
},{}],"PKe7":[function(require,module,exports) {
module.exports = "11.a56b8aeb.jpg";
},{}],"CS4A":[function(require,module,exports) {
module.exports = "12.b5a57fd7.jpg";
},{}],"uYgX":[function(require,module,exports) {
module.exports = "13.3858c623.jpg";
},{}],"hIAS":[function(require,module,exports) {
module.exports = "14.c732d2b3.jpg";
},{}],"TjQ6":[function(require,module,exports) {
module.exports = "15.61b13bcc.jpg";
},{}],"oxYq":[function(require,module,exports) {
module.exports = "17.7c008703.jpg";
},{}],"AgKW":[function(require,module,exports) {
module.exports = "16.39461312.jpg";
},{}],"f9Jt":[function(require,module,exports) {
module.exports = "18.81a1401f.jpg";
},{}],"dFor":[function(require,module,exports) {
module.exports = "2.3ca6bb44.jpg";
},{}],"BVGL":[function(require,module,exports) {
module.exports = "19.6d803788.jpg";
},{}],"ctUQ":[function(require,module,exports) {
module.exports = "20.b400b781.jpg";
},{}],"P8tY":[function(require,module,exports) {
module.exports = "3.a433b89d.jpg";
},{}],"kPmT":[function(require,module,exports) {
module.exports = "4.c6d96be5.jpg";
},{}],"VqBz":[function(require,module,exports) {
module.exports = "5.689b68fd.jpg";
},{}],"gtVS":[function(require,module,exports) {
module.exports = "6.e96dcfff.jpg";
},{}],"HYBC":[function(require,module,exports) {
module.exports = "7.2d66e3ed.jpg";
},{}],"KW6U":[function(require,module,exports) {
module.exports = "8.f4323fe0.jpg";
},{}],"xNmy":[function(require,module,exports) {
module.exports = "9.c9233dac.jpg";
},{}],"m7Bz":[function(require,module,exports) {
module.exports = {
  "1": require("./1.jpg"),
  "2": require("./2.jpg"),
  "3": require("./3.jpg"),
  "4": require("./4.jpg"),
  "5": require("./5.jpg"),
  "6": require("./6.jpg"),
  "7": require("./7.jpg"),
  "8": require("./8.jpg"),
  "9": require("./9.jpg"),
  "10": require("./10.jpg"),
  "11": require("./11.jpg"),
  "12": require("./12.jpg"),
  "13": require("./13.jpg"),
  "14": require("./14.jpg"),
  "15": require("./15.jpg"),
  "16": require("./16.jpg"),
  "17": require("./17.jpg"),
  "18": require("./18.jpg"),
  "19": require("./19.jpg"),
  "20": require("./20.jpg")
};
},{"./10.jpg":"i4z2","./1.jpg":"NJSX","./11.jpg":"PKe7","./12.jpg":"CS4A","./13.jpg":"uYgX","./14.jpg":"hIAS","./15.jpg":"TjQ6","./17.jpg":"oxYq","./16.jpg":"AgKW","./18.jpg":"f9Jt","./2.jpg":"dFor","./19.jpg":"BVGL","./20.jpg":"ctUQ","./3.jpg":"P8tY","./4.jpg":"kPmT","./5.jpg":"VqBz","./6.jpg":"gtVS","./7.jpg":"HYBC","./8.jpg":"KW6U","./9.jpg":"xNmy"}],"Jy3L":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = require("gsap");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var images = Object.entries(require('../img/*.jpg')); // track the mouse position

var mousepos = {
  x: 0,
  y: 0
}; // cache the mouse position

var mousePosCache = mousepos;
var direction = {
  x: mousePosCache.x - mousepos.x,
  y: mousePosCache.y - mousepos.y
}; // update mouse position when moving the mouse

window.addEventListener('mousemove', function (ev) {
  return mousepos = (0, _utils.getMousePos)(ev);
});

var MenuItem = /*#__PURE__*/function () {
  function MenuItem(el, inMenuPosition, animatableProperties) {
    _classCallCheck(this, MenuItem);

    // el is the <a> with class "menu__item"
    this.DOM = {
      el: el
    }; // position in the Menu

    this.inMenuPosition = inMenuPosition; // menu item properties that will animate as we move the mouse around the menu

    this.animatableProperties = animatableProperties; // the item text

    this.DOM.textInner = this.DOM.el.querySelector('.menu__item-textinner'); // create the image structure

    this.layout(); // initialize some events

    this.initEvents();
  } // create the image structure
  // we want to add/append to the menu item the following html:
  // <div class="hover-reveal">
  //   <div class="hover-reveal__inner" style="overflow: hidden;">
  //     <div class="hover-reveal__img" style="background-image: url(pathToImage);">
  //     </div>
  //   </div>
  // </div>


  _createClass(MenuItem, [{
    key: "layout",
    value: function layout() {
      // this is the element that gets its position animated (and perhaps other properties like the rotation etc..)
      this.DOM.reveal = document.createElement('div');
      this.DOM.reveal.className = 'hover-reveal'; // the next two elements could actually be only one, the image element
      // adding an extra wrapper (revealInner) around the image element with overflow hidden, gives us the possibility to scale the image inside

      this.DOM.revealInner = document.createElement('div');
      this.DOM.revealInner.className = 'hover-reveal__inner';
      this.DOM.revealImage = document.createElement('div');
      this.DOM.revealImage.className = 'hover-reveal__img';
      this.DOM.revealImage.style.backgroundImage = "url(".concat(images[this.inMenuPosition][1], ")");
      this.DOM.revealInner.appendChild(this.DOM.revealImage);
      this.DOM.reveal.appendChild(this.DOM.revealInner);
      this.DOM.el.appendChild(this.DOM.reveal);
    } // calculate the position/size of both the menu item and reveal element

  }, {
    key: "calcBounds",
    value: function calcBounds() {
      this.bounds = {
        el: this.DOM.el.getBoundingClientRect(),
        reveal: this.DOM.reveal.getBoundingClientRect()
      };
    } // bind some events

  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this = this;

      this.mouseenterFn = function (ev) {
        // show the image element
        _this.showImage();

        _this.firstRAFCycle = true; // start the render loop animation (rAF)

        _this.loopRender();
      };

      this.mouseleaveFn = function () {
        // stop the render loop animation (rAF)
        _this.stopRendering(); // hide the image element


        _this.hideImage();
      };

      this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
      this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    } // show the image element

  }, {
    key: "showImage",
    value: function showImage() {
      var _this2 = this;

      // kill any current tweens
      _gsap.gsap.killTweensOf(this.DOM.revealInner);

      _gsap.gsap.killTweensOf(this.DOM.revealImage);

      this.tl = _gsap.gsap.timeline({
        onStart: function onStart() {
          // show the image element
          _this2.DOM.reveal.style.opacity = 1; // set a high z-index value so image appears on top of other elements

          _gsap.gsap.set(_this2.DOM.el, {
            zIndex: images.length
          });
        }
      }) // animate the image wrap
      .to(this.DOM.revealInner, 0.2, {
        ease: 'Sine.easeOut',
        startAt: {
          x: direction.x < 0 ? '-100%' : '100%'
        },
        x: '0%'
      }) // animate the image element
      .to(this.DOM.revealImage, 0.2, {
        ease: 'Sine.easeOut',
        startAt: {
          x: direction.x < 0 ? '100%' : '-100%'
        },
        x: '0%'
      }, 0);
    } // hide the image element

  }, {
    key: "hideImage",
    value: function hideImage() {
      var _this3 = this;

      // kill any current tweens
      _gsap.gsap.killTweensOf(this.DOM.revealInner);

      _gsap.gsap.killTweensOf(this.DOM.revealImage);

      this.tl = _gsap.gsap.timeline({
        onStart: function onStart() {
          _gsap.gsap.set(_this3.DOM.el, {
            zIndex: 1
          });
        },
        onComplete: function onComplete() {
          _gsap.gsap.set(_this3.DOM.reveal, {
            opacity: 0
          });
        }
      }).to(this.DOM.revealInner, 0.2, {
        ease: 'Sine.easeOut',
        x: direction.x < 0 ? '100%' : '-100%'
      }).to(this.DOM.revealImage, 0.2, {
        ease: 'Sine.easeOut',
        x: direction.x < 0 ? '-100%' : '100%'
      }, 0);
    } // start the render loop animation (rAF)

  }, {
    key: "loopRender",
    value: function loopRender() {
      var _this4 = this;

      if (!this.requestId) {
        this.requestId = requestAnimationFrame(function () {
          return _this4.render();
        });
      }
    } // stop the render loop animation (rAF)

  }, {
    key: "stopRendering",
    value: function stopRendering() {
      if (this.requestId) {
        window.cancelAnimationFrame(this.requestId);
        this.requestId = undefined;
      }
    } // translate the item as the mouse moves

  }, {
    key: "render",
    value: function render() {
      this.requestId = undefined; // calculate position/sizes the first time

      if (this.firstRAFCycle) {
        this.calcBounds();
      } // calculate the mouse distance (current vs previous cycle)


      var mouseDistanceX = (0, _utils.clamp)(Math.abs(mousePosCache.x - mousepos.x), 0, 100); // direction where the mouse is moving

      direction = {
        x: mousePosCache.x - mousepos.x,
        y: mousePosCache.y - mousepos.y
      }; // updated cache values

      mousePosCache = {
        x: mousepos.x,
        y: mousepos.y
      }; // new translation values
      // the center of the image element is positioned where the mouse is

      this.animatableProperties.tx.current = Math.abs(mousepos.x - this.bounds.el.left) - this.bounds.reveal.width / 2;
      this.animatableProperties.ty.current = Math.abs(mousepos.y - this.bounds.el.top) - this.bounds.reveal.height / 2; // new rotation value

      this.animatableProperties.rotation.current = this.firstRAFCycle ? 0 : (0, _utils.map)(mouseDistanceX, 0, 100, 0, direction.x < 0 ? 60 : -60); // new filter value

      this.animatableProperties.brightness.current = this.firstRAFCycle ? 1 : (0, _utils.map)(mouseDistanceX, 0, 100, 1, 4); // set up the interpolated values
      // for the first cycle, both the interpolated values need to be the same so there's no "lerped" animation between the previous and current state

      this.animatableProperties.tx.previous = this.firstRAFCycle ? this.animatableProperties.tx.current : (0, _utils.lerp)(this.animatableProperties.tx.previous, this.animatableProperties.tx.current, this.animatableProperties.tx.amt);
      this.animatableProperties.ty.previous = this.firstRAFCycle ? this.animatableProperties.ty.current : (0, _utils.lerp)(this.animatableProperties.ty.previous, this.animatableProperties.ty.current, this.animatableProperties.ty.amt);
      this.animatableProperties.rotation.previous = this.firstRAFCycle ? this.animatableProperties.rotation.current : (0, _utils.lerp)(this.animatableProperties.rotation.previous, this.animatableProperties.rotation.current, this.animatableProperties.rotation.amt);
      this.animatableProperties.brightness.previous = this.firstRAFCycle ? this.animatableProperties.brightness.current : (0, _utils.lerp)(this.animatableProperties.brightness.previous, this.animatableProperties.brightness.current, this.animatableProperties.brightness.amt); // set styles

      _gsap.gsap.set(this.DOM.reveal, {
        x: this.animatableProperties.tx.previous,
        y: this.animatableProperties.ty.previous,
        rotation: this.animatableProperties.rotation.previous,
        filter: "brightness(".concat(this.animatableProperties.brightness.previous, ")")
      }); // loop


      this.firstRAFCycle = false;
      this.loopRender();
    }
  }]);

  return MenuItem;
}();

exports.default = MenuItem;
},{"gsap":"TpQl","./utils":"MgTz","../img/*.jpg":"m7Bz"}],"i0CD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = require("gsap");

var _menuItem = _interopRequireDefault(require("./menuItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Menu = /*#__PURE__*/function () {
  function Menu(el) {
    var _this = this;

    _classCallCheck(this, Menu);

    // el is the menu element (<nav>)
    this.DOM = {
      el: el
    }; // the menu item elements (<a>)

    this.DOM.menuItems = this.DOM.el.querySelectorAll('.menu__item'); // menu item properties that will animate as we move the mouse around the menu
    // we will be using interpolation to achieve smooth animations. 
    // the “previous” and “current” values are the values to interpolate. 
    // the value applied to the element, this case the image element (this.DOM.reveal) will be a value between these two values at a specific increment. 
    // the amt is the amount to interpolate.

    this.animatableProperties = {
      // translationX
      tx: {
        previous: 0,
        current: 0,
        amt: 0.08
      },
      // translationY
      ty: {
        previous: 0,
        current: 0,
        amt: 0.08
      },
      // Rotation angle
      rotation: {
        previous: 0,
        current: 0,
        amt: 0.08
      },
      // CSS filter (brightness) value
      brightness: {
        previous: 1,
        current: 1,
        amt: 0.08
      }
    }; // array of MenuItem instances

    this.menuItems = []; // initialize the MenuItems

    _toConsumableArray(this.DOM.menuItems).forEach(function (item, pos) {
      return _this.menuItems.push(new _menuItem.default(item, pos, _this.animatableProperties));
    }); // show the menu items (initial animation where each menu item gets revealed)


    this.showMenuItems();
  } // initial animation for revealing the menu items


  _createClass(Menu, [{
    key: "showMenuItems",
    value: function showMenuItems() {
      _gsap.gsap.to(this.menuItems.map(function (item) {
        return item.DOM.textInner;
      }), {
        duration: 1.2,
        ease: 'Expo.easeOut',
        startAt: {
          y: '100%'
        },
        y: 0,
        delay: function delay(pos) {
          return pos * 0.06;
        }
      });
    }
  }]);

  return Menu;
}();

exports.default = Menu;
},{"gsap":"TpQl","./menuItem":"Jy3L"}],"OgpT":[function(require,module,exports) {
!function (t) {
  function i(r) {
    if (e[r]) return e[r].exports;
    var o = e[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return t[r].call(o.exports, o, o.exports, i), o.l = !0, o.exports;
  }

  var e = {};
  i.m = t, i.c = e, i.d = function (t, e, r) {
    i.o(t, e) || Object.defineProperty(t, e, {
      configurable: !1,
      enumerable: !0,
      get: r
    });
  }, i.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return i.d(e, "a", e), e;
  }, i.o = function (t, i) {
    return Object.prototype.hasOwnProperty.call(t, i);
  }, i.p = "", i(i.s = 4);
}([function (t, i, e) {
  "use strict";

  function r() {
    this.live2DModel = null, this.modelMatrix = null, this.eyeBlink = null, this.physics = null, this.pose = null, this.debugMode = !1, this.initialized = !1, this.updating = !1, this.alpha = 1, this.accAlpha = 0, this.lipSync = !1, this.lipSyncValue = 0, this.accelX = 0, this.accelY = 0, this.accelZ = 0, this.dragX = 0, this.dragY = 0, this.startTimeMSec = null, this.mainMotionManager = new h(), this.expressionManager = new h(), this.motions = {}, this.expressions = {}, this.isTexLoaded = !1;
  }

  function o() {
    AMotion.prototype.constructor.call(this), this.paramList = new Array();
  }

  function n() {
    this.id = "", this.type = -1, this.value = null;
  }

  function s() {
    this.nextBlinkTime = null, this.stateStartTime = null, this.blinkIntervalMsec = null, this.eyeState = g.STATE_FIRST, this.blinkIntervalMsec = 4e3, this.closingMotionMsec = 100, this.closedMotionMsec = 50, this.openingMotionMsec = 150, this.closeIfZero = !0, this.eyeID_L = "PARAM_EYE_L_OPEN", this.eyeID_R = "PARAM_EYE_R_OPEN";
  }

  function _() {
    this.tr = new Float32Array(16), this.identity();
  }

  function a(t, i) {
    _.prototype.constructor.call(this), this.width = t, this.height = i;
  }

  function h() {
    MotionQueueManager.prototype.constructor.call(this), this.currentPriority = null, this.reservePriority = null, this.super = MotionQueueManager.prototype;
  }

  function l() {
    this.physicsList = new Array(), this.startTimeMSec = UtSystem.getUserTimeMSec();
  }

  function $() {
    this.lastTime = 0, this.lastModel = null, this.partsGroups = new Array();
  }

  function u(t) {
    this.paramIndex = -1, this.partsIndex = -1, this.link = null, this.id = t;
  }

  function p() {
    this.EPSILON = .01, this.faceTargetX = 0, this.faceTargetY = 0, this.faceX = 0, this.faceY = 0, this.faceVX = 0, this.faceVY = 0, this.lastTimeSec = 0;
  }

  function f() {
    _.prototype.constructor.call(this), this.screenLeft = null, this.screenRight = null, this.screenTop = null, this.screenBottom = null, this.maxLeft = null, this.maxRight = null, this.maxTop = null, this.maxBottom = null, this.max = Number.MAX_VALUE, this.min = 0;
  }

  function c() {}

  var d = 0;
  r.prototype.getModelMatrix = function () {
    return this.modelMatrix;
  }, r.prototype.setAlpha = function (t) {
    t > .999 && (t = 1), t < .001 && (t = 0), this.alpha = t;
  }, r.prototype.getAlpha = function () {
    return this.alpha;
  }, r.prototype.isInitialized = function () {
    return this.initialized;
  }, r.prototype.setInitialized = function (t) {
    this.initialized = t;
  }, r.prototype.isUpdating = function () {
    return this.updating;
  }, r.prototype.setUpdating = function (t) {
    this.updating = t;
  }, r.prototype.getLive2DModel = function () {
    return this.live2DModel;
  }, r.prototype.setLipSync = function (t) {
    this.lipSync = t;
  }, r.prototype.setLipSyncValue = function (t) {
    this.lipSyncValue = t;
  }, r.prototype.setAccel = function (t, i, e) {
    this.accelX = t, this.accelY = i, this.accelZ = e;
  }, r.prototype.setDrag = function (t, i) {
    this.dragX = t, this.dragY = i;
  }, r.prototype.getMainMotionManager = function () {
    return this.mainMotionManager;
  }, r.prototype.getExpressionManager = function () {
    return this.expressionManager;
  }, r.prototype.loadModelData = function (t, i) {
    var e = c.getPlatformManager();
    this.debugMode && e.log("Load model : " + t);
    var r = this;
    e.loadLive2DModel(t, function (t) {
      if (r.live2DModel = t, r.live2DModel.saveParam(), 0 != Live2D.getError()) return void console.error("Error : Failed to loadModelData().");
      r.modelMatrix = new a(r.live2DModel.getCanvasWidth(), r.live2DModel.getCanvasHeight()), r.modelMatrix.setWidth(2), r.modelMatrix.setCenterPosition(0, 0), i(r.live2DModel);
    });
  }, r.prototype.loadTexture = function (t, i, e) {
    d++;
    var r = c.getPlatformManager();
    this.debugMode && r.log("Load Texture : " + i);
    var o = this;
    r.loadTexture(this.live2DModel, t, i, function () {
      d--, 0 == d && (o.isTexLoaded = !0), "function" == typeof e && e();
    });
  }, r.prototype.loadMotion = function (t, i, e) {
    var r = c.getPlatformManager();
    this.debugMode && r.log("Load Motion : " + i);
    var o = null,
        n = this;
    r.loadBytes(i, function (i) {
      o = Live2DMotion.loadMotion(i), null != t && (n.motions[t] = o), e(o);
    });
  }, r.prototype.loadExpression = function (t, i, e) {
    var r = c.getPlatformManager();
    this.debugMode && r.log("Load Expression : " + i);
    var n = this;
    r.loadBytes(i, function (i) {
      null != t && (n.expressions[t] = o.loadJson(i)), "function" == typeof e && e();
    });
  }, r.prototype.loadPose = function (t, i) {
    var e = c.getPlatformManager();
    this.debugMode && e.log("Load Pose : " + t);
    var r = this;

    try {
      e.loadBytes(t, function (t) {
        r.pose = $.load(t), "function" == typeof i && i();
      });
    } catch (t) {
      console.warn(t);
    }
  }, r.prototype.loadPhysics = function (t) {
    var i = c.getPlatformManager();
    this.debugMode && i.log("Load Physics : " + t);
    var e = this;

    try {
      i.loadBytes(t, function (t) {
        e.physics = l.load(t);
      });
    } catch (t) {
      console.warn(t);
    }
  }, r.prototype.hitTestSimple = function (t, i, e) {
    if (null === this.live2DModel) return !1;
    var r = this.live2DModel.getDrawDataIndex(t);
    if (r < 0) return !1;

    for (var o = this.live2DModel.getTransformedPoints(r), n = this.live2DModel.getCanvasWidth(), s = 0, _ = this.live2DModel.getCanvasHeight(), a = 0, h = 0; h < o.length; h += 2) {
      var l = o[h],
          $ = o[h + 1];
      l < n && (n = l), l > s && (s = l), $ < _ && (_ = $), $ > a && (a = $);
    }

    var u = this.modelMatrix.invertTransformX(i),
        p = this.modelMatrix.invertTransformY(e);
    return n <= u && u <= s && _ <= p && p <= a;
  }, r.prototype.hitTestSimpleCustom = function (t, i, e, r) {
    return null !== this.live2DModel && e >= t[0] && e <= i[0] && r <= t[1] && r >= i[1];
  }, o.prototype = new AMotion(), o.EXPRESSION_DEFAULT = "DEFAULT", o.TYPE_SET = 0, o.TYPE_ADD = 1, o.TYPE_MULT = 2, o.loadJson = function (t) {
    var i = new o(),
        e = c.getPlatformManager(),
        r = e.jsonParseFromBytes(t);
    if (i.setFadeIn(parseInt(r.fade_in) > 0 ? parseInt(r.fade_in) : 1e3), i.setFadeOut(parseInt(r.fade_out) > 0 ? parseInt(r.fade_out) : 1e3), null == r.params) return i;
    var s = r.params,
        _ = s.length;
    i.paramList = [];

    for (var a = 0; a < _; a++) {
      var h = s[a],
          l = h.id.toString(),
          $ = parseFloat(h.val),
          u = o.TYPE_ADD,
          p = null != h.calc ? h.calc.toString() : "add";

      if ((u = "add" === p ? o.TYPE_ADD : "mult" === p ? o.TYPE_MULT : "set" === p ? o.TYPE_SET : o.TYPE_ADD) == o.TYPE_ADD) {
        var f = null == h.def ? 0 : parseFloat(h.def);
        $ -= f;
      } else if (u == o.TYPE_MULT) {
        var f = null == h.def ? 1 : parseFloat(h.def);
        0 == f && (f = 1), $ /= f;
      }

      var d = new n();
      d.id = l, d.type = u, d.value = $, i.paramList.push(d);
    }

    return i;
  }, o.prototype.updateParamExe = function (t, i, e, r) {
    for (var n = this.paramList.length - 1; n >= 0; --n) {
      var s = this.paramList[n];
      s.type == o.TYPE_ADD ? t.addToParamFloat(s.id, s.value, e) : s.type == o.TYPE_MULT ? t.multParamFloat(s.id, s.value, e) : s.type == o.TYPE_SET && t.setParamFloat(s.id, s.value, e);
    }
  }, s.prototype.calcNextBlink = function () {
    return UtSystem.getUserTimeMSec() + Math.random() * (2 * this.blinkIntervalMsec - 1);
  }, s.prototype.setInterval = function (t) {
    this.blinkIntervalMsec = t;
  }, s.prototype.setEyeMotion = function (t, i, e) {
    this.closingMotionMsec = t, this.closedMotionMsec = i, this.openingMotionMsec = e;
  }, s.prototype.updateParam = function (t) {
    var i,
        e = UtSystem.getUserTimeMSec(),
        r = 0;

    switch (this.eyeState) {
      case g.STATE_CLOSING:
        r = (e - this.stateStartTime) / this.closingMotionMsec, r >= 1 && (r = 1, this.eyeState = g.STATE_CLOSED, this.stateStartTime = e), i = 1 - r;
        break;

      case g.STATE_CLOSED:
        r = (e - this.stateStartTime) / this.closedMotionMsec, r >= 1 && (this.eyeState = g.STATE_OPENING, this.stateStartTime = e), i = 0;
        break;

      case g.STATE_OPENING:
        r = (e - this.stateStartTime) / this.openingMotionMsec, r >= 1 && (r = 1, this.eyeState = g.STATE_INTERVAL, this.nextBlinkTime = this.calcNextBlink()), i = r;
        break;

      case g.STATE_INTERVAL:
        this.nextBlinkTime < e && (this.eyeState = g.STATE_CLOSING, this.stateStartTime = e), i = 1;
        break;

      case g.STATE_FIRST:
      default:
        this.eyeState = g.STATE_INTERVAL, this.nextBlinkTime = this.calcNextBlink(), i = 1;
    }

    this.closeIfZero || (i = -i), t.setParamFloat(this.eyeID_L, i), t.setParamFloat(this.eyeID_R, i);
  };

  var g = function g() {};

  g.STATE_FIRST = "STATE_FIRST", g.STATE_INTERVAL = "STATE_INTERVAL", g.STATE_CLOSING = "STATE_CLOSING", g.STATE_CLOSED = "STATE_CLOSED", g.STATE_OPENING = "STATE_OPENING", _.mul = function (t, i, e) {
    var r,
        o,
        n,
        s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (r = 0; r < 4; r++) {
      for (o = 0; o < 4; o++) {
        for (n = 0; n < 4; n++) {
          s[r + 4 * o] += t[r + 4 * n] * i[n + 4 * o];
        }
      }
    }

    for (r = 0; r < 16; r++) {
      e[r] = s[r];
    }
  }, _.prototype.identity = function () {
    for (var t = 0; t < 16; t++) {
      this.tr[t] = t % 5 == 0 ? 1 : 0;
    }
  }, _.prototype.getArray = function () {
    return this.tr;
  }, _.prototype.getCopyMatrix = function () {
    return new Float32Array(this.tr);
  }, _.prototype.setMatrix = function (t) {
    if (null != this.tr && this.tr.length == this.tr.length) for (var i = 0; i < 16; i++) {
      this.tr[i] = t[i];
    }
  }, _.prototype.getScaleX = function () {
    return this.tr[0];
  }, _.prototype.getScaleY = function () {
    return this.tr[5];
  }, _.prototype.transformX = function (t) {
    return this.tr[0] * t + this.tr[12];
  }, _.prototype.transformY = function (t) {
    return this.tr[5] * t + this.tr[13];
  }, _.prototype.invertTransformX = function (t) {
    return (t - this.tr[12]) / this.tr[0];
  }, _.prototype.invertTransformY = function (t) {
    return (t - this.tr[13]) / this.tr[5];
  }, _.prototype.multTranslate = function (t, i) {
    var e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, i, 0, 1];

    _.mul(e, this.tr, this.tr);
  }, _.prototype.translate = function (t, i) {
    this.tr[12] = t, this.tr[13] = i;
  }, _.prototype.translateX = function (t) {
    this.tr[12] = t;
  }, _.prototype.translateY = function (t) {
    this.tr[13] = t;
  }, _.prototype.multScale = function (t, i) {
    var e = [t, 0, 0, 0, 0, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    _.mul(e, this.tr, this.tr);
  }, _.prototype.scale = function (t, i) {
    this.tr[0] = t, this.tr[5] = i;
  }, a.prototype = new _(), a.prototype.setPosition = function (t, i) {
    this.translate(t, i);
  }, a.prototype.setCenterPosition = function (t, i) {
    var e = this.width * this.getScaleX(),
        r = this.height * this.getScaleY();
    this.translate(t - e / 2, i - r / 2);
  }, a.prototype.top = function (t) {
    this.setY(t);
  }, a.prototype.bottom = function (t) {
    var i = this.height * this.getScaleY();
    this.translateY(t - i);
  }, a.prototype.left = function (t) {
    this.setX(t);
  }, a.prototype.right = function (t) {
    var i = this.width * this.getScaleX();
    this.translateX(t - i);
  }, a.prototype.centerX = function (t) {
    var i = this.width * this.getScaleX();
    this.translateX(t - i / 2);
  }, a.prototype.centerY = function (t) {
    var i = this.height * this.getScaleY();
    this.translateY(t - i / 2);
  }, a.prototype.setX = function (t) {
    this.translateX(t);
  }, a.prototype.setY = function (t) {
    this.translateY(t);
  }, a.prototype.setHeight = function (t) {
    var i = t / this.height,
        e = -i;
    this.scale(i, e);
  }, a.prototype.setWidth = function (t) {
    var i = t / this.width,
        e = -i;
    this.scale(i, e);
  }, h.prototype = new MotionQueueManager(), h.prototype.getCurrentPriority = function () {
    return this.currentPriority;
  }, h.prototype.getReservePriority = function () {
    return this.reservePriority;
  }, h.prototype.reserveMotion = function (t) {
    return !(this.reservePriority >= t) && !(this.currentPriority >= t) && (this.reservePriority = t, !0);
  }, h.prototype.setReservePriority = function (t) {
    this.reservePriority = t;
  }, h.prototype.updateParam = function (t) {
    var i = MotionQueueManager.prototype.updateParam.call(this, t);
    return this.isFinished() && (this.currentPriority = 0), i;
  }, h.prototype.startMotionPrio = function (t, i) {
    return i == this.reservePriority && (this.reservePriority = 0), this.currentPriority = i, this.startMotion(t, !1);
  }, l.load = function (t) {
    for (var i = new l(), e = c.getPlatformManager(), r = e.jsonParseFromBytes(t), o = r.physics_hair, n = o.length, s = 0; s < n; s++) {
      var _ = o[s],
          a = new PhysicsHair(),
          h = _.setup,
          $ = parseFloat(h.length),
          u = parseFloat(h.regist),
          p = parseFloat(h.mass);
      a.setup($, u, p);

      for (var f = _.src, d = f.length, g = 0; g < d; g++) {
        var y = f[g],
            m = y.id,
            T = PhysicsHair.Src.SRC_TO_X,
            P = y.ptype;
        "x" === P ? T = PhysicsHair.Src.SRC_TO_X : "y" === P ? T = PhysicsHair.Src.SRC_TO_Y : "angle" === P ? T = PhysicsHair.Src.SRC_TO_G_ANGLE : UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Src");
        var S = parseFloat(y.scale),
            v = parseFloat(y.weight);
        a.addSrcParam(T, m, S, v);
      }

      for (var L = _.targets, M = L.length, g = 0; g < M; g++) {
        var E = L[g],
            m = E.id,
            T = PhysicsHair.Target.TARGET_FROM_ANGLE,
            P = E.ptype;
        "angle" === P ? T = PhysicsHair.Target.TARGET_FROM_ANGLE : "angle_v" === P ? T = PhysicsHair.Target.TARGET_FROM_ANGLE_V : UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Target");
        var S = parseFloat(E.scale),
            v = parseFloat(E.weight);
        a.addTargetParam(T, m, S, v);
      }

      i.physicsList.push(a);
    }

    return i;
  }, l.prototype.updateParam = function (t) {
    for (var i = UtSystem.getUserTimeMSec() - this.startTimeMSec, e = 0; e < this.physicsList.length; e++) {
      this.physicsList[e].update(t, i);
    }
  }, $.load = function (t) {
    for (var i = new $(), e = c.getPlatformManager(), r = e.jsonParseFromBytes(t), o = r.parts_visible, n = o.length, s = 0; s < n; s++) {
      for (var _ = o[s], a = _.group, h = a.length, l = new Array(), p = 0; p < h; p++) {
        var f = a[p],
            d = new u(f.id);

        if (l[p] = d, null != f.link) {
          var g = f.link,
              y = g.length;
          d.link = new Array();

          for (var m = 0; m < y; m++) {
            var T = new u(g[m]);
            d.link.push(T);
          }
        }
      }

      i.partsGroups.push(l);
    }

    return i;
  }, $.prototype.updateParam = function (t) {
    if (null != t) {
      t != this.lastModel && this.initParam(t), this.lastModel = t;
      var i = UtSystem.getUserTimeMSec(),
          e = 0 == this.lastTime ? 0 : (i - this.lastTime) / 1e3;
      this.lastTime = i, e < 0 && (e = 0);

      for (var r = 0; r < this.partsGroups.length; r++) {
        this.normalizePartsOpacityGroup(t, this.partsGroups[r], e), this.copyOpacityOtherParts(t, this.partsGroups[r]);
      }
    }
  }, $.prototype.initParam = function (t) {
    if (null != t) for (var i = 0; i < this.partsGroups.length; i++) {
      for (var e = this.partsGroups[i], r = 0; r < e.length; r++) {
        e[r].initIndex(t);
        var o = e[r].partsIndex,
            n = e[r].paramIndex;

        if (!(o < 0)) {
          var s = 0 != t.getParamFloat(n);
          if (t.setPartsOpacity(o, s ? 1 : 0), t.setParamFloat(n, s ? 1 : 0), null != e[r].link) for (var _ = 0; _ < e[r].link.length; _++) {
            e[r].link[_].initIndex(t);
          }
        }
      }
    }
  }, $.prototype.normalizePartsOpacityGroup = function (t, i, e) {
    for (var r = -1, o = 1, n = 0; n < i.length; n++) {
      var s = i[n].partsIndex,
          _ = i[n].paramIndex;

      if (!(s < 0) && 0 != t.getParamFloat(_)) {
        if (r >= 0) break;
        r = n, o = t.getPartsOpacity(s), o += e / .5, o > 1 && (o = 1);
      }
    }

    r < 0 && (r = 0, o = 1);

    for (var n = 0; n < i.length; n++) {
      var s = i[n].partsIndex;
      if (!(s < 0)) if (r == n) t.setPartsOpacity(s, o);else {
        var a,
            h = t.getPartsOpacity(s);
        a = o < .5 ? -.5 * o / .5 + 1 : .5 * (1 - o) / .5;
        var l = (1 - a) * (1 - o);
        l > .15 && (a = 1 - .15 / (1 - o)), h > a && (h = a), t.setPartsOpacity(s, h);
      }
    }
  }, $.prototype.copyOpacityOtherParts = function (t, i) {
    for (var e = 0; e < i.length; e++) {
      var r = i[e];
      if (null != r.link && !(r.partsIndex < 0)) for (var o = t.getPartsOpacity(r.partsIndex), n = 0; n < r.link.length; n++) {
        var s = r.link[n];
        s.partsIndex < 0 || t.setPartsOpacity(s.partsIndex, o);
      }
    }
  }, u.prototype.initIndex = function (t) {
    this.paramIndex = t.getParamIndex("VISIBLE:" + this.id), this.partsIndex = t.getPartsDataIndex(PartsDataID.getID(this.id)), t.setParamFloat(this.paramIndex, 1);
  }, p.FRAME_RATE = 30, p.prototype.setPoint = function (t, i) {
    this.faceTargetX = t, this.faceTargetY = i;
  }, p.prototype.getX = function () {
    return this.faceX;
  }, p.prototype.getY = function () {
    return this.faceY;
  }, p.prototype.update = function () {
    var t = 40 / 7.5 / p.FRAME_RATE;
    if (0 == this.lastTimeSec) return void (this.lastTimeSec = UtSystem.getUserTimeMSec());
    var i = UtSystem.getUserTimeMSec(),
        e = (i - this.lastTimeSec) * p.FRAME_RATE / 1e3;
    this.lastTimeSec = i;
    var r = .15 * p.FRAME_RATE,
        o = e * t / r,
        n = this.faceTargetX - this.faceX,
        s = this.faceTargetY - this.faceY;

    if (!(Math.abs(n) <= this.EPSILON && Math.abs(s) <= this.EPSILON)) {
      var _ = Math.sqrt(n * n + s * s),
          a = t * n / _,
          h = t * s / _,
          l = a - this.faceVX,
          $ = h - this.faceVY,
          u = Math.sqrt(l * l + $ * $);

      (u < -o || u > o) && (l *= o / u, $ *= o / u, u = o), this.faceVX += l, this.faceVY += $;
      var f = .5 * (Math.sqrt(o * o + 16 * o * _ - 8 * o * _) - o),
          c = Math.sqrt(this.faceVX * this.faceVX + this.faceVY * this.faceVY);
      c > f && (this.faceVX *= f / c, this.faceVY *= f / c), this.faceX += this.faceVX, this.faceY += this.faceVY;
    }
  }, f.prototype = new _(), f.prototype.getMaxScale = function () {
    return this.max;
  }, f.prototype.getMinScale = function () {
    return this.min;
  }, f.prototype.setMaxScale = function (t) {
    this.max = t;
  }, f.prototype.setMinScale = function (t) {
    this.min = t;
  }, f.prototype.isMaxScale = function () {
    return this.getScaleX() == this.max;
  }, f.prototype.isMinScale = function () {
    return this.getScaleX() == this.min;
  }, f.prototype.adjustTranslate = function (t, i) {
    this.tr[0] * this.maxLeft + (this.tr[12] + t) > this.screenLeft && (t = this.screenLeft - this.tr[0] * this.maxLeft - this.tr[12]), this.tr[0] * this.maxRight + (this.tr[12] + t) < this.screenRight && (t = this.screenRight - this.tr[0] * this.maxRight - this.tr[12]), this.tr[5] * this.maxTop + (this.tr[13] + i) < this.screenTop && (i = this.screenTop - this.tr[5] * this.maxTop - this.tr[13]), this.tr[5] * this.maxBottom + (this.tr[13] + i) > this.screenBottom && (i = this.screenBottom - this.tr[5] * this.maxBottom - this.tr[13]);
    var e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, i, 0, 1];

    _.mul(e, this.tr, this.tr);
  }, f.prototype.adjustScale = function (t, i, e) {
    var r = e * this.tr[0];
    r < this.min ? this.tr[0] > 0 && (e = this.min / this.tr[0]) : r > this.max && this.tr[0] > 0 && (e = this.max / this.tr[0]);
    var o = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, i, 0, 1],
        n = [e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        s = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -t, -i, 0, 1];
    _.mul(s, this.tr, this.tr), _.mul(n, this.tr, this.tr), _.mul(o, this.tr, this.tr);
  }, f.prototype.setScreenRect = function (t, i, e, r) {
    this.screenLeft = t, this.screenRight = i, this.screenTop = r, this.screenBottom = e;
  }, f.prototype.setMaxScreenRect = function (t, i, e, r) {
    this.maxLeft = t, this.maxRight = i, this.maxTop = r, this.maxBottom = e;
  }, f.prototype.getScreenLeft = function () {
    return this.screenLeft;
  }, f.prototype.getScreenRight = function () {
    return this.screenRight;
  }, f.prototype.getScreenBottom = function () {
    return this.screenBottom;
  }, f.prototype.getScreenTop = function () {
    return this.screenTop;
  }, f.prototype.getMaxLeft = function () {
    return this.maxLeft;
  }, f.prototype.getMaxRight = function () {
    return this.maxRight;
  }, f.prototype.getMaxBottom = function () {
    return this.maxBottom;
  }, f.prototype.getMaxTop = function () {
    return this.maxTop;
  }, c.platformManager = null, c.getPlatformManager = function () {
    return c.platformManager;
  }, c.setPlatformManager = function (t) {
    c.platformManager = t;
  }, t.exports = {
    L2DTargetPoint: p,
    Live2DFramework: c,
    L2DViewMatrix: f,
    L2DPose: $,
    L2DPartsParam: u,
    L2DPhysics: l,
    L2DMotionManager: h,
    L2DModelMatrix: a,
    L2DMatrix44: _,
    EYE_STATE: g,
    L2DEyeBlink: s,
    L2DExpressionParam: n,
    L2DExpressionMotion: o,
    L2DBaseModel: r
  };
}, function (t, i, e) {
  "use strict";

  var r = {
    DEBUG_LOG: !1,
    DEBUG_MOUSE_LOG: !1,
    DEBUG_DRAW_HIT_AREA: !1,
    DEBUG_DRAW_ALPHA_MODEL: !1,
    VIEW_MAX_SCALE: 2,
    VIEW_MIN_SCALE: .8,
    VIEW_LOGICAL_LEFT: -1,
    VIEW_LOGICAL_RIGHT: 1,
    VIEW_LOGICAL_MAX_LEFT: -2,
    VIEW_LOGICAL_MAX_RIGHT: 2,
    VIEW_LOGICAL_MAX_BOTTOM: -2,
    VIEW_LOGICAL_MAX_TOP: 2,
    PRIORITY_NONE: 0,
    PRIORITY_IDLE: 1,
    PRIORITY_SLEEPY: 2,
    PRIORITY_NORMAL: 3,
    PRIORITY_FORCE: 4,
    MOTION_GROUP_IDLE: "idle",
    MOTION_GROUP_SLEEPY: "sleepy",
    MOTION_GROUP_TAP_BODY: "tap_body",
    MOTION_GROUP_FLICK_HEAD: "flick_head",
    MOTION_GROUP_PINCH_IN: "pinch_in",
    MOTION_GROUP_PINCH_OUT: "pinch_out",
    MOTION_GROUP_SHAKE: "shake",
    HIT_AREA_HEAD: "head",
    HIT_AREA_BODY: "body"
  };
  t.exports = r;
}, function (t, i, e) {
  "use strict";

  function r(t) {
    n = t;
  }

  function o() {
    return n;
  }

  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.setContext = r, i.getContext = o;
  var n = void 0;
}, function (t, i, e) {
  "use strict";

  function r() {}

  r.matrixStack = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], r.depth = 0, r.currentMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], r.tmp = new Array(16), r.reset = function () {
    this.depth = 0;
  }, r.loadIdentity = function () {
    for (var t = 0; t < 16; t++) {
      this.currentMatrix[t] = t % 5 == 0 ? 1 : 0;
    }
  }, r.push = function () {
    var t = (this.depth, 16 * (this.depth + 1));
    this.matrixStack.length < t + 16 && (this.matrixStack.length = t + 16);

    for (var i = 0; i < 16; i++) {
      this.matrixStack[t + i] = this.currentMatrix[i];
    }

    this.depth++;
  }, r.pop = function () {
    --this.depth < 0 && (myError("Invalid matrix stack."), this.depth = 0);

    for (var t = 16 * this.depth, i = 0; i < 16; i++) {
      this.currentMatrix[i] = this.matrixStack[t + i];
    }
  }, r.getMatrix = function () {
    return this.currentMatrix;
  }, r.multMatrix = function (t) {
    var i, e, r;

    for (i = 0; i < 16; i++) {
      this.tmp[i] = 0;
    }

    for (i = 0; i < 4; i++) {
      for (e = 0; e < 4; e++) {
        for (r = 0; r < 4; r++) {
          this.tmp[i + 4 * e] += this.currentMatrix[i + 4 * r] * t[r + 4 * e];
        }
      }
    }

    for (i = 0; i < 16; i++) {
      this.currentMatrix[i] = this.tmp[i];
    }
  }, t.exports = r;
}, function (t, i, e) {
  t.exports = e(5);
}, function (t, i, e) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function o(t) {
    C = document.getElementById(t), C.addEventListener && (window.addEventListener("click", g), window.addEventListener("mousedown", g), window.addEventListener("mousemove", g), window.addEventListener("mouseup", g), document.addEventListener("mouseout", g), window.addEventListener("touchstart", y), window.addEventListener("touchend", y), window.addEventListener("touchmove", y));
  }

  function n(t) {
    var i = C.width,
        e = C.height;
    N = new M.L2DTargetPoint();

    var r = e / i,
        o = w.default.VIEW_LOGICAL_LEFT,
        n = w.default.VIEW_LOGICAL_RIGHT,
        _ = -r,
        h = r;

    if (window.Live2D.captureFrame = !1, B = new M.L2DViewMatrix(), B.setScreenRect(o, n, _, h), B.setMaxScreenRect(w.default.VIEW_LOGICAL_MAX_LEFT, w.default.VIEW_LOGICAL_MAX_RIGHT, w.default.VIEW_LOGICAL_MAX_BOTTOM, w.default.VIEW_LOGICAL_MAX_TOP), B.setMaxScale(w.default.VIEW_MAX_SCALE), B.setMinScale(w.default.VIEW_MIN_SCALE), U = new M.L2DMatrix44(), U.multScale(1, i / e), G = new M.L2DMatrix44(), G.multTranslate(-i / 2, -e / 2), G.multScale(2 / i, -2 / i), F = v(), (0, D.setContext)(F), !F) return console.error("Failed to create WebGL context."), void (window.WebGLRenderingContext && console.error("Your browser don't support WebGL, check https://get.webgl.org/ for futher information."));
    window.Live2D.setGL(F), F.clearColor(0, 0, 0, 0), a(t), s();
  }

  function s() {
    b || (b = !0, function t() {
      _();

      var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

      if (window.Live2D.captureFrame) {
        window.Live2D.captureFrame = !1;
        var e = document.createElement("a");
        document.body.appendChild(e), e.setAttribute("type", "hidden"), e.href = C.toDataURL(), e.download = window.Live2D.captureName || "live2d.png", e.click();
      }

      i(t, C);
    }());
  }

  function _() {
    O.default.reset(), O.default.loadIdentity(), N.update(), R.setDrag(N.getX(), N.getY()), F.clear(F.COLOR_BUFFER_BIT), O.default.multMatrix(U.getArray()), O.default.multMatrix(B.getArray()), O.default.push();

    for (var t = 0; t < R.numModels(); t++) {
      var i = R.getModel(t);
      if (null == i) return;
      i.initialized && !i.updating && (i.update(), i.draw(F));
    }

    O.default.pop();
  }

  function a(t) {
    R.reloadFlg = !0, R.count++, R.changeModel(F, t);
  }

  function h(t, i) {
    return t.x * i.x + t.y * i.y;
  }

  function l(t, i) {
    var e = Math.sqrt(t * t + i * i);
    return {
      x: t / e,
      y: i / e
    };
  }

  function $(t, i, e) {
    function r(t, i) {
      return 180 * Math.acos(h({
        x: 0,
        y: 1
      }, l(t, i))) / Math.PI;
    }

    if (i.x < e.left + e.width && i.y < e.top + e.height && i.x > e.left && i.y > e.top) return i;
    var o = t.x - i.x,
        n = t.y - i.y,
        s = r(o, n);
    i.x < t.x && (s = 360 - s);

    var _ = 360 - r(e.left - t.x, -1 * (e.top - t.y)),
        a = 360 - r(e.left - t.x, -1 * (e.top + e.height - t.y)),
        $ = r(e.left + e.width - t.x, -1 * (e.top - t.y)),
        u = r(e.left + e.width - t.x, -1 * (e.top + e.height - t.y)),
        p = n / o,
        f = {};

    if (s < $) {
      var c = e.top - t.y,
          d = c / p;
      f = {
        y: t.y + c,
        x: t.x + d
      };
    } else if (s < u) {
      var g = e.left + e.width - t.x,
          y = g * p;
      f = {
        y: t.y + y,
        x: t.x + g
      };
    } else if (s < a) {
      var m = e.top + e.height - t.y,
          T = m / p;
      f = {
        y: t.y + m,
        x: t.x + T
      };
    } else if (s < _) {
      var P = t.x - e.left,
          S = P * p;
      f = {
        y: t.y - S,
        x: t.x - P
      };
    } else {
      var v = e.top - t.y,
          L = v / p;
      f = {
        y: t.y + v,
        x: t.x + L
      };
    }

    return f;
  }

  function u(t) {
    Y = !0;
    var i = C.getBoundingClientRect(),
        e = P(t.clientX - i.left),
        r = S(t.clientY - i.top),
        o = $({
      x: i.left + i.width / 2,
      y: i.top + i.height * X
    }, {
      x: t.clientX,
      y: t.clientY
    }, i),
        n = m(o.x - i.left),
        s = T(o.y - i.top);
    w.default.DEBUG_MOUSE_LOG && console.log("onMouseMove device( x:" + t.clientX + " y:" + t.clientY + " ) view( x:" + n + " y:" + s + ")"), k = e, V = r, N.setPoint(n, s);
  }

  function p(t) {
    Y = !0;
    var i = C.getBoundingClientRect(),
        e = P(t.clientX - i.left),
        r = S(t.clientY - i.top),
        o = $({
      x: i.left + i.width / 2,
      y: i.top + i.height * X
    }, {
      x: t.clientX,
      y: t.clientY
    }, i),
        n = m(o.x - i.left),
        s = T(o.y - i.top);
    w.default.DEBUG_MOUSE_LOG && console.log("onMouseDown device( x:" + t.clientX + " y:" + t.clientY + " ) view( x:" + n + " y:" + s + ")"), k = e, V = r, R.tapEvent(n, s);
  }

  function f(t) {
    var i = C.getBoundingClientRect(),
        e = P(t.clientX - i.left),
        r = S(t.clientY - i.top),
        o = $({
      x: i.left + i.width / 2,
      y: i.top + i.height * X
    }, {
      x: t.clientX,
      y: t.clientY
    }, i),
        n = m(o.x - i.left),
        s = T(o.y - i.top);
    w.default.DEBUG_MOUSE_LOG && console.log("onMouseMove device( x:" + t.clientX + " y:" + t.clientY + " ) view( x:" + n + " y:" + s + ")"), Y && (k = e, V = r, N.setPoint(n, s));
  }

  function c() {
    Y && (Y = !1), N.setPoint(0, 0);
  }

  function d() {
    w.default.DEBUG_LOG && console.log("Set Session Storage."), sessionStorage.setItem("Sleepy", "1");
  }

  function g(t) {
    if ("mousewheel" == t.type) ;else if ("mousedown" == t.type) p(t);else if ("mousemove" == t.type) {
      var i = sessionStorage.getItem("Sleepy");
      "1" === i && sessionStorage.setItem("Sleepy", "0"), u(t);
    } else if ("mouseup" == t.type) {
      if ("button" in t && 0 != t.button) return;
    } else if ("mouseout" == t.type) {
      w.default.DEBUG_LOG && console.log("Mouse out Window."), c();
      var e = sessionStorage.getItem("SleepyTimer");
      window.clearTimeout(e), e = window.setTimeout(d, 5e4), sessionStorage.setItem("SleepyTimer", e);
    }
  }

  function y(t) {
    var i = t.touches[0];
    "touchstart" == t.type ? 1 == t.touches.length && u(i) : "touchmove" == t.type ? f(i) : "touchend" == t.type && c();
  }

  function m(t) {
    var i = G.transformX(t);
    return B.invertTransformX(i);
  }

  function T(t) {
    var i = G.transformY(t);
    return B.invertTransformY(i);
  }

  function P(t) {
    return G.transformX(t);
  }

  function S(t) {
    return G.transformY(t);
  }

  function v() {
    for (var t = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], i = 0; i < t.length; i++) {
      try {
        var e = C.getContext(t[i], {
          premultipliedAlpha: !0
        });
        if (e) return e;
      } catch (t) {}
    }

    return null;
  }

  function L(t, i, e) {
    X = void 0 === e ? .5 : e, o(t), n(i);
  }

  e(6);
  var M = e(0),
      E = e(8),
      A = r(E),
      I = e(1),
      w = r(I),
      x = e(3),
      O = r(x),
      D = e(2),
      R = (window.navigator.platform.toLowerCase(), new A.default()),
      b = !1,
      F = null,
      C = null,
      N = null,
      B = null,
      U = null,
      G = null,
      Y = !1,
      k = 0,
      V = 0,
      X = .5;
  window.loadlive2d = L;
}, function (t, i, e) {
  "use strict";

  (function (t) {
    !function () {
      function i() {
        At || (this._$MT = null, this._$5S = null, this._$NP = 0, i._$42++, this._$5S = new Y(this));
      }

      function e(t) {
        if (!At) {
          this.clipContextList = new Array(), this.glcontext = t.gl, this.dp_webgl = t, this.curFrameNo = 0, this.firstError_clipInNotUpdate = !0, this.colorBuffer = 0, this.isInitGLFBFunc = !1, this.tmpBoundsOnModel = new S(), at.glContext.length > at.frameBuffers.length && (this.curFrameNo = this.getMaskRenderTexture()), this.tmpModelToViewMatrix = new R(), this.tmpMatrix2 = new R(), this.tmpMatrixForMask = new R(), this.tmpMatrixForDraw = new R(), this.CHANNEL_COLORS = new Array();
          var i = new A();
          i = new A(), i.r = 0, i.g = 0, i.b = 0, i.a = 1, this.CHANNEL_COLORS.push(i), i = new A(), i.r = 1, i.g = 0, i.b = 0, i.a = 0, this.CHANNEL_COLORS.push(i), i = new A(), i.r = 0, i.g = 1, i.b = 0, i.a = 0, this.CHANNEL_COLORS.push(i), i = new A(), i.r = 0, i.g = 0, i.b = 1, i.a = 0, this.CHANNEL_COLORS.push(i);

          for (var e = 0; e < this.CHANNEL_COLORS.length; e++) {
            this.dp_webgl.setChannelFlagAsColor(e, this.CHANNEL_COLORS[e]);
          }
        }
      }

      function r(t, i, e) {
        this.clipIDList = new Array(), this.clipIDList = e, this.clippingMaskDrawIndexList = new Array();

        for (var r = 0; r < e.length; r++) {
          this.clippingMaskDrawIndexList.push(i.getDrawDataIndex(e[r]));
        }

        this.clippedDrawContextList = new Array(), this.isUsing = !0, this.layoutChannelNo = 0, this.layoutBounds = new S(), this.allClippedDrawRect = new S(), this.matrixForMask = new Float32Array(16), this.matrixForDraw = new Float32Array(16), this.owner = t;
      }

      function o(t, i) {
        this._$gP = t, this.drawDataIndex = i;
      }

      function n() {
        At || (this.color = null);
      }

      function s() {
        At || (this._$dP = null, this._$eo = null, this._$V0 = null, this._$dP = 1e3, this._$eo = 1e3, this._$V0 = 1, this._$a0());
      }

      function _() {}

      function a() {
        this._$r = null, this._$0S = null;
      }

      function h() {
        At || (this.x = null, this.y = null, this.width = null, this.height = null);
      }

      function l(t) {
        At || et.prototype.constructor.call(this, t);
      }

      function $() {}

      function u(t) {
        At || et.prototype.constructor.call(this, t);
      }

      function p() {
        At || (this._$vo = null, this._$F2 = null, this._$ao = 400, this._$1S = 400, p._$42++);
      }

      function f() {
        At || (this.p1 = new c(), this.p2 = new c(), this._$Fo = 0, this._$Db = 0, this._$L2 = 0, this._$M2 = 0, this._$ks = 0, this._$9b = 0, this._$iP = 0, this._$iT = 0, this._$lL = new Array(), this._$qP = new Array(), this.setup(.3, .5, .1));
      }

      function c() {
        this._$p = 1, this.x = 0, this.y = 0, this.vx = 0, this.vy = 0, this.ax = 0, this.ay = 0, this.fx = 0, this.fy = 0, this._$s0 = 0, this._$70 = 0, this._$7L = 0, this._$HL = 0;
      }

      function d(t, i, e) {
        this._$wL = null, this.scale = null, this._$V0 = null, this._$wL = t, this.scale = i, this._$V0 = e;
      }

      function g(t, i, e, r) {
        d.prototype.constructor.call(this, i, e, r), this._$tL = null, this._$tL = t;
      }

      function y(t, i, e) {
        this._$wL = null, this.scale = null, this._$V0 = null, this._$wL = t, this.scale = i, this._$V0 = e;
      }

      function T(t, i, e, r) {
        y.prototype.constructor.call(this, i, e, r), this._$YP = null, this._$YP = t;
      }

      function P() {
        At || (this._$fL = 0, this._$gL = 0, this._$B0 = 1, this._$z0 = 1, this._$qT = 0, this.reflectX = !1, this.reflectY = !1);
      }

      function S() {
        At || (this.x = null, this.y = null, this.width = null, this.height = null);
      }

      function v() {}

      function L() {
        At || (this.x = null, this.y = null);
      }

      function M() {
        At || (this._$gP = null, this._$dr = null, this._$GS = null, this._$qb = null, this._$Lb = null, this._$mS = null, this.clipID = null, this.clipIDList = new Array());
      }

      function E() {
        At || (this._$Eb = E._$ps, this._$lT = 1, this._$C0 = 1, this._$tT = 1, this._$WL = 1, this.culling = !1, this.matrix4x4 = new Float32Array(16), this.premultipliedAlpha = !1, this.anisotropy = 0, this.clippingProcess = E.CLIPPING_PROCESS_NONE, this.clipBufPre_clipContextMask = null, this.clipBufPre_clipContextDraw = null, this.CHANNEL_COLORS = new Array());
      }

      function A() {
        At || (this.a = 1, this.r = 1, this.g = 1, this.b = 1, this.scale = 1, this._$ho = 1, this.blendMode = at.L2D_COLOR_BLEND_MODE_MULT);
      }

      function I() {
        At || (this._$kP = null, this._$dr = null, this._$Ai = !0, this._$mS = null);
      }

      function w() {}

      function x() {
        At || (this._$VP = 0, this._$wL = null, this._$GP = null, this._$8o = x._$ds, this._$2r = -1, this._$O2 = 0, this._$ri = 0);
      }

      function O() {}

      function D() {
        At || (this._$Ob = null);
      }

      function R() {
        this.m = new Float32Array(16), this.identity();
      }

      function b(t) {
        At || et.prototype.constructor.call(this, t);
      }

      function F() {
        At || (this._$7 = 1, this._$f = 0, this._$H = 0, this._$g = 1, this._$k = 0, this._$w = 0, this._$hi = STATE_IDENTITY, this._$Z = _$pS);
      }

      function C() {
        At || (s.prototype.constructor.call(this), this.motions = new Array(), this._$7r = null, this._$7r = C._$Co++, this._$D0 = 30, this._$yT = 0, this._$E = !0, this.loopFadeIn = !0, this._$AS = -1, _$a0());
      }

      function N() {
        this._$P = new Float32Array(100), this.size = 0;
      }

      function B() {
        this._$4P = null, this._$I0 = null, this._$RP = null;
      }

      function U() {}

      function G() {}

      function Y(t) {
        At || (this._$QT = !0, this._$co = -1, this._$qo = 0, this._$pb = new Array(Y._$is), this._$_2 = new Float32Array(Y._$is), this._$vr = new Float32Array(Y._$is), this._$Rr = new Float32Array(Y._$is), this._$Or = new Float32Array(Y._$is), this._$fs = new Float32Array(Y._$is), this._$Js = new Array(Y._$is), this._$3S = new Array(), this._$aS = new Array(), this._$Bo = null, this._$F2 = new Array(), this._$db = new Array(), this._$8b = new Array(), this._$Hr = new Array(), this._$Ws = null, this._$Vs = null, this._$Er = null, this._$Es = new Int16Array(U._$Qb), this._$ZP = new Float32Array(2 * U._$1r), this._$Ri = t, this._$b0 = Y._$HP++, this.clipManager = null, this.dp_webgl = null);
      }

      function k() {}

      function V() {
        At || (this._$12 = null, this._$bb = null, this._$_L = null, this._$jo = null, this._$iL = null, this._$0L = null, this._$Br = null, this._$Dr = null, this._$Cb = null, this._$mr = null, this._$_L = wt.STATE_FIRST, this._$Br = 4e3, this._$Dr = 100, this._$Cb = 50, this._$mr = 150, this._$jo = !0, this._$iL = "PARAM_EYE_L_OPEN", this._$0L = "PARAM_EYE_R_OPEN");
      }

      function X() {
        At || (E.prototype.constructor.call(this), this._$sb = new Int32Array(X._$As), this._$U2 = new Array(), this.transform = null, this.gl = null, null == X._$NT && (X._$NT = X._$9r(256), X._$vS = X._$9r(256), X._$no = X._$vb(256)));
      }

      function z() {
        At || (I.prototype.constructor.call(this), this._$GS = null, this._$Y0 = null);
      }

      function H(t) {
        _t.prototype.constructor.call(this, t), this._$8r = I._$ur, this._$Yr = null, this._$Wr = null;
      }

      function W() {
        At || (M.prototype.constructor.call(this), this._$gP = null, this._$dr = null, this._$GS = null, this._$qb = null, this._$Lb = null, this._$mS = null);
      }

      function j() {
        At || (this._$NL = null, this._$3S = null, this._$aS = null, j._$42++);
      }

      function q() {
        At || (i.prototype.constructor.call(this), this._$zo = new X());
      }

      function J() {
        At || (s.prototype.constructor.call(this), this.motions = new Array(), this._$o2 = null, this._$7r = J._$Co++, this._$D0 = 30, this._$yT = 0, this._$E = !1, this.loopFadeIn = !0, this._$rr = -1, this._$eP = 0);
      }

      function Q(t, i) {
        return String.fromCharCode(t.getUint8(i));
      }

      function N() {
        this._$P = new Float32Array(100), this.size = 0;
      }

      function B() {
        this._$4P = null, this._$I0 = null, this._$RP = null;
      }

      function Z() {
        At || (I.prototype.constructor.call(this), this._$o = 0, this._$A = 0, this._$GS = null, this._$Eo = null);
      }

      function K(t) {
        _t.prototype.constructor.call(this, t), this._$8r = I._$ur, this._$Cr = null, this._$hr = null;
      }

      function tt() {
        At || (this.visible = !0, this._$g0 = !1, this._$NL = null, this._$3S = null, this._$aS = null, tt._$42++);
      }

      function it(t) {
        this._$VS = null, this._$e0 = null, this._$e0 = t;
      }

      function et(t) {
        At || (this.id = t);
      }

      function rt() {}

      function ot() {
        At || (this._$4S = null);
      }

      function nt(t, i) {
        this.canvas = t, this.context = i, this.viewport = new Array(0, 0, t.width, t.height), this._$6r = 1, this._$xP = 0, this._$3r = 1, this._$uP = 0, this._$Qo = -1, this.cacheImages = {};
      }

      function st() {
        At || (this._$TT = null, this._$LT = null, this._$FS = null, this._$wL = null);
      }

      function _t(t) {
        At || (this._$e0 = null, this._$IP = null, this._$JS = !1, this._$AT = !0, this._$e0 = t, this.totalScale = 1, this._$7s = 1, this.totalOpacity = 1);
      }

      function at() {}

      function ht() {}

      function lt(t) {
        At || (this._$ib = t);
      }

      function $t() {
        At || (W.prototype.constructor.call(this), this._$LP = -1, this._$d0 = 0, this._$Yo = 0, this._$JP = null, this._$5P = null, this._$BP = null, this._$Eo = null, this._$Qi = null, this._$6s = $t._$ms, this.culling = !0, this.gl_cacheImage = null, this.instanceNo = $t._$42++);
      }

      function ut(t) {
        Mt.prototype.constructor.call(this, t), this._$8r = W._$ur, this._$Cr = null, this._$hr = null;
      }

      function pt() {
        At || (this.x = null, this.y = null);
      }

      function ft(t) {
        At || (i.prototype.constructor.call(this), this.drawParamWebGL = new mt(t), this.drawParamWebGL.setGL(at.getGL(t)));
      }

      function ct() {
        At || (this.motions = null, this._$eb = !1, this.motions = new Array());
      }

      function dt() {
        this._$w0 = null, this._$AT = !0, this._$9L = !1, this._$z2 = -1, this._$bs = -1, this._$Do = -1, this._$sr = null, this._$sr = dt._$Gs++;
      }

      function gt() {
        this.m = new Array(1, 0, 0, 0, 1, 0, 0, 0, 1);
      }

      function yt(t) {
        At || et.prototype.constructor.call(this, t);
      }

      function mt(t) {
        At || (E.prototype.constructor.call(this), this.textures = new Array(), this.transform = null, this.gl = null, this.glno = t, this.firstDraw = !0, this.anisotropyExt = null, this.maxAnisotropy = 0, this._$As = 32, this._$Gr = !1, this._$NT = null, this._$vS = null, this._$no = null, this.vertShader = null, this.fragShader = null, this.vertShaderOff = null, this.fragShaderOff = null);
      }

      function Tt(t, i, e) {
        return null == i && (i = t.createBuffer()), t.bindBuffer(t.ARRAY_BUFFER, i), t.bufferData(t.ARRAY_BUFFER, e, t.DYNAMIC_DRAW), i;
      }

      function Pt(t, i, e) {
        return null == i && (i = t.createBuffer()), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i), t.bufferData(t.ELEMENT_ARRAY_BUFFER, e, t.DYNAMIC_DRAW), i;
      }

      function St(t) {
        At || (this._$P = new Int8Array(8), this._$R0 = new DataView(this._$P.buffer), this._$3i = new Int8Array(1e3), this._$hL = 0, this._$v0 = 0, this._$S2 = 0, this._$Ko = new Array(), this._$T = t, this._$F = 0);
      }

      function vt() {}

      function Lt() {}

      function Mt(t) {
        At || (this._$e0 = null, this._$IP = null, this._$Us = null, this._$7s = null, this._$IS = [!1], this._$VS = null, this._$AT = !0, this.baseOpacity = 1, this.clipBufPre_clipContext = null, this._$e0 = t);
      }

      function Et() {}

      var At = !0;
      i._$0s = 1, i._$4s = 2, i._$42 = 0, i._$62 = function (t, e) {
        try {
          if (e instanceof ArrayBuffer && (e = new DataView(e)), !(e instanceof DataView)) throw new lt("_$SS#loadModel(b) / b _$x be DataView or ArrayBuffer");

          var r,
              o = new St(e),
              n = o._$ST(),
              s = o._$ST(),
              a = o._$ST();

          if (109 != n || 111 != s || 99 != a) throw new lt("_$gi _$C _$li , _$Q0 _$P0.");

          if (r = o._$ST(), o._$gr(r), r > G._$T7) {
            t._$NP |= i._$4s;
            throw new lt("_$gi _$C _$li , _$n0 _$_ version _$li ( SDK : " + G._$T7 + " < _$f0 : " + r + " )@_$SS#loadModel()\n");
          }

          var h = o._$nP();

          if (r >= G._$s7) {
            var l = o._$9T(),
                $ = o._$9T();

            if (-30584 != l || -30584 != $) throw t._$NP |= i._$0s, new lt("_$gi _$C _$li , _$0 _$6 _$Ui.");
          }

          t._$KS(h);

          var u = t.getModelContext();
          u.setDrawParam(t.getDrawParam()), u.init();
        } catch (t) {
          _._$Rb(t);
        }
      }, i.prototype._$KS = function (t) {
        this._$MT = t;
      }, i.prototype.getModelImpl = function () {
        return null == this._$MT && (this._$MT = new p(), this._$MT._$zP()), this._$MT;
      }, i.prototype.getCanvasWidth = function () {
        return null == this._$MT ? 0 : this._$MT.getCanvasWidth();
      }, i.prototype.getCanvasHeight = function () {
        return null == this._$MT ? 0 : this._$MT.getCanvasHeight();
      }, i.prototype.getParamFloat = function (t) {
        return "number" != typeof t && (t = this._$5S.getParamIndex(u.getID(t))), this._$5S.getParamFloat(t);
      }, i.prototype.setParamFloat = function (t, i, e) {
        "number" != typeof t && (t = this._$5S.getParamIndex(u.getID(t))), arguments.length < 3 && (e = 1), this._$5S.setParamFloat(t, this._$5S.getParamFloat(t) * (1 - e) + i * e);
      }, i.prototype.addToParamFloat = function (t, i, e) {
        "number" != typeof t && (t = this._$5S.getParamIndex(u.getID(t))), arguments.length < 3 && (e = 1), this._$5S.setParamFloat(t, this._$5S.getParamFloat(t) + i * e);
      }, i.prototype.multParamFloat = function (t, i, e) {
        "number" != typeof t && (t = this._$5S.getParamIndex(u.getID(t))), arguments.length < 3 && (e = 1), this._$5S.setParamFloat(t, this._$5S.getParamFloat(t) * (1 + (i - 1) * e));
      }, i.prototype.getParamIndex = function (t) {
        return this._$5S.getParamIndex(u.getID(t));
      }, i.prototype.loadParam = function () {
        this._$5S.loadParam();
      }, i.prototype.saveParam = function () {
        this._$5S.saveParam();
      }, i.prototype.init = function () {
        this._$5S.init();
      }, i.prototype.update = function () {
        this._$5S.update();
      }, i.prototype._$Rs = function () {
        return _._$li("_$60 _$PT _$Rs()"), -1;
      }, i.prototype._$Ds = function (t) {
        _._$li("_$60 _$PT _$SS#_$Ds() \n");
      }, i.prototype._$K2 = function () {}, i.prototype.draw = function () {}, i.prototype.getModelContext = function () {
        return this._$5S;
      }, i.prototype._$s2 = function () {
        return this._$NP;
      }, i.prototype._$P7 = function (t, i, e, r) {
        var o = -1,
            n = 0,
            s = this;
        if (0 != e) {
          if (1 == t.length) {
            var _ = t[0],
                a = 0 != s.getParamFloat(_),
                h = i[0],
                l = s.getPartsOpacity(h),
                $ = e / r;
            a ? (l += $) > 1 && (l = 1) : (l -= $) < 0 && (l = 0), s.setPartsOpacity(h, l);
          } else {
            for (var u = 0; u < t.length; u++) {
              var _ = t[u],
                  p = 0 != s.getParamFloat(_);

              if (p) {
                if (o >= 0) break;
                o = u;
                var h = i[u];
                n = s.getPartsOpacity(h), n += e / r, n > 1 && (n = 1);
              }
            }

            o < 0 && (console.log("No _$wi _$q0/ _$U default[%s]", t[0]), o = 0, n = 1, s.loadParam(), s.setParamFloat(t[o], n), s.saveParam());

            for (var u = 0; u < t.length; u++) {
              var h = i[u];
              if (o == u) s.setPartsOpacity(h, n);else {
                var f,
                    c = s.getPartsOpacity(h);
                f = n < .5 ? -.5 * n / .5 + 1 : .5 * (1 - n) / .5;
                var d = (1 - f) * (1 - n);
                d > .15 && (f = 1 - .15 / (1 - n)), c > f && (c = f), s.setPartsOpacity(h, c);
              }
            }
          }
        } else for (var u = 0; u < t.length; u++) {
          var _ = t[u],
              h = i[u],
              p = 0 != s.getParamFloat(_);
          s.setPartsOpacity(h, p ? 1 : 0);
        }
      }, i.prototype.setPartsOpacity = function (t, i) {
        "number" != typeof t && (t = this._$5S.getPartsDataIndex(l.getID(t))), this._$5S.setPartsOpacity(t, i);
      }, i.prototype.getPartsDataIndex = function (t) {
        return t instanceof l || (t = l.getID(t)), this._$5S.getPartsDataIndex(t);
      }, i.prototype.getPartsOpacity = function (t) {
        return "number" != typeof t && (t = this._$5S.getPartsDataIndex(l.getID(t))), t < 0 ? 0 : this._$5S.getPartsOpacity(t);
      }, i.prototype.getDrawParam = function () {}, i.prototype.getDrawDataIndex = function (t) {
        return this._$5S.getDrawDataIndex(b.getID(t));
      }, i.prototype.getDrawData = function (t) {
        return this._$5S.getDrawData(t);
      }, i.prototype.getTransformedPoints = function (t) {
        var i = this._$5S._$C2(t);

        return i instanceof ut ? i.getTransformedPoints() : null;
      }, i.prototype.getIndexArray = function (t) {
        if (t < 0 || t >= this._$5S._$aS.length) return null;
        var i = this._$5S._$aS[t];
        return null != i && i.getType() == W._$wb && i instanceof $t ? i.getIndexArray() : null;
      }, e.CHANNEL_COUNT = 4, e.RENDER_TEXTURE_USE_MIPMAP = !1, e.NOT_USED_FRAME = -100, e.prototype._$L7 = function () {
        if (this.tmpModelToViewMatrix && (this.tmpModelToViewMatrix = null), this.tmpMatrix2 && (this.tmpMatrix2 = null), this.tmpMatrixForMask && (this.tmpMatrixForMask = null), this.tmpMatrixForDraw && (this.tmpMatrixForDraw = null), this.tmpBoundsOnModel && (this.tmpBoundsOnModel = null), this.CHANNEL_COLORS) {
          for (var t = this.CHANNEL_COLORS.length - 1; t >= 0; --t) {
            this.CHANNEL_COLORS.splice(t, 1);
          }

          this.CHANNEL_COLORS = [];
        }

        this.releaseShader();
      }, e.prototype.releaseShader = function () {
        for (var t = at.frameBuffers.length, i = 0; i < t; i++) {
          this.gl.deleteFramebuffer(at.frameBuffers[i].framebuffer);
        }

        at.frameBuffers = [], at.glContext = [];
      }, e.prototype.init = function (t, i, e) {
        for (var o = 0; o < i.length; o++) {
          var n = i[o].getClipIDList();

          if (null != n) {
            var s = this.findSameClip(n);
            null == s && (s = new r(this, t, n), this.clipContextList.push(s));

            var _ = i[o].getDrawDataID(),
                a = t.getDrawDataIndex(_);

            s.addClippedDrawData(_, a);
            e[o].clipBufPre_clipContext = s;
          }
        }
      }, e.prototype.getMaskRenderTexture = function () {
        var t = null;
        return t = this.dp_webgl.createFramebuffer(), at.frameBuffers[this.dp_webgl.glno] = t, this.dp_webgl.glno;
      }, e.prototype.setupClip = function (t, i) {
        for (var e = 0, r = 0; r < this.clipContextList.length; r++) {
          var o = this.clipContextList[r];
          this.calcClippedDrawTotalBounds(t, o), o.isUsing && e++;
        }

        if (e > 0) {
          var n = i.gl.getParameter(i.gl.FRAMEBUFFER_BINDING),
              s = new Array(4);
          s[0] = 0, s[1] = 0, s[2] = i.gl.canvas.width, s[3] = i.gl.canvas.height, i.gl.viewport(0, 0, at.clippingMaskBufferSize, at.clippingMaskBufferSize), this.setupLayoutBounds(e), i.gl.bindFramebuffer(i.gl.FRAMEBUFFER, at.frameBuffers[this.curFrameNo].framebuffer), i.gl.clearColor(0, 0, 0, 0), i.gl.clear(i.gl.COLOR_BUFFER_BIT);

          for (var r = 0; r < this.clipContextList.length; r++) {
            var o = this.clipContextList[r],
                _ = o.allClippedDrawRect,
                a = (o.layoutChannelNo, o.layoutBounds);
            this.tmpBoundsOnModel._$jL(_), this.tmpBoundsOnModel.expand(.05 * _.width, .05 * _.height);
            var h = a.width / this.tmpBoundsOnModel.width,
                l = a.height / this.tmpBoundsOnModel.height;
            this.tmpMatrix2.identity(), this.tmpMatrix2.translate(-1, -1, 0), this.tmpMatrix2.scale(2, 2, 1), this.tmpMatrix2.translate(a.x, a.y, 0), this.tmpMatrix2.scale(h, l, 1), this.tmpMatrix2.translate(-this.tmpBoundsOnModel.x, -this.tmpBoundsOnModel.y, 0), this.tmpMatrixForMask.setMatrix(this.tmpMatrix2.m), this.tmpMatrix2.identity(), this.tmpMatrix2.translate(a.x, a.y, 0), this.tmpMatrix2.scale(h, l, 1), this.tmpMatrix2.translate(-this.tmpBoundsOnModel.x, -this.tmpBoundsOnModel.y, 0), this.tmpMatrixForDraw.setMatrix(this.tmpMatrix2.m);

            for (var $ = this.tmpMatrixForMask.getArray(), u = 0; u < 16; u++) {
              o.matrixForMask[u] = $[u];
            }

            for (var p = this.tmpMatrixForDraw.getArray(), u = 0; u < 16; u++) {
              o.matrixForDraw[u] = p[u];
            }

            for (var f = o.clippingMaskDrawIndexList.length, c = 0; c < f; c++) {
              var d = o.clippingMaskDrawIndexList[c],
                  g = t.getDrawData(d),
                  y = t._$C2(d);

              i.setClipBufPre_clipContextForMask(o), g.draw(i, t, y);
            }
          }

          i.gl.bindFramebuffer(i.gl.FRAMEBUFFER, n), i.setClipBufPre_clipContextForMask(null), i.gl.viewport(s[0], s[1], s[2], s[3]);
        }
      }, e.prototype.getColorBuffer = function () {
        return this.colorBuffer;
      }, e.prototype.findSameClip = function (t) {
        for (var i = 0; i < this.clipContextList.length; i++) {
          var e = this.clipContextList[i],
              r = e.clipIDList.length;

          if (r == t.length) {
            for (var o = 0, n = 0; n < r; n++) {
              for (var s = e.clipIDList[n], _ = 0; _ < r; _++) {
                if (t[_] == s) {
                  o++;
                  break;
                }
              }
            }

            if (o == r) return e;
          }
        }

        return null;
      }, e.prototype.calcClippedDrawTotalBounds = function (t, i) {
        for (var e = t._$Ri.getModelImpl().getCanvasWidth(), r = t._$Ri.getModelImpl().getCanvasHeight(), o = e > r ? e : r, n = o, s = o, _ = 0, a = 0, h = i.clippedDrawContextList.length, l = 0; l < h; l++) {
          var $ = i.clippedDrawContextList[l],
              u = $.drawDataIndex,
              p = t._$C2(u);

          if (p._$yo()) {
            for (var f = p.getTransformedPoints(), c = f.length, d = [], g = [], y = 0, m = U._$i2; m < c; m += U._$No) {
              d[y] = f[m], g[y] = f[m + 1], y++;
            }

            var T = Math.min.apply(null, d),
                P = Math.min.apply(null, g),
                S = Math.max.apply(null, d),
                v = Math.max.apply(null, g);
            T < n && (n = T), P < s && (s = P), S > _ && (_ = S), v > a && (a = v);
          }
        }

        if (n == o) i.allClippedDrawRect.x = 0, i.allClippedDrawRect.y = 0, i.allClippedDrawRect.width = 0, i.allClippedDrawRect.height = 0, i.isUsing = !1;else {
          var L = _ - n,
              M = a - s;
          i.allClippedDrawRect.x = n, i.allClippedDrawRect.y = s, i.allClippedDrawRect.width = L, i.allClippedDrawRect.height = M, i.isUsing = !0;
        }
      }, e.prototype.setupLayoutBounds = function (t) {
        var i = t / e.CHANNEL_COUNT,
            r = t % e.CHANNEL_COUNT;
        i = ~~i, r = ~~r;

        for (var o = 0, n = 0; n < e.CHANNEL_COUNT; n++) {
          var s = i + (n < r ? 1 : 0);
          if (0 == s) ;else if (1 == s) {
            var a = this.clipContextList[o++];
            a.layoutChannelNo = n, a.layoutBounds.x = 0, a.layoutBounds.y = 0, a.layoutBounds.width = 1, a.layoutBounds.height = 1;
          } else if (2 == s) for (var h = 0; h < s; h++) {
            var l = h % 2,
                $ = 0;
            l = ~~l;
            var a = this.clipContextList[o++];
            a.layoutChannelNo = n, a.layoutBounds.x = .5 * l, a.layoutBounds.y = 0, a.layoutBounds.width = .5, a.layoutBounds.height = 1;
          } else if (s <= 4) for (var h = 0; h < s; h++) {
            var l = h % 2,
                $ = h / 2;
            l = ~~l, $ = ~~$;
            var a = this.clipContextList[o++];
            a.layoutChannelNo = n, a.layoutBounds.x = .5 * l, a.layoutBounds.y = .5 * $, a.layoutBounds.width = .5, a.layoutBounds.height = .5;
          } else if (s <= 9) for (var h = 0; h < s; h++) {
            var l = h % 3,
                $ = h / 3;
            l = ~~l, $ = ~~$;
            var a = this.clipContextList[o++];
            a.layoutChannelNo = n, a.layoutBounds.x = l / 3, a.layoutBounds.y = $ / 3, a.layoutBounds.width = 1 / 3, a.layoutBounds.height = 1 / 3;
          } else _._$li("_$6 _$0P mask count : %d", s);
        }
      }, r.prototype.addClippedDrawData = function (t, i) {
        var e = new o(t, i);
        this.clippedDrawContextList.push(e);
      }, s._$JT = function (t, i, e) {
        var r = t / i,
            o = e / i,
            n = o,
            s = 1 - (1 - o) * (1 - o),
            _ = 1 - (1 - n) * (1 - n),
            a = 1 / 3 * (1 - o) * s + (n * (2 / 3) + 1 / 3 * (1 - n)) * (1 - s),
            h = (n + 2 / 3 * (1 - n)) * _ + (o * (1 / 3) + 2 / 3 * (1 - o)) * (1 - _),
            l = 1 - 3 * h + 3 * a - 0,
            $ = 3 * h - 6 * a + 0,
            u = 3 * a - 0;

        if (r <= 0) return 0;
        if (r >= 1) return 1;
        var p = r,
            f = p * p;
        return l * (p * f) + $ * f + u * p + 0;
      }, s.prototype._$a0 = function () {}, s.prototype.setFadeIn = function (t) {
        this._$dP = t;
      }, s.prototype.setFadeOut = function (t) {
        this._$eo = t;
      }, s.prototype._$pT = function (t) {
        this._$V0 = t;
      }, s.prototype.getFadeOut = function () {
        return this._$eo;
      }, s.prototype._$4T = function () {
        return this._$eo;
      }, s.prototype._$mT = function () {
        return this._$V0;
      }, s.prototype.getDurationMSec = function () {
        return -1;
      }, s.prototype.getLoopDurationMSec = function () {
        return -1;
      }, s.prototype.updateParam = function (t, i) {
        if (i._$AT && !i._$9L) {
          var e = w.getUserTimeMSec();

          if (i._$z2 < 0) {
            i._$z2 = e, i._$bs = e;
            var r = this.getDurationMSec();
            i._$Do < 0 && (i._$Do = r <= 0 ? -1 : i._$z2 + r);
          }

          var o = this._$V0;
          o = o * (0 == this._$dP ? 1 : ht._$r2((e - i._$bs) / this._$dP)) * (0 == this._$eo || i._$Do < 0 ? 1 : ht._$r2((i._$Do - e) / this._$eo)), 0 <= o && o <= 1 || console.log("### assert!! ### "), this.updateParamExe(t, e, o, i), i._$Do > 0 && i._$Do < e && (i._$9L = !0);
        }
      }, s.prototype.updateParamExe = function (t, i, e, r) {}, _._$8s = 0, _._$fT = new Object(), _.start = function (t) {
        var i = _._$fT[t];
        null == i && (i = new a(), i._$r = t, _._$fT[t] = i), i._$0S = w.getSystemTimeMSec();
      }, _.dump = function (t) {
        var i = _._$fT[t];

        if (null != i) {
          var e = w.getSystemTimeMSec(),
              r = e - i._$0S;
          return console.log(t + " : " + r + "ms"), r;
        }

        return -1;
      }, _.end = function (t) {
        var i = _._$fT[t];

        if (null != i) {
          return w.getSystemTimeMSec() - i._$0S;
        }

        return -1;
      }, _._$li = function (t, i) {
        console.log("_$li : " + t + "\n", i);
      }, _._$Ji = function (t, i) {
        console.log(t, i);
      }, _._$dL = function (t, i) {
        console.log(t, i), console.log("\n");
      }, _._$KL = function (t, i) {
        for (var e = 0; e < i; e++) {
          e % 16 == 0 && e > 0 ? console.log("\n") : e % 8 == 0 && e > 0 && console.log("  "), console.log("%02X ", 255 & t[e]);
        }

        console.log("\n");
      }, _._$nr = function (t, i, e) {
        console.log("%s\n", t);

        for (var r = i.length, o = 0; o < r; ++o) {
          console.log("%5d", i[o]), console.log("%s\n", e), console.log(",");
        }

        console.log("\n");
      }, _._$Rb = function (t) {
        console.log("dump exception : " + t), console.log("stack :: " + t.stack);
      }, h.prototype._$8P = function () {
        return .5 * (this.x + this.x + this.width);
      }, h.prototype._$6P = function () {
        return .5 * (this.y + this.y + this.height);
      }, h.prototype._$EL = function () {
        return this.x + this.width;
      }, h.prototype._$5T = function () {
        return this.y + this.height;
      }, h.prototype._$jL = function (t, i, e, r) {
        this.x = t, this.y = i, this.width = e, this.height = r;
      }, h.prototype._$jL = function (t) {
        this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;
      }, l.prototype = new et(), l._$tP = new Object(), l._$27 = function () {
        l._$tP.clear();
      }, l.getID = function (t) {
        var i = l._$tP[t];
        return null == i && (i = new l(t), l._$tP[t] = i), i;
      }, l.prototype._$3s = function () {
        return new l();
      }, u.prototype = new et(), u._$tP = new Object(), u._$27 = function () {
        u._$tP.clear();
      }, u.getID = function (t) {
        var i = u._$tP[t];
        return null == i && (i = new u(t), u._$tP[t] = i), i;
      }, u.prototype._$3s = function () {
        return new u();
      }, p._$42 = 0, p.prototype._$zP = function () {
        null == this._$vo && (this._$vo = new ot()), null == this._$F2 && (this._$F2 = new Array());
      }, p.prototype.getCanvasWidth = function () {
        return this._$ao;
      }, p.prototype.getCanvasHeight = function () {
        return this._$1S;
      }, p.prototype._$F0 = function (t) {
        this._$vo = t._$nP(), this._$F2 = t._$nP(), this._$ao = t._$6L(), this._$1S = t._$6L();
      }, p.prototype._$6S = function (t) {
        this._$F2.push(t);
      }, p.prototype._$Xr = function () {
        return this._$F2;
      }, p.prototype._$E2 = function () {
        return this._$vo;
      }, f.prototype.setup = function (t, i, e) {
        this._$ks = this._$Yb(), this.p2._$xT(), 3 == arguments.length && (this._$Fo = t, this._$L2 = i, this.p1._$p = e, this.p2._$p = e, this.p2.y = t, this.setup());
      }, f.prototype.getPhysicsPoint1 = function () {
        return this.p1;
      }, f.prototype.getPhysicsPoint2 = function () {
        return this.p2;
      }, f.prototype._$qr = function () {
        return this._$Db;
      }, f.prototype._$pr = function (t) {
        this._$Db = t;
      }, f.prototype._$5r = function () {
        return this._$M2;
      }, f.prototype._$Cs = function () {
        return this._$9b;
      }, f.prototype._$Yb = function () {
        return -180 * Math.atan2(this.p1.x - this.p2.x, -(this.p1.y - this.p2.y)) / Math.PI;
      }, f.prototype.addSrcParam = function (t, i, e, r) {
        var o = new g(t, i, e, r);

        this._$lL.push(o);
      }, f.prototype.addTargetParam = function (t, i, e, r) {
        var o = new T(t, i, e, r);

        this._$qP.push(o);
      }, f.prototype.update = function (t, i) {
        if (0 == this._$iP) return this._$iP = this._$iT = i, void (this._$Fo = Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x) + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y)));
        var e = (i - this._$iT) / 1e3;

        if (0 != e) {
          for (var r = this._$lL.length - 1; r >= 0; --r) {
            this._$lL[r]._$oP(t, this);
          }

          this._$oo(t, e), this._$M2 = this._$Yb(), this._$9b = (this._$M2 - this._$ks) / e, this._$ks = this._$M2;
        }

        for (var r = this._$qP.length - 1; r >= 0; --r) {
          this._$qP[r]._$YS(t, this);
        }

        this._$iT = i;
      }, f.prototype._$oo = function (t, i) {
        i < .033 && (i = .033);
        var e = 1 / i;
        this.p1.vx = (this.p1.x - this.p1._$s0) * e, this.p1.vy = (this.p1.y - this.p1._$70) * e, this.p1.ax = (this.p1.vx - this.p1._$7L) * e, this.p1.ay = (this.p1.vy - this.p1._$HL) * e, this.p1.fx = this.p1.ax * this.p1._$p, this.p1.fy = this.p1.ay * this.p1._$p, this.p1._$xT();

        var r,
            o,
            n = -Math.atan2(this.p1.y - this.p2.y, this.p1.x - this.p2.x),
            s = Math.cos(n),
            _ = Math.sin(n),
            a = 9.8 * this.p2._$p,
            h = this._$Db * Lt._$bS,
            l = a * Math.cos(n - h);

        r = l * _, o = l * s;
        var $ = -this.p1.fx * _ * _,
            u = -this.p1.fy * _ * s,
            p = -this.p2.vx * this._$L2,
            f = -this.p2.vy * this._$L2;
        this.p2.fx = r + $ + p, this.p2.fy = o + u + f, this.p2.ax = this.p2.fx / this.p2._$p, this.p2.ay = this.p2.fy / this.p2._$p, this.p2.vx += this.p2.ax * i, this.p2.vy += this.p2.ay * i, this.p2.x += this.p2.vx * i, this.p2.y += this.p2.vy * i;
        var c = Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x) + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y));
        this.p2.x = this.p1.x + this._$Fo * (this.p2.x - this.p1.x) / c, this.p2.y = this.p1.y + this._$Fo * (this.p2.y - this.p1.y) / c, this.p2.vx = (this.p2.x - this.p2._$s0) * e, this.p2.vy = (this.p2.y - this.p2._$70) * e, this.p2._$xT();
      }, c.prototype._$xT = function () {
        this._$s0 = this.x, this._$70 = this.y, this._$7L = this.vx, this._$HL = this.vy;
      }, d.prototype._$oP = function (t, i) {}, g.prototype = new d(), g.prototype._$oP = function (t, i) {
        var e = this.scale * t.getParamFloat(this._$wL),
            r = i.getPhysicsPoint1();

        switch (this._$tL) {
          default:
          case f.Src.SRC_TO_X:
            r.x = r.x + (e - r.x) * this._$V0;
            break;

          case f.Src.SRC_TO_Y:
            r.y = r.y + (e - r.y) * this._$V0;
            break;

          case f.Src.SRC_TO_G_ANGLE:
            var o = i._$qr();

            o += (e - o) * this._$V0, i._$pr(o);
        }
      }, y.prototype._$YS = function (t, i) {}, T.prototype = new y(), T.prototype._$YS = function (t, i) {
        switch (this._$YP) {
          default:
          case f.Target.TARGET_FROM_ANGLE:
            t.setParamFloat(this._$wL, this.scale * i._$5r(), this._$V0);
            break;

          case f.Target.TARGET_FROM_ANGLE_V:
            t.setParamFloat(this._$wL, this.scale * i._$Cs(), this._$V0);
        }
      }, f.Src = function () {}, f.Src.SRC_TO_X = "SRC_TO_X", f.Src.SRC_TO_Y = "SRC_TO_Y", f.Src.SRC_TO_G_ANGLE = "SRC_TO_G_ANGLE", f.Target = function () {}, f.Target.TARGET_FROM_ANGLE = "TARGET_FROM_ANGLE", f.Target.TARGET_FROM_ANGLE_V = "TARGET_FROM_ANGLE_V", P.prototype.init = function (t) {
        this._$fL = t._$fL, this._$gL = t._$gL, this._$B0 = t._$B0, this._$z0 = t._$z0, this._$qT = t._$qT, this.reflectX = t.reflectX, this.reflectY = t.reflectY;
      }, P.prototype._$F0 = function (t) {
        this._$fL = t._$_T(), this._$gL = t._$_T(), this._$B0 = t._$_T(), this._$z0 = t._$_T(), this._$qT = t._$_T(), t.getFormatVersion() >= G.LIVE2D_FORMAT_VERSION_V2_10_SDK2 && (this.reflectX = t._$po(), this.reflectY = t._$po());
      }, P.prototype._$e = function () {};

      var It = function It() {};

      It._$ni = function (t, i, e, r, o, n, s, _, a) {
        var h = s * n - _ * o;
        if (0 == h) return null;
        var l,
            $ = ((t - e) * n - (i - r) * o) / h;
        return l = 0 != o ? (t - e - $ * s) / o : (i - r - $ * _) / n, isNaN(l) && (l = (t - e - $ * s) / o, isNaN(l) && (l = (i - r - $ * _) / n), isNaN(l) && (console.log("a is NaN @UtVector#_$ni() "), console.log("v1x : " + o), console.log("v1x != 0 ? " + (0 != o)))), null == a ? new Array(l, $) : (a[0] = l, a[1] = $, a);
      }, S.prototype._$8P = function () {
        return this.x + .5 * this.width;
      }, S.prototype._$6P = function () {
        return this.y + .5 * this.height;
      }, S.prototype._$EL = function () {
        return this.x + this.width;
      }, S.prototype._$5T = function () {
        return this.y + this.height;
      }, S.prototype._$jL = function (t, i, e, r) {
        this.x = t, this.y = i, this.width = e, this.height = r;
      }, S.prototype._$jL = function (t) {
        this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;
      }, S.prototype.contains = function (t, i) {
        return this.x <= this.x && this.y <= this.y && this.x <= this.x + this.width && this.y <= this.y + this.height;
      }, S.prototype.expand = function (t, i) {
        this.x -= t, this.y -= i, this.width += 2 * t, this.height += 2 * i;
      }, v._$Z2 = function (t, i, e, r) {
        var o = i._$Q2(t, e),
            n = t._$vs(),
            s = t._$Tr();

        if (i._$zr(n, s, o), o <= 0) return r[n[0]];

        if (1 == o) {
          var _ = r[n[0]],
              a = r[n[1]],
              h = s[0];
          return _ + (a - _) * h | 0;
        }

        if (2 == o) {
          var _ = r[n[0]],
              a = r[n[1]],
              l = r[n[2]],
              $ = r[n[3]],
              h = s[0],
              u = s[1],
              p = _ + (a - _) * h | 0,
              f = l + ($ - l) * h | 0;
          return p + (f - p) * u | 0;
        }

        if (3 == o) {
          var c = r[n[0]],
              d = r[n[1]],
              g = r[n[2]],
              y = r[n[3]],
              m = r[n[4]],
              T = r[n[5]],
              P = r[n[6]],
              S = r[n[7]],
              h = s[0],
              u = s[1],
              v = s[2],
              _ = c + (d - c) * h | 0,
              a = g + (y - g) * h | 0,
              l = m + (T - m) * h | 0,
              $ = P + (S - P) * h | 0,
              p = _ + (a - _) * u | 0,
              f = l + ($ - l) * u | 0;

          return p + (f - p) * v | 0;
        }

        if (4 == o) {
          var L = r[n[0]],
              M = r[n[1]],
              E = r[n[2]],
              A = r[n[3]],
              I = r[n[4]],
              w = r[n[5]],
              x = r[n[6]],
              O = r[n[7]],
              D = r[n[8]],
              R = r[n[9]],
              b = r[n[10]],
              F = r[n[11]],
              C = r[n[12]],
              N = r[n[13]],
              B = r[n[14]],
              U = r[n[15]],
              h = s[0],
              u = s[1],
              v = s[2],
              G = s[3],
              c = L + (M - L) * h | 0,
              d = E + (A - E) * h | 0,
              g = I + (w - I) * h | 0,
              y = x + (O - x) * h | 0,
              m = D + (R - D) * h | 0,
              T = b + (F - b) * h | 0,
              P = C + (N - C) * h | 0,
              S = B + (U - B) * h | 0,
              _ = c + (d - c) * u | 0,
              a = g + (y - g) * u | 0,
              l = m + (T - m) * u | 0,
              $ = P + (S - P) * u | 0,
              p = _ + (a - _) * v | 0,
              f = l + ($ - l) * v | 0;

          return p + (f - p) * G | 0;
        }

        for (var Y = 1 << o, k = new Float32Array(Y), V = 0; V < Y; V++) {
          for (var X = V, z = 1, H = 0; H < o; H++) {
            z *= X % 2 == 0 ? 1 - s[H] : s[H], X /= 2;
          }

          k[V] = z;
        }

        for (var W = new Float32Array(Y), j = 0; j < Y; j++) {
          W[j] = r[n[j]];
        }

        for (var q = 0, j = 0; j < Y; j++) {
          q += k[j] * W[j];
        }

        return q + .5 | 0;
      }, v._$br = function (t, i, e, r) {
        var o = i._$Q2(t, e),
            n = t._$vs(),
            s = t._$Tr();

        if (i._$zr(n, s, o), o <= 0) return r[n[0]];

        if (1 == o) {
          var _ = r[n[0]],
              a = r[n[1]],
              h = s[0];
          return _ + (a - _) * h;
        }

        if (2 == o) {
          var _ = r[n[0]],
              a = r[n[1]],
              l = r[n[2]],
              $ = r[n[3]],
              h = s[0],
              u = s[1];
          return (1 - u) * (_ + (a - _) * h) + u * (l + ($ - l) * h);
        }

        if (3 == o) {
          var p = r[n[0]],
              f = r[n[1]],
              c = r[n[2]],
              d = r[n[3]],
              g = r[n[4]],
              y = r[n[5]],
              m = r[n[6]],
              T = r[n[7]],
              h = s[0],
              u = s[1],
              P = s[2];
          return (1 - P) * ((1 - u) * (p + (f - p) * h) + u * (c + (d - c) * h)) + P * ((1 - u) * (g + (y - g) * h) + u * (m + (T - m) * h));
        }

        if (4 == o) {
          var S = r[n[0]],
              v = r[n[1]],
              L = r[n[2]],
              M = r[n[3]],
              E = r[n[4]],
              A = r[n[5]],
              I = r[n[6]],
              w = r[n[7]],
              x = r[n[8]],
              O = r[n[9]],
              D = r[n[10]],
              R = r[n[11]],
              b = r[n[12]],
              F = r[n[13]],
              C = r[n[14]],
              N = r[n[15]],
              h = s[0],
              u = s[1],
              P = s[2],
              B = s[3];
          return (1 - B) * ((1 - P) * ((1 - u) * (S + (v - S) * h) + u * (L + (M - L) * h)) + P * ((1 - u) * (E + (A - E) * h) + u * (I + (w - I) * h))) + B * ((1 - P) * ((1 - u) * (x + (O - x) * h) + u * (D + (R - D) * h)) + P * ((1 - u) * (b + (F - b) * h) + u * (C + (N - C) * h)));
        }

        for (var U = 1 << o, G = new Float32Array(U), Y = 0; Y < U; Y++) {
          for (var k = Y, V = 1, X = 0; X < o; X++) {
            V *= k % 2 == 0 ? 1 - s[X] : s[X], k /= 2;
          }

          G[Y] = V;
        }

        for (var z = new Float32Array(U), H = 0; H < U; H++) {
          z[H] = r[n[H]];
        }

        for (var W = 0, H = 0; H < U; H++) {
          W += G[H] * z[H];
        }

        return W;
      }, v._$Vr = function (t, i, e, r, o, n, s, _) {
        var a = i._$Q2(t, e),
            h = t._$vs(),
            l = t._$Tr();

        i._$zr(h, l, a);

        var $ = 2 * r,
            u = s;

        if (a <= 0) {
          var p = h[0],
              f = o[p];
          if (2 == _ && 0 == s) w._$jT(f, 0, n, 0, $);else for (var c = 0; c < $;) {
            n[u] = f[c++], n[u + 1] = f[c++], u += _;
          }
        } else if (1 == a) for (var f = o[h[0]], d = o[h[1]], g = l[0], y = 1 - g, c = 0; c < $;) {
          n[u] = f[c] * y + d[c] * g, ++c, n[u + 1] = f[c] * y + d[c] * g, ++c, u += _;
        } else if (2 == a) for (var f = o[h[0]], d = o[h[1]], m = o[h[2]], T = o[h[3]], g = l[0], P = l[1], y = 1 - g, S = 1 - P, v = S * y, L = S * g, M = P * y, E = P * g, c = 0; c < $;) {
          n[u] = v * f[c] + L * d[c] + M * m[c] + E * T[c], ++c, n[u + 1] = v * f[c] + L * d[c] + M * m[c] + E * T[c], ++c, u += _;
        } else if (3 == a) for (var A = o[h[0]], I = o[h[1]], x = o[h[2]], O = o[h[3]], D = o[h[4]], R = o[h[5]], b = o[h[6]], F = o[h[7]], g = l[0], P = l[1], C = l[2], y = 1 - g, S = 1 - P, N = 1 - C, B = N * S * y, U = N * S * g, G = N * P * y, Y = N * P * g, k = C * S * y, V = C * S * g, X = C * P * y, z = C * P * g, c = 0; c < $;) {
          n[u] = B * A[c] + U * I[c] + G * x[c] + Y * O[c] + k * D[c] + V * R[c] + X * b[c] + z * F[c], ++c, n[u + 1] = B * A[c] + U * I[c] + G * x[c] + Y * O[c] + k * D[c] + V * R[c] + X * b[c] + z * F[c], ++c, u += _;
        } else if (4 == a) for (var H = o[h[0]], W = o[h[1]], j = o[h[2]], q = o[h[3]], J = o[h[4]], Q = o[h[5]], Z = o[h[6]], K = o[h[7]], tt = o[h[8]], it = o[h[9]], et = o[h[10]], rt = o[h[11]], ot = o[h[12]], nt = o[h[13]], st = o[h[14]], _t = o[h[15]], g = l[0], P = l[1], C = l[2], at = l[3], y = 1 - g, S = 1 - P, N = 1 - C, ht = 1 - at, lt = ht * N * S * y, $t = ht * N * S * g, ut = ht * N * P * y, pt = ht * N * P * g, ft = ht * C * S * y, ct = ht * C * S * g, dt = ht * C * P * y, gt = ht * C * P * g, yt = at * N * S * y, mt = at * N * S * g, Tt = at * N * P * y, Pt = at * N * P * g, St = at * C * S * y, vt = at * C * S * g, Lt = at * C * P * y, Mt = at * C * P * g, c = 0; c < $;) {
          n[u] = lt * H[c] + $t * W[c] + ut * j[c] + pt * q[c] + ft * J[c] + ct * Q[c] + dt * Z[c] + gt * K[c] + yt * tt[c] + mt * it[c] + Tt * et[c] + Pt * rt[c] + St * ot[c] + vt * nt[c] + Lt * st[c] + Mt * _t[c], ++c, n[u + 1] = lt * H[c] + $t * W[c] + ut * j[c] + pt * q[c] + ft * J[c] + ct * Q[c] + dt * Z[c] + gt * K[c] + yt * tt[c] + mt * it[c] + Tt * et[c] + Pt * rt[c] + St * ot[c] + vt * nt[c] + Lt * st[c] + Mt * _t[c], ++c, u += _;
        } else {
          for (var Et = 1 << a, At = new Float32Array(Et), It = 0; It < Et; It++) {
            for (var wt = It, xt = 1, Ot = 0; Ot < a; Ot++) {
              xt *= wt % 2 == 0 ? 1 - l[Ot] : l[Ot], wt /= 2;
            }

            At[It] = xt;
          }

          for (var Dt = new Float32Array(Et), Rt = 0; Rt < Et; Rt++) {
            Dt[Rt] = o[h[Rt]];
          }

          for (var c = 0; c < $;) {
            for (var bt = 0, Ft = 0, Ct = c + 1, Rt = 0; Rt < Et; Rt++) {
              bt += At[Rt] * Dt[Rt][c], Ft += At[Rt] * Dt[Rt][Ct];
            }

            c += 2, n[u] = bt, n[u + 1] = Ft, u += _;
          }
        }
      }, L.prototype._$HT = function (t, i) {
        this.x = t, this.y = i;
      }, L.prototype._$HT = function (t) {
        this.x = t.x, this.y = t.y;
      }, M._$ur = -2, M._$ES = 500, M._$wb = 2, M._$8S = 3, M._$52 = M._$ES, M._$R2 = M._$ES, M._$or = function () {
        return M._$52;
      }, M._$Pr = function () {
        return M._$R2;
      }, M.prototype.convertClipIDForV2_11 = function (t) {
        var i = [];
        return null == t ? null : 0 == t.length ? null : /,/.test(t) ? i = t.id.split(",") : (i.push(t.id), i);
      }, M.prototype._$F0 = function (t) {
        this._$gP = t._$nP(), this._$dr = t._$nP(), this._$GS = t._$nP(), this._$qb = t._$6L(), this._$Lb = t._$cS(), this._$mS = t._$Tb(), t.getFormatVersion() >= G._$T7 ? (this.clipID = t._$nP(), this.clipIDList = this.convertClipIDForV2_11(this.clipID)) : this.clipIDList = [], this._$MS(this._$Lb);
      }, M.prototype.getClipIDList = function () {
        return this.clipIDList;
      }, M.prototype.init = function (t) {}, M.prototype._$Nr = function (t, i) {
        if (i._$IS[0] = !1, i._$Us = v._$Z2(t, this._$GS, i._$IS, this._$Lb), at._$Zs) ;else if (i._$IS[0]) return;
        i._$7s = v._$br(t, this._$GS, i._$IS, this._$mS);
      }, M.prototype._$2b = function (t, i) {}, M.prototype.getDrawDataID = function () {
        return this._$gP;
      }, M.prototype._$j2 = function (t) {
        this._$gP = t;
      }, M.prototype.getOpacity = function (t, i) {
        return i._$7s;
      }, M.prototype._$zS = function (t, i) {
        return i._$Us;
      }, M.prototype._$MS = function (t) {
        for (var i = t.length - 1; i >= 0; --i) {
          var e = t[i];
          e < M._$52 ? M._$52 = e : e > M._$R2 && (M._$R2 = e);
        }
      }, M.prototype.getTargetBaseDataID = function () {
        return this._$dr;
      }, M.prototype._$gs = function (t) {
        this._$dr = t;
      }, M.prototype._$32 = function () {
        return null != this._$dr && this._$dr != yt._$2o();
      }, M.prototype.preDraw = function (t, i, e) {}, M.prototype.draw = function (t, i, e) {}, M.prototype.getType = function () {}, M.prototype._$B2 = function (t, i, e) {}, E._$ps = 32, E.CLIPPING_PROCESS_NONE = 0, E.CLIPPING_PROCESS_OVERWRITE_ALPHA = 1, E.CLIPPING_PROCESS_MULTIPLY_ALPHA = 2, E.CLIPPING_PROCESS_DRAW = 3, E.CLIPPING_PROCESS_CLEAR_ALPHA = 4, E.prototype.setChannelFlagAsColor = function (t, i) {
        this.CHANNEL_COLORS[t] = i;
      }, E.prototype.getChannelFlagAsColor = function (t) {
        return this.CHANNEL_COLORS[t];
      }, E.prototype._$ZT = function () {}, E.prototype._$Uo = function (t, i, e, r, o, n, s) {}, E.prototype._$Rs = function () {
        return -1;
      }, E.prototype._$Ds = function (t) {}, E.prototype.setBaseColor = function (t, i, e, r) {
        t < 0 ? t = 0 : t > 1 && (t = 1), i < 0 ? i = 0 : i > 1 && (i = 1), e < 0 ? e = 0 : e > 1 && (e = 1), r < 0 ? r = 0 : r > 1 && (r = 1), this._$lT = t, this._$C0 = i, this._$tT = e, this._$WL = r;
      }, E.prototype._$WP = function (t) {
        this.culling = t;
      }, E.prototype.setMatrix = function (t) {
        for (var i = 0; i < 16; i++) {
          this.matrix4x4[i] = t[i];
        }
      }, E.prototype._$IT = function () {
        return this.matrix4x4;
      }, E.prototype.setPremultipliedAlpha = function (t) {
        this.premultipliedAlpha = t;
      }, E.prototype.isPremultipliedAlpha = function () {
        return this.premultipliedAlpha;
      }, E.prototype.setAnisotropy = function (t) {
        this.anisotropy = t;
      }, E.prototype.getAnisotropy = function () {
        return this.anisotropy;
      }, E.prototype.getClippingProcess = function () {
        return this.clippingProcess;
      }, E.prototype.setClippingProcess = function (t) {
        this.clippingProcess = t;
      }, E.prototype.setClipBufPre_clipContextForMask = function (t) {
        this.clipBufPre_clipContextMask = t;
      }, E.prototype.getClipBufPre_clipContextMask = function () {
        return this.clipBufPre_clipContextMask;
      }, E.prototype.setClipBufPre_clipContextForDraw = function (t) {
        this.clipBufPre_clipContextDraw = t;
      }, E.prototype.getClipBufPre_clipContextDraw = function () {
        return this.clipBufPre_clipContextDraw;
      }, I._$ur = -2, I._$c2 = 1, I._$_b = 2, I.prototype._$F0 = function (t) {
        this._$kP = t._$nP(), this._$dr = t._$nP();
      }, I.prototype.readV2_opacity = function (t) {
        t.getFormatVersion() >= G.LIVE2D_FORMAT_VERSION_V2_10_SDK2 && (this._$mS = t._$Tb());
      }, I.prototype.init = function (t) {}, I.prototype._$Nr = function (t, i) {}, I.prototype.interpolateOpacity = function (t, i, e, r) {
        null == this._$mS ? e.setInterpolatedOpacity(1) : e.setInterpolatedOpacity(v._$br(t, i, r, this._$mS));
      }, I.prototype._$2b = function (t, i) {}, I.prototype._$nb = function (t, i, e, r, o, n, s) {}, I.prototype.getType = function () {}, I.prototype._$gs = function (t) {
        this._$dr = t;
      }, I.prototype._$a2 = function (t) {
        this._$kP = t;
      }, I.prototype.getTargetBaseDataID = function () {
        return this._$dr;
      }, I.prototype.getBaseDataID = function () {
        return this._$kP;
      }, I.prototype._$32 = function () {
        return null != this._$dr && this._$dr != yt._$2o();
      }, w._$W2 = 0, w._$CS = w._$W2, w._$Mo = function () {
        return !0;
      }, w._$XP = function (t) {
        try {
          for (var i = getTimeMSec(); getTimeMSec() - i < t;) {
            ;
          }
        } catch (t) {
          t._$Rb();
        }
      }, w.getUserTimeMSec = function () {
        return w._$CS == w._$W2 ? w.getSystemTimeMSec() : w._$CS;
      }, w.setUserTimeMSec = function (t) {
        w._$CS = t;
      }, w.updateUserTimeMSec = function () {
        return w._$CS = w.getSystemTimeMSec();
      }, w.getTimeMSec = function () {
        return new Date().getTime();
      }, w.getSystemTimeMSec = function () {
        return new Date().getTime();
      }, w._$Q = function (t) {}, w._$jT = function (t, i, e, r, o) {
        for (var n = 0; n < o; n++) {
          e[r + n] = t[i + n];
        }
      }, x._$ds = -2, x.prototype._$F0 = function (t) {
        this._$wL = t._$nP(), this._$VP = t._$6L(), this._$GP = t._$nP();
      }, x.prototype.getParamIndex = function (t) {
        return this._$2r != t && (this._$8o = x._$ds), this._$8o;
      }, x.prototype._$Pb = function (t, i) {
        this._$8o = t, this._$2r = i;
      }, x.prototype.getParamID = function () {
        return this._$wL;
      }, x.prototype._$yP = function (t) {
        this._$wL = t;
      }, x.prototype._$N2 = function () {
        return this._$VP;
      }, x.prototype._$d2 = function () {
        return this._$GP;
      }, x.prototype._$t2 = function (t, i) {
        this._$VP = t, this._$GP = i;
      }, x.prototype._$Lr = function () {
        return this._$O2;
      }, x.prototype._$wr = function (t) {
        this._$O2 = t;
      }, x.prototype._$SL = function () {
        return this._$ri;
      }, x.prototype._$AL = function (t) {
        this._$ri = t;
      }, O.startsWith = function (t, i, e) {
        var r = i + e.length;
        if (r >= t.length) return !1;

        for (var o = i; o < r; o++) {
          if (O.getChar(t, o) != e.charAt(o - i)) return !1;
        }

        return !0;
      }, O.getChar = function (t, i) {
        return String.fromCharCode(t.getUint8(i));
      }, O.createString = function (t, i, e) {
        for (var r = new ArrayBuffer(2 * e), o = new Uint16Array(r), n = 0; n < e; n++) {
          o[n] = t.getUint8(i + n);
        }

        return String.fromCharCode.apply(null, o);
      }, O._$LS = function (t, i, e, r) {
        t instanceof ArrayBuffer && (t = new DataView(t));
        var o = e,
            n = !1,
            s = !1,
            _ = 0,
            a = O.getChar(t, o);
        "-" == a && (n = !0, o++);

        for (var h = !1; o < i; o++) {
          switch (a = O.getChar(t, o)) {
            case "0":
              _ *= 10;
              break;

            case "1":
              _ = 10 * _ + 1;
              break;

            case "2":
              _ = 10 * _ + 2;
              break;

            case "3":
              _ = 10 * _ + 3;
              break;

            case "4":
              _ = 10 * _ + 4;
              break;

            case "5":
              _ = 10 * _ + 5;
              break;

            case "6":
              _ = 10 * _ + 6;
              break;

            case "7":
              _ = 10 * _ + 7;
              break;

            case "8":
              _ = 10 * _ + 8;
              break;

            case "9":
              _ = 10 * _ + 9;
              break;

            case ".":
              s = !0, o++, h = !0;
              break;

            default:
              h = !0;
          }

          if (h) break;
        }

        if (s) for (var l = .1, $ = !1; o < i; o++) {
          switch (a = O.getChar(t, o)) {
            case "0":
              break;

            case "1":
              _ += 1 * l;
              break;

            case "2":
              _ += 2 * l;
              break;

            case "3":
              _ += 3 * l;
              break;

            case "4":
              _ += 4 * l;
              break;

            case "5":
              _ += 5 * l;
              break;

            case "6":
              _ += 6 * l;
              break;

            case "7":
              _ += 7 * l;
              break;

            case "8":
              _ += 8 * l;
              break;

            case "9":
              _ += 9 * l;
              break;

            default:
              $ = !0;
          }

          if (l *= .1, $) break;
        }
        return n && (_ = -_), r[0] = o, _;
      }, D.prototype._$zP = function () {
        this._$Ob = new Array();
      }, D.prototype._$F0 = function (t) {
        this._$Ob = t._$nP();
      }, D.prototype._$Ur = function (t) {
        if (t._$WS()) return !0;

        for (var i = t._$v2(), e = this._$Ob.length - 1; e >= 0; --e) {
          var r = this._$Ob[e].getParamIndex(i);

          if (r == x._$ds && (r = t.getParamIndex(this._$Ob[e].getParamID())), t._$Xb(r)) return !0;
        }

        return !1;
      }, D.prototype._$Q2 = function (t, i) {
        for (var e, r, o = this._$Ob.length, n = t._$v2(), s = 0, _ = 0; _ < o; _++) {
          var a = this._$Ob[_];
          if (e = a.getParamIndex(n), e == x._$ds && (e = t.getParamIndex(a.getParamID()), a._$Pb(e, n)), e < 0) throw new Exception("err 23242 : " + a.getParamID());
          var h = e < 0 ? 0 : t.getParamFloat(e);
          r = a._$N2();

          var l,
              $,
              u = a._$d2(),
              p = -1,
              f = 0;

          if (r < 1) ;else if (1 == r) l = u[0], l - U._$J < h && h < l + U._$J ? (p = 0, f = 0) : (p = 0, i[0] = !0);else if (l = u[0], h < l - U._$J) p = 0, i[0] = !0;else if (h < l + U._$J) p = 0;else {
            for (var c = !1, d = 1; d < r; ++d) {
              if ($ = u[d], h < $ + U._$J) {
                $ - U._$J < h ? p = d : (p = d - 1, f = (h - l) / ($ - l), s++), c = !0;
                break;
              }

              l = $;
            }

            c || (p = r - 1, f = 0, i[0] = !0);
          }
          a._$wr(p), a._$AL(f);
        }

        return s;
      }, D.prototype._$zr = function (t, i, e) {
        var r = 1 << e;
        r + 1 > U._$Qb && console.log("err 23245\n");

        for (var o = this._$Ob.length, n = 1, s = 1, _ = 0, a = 0; a < r; ++a) {
          t[a] = 0;
        }

        for (var h = 0; h < o; ++h) {
          var l = this._$Ob[h];

          if (0 == l._$SL()) {
            var $ = l._$Lr() * n;
            if ($ < 0 && at._$3T) throw new Exception("err 23246");

            for (var a = 0; a < r; ++a) {
              t[a] += $;
            }
          } else {
            for (var $ = n * l._$Lr(), u = n * (l._$Lr() + 1), a = 0; a < r; ++a) {
              t[a] += (a / s | 0) % 2 == 0 ? $ : u;
            }

            i[_++] = l._$SL(), s *= 2;
          }

          n *= l._$N2();
        }

        t[r] = 65535, i[_] = -1;
      }, D.prototype._$h2 = function (t, i, e) {
        for (var r = new Float32Array(i), o = 0; o < i; ++o) {
          r[o] = e[o];
        }

        var n = new x();
        n._$yP(t), n._$t2(i, r), this._$Ob.push(n);
      }, D.prototype._$J2 = function (t) {
        for (var i = t, e = this._$Ob.length, r = 0; r < e; ++r) {
          var o = this._$Ob[r],
              n = o._$N2(),
              s = i % o._$N2(),
              _ = o._$d2()[s];

          console.log("%s[%d]=%7.2f / ", o.getParamID(), s, _), i /= n;
        }

        console.log("\n");
      }, D.prototype.getParamCount = function () {
        return this._$Ob.length;
      }, D.prototype._$zs = function () {
        return this._$Ob;
      }, R.prototype.identity = function () {
        for (var t = 0; t < 16; t++) {
          this.m[t] = t % 5 == 0 ? 1 : 0;
        }
      }, R.prototype.getArray = function () {
        return this.m;
      }, R.prototype.getCopyMatrix = function () {
        return new Float32Array(this.m);
      }, R.prototype.setMatrix = function (t) {
        if (null != t && 16 == t.length) for (var i = 0; i < 16; i++) {
          this.m[i] = t[i];
        }
      }, R.prototype.mult = function (t, i, e) {
        return null == i ? null : (this == i ? this.mult_safe(this.m, t.m, i.m, e) : this.mult_fast(this.m, t.m, i.m, e), i);
      }, R.prototype.mult_safe = function (t, i, e, r) {
        if (t == e) {
          var o = new Array(16);
          this.mult_fast(t, i, o, r);

          for (var n = 15; n >= 0; --n) {
            e[n] = o[n];
          }
        } else this.mult_fast(t, i, e, r);
      }, R.prototype.mult_fast = function (t, i, e, r) {
        r ? (e[0] = t[0] * i[0] + t[4] * i[1] + t[8] * i[2], e[4] = t[0] * i[4] + t[4] * i[5] + t[8] * i[6], e[8] = t[0] * i[8] + t[4] * i[9] + t[8] * i[10], e[12] = t[0] * i[12] + t[4] * i[13] + t[8] * i[14] + t[12], e[1] = t[1] * i[0] + t[5] * i[1] + t[9] * i[2], e[5] = t[1] * i[4] + t[5] * i[5] + t[9] * i[6], e[9] = t[1] * i[8] + t[5] * i[9] + t[9] * i[10], e[13] = t[1] * i[12] + t[5] * i[13] + t[9] * i[14] + t[13], e[2] = t[2] * i[0] + t[6] * i[1] + t[10] * i[2], e[6] = t[2] * i[4] + t[6] * i[5] + t[10] * i[6], e[10] = t[2] * i[8] + t[6] * i[9] + t[10] * i[10], e[14] = t[2] * i[12] + t[6] * i[13] + t[10] * i[14] + t[14], e[3] = e[7] = e[11] = 0, e[15] = 1) : (e[0] = t[0] * i[0] + t[4] * i[1] + t[8] * i[2] + t[12] * i[3], e[4] = t[0] * i[4] + t[4] * i[5] + t[8] * i[6] + t[12] * i[7], e[8] = t[0] * i[8] + t[4] * i[9] + t[8] * i[10] + t[12] * i[11], e[12] = t[0] * i[12] + t[4] * i[13] + t[8] * i[14] + t[12] * i[15], e[1] = t[1] * i[0] + t[5] * i[1] + t[9] * i[2] + t[13] * i[3], e[5] = t[1] * i[4] + t[5] * i[5] + t[9] * i[6] + t[13] * i[7], e[9] = t[1] * i[8] + t[5] * i[9] + t[9] * i[10] + t[13] * i[11], e[13] = t[1] * i[12] + t[5] * i[13] + t[9] * i[14] + t[13] * i[15], e[2] = t[2] * i[0] + t[6] * i[1] + t[10] * i[2] + t[14] * i[3], e[6] = t[2] * i[4] + t[6] * i[5] + t[10] * i[6] + t[14] * i[7], e[10] = t[2] * i[8] + t[6] * i[9] + t[10] * i[10] + t[14] * i[11], e[14] = t[2] * i[12] + t[6] * i[13] + t[10] * i[14] + t[14] * i[15], e[3] = t[3] * i[0] + t[7] * i[1] + t[11] * i[2] + t[15] * i[3], e[7] = t[3] * i[4] + t[7] * i[5] + t[11] * i[6] + t[15] * i[7], e[11] = t[3] * i[8] + t[7] * i[9] + t[11] * i[10] + t[15] * i[11], e[15] = t[3] * i[12] + t[7] * i[13] + t[11] * i[14] + t[15] * i[15]);
      }, R.prototype.translate = function (t, i, e) {
        this.m[12] = this.m[0] * t + this.m[4] * i + this.m[8] * e + this.m[12], this.m[13] = this.m[1] * t + this.m[5] * i + this.m[9] * e + this.m[13], this.m[14] = this.m[2] * t + this.m[6] * i + this.m[10] * e + this.m[14], this.m[15] = this.m[3] * t + this.m[7] * i + this.m[11] * e + this.m[15];
      }, R.prototype.scale = function (t, i, e) {
        this.m[0] *= t, this.m[4] *= i, this.m[8] *= e, this.m[1] *= t, this.m[5] *= i, this.m[9] *= e, this.m[2] *= t, this.m[6] *= i, this.m[10] *= e, this.m[3] *= t, this.m[7] *= i, this.m[11] *= e;
      }, R.prototype.rotateX = function (t) {
        var i = Lt.fcos(t),
            e = Lt._$9(t),
            r = this.m[4];

        this.m[4] = r * i + this.m[8] * e, this.m[8] = r * -e + this.m[8] * i, r = this.m[5], this.m[5] = r * i + this.m[9] * e, this.m[9] = r * -e + this.m[9] * i, r = this.m[6], this.m[6] = r * i + this.m[10] * e, this.m[10] = r * -e + this.m[10] * i, r = this.m[7], this.m[7] = r * i + this.m[11] * e, this.m[11] = r * -e + this.m[11] * i;
      }, R.prototype.rotateY = function (t) {
        var i = Lt.fcos(t),
            e = Lt._$9(t),
            r = this.m[0];

        this.m[0] = r * i + this.m[8] * -e, this.m[8] = r * e + this.m[8] * i, r = this.m[1], this.m[1] = r * i + this.m[9] * -e, this.m[9] = r * e + this.m[9] * i, r = m[2], this.m[2] = r * i + this.m[10] * -e, this.m[10] = r * e + this.m[10] * i, r = m[3], this.m[3] = r * i + this.m[11] * -e, this.m[11] = r * e + this.m[11] * i;
      }, R.prototype.rotateZ = function (t) {
        var i = Lt.fcos(t),
            e = Lt._$9(t),
            r = this.m[0];

        this.m[0] = r * i + this.m[4] * e, this.m[4] = r * -e + this.m[4] * i, r = this.m[1], this.m[1] = r * i + this.m[5] * e, this.m[5] = r * -e + this.m[5] * i, r = this.m[2], this.m[2] = r * i + this.m[6] * e, this.m[6] = r * -e + this.m[6] * i, r = this.m[3], this.m[3] = r * i + this.m[7] * e, this.m[7] = r * -e + this.m[7] * i;
      }, b.prototype = new et(), b._$tP = new Object(), b._$27 = function () {
        b._$tP.clear();
      }, b.getID = function (t) {
        var i = b._$tP[t];
        return null == i && (i = new b(t), b._$tP[t] = i), i;
      }, b.prototype._$3s = function () {
        return new b();
      }, F._$kS = -1, F._$pS = 0, F._$hb = 1, F.STATE_IDENTITY = 0, F._$gb = 1, F._$fo = 2, F._$go = 4, F.prototype.transform = function (t, i, e) {
        var r,
            o,
            n,
            s,
            _,
            a,
            h = 0,
            l = 0;

        switch (this._$hi) {
          default:
            return;

          case F._$go | F._$fo | F._$gb:
            for (r = this._$7, o = this._$H, n = this._$k, s = this._$f, _ = this._$g, a = this._$w; --e >= 0;) {
              var $ = t[h++],
                  u = t[h++];
              i[l++] = r * $ + o * u + n, i[l++] = s * $ + _ * u + a;
            }

            return;

          case F._$go | F._$fo:
            for (r = this._$7, o = this._$H, s = this._$f, _ = this._$g; --e >= 0;) {
              var $ = t[h++],
                  u = t[h++];
              i[l++] = r * $ + o * u, i[l++] = s * $ + _ * u;
            }

            return;

          case F._$go | F._$gb:
            for (o = this._$H, n = this._$k, s = this._$f, a = this._$w; --e >= 0;) {
              var $ = t[h++];
              i[l++] = o * t[h++] + n, i[l++] = s * $ + a;
            }

            return;

          case F._$go:
            for (o = this._$H, s = this._$f; --e >= 0;) {
              var $ = t[h++];
              i[l++] = o * t[h++], i[l++] = s * $;
            }

            return;

          case F._$fo | F._$gb:
            for (r = this._$7, n = this._$k, _ = this._$g, a = this._$w; --e >= 0;) {
              i[l++] = r * t[h++] + n, i[l++] = _ * t[h++] + a;
            }

            return;

          case F._$fo:
            for (r = this._$7, _ = this._$g; --e >= 0;) {
              i[l++] = r * t[h++], i[l++] = _ * t[h++];
            }

            return;

          case F._$gb:
            for (n = this._$k, a = this._$w; --e >= 0;) {
              i[l++] = t[h++] + n, i[l++] = t[h++] + a;
            }

            return;

          case F.STATE_IDENTITY:
            return void (t == i && h == l || w._$jT(t, h, i, l, 2 * e));
        }
      }, F.prototype.update = function () {
        0 == this._$H && 0 == this._$f ? 1 == this._$7 && 1 == this._$g ? 0 == this._$k && 0 == this._$w ? (this._$hi = F.STATE_IDENTITY, this._$Z = F._$pS) : (this._$hi = F._$gb, this._$Z = F._$hb) : 0 == this._$k && 0 == this._$w ? (this._$hi = F._$fo, this._$Z = F._$kS) : (this._$hi = F._$fo | F._$gb, this._$Z = F._$kS) : 0 == this._$7 && 0 == this._$g ? 0 == this._$k && 0 == this._$w ? (this._$hi = F._$go, this._$Z = F._$kS) : (this._$hi = F._$go | F._$gb, this._$Z = F._$kS) : 0 == this._$k && 0 == this._$w ? (this._$hi = F._$go | F._$fo, this._$Z = F._$kS) : (this._$hi = F._$go | F._$fo | F._$gb, this._$Z = F._$kS);
      }, F.prototype._$RT = function (t) {
        this._$IT(t);

        var i = t[0],
            e = t[2],
            r = t[1],
            o = t[3],
            n = Math.sqrt(i * i + r * r),
            s = i * o - e * r;
        0 == n ? at._$so && console.log("affine._$RT() / rt==0") : (t[0] = n, t[1] = s / n, t[2] = (r * o + i * e) / s, t[3] = Math.atan2(r, i));
      }, F.prototype._$ho = function (t, i, e, r) {
        var o = new Float32Array(6),
            n = new Float32Array(6);
        t._$RT(o), i._$RT(n);
        var s = new Float32Array(6);
        s[0] = o[0] + (n[0] - o[0]) * e, s[1] = o[1] + (n[1] - o[1]) * e, s[2] = o[2] + (n[2] - o[2]) * e, s[3] = o[3] + (n[3] - o[3]) * e, s[4] = o[4] + (n[4] - o[4]) * e, s[5] = o[5] + (n[5] - o[5]) * e, r._$CT(s);
      }, F.prototype._$CT = function (t) {
        var i = Math.cos(t[3]),
            e = Math.sin(t[3]);
        this._$7 = t[0] * i, this._$f = t[0] * e, this._$H = t[1] * (t[2] * i - e), this._$g = t[1] * (t[2] * e + i), this._$k = t[4], this._$w = t[5], this.update();
      }, F.prototype._$IT = function (t) {
        t[0] = this._$7, t[1] = this._$f, t[2] = this._$H, t[3] = this._$g, t[4] = this._$k, t[5] = this._$w;
      }, C.prototype = new s(), C._$cs = "VISIBLE:", C._$ar = "LAYOUT:", C._$Co = 0, C._$D2 = [], C._$1T = 1, C.loadMotion = function (t) {
        var i = new C(),
            e = [0],
            r = t.length;
        i._$yT = 0;

        for (var o = 0; o < r; ++o) {
          var n = 255 & t[o];
          if ("\n" != n && "\r" != n) if ("#" != n) {
            if ("$" != n) {
              if ("a" <= n && n <= "z" || "A" <= n && n <= "Z" || "_" == n) {
                for (var s = o, _ = -1; o < r && "\r" != (n = 255 & t[o]) && "\n" != n; ++o) {
                  if ("=" == n) {
                    _ = o;
                    break;
                  }
                }

                if (_ >= 0) {
                  var a = new B();
                  O.startsWith(t, s, C._$cs) ? (a._$RP = B._$hs, a._$4P = new String(t, s, _ - s)) : O.startsWith(t, s, C._$ar) ? (a._$4P = new String(t, s + 7, _ - s - 7), O.startsWith(t, s + 7, "ANCHOR_X") ? a._$RP = B._$xs : O.startsWith(t, s + 7, "ANCHOR_Y") ? a._$RP = B._$us : O.startsWith(t, s + 7, "SCALE_X") ? a._$RP = B._$qs : O.startsWith(t, s + 7, "SCALE_Y") ? a._$RP = B._$Ys : O.startsWith(t, s + 7, "X") ? a._$RP = B._$ws : O.startsWith(t, s + 7, "Y") && (a._$RP = B._$Ns)) : (a._$RP = B._$Fr, a._$4P = new String(t, s, _ - s)), i.motions.push(a);
                  var h = 0;

                  for (C._$D2.clear(), o = _ + 1; o < r && "\r" != (n = 255 & t[o]) && "\n" != n; ++o) {
                    if ("," != n && " " != n && "\t" != n) {
                      var l = O._$LS(t, r, o, e);

                      if (e[0] > 0) {
                        C._$D2.push(l), h++;
                        var $ = e[0];

                        if ($ < o) {
                          console.log("_$n0 _$hi . @Live2DMotion loadMotion()\n");
                          break;
                        }

                        o = $;
                      }
                    }
                  }

                  a._$I0 = C._$D2._$BL(), h > i._$yT && (i._$yT = h);
                }
              }
            } else {
              for (var s = o, _ = -1; o < r && "\r" != (n = 255 & t[o]) && "\n" != n; ++o) {
                if ("=" == n) {
                  _ = o;
                  break;
                }
              }

              var u = !1;
              if (_ >= 0) for (_ == s + 4 && "f" == t[s + 1] && "p" == t[s + 2] && "s" == t[s + 3] && (u = !0), o = _ + 1; o < r && "\r" != (n = 255 & t[o]) && "\n" != n; ++o) {
                if ("," != n && " " != n && "\t" != n) {
                  var l = O._$LS(t, r, o, e);

                  e[0] > 0 && u && 5 < l && l < 121 && (i._$D0 = l), o = e[0];
                }
              }

              for (; o < r && "\n" != t[o] && "\r" != t[o]; ++o) {
                ;
              }
            }
          } else for (; o < r && "\n" != t[o] && "\r" != t[o]; ++o) {
            ;
          }
        }

        return i._$AS = 1e3 * i._$yT / i._$D0 | 0, i;
      }, C.prototype.getDurationMSec = function () {
        return this._$AS;
      }, C.prototype.dump = function () {
        for (var t = 0; t < this.motions.length; t++) {
          var i = this.motions[t];
          console.log("_$wL[%s] [%d]. ", i._$4P, i._$I0.length);

          for (var e = 0; e < i._$I0.length && e < 10; e++) {
            console.log("%5.2f ,", i._$I0[e]);
          }

          console.log("\n");
        }
      }, C.prototype.updateParamExe = function (t, i, e, r) {
        for (var o = i - r._$z2, n = o * this._$D0 / 1e3, s = 0 | n, _ = n - s, a = 0; a < this.motions.length; a++) {
          var h = this.motions[a],
              l = h._$I0.length,
              $ = h._$4P;

          if (h._$RP == B._$hs) {
            var u = h._$I0[s >= l ? l - 1 : s];
            t.setParamFloat($, u);
          } else if (B._$ws <= h._$RP && h._$RP <= B._$Ys) ;else {
            var p = t.getParamFloat($),
                f = h._$I0[s >= l ? l - 1 : s],
                c = h._$I0[s + 1 >= l ? l - 1 : s + 1],
                d = f + (c - f) * _,
                g = p + (d - p) * e;
            t.setParamFloat($, g);
          }
        }

        s >= this._$yT && (this._$E ? (r._$z2 = i, this.loopFadeIn && (r._$bs = i)) : r._$9L = !0);
      }, C.prototype._$r0 = function () {
        return this._$E;
      }, C.prototype._$aL = function (t) {
        this._$E = t;
      }, C.prototype.isLoopFadeIn = function () {
        return this.loopFadeIn;
      }, C.prototype.setLoopFadeIn = function (t) {
        this.loopFadeIn = t;
      }, N.prototype.clear = function () {
        this.size = 0;
      }, N.prototype.add = function (t) {
        if (this._$P.length <= this.size) {
          var i = new Float32Array(2 * this.size);
          w._$jT(this._$P, 0, i, 0, this.size), this._$P = i;
        }

        this._$P[this.size++] = t;
      }, N.prototype._$BL = function () {
        var t = new Float32Array(this.size);
        return w._$jT(this._$P, 0, t, 0, this.size), t;
      }, B._$Fr = 0, B._$hs = 1, B._$ws = 100, B._$Ns = 101, B._$xs = 102, B._$us = 103, B._$qs = 104, B._$Ys = 105, U._$Ms = 1, U._$Qs = 2, U._$i2 = 0, U._$No = 2, U._$do = U._$Ms, U._$Ls = !0, U._$1r = 5, U._$Qb = 65, U._$J = 1e-4, U._$FT = .001, U._$Ss = 3, G._$o7 = 6, G._$S7 = 7, G._$s7 = 8, G._$77 = 9, G.LIVE2D_FORMAT_VERSION_V2_10_SDK2 = 10, G.LIVE2D_FORMAT_VERSION_V2_11_SDK2_1 = 11, G._$T7 = G.LIVE2D_FORMAT_VERSION_V2_11_SDK2_1, G._$Is = -2004318072, G._$h0 = 0, G._$4L = 23, G._$7P = 33, G._$uT = function (t) {
        console.log("_$bo :: _$6 _$mo _$E0 : %d\n", t);
      }, G._$9o = function (t) {
        if (t < 40) return G._$uT(t), null;
        if (t < 50) return G._$uT(t), null;
        if (t < 60) return G._$uT(t), null;
        if (t < 100) switch (t) {
          case 65:
            return new Z();

          case 66:
            return new D();

          case 67:
            return new x();

          case 68:
            return new z();

          case 69:
            return new P();

          case 70:
            return new $t();

          default:
            return G._$uT(t), null;
        } else if (t < 150) switch (t) {
          case 131:
            return new st();

          case 133:
            return new tt();

          case 136:
            return new p();

          case 137:
            return new ot();

          case 142:
            return new j();
        }
        return G._$uT(t), null;
      }, Y._$HP = 0, Y._$_0 = !0;
      Y._$V2 = -1, Y._$W0 = -1, Y._$jr = !1, Y._$ZS = !0, Y._$tr = -1e6, Y._$lr = 1e6, Y._$is = 32, Y._$e = !1, Y.prototype.getDrawDataIndex = function (t) {
        for (var i = this._$aS.length - 1; i >= 0; --i) {
          if (null != this._$aS[i] && this._$aS[i].getDrawDataID() == t) return i;
        }

        return -1;
      }, Y.prototype.getDrawData = function (t) {
        if (t instanceof b) {
          if (null == this._$Bo) {
            this._$Bo = new Object();

            for (var i = this._$aS.length, e = 0; e < i; e++) {
              var r = this._$aS[e],
                  o = r.getDrawDataID();
              null != o && (this._$Bo[o] = r);
            }
          }

          return this._$Bo[id];
        }

        return t < this._$aS.length ? this._$aS[t] : null;
      }, Y.prototype.release = function () {
        this._$3S.clear(), this._$aS.clear(), this._$F2.clear(), null != this._$Bo && this._$Bo.clear(), this._$db.clear(), this._$8b.clear(), this._$Hr.clear();
      }, Y.prototype.init = function () {
        this._$co++, this._$F2.length > 0 && this.release();

        for (var t = this._$Ri.getModelImpl(), i = t._$Xr(), r = i.length, o = new Array(), n = new Array(), s = 0; s < r; ++s) {
          var _ = i[s];
          this._$F2.push(_), this._$Hr.push(_.init(this));

          for (var a = _.getBaseData(), h = a.length, l = 0; l < h; ++l) {
            o.push(a[l]);
          }

          for (var l = 0; l < h; ++l) {
            var $ = a[l].init(this);
            $._$l2(s), n.push($);
          }

          for (var u = _.getDrawData(), p = u.length, l = 0; l < p; ++l) {
            var f = u[l],
                c = f.init(this);
            c._$IP = s, this._$aS.push(f), this._$8b.push(c);
          }
        }

        for (var d = o.length, g = yt._$2o();;) {
          for (var y = !1, s = 0; s < d; ++s) {
            var m = o[s];

            if (null != m) {
              var T = m.getTargetBaseDataID();
              (null == T || T == g || this.getBaseDataIndex(T) >= 0) && (this._$3S.push(m), this._$db.push(n[s]), o[s] = null, y = !0);
            }
          }

          if (!y) break;
        }

        var P = t._$E2();

        if (null != P) {
          var S = P._$1s();

          if (null != S) for (var v = S.length, s = 0; s < v; ++s) {
            var L = S[s];
            null != L && this._$02(L.getParamID(), L.getDefaultValue(), L.getMinValue(), L.getMaxValue());
          }
        }

        this.clipManager = new e(this.dp_webgl), this.clipManager.init(this, this._$aS, this._$8b), this._$QT = !0;
      }, Y.prototype.update = function () {
        Y._$e && _.start("_$zL");

        for (var t = this._$_2.length, i = 0; i < t; i++) {
          this._$_2[i] != this._$vr[i] && (this._$Js[i] = Y._$ZS, this._$vr[i] = this._$_2[i]);
        }

        var e = this._$3S.length,
            r = this._$aS.length,
            o = W._$or(),
            n = W._$Pr(),
            s = n - o + 1;

        (null == this._$Ws || this._$Ws.length < s) && (this._$Ws = new Int16Array(s), this._$Vs = new Int16Array(s));

        for (var i = 0; i < s; i++) {
          this._$Ws[i] = Y._$V2, this._$Vs[i] = Y._$V2;
        }

        (null == this._$Er || this._$Er.length < r) && (this._$Er = new Int16Array(r));

        for (var i = 0; i < r; i++) {
          this._$Er[i] = Y._$W0;
        }

        Y._$e && _.dump("_$zL"), Y._$e && _.start("_$UL");

        for (var a = null, h = 0; h < e; ++h) {
          var l = this._$3S[h],
              $ = this._$db[h];

          try {
            l._$Nr(this, $), l._$2b(this, $);
          } catch (t) {
            null == a && (a = t);
          }
        }

        null != a && Y._$_0 && _._$Rb(a), Y._$e && _.dump("_$UL"), Y._$e && _.start("_$DL");

        for (var u = null, p = 0; p < r; ++p) {
          var f = this._$aS[p],
              c = this._$8b[p];

          try {
            if (f._$Nr(this, c), c._$u2()) continue;

            f._$2b(this, c);

            var d,
                g = Math.floor(f._$zS(this, c) - o);

            try {
              d = this._$Vs[g];
            } catch (t) {
              console.log("_$li :: %s / %s \t\t\t\t@@_$fS\n", t.toString(), f.getDrawDataID().toString()), g = Math.floor(f._$zS(this, c) - o);
              continue;
            }

            d == Y._$V2 ? this._$Ws[g] = p : this._$Er[d] = p, this._$Vs[g] = p;
          } catch (t) {
            null == u && (u = t, at._$sT(at._$H7));
          }
        }

        null != u && Y._$_0 && _._$Rb(u), Y._$e && _.dump("_$DL"), Y._$e && _.start("_$eL");

        for (var i = this._$Js.length - 1; i >= 0; i--) {
          this._$Js[i] = Y._$jr;
        }

        return this._$QT = !1, Y._$e && _.dump("_$eL"), !1;
      }, Y.prototype.preDraw = function (t) {
        null != this.clipManager && (t._$ZT(), this.clipManager.setupClip(this, t));
      }, Y.prototype.draw = function (t) {
        if (null == this._$Ws) return void _._$li("call _$Ri.update() before _$Ri.draw() ");
        var i = this._$Ws.length;

        t._$ZT();

        for (var e = 0; e < i; ++e) {
          var r = this._$Ws[e];
          if (r != Y._$V2) for (;;) {
            var o = this._$aS[r],
                n = this._$8b[r];

            if (n._$yo()) {
              var s = n._$IP,
                  a = this._$Hr[s];
              n._$VS = a.getPartsOpacity(), o.draw(t, this, n);
            }

            var h = this._$Er[r];
            if (h <= r || h == Y._$W0) break;
            r = h;
          }
        }
      }, Y.prototype.getParamIndex = function (t) {
        for (var i = this._$pb.length - 1; i >= 0; --i) {
          if (this._$pb[i] == t) return i;
        }

        return this._$02(t, 0, Y._$tr, Y._$lr);
      }, Y.prototype._$BS = function (t) {
        return this.getBaseDataIndex(t);
      }, Y.prototype.getBaseDataIndex = function (t) {
        for (var i = this._$3S.length - 1; i >= 0; --i) {
          if (null != this._$3S[i] && this._$3S[i].getBaseDataID() == t) return i;
        }

        return -1;
      }, Y.prototype._$UT = function (t, i) {
        var e = new Float32Array(i);
        return w._$jT(t, 0, e, 0, t.length), e;
      }, Y.prototype._$02 = function (t, i, e, r) {
        if (this._$qo >= this._$pb.length) {
          var o = this._$pb.length,
              n = new Array(2 * o);
          w._$jT(this._$pb, 0, n, 0, o), this._$pb = n, this._$_2 = this._$UT(this._$_2, 2 * o), this._$vr = this._$UT(this._$vr, 2 * o), this._$Rr = this._$UT(this._$Rr, 2 * o), this._$Or = this._$UT(this._$Or, 2 * o);
          var s = new Array();
          w._$jT(this._$Js, 0, s, 0, o), this._$Js = s;
        }

        return this._$pb[this._$qo] = t, this._$_2[this._$qo] = i, this._$vr[this._$qo] = i, this._$Rr[this._$qo] = e, this._$Or[this._$qo] = r, this._$Js[this._$qo] = Y._$ZS, this._$qo++;
      }, Y.prototype._$Zo = function (t, i) {
        this._$3S[t] = i;
      }, Y.prototype.setParamFloat = function (t, i) {
        i < this._$Rr[t] && (i = this._$Rr[t]), i > this._$Or[t] && (i = this._$Or[t]), this._$_2[t] = i;
      }, Y.prototype.loadParam = function () {
        var t = this._$_2.length;
        t > this._$fs.length && (t = this._$fs.length), w._$jT(this._$fs, 0, this._$_2, 0, t);
      }, Y.prototype.saveParam = function () {
        var t = this._$_2.length;
        t > this._$fs.length && (this._$fs = new Float32Array(t)), w._$jT(this._$_2, 0, this._$fs, 0, t);
      }, Y.prototype._$v2 = function () {
        return this._$co;
      }, Y.prototype._$WS = function () {
        return this._$QT;
      }, Y.prototype._$Xb = function (t) {
        return this._$Js[t] == Y._$ZS;
      }, Y.prototype._$vs = function () {
        return this._$Es;
      }, Y.prototype._$Tr = function () {
        return this._$ZP;
      }, Y.prototype.getBaseData = function (t) {
        return this._$3S[t];
      }, Y.prototype.getParamFloat = function (t) {
        return this._$_2[t];
      }, Y.prototype.getParamMax = function (t) {
        return this._$Or[t];
      }, Y.prototype.getParamMin = function (t) {
        return this._$Rr[t];
      }, Y.prototype.setPartsOpacity = function (t, i) {
        this._$Hr[t].setPartsOpacity(i);
      }, Y.prototype.getPartsOpacity = function (t) {
        return this._$Hr[t].getPartsOpacity();
      }, Y.prototype.getPartsDataIndex = function (t) {
        for (var i = this._$F2.length - 1; i >= 0; --i) {
          if (null != this._$F2[i] && this._$F2[i]._$p2() == t) return i;
        }

        return -1;
      }, Y.prototype._$q2 = function (t) {
        return this._$db[t];
      }, Y.prototype._$C2 = function (t) {
        return this._$8b[t];
      }, Y.prototype._$Bb = function (t) {
        return this._$Hr[t];
      }, Y.prototype._$5s = function (t, i) {
        for (var e = this._$Ws.length, r = t, o = 0; o < e; ++o) {
          var n = this._$Ws[o];
          if (n != Y._$V2) for (;;) {
            var s = this._$8b[n];
            s._$yo() && (s._$GT()._$B2(this, s, r), r += i);
            var _ = this._$Er[n];
            if (_ <= n || _ == Y._$W0) break;
            n = _;
          }
        }
      }, Y.prototype.setDrawParam = function (t) {
        this.dp_webgl = t;
      }, Y.prototype.getDrawParam = function () {
        return this.dp_webgl;
      }, k._$0T = function (t) {
        return k._$0T(new _$5(t));
      }, k._$0T = function (t) {
        if (!t.exists()) throw new _$ls(t._$3b());

        for (var i, e = t.length(), r = new Int8Array(e), o = new _$Xs(new _$kb(t), 8192), n = 0; (i = o.read(r, n, e - n)) > 0;) {
          n += i;
        }

        return r;
      }, k._$C = function (t) {
        var i = null,
            e = null;

        try {
          i = t instanceof Array ? t : new _$Xs(t, 8192), e = new _$js();

          for (var r, o = new Int8Array(1e3); (r = i.read(o)) > 0;) {
            e.write(o, 0, r);
          }

          return e._$TS();
        } finally {
          null != t && t.close(), null != e && (e.flush(), e.close());
        }
      }, V.prototype._$T2 = function () {
        return w.getUserTimeMSec() + Math._$10() * (2 * this._$Br - 1);
      }, V.prototype._$uo = function (t) {
        this._$Br = t;
      }, V.prototype._$QS = function (t, i, e) {
        this._$Dr = t, this._$Cb = i, this._$mr = e;
      }, V.prototype._$7T = function (t) {
        var i,
            e = w.getUserTimeMSec(),
            r = 0;

        switch (this._$_L) {
          case STATE_CLOSING:
            r = (e - this._$bb) / this._$Dr, r >= 1 && (r = 1, this._$_L = wt.STATE_CLOSED, this._$bb = e), i = 1 - r;
            break;

          case STATE_CLOSED:
            r = (e - this._$bb) / this._$Cb, r >= 1 && (this._$_L = wt.STATE_OPENING, this._$bb = e), i = 0;
            break;

          case STATE_OPENING:
            r = (e - this._$bb) / this._$mr, r >= 1 && (r = 1, this._$_L = wt.STATE_INTERVAL, this._$12 = this._$T2()), i = r;
            break;

          case STATE_INTERVAL:
            this._$12 < e && (this._$_L = wt.STATE_CLOSING, this._$bb = e), i = 1;
            break;

          case STATE_FIRST:
          default:
            this._$_L = wt.STATE_INTERVAL, this._$12 = this._$T2(), i = 1;
        }

        this._$jo || (i = -i), t.setParamFloat(this._$iL, i), t.setParamFloat(this._$0L, i);
      };

      var wt = function wt() {};

      wt.STATE_FIRST = "STATE_FIRST", wt.STATE_INTERVAL = "STATE_INTERVAL", wt.STATE_CLOSING = "STATE_CLOSING", wt.STATE_CLOSED = "STATE_CLOSED", wt.STATE_OPENING = "STATE_OPENING", X.prototype = new E(), X._$As = 32, X._$Gr = !1, X._$NT = null, X._$vS = null, X._$no = null, X._$9r = function (t) {
        return new Float32Array(t);
      }, X._$vb = function (t) {
        return new Int16Array(t);
      }, X._$cr = function (t, i) {
        return null == t || t._$yL() < i.length ? (t = X._$9r(2 * i.length), t.put(i), t._$oT(0)) : (t.clear(), t.put(i), t._$oT(0)), t;
      }, X._$mb = function (t, i) {
        return null == t || t._$yL() < i.length ? (t = X._$vb(2 * i.length), t.put(i), t._$oT(0)) : (t.clear(), t.put(i), t._$oT(0)), t;
      }, X._$Hs = function () {
        return X._$Gr;
      }, X._$as = function (t) {
        X._$Gr = t;
      }, X.prototype.setGL = function (t) {
        this.gl = t;
      }, X.prototype.setTransform = function (t) {
        this.transform = t;
      }, X.prototype._$ZT = function () {}, X.prototype._$Uo = function (t, i, e, r, o, n, s, _) {
        if (!(n < .01)) {
          var a = this._$U2[t],
              h = n > .9 ? at.EXPAND_W : 0;
          this.gl.drawElements(a, e, r, o, n, h, this.transform, _);
        }
      }, X.prototype._$Rs = function () {
        throw new Error("_$Rs");
      }, X.prototype._$Ds = function (t) {
        throw new Error("_$Ds");
      }, X.prototype._$K2 = function () {
        for (var t = 0; t < this._$sb.length; t++) {
          0 != this._$sb[t] && (this.gl._$Sr(1, this._$sb, t), this._$sb[t] = 0);
        }
      }, X.prototype.setTexture = function (t, i) {
        this._$sb.length < t + 1 && this._$nS(t), this._$sb[t] = i;
      }, X.prototype.setTexture = function (t, i) {
        this._$sb.length < t + 1 && this._$nS(t), this._$U2[t] = i;
      }, X.prototype._$nS = function (t) {
        var i = Math.max(2 * this._$sb.length, t + 1 + 10),
            e = new Int32Array(i);
        w._$jT(this._$sb, 0, e, 0, this._$sb.length), this._$sb = e;
        var r = new Array();
        w._$jT(this._$U2, 0, r, 0, this._$U2.length), this._$U2 = r;
      }, z.prototype = new I(), z._$Xo = new Float32Array(2), z._$io = new Float32Array(2), z._$0o = new Float32Array(2), z._$Lo = new Float32Array(2), z._$To = new Float32Array(2), z._$Po = new Float32Array(2), z._$gT = new Array(), z.prototype._$zP = function () {
        this._$GS = new D(), this._$GS._$zP(), this._$Y0 = new Array();
      }, z.prototype.getType = function () {
        return I._$c2;
      }, z.prototype._$F0 = function (t) {
        I.prototype._$F0.call(this, t), this._$GS = t._$nP(), this._$Y0 = t._$nP(), I.prototype.readV2_opacity.call(this, t);
      }, z.prototype.init = function (t) {
        var i = new H(this);
        return i._$Yr = new P(), this._$32() && (i._$Wr = new P()), i;
      }, z.prototype._$Nr = function (t, i) {
        this != i._$GT() && console.log("### assert!! ### ");
        var e = i;

        if (this._$GS._$Ur(t)) {
          var r = z._$gT;
          r[0] = !1;

          var o = this._$GS._$Q2(t, r);

          i._$Ib(r[0]), this.interpolateOpacity(t, this._$GS, i, r);

          var n = t._$vs(),
              s = t._$Tr();

          if (this._$GS._$zr(n, s, o), o <= 0) {
            var _ = this._$Y0[n[0]];

            e._$Yr.init(_);
          } else if (1 == o) {
            var _ = this._$Y0[n[0]],
                a = this._$Y0[n[1]],
                h = s[0];
            e._$Yr._$fL = _._$fL + (a._$fL - _._$fL) * h, e._$Yr._$gL = _._$gL + (a._$gL - _._$gL) * h, e._$Yr._$B0 = _._$B0 + (a._$B0 - _._$B0) * h, e._$Yr._$z0 = _._$z0 + (a._$z0 - _._$z0) * h, e._$Yr._$qT = _._$qT + (a._$qT - _._$qT) * h;
          } else if (2 == o) {
            var _ = this._$Y0[n[0]],
                a = this._$Y0[n[1]],
                l = this._$Y0[n[2]],
                $ = this._$Y0[n[3]],
                h = s[0],
                u = s[1],
                p = _._$fL + (a._$fL - _._$fL) * h,
                f = l._$fL + ($._$fL - l._$fL) * h;
            e._$Yr._$fL = p + (f - p) * u, p = _._$gL + (a._$gL - _._$gL) * h, f = l._$gL + ($._$gL - l._$gL) * h, e._$Yr._$gL = p + (f - p) * u, p = _._$B0 + (a._$B0 - _._$B0) * h, f = l._$B0 + ($._$B0 - l._$B0) * h, e._$Yr._$B0 = p + (f - p) * u, p = _._$z0 + (a._$z0 - _._$z0) * h, f = l._$z0 + ($._$z0 - l._$z0) * h, e._$Yr._$z0 = p + (f - p) * u, p = _._$qT + (a._$qT - _._$qT) * h, f = l._$qT + ($._$qT - l._$qT) * h, e._$Yr._$qT = p + (f - p) * u;
          } else if (3 == o) {
            var c = this._$Y0[n[0]],
                d = this._$Y0[n[1]],
                g = this._$Y0[n[2]],
                y = this._$Y0[n[3]],
                m = this._$Y0[n[4]],
                T = this._$Y0[n[5]],
                P = this._$Y0[n[6]],
                S = this._$Y0[n[7]],
                h = s[0],
                u = s[1],
                v = s[2],
                p = c._$fL + (d._$fL - c._$fL) * h,
                f = g._$fL + (y._$fL - g._$fL) * h,
                L = m._$fL + (T._$fL - m._$fL) * h,
                M = P._$fL + (S._$fL - P._$fL) * h;
            e._$Yr._$fL = (1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u), p = c._$gL + (d._$gL - c._$gL) * h, f = g._$gL + (y._$gL - g._$gL) * h, L = m._$gL + (T._$gL - m._$gL) * h, M = P._$gL + (S._$gL - P._$gL) * h, e._$Yr._$gL = (1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u), p = c._$B0 + (d._$B0 - c._$B0) * h, f = g._$B0 + (y._$B0 - g._$B0) * h, L = m._$B0 + (T._$B0 - m._$B0) * h, M = P._$B0 + (S._$B0 - P._$B0) * h, e._$Yr._$B0 = (1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u), p = c._$z0 + (d._$z0 - c._$z0) * h, f = g._$z0 + (y._$z0 - g._$z0) * h, L = m._$z0 + (T._$z0 - m._$z0) * h, M = P._$z0 + (S._$z0 - P._$z0) * h, e._$Yr._$z0 = (1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u), p = c._$qT + (d._$qT - c._$qT) * h, f = g._$qT + (y._$qT - g._$qT) * h, L = m._$qT + (T._$qT - m._$qT) * h, M = P._$qT + (S._$qT - P._$qT) * h, e._$Yr._$qT = (1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u);
          } else if (4 == o) {
            var E = this._$Y0[n[0]],
                A = this._$Y0[n[1]],
                I = this._$Y0[n[2]],
                w = this._$Y0[n[3]],
                x = this._$Y0[n[4]],
                O = this._$Y0[n[5]],
                D = this._$Y0[n[6]],
                R = this._$Y0[n[7]],
                b = this._$Y0[n[8]],
                F = this._$Y0[n[9]],
                C = this._$Y0[n[10]],
                N = this._$Y0[n[11]],
                B = this._$Y0[n[12]],
                U = this._$Y0[n[13]],
                G = this._$Y0[n[14]],
                Y = this._$Y0[n[15]],
                h = s[0],
                u = s[1],
                v = s[2],
                k = s[3],
                p = E._$fL + (A._$fL - E._$fL) * h,
                f = I._$fL + (w._$fL - I._$fL) * h,
                L = x._$fL + (O._$fL - x._$fL) * h,
                M = D._$fL + (R._$fL - D._$fL) * h,
                V = b._$fL + (F._$fL - b._$fL) * h,
                X = C._$fL + (N._$fL - C._$fL) * h,
                H = B._$fL + (U._$fL - B._$fL) * h,
                W = G._$fL + (Y._$fL - G._$fL) * h;
            e._$Yr._$fL = (1 - k) * ((1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u)) + k * ((1 - v) * (V + (X - V) * u) + v * (H + (W - H) * u)), p = E._$gL + (A._$gL - E._$gL) * h, f = I._$gL + (w._$gL - I._$gL) * h, L = x._$gL + (O._$gL - x._$gL) * h, M = D._$gL + (R._$gL - D._$gL) * h, V = b._$gL + (F._$gL - b._$gL) * h, X = C._$gL + (N._$gL - C._$gL) * h, H = B._$gL + (U._$gL - B._$gL) * h, W = G._$gL + (Y._$gL - G._$gL) * h, e._$Yr._$gL = (1 - k) * ((1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u)) + k * ((1 - v) * (V + (X - V) * u) + v * (H + (W - H) * u)), p = E._$B0 + (A._$B0 - E._$B0) * h, f = I._$B0 + (w._$B0 - I._$B0) * h, L = x._$B0 + (O._$B0 - x._$B0) * h, M = D._$B0 + (R._$B0 - D._$B0) * h, V = b._$B0 + (F._$B0 - b._$B0) * h, X = C._$B0 + (N._$B0 - C._$B0) * h, H = B._$B0 + (U._$B0 - B._$B0) * h, W = G._$B0 + (Y._$B0 - G._$B0) * h, e._$Yr._$B0 = (1 - k) * ((1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u)) + k * ((1 - v) * (V + (X - V) * u) + v * (H + (W - H) * u)), p = E._$z0 + (A._$z0 - E._$z0) * h, f = I._$z0 + (w._$z0 - I._$z0) * h, L = x._$z0 + (O._$z0 - x._$z0) * h, M = D._$z0 + (R._$z0 - D._$z0) * h, V = b._$z0 + (F._$z0 - b._$z0) * h, X = C._$z0 + (N._$z0 - C._$z0) * h, H = B._$z0 + (U._$z0 - B._$z0) * h, W = G._$z0 + (Y._$z0 - G._$z0) * h, e._$Yr._$z0 = (1 - k) * ((1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u)) + k * ((1 - v) * (V + (X - V) * u) + v * (H + (W - H) * u)), p = E._$qT + (A._$qT - E._$qT) * h, f = I._$qT + (w._$qT - I._$qT) * h, L = x._$qT + (O._$qT - x._$qT) * h, M = D._$qT + (R._$qT - D._$qT) * h, V = b._$qT + (F._$qT - b._$qT) * h, X = C._$qT + (N._$qT - C._$qT) * h, H = B._$qT + (U._$qT - B._$qT) * h, W = G._$qT + (Y._$qT - G._$qT) * h, e._$Yr._$qT = (1 - k) * ((1 - v) * (p + (f - p) * u) + v * (L + (M - L) * u)) + k * ((1 - v) * (V + (X - V) * u) + v * (H + (W - H) * u));
          } else {
            for (var j = 0 | Math.pow(2, o), q = new Float32Array(j), J = 0; J < j; J++) {
              for (var Q = J, Z = 1, K = 0; K < o; K++) {
                Z *= Q % 2 == 0 ? 1 - s[K] : s[K], Q /= 2;
              }

              q[J] = Z;
            }

            for (var tt = new Array(), it = 0; it < j; it++) {
              tt[it] = this._$Y0[n[it]];
            }

            for (var et = 0, rt = 0, ot = 0, nt = 0, st = 0, it = 0; it < j; it++) {
              et += q[it] * tt[it]._$fL, rt += q[it] * tt[it]._$gL, ot += q[it] * tt[it]._$B0, nt += q[it] * tt[it]._$z0, st += q[it] * tt[it]._$qT;
            }

            e._$Yr._$fL = et, e._$Yr._$gL = rt, e._$Yr._$B0 = ot, e._$Yr._$z0 = nt, e._$Yr._$qT = st;
          }

          var _ = this._$Y0[n[0]];
          e._$Yr.reflectX = _.reflectX, e._$Yr.reflectY = _.reflectY;
        }
      }, z.prototype._$2b = function (t, i) {
        this != i._$GT() && console.log("### assert!! ### ");
        var e = i;

        if (e._$hS(!0), this._$32()) {
          var r = this.getTargetBaseDataID();
          if (e._$8r == I._$ur && (e._$8r = t.getBaseDataIndex(r)), e._$8r < 0) at._$so && _._$li("_$L _$0P _$G :: %s", r), e._$hS(!1);else {
            var o = t.getBaseData(e._$8r);

            if (null != o) {
              var n = t._$q2(e._$8r),
                  s = z._$Xo;

              s[0] = e._$Yr._$fL, s[1] = e._$Yr._$gL;
              var a = z._$io;
              a[0] = 0, a[1] = -.1;
              n._$GT().getType() == I._$c2 ? a[1] = -10 : a[1] = -.1;
              var h = z._$0o;

              this._$Jr(t, o, n, s, a, h);

              var l = Lt._$92(a, h);

              o._$nb(t, n, s, s, 1, 0, 2), e._$Wr._$fL = s[0], e._$Wr._$gL = s[1], e._$Wr._$B0 = e._$Yr._$B0, e._$Wr._$z0 = e._$Yr._$z0, e._$Wr._$qT = e._$Yr._$qT - l * Lt._$NS;
              var $ = n.getTotalScale();
              e.setTotalScale_notForClient($ * e._$Wr._$B0);
              var u = n.getTotalOpacity();
              e.setTotalOpacity(u * e.getInterpolatedOpacity()), e._$Wr.reflectX = e._$Yr.reflectX, e._$Wr.reflectY = e._$Yr.reflectY, e._$hS(n._$yo());
            } else e._$hS(!1);
          }
        } else e.setTotalScale_notForClient(e._$Yr._$B0), e.setTotalOpacity(e.getInterpolatedOpacity());
      }, z.prototype._$nb = function (t, i, e, r, o, n, s) {
        this != i._$GT() && console.log("### assert!! ### ");

        for (var _, a, h = i, l = null != h._$Wr ? h._$Wr : h._$Yr, $ = Math.sin(Lt._$bS * l._$qT), u = Math.cos(Lt._$bS * l._$qT), p = h.getTotalScale(), f = l.reflectX ? -1 : 1, c = l.reflectY ? -1 : 1, d = u * p * f, g = -$ * p * c, y = $ * p * f, m = u * p * c, T = l._$fL, P = l._$gL, S = o * s, v = n; v < S; v += s) {
          _ = e[v], a = e[v + 1], r[v] = d * _ + g * a + T, r[v + 1] = y * _ + m * a + P;
        }
      }, z.prototype._$Jr = function (t, i, e, r, o, n) {
        i != e._$GT() && console.log("### assert!! ### ");
        var s = z._$Lo;
        z._$Lo[0] = r[0], z._$Lo[1] = r[1], i._$nb(t, e, s, s, 1, 0, 2);

        for (var _ = z._$To, a = z._$Po, h = 1, l = 0; l < 10; l++) {
          if (a[0] = r[0] + h * o[0], a[1] = r[1] + h * o[1], i._$nb(t, e, a, _, 1, 0, 2), _[0] -= s[0], _[1] -= s[1], 0 != _[0] || 0 != _[1]) return n[0] = _[0], void (n[1] = _[1]);
          if (a[0] = r[0] - h * o[0], a[1] = r[1] - h * o[1], i._$nb(t, e, a, _, 1, 0, 2), _[0] -= s[0], _[1] -= s[1], 0 != _[0] || 0 != _[1]) return _[0] = -_[0], _[0] = -_[0], n[0] = _[0], void (n[1] = _[1]);
          h *= .1;
        }

        at._$so && console.log("_$L0 to transform _$SP\n");
      }, H.prototype = new _t(), W.prototype = new M(), W._$ur = -2, W._$ES = 500, W._$wb = 2, W._$8S = 3, W._$os = 4, W._$52 = W._$ES, W._$R2 = W._$ES, W._$Sb = function (t) {
        for (var i = t.length - 1; i >= 0; --i) {
          var e = t[i];
          e < W._$52 ? W._$52 = e : e > W._$R2 && (W._$R2 = e);
        }
      }, W._$or = function () {
        return W._$52;
      }, W._$Pr = function () {
        return W._$R2;
      }, W.prototype._$F0 = function (t) {
        this._$gP = t._$nP(), this._$dr = t._$nP(), this._$GS = t._$nP(), this._$qb = t._$6L(), this._$Lb = t._$cS(), this._$mS = t._$Tb(), t.getFormatVersion() >= G._$T7 ? (this.clipID = t._$nP(), this.clipIDList = this.convertClipIDForV2_11(this.clipID)) : this.clipIDList = null, W._$Sb(this._$Lb);
      }, W.prototype.getClipIDList = function () {
        return this.clipIDList;
      }, W.prototype._$Nr = function (t, i) {
        if (i._$IS[0] = !1, i._$Us = v._$Z2(t, this._$GS, i._$IS, this._$Lb), at._$Zs) ;else if (i._$IS[0]) return;
        i._$7s = v._$br(t, this._$GS, i._$IS, this._$mS);
      }, W.prototype._$2b = function (t) {}, W.prototype.getDrawDataID = function () {
        return this._$gP;
      }, W.prototype._$j2 = function (t) {
        this._$gP = t;
      }, W.prototype.getOpacity = function (t, i) {
        return i._$7s;
      }, W.prototype._$zS = function (t, i) {
        return i._$Us;
      }, W.prototype.getTargetBaseDataID = function () {
        return this._$dr;
      }, W.prototype._$gs = function (t) {
        this._$dr = t;
      }, W.prototype._$32 = function () {
        return null != this._$dr && this._$dr != yt._$2o();
      }, W.prototype.getType = function () {}, j._$42 = 0, j.prototype._$1b = function () {
        return this._$3S;
      }, j.prototype.getDrawDataList = function () {
        return this._$aS;
      }, j.prototype._$F0 = function (t) {
        this._$NL = t._$nP(), this._$aS = t._$nP(), this._$3S = t._$nP();
      }, j.prototype._$kr = function (t) {
        t._$Zo(this._$3S), t._$xo(this._$aS), this._$3S = null, this._$aS = null;
      }, q.prototype = new i(), q.loadModel = function (t) {
        var e = new q();
        return i._$62(e, t), e;
      }, q.loadModel = function (t) {
        var e = new q();
        return i._$62(e, t), e;
      }, q._$to = function () {
        return new q();
      }, q._$er = function (t) {
        var i = new _$5("../_$_r/_$t0/_$Ri/_$_P._$d");
        if (0 == i.exists()) throw new _$ls("_$t0 _$_ _$6 _$Ui :: " + i._$PL());

        for (var e = ["../_$_r/_$t0/_$Ri/_$_P.512/_$CP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$vP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$EP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$pP._$1"], r = q.loadModel(i._$3b()), o = 0; o < e.length; o++) {
          var n = new _$5(e[o]);
          if (0 == n.exists()) throw new _$ls("_$t0 _$_ _$6 _$Ui :: " + n._$PL());
          r.setTexture(o, _$nL._$_o(t, n._$3b()));
        }

        return r;
      }, q.prototype.setGL = function (t) {
        this._$zo.setGL(t);
      }, q.prototype.setTransform = function (t) {
        this._$zo.setTransform(t);
      }, q.prototype.draw = function () {
        this._$5S.draw(this._$zo);
      }, q.prototype._$K2 = function () {
        this._$zo._$K2();
      }, q.prototype.setTexture = function (t, i) {
        null == this._$zo && _._$li("_$Yi for QT _$ki / _$XS() is _$6 _$ui!!"), this._$zo.setTexture(t, i);
      }, q.prototype.setTexture = function (t, i) {
        null == this._$zo && _._$li("_$Yi for QT _$ki / _$XS() is _$6 _$ui!!"), this._$zo.setTexture(t, i);
      }, q.prototype._$Rs = function () {
        return this._$zo._$Rs();
      }, q.prototype._$Ds = function (t) {
        this._$zo._$Ds(t);
      }, q.prototype.getDrawParam = function () {
        return this._$zo;
      }, J.prototype = new s(), J._$cs = "VISIBLE:", J._$ar = "LAYOUT:", J.MTN_PREFIX_FADEIN = "FADEIN:", J.MTN_PREFIX_FADEOUT = "FADEOUT:", J._$Co = 0, J._$1T = 1, J.loadMotion = function (t) {
        var i = k._$C(t);

        return J.loadMotion(i);
      }, J.loadMotion = function (t) {
        t instanceof ArrayBuffer && (t = new DataView(t));
        var i = new J(),
            e = [0],
            r = t.byteLength;
        i._$yT = 0;

        for (var o = 0; o < r; ++o) {
          var n = Q(t, o),
              s = n.charCodeAt(0);
          if ("\n" != n && "\r" != n) if ("#" != n) {
            if ("$" != n) {
              if (97 <= s && s <= 122 || 65 <= s && s <= 90 || "_" == n) {
                for (var _ = o, a = -1; o < r && "\r" != (n = Q(t, o)) && "\n" != n; ++o) {
                  if ("=" == n) {
                    a = o;
                    break;
                  }
                }

                if (a >= 0) {
                  var h = new B();
                  O.startsWith(t, _, J._$cs) ? (h._$RP = B._$hs, h._$4P = O.createString(t, _, a - _)) : O.startsWith(t, _, J._$ar) ? (h._$4P = O.createString(t, _ + 7, a - _ - 7), O.startsWith(t, _ + 7, "ANCHOR_X") ? h._$RP = B._$xs : O.startsWith(t, _ + 7, "ANCHOR_Y") ? h._$RP = B._$us : O.startsWith(t, _ + 7, "SCALE_X") ? h._$RP = B._$qs : O.startsWith(t, _ + 7, "SCALE_Y") ? h._$RP = B._$Ys : O.startsWith(t, _ + 7, "X") ? h._$RP = B._$ws : O.startsWith(t, _ + 7, "Y") && (h._$RP = B._$Ns)) : (h._$RP = B._$Fr, h._$4P = O.createString(t, _, a - _)), i.motions.push(h);
                  var l = 0,
                      $ = [];

                  for (o = a + 1; o < r && "\r" != (n = Q(t, o)) && "\n" != n; ++o) {
                    if ("," != n && " " != n && "\t" != n) {
                      var u = O._$LS(t, r, o, e);

                      if (e[0] > 0) {
                        $.push(u), l++;
                        var p = e[0];

                        if (p < o) {
                          console.log("_$n0 _$hi . @Live2DMotion loadMotion()\n");
                          break;
                        }

                        o = p - 1;
                      }
                    }
                  }

                  h._$I0 = new Float32Array($), l > i._$yT && (i._$yT = l);
                }
              }
            } else {
              for (var _ = o, a = -1; o < r && "\r" != (n = Q(t, o)) && "\n" != n; ++o) {
                if ("=" == n) {
                  a = o;
                  break;
                }
              }

              var f = !1;
              if (a >= 0) for (a == _ + 4 && "f" == Q(t, _ + 1) && "p" == Q(t, _ + 2) && "s" == Q(t, _ + 3) && (f = !0), o = a + 1; o < r && "\r" != (n = Q(t, o)) && "\n" != n; ++o) {
                if ("," != n && " " != n && "\t" != n) {
                  var u = O._$LS(t, r, o, e);

                  e[0] > 0 && f && 5 < u && u < 121 && (i._$D0 = u), o = e[0];
                }
              }

              for (; o < r && "\n" != Q(t, o) && "\r" != Q(t, o); ++o) {
                ;
              }
            }
          } else for (; o < r && "\n" != Q(t, o) && "\r" != Q(t, o); ++o) {
            ;
          }
        }

        return i._$rr = 1e3 * i._$yT / i._$D0 | 0, i;
      }, J.prototype.getDurationMSec = function () {
        return this._$E ? -1 : this._$rr;
      }, J.prototype.getLoopDurationMSec = function () {
        return this._$rr;
      }, J.prototype.dump = function () {
        for (var t = 0; t < this.motions.length; t++) {
          var i = this.motions[t];
          console.log("_$wL[%s] [%d]. ", i._$4P, i._$I0.length);

          for (var e = 0; e < i._$I0.length && e < 10; e++) {
            console.log("%5.2f ,", i._$I0[e]);
          }

          console.log("\n");
        }
      }, J.prototype.updateParamExe = function (t, i, e, r) {
        for (var o = i - r._$z2, n = o * this._$D0 / 1e3, s = 0 | n, _ = n - s, a = 0; a < this.motions.length; a++) {
          var h = this.motions[a],
              l = h._$I0.length,
              $ = h._$4P;

          if (h._$RP == B._$hs) {
            var u = h._$I0[s >= l ? l - 1 : s];
            t.setParamFloat($, u);
          } else if (B._$ws <= h._$RP && h._$RP <= B._$Ys) ;else {
            var p,
                f = t.getParamIndex($),
                c = t.getModelContext(),
                d = c.getParamMax(f),
                g = c.getParamMin(f),
                y = .4 * (d - g),
                m = c.getParamFloat(f),
                T = h._$I0[s >= l ? l - 1 : s],
                P = h._$I0[s + 1 >= l ? l - 1 : s + 1];
            p = T < P && P - T > y || T > P && T - P > y ? T : T + (P - T) * _;
            var S = m + (p - m) * e;
            t.setParamFloat($, S);
          }
        }

        s >= this._$yT && (this._$E ? (r._$z2 = i, this.loopFadeIn && (r._$bs = i)) : r._$9L = !0), this._$eP = e;
      }, J.prototype._$r0 = function () {
        return this._$E;
      }, J.prototype._$aL = function (t) {
        this._$E = t;
      }, J.prototype._$S0 = function () {
        return this._$D0;
      }, J.prototype._$U0 = function (t) {
        this._$D0 = t;
      }, J.prototype.isLoopFadeIn = function () {
        return this.loopFadeIn;
      }, J.prototype.setLoopFadeIn = function (t) {
        this.loopFadeIn = t;
      }, N.prototype.clear = function () {
        this.size = 0;
      }, N.prototype.add = function (t) {
        if (this._$P.length <= this.size) {
          var i = new Float32Array(2 * this.size);
          w._$jT(this._$P, 0, i, 0, this.size), this._$P = i;
        }

        this._$P[this.size++] = t;
      }, N.prototype._$BL = function () {
        var t = new Float32Array(this.size);
        return w._$jT(this._$P, 0, t, 0, this.size), t;
      }, B._$Fr = 0, B._$hs = 1, B._$ws = 100, B._$Ns = 101, B._$xs = 102, B._$us = 103, B._$qs = 104, B._$Ys = 105, Z.prototype = new I(), Z._$gT = new Array(), Z.prototype._$zP = function () {
        this._$GS = new D(), this._$GS._$zP();
      }, Z.prototype._$F0 = function (t) {
        I.prototype._$F0.call(this, t), this._$A = t._$6L(), this._$o = t._$6L(), this._$GS = t._$nP(), this._$Eo = t._$nP(), I.prototype.readV2_opacity.call(this, t);
      }, Z.prototype.init = function (t) {
        var i = new K(this),
            e = (this._$o + 1) * (this._$A + 1);
        return null != i._$Cr && (i._$Cr = null), i._$Cr = new Float32Array(2 * e), null != i._$hr && (i._$hr = null), this._$32() ? i._$hr = new Float32Array(2 * e) : i._$hr = null, i;
      }, Z.prototype._$Nr = function (t, i) {
        var e = i;

        if (this._$GS._$Ur(t)) {
          var r = this._$VT(),
              o = Z._$gT;

          o[0] = !1, v._$Vr(t, this._$GS, o, r, this._$Eo, e._$Cr, 0, 2), i._$Ib(o[0]), this.interpolateOpacity(t, this._$GS, i, o);
        }
      }, Z.prototype._$2b = function (t, i) {
        var e = i;

        if (e._$hS(!0), this._$32()) {
          var r = this.getTargetBaseDataID();
          if (e._$8r == I._$ur && (e._$8r = t.getBaseDataIndex(r)), e._$8r < 0) at._$so && _._$li("_$L _$0P _$G :: %s", r), e._$hS(!1);else {
            var o = t.getBaseData(e._$8r),
                n = t._$q2(e._$8r);

            if (null != o && n._$yo()) {
              var s = n.getTotalScale();
              e.setTotalScale_notForClient(s);
              var a = n.getTotalOpacity();
              e.setTotalOpacity(a * e.getInterpolatedOpacity()), o._$nb(t, n, e._$Cr, e._$hr, this._$VT(), 0, 2), e._$hS(!0);
            } else e._$hS(!1);
          }
        } else e.setTotalOpacity(e.getInterpolatedOpacity());
      }, Z.prototype._$nb = function (t, i, e, r, o, n, s) {
        var _ = i,
            a = null != _._$hr ? _._$hr : _._$Cr;
        Z.transformPoints_sdk2(e, r, o, n, s, a, this._$o, this._$A);
      }, Z.transformPoints_sdk2 = function (i, e, r, o, n, s, _, a) {
        for (var h, l, $, u = r * n, p = 0, f = 0, c = 0, d = 0, g = 0, y = 0, m = !1, T = o; T < u; T += n) {
          var P, S, v, L;

          if (v = i[T], L = i[T + 1], P = v * _, S = L * a, P < 0 || S < 0 || _ <= P || a <= S) {
            var M = _ + 1;

            if (!m) {
              m = !0, p = .25 * (s[2 * (0 + 0 * M)] + s[2 * (_ + 0 * M)] + s[2 * (0 + a * M)] + s[2 * (_ + a * M)]), f = .25 * (s[2 * (0 + 0 * M) + 1] + s[2 * (_ + 0 * M) + 1] + s[2 * (0 + a * M) + 1] + s[2 * (_ + a * M) + 1]);
              var E = s[2 * (_ + a * M)] - s[2 * (0 + 0 * M)],
                  A = s[2 * (_ + a * M) + 1] - s[2 * (0 + 0 * M) + 1],
                  I = s[2 * (_ + 0 * M)] - s[2 * (0 + a * M)],
                  w = s[2 * (_ + 0 * M) + 1] - s[2 * (0 + a * M) + 1];
              c = .5 * (E + I), d = .5 * (A + w), g = .5 * (E - I), y = .5 * (A - w), p -= .5 * (c + g), f -= .5 * (d + y);
            }

            if (-2 < v && v < 3 && -2 < L && L < 3) {
              if (v <= 0) {
                if (L <= 0) {
                  var x = s[2 * (0 + 0 * M)],
                      O = s[2 * (0 + 0 * M) + 1],
                      D = p - 2 * c,
                      R = f - 2 * d,
                      b = p - 2 * g,
                      F = f - 2 * y,
                      C = p - 2 * c - 2 * g,
                      N = f - 2 * d - 2 * y,
                      B = .5 * (v - -2),
                      U = .5 * (L - -2);
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                } else if (L >= 1) {
                  var b = s[2 * (0 + a * M)],
                      F = s[2 * (0 + a * M) + 1],
                      C = p - 2 * c + 1 * g,
                      N = f - 2 * d + 1 * y,
                      x = p + 3 * g,
                      O = f + 3 * y,
                      D = p - 2 * c + 3 * g,
                      R = f - 2 * d + 3 * y,
                      B = .5 * (v - -2),
                      U = .5 * (L - 1);
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                } else {
                  var G = 0 | S;
                  G == a && (G = a - 1);
                  var B = .5 * (v - -2),
                      U = S - G,
                      Y = G / a,
                      k = (G + 1) / a,
                      b = s[2 * (0 + G * M)],
                      F = s[2 * (0 + G * M) + 1],
                      x = s[2 * (0 + (G + 1) * M)],
                      O = s[2 * (0 + (G + 1) * M) + 1],
                      C = p - 2 * c + Y * g,
                      N = f - 2 * d + Y * y,
                      D = p - 2 * c + k * g,
                      R = f - 2 * d + k * y;
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                }
              } else if (1 <= v) {
                if (L <= 0) {
                  var D = s[2 * (_ + 0 * M)],
                      R = s[2 * (_ + 0 * M) + 1],
                      x = p + 3 * c,
                      O = f + 3 * d,
                      C = p + 1 * c - 2 * g,
                      N = f + 1 * d - 2 * y,
                      b = p + 3 * c - 2 * g,
                      F = f + 3 * d - 2 * y,
                      B = .5 * (v - 1),
                      U = .5 * (L - -2);
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                } else if (L >= 1) {
                  var C = s[2 * (_ + a * M)],
                      N = s[2 * (_ + a * M) + 1],
                      b = p + 3 * c + 1 * g,
                      F = f + 3 * d + 1 * y,
                      D = p + 1 * c + 3 * g,
                      R = f + 1 * d + 3 * y,
                      x = p + 3 * c + 3 * g,
                      O = f + 3 * d + 3 * y,
                      B = .5 * (v - 1),
                      U = .5 * (L - 1);
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                } else {
                  var G = 0 | S;
                  G == a && (G = a - 1);
                  var B = .5 * (v - 1),
                      U = S - G,
                      Y = G / a,
                      k = (G + 1) / a,
                      C = s[2 * (_ + G * M)],
                      N = s[2 * (_ + G * M) + 1],
                      D = s[2 * (_ + (G + 1) * M)],
                      R = s[2 * (_ + (G + 1) * M) + 1],
                      b = p + 3 * c + Y * g,
                      F = f + 3 * d + Y * y,
                      x = p + 3 * c + k * g,
                      O = f + 3 * d + k * y;
                  B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
                }
              } else if (L <= 0) {
                var V = 0 | P;
                V == _ && (V = _ - 1);
                var B = P - V,
                    U = .5 * (L - -2),
                    X = V / _,
                    z = (V + 1) / _,
                    D = s[2 * (V + 0 * M)],
                    R = s[2 * (V + 0 * M) + 1],
                    x = s[2 * (V + 1 + 0 * M)],
                    O = s[2 * (V + 1 + 0 * M) + 1],
                    C = p + X * c - 2 * g,
                    N = f + X * d - 2 * y,
                    b = p + z * c - 2 * g,
                    F = f + z * d - 2 * y;
                B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
              } else if (L >= 1) {
                var V = 0 | P;
                V == _ && (V = _ - 1);
                var B = P - V,
                    U = .5 * (L - 1),
                    X = V / _,
                    z = (V + 1) / _,
                    C = s[2 * (V + a * M)],
                    N = s[2 * (V + a * M) + 1],
                    b = s[2 * (V + 1 + a * M)],
                    F = s[2 * (V + 1 + a * M) + 1],
                    D = p + X * c + 3 * g,
                    R = f + X * d + 3 * y,
                    x = p + z * c + 3 * g,
                    O = f + z * d + 3 * y;
                B + U <= 1 ? (e[T] = C + (b - C) * B + (D - C) * U, e[T + 1] = N + (F - N) * B + (R - N) * U) : (e[T] = x + (D - x) * (1 - B) + (b - x) * (1 - U), e[T + 1] = O + (R - O) * (1 - B) + (F - O) * (1 - U));
              } else t.err.printf("_$li calc : %.4f , %.4f\t\t\t\t\t@@BDBoxGrid\n", v, L);
            } else e[T] = p + v * c + L * g, e[T + 1] = f + v * d + L * y;
          } else l = P - (0 | P), $ = S - (0 | S), h = 2 * ((0 | P) + (0 | S) * (_ + 1)), l + $ < 1 ? (e[T] = s[h] * (1 - l - $) + s[h + 2] * l + s[h + 2 * (_ + 1)] * $, e[T + 1] = s[h + 1] * (1 - l - $) + s[h + 3] * l + s[h + 2 * (_ + 1) + 1] * $) : (e[T] = s[h + 2 * (_ + 1) + 2] * (l - 1 + $) + s[h + 2 * (_ + 1)] * (1 - l) + s[h + 2] * (1 - $), e[T + 1] = s[h + 2 * (_ + 1) + 3] * (l - 1 + $) + s[h + 2 * (_ + 1) + 1] * (1 - l) + s[h + 3] * (1 - $));
        }
      }, Z.prototype.transformPoints_sdk1 = function (t, i, e, r, o, n, s) {
        for (var _, a, h, l, $, u, p, f = i, c = this._$o, d = this._$A, g = o * s, y = null != f._$hr ? f._$hr : f._$Cr, m = n; m < g; m += s) {
          at._$ts ? (_ = e[m], a = e[m + 1], _ < 0 ? _ = 0 : _ > 1 && (_ = 1), a < 0 ? a = 0 : a > 1 && (a = 1), _ *= c, a *= d, h = 0 | _, l = 0 | a, h > c - 1 && (h = c - 1), l > d - 1 && (l = d - 1), u = _ - h, p = a - l, $ = 2 * (h + l * (c + 1))) : (_ = e[m] * c, a = e[m + 1] * d, u = _ - (0 | _), p = a - (0 | a), $ = 2 * ((0 | _) + (0 | a) * (c + 1))), u + p < 1 ? (r[m] = y[$] * (1 - u - p) + y[$ + 2] * u + y[$ + 2 * (c + 1)] * p, r[m + 1] = y[$ + 1] * (1 - u - p) + y[$ + 3] * u + y[$ + 2 * (c + 1) + 1] * p) : (r[m] = y[$ + 2 * (c + 1) + 2] * (u - 1 + p) + y[$ + 2 * (c + 1)] * (1 - u) + y[$ + 2] * (1 - p), r[m + 1] = y[$ + 2 * (c + 1) + 3] * (u - 1 + p) + y[$ + 2 * (c + 1) + 1] * (1 - u) + y[$ + 3] * (1 - p));
        }
      }, Z.prototype._$VT = function () {
        return (this._$o + 1) * (this._$A + 1);
      }, Z.prototype.getType = function () {
        return I._$_b;
      }, K.prototype = new _t(), tt._$42 = 0, tt.prototype._$zP = function () {
        this._$3S = new Array(), this._$aS = new Array();
      }, tt.prototype._$F0 = function (t) {
        this._$g0 = t._$8L(), this.visible = t._$8L(), this._$NL = t._$nP(), this._$3S = t._$nP(), this._$aS = t._$nP();
      }, tt.prototype.init = function (t) {
        var i = new it(this);
        return i.setPartsOpacity(this.isVisible() ? 1 : 0), i;
      }, tt.prototype._$6o = function (t) {
        if (null == this._$3S) throw new Error("_$3S _$6 _$Wo@_$6o");

        this._$3S.push(t);
      }, tt.prototype._$3o = function (t) {
        if (null == this._$aS) throw new Error("_$aS _$6 _$Wo@_$3o");

        this._$aS.push(t);
      }, tt.prototype._$Zo = function (t) {
        this._$3S = t;
      }, tt.prototype._$xo = function (t) {
        this._$aS = t;
      }, tt.prototype.isVisible = function () {
        return this.visible;
      }, tt.prototype._$uL = function () {
        return this._$g0;
      }, tt.prototype._$KP = function (t) {
        this.visible = t;
      }, tt.prototype._$ET = function (t) {
        this._$g0 = t;
      }, tt.prototype.getBaseData = function () {
        return this._$3S;
      }, tt.prototype.getDrawData = function () {
        return this._$aS;
      }, tt.prototype._$p2 = function () {
        return this._$NL;
      }, tt.prototype._$ob = function (t) {
        this._$NL = t;
      }, tt.prototype.getPartsID = function () {
        return this._$NL;
      }, tt.prototype._$MP = function (t) {
        this._$NL = t;
      }, it.prototype = new $(), it.prototype.getPartsOpacity = function () {
        return this._$VS;
      }, it.prototype.setPartsOpacity = function (t) {
        this._$VS = t;
      }, et._$L7 = function () {
        u._$27(), yt._$27(), b._$27(), l._$27();
      }, et.prototype.toString = function () {
        return this.id;
      }, rt.prototype._$F0 = function (t) {}, ot.prototype._$1s = function () {
        return this._$4S;
      }, ot.prototype._$zP = function () {
        this._$4S = new Array();
      }, ot.prototype._$F0 = function (t) {
        this._$4S = t._$nP();
      }, ot.prototype._$Ks = function (t) {
        this._$4S.push(t);
      }, nt.tr = new gt(), nt._$50 = new gt(), nt._$Ti = new Array(0, 0), nt._$Pi = new Array(0, 0), nt._$B = new Array(0, 0), nt.prototype._$lP = function (t, i, e, r) {
        this.viewport = new Array(t, i, e, r);
      }, nt.prototype._$bL = function () {
        this.context.save();
        var t = this.viewport;
        null != t && (this.context.beginPath(), this.context._$Li(t[0], t[1], t[2], t[3]), this.context.clip());
      }, nt.prototype._$ei = function () {
        this.context.restore();
      }, nt.prototype.drawElements = function (t, i, e, r, o, n, s, a) {
        try {
          o != this._$Qo && (this._$Qo = o, this.context.globalAlpha = o);

          for (var h = i.length, l = t.width, $ = t.height, u = this.context, p = this._$xP, f = this._$uP, c = this._$6r, d = this._$3r, g = nt.tr, y = nt._$Ti, m = nt._$Pi, T = nt._$B, P = 0; P < h; P += 3) {
            u.save();
            var S = i[P],
                v = i[P + 1],
                L = i[P + 2],
                M = p + c * e[2 * S],
                E = f + d * e[2 * S + 1],
                A = p + c * e[2 * v],
                I = f + d * e[2 * v + 1],
                w = p + c * e[2 * L],
                x = f + d * e[2 * L + 1];
            s && (s._$PS(M, E, T), M = T[0], E = T[1], s._$PS(A, I, T), A = T[0], I = T[1], s._$PS(w, x, T), w = T[0], x = T[1]);
            var O = l * r[2 * S],
                D = $ - $ * r[2 * S + 1],
                R = l * r[2 * v],
                b = $ - $ * r[2 * v + 1],
                F = l * r[2 * L],
                C = $ - $ * r[2 * L + 1],
                N = Math.atan2(b - D, R - O),
                B = Math.atan2(I - E, A - M),
                U = A - M,
                G = I - E,
                Y = Math.sqrt(U * U + G * G),
                k = R - O,
                V = b - D,
                X = Math.sqrt(k * k + V * V),
                z = Y / X;
            It._$ni(F, C, O, D, R - O, b - D, -(b - D), R - O, y), It._$ni(w, x, M, E, A - M, I - E, -(I - E), A - M, m);
            var H = (m[0] - y[0]) / y[1],
                W = Math.min(O, R, F),
                j = Math.max(O, R, F),
                q = Math.min(D, b, C),
                J = Math.max(D, b, C),
                Q = Math.floor(W),
                Z = Math.floor(q),
                K = Math.ceil(j),
                tt = Math.ceil(J);
            g.identity(), g.translate(M, E), g.rotate(B), g.scale(1, m[1] / y[1]), g.shear(H, 0), g.scale(z, z), g.rotate(-N), g.translate(-O, -D), g.setContext(u);

            if (n || (n = 1.2), at.IGNORE_EXPAND && (n = 0), at.USE_CACHED_POLYGON_IMAGE) {
              var it = a._$e0;

              if (it.gl_cacheImage = it.gl_cacheImage || {}, !it.gl_cacheImage[P]) {
                var et = nt.createCanvas(K - Q, tt - Z);
                at.DEBUG_DATA.LDGL_CANVAS_MB = at.DEBUG_DATA.LDGL_CANVAS_MB || 0, at.DEBUG_DATA.LDGL_CANVAS_MB += (K - Q) * (tt - Z) * 4;
                var rt = et.getContext("2d");
                rt.translate(-Q, -Z), nt.clip(rt, g, n, Y, O, D, R, b, F, C, M, E, A, I, w, x), rt.drawImage(t, 0, 0), it.gl_cacheImage[P] = {
                  cacheCanvas: et,
                  cacheContext: rt
                };
              }

              u.drawImage(it.gl_cacheImage[P].cacheCanvas, Q, Z);
            } else at.IGNORE_CLIP || nt.clip(u, g, n, Y, O, D, R, b, F, C, M, E, A, I, w, x), at.USE_ADJUST_TRANSLATION && (W = 0, j = l, q = 0, J = $), u.drawImage(t, W, q, j - W, J - q, W, q, j - W, J - q);

            u.restore();
          }
        } catch (t) {
          _._$Rb(t);
        }
      }, nt.clip = function (t, i, e, r, o, n, s, _, a, h, l, $, u, p, f, c) {
        e > .02 ? nt.expandClip(t, i, e, r, l, $, u, p, f, c) : nt.clipWithTransform(t, null, o, n, s, _, a, h);
      }, nt.expandClip = function (t, i, e, r, o, n, s, _, a, h) {
        var l = s - o,
            $ = _ - n,
            u = a - o,
            p = h - n,
            f = l * p - $ * u > 0 ? e : -e,
            c = -$,
            d = l,
            g = a - s,
            y = h - _,
            m = -y,
            T = g,
            P = Math.sqrt(g * g + y * y),
            S = -p,
            v = u,
            L = Math.sqrt(u * u + p * p),
            M = o - f * c / r,
            E = n - f * d / r,
            A = s - f * c / r,
            I = _ - f * d / r,
            w = s - f * m / P,
            x = _ - f * T / P,
            O = a - f * m / P,
            D = h - f * T / P,
            R = o + f * S / L,
            b = n + f * v / L,
            F = a + f * S / L,
            C = h + f * v / L,
            N = nt._$50;
        return null != i._$P2(N) && (nt.clipWithTransform(t, N, M, E, A, I, w, x, O, D, F, C, R, b), !0);
      }, nt.clipWithTransform = function (t, i, e, r, o, n, s, a) {
        if (arguments.length < 7) return void _._$li("err : @LDGL.clip()");
        if (!(arguments[1] instanceof gt)) return void _._$li("err : a[0] is _$6 LDTransform @LDGL.clip()");
        var h = nt._$B,
            l = i,
            $ = arguments;

        if (t.beginPath(), l) {
          l._$PS($[2], $[3], h), t.moveTo(h[0], h[1]);

          for (var u = 4; u < $.length; u += 2) {
            l._$PS($[u], $[u + 1], h), t.lineTo(h[0], h[1]);
          }
        } else {
          t.moveTo($[2], $[3]);

          for (var u = 4; u < $.length; u += 2) {
            t.lineTo($[u], $[u + 1]);
          }
        }

        t.clip();
      }, nt.createCanvas = function (t, i) {
        var e = document.createElement("canvas");
        return e.setAttribute("width", t), e.setAttribute("height", i), e || _._$li("err : " + e), e;
      }, nt.dumpValues = function () {
        for (var t = "", i = 0; i < arguments.length; i++) {
          t += "[" + i + "]= " + arguments[i].toFixed(3) + " , ";
        }

        console.log(t);
      }, st.prototype._$F0 = function (t) {
        this._$TT = t._$_T(), this._$LT = t._$_T(), this._$FS = t._$_T(), this._$wL = t._$nP();
      }, st.prototype.getMinValue = function () {
        return this._$TT;
      }, st.prototype.getMaxValue = function () {
        return this._$LT;
      }, st.prototype.getDefaultValue = function () {
        return this._$FS;
      }, st.prototype.getParamID = function () {
        return this._$wL;
      }, _t.prototype._$yo = function () {
        return this._$AT && !this._$JS;
      }, _t.prototype._$hS = function (t) {
        this._$AT = t;
      }, _t.prototype._$GT = function () {
        return this._$e0;
      }, _t.prototype._$l2 = function (t) {
        this._$IP = t;
      }, _t.prototype.getPartsIndex = function () {
        return this._$IP;
      }, _t.prototype._$x2 = function () {
        return this._$JS;
      }, _t.prototype._$Ib = function (t) {
        this._$JS = t;
      }, _t.prototype.getTotalScale = function () {
        return this.totalScale;
      }, _t.prototype.setTotalScale_notForClient = function (t) {
        this.totalScale = t;
      }, _t.prototype.getInterpolatedOpacity = function () {
        return this._$7s;
      }, _t.prototype.setInterpolatedOpacity = function (t) {
        this._$7s = t;
      }, _t.prototype.getTotalOpacity = function (t) {
        return this.totalOpacity;
      }, _t.prototype.setTotalOpacity = function (t) {
        this.totalOpacity = t;
      }, at._$2s = "2.1.00_1", at._$Kr = 201001e3, at._$sP = !0, at._$so = !0, at._$cb = !1, at._$3T = !0, at._$Ts = !0, at._$fb = !0, at._$ts = !0, at.L2D_DEFORMER_EXTEND = !0, at._$Wb = !1;
      at._$yr = !1, at._$Zs = !1, at.L2D_NO_ERROR = 0, at._$i7 = 1e3, at._$9s = 1001, at._$es = 1100, at._$r7 = 2e3, at._$07 = 2001, at._$b7 = 2002, at._$H7 = 4e3, at.L2D_COLOR_BLEND_MODE_MULT = 0, at.L2D_COLOR_BLEND_MODE_ADD = 1, at.L2D_COLOR_BLEND_MODE_INTERPOLATE = 2, at._$6b = !0, at._$cT = 0, at.clippingMaskBufferSize = 256, at.glContext = new Array(), at.frameBuffers = new Array(), at.fTexture = new Array(), at.IGNORE_CLIP = !1, at.IGNORE_EXPAND = !1, at.EXPAND_W = 2, at.USE_ADJUST_TRANSLATION = !0, at.USE_CANVAS_TRANSFORM = !0, at.USE_CACHED_POLYGON_IMAGE = !1, at.DEBUG_DATA = {}, at.PROFILE_IOS_SPEED = {
        PROFILE_NAME: "iOS Speed",
        USE_ADJUST_TRANSLATION: !0,
        USE_CACHED_POLYGON_IMAGE: !0,
        EXPAND_W: 4
      }, at.PROFILE_IOS_QUALITY = {
        PROFILE_NAME: "iOS HiQ",
        USE_ADJUST_TRANSLATION: !0,
        USE_CACHED_POLYGON_IMAGE: !1,
        EXPAND_W: 2
      }, at.PROFILE_IOS_DEFAULT = at.PROFILE_IOS_QUALITY, at.PROFILE_ANDROID = {
        PROFILE_NAME: "Android",
        USE_ADJUST_TRANSLATION: !1,
        USE_CACHED_POLYGON_IMAGE: !1,
        EXPAND_W: 2
      }, at.PROFILE_DESKTOP = {
        PROFILE_NAME: "Desktop",
        USE_ADJUST_TRANSLATION: !1,
        USE_CACHED_POLYGON_IMAGE: !1,
        EXPAND_W: 2
      }, at.initProfile = function () {
        Et.isIOS() ? at.setupProfile(at.PROFILE_IOS_DEFAULT) : Et.isAndroid() ? at.setupProfile(at.PROFILE_ANDROID) : at.setupProfile(at.PROFILE_DESKTOP);
      }, at.setupProfile = function (t, i) {
        if ("number" == typeof t) switch (t) {
          case 9901:
            t = at.PROFILE_IOS_SPEED;
            break;

          case 9902:
            t = at.PROFILE_IOS_QUALITY;
            break;

          case 9903:
            t = at.PROFILE_IOS_DEFAULT;
            break;

          case 9904:
            t = at.PROFILE_ANDROID;
            break;

          case 9905:
            t = at.PROFILE_DESKTOP;
            break;

          default:
            alert("profile _$6 _$Ui : " + t);
        }
        arguments.length < 2 && (i = !0), i && console.log("profile : " + t.PROFILE_NAME);

        for (var e in t) {
          at[e] = t[e], i && console.log("  [" + e + "] = " + t[e]);
        }
      }, at.init = function () {
        if (at._$6b) {
          console.log("Live2D %s", at._$2s), at._$6b = !1;
          !0, at.initProfile();
        }
      }, at.getVersionStr = function () {
        return at._$2s;
      }, at.getVersionNo = function () {
        return at._$Kr;
      }, at._$sT = function (t) {
        at._$cT = t;
      }, at.getError = function () {
        var t = at._$cT;
        return at._$cT = 0, t;
      }, at.dispose = function () {
        at.glContext = [], at.frameBuffers = [], at.fTexture = [];
      }, at.setGL = function (t, i) {
        var e = i || 0;
        at.glContext[e] = t;
      }, at.getGL = function (t) {
        return at.glContext[t];
      }, at.setClippingMaskBufferSize = function (t) {
        at.clippingMaskBufferSize = t;
      }, at.getClippingMaskBufferSize = function () {
        return at.clippingMaskBufferSize;
      }, at.deleteBuffer = function (t) {
        at.getGL(t).deleteFramebuffer(at.frameBuffers[t].framebuffer), delete at.frameBuffers[t], delete at.glContext[t];
      }, ht._$r2 = function (t) {
        return t < 0 ? 0 : t > 1 ? 1 : .5 - .5 * Math.cos(t * Lt.PI_F);
      }, lt._$fr = -1, lt.prototype.toString = function () {
        return this._$ib;
      }, $t.prototype = new W(), $t._$42 = 0, $t._$Os = 30, $t._$ms = 0, $t._$ns = 1, $t._$_s = 2, $t._$gT = new Array(), $t.prototype._$_S = function (t) {
        this._$LP = t;
      }, $t.prototype.getTextureNo = function () {
        return this._$LP;
      }, $t.prototype._$ZL = function () {
        return this._$Qi;
      }, $t.prototype._$H2 = function () {
        return this._$JP;
      }, $t.prototype.getNumPoints = function () {
        return this._$d0;
      }, $t.prototype.getType = function () {
        return W._$wb;
      }, $t.prototype._$B2 = function (t, i, e) {
        var r = i,
            o = null != r._$hr ? r._$hr : r._$Cr;

        switch (U._$do) {
          default:
          case U._$Ms:
            throw new Error("_$L _$ro ");

          case U._$Qs:
            for (var n = this._$d0 - 1; n >= 0; --n) {
              o[n * U._$No + 4] = e;
            }

        }
      }, $t.prototype._$zP = function () {
        this._$GS = new D(), this._$GS._$zP();
      }, $t.prototype._$F0 = function (t) {
        W.prototype._$F0.call(this, t), this._$LP = t._$6L(), this._$d0 = t._$6L(), this._$Yo = t._$6L();

        var i = t._$nP();

        this._$BP = new Int16Array(3 * this._$Yo);

        for (var e = 3 * this._$Yo - 1; e >= 0; --e) {
          this._$BP[e] = i[e];
        }

        if (this._$Eo = t._$nP(), this._$Qi = t._$nP(), t.getFormatVersion() >= G._$s7) {
          if (this._$JP = t._$6L(), 0 != this._$JP) {
            if (0 != (1 & this._$JP)) {
              var r = t._$6L();

              null == this._$5P && (this._$5P = new Object()), this._$5P._$Hb = parseInt(r);
            }

            0 != (this._$JP & $t._$Os) ? this._$6s = (this._$JP & $t._$Os) >> 1 : this._$6s = $t._$ms, 0 != (32 & this._$JP) && (this.culling = !1);
          }
        } else this._$JP = 0;
      }, $t.prototype.init = function (t) {
        var i = new ut(this),
            e = this._$d0 * U._$No,
            r = this._$32();

        switch (null != i._$Cr && (i._$Cr = null), i._$Cr = new Float32Array(e), null != i._$hr && (i._$hr = null), i._$hr = r ? new Float32Array(e) : null, U._$do) {
          default:
          case U._$Ms:
            if (U._$Ls) for (var o = this._$d0 - 1; o >= 0; --o) {
              var n = o << 1;
              this._$Qi[n + 1] = 1 - this._$Qi[n + 1];
            }
            break;

          case U._$Qs:
            for (var o = this._$d0 - 1; o >= 0; --o) {
              var n = o << 1,
                  s = o * U._$No,
                  _ = this._$Qi[n],
                  a = this._$Qi[n + 1];
              i._$Cr[s] = _, i._$Cr[s + 1] = a, i._$Cr[s + 4] = 0, r && (i._$hr[s] = _, i._$hr[s + 1] = a, i._$hr[s + 4] = 0);
            }

        }

        return i;
      }, $t.prototype._$Nr = function (t, i) {
        var e = i;

        if (this != e._$GT() && console.log("### assert!! ### "), this._$GS._$Ur(t) && (W.prototype._$Nr.call(this, t, e), !e._$IS[0])) {
          var r = $t._$gT;
          r[0] = !1, v._$Vr(t, this._$GS, r, this._$d0, this._$Eo, e._$Cr, U._$i2, U._$No);
        }
      }, $t.prototype._$2b = function (t, i) {
        try {
          this != i._$GT() && console.log("### assert!! ### ");
          var e = !1;
          i._$IS[0] && (e = !0);
          var r = i;

          if (!e && (W.prototype._$2b.call(this, t), this._$32())) {
            var o = this.getTargetBaseDataID();
            if (r._$8r == W._$ur && (r._$8r = t.getBaseDataIndex(o)), r._$8r < 0) at._$so && _._$li("_$L _$0P _$G :: %s", o);else {
              var n = t.getBaseData(r._$8r),
                  s = t._$q2(r._$8r);

              null == n || s._$x2() ? r._$AT = !1 : (n._$nb(t, s, r._$Cr, r._$hr, this._$d0, U._$i2, U._$No), r._$AT = !0), r.baseOpacity = s.getTotalOpacity();
            }
          }
        } catch (t) {
          throw t;
        }
      }, $t.prototype.draw = function (t, i, e) {
        if (this != e._$GT() && console.log("### assert!! ### "), !e._$IS[0]) {
          var r = e,
              o = this._$LP;
          o < 0 && (o = 1);
          var n = this.getOpacity(i, r) * e._$VS * e.baseOpacity,
              s = null != r._$hr ? r._$hr : r._$Cr;
          t.setClipBufPre_clipContextForDraw(e.clipBufPre_clipContext), t._$WP(this.culling), t._$Uo(o, 3 * this._$Yo, this._$BP, s, this._$Qi, n, this._$6s, r);
        }
      }, $t.prototype.dump = function () {
        console.log("  _$yi( %d ) , _$d0( %d ) , _$Yo( %d ) \n", this._$LP, this._$d0, this._$Yo), console.log("  _$Oi _$di = { ");

        for (var t = 0; t < this._$BP.length; t++) {
          console.log("%5d ,", this._$BP[t]);
        }

        console.log("\n  _$5i _$30");

        for (var t = 0; t < this._$Eo.length; t++) {
          console.log("\n    _$30[%d] = ", t);

          for (var i = this._$Eo[t], e = 0; e < i.length; e++) {
            console.log("%6.2f, ", i[e]);
          }
        }

        console.log("\n");
      }, $t.prototype._$72 = function (t) {
        return null == this._$5P ? null : this._$5P[t];
      }, $t.prototype.getIndexArray = function () {
        return this._$BP;
      }, ut.prototype = new Mt(), ut.prototype.getTransformedPoints = function () {
        return null != this._$hr ? this._$hr : this._$Cr;
      }, pt.prototype._$HT = function (t) {
        this.x = t.x, this.y = t.y;
      }, pt.prototype._$HT = function (t, i) {
        this.x = t, this.y = i;
      }, ft.prototype = new i(), ft.loadModel = function (t) {
        var e = new ft();
        return i._$62(e, t), e;
      }, ft.loadModel = function (t, e) {
        var r = e || 0,
            o = new ft(r);
        return i._$62(o, t), o;
      }, ft._$to = function () {
        return new ft();
      }, ft._$er = function (t) {
        var i = new _$5("../_$_r/_$t0/_$Ri/_$_P._$d");
        if (0 == i.exists()) throw new _$ls("_$t0 _$_ _$6 _$Ui :: " + i._$PL());

        for (var e = ["../_$_r/_$t0/_$Ri/_$_P.512/_$CP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$vP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$EP._$1", "../_$_r/_$t0/_$Ri/_$_P.512/_$pP._$1"], r = ft.loadModel(i._$3b()), o = 0; o < e.length; o++) {
          var n = new _$5(e[o]);
          if (0 == n.exists()) throw new _$ls("_$t0 _$_ _$6 _$Ui :: " + n._$PL());
          r.setTexture(o, _$nL._$_o(t, n._$3b()));
        }

        return r;
      }, ft.prototype.setGL = function (t) {
        at.setGL(t);
      }, ft.prototype.setTransform = function (t) {
        this.drawParamWebGL.setTransform(t);
      }, ft.prototype.update = function () {
        this._$5S.update(), this._$5S.preDraw(this.drawParamWebGL);
      }, ft.prototype.draw = function () {
        this._$5S.draw(this.drawParamWebGL);
      }, ft.prototype._$K2 = function () {
        this.drawParamWebGL._$K2();
      }, ft.prototype.setTexture = function (t, i) {
        null == this.drawParamWebGL && _._$li("_$Yi for QT _$ki / _$XS() is _$6 _$ui!!"), this.drawParamWebGL.setTexture(t, i);
      }, ft.prototype.setTexture = function (t, i) {
        null == this.drawParamWebGL && _._$li("_$Yi for QT _$ki / _$XS() is _$6 _$ui!!"), this.drawParamWebGL.setTexture(t, i);
      }, ft.prototype._$Rs = function () {
        return this.drawParamWebGL._$Rs();
      }, ft.prototype._$Ds = function (t) {
        this.drawParamWebGL._$Ds(t);
      }, ft.prototype.getDrawParam = function () {
        return this.drawParamWebGL;
      }, ft.prototype.setMatrix = function (t) {
        this.drawParamWebGL.setMatrix(t);
      }, ft.prototype.setPremultipliedAlpha = function (t) {
        this.drawParamWebGL.setPremultipliedAlpha(t);
      }, ft.prototype.isPremultipliedAlpha = function () {
        return this.drawParamWebGL.isPremultipliedAlpha();
      }, ft.prototype.setAnisotropy = function (t) {
        this.drawParamWebGL.setAnisotropy(t);
      }, ft.prototype.getAnisotropy = function () {
        return this.drawParamWebGL.getAnisotropy();
      }, ct.prototype._$tb = function () {
        return this.motions;
      }, ct.prototype.startMotion = function (t, i) {
        for (var e = null, r = this.motions.length, o = 0; o < r; ++o) {
          null != (e = this.motions[o]) && (e._$qS(e._$w0.getFadeOut()), this._$eb && _._$Ji("MotionQueueManager[size:%2d]->startMotion() / start _$K _$3 (m%d)\n", r, e._$sr));
        }

        if (null == t) return -1;
        e = new dt(), e._$w0 = t, this.motions.push(e);
        var n = e._$sr;
        return this._$eb && _._$Ji("MotionQueueManager[size:%2d]->startMotion() / new _$w0 (m%d)\n", r, n), n;
      }, ct.prototype.updateParam = function (t) {
        try {
          for (var i = !1, e = 0; e < this.motions.length; e++) {
            var r = this.motions[e];

            if (null != r) {
              var o = r._$w0;
              null != o ? (o.updateParam(t, r), i = !0, r.isFinished() && (this._$eb && _._$Ji("MotionQueueManager[size:%2d]->updateParam() / _$T0 _$w0 (m%d)\n", this.motions.length - 1, r._$sr), this.motions.splice(e, 1), e--)) : (this.motions = this.motions.splice(e, 1), e--);
            } else this.motions.splice(e, 1), e--;
          }

          return i;
        } catch (t) {
          return _._$li(t), !0;
        }
      }, ct.prototype.isFinished = function (t) {
        if (arguments.length >= 1) {
          for (var i = 0; i < this.motions.length; i++) {
            var e = this.motions[i];
            if (null != e && e._$sr == t && !e.isFinished()) return !1;
          }

          return !0;
        }

        for (var i = 0; i < this.motions.length; i++) {
          var e = this.motions[i];

          if (null != e) {
            if (null != e._$w0) {
              if (!e.isFinished()) return !1;
            } else this.motions.splice(i, 1), i--;
          } else this.motions.splice(i, 1), i--;
        }

        return !0;
      }, ct.prototype.stopAllMotions = function () {
        for (var t = 0; t < this.motions.length; t++) {
          var i = this.motions[t];

          if (null != i) {
            i._$w0;
            this.motions.splice(t, 1), t--;
          } else this.motions.splice(t, 1), t--;
        }
      }, ct.prototype._$Zr = function (t) {
        this._$eb = t;
      }, ct.prototype._$e = function () {
        console.log("-- _$R --\n");

        for (var t = 0; t < this.motions.length; t++) {
          var i = this.motions[t],
              e = i._$w0;
          console.log("MotionQueueEnt[%d] :: %s\n", this.motions.length, e.toString());
        }
      }, dt._$Gs = 0, dt.prototype.isFinished = function () {
        return this._$9L;
      }, dt.prototype._$qS = function (t) {
        var i = w.getUserTimeMSec(),
            e = i + t;
        (this._$Do < 0 || e < this._$Do) && (this._$Do = e);
      }, dt.prototype._$Bs = function () {
        return this._$sr;
      }, gt.prototype.setContext = function (t) {
        var i = this.m;
        t.transform(i[0], i[1], i[3], i[4], i[6], i[7]);
      }, gt.prototype.toString = function () {
        for (var t = "LDTransform { ", i = 0; i < 9; i++) {
          t += this.m[i].toFixed(2) + " ,";
        }

        return t += " }";
      }, gt.prototype.identity = function () {
        var t = this.m;
        t[0] = t[4] = t[8] = 1, t[1] = t[2] = t[3] = t[5] = t[6] = t[7] = 0;
      }, gt.prototype._$PS = function (t, i, e) {
        null == e && (e = new Array(0, 0));
        var r = this.m;
        return e[0] = r[0] * t + r[3] * i + r[6], e[1] = r[1] * t + r[4] * i + r[7], e;
      }, gt.prototype._$P2 = function (t) {
        t || (t = new gt());
        var i = this.m,
            e = i[0],
            r = i[1],
            o = i[2],
            n = i[3],
            s = i[4],
            _ = i[5],
            a = i[6],
            h = i[7],
            l = i[8],
            $ = e * s * l + r * _ * a + o * n * h - e * _ * h - o * s * a - r * n * l;
        if (0 == $) return null;
        var u = 1 / $;
        return t.m[0] = u * (s * l - h * _), t.m[1] = u * (h * o - r * l), t.m[2] = u * (r * _ - s * o), t.m[3] = u * (a * _ - n * l), t.m[4] = u * (e * l - a * o), t.m[5] = u * (n * o - e * _), t.m[6] = u * (n * h - a * s), t.m[7] = u * (a * r - e * h), t.m[8] = u * (e * s - n * r), t;
      }, gt.prototype.transform = function (t, i, e) {
        null == e && (e = new Array(0, 0));
        var r = this.m;
        return e[0] = r[0] * t + r[3] * i + r[6], e[1] = r[1] * t + r[4] * i + r[7], e;
      }, gt.prototype.translate = function (t, i) {
        var e = this.m;
        e[6] = e[0] * t + e[3] * i + e[6], e[7] = e[1] * t + e[4] * i + e[7], e[8] = e[2] * t + e[5] * i + e[8];
      }, gt.prototype.scale = function (t, i) {
        var e = this.m;
        e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= i, e[4] *= i, e[5] *= i;
      }, gt.prototype.shear = function (t, i) {
        var e = this.m,
            r = e[0] + e[3] * i,
            o = e[1] + e[4] * i,
            n = e[2] + e[5] * i;
        e[3] = e[0] * t + e[3], e[4] = e[1] * t + e[4], e[5] = e[2] * t + e[5], e[0] = r, e[1] = o, e[2] = n;
      }, gt.prototype.rotate = function (t) {
        var i = this.m,
            e = Math.cos(t),
            r = Math.sin(t),
            o = i[0] * e + i[3] * r,
            n = i[1] * e + i[4] * r,
            s = i[2] * e + i[5] * r;
        i[3] = -i[0] * r + i[3] * e, i[4] = -i[1] * r + i[4] * e, i[5] = -i[2] * r + i[5] * e, i[0] = o, i[1] = n, i[2] = s;
      }, gt.prototype.concatenate = function (t) {
        var i = this.m,
            e = t.m,
            r = i[0] * e[0] + i[3] * e[1] + i[6] * e[2],
            o = i[1] * e[0] + i[4] * e[1] + i[7] * e[2],
            n = i[2] * e[0] + i[5] * e[1] + i[8] * e[2],
            s = i[0] * e[3] + i[3] * e[4] + i[6] * e[5],
            _ = i[1] * e[3] + i[4] * e[4] + i[7] * e[5],
            a = i[2] * e[3] + i[5] * e[4] + i[8] * e[5],
            h = i[0] * e[6] + i[3] * e[7] + i[6] * e[8],
            l = i[1] * e[6] + i[4] * e[7] + i[7] * e[8],
            $ = i[2] * e[6] + i[5] * e[7] + i[8] * e[8];

        m[0] = r, m[1] = o, m[2] = n, m[3] = s, m[4] = _, m[5] = a, m[6] = h, m[7] = l, m[8] = $;
      }, yt.prototype = new et(), yt._$eT = null, yt._$tP = new Object(), yt._$2o = function () {
        return null == yt._$eT && (yt._$eT = yt.getID("DST_BASE")), yt._$eT;
      }, yt._$27 = function () {
        yt._$tP.clear(), yt._$eT = null;
      }, yt.getID = function (t) {
        var i = yt._$tP[t];
        return null == i && (i = new yt(t), yt._$tP[t] = i), i;
      }, yt.prototype._$3s = function () {
        return new yt();
      }, mt.prototype = new E(), mt._$9r = function (t) {
        return new Float32Array(t);
      }, mt._$vb = function (t) {
        return new Int16Array(t);
      }, mt._$cr = function (t, i) {
        return null == t || t._$yL() < i.length ? (t = mt._$9r(2 * i.length), t.put(i), t._$oT(0)) : (t.clear(), t.put(i), t._$oT(0)), t;
      }, mt._$mb = function (t, i) {
        return null == t || t._$yL() < i.length ? (t = mt._$vb(2 * i.length), t.put(i), t._$oT(0)) : (t.clear(), t.put(i), t._$oT(0)), t;
      }, mt._$Hs = function () {
        return this._$Gr;
      }, mt._$as = function (t) {
        this._$Gr = t;
      }, mt.prototype.getGL = function () {
        return this.gl;
      }, mt.prototype.setGL = function (t) {
        this.gl = t;
      }, mt.prototype.setTransform = function (t) {
        this.transform = t;
      }, mt.prototype._$ZT = function () {
        var t = this.gl;
        this.firstDraw && (this.initShader(), this.firstDraw = !1, this.anisotropyExt = t.getExtension("EXT_texture_filter_anisotropic") || t.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || t.getExtension("MOZ_EXT_texture_filter_anisotropic"), this.anisotropyExt && (this.maxAnisotropy = t.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT))), t.disable(t.SCISSOR_TEST), t.disable(t.STENCIL_TEST), t.disable(t.DEPTH_TEST), t.frontFace(t.CW), t.enable(t.BLEND), t.colorMask(1, 1, 1, 1), t.bindBuffer(t.ARRAY_BUFFER, null), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null);
      }, mt.prototype._$Uo = function (t, i, e, r, o, n, s, _) {
        if (!(n < .01 && null == this.clipBufPre_clipContextMask)) {
          var a = (n > .9 && at.EXPAND_W, this.gl);
          if (null == this.gl) throw new Error("gl is null");
          var h = 1 * this._$C0 * n,
              l = 1 * this._$tT * n,
              $ = 1 * this._$WL * n,
              u = this._$lT * n;

          if (null != this.clipBufPre_clipContextMask) {
            a.frontFace(a.CCW), a.useProgram(this.shaderProgram), this._$vS = Tt(a, this._$vS, r), this._$no = Pt(a, this._$no, e), a.enableVertexAttribArray(this.a_position_Loc), a.vertexAttribPointer(this.a_position_Loc, 2, a.FLOAT, !1, 0, 0), this._$NT = Tt(a, this._$NT, o), a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, this.textures[t]), a.uniform1i(this.s_texture0_Loc, 1), a.enableVertexAttribArray(this.a_texCoord_Loc), a.vertexAttribPointer(this.a_texCoord_Loc, 2, a.FLOAT, !1, 0, 0), a.uniformMatrix4fv(this.u_matrix_Loc, !1, this.getClipBufPre_clipContextMask().matrixForMask);
            var p = this.getClipBufPre_clipContextMask().layoutChannelNo,
                f = this.getChannelFlagAsColor(p);
            a.uniform4f(this.u_channelFlag, f.r, f.g, f.b, f.a);
            var c = this.getClipBufPre_clipContextMask().layoutBounds;
            a.uniform4f(this.u_baseColor_Loc, 2 * c.x - 1, 2 * c.y - 1, 2 * c._$EL() - 1, 2 * c._$5T() - 1), a.uniform1i(this.u_maskFlag_Loc, !0);
          } else if (null != this.getClipBufPre_clipContextDraw()) {
            a.useProgram(this.shaderProgramOff), this._$vS = Tt(a, this._$vS, r), this._$no = Pt(a, this._$no, e), a.enableVertexAttribArray(this.a_position_Loc_Off), a.vertexAttribPointer(this.a_position_Loc_Off, 2, a.FLOAT, !1, 0, 0), this._$NT = Tt(a, this._$NT, o), a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, this.textures[t]), a.uniform1i(this.s_texture0_Loc_Off, 1), a.enableVertexAttribArray(this.a_texCoord_Loc_Off), a.vertexAttribPointer(this.a_texCoord_Loc_Off, 2, a.FLOAT, !1, 0, 0), a.uniformMatrix4fv(this.u_clipMatrix_Loc_Off, !1, this.getClipBufPre_clipContextDraw().matrixForDraw), a.uniformMatrix4fv(this.u_matrix_Loc_Off, !1, this.matrix4x4), a.activeTexture(a.TEXTURE2), a.bindTexture(a.TEXTURE_2D, at.fTexture[this.glno]), a.uniform1i(this.s_texture1_Loc_Off, 2);
            var p = this.getClipBufPre_clipContextDraw().layoutChannelNo,
                f = this.getChannelFlagAsColor(p);
            a.uniform4f(this.u_channelFlag_Loc_Off, f.r, f.g, f.b, f.a), a.uniform4f(this.u_baseColor_Loc_Off, h, l, $, u);
          } else a.useProgram(this.shaderProgram), this._$vS = Tt(a, this._$vS, r), this._$no = Pt(a, this._$no, e), a.enableVertexAttribArray(this.a_position_Loc), a.vertexAttribPointer(this.a_position_Loc, 2, a.FLOAT, !1, 0, 0), this._$NT = Tt(a, this._$NT, o), a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, this.textures[t]), a.uniform1i(this.s_texture0_Loc, 1), a.enableVertexAttribArray(this.a_texCoord_Loc), a.vertexAttribPointer(this.a_texCoord_Loc, 2, a.FLOAT, !1, 0, 0), a.uniformMatrix4fv(this.u_matrix_Loc, !1, this.matrix4x4), a.uniform4f(this.u_baseColor_Loc, h, l, $, u), a.uniform1i(this.u_maskFlag_Loc, !1);

          this.culling ? this.gl.enable(a.CULL_FACE) : this.gl.disable(a.CULL_FACE), this.gl.enable(a.BLEND);
          var d, g, y, m;
          if (null != this.clipBufPre_clipContextMask) d = a.ONE, g = a.ONE_MINUS_SRC_ALPHA, y = a.ONE, m = a.ONE_MINUS_SRC_ALPHA;else switch (s) {
            case $t._$ms:
              d = a.ONE, g = a.ONE_MINUS_SRC_ALPHA, y = a.ONE, m = a.ONE_MINUS_SRC_ALPHA;
              break;

            case $t._$ns:
              d = a.ONE, g = a.ONE, y = a.ZERO, m = a.ONE;
              break;

            case $t._$_s:
              d = a.DST_COLOR, g = a.ONE_MINUS_SRC_ALPHA, y = a.ZERO, m = a.ONE;
          }
          a.blendEquationSeparate(a.FUNC_ADD, a.FUNC_ADD), a.blendFuncSeparate(d, g, y, m), this.anisotropyExt && a.texParameteri(a.TEXTURE_2D, this.anisotropyExt.TEXTURE_MAX_ANISOTROPY_EXT, this.maxAnisotropy);
          var T = e.length;
          a.drawElements(a.TRIANGLES, T, a.UNSIGNED_SHORT, 0), a.bindTexture(a.TEXTURE_2D, null);
        }
      }, mt.prototype._$Rs = function () {
        throw new Error("_$Rs");
      }, mt.prototype._$Ds = function (t) {
        throw new Error("_$Ds");
      }, mt.prototype._$K2 = function () {
        for (var t = 0; t < this.textures.length; t++) {
          0 != this.textures[t] && (this.gl._$K2(1, this.textures, t), this.textures[t] = null);
        }
      }, mt.prototype.setTexture = function (t, i) {
        this.textures[t] = i;
      }, mt.prototype.initShader = function () {
        var t = this.gl;
        this.loadShaders2(), this.a_position_Loc = t.getAttribLocation(this.shaderProgram, "a_position"), this.a_texCoord_Loc = t.getAttribLocation(this.shaderProgram, "a_texCoord"), this.u_matrix_Loc = t.getUniformLocation(this.shaderProgram, "u_mvpMatrix"), this.s_texture0_Loc = t.getUniformLocation(this.shaderProgram, "s_texture0"), this.u_channelFlag = t.getUniformLocation(this.shaderProgram, "u_channelFlag"), this.u_baseColor_Loc = t.getUniformLocation(this.shaderProgram, "u_baseColor"), this.u_maskFlag_Loc = t.getUniformLocation(this.shaderProgram, "u_maskFlag"), this.a_position_Loc_Off = t.getAttribLocation(this.shaderProgramOff, "a_position"), this.a_texCoord_Loc_Off = t.getAttribLocation(this.shaderProgramOff, "a_texCoord"), this.u_matrix_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "u_mvpMatrix"), this.u_clipMatrix_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "u_ClipMatrix"), this.s_texture0_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "s_texture0"), this.s_texture1_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "s_texture1"), this.u_channelFlag_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "u_channelFlag"), this.u_baseColor_Loc_Off = t.getUniformLocation(this.shaderProgramOff, "u_baseColor");
      }, mt.prototype.disposeShader = function () {
        var t = this.gl;
        this.shaderProgram && (t.deleteProgram(this.shaderProgram), this.shaderProgram = null), this.shaderProgramOff && (t.deleteProgram(this.shaderProgramOff), this.shaderProgramOff = null);
      }, mt.prototype.compileShader = function (t, i) {
        var e = this.gl,
            r = i,
            o = e.createShader(t);
        if (null == o) return _._$Ji("_$L0 to create shader"), null;

        if (e.shaderSource(o, r), e.compileShader(o), !e.getShaderParameter(o, e.COMPILE_STATUS)) {
          var n = e.getShaderInfoLog(o);
          return _._$Ji("_$L0 to compile shader : " + n), e.deleteShader(o), null;
        }

        return o;
      }, mt.prototype.loadShaders2 = function () {
        var t = this.gl;
        if (this.shaderProgram = t.createProgram(), !this.shaderProgram) return !1;
        if (this.shaderProgramOff = t.createProgram(), !this.shaderProgramOff) return !1;
        if (this.vertShader = this.compileShader(t.VERTEX_SHADER, "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_ClipPos;uniform mat4       u_mvpMatrix;void main(){    gl_Position = u_mvpMatrix * a_position;    v_ClipPos = u_mvpMatrix * a_position;    v_texCoord = a_texCoord;}"), !this.vertShader) return _._$Ji("Vertex shader compile _$li!"), !1;
        if (this.vertShaderOff = this.compileShader(t.VERTEX_SHADER, "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_ClipPos;uniform mat4       u_mvpMatrix;uniform mat4       u_ClipMatrix;void main(){    gl_Position = u_mvpMatrix * a_position;    v_ClipPos = u_ClipMatrix * a_position;    v_texCoord = a_texCoord ;}"), !this.vertShaderOff) return _._$Ji("OffVertex shader compile _$li!"), !1;
        if (this.fragShader = this.compileShader(t.FRAGMENT_SHADER, "precision mediump float;varying vec2       v_texCoord;varying vec4       v_ClipPos;uniform sampler2D  s_texture0;uniform vec4       u_channelFlag;uniform vec4       u_baseColor;uniform bool       u_maskFlag;void main(){    vec4 smpColor;     if(u_maskFlag){        float isInside =             step(u_baseColor.x, v_ClipPos.x/v_ClipPos.w)          * step(u_baseColor.y, v_ClipPos.y/v_ClipPos.w)          * step(v_ClipPos.x/v_ClipPos.w, u_baseColor.z)          * step(v_ClipPos.y/v_ClipPos.w, u_baseColor.w);        smpColor = u_channelFlag * texture2D(s_texture0 , v_texCoord).a * isInside;    }else{        smpColor = texture2D(s_texture0 , v_texCoord) * u_baseColor;    }    gl_FragColor = smpColor;}"), !this.fragShader) return _._$Ji("Fragment shader compile _$li!"), !1;
        if (this.fragShaderOff = this.compileShader(t.FRAGMENT_SHADER, "precision mediump float ;varying vec2       v_texCoord;varying vec4       v_ClipPos;uniform sampler2D  s_texture0;uniform sampler2D  s_texture1;uniform vec4       u_channelFlag;uniform vec4       u_baseColor ;void main(){    vec4 col_formask = texture2D(s_texture0, v_texCoord) * u_baseColor;    vec4 clipMask = texture2D(s_texture1, v_ClipPos.xy / v_ClipPos.w) * u_channelFlag;    float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;    col_formask = col_formask * maskVal;    gl_FragColor = col_formask;}"), !this.fragShaderOff) return _._$Ji("OffFragment shader compile _$li!"), !1;

        if (t.attachShader(this.shaderProgram, this.vertShader), t.attachShader(this.shaderProgram, this.fragShader), t.attachShader(this.shaderProgramOff, this.vertShaderOff), t.attachShader(this.shaderProgramOff, this.fragShaderOff), t.linkProgram(this.shaderProgram), t.linkProgram(this.shaderProgramOff), !t.getProgramParameter(this.shaderProgram, t.LINK_STATUS)) {
          var i = t.getProgramInfoLog(this.shaderProgram);
          return _._$Ji("_$L0 to link program: " + i), this.vertShader && (t.deleteShader(this.vertShader), this.vertShader = 0), this.fragShader && (t.deleteShader(this.fragShader), this.fragShader = 0), this.shaderProgram && (t.deleteProgram(this.shaderProgram), this.shaderProgram = 0), this.vertShaderOff && (t.deleteShader(this.vertShaderOff), this.vertShaderOff = 0), this.fragShaderOff && (t.deleteShader(this.fragShaderOff), this.fragShaderOff = 0), this.shaderProgramOff && (t.deleteProgram(this.shaderProgramOff), this.shaderProgramOff = 0), !1;
        }

        return !0;
      }, mt.prototype.createFramebuffer = function () {
        var t = this.gl,
            i = at.clippingMaskBufferSize,
            e = t.createFramebuffer();
        t.bindFramebuffer(t.FRAMEBUFFER, e);
        var r = t.createRenderbuffer();
        t.bindRenderbuffer(t.RENDERBUFFER, r), t.renderbufferStorage(t.RENDERBUFFER, t.RGBA4, i, i), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.RENDERBUFFER, r);
        var o = t.createTexture();
        return t.bindTexture(t.TEXTURE_2D, o), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, i, i, 0, t.RGBA, t.UNSIGNED_BYTE, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, o, 0), t.bindTexture(t.TEXTURE_2D, null), t.bindRenderbuffer(t.RENDERBUFFER, null), t.bindFramebuffer(t.FRAMEBUFFER, null), at.fTexture[this.glno] = o, {
          framebuffer: e,
          renderbuffer: r,
          texture: at.fTexture[this.glno]
        };
      }, St.prototype._$fP = function () {
        var t,
            i,
            e,
            r = this._$ST();

        if (0 == (128 & r)) return 255 & r;
        if (0 == (128 & (t = this._$ST()))) return (127 & r) << 7 | 127 & t;
        if (0 == (128 & (i = this._$ST()))) return (127 & r) << 14 | (127 & t) << 7 | 255 & i;
        if (0 == (128 & (e = this._$ST()))) return (127 & r) << 21 | (127 & t) << 14 | (127 & i) << 7 | 255 & e;
        throw new lt("_$L _$0P  _");
      }, St.prototype.getFormatVersion = function () {
        return this._$S2;
      }, St.prototype._$gr = function (t) {
        this._$S2 = t;
      }, St.prototype._$3L = function () {
        return this._$fP();
      }, St.prototype._$mP = function () {
        return this._$zT(), this._$F += 8, this._$T.getFloat64(this._$F - 8);
      }, St.prototype._$_T = function () {
        return this._$zT(), this._$F += 4, this._$T.getFloat32(this._$F - 4);
      }, St.prototype._$6L = function () {
        return this._$zT(), this._$F += 4, this._$T.getInt32(this._$F - 4);
      }, St.prototype._$ST = function () {
        return this._$zT(), this._$T.getInt8(this._$F++);
      }, St.prototype._$9T = function () {
        return this._$zT(), this._$F += 2, this._$T.getInt16(this._$F - 2);
      }, St.prototype._$2T = function () {
        throw this._$zT(), this._$F += 8, new lt("_$L _$q read long");
      }, St.prototype._$po = function () {
        return this._$zT(), 0 != this._$T.getInt8(this._$F++);
      };
      var xt = !0;
      St.prototype._$bT = function () {
        this._$zT();

        var t = this._$3L(),
            i = null;

        if (xt) try {
          var e = new ArrayBuffer(2 * t);
          i = new Uint16Array(e);

          for (var r = 0; r < t; ++r) {
            i[r] = this._$T.getUint8(this._$F++);
          }

          return String.fromCharCode.apply(null, i);
        } catch (t) {
          xt = !1;
        }

        try {
          var o = new Array();
          if (null == i) for (var r = 0; r < t; ++r) {
            o[r] = this._$T.getUint8(this._$F++);
          } else for (var r = 0; r < t; ++r) {
            o[r] = i[r];
          }
          return String.fromCharCode.apply(null, o);
        } catch (t) {
          console.log("read utf8 / _$rT _$L0 !! : " + t);
        }
      }, St.prototype._$cS = function () {
        this._$zT();

        for (var t = this._$3L(), i = new Int32Array(t), e = 0; e < t; e++) {
          i[e] = this._$T.getInt32(this._$F), this._$F += 4;
        }

        return i;
      }, St.prototype._$Tb = function () {
        this._$zT();

        for (var t = this._$3L(), i = new Float32Array(t), e = 0; e < t; e++) {
          i[e] = this._$T.getFloat32(this._$F), this._$F += 4;
        }

        return i;
      }, St.prototype._$5b = function () {
        this._$zT();

        for (var t = this._$3L(), i = new Float64Array(t), e = 0; e < t; e++) {
          i[e] = this._$T.getFloat64(this._$F), this._$F += 8;
        }

        return i;
      }, St.prototype._$nP = function () {
        return this._$Jb(-1);
      }, St.prototype._$Jb = function (t) {
        if (this._$zT(), t < 0 && (t = this._$3L()), t == G._$7P) {
          var i = this._$6L();

          if (0 <= i && i < this._$Ko.length) return this._$Ko[i];
          throw new lt("_$sL _$4i @_$m0");
        }

        var e = this._$4b(t);

        return this._$Ko.push(e), e;
      }, St.prototype._$4b = function (t) {
        if (0 == t) return null;

        if (50 == t) {
          var i = this._$bT(),
              e = b.getID(i);

          return e;
        }

        if (51 == t) {
          var i = this._$bT(),
              e = yt.getID(i);

          return e;
        }

        if (134 == t) {
          var i = this._$bT(),
              e = l.getID(i);

          return e;
        }

        if (60 == t) {
          var i = this._$bT(),
              e = u.getID(i);

          return e;
        }

        if (t >= 48) {
          var r = G._$9o(t);

          return null != r ? (r._$F0(this), r) : null;
        }

        switch (t) {
          case 1:
            return this._$bT();

          case 10:
            return new n(this._$6L(), !0);

          case 11:
            return new S(this._$mP(), this._$mP(), this._$mP(), this._$mP());

          case 12:
            return new S(this._$_T(), this._$_T(), this._$_T(), this._$_T());

          case 13:
            return new L(this._$mP(), this._$mP());

          case 14:
            return new L(this._$_T(), this._$_T());

          case 15:
            for (var o = this._$3L(), e = new Array(o), s = 0; s < o; s++) {
              e[s] = this._$nP();
            }

            return e;

          case 17:
            var e = new F(this._$mP(), this._$mP(), this._$mP(), this._$mP(), this._$mP(), this._$mP());
            return e;

          case 21:
            return new h(this._$6L(), this._$6L(), this._$6L(), this._$6L());

          case 22:
            return new pt(this._$6L(), this._$6L());

          case 23:
            throw new Error("_$L _$ro ");

          case 16:
          case 25:
            return this._$cS();

          case 26:
            return this._$5b();

          case 27:
            return this._$Tb();

          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 18:
          case 19:
          case 20:
          case 24:
          case 28:
            throw new lt("_$6 _$q : _$nP() of 2-9 ,18,19,20,24,28 : " + t);

          default:
            throw new lt("_$6 _$q : _$nP() NO _$i : " + t);
        }
      }, St.prototype._$8L = function () {
        return 0 == this._$hL ? this._$v0 = this._$ST() : 8 == this._$hL && (this._$v0 = this._$ST(), this._$hL = 0), 1 == (this._$v0 >> 7 - this._$hL++ & 1);
      }, St.prototype._$zT = function () {
        0 != this._$hL && (this._$hL = 0);
      }, vt.prototype._$wP = function (t, i, e) {
        for (var r = 0; r < e; r++) {
          for (var o = 0; o < i; o++) {
            var n = 2 * (o + r * i);
            console.log("(% 7.3f , % 7.3f) , ", t[n], t[n + 1]);
          }

          console.log("\n");
        }

        console.log("\n");
      }, Lt._$2S = Math.PI / 180, Lt._$bS = Math.PI / 180, Lt._$wS = 180 / Math.PI, Lt._$NS = 180 / Math.PI, Lt.PI_F = Math.PI, Lt._$kT = [0, .012368, .024734, .037097, .049454, .061803, .074143, .086471, .098786, .111087, .12337, .135634, .147877, .160098, .172295, .184465, .196606, .208718, .220798, .232844, .244854, .256827, .268761, .280654, .292503, .304308, .316066, .327776, .339436, .351044, .362598, .374097, .385538, .396921, .408243, .419502, .430697, .441826, .452888, .463881, .474802, .485651, .496425, .507124, .517745, .528287, .538748, .549126, .559421, .56963, .579752, .589785, .599728, .609579, .619337, .629, .638567, .648036, .657406, .666676, .675843, .684908, .693867, .70272, .711466, .720103, .72863, .737045, .745348, .753536, .76161, .769566, .777405, .785125, .792725, .800204, .807561, .814793, .821901, .828884, .835739, .842467, .849066, .855535, .861873, .868079, .874153, .880093, .885898, .891567, .897101, .902497, .907754, .912873, .917853, .922692, .92739, .931946, .936359, .940629, .944755, .948737, .952574, .956265, .959809, .963207, .966457, .96956, .972514, .97532, .977976, .980482, .982839, .985045, .987101, .989006, .990759, .992361, .993811, .995109, .996254, .997248, .998088, .998776, .999312, .999694, .999924, 1], Lt._$92 = function (t, i) {
        var e = Math.atan2(t[1], t[0]),
            r = Math.atan2(i[1], i[0]);
        return Lt._$tS(e, r);
      }, Lt._$tS = function (t, i) {
        for (var e = t - i; e < -Math.PI;) {
          e += 2 * Math.PI;
        }

        for (; e > Math.PI;) {
          e -= 2 * Math.PI;
        }

        return e;
      }, Lt._$9 = function (t) {
        return Math.sin(t);
      }, Lt.fcos = function (t) {
        return Math.cos(t);
      }, Mt.prototype._$u2 = function () {
        return this._$IS[0];
      }, Mt.prototype._$yo = function () {
        return this._$AT && !this._$IS[0];
      }, Mt.prototype._$GT = function () {
        return this._$e0;
      }, Et._$W2 = 0, Et.SYSTEM_INFO = null, Et.USER_AGENT = navigator.userAgent, Et.isIPhone = function () {
        return Et.SYSTEM_INFO || Et.setup(), Et.SYSTEM_INFO._isIPhone;
      }, Et.isIOS = function () {
        return Et.SYSTEM_INFO || Et.setup(), Et.SYSTEM_INFO._isIPhone || Et.SYSTEM_INFO._isIPad;
      }, Et.isAndroid = function () {
        return Et.SYSTEM_INFO || Et.setup(), Et.SYSTEM_INFO._isAndroid;
      }, Et.getOSVersion = function () {
        return Et.SYSTEM_INFO || Et.setup(), Et.SYSTEM_INFO.version;
      }, Et.getOS = function () {
        return Et.SYSTEM_INFO || Et.setup(), Et.SYSTEM_INFO._isIPhone || Et.SYSTEM_INFO._isIPad ? "iOS" : Et.SYSTEM_INFO._isAndroid ? "Android" : "_$Q0 OS";
      }, Et.setup = function () {
        function t(t, i) {
          for (var e = t.substring(i).split(/[ _,;\.]/), r = 0, o = 0; o <= 2 && !isNaN(e[o]); o++) {
            var n = parseInt(e[o]);

            if (n < 0 || n > 999) {
              _._$li("err : " + n + " @UtHtml5.setup()"), r = 0;
              break;
            }

            r += n * Math.pow(1e3, 2 - o);
          }

          return r;
        }

        var i,
            e = Et.USER_AGENT,
            r = Et.SYSTEM_INFO = {
          userAgent: e
        };
        if ((i = e.indexOf("iPhone OS ")) >= 0) r.os = "iPhone", r._isIPhone = !0, r.version = t(e, i + "iPhone OS ".length);else if ((i = e.indexOf("iPad")) >= 0) {
          if ((i = e.indexOf("CPU OS")) < 0) return void _._$li(" err : " + e + " @UtHtml5.setup()");
          r.os = "iPad", r._isIPad = !0, r.version = t(e, i + "CPU OS ".length);
        } else (i = e.indexOf("Android")) >= 0 ? (r.os = "Android", r._isAndroid = !0, r.version = t(e, i + "Android ".length)) : (r.os = "-", r.version = -1);
      }, window.UtSystem = w, window.UtDebug = _, window.LDTransform = gt, window.LDGL = nt, window.Live2D = at, window.Live2DModelWebGL = ft, window.Live2DModelJS = q, window.Live2DMotion = J, window.MotionQueueManager = ct, window.PhysicsHair = f, window.AMotion = s, window.PartsDataID = l, window.DrawDataID = b, window.BaseDataID = yt, window.ParamID = u, at.init();
      var At = !1;
    }();
  }).call(i, e(7));
}, function (t, i) {
  t.exports = {
    import: function _import() {
      throw new Error("System.import cannot be used indirectly");
    }
  };
}, function (t, i, e) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function o() {
    this.models = [], this.count = -1, this.reloadFlg = !1, Live2D.init(), n.Live2DFramework.setPlatformManager(new _.default());
  }

  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = o;

  var n = e(0),
      s = e(9),
      _ = r(s),
      a = e(10),
      h = r(a),
      l = e(1),
      $ = r(l);

  o.prototype.createModel = function () {
    var t = new h.default();
    return this.models.push(t), t;
  }, o.prototype.changeModel = function (t, i) {
    if (this.reloadFlg) {
      this.reloadFlg = !1;
      this.releaseModel(0, t), this.createModel(), this.models[0].load(t, i);
    }
  }, o.prototype.getModel = function (t) {
    return t >= this.models.length ? null : this.models[t];
  }, o.prototype.releaseModel = function (t, i) {
    this.models.length <= t || (this.models[t].release(i), delete this.models[t], this.models.splice(t, 1));
  }, o.prototype.numModels = function () {
    return this.models.length;
  }, o.prototype.setDrag = function (t, i) {
    for (var e = 0; e < this.models.length; e++) {
      this.models[e].setDrag(t, i);
    }
  }, o.prototype.maxScaleEvent = function () {
    $.default.DEBUG_LOG && console.log("Max scale event.");

    for (var t = 0; t < this.models.length; t++) {
      this.models[t].startRandomMotion($.default.MOTION_GROUP_PINCH_IN, $.default.PRIORITY_NORMAL);
    }
  }, o.prototype.minScaleEvent = function () {
    $.default.DEBUG_LOG && console.log("Min scale event.");

    for (var t = 0; t < this.models.length; t++) {
      this.models[t].startRandomMotion($.default.MOTION_GROUP_PINCH_OUT, $.default.PRIORITY_NORMAL);
    }
  }, o.prototype.tapEvent = function (t, i) {
    $.default.DEBUG_LOG && console.log("tapEvent view x:" + t + " y:" + i);

    for (var e = 0; e < this.models.length; e++) {
      this.models[e].hitTest($.default.HIT_AREA_HEAD, t, i) ? ($.default.DEBUG_LOG && console.log("Tap face."), this.models[e].setRandomExpression()) : this.models[e].hitTest($.default.HIT_AREA_BODY, t, i) ? ($.default.DEBUG_LOG && console.log("Tap body. models[" + e + "]"), this.models[e].startRandomMotion($.default.MOTION_GROUP_TAP_BODY, $.default.PRIORITY_NORMAL)) : this.models[e].hitTestCustom("head", t, i) ? ($.default.DEBUG_LOG && console.log("Tap face."), this.models[e].startRandomMotion($.default.MOTION_GROUP_FLICK_HEAD, $.default.PRIORITY_NORMAL)) : this.models[e].hitTestCustom("body", t, i) && ($.default.DEBUG_LOG && console.log("Tap body. models[" + e + "]"), this.models[e].startRandomMotion($.default.MOTION_GROUP_TAP_BODY, $.default.PRIORITY_NORMAL));
    }

    return !0;
  };
}, function (t, i, e) {
  "use strict";

  function r() {}

  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = r;
  var o = e(2);
  r.prototype.loadBytes = function (t, i) {
    var e = new XMLHttpRequest();
    e.open("GET", t, !0), e.responseType = "arraybuffer", e.onload = function () {
      switch (e.status) {
        case 200:
          i(e.response);
          break;

        default:
          console.error("Failed to load (" + e.status + ") : " + t);
      }
    }, e.send(null);
  }, r.prototype.loadString = function (t) {
    this.loadBytes(t, function (t) {
      return t;
    });
  }, r.prototype.loadLive2DModel = function (t, i) {
    var e = null;
    this.loadBytes(t, function (t) {
      e = Live2DModelWebGL.loadModel(t), i(e);
    });
  }, r.prototype.loadTexture = function (t, i, e, r) {
    var n = new Image();
    n.crossOrigin = "Anonymous", n.src = e;
    n.onload = function () {
      var e = (0, o.getContext)(),
          s = e.createTexture();
      if (!s) return console.error("Failed to generate gl texture name."), -1;
      0 == t.isPremultipliedAlpha() && e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, 1), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, s), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, n), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_NEAREST), e.generateMipmap(e.TEXTURE_2D), t.setTexture(i, s), s = null, "function" == typeof r && r();
    }, n.onerror = function () {
      console.error("Failed to load image : " + e);
    };
  }, r.prototype.jsonParseFromBytes = function (t) {
    var i,
        e = new Uint8Array(t, 0, 3);
    return i = 239 == e[0] && 187 == e[1] && 191 == e[2] ? String.fromCharCode.apply(null, new Uint8Array(t, 3)) : String.fromCharCode.apply(null, new Uint8Array(t)), JSON.parse(i);
  }, r.prototype.log = function (t) {};
}, function (t, i, e) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function o() {
    n.L2DBaseModel.prototype.constructor.call(this), this.modelHomeDir = "", this.modelSetting = null, this.tmpMatrix = [];
  }

  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = o;

  var n = e(0),
      s = e(11),
      _ = r(s),
      a = e(1),
      h = r(a),
      l = e(3),
      $ = r(l);

  o.prototype = new n.L2DBaseModel(), o.prototype.load = function (t, i, e) {
    this.setUpdating(!0), this.setInitialized(!1), this.modelHomeDir = i.substring(0, i.lastIndexOf("/") + 1), this.modelSetting = new _.default();
    var r = this;
    this.modelSetting.loadModelSetting(i, function () {
      var t = r.modelHomeDir + r.modelSetting.getModelFile();
      r.loadModelData(t, function (t) {
        for (var i = 0; i < r.modelSetting.getTextureNum(); i++) {
          if (/^https?:\/\/|^\/\//i.test(r.modelSetting.getTextureFile(i))) var o = r.modelSetting.getTextureFile(i);else var o = r.modelHomeDir + r.modelSetting.getTextureFile(i);
          r.loadTexture(i, o, function () {
            if (r.isTexLoaded) {
              if (r.modelSetting.getExpressionNum() > 0) {
                r.expressions = {};

                for (var t = 0; t < r.modelSetting.getExpressionNum(); t++) {
                  var i = r.modelSetting.getExpressionName(t),
                      o = r.modelHomeDir + r.modelSetting.getExpressionFile(t);
                  r.loadExpression(i, o);
                }
              } else r.expressionManager = null, r.expressions = {};

              if (r.eyeBlink, null != r.modelSetting.getPhysicsFile() ? r.loadPhysics(r.modelHomeDir + r.modelSetting.getPhysicsFile()) : r.physics = null, null != r.modelSetting.getPoseFile() ? r.loadPose(r.modelHomeDir + r.modelSetting.getPoseFile(), function () {
                r.pose.updateParam(r.live2DModel);
              }) : r.pose = null, null != r.modelSetting.getLayout()) {
                var n = r.modelSetting.getLayout();
                null != n.width && r.modelMatrix.setWidth(n.width), null != n.height && r.modelMatrix.setHeight(n.height), null != n.x && r.modelMatrix.setX(n.x), null != n.y && r.modelMatrix.setY(n.y), null != n.center_x && r.modelMatrix.centerX(n.center_x), null != n.center_y && r.modelMatrix.centerY(n.center_y), null != n.top && r.modelMatrix.top(n.top), null != n.bottom && r.modelMatrix.bottom(n.bottom), null != n.left && r.modelMatrix.left(n.left), null != n.right && r.modelMatrix.right(n.right);
              }

              if (null != r.modelSetting.getHitAreasCustom()) {
                var s = r.modelSetting.getHitAreasCustom();
                null != s.head_x && (h.default.hit_areas_custom_head_x = s.head_x), null != s.head_y && (h.default.hit_areas_custom_head_y = s.head_y), null != s.body_x && (h.default.hit_areas_custom_body_x = s.body_x), null != s.body_y && (h.default.hit_areas_custom_body_y = s.body_y);
              }

              for (var t = 0; t < r.modelSetting.getInitParamNum(); t++) {
                r.live2DModel.setParamFloat(r.modelSetting.getInitParamID(t), r.modelSetting.getInitParamValue(t));
              }

              for (var t = 0; t < r.modelSetting.getInitPartsVisibleNum(); t++) {
                r.live2DModel.setPartsOpacity(r.modelSetting.getInitPartsVisibleID(t), r.modelSetting.getInitPartsVisibleValue(t));
              }

              r.live2DModel.saveParam(), r.preloadMotionGroup(h.default.MOTION_GROUP_IDLE), r.preloadMotionGroup(h.default.MOTION_GROUP_SLEEPY), r.mainMotionManager.stopAllMotions(), r.setUpdating(!1), r.setInitialized(!0), "function" == typeof e && e();
            }
          });
        }
      });
    });
  }, o.prototype.release = function (t) {
    var i = n.Live2DFramework.getPlatformManager();
    t.deleteTexture(i.texture);
  }, o.prototype.preloadMotionGroup = function (t) {
    for (var i = this, e = 0; e < this.modelSetting.getMotionNum(t); e++) {
      var r = this.modelSetting.getMotionFile(t, e);
      this.loadMotion(r, this.modelHomeDir + r, function (r) {
        r.setFadeIn(i.modelSetting.getMotionFadeIn(t, e)), r.setFadeOut(i.modelSetting.getMotionFadeOut(t, e));
      });
    }
  }, o.prototype.update = function () {
    if (null == this.live2DModel) return void (h.default.DEBUG_LOG && console.error("Failed to update."));
    var t = UtSystem.getUserTimeMSec() - this.startTimeMSec,
        i = t / 1e3,
        e = 2 * i * Math.PI;

    if (this.mainMotionManager.isFinished()) {
      "1" === sessionStorage.getItem("Sleepy") ? this.startRandomMotion(h.default.MOTION_GROUP_SLEEPY, h.default.PRIORITY_SLEEPY) : this.startRandomMotion(h.default.MOTION_GROUP_IDLE, h.default.PRIORITY_IDLE);
    }

    this.live2DModel.loadParam(), this.mainMotionManager.updateParam(this.live2DModel) || null != this.eyeBlink && this.eyeBlink.updateParam(this.live2DModel), this.live2DModel.saveParam(), null == this.expressionManager || null == this.expressions || this.expressionManager.isFinished() || this.expressionManager.updateParam(this.live2DModel), this.live2DModel.addToParamFloat("PARAM_ANGLE_X", 30 * this.dragX, 1), this.live2DModel.addToParamFloat("PARAM_ANGLE_Y", 30 * this.dragY, 1), this.live2DModel.addToParamFloat("PARAM_ANGLE_Z", this.dragX * this.dragY * -30, 1), this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X", 10 * this.dragX, 1), this.live2DModel.addToParamFloat("PARAM_EYE_BALL_X", this.dragX, 1), this.live2DModel.addToParamFloat("PARAM_EYE_BALL_Y", this.dragY, 1), this.live2DModel.addToParamFloat("PARAM_ANGLE_X", Number(15 * Math.sin(e / 6.5345)), .5), this.live2DModel.addToParamFloat("PARAM_ANGLE_Y", Number(8 * Math.sin(e / 3.5345)), .5), this.live2DModel.addToParamFloat("PARAM_ANGLE_Z", Number(10 * Math.sin(e / 5.5345)), .5), this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X", Number(4 * Math.sin(e / 15.5345)), .5), this.live2DModel.setParamFloat("PARAM_BREATH", Number(.5 + .5 * Math.sin(e / 3.2345)), 1), null != this.physics && this.physics.updateParam(this.live2DModel), null == this.lipSync && this.live2DModel.setParamFloat("PARAM_MOUTH_OPEN_Y", this.lipSyncValue), null != this.pose && this.pose.updateParam(this.live2DModel), this.live2DModel.update();
  }, o.prototype.setRandomExpression = function () {
    var t = [];

    for (var i in this.expressions) {
      t.push(i);
    }

    var e = parseInt(Math.random() * t.length);
    this.setExpression(t[e]);
  }, o.prototype.startRandomMotion = function (t, i) {
    var e = this.modelSetting.getMotionNum(t),
        r = parseInt(Math.random() * e);
    this.startMotion(t, r, i);
  }, o.prototype.startMotion = function (t, i, e) {
    var r = this.modelSetting.getMotionFile(t, i);
    if (null == r || "" == r) return void (h.default.DEBUG_LOG && console.error("Failed to motion."));
    if (e == h.default.PRIORITY_FORCE) this.mainMotionManager.setReservePriority(e);else if (!this.mainMotionManager.reserveMotion(e)) return void (h.default.DEBUG_LOG && console.log("Motion is running."));
    var o,
        n = this;
    null == this.motions[t] ? this.loadMotion(null, this.modelHomeDir + r, function (r) {
      o = r, n.setFadeInFadeOut(t, i, e, o);
    }) : (o = this.motions[t], n.setFadeInFadeOut(t, i, e, o));
  }, o.prototype.setFadeInFadeOut = function (t, i, e, r) {
    var o = this.modelSetting.getMotionFile(t, i);
    if (r.setFadeIn(this.modelSetting.getMotionFadeIn(t, i)), r.setFadeOut(this.modelSetting.getMotionFadeOut(t, i)), h.default.DEBUG_LOG && console.log("Start motion : " + o), null == this.modelSetting.getMotionSound(t, i)) this.mainMotionManager.startMotionPrio(r, e);else {
      var n = this.modelSetting.getMotionSound(t, i),
          s = document.createElement("audio");
      s.src = this.modelHomeDir + n, h.default.DEBUG_LOG && console.log("Start sound : " + n), s.play(), this.mainMotionManager.startMotionPrio(r, e);
    }
  }, o.prototype.setExpression = function (t) {
    var i = this.expressions[t];
    h.default.DEBUG_LOG && console.log("Expression : " + t), this.expressionManager.startMotion(i, !1);
  }, o.prototype.draw = function (t) {
    $.default.push(), $.default.multMatrix(this.modelMatrix.getArray()), this.tmpMatrix = $.default.getMatrix(), this.live2DModel.setMatrix(this.tmpMatrix), this.live2DModel.draw(), $.default.pop();
  }, o.prototype.hitTest = function (t, i, e) {
    for (var r = this.modelSetting.getHitAreaNum(), o = 0; o < r; o++) {
      if (t == this.modelSetting.getHitAreaName(o)) {
        var n = this.modelSetting.getHitAreaID(o);
        return this.hitTestSimple(n, i, e);
      }
    }

    return !1;
  }, o.prototype.hitTestCustom = function (t, i, e) {
    return "head" == t ? this.hitTestSimpleCustom(h.default.hit_areas_custom_head_x, h.default.hit_areas_custom_head_y, i, e) : "body" == t && this.hitTestSimpleCustom(h.default.hit_areas_custom_body_x, h.default.hit_areas_custom_body_y, i, e);
  };
}, function (t, i, e) {
  "use strict";

  function r() {
    this.NAME = "name", this.ID = "id", this.MODEL = "model", this.TEXTURES = "textures", this.HIT_AREAS = "hit_areas", this.PHYSICS = "physics", this.POSE = "pose", this.EXPRESSIONS = "expressions", this.MOTION_GROUPS = "motions", this.SOUND = "sound", this.FADE_IN = "fade_in", this.FADE_OUT = "fade_out", this.LAYOUT = "layout", this.HIT_AREAS_CUSTOM = "hit_areas_custom", this.INIT_PARAM = "init_param", this.INIT_PARTS_VISIBLE = "init_parts_visible", this.VALUE = "val", this.FILE = "file", this.json = {};
  }

  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = r;
  var o = e(0);
  r.prototype.loadModelSetting = function (t, i) {
    var e = this;
    o.Live2DFramework.getPlatformManager().loadBytes(t, function (t) {
      var r = String.fromCharCode.apply(null, new Uint8Array(t));
      e.json = JSON.parse(r), i();
    });
  }, r.prototype.getTextureFile = function (t) {
    return null == this.json[this.TEXTURES] || null == this.json[this.TEXTURES][t] ? null : this.json[this.TEXTURES][t];
  }, r.prototype.getModelFile = function () {
    return this.json[this.MODEL];
  }, r.prototype.getTextureNum = function () {
    return null == this.json[this.TEXTURES] ? 0 : this.json[this.TEXTURES].length;
  }, r.prototype.getHitAreaNum = function () {
    return null == this.json[this.HIT_AREAS] ? 0 : this.json[this.HIT_AREAS].length;
  }, r.prototype.getHitAreaID = function (t) {
    return null == this.json[this.HIT_AREAS] || null == this.json[this.HIT_AREAS][t] ? null : this.json[this.HIT_AREAS][t][this.ID];
  }, r.prototype.getHitAreaName = function (t) {
    return null == this.json[this.HIT_AREAS] || null == this.json[this.HIT_AREAS][t] ? null : this.json[this.HIT_AREAS][t][this.NAME];
  }, r.prototype.getPhysicsFile = function () {
    return this.json[this.PHYSICS];
  }, r.prototype.getPoseFile = function () {
    return this.json[this.POSE];
  }, r.prototype.getExpressionNum = function () {
    return null == this.json[this.EXPRESSIONS] ? 0 : this.json[this.EXPRESSIONS].length;
  }, r.prototype.getExpressionFile = function (t) {
    return null == this.json[this.EXPRESSIONS] ? null : this.json[this.EXPRESSIONS][t][this.FILE];
  }, r.prototype.getExpressionName = function (t) {
    return null == this.json[this.EXPRESSIONS] ? null : this.json[this.EXPRESSIONS][t][this.NAME];
  }, r.prototype.getLayout = function () {
    return this.json[this.LAYOUT];
  }, r.prototype.getHitAreasCustom = function () {
    return this.json[this.HIT_AREAS_CUSTOM];
  }, r.prototype.getInitParamNum = function () {
    return null == this.json[this.INIT_PARAM] ? 0 : this.json[this.INIT_PARAM].length;
  }, r.prototype.getMotionNum = function (t) {
    return null == this.json[this.MOTION_GROUPS] || null == this.json[this.MOTION_GROUPS][t] ? 0 : this.json[this.MOTION_GROUPS][t].length;
  }, r.prototype.getMotionFile = function (t, i) {
    return null == this.json[this.MOTION_GROUPS] || null == this.json[this.MOTION_GROUPS][t] || null == this.json[this.MOTION_GROUPS][t][i] ? null : this.json[this.MOTION_GROUPS][t][i][this.FILE];
  }, r.prototype.getMotionSound = function (t, i) {
    return null == this.json[this.MOTION_GROUPS] || null == this.json[this.MOTION_GROUPS][t] || null == this.json[this.MOTION_GROUPS][t][i] || null == this.json[this.MOTION_GROUPS][t][i][this.SOUND] ? null : this.json[this.MOTION_GROUPS][t][i][this.SOUND];
  }, r.prototype.getMotionFadeIn = function (t, i) {
    return null == this.json[this.MOTION_GROUPS] || null == this.json[this.MOTION_GROUPS][t] || null == this.json[this.MOTION_GROUPS][t][i] || null == this.json[this.MOTION_GROUPS][t][i][this.FADE_IN] ? 1e3 : this.json[this.MOTION_GROUPS][t][i][this.FADE_IN];
  }, r.prototype.getMotionFadeOut = function (t, i) {
    return null == this.json[this.MOTION_GROUPS] || null == this.json[this.MOTION_GROUPS][t] || null == this.json[this.MOTION_GROUPS][t][i] || null == this.json[this.MOTION_GROUPS][t][i][this.FADE_OUT] ? 1e3 : this.json[this.MOTION_GROUPS][t][i][this.FADE_OUT];
  }, r.prototype.getInitParamID = function (t) {
    return null == this.json[this.INIT_PARAM] || null == this.json[this.INIT_PARAM][t] ? null : this.json[this.INIT_PARAM][t][this.ID];
  }, r.prototype.getInitParamValue = function (t) {
    return null == this.json[this.INIT_PARAM] || null == this.json[this.INIT_PARAM][t] ? NaN : this.json[this.INIT_PARAM][t][this.VALUE];
  }, r.prototype.getInitPartsVisibleNum = function () {
    return null == this.json[this.INIT_PARTS_VISIBLE] ? 0 : this.json[this.INIT_PARTS_VISIBLE].length;
  }, r.prototype.getInitPartsVisibleID = function (t) {
    return null == this.json[this.INIT_PARTS_VISIBLE] || null == this.json[this.INIT_PARTS_VISIBLE][t] ? null : this.json[this.INIT_PARTS_VISIBLE][t][this.ID];
  }, r.prototype.getInitPartsVisibleValue = function (t) {
    return null == this.json[this.INIT_PARTS_VISIBLE] || null == this.json[this.INIT_PARTS_VISIBLE][t] ? NaN : this.json[this.INIT_PARTS_VISIBLE][t][this.VALUE];
  };
}]);
},{}],"xP2E":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModel = initModel;
exports.loadModel = loadModel;

String.prototype.render = function (context) {
  var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
  return this.replace(tokenReg, function (word, slash1, token, slash2) {
    if (slash1 || slash2) {
      return word.replace('\\', '');
    }

    var constiables = token.replace(/\s/g, '').split('.');
    var currentObject = context;
    var i, length, constiable;

    for (i = 0, length = constiables.length; i < length; ++i) {
      constiable = constiables[i];
      currentObject = currentObject[constiable];

      if (currentObject === undefined || currentObject === null) {
        return '';
      }
    }

    return currentObject;
  });
};

var re = /x/;
console.log(re);

re.toString = function () {
  showMessage('发现你打开了控制台，你可能是前端工程师？', 5000, true);
  return '';
};

document.addEventListener('copy', function () {
  showMessage('发现你复制了，好东西记得分享给小伙伴哦', 5000, true);
}); // window.hitokotoTimer = window.setInterval(showHitokoto,30000);

/* 检测用户活动状态，并在空闲时 定时显示一言 */

var getActed = false;
window.hitokotoTimer = 0;
var hitokotoInterval = false;
document.addEventListener('mousemove', function () {
  getActed = true;
});
document.addEventListener('keydown', function () {
  getActed = true;
});
setInterval(function () {
  if (!getActed) {
    ifActed();
  } else {
    elseActed();
  }
}, 1000);

function ifActed() {
  if (!hitokotoInterval) {
    hitokotoInterval = true;
    hitokotoTimer = window.setInterval(showHitokoto, 30000);
  }
}

function elseActed() {
  getActed = hitokotoInterval = false;
  window.clearInterval(hitokotoTimer);
}

function showHitokoto() {
  /* 增加 hitokoto.cn API */
  $.getJSON('https://v1.hitokoto.cn', function (result) {
    var text = '这句一言来自 <span style="color:#0099cc;">『{source}』</span>，是 <span style="color:#0099cc;">{creator}</span> 在 hitokoto.cn 投稿的。';
    text = text.render({
      source: result.from,
      creator: result.creator
    });
    showMessage(result.hitokoto, 5000);
    window.setTimeout(function () {
      showMessage(text, 3000);
    }, 5000);
  });
}

function showMessage(text, timeout, flag) {
  if (flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null) {
    if (Array.isArray(text)) {
      text = text[Math.floor(Math.random() * text.length + 1) - 1];
    } // console.log(text);


    if (flag) {
      sessionStorage.setItem('waifu-text', text);
    }

    $('.waifu-tips').stop();
    $('.waifu-tips').html(text).fadeTo(200, 1);

    if (timeout === undefined) {
      timeout = 5000;
    }

    hideMessage(timeout);
  }
}

function hideMessage(timeout) {
  $('.waifu-tips').stop().css('opacity', 1);

  if (timeout === undefined) {
    timeout = 5000;
  }

  window.setTimeout(function () {
    sessionStorage.removeItem('waifu-text');
  }, timeout);
  $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}

function firstMessage() {
  var text; // const SiteIndexUrl = 'https://www.fghrsh.net/';  // 手动指定主页

  var SiteIndexUrl = "".concat(window.location.protocol, "//").concat(window.location.hostname, "/"); // 自动获取主页

  if (window.location.href == SiteIndexUrl) {
    // 如果是主页
    var now = new Date().getHours();

    if (now > 23 || now <= 5) {
      text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
    } else if (now > 5 && now <= 7) {
      text = '早上好！一日之计在于晨，美好的一天就要开始了';
    } else if (now > 7 && now <= 11) {
      text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
    } else if (now > 11 && now <= 14) {
      text = '中午了，工作了一个上午，现在是午餐时间！';
    } else if (now > 14 && now <= 17) {
      text = '午后很容易犯困呢，今天的运动目标完成了吗？';
    } else if (now > 17 && now <= 19) {
      text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
    } else if (now > 19 && now <= 21) {
      text = '晚上好，今天过得怎么样？';
    } else if (now > 21 && now <= 23) {
      text = '已经这么晚了呀，早点休息吧，晚安~';
    } else {
      text = '嗨~ 快来逗我玩吧！';
    }
  } else {
    if (document.referrer !== '') {
      var referrer = document.createElement('a');
      referrer.href = document.referrer;
      var domain = referrer.hostname.split('.')[1];

      if (window.location.hostname == referrer.hostname) {
        text = "\u6B22\u8FCE\u9605\u8BFB<span style=\"color:#0099cc;\">\u300E".concat(document.title.split(' - ')[0], "\u300F</span>");
      } else if (domain == 'baidu') {
        text = "Hello! \u6765\u81EA \u767E\u5EA6\u641C\u7D22 \u7684\u670B\u53CB<br>\u4F60\u662F\u641C\u7D22 <span style=\"color:#0099cc;\">".concat(referrer.search.split('&wd=')[1].split('&')[0], "</span> \u627E\u5230\u7684\u6211\u5417\uFF1F");
      } else if (domain == 'so') {
        text = "Hello! \u6765\u81EA 360\u641C\u7D22 \u7684\u670B\u53CB<br>\u4F60\u662F\u641C\u7D22 <span style=\"color:#0099cc;\">".concat(referrer.search.split('&q=')[1].split('&')[0], "</span> \u627E\u5230\u7684\u6211\u5417\uFF1F");
      } else if (domain == 'google') {
        text = "Hello! \u6765\u81EA \u8C37\u6B4C\u641C\u7D22 \u7684\u670B\u53CB<br>\u6B22\u8FCE\u9605\u8BFB<span style=\"color:#0099cc;\">\u300E".concat(document.title.split(' - ')[0], "\u300F</span>");
      } else {
        text = "Hello! \u6765\u81EA <span style=\"color:#0099cc;\">".concat(referrer.hostname, "</span> \u7684\u670B\u53CB");
      }
    } else {
      text = "\u6B22\u8FCE\u9605\u8BFB<span style=\"color:#0099cc;\">\u300E".concat(document.title.split(' - ')[0], "\u300F</span>");
    }
  }

  showMessage(text, 6000);
}

function initModel(waifuPath) {
  var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var mid = arguments.length > 2 ? arguments[2] : undefined;

  if (waifuPath === undefined) {
    waifuPath = '';
  }

  var modelId = mid || 3;
  var modelTexturesId = mid === 3 ? 0 : Math.floor(Math.random() * 3);
  loadModel(modelId, modelTexturesId, function () {
    cb();
    firstMessage();
  });
  fetch("".concat(waifuPath, "waifu-tips.json")).then(function (r) {
    r.json().then(function (result) {
      result.click.forEach(function (tips) {
        var filters = document.querySelector(tips.selector);
        document.addEventListener('click', function (e) {
          if (filters === e.target) {
            var text = tips.text;

            if (Array.isArray(tips.text)) {
              text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
            }

            text = text.render({
              text: text
            });
            showMessage(text, 3000);
          }
        });
      });
      result.seasons.forEach(function (tips) {
        var now = new Date();
        var after = tips.date.split('-')[0];
        var before = tips.date.split('-')[1] || after;

        if (after.split('/')[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split('/')[0] && after.split('/')[1] <= now.getDate() && now.getDate() <= before.split('/')[1]) {
          var text = tips.text;

          if (Array.isArray(tips.text)) {
            text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
          }

          text = text.render({
            year: now.getFullYear()
          });
          showMessage(text, 6000, true);
        }
      });
    });
  });
}

function loadModel(modelId, modelTexturesId) {
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  localStorage.setItem('modelId', modelId);

  if (modelTexturesId === undefined) {
    modelTexturesId = 0;
  }

  localStorage.setItem('modelTexturesId', modelTexturesId);
  loadlive2d('live2d', "https://api.fghrsh.net/live2d/get/?id=".concat(modelId, "-").concat(modelTexturesId), console.log('live2d', "\u6A21\u578B ".concat(modelId, "-").concat(modelTexturesId, " \u52A0\u8F7D\u5B8C\u6210")), cb());
}
},{}],"QvaY":[function(require,module,exports) {
"use strict";

var _cursor = _interopRequireDefault(require("./cursor"));

var _preloader = require("./preloader");

var _locomotiveScroll = _interopRequireDefault(require("locomotive-scroll"));

var _menu = _interopRequireDefault(require("./menu"));

require("../live2d/assets/live2d");

var _waifuTips = require("../live2d/assets/waifu-tips");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// menu (<nav> element)
var menuEl = document.querySelector('.menu'); // preload the images set as data attrs in the menu items

(0, _preloader.preloader)('.menu__item').then(function () {
  // initialize the smooth scroll
  var scroll = new _locomotiveScroll.default({
    el: menuEl,
    smooth: true
  }); // initialize custom cursor

  var cursor = new _cursor.default(document.querySelector('.cursor')); // initialize menu

  new _menu.default(menuEl);
});
(0, _waifuTips.initModel)('live2d/assets/');
},{"./cursor":"LMRJ","./preloader":"BeZ8","locomotive-scroll":"ez7q","./menu":"i0CD","../live2d/assets/live2d":"OgpT","../live2d/assets/waifu-tips":"xP2E"}]},{},["QvaY"], null)