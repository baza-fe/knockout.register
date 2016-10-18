import pluck from './pluck';
import {
    noop,
    mixin,
    observable,
    insertCss,
    emptyTemplate,
    computedAll,
    pureComputedAll
} from '../util/';

const modulePolyfill = {
    defaults: {},
    template: emptyTemplate
};

// Transform transiton component module to native component module
//
// @param {Object} module Transiton component module
// @return {Object} Native component module
function transform(module) {
    const {
        name,
        constructor,
        defaults,
        props,
        mixins,
        methods,
        computed,
        pureComputed,
        style,
        template
    } = Object.assign({
        constructor: function() {}
    }, modulePolyfill, module);

    insertCss(module.style);
    Object.assign(constructor.prototype, methods);

    return {
        viewModel: {
            createViewModel(params, componentInfo) {
                componentInfo.name = name;

                const opts = Object.assign(
                    {},
                    defaults,
                    ko.toJS(params),
                    pluck(componentInfo.element)
                );
                const vm = new constructor(opts, componentInfo);

                props && Object.assign(vm, observable(opts, props));
                mixins && mixin(vm, opts, mixins);
                computed && computedAll(vm, computed);
                pureComputed && pureComputedAll(vm, pureComputed);

                vm.$opts = opts;
                vm.$defaults = defaults;
                vm.$info = vm.componentInfo = componentInfo;

                delete vm.$opts['$raw'];
                delete vm.$defaults['$raw'];

                return vm;
            }
        },
        synchronous: true,
        template
    };
}

export default transform;
