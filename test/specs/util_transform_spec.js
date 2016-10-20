import {
    noop,
    emptyTemplate,
    transform
} from '../../src/util/';

const Component = {
    name: 'component',
    constructor: noop,
    methods: {
        foo: noop,
        bar: noop
    },
    style: 'body { color: red}',
    template: emptyTemplate
};

describe('transform', () => {
    it('should define synchronous', () => {
        expect(transform(Component).synchronous).toBe(true);
    });

    it('should define template', () => {
        expect(transform(Component).template).toBe(Component.template);
    });

    it('should define viewModel', () => {
        const viewModel = transform(Component).viewModel;

        expect(viewModel && typeof viewModel === 'object').toBe(true);
    });

    it('should define viewModel.createViewModel', () => {
        const createViewModel = transform(Component).viewModel.createViewModel;

        expect(createViewModel && typeof createViewModel === 'function').toBe(true);
    });

    it('should define prototype methods', () => {
        const prototype = Component.constructor.prototype;
        const methods = Component.methods;

        transform(Component);

        expect(prototype.foo).toBe(methods.foo);
        expect(prototype.bar).toBe(methods.bar);
    });

    it('should insert css into dom', () => {
        const styleNodes = document.querySelectorAll('style');
        const result = ko.utils.makeArray(styleNodes).some((node) => {
            return node.textContent === Component.style;
        });

        expect(result).toBe(true);
    });
});
