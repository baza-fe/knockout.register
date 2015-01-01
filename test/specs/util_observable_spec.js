import {
    isObject,
    observableArray,
    observableObject,
    validProp,
    validObject,
    validWithin,
    validArray,
    observable
} from '../../src/util/';

const string = 'string';
const number = 1;
const boolean = true;

beforeEach(() => {
    console._error = console.error;
    console.error = () => {};
});

afterEach(() => {
    console.error = console._error;
});

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

    it('should create observable properties(object item)', () => {
        const object = { string: { string: string } };
        const result = observableObject(object);

        expect(ko.isObservable(result.string.string)).toBe(true);
        expect(result.string.string()).toBe(string);
    });

    it('should create observable properties(array item)', () => {
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

describe('validProp', () => {
    it('should return true', () => {
        expect(validProp(string, string, {}, ko.types.String)).toBe(true);
    });

    it('should return false', () => {
        expect(validProp(string, number, {}, ko.types.String)).toBe(false);
    });

    it('should create prop', () => {
        const data = {};

        validProp(string, string, data, ko.types.String);
        expect(data[string]).toBe(string);
    });

    it('should create prop with default', () => {
        const data = {};

        validProp(string, undefined, data, { type: ko.types.String, default: string });
        expect(data[string]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable(string);

        validProp(string, ob, data, { type: ko.types.String });
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable(1);

        spyOn(console, 'error');
        validProp(string, ob, data, { type: ko.types.String });
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, propValue: 1', data);
    });

    it('should log error: Invalid prop', () => {
        const data = {};

        spyOn(console, 'error');
        expect(validProp(string, number, data, { type: ko.types.String })).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, propValue: 1', data);
    });

    it('should log error: Missing required prop', () => {
        console.error = (err) => {
            expect(err).toBe('Invalid prop: Missing required prop: string');
        };
        expect(validProp(string, undefined, {}, { type: ko.types.String, required: true })).toBe(false);
    });
});

describe('validObject', () => {
    const shape = ko.types.shape({
        p1: ko.types.String,
        p2: ko.types.String
    });

    it('should return true', () => {
        expect(validObject(string, { p1: string, p2: string }, {}, shape)).toBe(true);
    });

    it('should return false', () => {
        expect(validObject(string, { p1: number, p2: number }, {}, shape)).toBe(false);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable({ p1: string, p2: string });

        validObject(string, ob, data, shape);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable({ p1: number, p2: number });

        spyOn(console, 'error');
        validObject(string, ob, data, shape);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: p1, propValue: 1', data.string);
    });
});

describe('validWithin', () => {
    const oneOfType = ko.types.oneOfType(
        ko.types.String,
        ko.types.Number,
        ko.types.Boolean
    );

    it('should return true', () => {
        expect(validWithin(string, string, {}, oneOfType)).toBe(true);
        expect(validWithin(string, number, {}, oneOfType)).toBe(true);
        expect(validWithin(string, boolean, {}, oneOfType)).toBe(true);
    });

    it('should return false', () => {
        expect(validWithin(string, string, {}, [])).toBe(false);
        expect(validWithin(string, number, {}, [])).toBe(false);
        expect(validWithin(string, boolean, {}, [])).toBe(false);
    });

    it('should create prop', () => {
        const data = {};

        validWithin(string, string, data, oneOfType);
        expect(data[string]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable(string);

        validWithin(string, ob, data, oneOfType);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable(null);

        spyOn(console, 'error');
        validWithin(string, ob, data, oneOfType);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: null', []);
    });
});

describe('validArray', () => {
    const arrayOfString = ko.types.arrayOf(ko.types.String);
    const arrayOfShape = ko.types.arrayOf(ko.types.shape({
        p1: ko.types.String,
        p2: ko.types.String
    }));

    it('should return true', () => {
        expect(validArray(string, [ string, string, string ], {}, arrayOfString[0])).toBe(true);
        expect(validArray(string, [
            {
                p1: string,
                p2: string
            },
            {
                p1: string,
                p2: string
            },
            {
                p1: string,
                p2: string
            }
        ], {}, arrayOfShape[0])).toBe(true);
    });

    it('should return false', () => {
        expect(validArray(string, [ number, number, number ], {}, arrayOfString[0])).toBe(false);
        expect(validArray(string, [
            {
                p1: number,
                p2: number
            },
            {
                p1: number,
                p2: number
            },
            {
                p1: number,
                p2: number
            }
        ], {}, arrayOfShape[0])).toBe(false);
    });

    it('should create items', () => {
        const data = {};

        validArray(string, [ string, string, string ], data, arrayOfString[0]);
        expect(data[string][0]).toBe(string);
        expect(data[string][1]).toBe(string);
        expect(data[string][2]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observableArray([ string, string, string ]);

        validArray(string, ob, data, arrayOfString[0]);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observableArray([ number, number, number ]);

        spyOn(console, 'error');
        validArray(string, ob, data, arrayOfString[0]);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 1', data.string);
    });
});

describe('observable', () => {
    it('should return null', () => {
        expect(observable()).toBe(null);
        expect(observable(null, {})).toBe(null);
    });

    it('should return object', () => {
        const result = observable({ string: string }, { string: ko.types.String });

        expect(isObject(result)).toBe(true);
    });

    it('should return observabled object', () => {
        const result = observable({ string: string }, { string: ko.types.String });

        expect(ko.isObservable(result.string)).toBe(true);
    });

    it('should log error: Invalid props', () => {
        console.error = (err) => {
            expect(err).toBe('Invalid props: null');
        };
        observable(null, {});
    });
});
