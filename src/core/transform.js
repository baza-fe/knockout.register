import pluck from './pluck';
import {
    ref,
    refs,
    noop,
    mixin,
    insertCss,
    emptyTemplate,
    computedAll,
    pureComputedAll
} from '../util/';

const modulePolyfill = {
    constructor: noop,
    defaults: {},
    template: emptyTemplate
};

// Transform transiton component module to native component module
//
// @param {Object} module Transiton component module
// @return {Object} Native component module
function transform(module) {
    const {
        constructor,
        defaults,
        mixins,
        methods,
        computed,
        pureComputed,
        style,
        template
    } = Object.assign({}, modulePolyfill, module);

    insertCss(module.style);
    Object.assign(constructor.prototype, {
        ref,
        refs,
        ready: noop
    }, methods);

    return {
        viewModel: {
            createViewModel(params, componentInfo) {
                const opts = Object.assign(
                    defaults,
                    ko.toJS(params),
                    pluck(componentInfo.element)
                );
                const vm = new constructor(opts, componentInfo);

                mixins && mixin(vm, opts, mixins)
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
