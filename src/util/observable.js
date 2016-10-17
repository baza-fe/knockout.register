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

// Clone array items and create observable array
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
}

// Clone properties and create observable object
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
}

// Run validator on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Object|Function} validator
// @return {Boolean}
export function validProp(propName, propValue, data, validator) {
    const isWrapped = isObject(validator);
    const required = isWrapped ? validator.required : false;
    const defaultValue = isWrapped ? validator.default : undefined;

    validator = isWrapped ? validator.type : validator;
    propValue = ko.unwrap(propValue);
    propValue = propValue === undefined ? defaultValue : propValue;

    // required
    if (propValue === undefined && required) {
        warn(`Invalid prop: Missing required prop: ${propName}`, data);
        return false;
    } else if (!validator(propValue)) {
        warn(`Invalid prop: key: ${propName}, propValue: ${propValue}`, data);
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
export function validObject(propName, propValue, data, validators) {
    propValue = ko.unwrap(propValue);
    data = data[propName] = {};

    return every(Object.keys(validators), (subPropName) => {
        const validator = validators[subPropName];
        const subPropValue = propValue ? propValue[subPropName] : undefined;

        if (isFunction(validator) || (isObject(validator) && hasOwn(validator, 'type'))) {
            return validProp(
                subPropName,
                subPropValue,
                data,
                validator
            );
        } else if (isObject(validator)) {
            data[subPropName] = {};

            return validObject(
                subPropName,
                subPropValue,
                data[subPropName],
                validator
            );
        } else if (isArray(validator)) {
            const len = validator.length;

            // oneOfType
            if (len > 1) {
                return validWithin(
                    subPropName,
                    subPropValue,
                    data,
                    validator
                );

            // arrayOf
            } else {
                data[subPropName] = [];

                return validArray(
                    subPropName,
                    subPropValue,
                    data[subPropName],
                    validator[0]
                );
            }
        } else {
            warn(`Invalid validator: ${validator}`, data);
            return false;
        }
    });
};

// Run validators on given prop
//
// @param {String} propName
// @param {Any} propValue
// @param {Object} data
// @param {Array} validators
// @return {Boolean}
export function validWithin(propName, propValue, data, validators) {
    propValue = ko.unwrap(propValue);

    return some(validators, (validator) => {
        return validArray(propName, [ propValue ], [], validator);
    }) ? (data[propName] = propValue) !== undefined : false;
};

// Run validator on given array prop
//
// @param {String} propName
// @param {Array} propValue
// @param {Array} data
// @param {Object|Array|Function} validator
// @return {Boolean}
export function validArray(propName, propValue, data, validator) {
    let validMethod;
    let useValidArray = false;

    if (isFunction(validator) || (isObject(validator) && hasOwn(validator, 'type'))) {
        validMethod = validProp;
    } else if (isObject(validator)) {
        validMethod = validObject;
    } else if (isArray(validator)) {
        if (validator.length > 1) {
            validMethod = validWithin;
        } else {
            validMethod = validArray;
            useValidArray = true;
        }
    } else {
        warn(`Invalid validator: ${validator}`, data);
        return false;
    }

    propValue = ko.unwrap(propValue);

    return every(propValue, (item, i) => {
        const validResult = useValidArray ? [] : {};

        return validMethod(i, item, validResult, validator)
            ? data.push(useValidArray ? validResult : validResult[i]) !== undefined
            : false;
    });
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
