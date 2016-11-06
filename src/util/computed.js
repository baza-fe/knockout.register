import {
    eachDict,
    isFunction
} from './';

// create computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
export function computedAll(context, methods) {
    eachDict(methods, (name, method) => {
        if (!isFunction(method)) {
            return;
        }

        if (ko.isObservable(method)) {
            context[name] = method;
        } else {
            context[name] = ko.computed(method, context);
        }
    });
};

// create pure computed observalbes on context
//
// @param {Object} context
// @param {Object} methods
export function pureComputedAll(context, methods) {
    eachDict(methods, (name, method) => {
        if (!isFunction(method)) {
            return;
        }

        if (ko.isObservable(method)) {
            context[name] = method;
        } else {
            context[name] = ko.pureComputed(method, context);
        }
    });
};
