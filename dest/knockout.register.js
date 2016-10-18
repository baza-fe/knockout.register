this.knockout = this.knockout || {};
(function () {
'use strict';

var literalRE = /^(?:true|false|null|NaN|Infinity|[\+\-]?\d?)$/i;

// no-ops function
function noop() {}

// has own property
function hasOwn(target, key) {
    return target.hasOwnProperty(key);
}

// has own property and not falsy value
function exist(target, key) {
    return target[key] && hasOwn(target, key);
}

// my-name => myName
function normalize(name) {
    return name.split(/\-/g).map(function (word, i) {
        return i > 0 ? word.charAt(0).toUpperCase() + word.substr(1) : word;
    }).join('');
}

// type checker
function isType(name) {
    return function (real) {
        return Object.prototype.toString.call(real) === '[object ' + name + ']';
    };
}

// type checkers
var isString = isType('String');
var isNumber = isType('Number');
var isBoolean = isType('Boolean');
var isObject = isType('Object');
var isArray = isType('Array');
var isFunction = isType('Function');
var isDate = isType('Date');
var isRegExp = isType('RegExp');

// parse to string to primitive value
//
// "true" => true
// "false" => false
// "null" => null
//
// @param {String} value
// @return {Any}
function toPrimitive(value) {
    if (typeof value !== 'string') {
        return value;
    } else if (value === 'True') {
        return true;
    } else if (value === 'False') {
        return false;
    }

    if (literalRE.test(value)) {
        return new Function('return ' + value)();
    } else {
        return value;
    }
}

// transform array like object to real array
//
// @param {Object} target
// @return {Array}
function toArray(target) {
    var len = target.length;
    var result = [];

    while (len-- > 0) {
        result[len] = target[len];
    }

    return result;
}

// iterate array or array like object
//
// @param {Array|Object} target
// @param {Function} iterator
function each(target, iterator) {
    var i = void 0,
        len = void 0;

    for (i = 0, len = target.length; i < len; i += 1) {
        if (iterator(target[i], i, target) === false) {
            return;
        }
    }
}

// iterate array or array like object and check those items some true
//
// @param {Array|Object} target
// @param {Function} checker
// @return {Boolean}
function some(target, checker) {
    var result = false;

    each(target, function (item, i) {
        if (checker(item, i, target)) {
            result = true;
            return false;
        }
    });

    return result;
}

// iterate array or array like object and check those items all true
//
// @param {Array|Object} target
// @param {Function} checker
// @return {Boolean}
function every(target, checker) {
    if (!target || !target.length) {
        return false;
    }

    var result = true;

    each(target, function (item, i) {
        if (!checker(item, i, target)) {
            result = false;
            return false;
        }
    });

    return result;
}

// iterate dict
//
// @param {Object} dict
// @param {Function} iterator
function eachDict(dict, iterator) {
    if (!dict) {
        return;
    }

    each(Object.keys(dict), function (key) {
        if (iterator(key, dict[key], dict) === false) {
            return;
        }
    });
}

function apply(selector, contextNode) {
    if (isString(contextNode)) {
        contextNode = document.querySelector(contextNode);
    }

    var nodes = (contextNode || document).querySelectorAll(selector);

    ko.utils.arrayForEach(nodes, function (node) {
        var bindingStatements = null;
        var bindingAttributes = node.getAttribute('data-bind') || '';

        if (bindingAttributes.indexOf(/\bskip\b\s*:/g) > -1) {
            return;
        }

        ko.applyBindings(null, node);
        bindingStatements = bindingAttributes ? bindingAttributes.split(',') : [];
        bindingStatements.push('skip: true');
        node.setAttribute('data-bind', bindingStatements.join(','));
    });
}

// extend ko.components
ko.components.apply = ko.components.apply || apply;

// create computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
function computedAll(context, methods) {
    eachDict(methods, function (name, method) {
        context[name] = ko.computed(method, context);
    });
}

// create pure computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
function pureComputedAll(context, methods) {
    eachDict(methods, function (name, method) {
        context[name] = ko.pureComputed(method, context);
    });
}

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;

    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
        elem.textContent = css;
    } else {
        elem.styleSheet.cssText = css;
    }

    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};
});

