import {
    noop,
    isObject,
    isFunction
} from '../util';

const manualRenderFlagName = '__manual_render_flag__';
const beginManualRenderTag = document.createComment('ko if: $data.' + manualRenderFlagName);
const beginAfterRenderTag = document.createComment('ko template: { afterRender: ready.bind($data) }');
const endTag = document.createComment('/ko');
const base = {
    ref(query, context) {
        return ko.components.querySelector(query, context || this.componentInfo.element);
    },

    refs(query, context) {
        return ko.components.querySelectorAll(query, context || this.componentInfo.element);
    },

    render() {
        this[manualRenderFlagName](false);
        this[manualRenderFlagName](true);
    }
};

const lifeComponentLoader = {
    id: 'lifeComponentLoader',
    loadViewModel(name, vmConfig, callback) {
        let originalCreateViewModel = null;

        if (vmConfig && isObject(vmConfig) && isFunction(vmConfig.createViewModel)) {
            originalCreateViewModel = vmConfig.createViewModel;
            vmConfig.createViewModel = (params, componentInfo) => {
                const vm = new originalCreateViewModel(params, componentInfo);

                vm[manualRenderFlagName] = ko.observable(true).extend({ notify: 'always' });
                vm.ready = vm.ready || noop;
                vm.created = vm.created || noop;
                vm.ref = base.ref;
                vm.refs = base.refs;
                vm.render = base.render;
                vm.created();

                return vm;
            };
        }

        callback(null);
    },
    loadTemplate(name, templateConfig, callback) {
        ko.components.defaultLoader.loadTemplate(name, templateConfig, (domNodeArray) => {
            domNodeArray.unshift(beginManualRenderTag.cloneNode());
            domNodeArray.push(endTag.cloneNode());
            domNodeArray.push(beginAfterRenderTag.cloneNode());
            domNodeArray.push(endTag.cloneNode());
            callback(domNodeArray);
        });
    }
};

ko.components.loaders.unshift(lifeComponentLoader);
