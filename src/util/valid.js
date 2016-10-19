import {
    some,
    every,
    isObject,
    isArray,
    isFunction,
    hasOwn,
    warn,
    error
} from './index';

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

    const isUndefined = computedPropValue === undefined;

    // required
    if (isUndefined && required) {
        error(`Invalid prop: Missing required prop: ${propName}`, data);
        return false;
    } else if (!isUndefined && !validator(computedPropValue)) {
        error(`Invalid prop: key: ${propName}, propValue: ${computedPropValue}`, data);
        return false;
    } else if (isUndefined) {
        warn(`Invalid prop: key: ${propName}, propValue: ${computedPropValue}`, data);
        data[propName] = undefined;
        return true;
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
            error(`Invalid validator: ${validator}`, resultObject);
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
        error(`Invalid validator: ${validator}`, data);
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

// Run validators
//
// @param {Object} data
// @param {Object} validators
export function valid(data, validators) {
    if (!isObject(data) || data === null) {
        error(`Invalid props: ${data}`);
        return null;
    } else {
        const validData = {};

        validObject('data', data, validData, validators);

        return validData['data'];
    }
};