var insert = interopDefault(index);

// empty component template
var emptyTemplate = '<noscript><!-- empty template --></noscript>';

// throw error with plugin name
//
// @param {String} message
function throwError(message) {
    throw new Error('knockout.register: ' + message);
}

// insert dom stylesheet
function insertCss() {
    return insert.apply(null, arguments);
}

// robust mixin
//
// @param {Object} dest
// @param {Object} opts
// @param {Array|Object} mixins
function mixin(dest, opts, mixins) {

    // opts is optional
    if (!mixins && opts) {
        mixins = opts;
        opts = null;
    }

    if (mixins && !Array.isArray(mixins)) {
        mixins = [mixins];
    }

    if (!mixins || !mixins.length) {
        return dest;
    }

    // cache last opts
    dest.opts = opts = opts || {};

    ko.utils.arrayForEach(mixins, function (mixin) {
        var mixinCopy = null;

        // pre mix
        if (isFunction(mixin.preMix)) {
            mixinCopy = ko.utils.extend({}, mixin);
            mixinCopy.preMix(opts);
        }

        ko.utils.extend(dest, mixinCopy || mixin);

        // post mix
        if (isFunction(mixin.postMix)) {
            mixin.postMix.call(dest, opts);
        }
    });

    delete dest.preMix;
    delete dest.postMix;

    return dest;
}

// extend ko.utils
ko.utils.mixin = ko.utils.mixin || mixin;
ko.utils.insertCss = ko.utils.insertCss || insertCss;

var defaultSpy = document.createComment('spy');

function getVmForNode(node) {
    if (!node) {
        return null;
    }

    var spy = node.lastElementChild || defaultSpy;
    var useDefault = spy === defaultSpy;

    if (useDefault) {
        node.appendChild(spy);
    }

    var vm = ko.dataFor(spy);

    if (useDefault) {
        node.removeChild(spy);
    }

    return vm;
}

// query element by selector
//
// @param {String} selector
// @param {Node} context
function querySelector(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    return getVmForNode(context.querySelector(selector));
}

// query elements by selector
//
// @param {String} selector
// @param {Node} context
function querySelectorAll(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    var nodes = ko.utils.makeArray(context.querySelectorAll(selector));

    return ko.utils.arrayMap(nodes, function (node) {
        return getVmForNode(node);
    });
}

// query element by id
//
// @param {String} selector
// @param {Node} context
function getElementById() {
    return getVmForNode(context.getElementById(selector));
}

// query elements by tag name
//
// @param {String} selector
// @param {Node} context
function getElementsByTagName(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    var nodes = ko.utils.makeArray(context.getElementsByTagName(selector));

    return ko.utils.arrayMap(nodes, function (node) {
        return getVmForNode(node);
    });
}

// query elements by class name
//
// @param {String} selector
// @param {Node} context
function getElementsByClassName(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    var nodes = ko.utils.makeArray(context.getElementsByClassName(selector));

    return ko.utils.arrayMap(nodes, function (node) {
        return getVmForNode(node);
    });
}

// extend ko.components
ko.components.querySelector = querySelector;
ko.components.querySelectorAll = querySelectorAll;
ko.components.getElementById = getElementById;
ko.components.getElementsByTagName = getElementsByTagName;
ko.components.getElementsByClassName = getElementsByClassName;

var hasConsole = !!window.console;

function warn(msg, extra) {
     hasConsole && console.error(msg, extra);
}

function isNode(target, name) {
    var nodeName = target && target.nodeName ? target.nodeName.toLowerCase() : '';

    return nodeName === name;
}

// Pluck dom node from given template
//
// @param {Array|String|Node} tpl
function pluckNodes(tpl) {
    if (isArray(tpl)) {
        return tpl;
    }

    if (isString(tpl)) {
        return ko.utils.parseHtmlFragment(tpl);
    }

    if (tpl.nodeType === Node.ELEMENT_NODE) {
        return [tpl];
    }
}

