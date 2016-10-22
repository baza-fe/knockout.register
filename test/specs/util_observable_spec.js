import {
    observableArray,
    observableObject
} from '../../src/util/';

const string = 'string';
const number = 1;
const boolean = true;

describe('observableArray', () => {
    it('should create observable array', () => {
        const array = [];
        const result = observableArray(array);

        expect(ko.isObservable(result)).toBe(true);
    });

    it('should create observable properties(object item)', () => {
        const array = [{ string: string }];
        const result = observableArray(array);

        expect(ko.isObservable(result()[0].string)).toBe(true);
        expect(result()[0].string()).toBe(string);
    });

    it('should create observable properties(array item)', () => {
        const array = [[ string ]];
        const result = observableArray(array);

        expect(ko.isObservable(result()[0])).toBe(true);
        expect(result()[0]()[0]).toBe(string);
    });

    it('should not create observable properties', () => {
        const array = [ string, string, string ];
        const result = observableArray(array);

        expect(result()[0]).toBe(string);
        expect(result()[1]).toBe(string);
        expect(result()[2]).toBe(string);
    });

    it('should not create observable properties(observabled object item)', () => {
        const array = [ko.observable({ string: string })];
        const result = observableArray(array);

        expect(ko.isObservable(result()[0])).toBe(true);
        expect(ko.isObservable(result()[0]().string)).toBe(false);
        expect(result()[0]().string).toBe(string);
    });

    it('should not create observable properties(observabled array item)', () => {
        const array = [ko.observableArray([{ string: string }])];
        const result = observableArray(array);

        expect(ko.isObservable(result()[0])).toBe(true);
        expect(ko.isObservable(result()[0]())).toBe(false);
        expect(ko.isObservable(result()[0]()[0])).toBe(false);
        expect(ko.isObservable(result()[0]()[0].string)).toBe(false);
    });
});

describe('observableObject', () => {
    it('should create observable properties', () => {
        const object = { string: string };
        const result = observableObject(object);

        expect(ko.isObservable(result.string)).toBe(true);
        expect(result.string()).toBe(string);
    });

    it('should create observable properties', () => {
        const object = { string: undefined };
        const result = observableObject(object);

        expect(ko.isObservable(result.string)).toBe(true);
        expect(result.string()).toBe(undefined);
    });

    it('should create observable properties(object item)', () => {
        const object = { string: { string: string } };
        const result = observableObject(object);

        expect(ko.isObservable(result.string.string)).toBe(true);
        expect(result.string.string()).toBe(string);
    });

    it('should not create observable properties(array item)', () => {
        const object = { string: [ string ] };
        const result = observableObject(object);

        expect(ko.isObservable(result.string)).toBe(true);
        expect(result.string()[0]).toBe(string);
    });

    it('should not create observable properties(observabled object item)', () => {
        const object = { string: ko.observable({ string: string }) };
        const result = observableObject(object);

        expect(ko.isObservable(result.string)).toBe(true);
        expect(ko.isObservable(result.string().string)).toBe(false);
        expect(result.string().string).toBe(string);
    });

    it('should not create observable properties(observabled array item)', () => {
        const object = { string: ko.observableArray([{ string: string }]) };
        const result = observableObject(object);

        expect(ko.isObservable(result.string)).toBe(true);
        expect(ko.isObservable(result.string()[0].string)).toBe(false);
        expect(result.string()[0].string).toBe(string);
    });
});
