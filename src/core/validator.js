import {
    some,
    every,
    toArray,
    eachDict,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    isFunction,
    isDate,
    isRegExp
} from '../util/';

function is(constructor) {
    return function (real) {
        return real instanceof constructor;
    };
}

const validators = {
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

    any(real) {
        return real !== null && real !== undefined;
    },

    shape(plan) {
        return function (real) {
            if (!isObject(real)) {
                return false;
            }

            const result = every(Object.keys(real), (key) => {
                return plan[key](real[key]);
            });

            return result;
        };
    },

    oneOf() {
        const emnus = toArray(arguments);

        return function (real) {
            return some(emnus, (expected) => {
                return real === expected;
            });
        };
    },

    oneOfType() {
        const validators = toArray(arguments);

        return function (real) {
            return some(validators, (validator) => {
                return validator(real);
            });
        };
    }
};

ko.types = ko.types || validators;
