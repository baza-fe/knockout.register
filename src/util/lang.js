const literalRE = /^(?:true|false|null|NaN|Infinity|[\+\-]?\d?)$/i;

// no-ops function
export function noop() {};

// has own property
export function hasOwn(target, key) {
    return target.hasOwnProperty(key);
};

// has own property and not falsy value
export function exist(target, key) {
    return target[key] && hasOwn(target, key);
};

// my-name => myName
export function normalize(name) {
    return name.split(/\-/g).map((word, i) => {
        return i > 0 ? word.charAt(0).toUpperCase() + word.substr(1) : word;
    }).join('');
};

// type checker
export function isType(name) {
    return function (real) {
        return Object.prototype.toString.call(real) === `[object ${name}]`;
    };
};

// type checkers
export const isString = isType('String');
export const isNumber = isType('Number');
export const isBoolean = isType('Boolean');
export const isObject = isType('Object');
export const isArray = isType('Array');
export const isFunction = isType('Function');
export const isDate = isType('Date');
export const isRegExp = isType('RegExp');

// parse to string to primitive value
//
// "true" => true
// "false" => false
// "null" => null
//
// @param {String} value
// @return {Any}
export function toPrimitive(value) {
    if (typeof value !== 'string') {
        return value;
    } else if (value === 'True') {
        return true;
    } else if (value === 'False') {
        return false;
    }

    if (literalRE.test(value)) {
        return new Function(`return ${value}`)();
    } else {
        return value;
    }
};

// transform array like object to real array
//
// @param {Object} target
// @return {Array}
export function toArray(target, start = 0) {
    let i = target.length - start;
    let result = new Array(i);

    while (i--) {
      result[i] = target[i + start];
    }

    return result;
};

// iterate array or array like object
//
// @param {Array|Object} target
// @param {Function} iterator
export function each(target, iterator) {
    let i, len;

    for (i = 0, len = target.length; i < len; i += 1) {
        if (iterator(target[i], i, target) === false) {
            return;
        }
    }
};

// iterate array or array like object and check those items some true
//
// @param {Array|Object} target
// @param {Function} checker
// @return {Boolean}
export function some(target, checker) {
    let result = false;

    each(target, (item, i) => {
        if (checker(item, i, target)) {
            result = true;
            return false;
        }
    });

    return result;
};

// iterate array or array like object and check those items all true
//
// @param {Array|Object} target
// @param {Function} checker
// @return {Boolean}
export function every(target, checker) {
    if (!target || !target.length) {
        return false;
    }

    let result = true;

    each(target, (item, i) => {
        if (!checker(item, i, target)) {
            result = false;
            return false;
        }
    });

    return result;
};

// iterate dict
//
// @param {Object} dict
// @param {Function} iterator
export function eachDict(dict, iterator) {
    if (!dict) {
        return;
    }

    each(Object.keys(dict), (key) => {
        if (iterator(key, dict[key], dict) === false) {
            return;
        }
    });
};

// extend dict
//
// @param {Obejct} target
// @param {Obejct} dict
// @return {Object} target
export function extend(target, dict) {
    if (!dict) {
        return target;
    }

    const keys = Object.keys(dict);
    let i = keys.length;

    while (i--) {
        target[keys[i]] = dict[keys[i]];
    }

    return target;
};
