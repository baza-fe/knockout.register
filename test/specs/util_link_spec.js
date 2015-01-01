import {
    linkedLabel,
    unlinkMethodLabel,
    linkObjectObservable,
    linkArrayObservable
} from '../../src/util/link';

beforeAll(() => {
    console._error = console.error;
    console.error = () => {};
});

afterAll(() => {
    console.error = console._error;
});

const stringValidator = ko.types.arrayOf(
    ko.types.String
);

const string1 = 'string1';
const string2 = 'string2';
const string3 = 'string3';
const number1 = 1;
const number2 = 2;
const number3 = 3;

describe('linkArrayObservable', () => {
    it('should create unlink method', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0])
        expect(ob[unlinkMethodLabel]).toBeDefined();
    });

    it('should remove unlink method', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob[unlinkMethodLabel]();

        expect(ob[unlinkMethodLabel]).toBeUndefined();
    });

    it('should create tag', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        expect(ob[linkedLabel]).toBeDefined();
    });

    it('should remove tag', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob[unlinkMethodLabel]();

        expect(ob[linkedLabel]).toBeUndefined();
    });

    it('should link works', () => {
        const ob = ko.observableArray([]);
        const originPush = ob.push;
        const originUnshift = ob.unshift;
        const originSplice = ob.splice;

        linkArrayObservable(ob, stringValidator[0]);

        expect(ob.push).not.toBe(originPush);
        expect(ob.unshift).not.toBe(originUnshift);
        expect(ob.splice).not.toBe(originSplice);
    });

    it('should unlink works', () => {
        const ob = ko.observableArray([]);
        const originPush = ob.push;
        const originUnshift = ob.unshift;
        const originSplice = ob.splice;

        linkArrayObservable(ob, stringValidator[0]);
        ob[unlinkMethodLabel]();

        expect(ob.push).toBe(originPush);
        expect(ob.unshift).toBe(originUnshift);
        expect(ob.splice).toBe(originSplice);
    });
});

describe('linkArrayObservable.push', () => {
    it('should works', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.push(string1);
        ob.push(string2);
        ob.push(string3);

        expect(ob()[0]).toBe(string1);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string3);
    });

    it('should log error: Invalid prop', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        spyOn(console, 'error');
        ob.push(number1);
        ob.push(number2);
        ob.push(number3);

        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 1', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 2', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 3', []);
    });

    it('should ignore invalid items', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.push(number1);
        ob.push(number2);
        ob.push(number3);
        ob.push(string1);
        ob.push(string2);
        ob.push(string3);

        expect(ob()[0]).toBe(string1);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string3);
    });
});

describe('linkArrayObservable.unshift', () => {
    it('should works', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.unshift(string1);
        ob.unshift(string2);
        ob.unshift(string3);

        expect(ob()[0]).toBe(string3);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string1);
    });

    it('should log error: Invalid prop', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        spyOn(console, 'error');
        ob.unshift(number1);
        ob.unshift(number2);
        ob.unshift(number3);

        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 1', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 2', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 3', []);
    });

    it('should ignore invalid items', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.unshift(number1);
        ob.unshift(number2);
        ob.unshift(number3);
        ob.unshift(string1);
        ob.unshift(string2);
        ob.unshift(string3);

        expect(ob()[0]).toBe(string3);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string1);
    });
});

describe('linkArrayObservable.splice', () => {
    it('should works', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.splice(0, 0, string1, string2, string3);

        expect(ob()[0]).toBe(string1);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string3);
    });

    it('should log error: Invalid prop', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        spyOn(console, 'error');
        ob.splice(0, 0, number1);
        ob.splice(0, 0, number2);
        ob.splice(0, 0, number3);

        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 1', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 2', []);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 3', []);
    });

    it('should ignore invalid items', () => {
        const ob = ko.observableArray([]);

        linkArrayObservable(ob, stringValidator[0]);
        ob.splice(0, 0, number1);
        ob.splice(0, 0, number2);
        ob.splice(0, 0, number3);
        ob.splice(0, 0, string1);
        ob.splice(0, 0, string2);
        ob.splice(0, 0, string3);

        expect(ob()[0]).toBe(string3);
        expect(ob()[1]).toBe(string2);
        expect(ob()[2]).toBe(string1);
    });
});

describe('linkObjectObservable', () => {
    it('should link observabled array property', () => {

    });

    it('should link nested observabled array property', () => {

    });
});
