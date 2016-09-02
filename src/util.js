import insert from 'insert-css';

const literalRE = /^(?:true|false|null|NaN|Infinity|[\+\-]?\d?)$/i;
const utils = ko.utils;

// no-ops function
export function noop() {};

// empty component template
export const emptyTemplate = '<!-- empty template -->';

// throw error with plugin name
export function throwError(message) {
    throw new Error(`knockout.register: ${message}`);
};

// has own property and not falsy value
export function exist(target, key) {
    return target[key] && target.hasOwnProperty(key);
};

// function type checker
export function isFunction(target) {
    return typeof target === 'function';
};

// string type checker
export function isString(target) {
    return typeof target === 'string';
};

// insert dom stylesheet
export function insertCss() {
    return insert.apply(null, arguments);
};

// my-name => myName
export function normalize(name) {
    return name.split(/\-/g).map((word, i) => {
        return i > 0 ? word.charAt(0).toUpperCase() + word.substr(1) : word;
    }).join('');
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

    utils.arrayForEach(Object.keys(dict), (key) => {
        iterator(key, dict[key], dict);
    });
};

// robust mixin
//
// @param {Object} dest
// @param {Object} opts
// @param {Array|Object} mixins
export function mixin(dest, opts, mixins) {

    // opts is optional
    if (!mixins && opts) {
        mixins = opts;
        opts = null;
    }

    if (mixins && !Array.isArray(mixins)) {
        mixins = [ mixins ];
    }

    if (!mixins || !mixins.length) {
        return dest;
    }

    // cache last opts
    dest.opts = opts = opts || {};

    utils.arrayForEach(mixins, (mixin) => {
        let mixinCopy = null;

        // pre mix
        if (isFunction(mixin.preMix)) {
            mixinCopy = utils.extend({}, mixin);
            mixinCopy.preMix(opts);
        }

        utils.extend(dest, mixinCopy || mixin);

        // post mix
        if (isFunction(mixin.postMix)) {
            mixin.postMix.call(dest, opts);
        }
    });

    delete dest.preMix;
    delete dest.postMix;

    return dest;
};

export function apply(selector, contextNode) {
    if (isString(contextNode)) {
        contextNode = document.querySelector(contextNode);
    }

    const nodes = (contextNode || document).querySelectorAll(selector);

    ko.utils.arrayForEach(nodes, (node) => {
        let bindingStatements = null;
        const bindingAttributes = node.getAttribute('data-bind') || '';

        if (bindingAttributes.indexOf(/\bskip\b\s*:/g) > -1) {
            return;
        }

        ko.applyBindings(null, node);
        bindingStatements = bindingAttributes ? bindingAttributes.split(',') : [];
        bindingStatements.push('skip: true');
        node.setAttribute('data-bind', bindingStatements.join(','));
    });
};