// Pluck slot node from given node list
//
// @param {Array} nodes
function pluckSlots(nodes) {
    var slots = [];

    each(nodes, function (node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (isNode(node, 'slot')) {
            slots.push(node);
        } else {
            each(node.getElementsByTagName('slot'), function (slot$$1) {
                slots.push(slot$$1);
            });
        }
    });

    return slots;
}

// Pair slots according to name
//
// @param {Array} srcSlots
// @param {Array} destSlots
function matchSlots(srcSlots, destSlots) {
    var slotMaps = {};
    var slotPairs = [];
    var srcSlotsLen = srcSlots.length;

    each(srcSlots.concat(destSlots), function (slot$$1, i) {
        var slotName = slot$$1.getAttribute('name');
        var slotMap = slotMaps[slotName] = slotMaps[slotName] || {
            src: null,
            dest: []
        };

        if (i < srcSlotsLen) {
            slotMap.src = slot$$1;
        } else {
            slotMap.dest.push(slot$$1);
        }
    });

    var slotNames = Object.keys(slotMaps);

    each(slotNames, function (slotName) {
        var slotMap = slotMaps[slotName];

        if (!slotMap.src || !slotMap.dest.length) {
            return;
        }

        each(slotMap.dest, function (destSlot) {
            slotPairs.push({
                name: slotName,
                src: slotMap.src,
                dest: destSlot
            });
        });
    });

    return slotPairs;
}

// Replace dest slot into source slot according to name
//
// @param {Array} srcSlots
// @param {Array} destSlots
function replaceSlot(srcSlot, destSlot) {
    if (srcSlot && destSlot) {
        destSlot.parentNode.replaceChild(srcSlot.cloneNode(true), destSlot);
    } else {
        srcSlot.parentNode.removeChild(srcSlot);
        destSlot.parentNode.removeChild(detSlot);
    }
}

function slot$$1(srcTpl, destTpl) {
    var srcNodes = pluckNodes(srcTpl);
    var destNodes = pluckNodes(destTpl);
    var srcSlots = pluckSlots(srcNodes);
    var destSlots = pluckSlots(destNodes);
    var slotPairs = matchSlots(srcSlots, destSlots);

    each(slotPairs, function (slotPair) {
        replaceSlot(slotPair.src, slotPair.dest);
    });

    return srcNodes;
}

function isBasic(value) {
    return isString(value) || isNumber(value) || isBoolean(value);
}

// Observable array and object items
//
// @param {Array} data
function observableArray$$1(data) {
    each(data, function (item, i) {
        if (ko.isObservable(item)) {
            return true;
        }

        if (isObject(item)) {
            data[i] = observableObject$$1(item);
        } else if (isArray(item)) {
            data[i] = observableArray$$1(item);
        }
    });

    return ko.observableArray(data);
}

// Observable object properties
//
// @param {Object} data
function observableObject$$1(data) {
    eachDict(data, function (propKey, propValue) {
        if (ko.isObservable(propValue)) {
            return true;
        }

        if (isObject(propValue)) {
            data[propKey] = observableObject$$1(propValue);
        } else if (isArray(propValue)) {
            data[propKey] = observableArray$$1(propValue);
        } else if (isBasic(propValue)) {
            data[propKey] = ko.observable(propValue);
        } else {
            data[propKey] = propValue;
        }
    });

    return data;
}

// Link array observable with validators
//
// @param {Function} observable
// @param {Object|Function} validator


// Link object observable with validators
//
// @param {Object} data
// @param {Object} validators
function linkObjectObservable$$1(data, validators) {
    return;
}

// Run validator on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Object|Function} validator
// @return {Boolean}
function validProp$$1(propName, propValue, data, validator) {
    var isWrapped = isObject(validator);
    var isObservable = ko.isObservable(propValue);
    var required = isWrapped ? validator.required : false;
    var defaultValue = isWrapped ? validator.default : undefined;

    var computedPropValue = ko.unwrap(propValue);
    validator = isWrapped ? validator.type : validator;

    if (!isObservable) {
        propValue = propValue === undefined ? defaultValue : propValue;
        computedPropValue = propValue;
    }

    // required
    if (computedPropValue === undefined && required) {
        warn('Invalid prop: Missing required prop: ' + propName, data);
        return false;
    } else if (!validator(computedPropValue)) {
        warn('Invalid prop: key: ' + propName + ', propValue: ' + computedPropValue, data);
        return false;
    } else {
        data[propName] = propValue;
        return true;
    }
}

