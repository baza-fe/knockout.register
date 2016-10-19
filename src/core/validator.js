import {
    some,
    noop,
    toArray,
    eachDict,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    isFunction,
    isDate,
    isRegExp,
    hasOwn
} from '../util/';

function is(constructor) {
    return (actual) => {
        return actual instanceof constructor;
    };
}

function isRequired(validator, defaultValue) {
    return (required = false) => {
        return {
            type: validator,
            default: defaultValue,
            required: required
        };
    };
}

const isNode = is(Node);
const isElement = is(Element);

const validators = {

    // basic type validators
    String: isString,
    Number: isNumber,
    Boolean: isBoolean,
    Object: isObject,
    Array: isArray,
    Function: isFunction,
    Date: isDate,
    RegExp: isRegExp,
    Node: isNode,
    Element: isElement,

    // basic type validators with default value
    string: { type: isString, default: '' },
    number: { type: isNumber, default: 0 },
    boolean: { type: isBoolean, default: false },
    object: { type: isObject, default: {} },
    array: { type: isArray, default: [] },
    function: { type: isFunction, default: noop },
    date: { type: isDate, default: new Date() },
    regexp: { type: isRegExp, default: null },
    node: { type: isNode, default: null },
    element: { type: isElement, default: null },

    // basic type advance validators
    instanceof: is,
    any(actual) {
        return actual !== null && actual !== undefined;
    },
    oneOf() {
        const enums = toArray(arguments);

        return (actual) => {
            return some(enums, (expected) => {
                return actual === expected;
            });
        };
    },

    // combination type validators
    // => [ ... ] List of validators at least fullfill one validator
    // => { ... } Validators in { key: validator } pair all validators need to fullfill

    // Construct shape validators
    //
    // @param {Object} plan
    // @return {Object}
    shape(plan) {
        return plan;
    },

    // Construct array validators
    //
    // @param {Function} validator
    // @return {Array}
    arrayOf(validator) {
        return [ validator ];
    },

    // Construct type validators
    //
    // @param {Function...}
    // @return {Array}
    oneOfType() {
        return arguments.length > 1 ? toArray(arguments) : arguments[0];
    }
};

ko.types = ko.types || validators;
