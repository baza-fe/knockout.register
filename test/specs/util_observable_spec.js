import { observable } from '../../src/util/';

const ctor = function () {};
const date = new Date();
const regexp = /\w/img;
const object = {};

describe('observable', () => {
    it('should convert object', () => {
        const target = {};

        observable(target, {
            string: 'string',
            number: 1,
            boolean: true,
            any: 'any'
        });

        expect(ko.isObservable(target.string)).toBe(true);
        expect(ko.isObservable(target.number)).toBe(true);
        expect(ko.isObservable(target.boolean)).toBe(true);
        expect(ko.isObservable(target.any)).toBe(true);

        expect(target.string()).toBe('string');
        expect(target.number()).toBe(1);
        expect(target.boolean()).toBe(true);
        expect(target.any()).toBe('any');
    });

    it('should convert nested object', () => {
        const target = {};

        observable(target, {
            object: {
                object: {
                    string: 'string',
                    number: 1,
                    boolean: true
                }
            }
        });

        expect(ko.isObservable(target.object)).toBe(false);
        expect(ko.isObservable(target.object.object)).toBe(false);

        expect(target.object.object.string()).toBe('string');
        expect(target.object.object.number()).toBe(1);
        expect(target.object.object.boolean()).toBe(true);
    });

    it('should convert array', () => {
        const target = {};

        observable(target, {
            array: [ 0, 1, 2 ]
        });

        expect(ko.isObservable(target.array)).toBe(true);

        expect(target.array()[0]).toBe(0);
        expect(target.array()[1]).toBe(1);
        expect(target.array()[2]).toBe(2);
    });

    it('should convert nested array', () => {
        const target = {};

        observable(target, {
            array: [
                [ 1, 2, 3 ]
            ]
        });

        expect(ko.isObservable(target.array)).toBe(true);
        expect(ko.isObservable(target.array()[0])).toBe(true);

        expect(target.array()[0]()[0]).toBe(1);
        expect(target.array()[0]()[1]).toBe(2);
        expect(target.array()[0]()[2]).toBe(3);
    });

    it('should skip observabled properties', () => {
        const target = {};

        observable(target, {
            string: ko.observable('string'),
            number: ko.observable(1),
            boolean: ko.observable(true),
            any: ko.observable('any')
        });

        expect(target.string()).toBe('string');
        expect(target.number()).toBe(1);
        expect(target.boolean()).toBe(true);
        expect(target.any()).toBe('any');
    });

    it('should skip observabled properties in nested object', () => {
        const target = {};

        observable(target, {
            object: {
                object: ko.observable({
                    string: 'string',
                    number: 1,
                    boolean: true
                })
            }
        });

        expect(target.object.object().string).toBe('string');
        expect(target.object.object().number).toBe(1);
        expect(target.object.object().boolean).toBe(true);
    });

    it('should skip observabled items in nested array', () => {
        const target = {};

        observable(target, {
            array: [
                ko.observableArray([ 1, 2, 3 ])
            ]
        });

        expect(target.array()[0]()[0]).toBe(1);
        expect(target.array()[0]()[1]).toBe(2);
        expect(target.array()[0]()[2]).toBe(3);
    });

    it('should skip knockout properties', () => {
        const target = {};

        observable(target, {
            $raw: {},
            $parent: {},
            $parents: [],
            $data: {},
            $context: {}
        });

        expect(ko.isObservable(target.$raw)).toBe(false);
        expect(ko.isObservable(target.$parent)).toBe(false);
        expect(ko.isObservable(target.$parents)).toBe(false);
        expect(ko.isObservable(target.$data)).toBe(false);
        expect(ko.isObservable(target.$context)).toBe(false);
    });

    it('should skip function and object properties', () => {
        const target = {};

        observable(target, {
            function: ctor,
            object: object,
            regexp: regexp,
            date: date
        });

        expect(ko.isObservable(target.function)).toBe(false);
        expect(ko.isObservable(target.object)).toBe(false);
        expect(ko.isObservable(target.regexp)).toBe(false);
        expect(ko.isObservable(target.date)).toBe(false);

        expect(target.function).toBe(ctor);
        expect(JSON.stringify(target.object)).toBe('{}');
        expect(target.regexp).toBe(regexp);
        expect(target.date).toBe(date);
    });
});
