import '../../src/core/register';

describe('register', () => {
    const module = {
        name: 'my-component',
        constructor() {},
        template: '<div></div>'
    };

    afterEach(() => {
        ko.components.unregister(module.name);
    });

    it('should throw error without name or module', () => {
        expect(() => {
            ko.components.register();
        }).toThrowError('knockout.register: Component name or module is required.');
    });

    it('should throw error without name', () => {
        expect(() => {
            ko.components.register({});
        }).toThrowError('knockout.register: Component name is required.');
    });

    it('should not throw error with SCM', () => {
        expect(() => {
            ko.components.register(module);
        }).not.toThrow();
    });

    it('should not throw error with NCM', () => {
        expect(() => {
            ko.components.register(module.name, {});
        }).not.toThrow();
    });

    it('should register success with SCM', () => {
        ko.components.register(module);
        expect(ko.components.isRegistered(module.name)).toBe(true);
    });

    it('should register success with NCM', () => {
        ko.components.register(module.name, {});
        expect(ko.components.isRegistered(module.name)).toBe(true);
    });
});
