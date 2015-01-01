import {
    each,
    some,
    every,
    eachDict,
    isObject,
    isArray,
    isFunction,
    isString,
    isNumber,
    isBoolean,
    hasOwn,
    warn
} from './index';

function isBasic(value) {
    return isString(value) || isNumber(value) || isBoolean(value);
}

// Observable array and object items
//
// @param {Array} data
export function observableArray(data) {
    each(data, (item, i) => {
        if (ko.isObservable(item)) {
            return true;
        }

        if (isObject(item)) {
            data[i] = observableObject(item);
        } else if (isArray(item)) {
            data[i] = observableArray(item);
        }
    });

    return ko.observableArray(data);
};

// Observable object properties
//
// @param {Object} data
export function observableObject(data) {
    eachDict(data, (propKey, propValue) => {
        if (ko.isObservable(propValue)) {
            return true;
        }

        if (isObject(propValue)) {
            data[propKey] = observableObject(propValue);
        } else if (isArray(propValue)) {
            data[propKey] = observableArray(propValue);
        } else if (isBasic(propValue)) {
            data[propKey] = ko.observable(propValue);
        } else {
            data[propKey] = propValue;
        }
    });

    return data;
};

// Run validator on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Object|Function} validator
// @return {Boolean}
export function validProp(propName, propValue, data, validator) {
    const isWrapped = isObject(validator);
    const isObservable = ko.isObservable(propValue);
    const required = isWrapped ? validator.required : false;
    const defaultValue = isWrapped ? validator.default : undefined;

    let computedPropValue = ko.unwrap(propValue);
    validator = isWrapped ? validator.type : validator;

    if (!isObservable) {
        propValue = propValue === undefined ? defaultValue : propValue;
        computedPropValue = propValue;
    }

    // required
    if (computedPropValue === undefined && required) {
        warn(`Invalid prop: Missing required prop: ${propName}`, data);
        return false;
    } else if (!validator(computedPropValue)) {
        warn(`Invalid prop: key: ${propName}, propValue: ${computedPropValue}`, data);
        return false;
    } else {
        data[propName] = propValue;
        return true;
    }
};

// Run object validators on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Object} validators
// @return {Boolean}
export function validObject(propName, propValue, data, validators) {
    const computedPropValue = ko.unwrap(propValue);
    const resultObject = {};
    const result = every(Object.keys(validators), (subPropName) => {
        const validator = validators[subPropName];
        const subPropValue = computedPropValue ? computedPropValue[subPropName] : undefined;

        if (isFunction(validator) || (isObject(validator) && isFunction(validator.type))) {
            return validProp(
                subPropName,
                subPropValue,
                resultObject,
                validator
            );
        } else if (isObject(validator) && !hasOwn(validator, 'type')) {
            return validObject(
                subPropName,
                subPropValue,
                resultObject,
                validator
            );
        } else if (isArray(validator) || isArray(validator.type)) {
            const subValidator = validator.type ? validator.type : validator;
            const len = subValidator.length;

            // oneOfType
            if (len > 1) {
                return validWithin(
                    subPropName,
                    subPropValue,
                    resultObject,
                    subValidator
                );

            // arrayOf
            } else {
                return validArray(
                    subPropName,
                    subPropValue,
                    resultObject,
                    subValidator[0]
                );
            }
        } else {
            warn(`Invalid validator: ${validator}`, resultObject);
            return false;
        }
    });

    data[propName] = (result && ko.isObservable(propValue))
        ? propValue
        : resultObject;

     return result;
};

// Run validators on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Array} validators
// @return {Boolean}
export function validWithin(propName, propValue, data, validators) {
    const computedPropValue = ko.unwrap(propValue);
    const result = some(validators, (validator) => {
        return validArray(propName, [ computedPropValue ], {}, validator);
    });

    data[propName] = result ? propValue : null;

    return result;
};

// Run validator on given array prop
//
// @param {String} propName
// @param {Array} propValue
// @param {Object} data
// @param {Object|Array|Function} validator
// @return {Boolean}
export function validArray(propName, propValue, data, validator) {
    const computedPropValue = ko.unwrap(propValue);
    let validMethod;

    if (isFunction(validator) || (isObject(validator) && isFunction(validator.type))) {
        validMethod = validProp;
    } else if (isObject(validator) && !hasOwn(validator, 'type')) {
        validMethod = validObject;
    } else if (isArray(validator) || isArray(validator.type)) {
        if (validator.length > 1) {
            validMethod = validWithin;
        } else {
            validMethod = validArray;
        }
    } else {
        warn(`Invalid validator: ${validator}`, data);
        return false;
    }

    const resultArray = [];
    const result = every(computedPropValue, (item, i) => {
        return validMethod(i, item, resultArray, validator);
    });

    data[propName] = (result && ko.isObservable(propValue))
        ? propValue
        : resultArray;

    return result;
};

// Create view model according to validators
//
// @param {Object} data
// @param {Object} validators
export function observable(data, validators) {
    if (!isObject(data)) {
        warn(`Invalid props: ${data}`);
        return null;
    } else {
        const validResult = {};

        validObject('data', data, validResult, validators);
        observableObject(validResult);

        return validResult['data'];
    }
};
