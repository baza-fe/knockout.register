import '../../src/';
import Avatar from '../samples/components/avatar';

describe('avatar', () => {
    const body = document.querySelector('body');
    const context = { trigger: ko.observable(true) };

    beforeEach(() => {
        body.innerHTML = `
            <div id="test">
                <!-- ko if: trigger -->
                    <avatar></avatar>
                <!-- /ko -->
            </div>
        `;
    });

    afterEach(() => {
        body.innerHTML = '';
        ko.components.unregister(Avatar.name);
        context.trigger(true);
    });

    it('should create lifecycle methods', () => {
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        const vm = ko.components.querySelector('avatar');

        expect(typeof vm.ref === 'function').toBe(true);
        expect(typeof vm.refs === 'function').toBe(true);
        expect(typeof vm.ready === 'function').toBe(true);
        expect(typeof vm.render === 'function').toBe(true);
        expect(typeof vm.created === 'function').toBe(true);
        expect(typeof vm.dispose === 'function').toBe(true);
    });

    it('should invoke ready', () => {
        Avatar.methods.ready = jasmine.createSpy('ready');
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        expect(Avatar.methods.ready).toHaveBeenCalled();
    });

    it('should invoke created', () => {
        Avatar.methods.created = jasmine.createSpy('created');
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        expect(Avatar.methods.ready).toHaveBeenCalled();
    });

    it('should invoke dispose', () => {
        Avatar.methods.dispose = jasmine.createSpy('dispose');
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        expect(Avatar.methods.dispose).not.toHaveBeenCalled();
        context.trigger(false);
        expect(Avatar.methods.dispose).toHaveBeenCalled();
    });

    it('should render works', () => {
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        const vm = ko.components.querySelector('avatar');

        vm.first = 'foo';
        vm.last = 'bar';
        expect(document.querySelector('.avatar-first').textContent).toBe(Avatar.defaults.first);
        expect(document.querySelector('.avatar-last').textContent).toBe(Avatar.defaults.last);
        vm.render();
        expect(document.querySelector('.avatar-first').textContent).toBe(vm.first);
        expect(document.querySelector('.avatar-last').textContent).toBe(vm.last);
    });

    it('should dispose works', () => {
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        const vm = ko.components.querySelector('avatar');
        const componentInfo = vm.componentInfo;

        expect(vm.componentInfo).toBeDefined();
        expect(vm.componentInfo.element).toBeDefined();
        context.trigger(false);
        expect(vm.componentInfo).toBe(null);
        expect(componentInfo.element).toBe(null);
    });

    it('should lifecycle in correct sequence', () => {
        const order = [];

        Avatar.methods.ready = () => { order.push('ready') };
        Avatar.methods.created = () => { order.push('created') };
        Avatar.methods.dispose = () => { order.push('dispose') };
        ko.components.register(Avatar);
        ko.applyBindings(context, document.querySelector('#test'));
        context.trigger(false);
        expect(order).toEqual([ 'created', 'ready', 'dispose' ]);
    });
});
