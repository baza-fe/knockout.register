import {
    isFunction
} from './index';

function isArrayObservable(target) {
    return ko.isObservable(target) && isFunction(target.push);
}

// Link array observable with validators
//
// @param {Function} observable
// @param {Object|Function} validator
export function linkArrayObservable(observable, validator) {
    return;
};


// Link object observable with validators
//
// @param {Object} data
// @param {Object} validators
export function linkObjectObservable(data, validators) {
    return;
};
