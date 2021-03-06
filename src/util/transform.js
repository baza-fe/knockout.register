import {
    mixin,
    pluck,
    extend,
    valid,
    linkObjectObservable,
    observableObject,
    insertCss,
    emptyTemplate,
    computedAll,
    pureComputedAll
} from './'

const modulePolyfill = {
  defaults: {},
  template: emptyTemplate
}

// Transform transiton component module to native component module
//
// @param {Object} module Transiton component module
// @return {Object} Native component module
export function transform (module) {
  let finalModule = { constructor: function () {} }

  extend(finalModule, modulePolyfill)
  extend(finalModule, module)

  const {
        name,
        constructor,
        defaults,
        props,
        getters,
        mixins,
        methods,
        computed,
        pureComputed,
        template
    } = finalModule

  insertCss(module.style)
  extend(constructor.prototype, methods)

  return {
    viewModel: {
      createViewModel (params, componentInfo) {
        componentInfo.name = name

        let opts = {}

        extend(opts, defaults)
        extend(opts, ko.toJS(params))
        extend(opts, pluck(componentInfo.element))

        const vm = new constructor(opts, componentInfo)

        if (props) {
          let validOpts = valid(opts, props)
          observableObject(validOpts)
          linkObjectObservable(validOpts, props)
          extend(vm, validOpts)
        }

        mixins && mixin(vm, opts, mixins)
        getters && computedAll(vm, getters)
        computed && computedAll(vm, computed)
        pureComputed && pureComputedAll(vm, pureComputed)

        vm.$opts = opts
        vm.$defaults = defaults
        vm.$info = vm.componentInfo = componentInfo

        delete vm.$opts['$raw']
        delete vm.$defaults['$raw']

        return vm
      }
    },
    synchronous: true,
    template
  }
};