// Run object validators on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Object} validators
// @return {Boolean}
function validObject$$1(propName, propValue, data, validators) {
    var computedPropValue = ko.unwrap(propValue);
    var resultObject = {};
    var result = every(Object.keys(validators), function (subPropName) {
        var validator = validators[subPropName];
        var subPropValue = computedPropValue ? computedPropValue[subPropName] : undefined;

        if (isFunction(validator) || isObject(validator) && isFunction(validator.type)) {
            return validProp$$1(subPropName, subPropValue, resultObject, validator);
        } else if (isObject(validator) && !hasOwn(validator, 'type')) {
            return validObject$$1(subPropName, subPropValue, resultObject, validator);
        } else if (isArray(validator) || isArray(validator.type)) {
            var subValidator = validator.type ? validator.type : validator;
            var len = subValidator.length;

            // oneOfType
            if (len > 1) {
                return validWithin$$1(subPropName, subPropValue, resultObject, subValidator);

                // arrayOf
            } else {
                return validArray$$1(subPropName, subPropValue, resultObject, subValidator[0]);
            }
        } else {
            warn('Invalid validator: ' + validator, resultObject);
            return false;
        }
    });

    data[propName] = result && ko.isObservable(propValue) ? propValue : resultObject;

    return result;
}

// Run validators on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Array} validators
// @return {Boolean}
function validWithin$$1(propName, propValue, data, validators) {
    var computedPropValue = ko.unwrap(propValue);
    var result = some(validators, function (validator) {
        return validArray$$1(propName, [computedPropValue], {}, validator);
    });

    data[propName] = result ? propValue : null;

    return result;
}

// Run validator on given array prop
//
// @param {String} propName
// @param {Array} propValue
// @param {Object} data
// @param {Object|Array|Function} validator
// @return {Boolean}
function validArray$$1(propName, propValue, data, validator) {
    var computedPropValue = ko.unwrap(propValue);
    var validMethod = void 0;

    if (isFunction(validator) || isObject(validator) && isFunction(validator.type)) {
        validMethod = validProp$$1;
    } else if (isObject(validator) && !hasOwn(validator, 'type')) {
        validMethod = validObject$$1;
    } else if (isArray(validator) || isArray(validator.type)) {
        if (validator.length > 1) {
            validMethod = validWithin$$1;
        } else {
            validMethod = validArray$$1;
        }
    } else {
        warn('Invalid validator: ' + validator, data);
        return false;
    }

    var resultArray = [];
    var result = every(computedPropValue, function (item, i) {
        return validMethod(i, item, resultArray, validator);
    });

    data[propName] = result && ko.isObservable(propValue) ? propValue : resultArray;

    return result;
}

// Create view model according to validators
//
// @param {Object} data
// @param {Object} validators
function observable$$1(data, validators) {
    if (!isObject(data)) {
        warn('Invalid props: ' + data);
        return null;
    } else {
        var validResult = {};

        validObject$$1('data', data, validResult, validators);
        linkObjectObservable$$1(validResult);
        observableObject$$1(validResult, validators);

        return validResult['data'];
    }
}

var slotLoader = {
    id: 'slotLoader',
    loadViewModel: function loadViewModel(name, vmConfig, callback) {
        var ctor = null;
        var originalCreateViewModel = null;

        function wrapperedCreateViewModel(params, componentInfo) {
            slot$$1(componentInfo.templateNodes, componentInfo.element);

            if (ctor) {
                return new ctor(params, componentInfo);
            } else if (originalCreateViewModel) {
                return originalCreateViewModel(params, componentInfo);
            } else {
                return null;
            }
        }

        if (!vmConfig) {
            return callback(null);
        }

        if (vmConfig && isObject(vmConfig)) {
            if (!vmConfig.createViewModel) {
                return callback(null);
            }

            originalCreateViewModel = vmConfig.createViewModel;
        } else if (isFunction(vmConfig)) {
            ctor = vmConfig;
        }

        callback(wrapperedCreateViewModel);
    }
};

