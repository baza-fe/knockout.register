import {
    slot,
    isObject,
    isFunction
} from '../util/';

var slotLoader = {
    id: 'slotLoader',
    loadViewModel(name, vmConfig, callback) {
        let ctor = null;
        let originalCreateViewModel = null;

        function wrapperedCreateViewModel(params, componentInfo) {
            slot(componentInfo.templateNodes, componentInfo.element);

            if (ctor) {
                return new ctor(params, componentInfo);
            } else if (originalCreateViewModel) {
                return originalCreateViewModel(params, componentInfo);
            } else {
                return null;
            }
        }

        if (!vmConfig) {
            return callback(null);
        }

        if (vmConfig && (isObject(vmConfig))) {
            if (!vmConfig.createViewModel) {
                return callback(null);
            }

            originalCreateViewModel = vmConfig.createViewModel;
        } else if (isFunction(vmConfig)) {
            ctor = vmConfig;
        }

        callback(wrapperedCreateViewModel);
    }
};

ko.components.loaders.unshift(slotLoader);
