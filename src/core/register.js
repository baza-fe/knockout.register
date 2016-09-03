import { exist, throwError, isString } from '../util/';
import transform from './transform';

// Register transition component module
//
// @param {String|Object} module Component name or module
// @param {Object} module Transition component module if first param is component name
function register(module) {
    if (!module) {
        throwError('Component name or module is required.');
    }

    // native component module
    if (isString(module)) {
        return ko.components._register(arguments[0], arguments[1]);
    }

    // standard component module
    const { name } = module;

    if (!exist(module, 'name')) {
        throwError('Component name is required.');
    }

    return ko.components._register(name, transform(module));
}

ko.components._register = ko.components._register || ko.components.register;
ko.components.register = register;