ko.components.loaders.unshift(slotLoader);

var manualRenderFlagName = '__manual_render_flag__';
var beginManualRenderTag = document.createComment('ko if: $data.' + manualRenderFlagName);
var beginAfterRenderTag = document.createComment('ko template: { afterRender: ready.bind($data) }');
var endTag = document.createComment('/ko');
var base = {
    ref: function ref(query, context) {
        return ko.components.querySelector(query, context || this.componentInfo.element);
    },
    refs: function refs(query, context) {
        return ko.components.querySelectorAll(query, context || this.componentInfo.element);
    },
    render: function render() {
        this[manualRenderFlagName](false);
        this[manualRenderFlagName](true);
    }
};

var lifeComponentLoader = {
    id: 'lifeComponentLoader',
    loadViewModel: function loadViewModel(name, vmConfig, callback) {
        var originalCreateViewModel = null;

        if (vmConfig && isObject(vmConfig) && isFunction(vmConfig.createViewModel)) {
            originalCreateViewModel = vmConfig.createViewModel;
            vmConfig.createViewModel = function (params, componentInfo) {
                var vm = new originalCreateViewModel(params, componentInfo);

                vm[manualRenderFlagName] = ko.observable(true).extend({ notify: 'always' });
                vm.ready = vm.ready || noop;
                vm.created = vm.created || noop;
                vm.ref = base.ref;
                vm.refs = base.refs;
                vm.render = base.render;
                vm.created();

                return vm;
            };
        }

        callback(null);
    },
    loadTemplate: function loadTemplate(name, templateConfig, callback) {
        ko.components.defaultLoader.loadTemplate(name, templateConfig, function (domNodeArray) {
            domNodeArray.unshift(beginManualRenderTag.cloneNode());
            domNodeArray.push(endTag.cloneNode());
            domNodeArray.push(beginAfterRenderTag.cloneNode());
            domNodeArray.push(endTag.cloneNode());
            callback(domNodeArray);
        });
    }
};

ko.components.loaders.unshift(lifeComponentLoader);

function is(constructor) {
    return function (actual) {
        return actual instanceof constructor;
    };
}

var validators = {

    // basic types run validator immediately
    // true valid
    // false invalid
    String: isString,
    Number: isNumber,
    Boolean: isBoolean,
    Object: isObject,
    Array: isArray,
    Function: isFunction,
    Date: isDate,
    RegExp: isRegExp,
    instanceof: is,
    Node: is(Node),
    Element: is(Element),
    any: function any(actual) {
        return actual !== null && actual !== undefined;
    },
    oneOf: function oneOf() {
        var enums = toArray(arguments);

        return function (actual) {
            return some(enums, function (expected) {
                return actual === expected;
            });
        };
    },


    // combination types not run validator immediately
    // [ ... ] List of validators at least fullfill one validator
    // { ... } Validators in { key: validator } pair all validators need to fullfill

    // Construct shape validators
    //
    // @param {Object} plan
    // @return {Object}
    shape: function shape(plan) {
        return plan;
    },


    // Construct array validators
    //
    // @param {Function} validator
    // @return {Array}
    arrayOf: function arrayOf(validator) {
        return [validator];
    },


    // Construct type validators
    //
    // @param {Function...}
    // @return {Array}
    oneOfType: function oneOfType() {
        return arguments.length > 1 ? toArray(arguments) : arguments[0];
    }
};

ko.types = ko.types || validators;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

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

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var invalidAttrNameRE = /^(?:data-[\w-]+|params|id|class|style)\b/i;
var observableAttrNameRE = /^k-([\w\-]+)/i;
var eventAttrNameRE = /^on-([\w\-]+)/i;
var bindingProvider = new ko.bindingProvider();

function pluckObservableBindingString(nodeName, nodeValue) {
    var result = nodeName.match(observableAttrNameRE);

    return result ? normalize(result[1]) + ':' + nodeValue : '';
}

function pluckEventBindingString(nodeName, nodeValue) {
    var result = nodeName.match(eventAttrNameRE);

    return result ? normalize(result[0]) + ':' + nodeValue : '';
}

