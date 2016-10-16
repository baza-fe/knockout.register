import {
    each,
    eachDict,
    isObject,
    isArray,
    isFunction,
    isString,
    isNumber,
    isBoolean
} from './lang';

// Clone array items and create observable array
//
// @param {Array} target
// @param {Array} data
function observableArray(target, data) {
    each(data, (item, i) => {
        if (ko.isObservable(item)) {
            target.push(item);
        } else {
            if (isObject(item)) {
                target.push(observableObject({}, item));
            } else if (isArray(item)) {
                target.push(observableArray([], item));
            } else {
                target.push(item);
            }
        }
    });

    return ko.observableArray(target);
}

// Clone properties and create observable object
//
// @param {Object} target
// @param {Object} data
function observableObject(target, data) {
    eachDict(data, (key, value) => {
        if (key[0] === '$') {
            return true;
        }

        if (ko.isObservable(value)) {
            target[key] = value;
        } else {
            if (isObject(value)) {
                target[key] = observableObject({}, value);
            } else if (isArray(value)) {
                target[key] = observableArray([], value);
            } else if (isString(value) || isNumber(value) || isBoolean(value)) {
                target[key] = ko.observable(value);
            } else {
                target[key] = value;
            }
        }
    });

    return target;
}

export function observable(target, data) {
    return ko.isObservable(target)
        ? target
        : observableObject(target, data);
};
