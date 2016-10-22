import '../../src/';
import Avatar from '../samples/components/avatar';
import List from '../samples/components/list';

describe('list', () => {
    const body = document.querySelector('body');

    beforeAll(() => {
        List.methods.onClick = spyOn(List.methods, 'onClick');

        ko.components.register(Avatar);
        ko.components.register(List);
    });

    afterAll(() => {
        ko.components.unregister(Avatar.name);
        ko.components.unregister(List.name);
    });

    beforeEach(() => {
        body.innerHTML = `
            <div id="test">
                <list></list>
            </div>
        `;
        ko.applyBindings(null, document.querySelector('#test'));
    });

    afterEach(() => {
        body.innerHTML = '';
    });

    it('should transport properties', () => {
        const list = ko.components.querySelector('list');
        const avatars = ko.components.querySelectorAll('avatar');
        const raws = ko.toJS(list.items);
        const avatar0 = avatars[0];
        const avatar1 = avatars[1];
        const avatar2 = avatars[2];

        expect(raws[0].first).toBe(avatar0.first());
        expect(raws[0].last).toBe(avatar0.last());
        expect(raws[1].first).toBe(avatar1.first());
        expect(raws[1].last).toBe(avatar1.last());
        expect(raws[2].first).toBe(avatar2.first());
        expect(raws[2].last).toBe(avatar2.last());
    });

    it('should transport event listener', () => {
        const avatar = ko.components.querySelector('avatar');

        expect(List.methods.onClick).toBe(avatar.$opts.onClick);
    });

    it('should transport primitive properties', () => {
        const avatar = ko.components.querySelector('avatar');

        expect(avatar.$opts.string).toBe('string');
        expect(avatar.$opts.number1).toBe(0);
        expect(avatar.$opts.number2).toBe(1);
        expect(avatar.$opts.boolean1).toBe(true);
        expect(avatar.$opts.boolean2).toBe(false);
        expect(avatar.$opts.boolean3).toBe(true);
        expect(avatar.$opts.boolean4).toBe(false);
    });

    it('should render html correctly', () => {
        const list = ko.components.querySelector('list');
        const raws = ko.toJS(list.items);
        const avatarFirstNodes = document.querySelectorAll('.avatar-first');
        const avatarLastNodes = document.querySelectorAll('.avatar-last');
        const avatarFullNodes = document.querySelectorAll('.avatar-full');
        const avatarFull2Nodes = document.querySelectorAll('.avatar-full2');

        expect(avatarFirstNodes[0].textContent).toBe(raws[0].first);
        expect(avatarFirstNodes[1].textContent).toBe(raws[1].first);
        expect(avatarFirstNodes[2].textContent).toBe(raws[2].first);

        expect(avatarLastNodes[0].textContent).toBe(raws[0].last);
        expect(avatarLastNodes[1].textContent).toBe(raws[1].last);
        expect(avatarLastNodes[2].textContent).toBe(raws[2].last);

        expect(avatarFullNodes[0].textContent).toBe(`${raws[0].first} ${raws[0].last}`);
        expect(avatarFullNodes[1].textContent).toBe(`${raws[1].first} ${raws[1].last}`);
        expect(avatarFullNodes[2].textContent).toBe(`${raws[2].first} ${raws[2].last}`);

        expect(avatarFull2Nodes[0].textContent).toBe(`${raws[0].first} ${raws[0].last}`);
        expect(avatarFull2Nodes[1].textContent).toBe(`${raws[1].first} ${raws[1].last}`);
        expect(avatarFull2Nodes[2].textContent).toBe(`${raws[2].first} ${raws[2].last}`);
    });
});