function pluckObservableParams(bindingContext, bindingString) {
    return bindingProvider.parseBindingsString(bindingString, bindingContext);
}

function pluckEventParams(bindingContext, bindingString) {
    var i = 0,
        handlerParams = void 0,
        bindingError = void 0;
    var bindingParents = ko.utils.makeArray(bindingContext.$parents);

    if (bindingParents.indexOf(bindingContext.$data) < 0) {
        bindingParents.unshift(bindingContext.$data);
    }

    bindingContext = { $data: null };

    while (bindingContext.$data = bindingParents[i]) {
        i += 1;

        try {
            handlerParams = bindingProvider.parseBindingsString(bindingString, bindingContext);
            bindingError = null;
            break;
        } catch (err) {
            bindingError = err;
        }
    }

    if (bindingError) {
        throw bindingError;
    }

    return handlerParams;
}

function pluck(node) {
    var bindingContext = null;
    var observableBindingStringList = [];
    var eventBindingStringList = [];

    var result = ko.utils.makeArray(node.attributes).reduce(function (params, node) {
        var nodeName = node.nodeName;
        var nodeValue = node.nodeValue;

        if (invalidAttrNameRE.test(nodeName)) {
            return params;
        }

        if (observableAttrNameRE.test(nodeName)) {
            observableBindingStringList.push(pluckObservableBindingString(nodeName, nodeValue));
        } else if (eventAttrNameRE.test(nodeName)) {
            eventBindingStringList.push(pluckEventBindingString(nodeName, nodeValue));
        } else {
            params[normalize(nodeName)] = toPrimitive(nodeValue);
        }

        return params;
    }, {});

    var eventBindingString = '{' + eventBindingStringList.join(',') + '}';
    var observableBindingString = '{' + observableBindingStringList.join(',') + '}';

    if (eventBindingString || observableBindingString) {
        bindingContext = ko.contextFor(node);
    }

    return _extends(result, eventBindingString && pluckEventParams(bindingContext, eventBindingString), observableBindingString && pluckObservableParams(bindingContext, observableBindingString));
}

var modulePolyfill = {
    defaults: {},
    template: emptyTemplate
};

// Transform transiton component module to native component module
//
// @param {Object} module Transiton component module
// @return {Object} Native component module
function transform(module) {
    var _Object$assign = _extends({
        constructor: function constructor() {}
    }, modulePolyfill, module);

    var name = _Object$assign.name;
    var constructor = _Object$assign.constructor;
    var defaults$$1 = _Object$assign.defaults;
    var props = _Object$assign.props;
    var mixins = _Object$assign.mixins;
    var methods = _Object$assign.methods;
    var computed = _Object$assign.computed;
    var pureComputed = _Object$assign.pureComputed;
    var style = _Object$assign.style;
    var template = _Object$assign.template;


    insertCss(module.style);
    _extends(constructor.prototype, methods);

    return {
        viewModel: {
            createViewModel: function createViewModel(params, componentInfo) {
                componentInfo.name = name;

                var opts = _extends({}, defaults$$1, ko.toJS(params), pluck(componentInfo.element));
                var vm = new constructor(opts, componentInfo);

                props && _extends(vm, observable$$1(opts, props));
                mixins && mixin(vm, opts, mixins);
                computed && computedAll(vm, computed);
                pureComputed && pureComputedAll(vm, pureComputed);

                vm.$opts = opts;
                vm.$defaults = defaults$$1;
                vm.$info = vm.componentInfo = componentInfo;

                delete vm.$opts['$raw'];
                delete vm.$defaults['$raw'];

                return vm;
            }
        },
        synchronous: true,
        template: template
    };
}

// Register transition component module
//
// @param {String|Object} module Component name or module
// @param {Object} module Transition component module if first param is component name
function register(module) {
    if (!module) {
        throwError('Component name or module is required.');
    }

    // native component module
    if (isString(module)) {
        return ko.components._register(arguments[0], arguments[1]);
    }

    // standard component module
    var name = module.name;


    if (!exist(module, 'name')) {
        throwError('Component name is required.');
    }

    return ko.components._register(name, transform(module));
}

ko.components._register = ko.components._register || ko.components.register;
ko.components.register = register;

}());
