import { eachDict } from './lang';

// create computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
export function computedAll(context, methods) {
    eachDict(methods, (name, method) => {
        context[name] = ko.computed(method, context);
    });
};

// create pure computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
export function pureComputedAll(context, methods) {
    eachDict(methods, (name, method) => {
        context[name] = ko.pureComputed(method, context);
    });
};