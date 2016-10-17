import {
    some,
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

const validators = {

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

    // combination types not run validator immediately
    // [ ... ] List of validators at least fullfill one validator
    // { ... } Validators in { key: validator } pair all validators need to fullfill

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
