const literalRE = /^(?:true|false|null|NaN|Infinity|[\+\-]?\d?)$/i;

// no-ops function
export function noop() {};

// has own property and not falsy value
export function exist(target, key) {
    return target[key] && target.hasOwnProperty(key);
};

// my-name => myName
export function normalize(name) {
    return name.split(/\-/g).map((word, i) => {
        return i > 0 ? word.charAt(0).toUpperCase() + word.substr(1) : word;
    }).join('');
};

// function type checker
export function isFunction(target) {
    return typeof target === 'function';
};

// string type checker
export function isString(target) {
    return typeof target === 'string';
};

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

// iterate dict with given iterator
//
// @param {Object} dict
// @param {Function} iterator
export function eachDict(dict, iterator) {
    if (!dict) {
        return;
    }

    ko.utils.arrayForEach(Object.keys(dict), (key) => {
        iterator(key, dict[key], dict);
    });
};