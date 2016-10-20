import {
    some,
    noop,
    toArray,
    each,
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

ko.types = ko.types || {

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
        const validator = (actual) => {
            return some(enums, (expected) => {
                return actual === expected;
            });
        };

        // for define validator name
        validator.__type_name = 'ko.types.oneOf';

        return validator;
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

let buildInValidators = Object.keys(ko.types);

// Get validator
//
// @param {Any} validator
// @return {ANy}
export function defineValidator(validator) {
    return (isObject(validator) && hasOwn(validator, 'type'))
        ? validator.type
        : validator;
}

// Get validator name
//
// @param {Any} validator
// @return {String}
export function defineValidatorName(validator) {
    let name = '';
    let computedValidator = defineValidator(validator);

    if (isArray(computedValidator)) {
        name = computedValidator.length === 1 ? 'arrayOf' : 'oneOfType';
    } else if (isObject(computedValidator)) {
        name = 'shape';
    } else {
        each(buildInValidators, (key) => {
            if (validator === ko.types[key]) {
                name = key;
                return false;
            }
        });
    }

    return name
        ? `ko.types.${name}`
        : (isFunction(validator)
            ? (validator.__type_name || validator.name || 'custom')
            : validator
        );
};
